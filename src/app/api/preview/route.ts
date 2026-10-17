import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

/** Opens the site with the dashboard's unpublished draft. The token is single-purpose and short-lived. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const path = url.searchParams.get("path") ?? "/en";
  const safePath = /^\/[a-z]{2}(\/[\w\-/]*)?$/.test(path) ? path : "/en";
  const supa = getSupabaseAdmin();
  if (!supa || !token) return new NextResponse("Invalid preview link", { status: 401 });
  const hash = createHash("sha256").update(token).digest("hex");
  const { data } = await supa.from("site_preview_tokens").select("expires_at").eq("token_hash", hash).maybeSingle();
  if (!data || new Date(data.expires_at) < new Date()) return new NextResponse("This preview link has expired. Open Preview again from the dashboard.", { status: 401 });
  (await draftMode()).enable();
  return NextResponse.redirect(new URL(safePath, url.origin));
}
