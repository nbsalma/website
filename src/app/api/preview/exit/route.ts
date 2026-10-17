import { NextResponse } from "next/server";
import { draftMode } from "next/headers";

export async function GET(req: Request) {
  (await draftMode()).disable();
  const back = new URL(req.url).searchParams.get("path") ?? "/en";
  return NextResponse.redirect(new URL(/^\/[\w\-/]*$/.test(back) ? back : "/en", req.url));
}
