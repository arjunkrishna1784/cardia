import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Static, stylized anatomical heart silhouette (SVG).
 * Used as the WebGL fallback visual and as a small motif elsewhere.
 * Purely decorative — always render with aria-hidden on the container.
 */
export function HeartSilhouette({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 220 240"
      fill="none"
      aria-hidden="true"
      className={cn("block", className)}
      {...props}
    >
      <defs>
        <radialGradient id="cardia-heart-body" cx="42%" cy="38%" r="75%">
          <stop offset="0%" stopColor="#b42336" />
          <stop offset="55%" stopColor="#8f1727" />
          <stop offset="100%" stopColor="#4b0d18" />
        </radialGradient>
        <radialGradient id="cardia-heart-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8f1727" stopOpacity="0.55" />
          <stop offset="60%" stopColor="#8f1727" stopOpacity="0.16" />
          <stop offset="100%" stopColor="#8f1727" stopOpacity="0" />
        </radialGradient>
        <filter id="cardia-heart-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* ambient glow */}
      <circle cx="106" cy="128" r="105" fill="url(#cardia-heart-glow)" />

      {/* descending aorta (behind) */}
      <path
        d="M74 52 C70 68 71 82 78 96"
        stroke="#6d1120"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* aortic arch + ascending aorta */}
      <path
        d="M110 82 C112 60 108 46 96 40 C82 33 70 42 72 54"
        stroke="#a01d30"
        strokeWidth="16"
        strokeLinecap="round"
      />

      {/* superior vena cava */}
      <path
        d="M156 64 L149 94"
        stroke="#7c1424"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* atria */}
      <ellipse cx="76" cy="76" rx="24" ry="20" fill="#7c1424" transform="rotate(-14 76 76)" />
      <ellipse cx="148" cy="96" rx="26" ry="30" fill="#7c1424" transform="rotate(-12 148 96)" />

      {/* soft bloom copy of the ventricular mass */}
      <path
        d="M54 96 C34 130 40 170 70 210 C96 196 128 168 142 128 C148 104 140 88 128 82 C104 72 76 78 54 96 Z"
        fill="#b42336"
        opacity="0.5"
        filter="url(#cardia-heart-blur)"
      />

      {/* ventricular mass */}
      <path
        d="M54 96 C34 130 40 170 70 210 C96 196 128 168 142 128 C148 104 140 88 128 82 C104 72 76 78 54 96 Z"
        fill="url(#cardia-heart-body)"
      />

      {/* pulmonary trunk crossing in front */}
      <path
        d="M120 86 C112 68 96 58 82 62"
        stroke="#b42336"
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* surface vessels */}
      <path
        d="M104 92 C96 116 92 148 84 178 M104 92 C112 112 110 138 100 164 M96 118 C88 126 82 138 80 150"
        stroke="#ff596d"
        strokeOpacity="0.28"
        strokeWidth="1.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* faint computational contour hints */}
      <path
        d="M52 120 C80 128 116 128 140 118 M50 142 C78 152 112 152 136 142 M56 164 C80 174 106 176 126 166"
        stroke="#70d6e8"
        strokeOpacity="0.14"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
