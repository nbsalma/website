import { NextResponse } from "next/server";
import { DEFAULT_CONTENT } from "@/lib/content";

/** The texts bundled with the site. The dashboard imports these the first time and uses them to show defaults. */
export function GET() {
  return NextResponse.json(DEFAULT_CONTENT, { headers: { "Access-Control-Allow-Origin": "https://dashboard.nbsalma.com", "Cache-Control": "public, max-age=300" } });
}
