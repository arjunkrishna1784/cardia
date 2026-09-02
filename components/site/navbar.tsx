"use client";

import * as React from "react";
import { Menu, X } from "lucide-react";

import { cardia } from "@/lib/cardia-data";
import { cn } from "@/lib/utils";

/**
 * Minimal floating navigation: transparent over the hero, gaining a subtle
 * blur + hairline border once the page scrolls.
 */
export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-b border-white/10 bg-[#050505]/70 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 lg:px-10"
      >
        <a
          href="#top"
          className="group flex min-w-0 items-baseline gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="CARDIA — back to top"
        >
          <span className="text-[15px] font-semibold tracking-[0.24em] text-foreground">
            CARDIA
          </span>
          <span className="hidden truncate text-[10px] tracking-[0.08em] text-white/40 xl:block">
            {cardia.fullName}
          </span>
        </a>

        <div className="flex items-center gap-2 md:gap-8">
          <ul className="hidden items-center gap-7 md:flex">
            {cardia.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-sm text-sm text-white/65 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#research"
            className="hidden rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors outline-none hover:bg-white/85 focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
          >
            Explore Our Research
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="cardia-mobile-nav"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="inline-flex size-9 items-center justify-center rounded-full border border-white/10 text-white/80 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="cardia-mobile-nav"
          className="border-t border-white/10 bg-[#050505]/95 backdrop-blur-md md:hidden"
        >
          <ul className="flex flex-col px-6 py-4">
            {cardia.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-sm py-3 text-base text-white/75 transition-colors outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="pt-3 pb-2">
              <a
                href="#research"
                onClick={() => setOpen(false)}
                className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-black outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Explore Our Research
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
