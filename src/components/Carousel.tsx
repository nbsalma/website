"use client";

import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "./Icons";

type Props = {
  slides: ReactNode[];
  label: string;
  prevLabel: string;
  nextLabel: string;
  slideLabels?: string[];
  /** "hero": counter + arrows top-end on dark; "light": bars bottom-start, counter + arrows bottom-end */
  variant: "hero" | "light";
  className?: string;
  children?: ReactNode;
};

/** Manually controlled carousel (no autoplay), with fade between slides. */
export function Carousel({ slides, label, prevLabel, nextLabel, slideLabels, variant, className = "", children }: Props) {
  const [i, setI] = useState(0);
  const n = slides.length;
  const go = (k: number) => setI(((k % n) + n) % n);
  const counter = `${String(i + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`;

  return (
    <div role="region" aria-roledescription="carousel" aria-label={label} className={`relative overflow-hidden ${className}`}>
      <div key={i} role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${n}`} className="anim-fade absolute inset-0">
        {slides[i]}
      </div>
      {children}

      {variant === "hero" ? (
        <div className="absolute end-[clamp(12px,1.6vw,20px)] top-[clamp(12px,1.6vw,20px)] z-[2] flex items-center gap-2">
          <span aria-live="polite" className="flex min-h-11 items-center bg-basalt/80 px-2.5 font-mono text-xs text-paper">
            {counter}
          </span>
          <button type="button" onClick={() => go(i - 1)} aria-label={prevLabel} className="flex size-11 cursor-pointer items-center justify-center border border-steel-2 bg-basalt/80 text-paper">
            <ArrowLeft />
          </button>
          <button type="button" onClick={() => go(i + 1)} aria-label={nextLabel} className="flex size-11 cursor-pointer items-center justify-center border-0 bg-accent text-white">
            <ArrowRight size={18} />
          </button>
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-0 z-[2] flex items-center justify-between gap-4 py-4 ps-6 pe-4">
          <div className="flex items-center gap-1">
            {slides.map((_, k) => (
              <button
                key={k}
                type="button"
                onClick={() => go(k)}
                aria-label={slideLabels?.[k] ?? `${k + 1}`}
                aria-current={k === i ? "true" : undefined}
                className="flex h-11 w-8 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
              >
                <span className={`block h-[3px] ${k === i ? "w-[26px] bg-accent" : "w-3.5 bg-[#8E897F]"}`} />
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span aria-live="polite" className="pe-2 font-mono text-xs text-ink">
              {counter}
            </span>
            <button type="button" onClick={() => go(i - 1)} aria-label={prevLabel} className="flex size-11 cursor-pointer items-center justify-center border-0 bg-graphite text-paper">
              <ArrowLeft />
            </button>
            <button type="button" onClick={() => go(i + 1)} aria-label={nextLabel} className="flex size-11 cursor-pointer items-center justify-center border-0 bg-graphite text-paper">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
