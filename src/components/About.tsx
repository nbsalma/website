import { useTranslations } from "next-intl";
import { Carousel } from "./Carousel";

export function AboutSection() {
  const t = useTranslations("about");
  const facts = t.raw("facts") as { k: string; v: string }[];
  const slides = t.raw("slides") as { title: string; desc: string }[];
  const tones = ["#DDD9D1", "#D5D0C6", "#E0DCD4", "#D8D3CA"];

  return (
    <section id="about" className="bg-concrete py-[clamp(72px,9vw,128px)]">
      <div className="container-x flex flex-col gap-[clamp(72px,8vw,112px)]">
        <div className="flex flex-wrap items-stretch gap-x-[clamp(40px,6vw,96px)] gap-y-12">
          <Carousel
            variant="light"
            label={t("carousel")}
            prevLabel={t("prev")}
            nextLabel={t("next")}
            slideLabels={slides.map((s, k) => t("show", { n: k + 1, title: s.title }))}
            className="ph-light min-h-[clamp(320px,36vw,520px)] min-w-0 flex-[1_1_420px]"
            slides={slides.map((s, i) => (
              <div key={s.title} className="ph-light absolute inset-0" style={{ backgroundColor: tones[i % tones.length] }}>
                <div className="absolute inset-x-6 top-[22px] flex flex-col gap-2">
                  <span className="label-mono text-accent">
                    {String(i + 1).padStart(2, "0")} — {s.title}
                  </span>
                  <span className="label-mono leading-relaxed tracking-[0.1em] text-[#59554D]">{s.desc}</span>
                </div>
              </div>
            ))}
          />

          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-7">
            <p className="eyebrow text-accent">{t("eyebrow")}</p>
            <h2 className="h-display m-0 text-[clamp(34px,4vw,56px)] leading-[1.02]">{t("title")}</h2>
            <p className="m-0 text-[17px] leading-[1.65] text-ink-2">{t("story")}</p>
            <dl className="m-0 grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] gap-x-8 border-t border-ink">
              {facts.map((f) => (
                <div key={f.k} className="flex flex-col gap-1.5 border-b border-[#C9C4BA] py-4">
                  <dt className="label-mono tracking-[0.1em] text-muted-2">{f.k}</dt>
                  <dd className="m-0 text-base">{f.v}</dd>
                </div>
              ))}
            </dl>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(220px,100%),1fr))] gap-6">
              <div className="flex flex-col gap-2">
                <h3 className="m-0 text-[17px] font-semibold">{t("philosophyTitle")}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-muted">{t("philosophy")}</p>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="m-0 text-[17px] font-semibold">{t("visionTitle")}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-muted">{t("vision")}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-[clamp(40px,6vw,96px)] gap-y-10 border-t border-ink pt-[clamp(48px,6vw,72px)]">
          <div className="flex min-w-0 flex-[0_1_320px] flex-col gap-4">
            <div className="ph-light relative aspect-[4/5] w-full">
              <span className="label-mono absolute inset-x-5 bottom-[18px] text-[#59554D]">{t("portrait")}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold [font-stretch:106%]">{t("founderName")}</span>
              <span className="font-mono text-xs uppercase tracking-[0.08em] text-muted-2">{t("founderRole")}</span>
            </div>
          </div>
          <div className="flex min-w-0 flex-[999_1_520px] flex-col gap-7">
            <p className="eyebrow text-accent">{t("leadership")}</p>
            <blockquote className="m-0">
              <p className="m-0 text-[clamp(26px,3vw,42px)] leading-[1.18] font-medium tracking-[-0.02em] [font-stretch:104%] [text-wrap:balance]">{t("quote")}</p>
            </blockquote>
            <p className="m-0 max-w-[640px] text-base leading-[1.65] text-ink-2">{t("bio")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
