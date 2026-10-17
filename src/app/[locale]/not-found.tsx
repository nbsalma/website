import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowRight } from "@/components/Icons";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="bg-paper text-ink">
      <section className="container-x flex min-h-[60vh] flex-col justify-center gap-6 py-[clamp(72px,9vw,120px)]">
        <p className="eyebrow text-accent">404</p>
        <h1 className="h-condensed m-0 text-[clamp(48px,7vw,96px)] leading-[0.92]">{t("title")}</h1>
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.65] text-ink-2">{t("body")}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary min-h-[52px] px-6">{t("home")} <ArrowRight /></Link>
          <Link href="/products" className="btn btn-ghost-light min-h-[52px] font-medium">{t("products")}</Link>
        </div>
      </section>
    </div>
  );
}
