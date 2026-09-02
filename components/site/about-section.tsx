import { Reveal } from "@/components/site/reveal";
import { cardia } from "@/lib/cardia-data";

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-white/[0.06] bg-[#0A0A0C]"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-28 sm:py-36 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/35 uppercase">
            About
          </p>
          <h2 className="mt-5 max-w-xl text-3xl leading-[1.08] font-light tracking-[-0.03em] text-foreground sm:text-5xl">
            {cardia.about.headline}
          </h2>
        </Reveal>

        <Reveal
          delay={120}
          className="flex flex-col gap-6 border-white/10 text-[15px] leading-relaxed text-white/60 sm:text-base lg:border-l lg:pl-12"
        >
          <p>{cardia.about.body}</p>
          <p>{cardia.about.team}</p>
          <p className="text-white/80">{cardia.about.recognition}</p>
        </Reveal>
      </div>
    </section>
  );
}
