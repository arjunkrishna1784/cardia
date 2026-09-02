import { ArrowUpRight, FileText } from "lucide-react";

import { Reveal } from "@/components/site/reveal";
import { cardia } from "@/lib/cardia-data";

/* ----------------------------------------------------------------------- */
/* Abstract technical visuals (decorative, deterministic — SSR safe)        */
/* ----------------------------------------------------------------------- */

const NET_NODES: Array<[number, number]> = [
  [26, 92], [58, 46], [92, 82], [122, 28], [130, 96], [164, 56],
  [198, 88], [208, 32], [74, 116], [172, 116], [44, 18], [226, 62],
];
const NET_EDGES: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 4], [1, 10], [1, 3], [3, 5], [5, 7], [5, 6],
  [4, 8], [0, 8], [5, 9], [6, 9], [6, 11], [7, 11], [2, 5], [4, 9],
];

function NetworkVisual() {
  return (
    <svg viewBox="0 0 240 132" aria-hidden="true" className="h-36 w-full">
      {NET_EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NET_NODES[a][0]}
          y1={NET_NODES[a][1]}
          x2={NET_NODES[b][0]}
          y2={NET_NODES[b][1]}
          stroke="rgba(255,255,255,0.10)"
          strokeWidth="1"
        />
      ))}
      {/* active connections */}
      <line
        x1={NET_NODES[1][0]} y1={NET_NODES[1][1]}
        x2={NET_NODES[3][0]} y2={NET_NODES[3][1]}
        stroke="rgba(220,52,77,0.55)" strokeWidth="1.2"
        strokeDasharray="5 9" className="anim-dash"
      />
      <line
        x1={NET_NODES[5][0]} y1={NET_NODES[5][1]}
        x2={NET_NODES[6][0]} y2={NET_NODES[6][1]}
        stroke="rgba(220,52,77,0.45)" strokeWidth="1.2"
        strokeDasharray="4 10" className="anim-dash-slow"
      />
      {NET_NODES.map(([x, y], i) => {
        const crimson = i === 3 || i === 5;
        const cyan = i === 6;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={crimson ? 3.4 : cyan ? 3 : 2.3}
            fill={
              crimson
                ? "#DC344D"
                : cyan
                  ? "#70D6E8"
                  : "rgba(243,244,246,0.45)"
            }
            className={crimson || cyan ? "anim-node" : undefined}
            style={crimson || cyan ? { animationDelay: `${i * 0.4}s` } : undefined}
          />
        );
      })}
    </svg>
  );
}

const MATRIX_HOT: Array<[number, number]> = [
  [2, 1], [5, 3], [9, 2], [7, 4], [3, 4], [11, 1],
];

function MatrixVisual() {
  const cols = 13;
  const rows = 6;
  const cells = [];
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const hot = MATRIX_HOT.some(([x, y]) => x === i && y === j);
      const base = 0.05 + 0.26 * (((i * 7 + j * 13) % 11) / 11);
      cells.push(
        <rect
          key={`${i}-${j}`}
          x={8 + i * 17.4}
          y={12 + j * 18.4}
          width="11"
          height="12"
          rx="2.5"
          fill={hot ? "#DC344D" : "#F3F4F6"}
          opacity={hot ? 0.8 : base}
          className={hot && (i + j) % 2 === 0 ? "anim-cell" : undefined}
          style={
            hot && (i + j) % 2 === 0
              ? { animationDelay: `${((i + j) % 5) * 0.7}s` }
              : undefined
          }
        />
      );
    }
  }
  return (
    <svg viewBox="0 0 240 132" aria-hidden="true" className="h-36 w-full">
      {cells}
      {/* learned decision surface across the feature space */}
      <path
        d="M4 104 C56 92 84 48 132 52 C176 56 208 34 236 24"
        fill="none"
        stroke="rgba(255,89,109,0.55)"
        strokeWidth="1.4"
      />
      <path
        d="M4 104 C56 92 84 48 132 52 C176 56 208 34 236 24"
        fill="none"
        stroke="rgba(112,214,232,0.5)"
        strokeWidth="1.4"
        strokeDasharray="3 14"
        className="anim-dash-slow"
      />
    </svg>
  );
}

/** Rows of literature tokens; highlighted entities flow into a small graph. */
const NLP_LINES: Array<Array<{ w: number; kind?: "crimson" | "cyan" }>> = [
  [{ w: 26 }, { w: 40, kind: "crimson" }, { w: 18 }, { w: 30 }],
  [{ w: 38 }, { w: 20 }, { w: 34, kind: "cyan" }, { w: 16 }],
  [{ w: 22 }, { w: 30 }, { w: 24 }, { w: 36, kind: "crimson" }],
  [{ w: 44 }, { w: 16 }, { w: 28 }, { w: 22 }],
  [{ w: 30 }, { w: 36, kind: "crimson" }, { w: 20 }, { w: 26 }],
];

const NLP_NODES: Array<[number, number]> = [
  [196, 30], [226, 52], [198, 74], [222, 100], [196, 116],
];
const NLP_EDGES: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [1, 3], [0, 2],
];

