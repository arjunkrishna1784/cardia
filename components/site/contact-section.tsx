import { HeartSilhouette } from "@/components/ui/heart-silhouette";
import { Reveal } from "@/components/site/reveal";
import { cardia } from "@/lib/cardia-data";

/**
 * Final CTA — returns to the heart motif with a small glowing, beating
 * heart behind the copy.
 */
export function ContactSection() {
  const email = cardia.contact.email.trim();
  // No fabricated address: without an email the CTA stays an in-page anchor.
  const contactHref = email ? `mailto:${email}` : "#contact";

  return (
    <section
      id="contact"
      className="relative scroll-mt-20 overflow-hidden border-t border-white/[0.06] bg-[#050505]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(560px_at_50%_46%,rgba(143,23,39,0.22),transparent_72%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-16 left-1/2 -translate-x-1/2 opacity-70"
      >
        <HeartSilhouette className="anim-beat w-24" />
      </div>

      <div className="relative mx-auto w-full max-w-3xl px-6 pt-52 pb-32 text-center sm:pt-56 sm:pb-36">
        <Reveal>
          <h2 className="text-3xl leading-[1.1] font-light tracking-[-0.03em] text-foreground sm:text-5xl">
            Build a better understanding of cardiovascular disease.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] leading-relaxed text-white/55 sm:text-base">
            Interested in our research, collaboration, or CARDIA&apos;s
            computational approach?
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href={contactHref}
              className="inline-flex h-12 items-center rounded-full bg-white px-7 text-sm font-medium text-black transition-colors outline-none hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-ring"
            >
              Get in Touch
            </a>
            <a
              href="#research"
              className="inline-flex h-12 items-center rounded-full border border-white/15 px-7 text-sm text-white/80 transition-colors outline-none hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
            >
              View Research
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
