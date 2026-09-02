import { BrainCircuit, LibraryBig, ListTree, MoveRight, ScanSearch } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { cardia } from "@/lib/cardia-data";

const STAGE_ICONS = [LibraryBig, ListTree, BrainCircuit, ScanSearch];

/**
 * Technology pipeline: horizontal flow on desktop, vertical rail on mobile.
 */
export function PipelineSection() {
  return (
    <section
      id="technology"
      className="scroll-mt-20 border-y border-white/[0.06] bg-[#0A0A0C]"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-28 sm:py-36 lg:px-10">
        <Reveal as="header" className="max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/35 uppercase">
            Technology
          </p>
          <h2 className="mt-5 text-3xl leading-[1.08] font-light tracking-[-0.03em] text-foreground sm:text-5xl">
            From biomedical information to computational insight.
          </h2>
        </Reveal>

        {/* Desktop: horizontal flow */}
        <Reveal className="relative mt-20 hidden md:block">
          <div aria-hidden="true" className="absolute top-[26px] right-[12.5%] left-[12.5%]">
            <div className="h-px w-full bg-white/10" />
            <svg
              viewBox="0 0 100 2"
              preserveAspectRatio="none"
              className="absolute inset-x-0 top-0 h-px w-full -translate-y-[0.5px]"
            >
              <line
                x1="0"
                y1="1"
                x2="100"
                y2="1"
                stroke="rgba(220,52,77,0.6)"
                strokeWidth="1.5"
                strokeDasharray="3 22"
                vectorEffect="non-scaling-stroke"
                className="anim-dash"
              />
            </svg>
          </div>
          {[25, 50, 75].map((pos) => (
            <MoveRight
              key={pos}
              aria-hidden="true"
              className="absolute top-[26px] size-3.5 -translate-x-1/2 -translate-y-1/2 text-white/30"
              style={{ left: `${pos}%` }}
            />
          ))}

          <ol className="relative grid grid-cols-4 gap-8">
            {cardia.pipeline.map((stage, i) => {
              const Icon = STAGE_ICONS[i];
              return (
                <li key={stage.index} className="flex flex-col items-center text-center">
                  <span className="relative z-[1] flex size-[52px] items-center justify-center rounded-full border border-white/12 bg-[#0A0A0C] shadow-[0_0_0_6px_#0A0A0C]">
                    <Icon aria-hidden="true" className="size-5 text-crimson-300/90" />
                  </span>
                  <span className="mt-6 font-mono text-xs text-white/30">{stage.index}</span>
                  <h3 className="mt-2 text-lg font-medium text-foreground">{stage.title}</h3>
                  <p className="mt-2 max-w-[15rem] text-sm leading-relaxed text-white/50">
                    {stage.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </Reveal>

        {/* Mobile: vertical rail */}
        <ol className="mt-14 md:hidden">
          {cardia.pipeline.map((stage, i) => {
            const Icon = STAGE_ICONS[i];
            const last = i === cardia.pipeline.length - 1;
            return (
              <Reveal as="li" key={stage.index} delay={i * 80} className="flex gap-5">
                <div className="flex flex-col items-center">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/[0.03]">
                    <Icon aria-hidden="true" className="size-4.5 text-crimson-300/90" />
                  </span>
                  {!last && <span aria-hidden="true" className="my-2 w-px flex-1 bg-white/10" />}
                </div>
                <div className={last ? "pb-2" : "pb-10"}>
                  <p className="pt-1 font-mono text-xs text-white/30">{stage.index}</p>
                  <h3 className="mt-1 text-lg font-medium text-foreground">{stage.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/50">{stage.body}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
