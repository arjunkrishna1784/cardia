import { MoveRight } from "lucide-react";

import { Reveal } from "@/components/site/reveal";

/* Deterministic scatter offsets for the entity clusters. */
const CLUSTER_A: Array<[number, number]> = [
  [0, 0], [20, -10], [-16, 12], [30, 16], [-26, -16], [10, -26],
  [-6, 28], [34, -2], [-34, 2], [16, 26], [-20, -30],
];
const CLUSTER_B: Array<[number, number]> = [
  [0, 0], [24, -14], [-20, 10], [12, 24], [-28, -8], [32, 8],
  [-10, -26], [4, 34], [-34, 20], [22, -30],
];
const CLUSTER_C: Array<[number, number]> = [
  [0, 0], [18, -12], [-22, -6], [10, 22], [-12, 26], [28, 10],
  [-30, -18], [4, -28], [30, -24],
];

/**
 * Large abstract cardiovascular network: an imaged heart whose vascular
 * structure branches into data nodes, entity clusters, and finally a single
 * discovered relationship — biology becoming computational insight.
 */
export function ComputationalVisualization() {
  return (
    <section className="relative overflow-hidden bg-[#050505]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(820px_at_24%_62%,rgba(143,23,39,0.16),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-7xl px-6 py-28 sm:py-36 lg:px-10">
        <Reveal as="header" className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl leading-[1.1] font-light tracking-[-0.03em] text-foreground sm:text-5xl">
            Disease is complex. Our models should be able to see that
            complexity.
          </h2>
        </Reveal>

        <Reveal className="mt-16" delay={120}>
          <svg
            viewBox="0 0 1200 560"
            aria-hidden="true"
            className="h-auto w-full"
          >
            <defs>
              <radialGradient id="cv-heart-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#8f1727" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#8f1727" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* ---- biology: imaged heart ---- */}
            <circle cx="215" cy="290" r="185" fill="url(#cv-heart-glow)" />
            <g transform="translate(100,160) scale(1.06)">
              <path
                d="M74 52 C70 68 71 82 78 96"
                stroke="rgba(180,35,54,0.4)"
                strokeWidth="11"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M110 82 C112 60 108 46 96 40 C82 33 70 42 72 54"
                stroke="rgba(180,35,54,0.5)"
                strokeWidth="15"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M156 64 L149 94"
                stroke="rgba(180,35,54,0.42)"
                strokeWidth="11"
                strokeLinecap="round"
              />
              <ellipse
                cx="76" cy="76" rx="24" ry="20"
                transform="rotate(-14 76 76)"
                fill="rgba(143,23,39,0.16)"
                stroke="rgba(220,52,77,0.42)"
                strokeWidth="1.4"
              />
              <ellipse
                cx="148" cy="96" rx="26" ry="30"
                transform="rotate(-12 148 96)"
                fill="rgba(143,23,39,0.16)"
                stroke="rgba(220,52,77,0.42)"
                strokeWidth="1.4"
              />
              <path
                d="M54 96 C34 130 40 170 70 210 C96 196 128 168 142 128 C148 104 140 88 128 82 C104 72 76 78 54 96 Z"
                fill="rgba(143,23,39,0.14)"
                stroke="rgba(220,52,77,0.5)"
                strokeWidth="1.6"
              />
              <path
                d="M120 86 C112 68 96 58 82 62"
                stroke="rgba(220,52,77,0.45)"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M104 92 C96 116 92 148 84 178 M104 92 C112 112 110 138 100 164"
                stroke="rgba(255,89,109,0.3)"
                strokeWidth="1.4"
                fill="none"
              />
              <path
                d="M52 120 C80 128 116 128 140 118 M50 142 C78 152 112 152 136 142 M56 164 C80 174 106 176 126 166"
                stroke="rgba(112,214,232,0.16)"
                strokeWidth="1"
                fill="none"
              />
            </g>

            {/* ---- vascular branching into data nodes ---- */}
            <g fill="none" strokeWidth="1.2">
              <path
                d="M262 236 C340 208 402 198 470 208 C540 200 592 166 640 150 M470 208 C560 214 604 212 640 210"
                stroke="rgba(255,255,255,0.10)"
              />
              <path
                d="M268 292 C350 290 412 286 475 280 C548 272 600 262 640 255 M475 280 C556 290 604 296 640 300"
                stroke="rgba(255,255,255,0.10)"
              />
              <path
                d="M258 350 C340 372 412 382 475 374 C548 384 600 404 640 420 M475 374 C556 396 606 444 640 470"
                stroke="rgba(255,255,255,0.10)"
              />
              {/* flowing pulses */}
              <path
                d="M262 236 C340 208 402 198 470 208 C540 200 592 166 640 150"
                stroke="rgba(220,52,77,0.55)"
                strokeDasharray="7 110"
                className="anim-dash"
              />
              <path
                d="M268 292 C350 290 412 286 475 280 C548 272 600 262 640 255"
                stroke="rgba(112,214,232,0.45)"
                strokeDasharray="6 130"
                className="anim-dash-slow"
              />
              <path
                d="M258 350 C340 372 412 382 475 374 C548 384 600 404 640 420"
                stroke="rgba(220,52,77,0.45)"
                strokeDasharray="7 150"
                className="anim-dash"
              />
            </g>

            {[
              [640, 150, "#DC344D"],
              [640, 210, "rgba(243,244,246,0.45)"],
              [640, 255, "rgba(243,244,246,0.45)"],
              [640, 300, "#70D6E8"],
              [640, 420, "rgba(243,244,246,0.45)"],
              [640, 470, "rgba(243,244,246,0.35)"],
            ].map(([x, y, c], i) => (
              <circle key={i} cx={x as number} cy={y as number} r={i === 0 || i === 3 ? 3.6 : 2.6} fill={c as string} />
            ))}

            {/* ---- links into entity clusters ---- */}
            <g stroke="rgba(255,255,255,0.08)" strokeWidth="1">
              <path d="M640 150 L762 158 M640 210 L768 176 M640 255 L796 276 M640 300 L800 296 M640 420 L748 436 M640 470 L760 458" />
            </g>

            {/* clusters: gene / disease / entity representations */}
            <g>
              <circle cx="795" cy="165" r="58" fill="rgba(143,23,39,0.08)" />
              {CLUSTER_A.map(([dx, dy], i) => (
                <circle
                  key={i}
                  cx={795 + dx}
                  cy={165 + dy}
                  r={i === 0 ? 3.6 : 2.2}
                  fill="rgba(255,89,109,0.55)"
                  className={i === 0 ? "anim-node" : undefined}
                />
              ))}
              <circle cx="830" cy="300" r="54" fill="rgba(243,244,246,0.04)" />
              {CLUSTER_B.map(([dx, dy], i) => (
                <circle
                  key={i}
                  cx={830 + dx}
                  cy={300 + dy}
                  r={i === 0 ? 3.2 : 2.1}
                  fill="rgba(243,244,246,0.35)"
                />
              ))}
              <circle cx="775" cy="445" r="50" fill="rgba(112,214,232,0.05)" />
              {CLUSTER_C.map(([dx, dy], i) => (
                <circle
                  key={i}
                  cx={775 + dx}
                  cy={445 + dy}
                  r={i === 0 ? 3.2 : 2.1}
                  fill="rgba(112,214,232,0.45)"
                  className={i === 0 ? "anim-node" : undefined}
                />
              ))}
            </g>

            {/* ---- convergence to discovery ---- */}
            <g fill="none" strokeWidth="1.1">
              <path d="M853 165 C950 190 1000 240 1042 278 M884 300 C950 296 1000 292 1038 290 M825 445 C930 420 1000 340 1044 302" stroke="rgba(255,255,255,0.10)" />
              <path
                d="M884 300 C950 296 1000 292 1038 290"
                stroke="rgba(112,214,232,0.5)"
                strokeDasharray="5 90"
                className="anim-dash-slow"
              />
            </g>
            <circle cx="1060" cy="290" r="20" fill="none" stroke="rgba(255,89,109,0.35)" strokeWidth="1.2" />
            <circle cx="1060" cy="290" r="9" fill="#DC344D" className="anim-node" />
            <circle cx="1078" cy="281" r="2.2" fill="#70D6E8" className="anim-node" style={{ animationDelay: "0.9s" }} />
            <circle cx="1044" cy="301" r="2" fill="rgba(255,89,109,0.7)" className="anim-node" style={{ animationDelay: "1.7s" }} />
          </svg>

          {/* Flow caption kept in the DOM so the idea isn't locked in imagery */}
          <p className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.22em] text-white/40 uppercase">
            <span>Biology</span>
            <MoveRight aria-hidden="true" className="size-3.5 text-crimson-500/70" />
            <span>Data</span>
            <MoveRight aria-hidden="true" className="size-3.5 text-crimson-500/70" />
            <span>Relationships</span>
            <MoveRight aria-hidden="true" className="size-3.5 text-crimson-500/70" />
            <span>Discovery</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
