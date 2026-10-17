import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import { RichText } from "@/components/RichText";
import { LEGAL_DOCS, type LegalDoc as Doc } from "@/lib/legal";

/** /privacy, /terms and /cookies. The texts are edited in the dashboard (Content → Legal pages). */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => LEGAL_DOCS.map((doc) => ({ locale, doc })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; doc: string }> }): Promise<Metadata> {
  const { locale, doc } = await params;
  if (!LEGAL_DOCS.includes(doc as Doc)) return {};
  const t = await getTranslations({ locale, namespace: "legal" });
  return {
    title: `${t(`${doc}.title`)} — NB Brokerage & Supply Services`,
    alternates: { canonical: `/${locale}/${doc}`, languages: Object.fromEntries(routing.locales.map((l) => [l, `/${l}/${doc}`])) },
  };
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string; doc: string }> }) {
  const { locale, doc } = await params;
  if (!LEGAL_DOCS.includes(doc as Doc)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("legal");
  const pp = await getTranslations("productsPage");

  return (
    <div className="bg-paper text-ink">
      <section className="pt-[clamp(48px,6vw,88px)] pb-[clamp(72px,9vw,120px)]">
        <div className="container-x">
          <nav aria-label={pp("breadcrumb")} className="eyebrow flex items-center gap-2.5 border-b border-sand-2 pb-4 text-accent">
            <Link href="/" className="text-muted-2 no-underline">{pp("home")}</Link>
            <span aria-hidden="true" className="text-muted-2">/</span>
            <span>{t(`${doc}.title`)}</span>
          </nav>
          <div className="mx-auto mt-[clamp(28px,3vw,40px)] flex max-w-[760px] flex-col gap-5">
            <h1 className="h-condensed m-0 text-[clamp(44px,6vw,80px)] leading-[0.95]">{t(`${doc}.title`)}</h1>
            <p className="m-0 font-mono text-xs uppercase tracking-[0.08em] text-muted-2">
              {t("updatedLabel")}: {t(`${doc}.updated`)}
            </p>
            <div className="mt-4 flex flex-col gap-5 text-[16px] leading-[1.75] text-ink-2">
              <RichText text={t(`${doc}.body`)} />
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-sand pt-6 text-sm">
              {LEGAL_DOCS.filter((d) => d !== doc).map((d) => (
                <Link key={d} href={`/${d}`} className="text-accent">{t(`${d}.title`)}</Link>
              ))}
              <Link href="/" className="ms-auto text-muted-2">{t("back")}</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
