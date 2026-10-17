import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { productImage, productSlugsOf } from "@/data/products";
import { ArrowRight, CropMarks } from "@/components/Icons";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productsPage" });
  return { title: t("metaTitle") };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("productsPage");
  const tp = await getTranslations("products");
  const n = await getTranslations("nav");
  const images = (await getTranslations("shared")).raw("images.products") as Record<string, string>;

  return (
    <div className="bg-paper text-ink">
      <section className="pt-[clamp(48px,6vw,88px)] pb-[clamp(40px,5vw,64px)]">
        <div className="container-x">
          <nav aria-label={t("breadcrumb")} className="eyebrow flex items-center gap-2.5 border-b border-sand-2 pb-4 text-accent">
            <Link href="/" className="text-muted-2 no-underline">{t("home")}</Link>
            <span aria-hidden="true" className="text-muted-2">/</span>
            <span>{n("products")}</span>
          </nav>
          <div className="mt-[clamp(28px,3vw,40px)] flex flex-wrap items-end justify-between gap-x-16 gap-y-6">
            <h1 className="h-condensed m-0 min-w-0 flex-[1_1_520px] text-[clamp(56px,8vw,112px)] leading-[0.92]">{t("title")}</h1>
            <p className="m-0 min-w-0 flex-[0_1_460px] text-[17px] leading-[1.65] text-muted">{t("intro")}</p>
          </div>
        </div>
      </section>

      <section aria-label={tp("listLabel")} className="pb-[clamp(72px,9vw,120px)]">
        <div className="container-x grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-x-[clamp(28px,3vw,44px)] gap-y-[clamp(40px,4vw,56px)]">
          {productSlugsOf(tp.raw("items")).map((slug) => (
            <article key={slug} className="relative flex flex-col border border-sand-2 bg-paper">
              <CropMarks />
              <div className="ph-light relative h-[clamp(240px,22vw,320px)] border-b border-sand-2">
                {productImage(images, slug) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={productImage(images, slug)} alt={tp(`items.${slug}.name`)} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="absolute start-[18px] bottom-[18px] bg-paper px-2.5 py-1.5 font-mono text-xs text-ink-2">{tp(`items.${slug}.photo`)}</span>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3.5 p-[clamp(22px,2.4vw,30px)]">
                <h2 className="h-condensed m-0 text-[clamp(30px,2.6vw,38px)] leading-none [font-stretch:68%]">{tp(`items.${slug}.name`)}</h2>
                <p className="m-0 text-base leading-relaxed text-muted">{tp(`items.${slug}.short`)}</p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3.5">
                  <Link href={`/products/${slug}`} className="inline-flex min-h-12 items-center gap-2.5 text-xl font-semibold text-ink no-underline [font-stretch:72%]">
                    {tp("viewSpecs")} <ArrowRight />
                  </Link>
                  <Link href="/#contact" className="btn btn-primary min-h-12 text-[19px] [font-stretch:72%]">
                    {tp("requestQuote")}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-basalt py-[clamp(56px,7vw,96px)] text-paper">
        <div className="container-x flex flex-wrap items-end justify-between gap-x-16 gap-y-7">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-[18px]">
            <span className="eyebrow text-accent-light">{t("ctaEyebrow")}</span>
            <h2 className="h-condensed m-0 text-[clamp(40px,5vw,72px)]">
              {t("ctaTitle")}
              <br />
              <span className="text-accent-light">{t("ctaAccent")}</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/#contact" className="btn btn-primary min-h-[54px] px-[26px] text-[19px] [font-stretch:72%]">{n("requestQuote")}</Link>
            <Link href="/#contact" className="btn btn-ghost-dark min-h-[54px] px-[26px] text-[19px] [font-stretch:72%]">{t("talk")}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
