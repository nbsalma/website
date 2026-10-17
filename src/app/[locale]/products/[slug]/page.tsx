import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import { productImage, productSlugsOf, type ProductDetail } from "@/data/products";
import { DEFAULT_CONTENT } from "@/lib/content";
import { ArrowRight, Download } from "@/components/Icons";

export function generateStaticParams() {
  // Products added later in the dashboard render on first visit (dynamicParams).
  const slugs = productSlugsOf((DEFAULT_CONTENT.en.products as { items: unknown }).items);
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const tp = await getTranslations({ locale, namespace: "products" });
  if (!productSlugsOf(tp.raw("items")).includes(slug)) return {};
  const t = await getTranslations({ locale, namespace: "products.items" });
  const images = (await getTranslations({ locale, namespace: "shared" })).raw("images.products") as Record<string, string>;
  const photo = productImage(images, slug);
  const title = `${t(`${slug}.name`)} — NB Brokerage & Supply Services`;
  return {
    title,
    description: t(`${slug}.short`),
    alternates: { canonical: `/${locale}/products/${slug}`, languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/products/${slug}`])) },
    openGraph: { type: "website", siteName: "NB Brokerage & Supply Services", title, description: t(`${slug}.short`), url: `/${locale}/products/${slug}`, ...(photo ? { images: [photo] } : {}) },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const slugs = productSlugsOf((await getTranslations("products")).raw("items"));
  if (!slugs.includes(slug)) notFound();
  const t = await getTranslations("productPage");
  const tp = await getTranslations("products");
  const n = await getTranslations("nav");
  const pp = await getTranslations("productsPage");
  const name = tp(`items.${slug}.name`);
  const d = tp.raw(`items.${slug}.detail`) as ProductDetail;
  const idx = slugs.indexOf(slug) + 1;
  const shared = await getTranslations("shared");
  const images = shared.raw("images.products") as Record<string, string>;
  const datasheet = ((shared.raw("datasheets") ?? {}) as Record<string, string>)[slug] || "";
  const specsHead = t.raw("specsHead") as string[];
  const gradesHead = t.raw("gradesHead") as string[];

  const sections = [
    ["overview", t("overview")],
    ["specs", t("specs")],
    ["grades", t("grades")],
    ["packaging", t("packaging")],
    ["applications", t("applications")],
    ["certs", t("certs")],
    ...(datasheet ? [["datasheet", t("datasheet")]] : []),
  ];
  const h2 = "m-0 text-[clamp(28px,3vw,40px)] font-semibold tracking-[-0.02em] [font-stretch:106%]";
  const th = "border-b border-ink py-3 pe-4 text-start font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-muted-2";
  const td = "border-b border-sand py-4 pe-4 align-top";

  return (
    <div className="bg-paper text-ink">
      <section className="pt-[clamp(32px,4vw,48px)] pb-[clamp(56px,6vw,88px)]">
        <div className="container-x">
          <nav aria-label={pp("breadcrumb")} className="flex flex-wrap items-center gap-2.5 font-mono text-xs uppercase tracking-[0.08em] text-muted-2">
            <Link href="/" className="text-muted-2 no-underline">{pp("home")}</Link>
            <span aria-hidden="true">/</span>
            <Link href="/products" className="text-muted-2 no-underline">{n("products")}</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{name}</span>
          </nav>
          <div className="mt-[clamp(28px,3vw,40px)] flex flex-wrap items-stretch gap-x-[clamp(40px,5vw,80px)] gap-y-10">
            <div className="flex min-w-0 flex-[1_1_440px] flex-col justify-center gap-7">
              <p className="eyebrow text-accent">{t("category", { n: String(idx).padStart(2, "0") })}</p>
              <h1 className="h-condensed m-0 text-[clamp(48px,6vw,88px)] leading-[0.92]">{name}</h1>
              <p className="m-0 max-w-[540px] text-[17px] leading-[1.65] text-ink-2">{tp(`items.${slug}.short`)}</p>
              <div className="flex flex-wrap gap-3">
                <a href="#rfq" className="btn btn-primary min-h-[52px] px-6">{n("requestQuote")} <ArrowRight /></a>
                {datasheet && <a href="#datasheet" className="btn btn-ghost-light min-h-[52px] font-medium"><Download /> {t("datasheet")}</a>}
              </div>
            </div>
            <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-3">
              <div className="ph-light relative aspect-[4/3] w-full overflow-hidden">
                {productImage(images, slug) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={productImage(images, slug)} alt={name} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="label-mono absolute inset-x-6 bottom-5 text-[#59554D]">{t("gallery.main")}</span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(["packaging", "stockyard", "loading"] as const).map((g) => (
                  <div key={g} className="ph-light relative aspect-[4/3] overflow-hidden">
                    {productImage(images, `${slug}/${g}`) ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={productImage(images, `${slug}/${g}`)} alt={t(`gallery.${g}`)} className="absolute inset-0 h-full w-full object-cover" />
                    ) : (
                      <span className="absolute start-3 bottom-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#59554D]">{t(`gallery.${g}`)}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-label={t("facts.moq")} className="bg-basalt text-paper">
        <dl className="container-x m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))]">
          {[
            [t("facts.moq"), d.facts.moq],
            [t("facts.capacity"), d.facts.capacity],
            [t("facts.origin"), tp("origin")],
            [t("facts.lead"), d.facts.lead],
            [t("facts.packaging"), d.facts.packaging],
          ].map(([k, v], i) => (
            <div key={String(k)} className={`flex flex-col gap-2 py-7 pe-6 ${i > 0 ? "ps-6" : ""} ${i < 4 ? "border-e border-steel" : ""}`}>
              <dt className="label-mono text-fog">{k}</dt>
              <dd className="m-0 text-[22px] font-semibold [font-stretch:108%]">{v}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="py-[clamp(56px,7vw,104px)]">
        <div className="container-x flex flex-wrap items-start gap-x-[clamp(40px,5vw,80px)] gap-y-12">
          <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-[clamp(56px,6vw,80px)]">
            <div id="overview" className="flex flex-col gap-[18px]">
              <h2 className={h2}>{t("overview")}</h2>
              <p className="m-0 text-[17px] leading-[1.7] text-ink-2">{d.overview}</p>
            </div>
            <div id="specs" className="flex flex-col gap-[18px]">
              <h2 className={h2}>{t("specs")}</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-[15px]">
                  <thead><tr>{specsHead.map((h) => <th key={h} scope="col" className={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {d.specs.map((r) => (
                      <tr key={r[0]}><td className={td}>{r[0]}</td><td className={td}>{r[1]}</td><td className={`${td} text-muted-2`}>{r[2]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="m-0 text-[13px] text-muted-2">{t("specsNote")}</p>
            </div>
            <div id="grades" className="flex flex-col gap-[18px]">
              <h2 className={h2}>{t("grades")}</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] border-collapse text-[15px]">
                  <thead><tr>{gradesHead.map((h) => <th key={h} scope="col" className={th}>{h}</th>)}</tr></thead>
                  <tbody>
                    {d.grades.map((r) => (
                      <tr key={r[0]}><td className={`${td} font-semibold`}>{r[0]}</td><td className={td}>{r[1]}</td><td className={`${td} text-muted-2`}>{r[2]}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div id="packaging" className="flex flex-col gap-[18px]">
              <h2 className={h2}>{t("packaging")}</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] border-t border-ink">
                {d.packaging.map(([title, desc], i) => (
                  <div key={title} className="flex flex-col gap-2 border-b border-sand py-5 pe-5">
                    <span className="font-mono text-xs text-accent">{String.fromCharCode(65 + i)}</span>
                    <span className="text-lg font-semibold">{title}</span>
                    <span className="text-sm leading-normal text-muted">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div id="applications" className="flex flex-col gap-[18px]">
              <h2 className={h2}>{t("applications")}</h2>
              <ul className="m-0 flex list-none flex-wrap gap-2.5 p-0">
                {d.applications.map((a) => <li key={a} className="bg-concrete px-4 py-2.5 text-[15px]">{a}</li>)}
              </ul>
            </div>
            <div id="certs" className="flex flex-col gap-[18px]">
              <h2 className={h2}>{t("certs")}</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(min(260px,100%),1fr))] gap-3">
                {d.certs.map(([title, desc]) => (
                  <div key={title} className="flex items-center gap-4 border border-dashed border-[#B5AFA4] p-[18px]">
                    <span className="size-11 flex-none rounded-full border border-sand-2" />
                    <span className="flex flex-col gap-1"><span className="text-[15px] font-semibold">{title}</span><span className="text-[13px] text-muted-2">{desc}</span></span>
                  </div>
                ))}
              </div>
            </div>
            {datasheet && (
              <div id="datasheet" className="flex flex-wrap items-center justify-between gap-5 border border-sand bg-paper-2 px-7 py-6">
                <div className="flex items-center gap-[18px]">
                  <span className="flex h-16 w-[52px] flex-none items-end justify-center border border-ink pb-2 font-mono text-[10px] font-medium">PDF</span>
                  <span className="flex flex-col gap-1"><span className="text-[17px] font-semibold">{t("datasheetTitle", { name })}</span><span className="text-[13px] text-muted-2">{t("datasheetMeta")}</span></span>
                </div>
                <a href={datasheet} target="_blank" rel="noreferrer" className="btn min-h-12 bg-graphite text-sm text-paper"><Download /> {t("download")}</a>
              </div>
            )}
          </div>

          <aside className="flex min-w-0 flex-[1_1_300px] flex-col gap-5 lg:sticky lg:top-[100px]">
            <nav aria-label={t("onThisPage")} className="flex flex-col border-t border-ink text-sm">
              {sections.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="border-b border-sand py-3 text-ink no-underline">{label}</a>
              ))}
            </nav>
            <div className="flex flex-col gap-4 bg-graphite p-6 text-paper">
              <span className="label-mono text-accent-light">{t("sideTitle")}</span>
              <p className="m-0 text-base leading-normal">{t("sideBody")}</p>
              <a href="#rfq" className="btn btn-primary">{n("requestQuote")}</a>
              <Link href="/#contact" className="btn btn-ghost-dark min-h-[46px] text-sm font-normal">{t("talk")}</Link>
            </div>
          </aside>
        </div>
      </section>

      <section id="rfq" className="bg-basalt py-[clamp(64px,8vw,112px)] text-paper">
        <div className="container-x flex flex-wrap items-end justify-between gap-x-16 gap-y-7">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-5">
            <span className="eyebrow text-accent-light">{n("requestQuote")}</span>
            <h2 className="h-display m-0 text-[clamp(32px,3.6vw,52px)] leading-[1.02]">{t("rfqTitle")}</h2>
            <p className="m-0 max-w-[560px] text-base leading-[1.65] text-fog-2">{t("rfqBody")}</p>
          </div>
          <Link href={`/?material=${slug}#contact`} className="btn btn-primary min-h-14 px-[30px] text-xl [font-stretch:72%]">
            {t("rfqCta")} <ArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
}
