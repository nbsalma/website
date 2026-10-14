import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Carousel } from "./Carousel";
import heroPort from "../../public/images/hero-port.jpg";

export function Hero() {
  const t = useTranslations("hero");
  const facts = [
    [t("facts.origin"), t("facts.originValue")],
    [t("facts.port"), t("facts.portValue")],
    [t("facts.modes"), t("facts.modesValue")],
    [t("facts.scale"), t("facts.scaleValue")],
  ];

  const placeholder = (label: string) => (
    <div className="ph-dark absolute inset-0">
      <span className="absolute start-[clamp(16px,2vw,28px)] top-[clamp(16px,2vw,28px)] bg-basalt px-3 py-2 font-mono text-xs text-[#D6D8DB]">{label}</span>
    </div>
  );

  return (
    <section id="top" className="relative overflow-hidden bg-paper text-paper">
      <div aria-hidden="true" className="vgrid absolute inset-x-0 top-0 bottom-[clamp(120px,13vw,200px)] bg-basalt" />
      <div className="container-x relative pt-[clamp(48px,6vw,88px)]">
        <p className="anim-rise font-mono text-[13px] font-medium uppercase tracking-[0.14em] text-accent-light">{t("eyebrow")}</p>
        <h1 className="anim-rise-2 font-display mt-[clamp(20px,2.4vw,32px)] text-[clamp(42px,6.4vw,96px)] font-semibold leading-[0.94] tracking-[-0.005em] text-paper capitalize">
          {t("line1")}
          <br />
          {t("line2")}
          <br />
          <span className="text-accent-light">{t("accent")}</span>
        </h1>

        <div className="mt-[clamp(32px,4vw,56px)] flex flex-wrap items-start gap-x-[clamp(32px,4vw,56px)] gap-y-8">
          <div className="anim-rise-3 flex min-w-0 max-w-[360px] flex-[1_1_280px] flex-col gap-8">
            <p className="text-[17px] leading-[1.65] text-fog-2 [text-wrap:pretty]">{t("body")}</p>
            <div>
              <Link href="/products" className="btn btn-primary min-h-[54px] px-[26px] text-[19px] [font-stretch:72%]">
                {t("explore")}
              </Link>
            </div>
          </div>

          <div className="min-w-0 flex-[3_1_600px]">
            <Carousel
              variant="hero"
              label={t("carousel")}
              prevLabel={t("prev")}
              nextLabel={t("next")}
              className="min-h-[440px] border border-[#2F343A] bg-[#1C2024] sm:min-h-[clamp(320px,36vw,520px)]"
              slides={[
                <Image
                  key="port"
                  src={heroPort}
                  alt={t("photoAlt")}
                  fill
                  priority
                  sizes="(min-width: 1280px) 820px, 100vw"
                  placeholder="blur"
                  className="object-cover object-[40%_50%]"
                />,
                <div key="s2">{placeholder(t("slide2"))}</div>,
                <div key="s3">{placeholder(t("slide3"))}</div>,
              ]}
            >
              <dl className="absolute inset-x-0 bottom-0 z-[1] m-0 grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] border-t border-steel bg-basalt/85 backdrop-blur-sm">
                {facts.map(([k, v], i) => (
                  <div key={k} className={`flex flex-col gap-1.5 px-[clamp(20px,3vw,40px)] py-5 ${i < 3 ? "border-e border-steel" : ""}`}>
                    <dt className="label-mono text-fog">{k}</dt>
                    <dd className="m-0 text-base font-medium">{v}</dd>
                  </div>
                ))}
              </dl>
            </Carousel>
          </div>
        </div>
      </div>
    </section>
  );
}
