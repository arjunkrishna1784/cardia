import { cardia } from "@/lib/cardia-data";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto w-full max-w-7xl px-6 py-14 lg:px-10">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-sm">
            <p className="text-[15px] font-semibold tracking-[0.24em] text-foreground">
              CARDIA
            </p>
            <p className="mt-3 text-[13px] leading-relaxed text-white/40">
              {cardia.fullName}
            </p>
          </div>

          <nav aria-label="Footer">
            <ul className="flex flex-col gap-3 md:items-end">
              {cardia.nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-sm text-sm text-white/55 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-white/35 sm:flex-row">
          <p>© {year} CARDIA</p>
          <p>Computational cardiovascular research.</p>
        </div>
      </div>
    </footer>
  );
}
