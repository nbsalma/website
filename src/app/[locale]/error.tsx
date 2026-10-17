"use client";

import { useEffect } from "react";

/** Shown if a page fails to render; the error itself is logged server-side (instrumentation.ts). */
export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => console.error(error), [error]);
  return (
    <div className="bg-paper text-ink">
      <section className="container-x flex min-h-[60vh] flex-col justify-center gap-6 py-[clamp(72px,9vw,120px)]">
        <p className="eyebrow text-accent">Error</p>
        <h1 className="h-condensed m-0 text-[clamp(44px,6vw,80px)] leading-[0.92]">Something went wrong.</h1>
        <p className="m-0 max-w-[520px] text-[17px] leading-[1.65] text-ink-2">Please try again. If the problem continues, email info@nbsalma.com.</p>
        <div>
          <button type="button" onClick={reset} className="btn btn-primary min-h-[52px] cursor-pointer border-0 px-6">Try again</button>
        </div>
      </section>
    </div>
  );
}
