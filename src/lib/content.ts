import "server-only";
import { unstable_cache } from "next/cache";
import type { AbstractIntlMessages } from "next-intl";
import { draftMode } from "next/headers";
import en from "../../messages/en.json";
import fr from "../../messages/fr.json";
import ar from "../../messages/ar.json";
import { getSupabaseAdmin } from "./supabase";

/**
 * Site content is edited in the admin dashboard (dashboard.nbsalma.com) and stored in Supabase:
 * `site_state.draft` (work in progress) and `site_content_versions` (published snapshots).
 * The JSON files in /messages are the fallback, so the site still renders if the database is unreachable.
 */

export type Shared = {
  contact: { salesEmail: string; phone: string; whatsapp: string };
  social: { linkedin: string; facebook: string };
  images: { hero: string; heroSlide2: string; heroSlide3: string; products: Record<string, string>; about: string[]; founder: string };
  /** Product slug -> public URL of its PDF datasheet. Products without one hide the download. */
  datasheets: Record<string, string>;
};

type Tree = { [k: string]: unknown };
export type SiteContent = { en: Tree; fr: Tree; ar: Tree; shared: Shared };

export const DEFAULT_SHARED: Shared = {
  contact: { salesEmail: "", phone: "", whatsapp: "" },
  social: { linkedin: "", facebook: "" },
  images: { hero: "", heroSlide2: "", heroSlide3: "", products: {}, about: [], founder: "" },
  datasheets: {},
};

export const DEFAULT_CONTENT: SiteContent = { en, fr, ar, shared: DEFAULT_SHARED };

export const CONTENT_TAG = "site-content";

const isObj = (v: unknown): v is Tree => !!v && typeof v === "object" && !Array.isArray(v);
const empty = (v: unknown) => v === undefined || v === null || v === "";

/**
 * `over` wins; empty strings fall back to `alt` (the English text), then `base` (the bundled file).
 * Keys only in `base` are kept so new code never meets a missing message, except under
 * `authoritative` paths (the product list), where the edited content decides what exists.
 */
function merge(base: unknown, over: unknown, alt: unknown, path: string, authoritative: Set<string>): unknown {
  if (isObj(over) || isObj(base)) {
    const b = isObj(base) ? base : {};
    const o = isObj(over) ? over : {};
    const a = isObj(alt) ? alt : {};
    const keys = authoritative.has(path) && isObj(over) ? Object.keys(o) : [...new Set([...Object.keys(o), ...Object.keys(b)])];
    return Object.fromEntries(keys.map((k) => [k, merge(b[k], o[k], a[k], path ? `${path}.${k}` : k, authoritative)]));
  }
  if (Array.isArray(over)) return over.map((v, i) => merge(Array.isArray(base) ? base[i] : undefined, v, Array.isArray(alt) ? alt[i] : undefined, path, authoritative));
  if (!empty(over)) return over;
  if (!empty(alt)) return alt;
  return base;
}

const AUTHORITATIVE = new Set(["products.items"]);

function resolve(stored: Partial<SiteContent> | null): SiteContent {
  if (!stored) return DEFAULT_CONTENT;
  const enOver = stored.en ?? null;
  return {
    en: merge(en, enOver, null, "", AUTHORITATIVE) as Tree,
    fr: merge(fr, stored.fr ?? null, enOver, "", AUTHORITATIVE) as Tree,
    ar: merge(ar, stored.ar ?? null, enOver, "", AUTHORITATIVE) as Tree,
    shared: merge(DEFAULT_SHARED, stored.shared ?? null, null, "", new Set()) as Shared,
  };
}

const loadPublished = unstable_cache(
  async (): Promise<Partial<SiteContent> | null> => {
    const supa = getSupabaseAdmin();
    if (!supa) return null;
    const { data: state, error } = await supa.from("site_state").select("published_version_id").eq("id", true).maybeSingle();
    if (error || !state?.published_version_id) return null;
    const { data: v } = await supa.from("site_content_versions").select("content").eq("id", state.published_version_id).maybeSingle();
    return (v?.content as Partial<SiteContent>) ?? null;
  },
  ["site-content-published"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);

async function loadDraft(): Promise<Partial<SiteContent> | null> {
  const supa = getSupabaseAdmin();
  if (!supa) return null;
  const { data } = await supa.from("site_state").select("draft").eq("id", true).maybeSingle();
  return (data?.draft as Partial<SiteContent>) ?? null;
}

async function isPreview() {
  try {
    return (await draftMode()).isEnabled;
  } catch {
    return false; // outside a request (build-time static generation)
  }
}

export async function getSiteContent(): Promise<SiteContent> {
  try {
    const stored = (await isPreview()) ? ((await loadDraft()) ?? (await loadPublished())) : await loadPublished();
    return resolve(stored);
  } catch (e) {
    console.error("[content] falling back to bundled messages", e);
    return DEFAULT_CONTENT;
  }
}

/** Messages for next-intl: the locale's texts plus the language-independent `shared` settings. */
export async function getSiteMessages(locale: "en" | "fr" | "ar") {
  const c = await getSiteContent();
  // `shared` holds a few arrays (e.g. about photos); next-intl reads them with t.raw().
  return { ...c[locale], shared: c.shared } as unknown as AbstractIntlMessages;
}

/** Quote-form email settings, editable in the dashboard; env vars are the fallback. */
export const getQuoteSettings = unstable_cache(
  async () => {
    const supa = getSupabaseAdmin();
    const fallback = {
      recipients: (process.env.SALES_EMAIL ?? "").split(",").map((s) => s.trim()).filter(Boolean),
      from: process.env.QUOTE_FROM_EMAIL ?? "NB Website <onboarding@resend.dev>",
    };
    if (!supa) return fallback;
    const { data } = await supa.from("site_state").select("quote_recipients, quote_from_name").eq("id", true).maybeSingle();
    if (!data) return fallback;
    const domain = fallback.from.match(/@([^>\s]+)/)?.[1] ?? "nbsalma.com";
    return {
      recipients: (data.quote_recipients as string[] | null)?.length ? (data.quote_recipients as string[]) : fallback.recipients,
      from: `${(data.quote_from_name || "NB Website").replace(/[<>"]/g, "")} <quotes@${domain}>`,
    };
  },
  ["site-quote-settings"],
  { tags: [CONTENT_TAG], revalidate: 3600 },
);
