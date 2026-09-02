"use client";

import * as React from "react";

import { HeartHeroSection } from "@/components/ui/heart-hero-section";
import { cardia } from "@/lib/cardia-data";

/**
 * Hero composition: copy left / heart right on desktop,
 * copy top / heart lower-center on narrow screens.
 */
export function Hero() {
  const [narrow, setNarrow] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setNarrow(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <HeartHeroSection
      id="top"
      focus={narrow ? [0.5, 0.72] : [0.7, 0.47]}
      scrim={narrow ? "top" : "left"}
      scrimStrength={narrow ? 0.92 : 0.88}
      resolution={narrow ? 0.6 : 0.75}
      maxDpr={narrow ? 1.75 : 2}
      pulseSpeed={1}
      glow={1}
      className="min-h-[92svh] md:min-h-svh"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-start px-6 pt-32 pb-16 md:justify-center md:py-32 lg:px-10">
        <div className="max-w-[46rem]">
          <p className="font-mono text-[11px] tracking-[0.3em] text-crimson-300/90 uppercase">
            {cardia.hero.eyebrow}
          </p>

          <h1 className="mt-6 text-[2.5rem] leading-[1.06] font-light tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02] xl:text-[4.5rem]">
            {cardia.hero.headline[0]}
            <br />
            {cardia.hero.headline[1]}
          </h1>

          <p className="mt-7 max-w-[30rem] text-[15px] leading-relaxed text-white/60 sm:text-base">
            {cardia.hero.supporting}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a
              href="#research"
              className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-medium text-black transition-colors outline-none hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Explore Our Research
            </a>
            <a
              href="#technology"
              className="inline-flex h-12 items-center rounded-full border border-white/15 px-7 text-sm text-white/80 transition-colors outline-none hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
            >
              Our Approach
            </a>
          </div>

          <p className="mt-12 flex items-center gap-2.5 text-[13px] text-white/45">
            <span
              aria-hidden="true"
              className="anim-beat-glow inline-block size-1.5 rounded-full bg-crimson-500"
            />
            {cardia.hero.credibility}
          </p>
        </div>
      </div>
    </HeartHeroSection>
  );
}
