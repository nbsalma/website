import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** Uptime probe used by the dashboard's monitor: the site is up and can read its content. */
export async function GET() {
  const started = Date.now();
  const supa = getSupabaseAdmin();
  if (!supa) return NextResponse.json({ ok: false, db: "not configured" }, { status: 503 });
  const { error } = await supa.from("site_state").select("id").eq("id", true).maybeSingle();
  if (error) return NextResponse.json({ ok: false, db: "unreachable" }, { status: 503 });
  return NextResponse.json({ ok: true, ms: Date.now() - started }, { headers: { "Cache-Control": "no-store" } });
}
