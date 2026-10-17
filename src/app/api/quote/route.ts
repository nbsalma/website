import { NextResponse } from "next/server";
import { Resend } from "resend";
import { getSupabaseAdmin, QUOTE_BUCKET } from "@/lib/supabase";
import { getQuoteSettings } from "@/lib/content";
import { ALLOWED_FILE_TYPES, MAX_FILE_BYTES, makeReference, quoteSchema, UNIT_LABELS, type QuoteInput } from "@/lib/quote";

export const runtime = "nodejs";

// Very small per-instance rate limit: 5 requests / 10 minutes per IP.
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60 * 1000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

const escape = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function emailHtml(q: QuoteInput, reference: string, fileUrl?: string) {
  const rows: [string, string][] = [
    ["Reference", reference],
    ["Material", q.material],
    ["Grade / spec", q.grade || "—"],
    ["Quantity", `${q.quantity} ${UNIT_LABELS[q.unit]}`],
    ["Destination", [q.port, q.country].filter(Boolean).join(", ")],
    ["Order type", q.orderType],
    ["Required by", q.requiredBy || "—"],
    ["Company", q.company],
    ["Name", q.name],
    ["Email", q.email],
    ["Phone / WhatsApp", q.phone],
    ["Language", q.locale],
    ["Notes", q.notes || "—"],
  ];
  if (fileUrl) rows.push(["Attachment", fileUrl]);
  return `<h2 style="font-family:Arial,sans-serif">New quote request ${escape(reference)}</h2>
<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">
${rows.map(([k, v]) => `<tr><td style="color:#5f6368;border-bottom:1px solid #eee"><b>${escape(k)}</b></td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${escape(v)}</td></tr>`).join("")}
</table>`;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }

  // Honeypot: bots fill hidden fields. Pretend success, store nothing.
  if (String(form.get("website") ?? "").length > 0) {
    return NextResponse.json({ reference: makeReference() });
  }

  const raw = Object.fromEntries(Array.from(form.entries()).filter(([, v]) => typeof v === "string"));
  const parsed = quoteSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? "invalid"]));
    return NextResponse.json({ error: "invalid", fieldErrors }, { status: 422 });
  }
  const q = parsed.data;

  const fileEntry = form.get("file");
  const file = fileEntry instanceof File && fileEntry.size > 0 ? fileEntry : null;
  if (file && (file.size > MAX_FILE_BYTES || !ALLOWED_FILE_TYPES.includes(file.type))) {
    return NextResponse.json({ error: "invalid", fieldErrors: { file: "invalid_file" } }, { status: 422 });
  }

  const reference = makeReference();
  const supabase = getSupabaseAdmin();
  const resendKey = process.env.RESEND_API_KEY;
  const settings = await getQuoteSettings();
  const salesTo = settings.recipients.join(",");

  if (!supabase && !(resendKey && salesTo)) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[quote] Supabase/Resend not configured — request logged only:", reference, q);
      return NextResponse.json({ reference, dev: true });
    }
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  let filePath: string | null = null;
  let fileUrl: string | undefined;

  try {
    if (supabase) {
      if (file) {
        const safeName = file.name.replace(/[^\w.\-]+/g, "_").slice(-80);
        filePath = `${reference}/${safeName}`;
        const { error: upErr } = await supabase.storage.from(QUOTE_BUCKET).upload(filePath, file, { contentType: file.type, upsert: false });
        if (upErr) {
          console.error("[quote] file upload failed", upErr.message);
          filePath = null;
        } else {
          const { data } = await supabase.storage.from(QUOTE_BUCKET).createSignedUrl(filePath, 60 * 60 * 24 * 7);
          fileUrl = data?.signedUrl;
        }
      }
      const { error } = await supabase.from("quote_requests").insert({
        reference,
        material: q.material,
        grade: q.grade || null,
        quantity: q.quantity,
        unit: q.unit,
        country: q.country,
        port: q.port || null,
        order_type: q.orderType,
        required_by: q.requiredBy || null,
        company: q.company,
        contact_name: q.name,
        email: q.email,
        phone: q.phone,
        notes: q.notes || null,
        locale: q.locale,
        file_path: filePath,
        user_agent: req.headers.get("user-agent")?.slice(0, 300) ?? null,
      });
      if (error) throw new Error(`insert failed: ${error.message}`);
    }

    if (resendKey && salesTo) {
      const resend = new Resend(resendKey);
      const from = settings.from;
      const { error } = await resend.emails.send({
        from,
        to: salesTo.split(",").map((s) => s.trim()),
        replyTo: q.email,
        subject: `Quote request ${reference} — ${q.material}, ${q.quantity} ${UNIT_LABELS[q.unit]} → ${q.country}`,
        html: emailHtml(q, reference, fileUrl),
      });
      if (error) {
        // Stored in Supabase already → don't fail the buyer's request over email.
        console.error("[quote] email failed", error);
        if (!supabase) throw new Error("email failed");
      }
    }
  } catch (e) {
    console.error("[quote]", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }

  return NextResponse.json({ reference });
}
