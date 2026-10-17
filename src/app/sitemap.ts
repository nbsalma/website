import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getSiteContent } from "@/lib/content";
import { productSlugsOf } from "@/data/products";
import { LEGAL_DOCS } from "@/lib/legal";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

/** Every page in every language, with hreflang alternates. Products come from the published content. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getSiteContent();
  const slugs = productSlugsOf((content.en.products as { items?: unknown } | undefined)?.items);
  const pages: [string, number][] = [
    ["", 1],
    ["/products", 0.9],
    ...slugs.map((s): [string, number] => [`/products/${s}`, 0.8]),
    ...LEGAL_DOCS.map((d): [string, number] => [`/${d}`, 0.2]),
  ];
  const now = new Date();
  return pages.flatMap(([path, priority]) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path ? "monthly" : "weekly",
      priority,
      alternates: { languages: Object.fromEntries(routing.locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
