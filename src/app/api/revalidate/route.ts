import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/content";

export const runtime = "nodejs";

// Called by the admin dashboard after Publish. It only refreshes the cache from the database
// (it cannot change content), so it needs no secret; a small rate limit stops abuse.
let last = 0;

export async function POST() {
  const now = Date.now();
  if (now - last < 2000) return NextResponse.json({ ok: true, throttled: true });
  last = now;
  revalidateTag(CONTENT_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
