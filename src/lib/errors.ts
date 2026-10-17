import "server-only";
import { getSupabaseAdmin } from "./supabase";

/**
 * Records a server error in `error_events` so it shows on the dashboard's System page
 * and triggers an alert email. Never throws.
 */
export async function reportError(err: unknown, ctx: { method?: string; path?: string; digest?: string } = {}) {
  try {
    const e = err instanceof Error ? err : new Error(String(err));
    console.error("[error]", ctx.method ?? "", ctx.path ?? "", e);
    if (process.env.NODE_ENV !== "production") return;
    await getSupabaseAdmin()?.from("error_events").insert({
      app: "site",
      method: ctx.method?.slice(0, 10) ?? null,
      path: ctx.path?.slice(0, 300) ?? null,
      message: e.message.slice(0, 1000) || "Unknown error",
      digest: ctx.digest ?? (e as { digest?: string }).digest ?? null,
      stack: e.stack?.slice(0, 4000) ?? null,
    });
  } catch {
    // reporting must never break the request
  }
}
