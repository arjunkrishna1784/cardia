import { cardia } from "@/lib/cardia-data";

/**
 * Narrow recognition strip. Typography only — no fabricated logos, and
 * wording avoids implying partnership or sponsorship.
 */
export function CredibilityStrip() {
  return (
    <section
      aria-label="Research recognition"
      className="border-y border-white/[0.08] bg-[#0A0A0C]"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-4 px-6 py-9 sm:flex-row sm:justify-between lg:px-10">
        <p className="text-xs tracking-[0.18em] text-white/40 uppercase">
          Research recognized by
        </p>
        <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {cardia.recognition.map((name, i) => (
            <span key={name} className="flex items-center gap-5">
              {i > 0 && (
                <span aria-hidden="true" className="text-crimson-500/70">
                  •
                </span>
              )}
              <span className="text-sm font-medium tracking-[0.14em] text-white/80 uppercase">
                {name}
              </span>
            </span>
          ))}
        </p>
        <p className="text-[13px] text-white/40">
          Work accepted at IEEE MIT URTC &amp; BMES
        </p>
      </div>
    </section>
  );
}