function NlpVisual() {
  return (
    <svg viewBox="0 0 240 132" aria-hidden="true" className="h-36 w-full">
      {NLP_LINES.map((line, j) => {
        let x = 6;
        return line.map((tok, i) => {
          const rect = (
            <rect
              key={`${j}-${i}`}
              x={x}
              y={14 + j * 22}
              width={tok.w}
              height="9"
              rx="4.5"
              fill={
                tok.kind === "crimson"
                  ? "rgba(220,52,77,0.6)"
                  : tok.kind === "cyan"
                    ? "rgba(112,214,232,0.55)"
                    : "rgba(243,244,246,0.13)"
              }
            />
          );
          x += tok.w + 7;
          return rect;
        });
      })}
      {/* extraction flow: text -> structure */}
      <path
        d="M148 40 C170 46 176 52 190 56 M152 82 C168 80 180 74 192 70 M154 108 C172 108 184 104 196 98"
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth="1"
      />
      <path
        d="M148 40 C170 46 176 52 190 56"
        fill="none"
        stroke="rgba(220,52,77,0.5)"
        strokeWidth="1.2"
        strokeDasharray="4 10"
        className="anim-dash"
      />
      {NLP_EDGES.map(([a, b], i) => (
        <line
          key={i}
          x1={NLP_NODES[a][0]}
          y1={NLP_NODES[a][1]}
          x2={NLP_NODES[b][0]}
          y2={NLP_NODES[b][1]}
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />
      ))}
      {NLP_NODES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i === 1 ? 3.4 : 2.4}
          fill={i === 1 ? "#DC344D" : i === 3 ? "#70D6E8" : "rgba(243,244,246,0.5)"}
          className={i === 1 || i === 3 ? "anim-node" : undefined}
          style={i === 3 ? { animationDelay: "1.1s" } : undefined}
        />
      ))}
    </svg>
  );
}

const VISUALS: Record<string, React.ReactNode> = {
  "disease-informatics": <NetworkVisual />,
  "machine-learning": <MatrixVisual />,
  "biomedical-nlp": <NlpVisual />,
};

/* ----------------------------------------------------------------------- */

export function ResearchSection() {
  return (
    <section id="research" className="scroll-mt-20 bg-[#050505]">
      <div className="mx-auto w-full max-w-7xl px-6 py-28 sm:py-36 lg:px-10">
        <Reveal as="header" className="max-w-3xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/35 uppercase">
            Research
          </p>
          <h2 className="mt-5 text-3xl leading-[1.08] font-light tracking-[-0.03em] text-foreground sm:text-5xl">
            Research at the intersection of biology and computation.
          </h2>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/55 sm:text-base">
            CARDIA applies computational approaches to cardiovascular research,
            transforming complex biomedical information into structured signals
            that can be analyzed at scale. Selected manuscripts below examine
            interpretable physiologic biomarkers, subgroup reliability, and the
            limits of language models used in biomedical informatics.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          {cardia.papers.map((paper, i) => (
            <Reveal
              key={paper.id}
              as="article"
              delay={i * 80}
              className="flex flex-col rounded-[26px] border border-white/10 bg-gradient-to-b from-[#0B0B0E] to-[#08080a] p-7 sm:p-8"
            >
              <ul className="flex flex-wrap gap-2">
                {paper.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[10px] tracking-[0.12em] text-white/45 uppercase"
                  >
                    {tag}
                  </li>
                ))}
              </ul>

              <h3 className="mt-5 text-xl leading-snug font-normal tracking-tight text-foreground">
                {paper.title}
              </h3>
              <p className="mt-3 text-[13px] leading-relaxed text-white/45">
                {paper.authors}
              </p>

              <p className="mt-6 text-[15px] leading-relaxed text-white/70">
                {paper.question}
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-white/55">
                {paper.approach}
              </p>

              <ul className="mt-5 space-y-2.5 border-l border-crimson-500/30 pl-4">
                {paper.findings.map((finding) => (
                  <li
                    key={finding}
                    className="text-[14px] leading-relaxed text-white/60"
                  >
                    {finding}
                  </li>
                ))}
              </ul>

              <p className="mt-5 text-[13px] leading-relaxed text-white/40">
                {paper.caveat}
              </p>

              <a
                href={paper.pdf}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors outline-none hover:border-white/35 hover:text-white focus-visible:ring-2 focus-visible:ring-ring"
              >
                <FileText aria-hidden="true" className="size-3.5" />
                Read the paper
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal as="header" className="mt-24 max-w-2xl">
          <p className="font-mono text-[11px] tracking-[0.3em] text-white/35 uppercase">
            Research directions
          </p>
          <h3 className="mt-4 text-2xl leading-snug font-light tracking-[-0.03em] text-foreground sm:text-3xl">
            How these studies fit CARDIA&apos;s computational approach.
          </h3>
        </Reveal>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {cardia.research.map((area, i) => (
            <Reveal
              key={area.id}
              as="article"
              delay={i * 110}
              className="group rounded-[26px] border border-white/10 bg-gradient-to-b from-[#0B0B0E] to-[#08080a] p-7 transition-colors duration-300 hover:border-white/20 sm:p-8"
            >
              <div aria-hidden="true" className="mb-8 opacity-80 transition-opacity duration-300 group-hover:opacity-100">
                {VISUALS[area.id]}
              </div>
              <p className="font-mono text-xs text-white/30">{area.index}</p>
              <h3 className="mt-3 text-xl font-normal tracking-tight text-foreground">
                {area.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/55">
                {area.body}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
