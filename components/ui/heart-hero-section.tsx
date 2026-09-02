"use client";

import * as React from "react";

import { HeartSilhouette } from "@/components/ui/heart-silhouette";
import { cn } from "@/lib/utils";
import type { HeartRenderer } from "@/components/ui/heart-hero-engine";

export interface HeartHeroSectionProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Heart center in viewport UV space: x from left, y from top (0..1). */
  focus?: [number, number];
  pulseSpeed?: number;
  pulseStrength?: number;
  glow?: number;
  exposure?: number;
  vignette?: number;
  /** Render-buffer scale relative to CSS pixels (after DPR). */
  resolution?: number;
  maxDpr?: number;
  dataParticles?: boolean;
  vascularGlow?: number;
  scrim?: "none" | "left" | "right" | "top" | "bottom";
  scrimStrength?: number;
  paused?: boolean;
  children?: React.ReactNode;
}

const SCRIM_GRADIENTS: Record<Exclude<HeartHeroSectionProps["scrim"], undefined | "none">, string> = {
  left: "bg-[linear-gradient(90deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.72)_30%,rgba(5,5,5,0.28)_52%,transparent_72%)]",
  right:
    "bg-[linear-gradient(270deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.72)_30%,rgba(5,5,5,0.28)_52%,transparent_72%)]",
  top: "bg-[linear-gradient(180deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.68)_38%,rgba(5,5,5,0.22)_58%,transparent_78%)]",
  bottom:
    "bg-[linear-gradient(0deg,rgba(5,5,5,0.95)_0%,rgba(5,5,5,0.68)_38%,rgba(5,5,5,0.22)_58%,transparent_78%)]",
};

type Mode = "loading" | "webgl" | "fallback";

/**
 * Full-screen cinematic hero with a computational anatomical heart rendered
 * to a WebGL canvas behind DOM content. Falls back to a static SVG/CSS
 * cardiovascular visual when WebGL is unavailable.
 *
 * Rendering pauses when the hero leaves the viewport, when the tab is hidden,
 * and honors prefers-reduced-motion by freezing on a fixed frame.
 */
export function HeartHeroSection({
  focus = [0.72, 0.48],
  pulseSpeed = 1,
  pulseStrength = 1,
  glow = 1,
  exposure = 1,
  vignette = 1,
  resolution = 0.75,
  maxDpr = 2,
  dataParticles = true,
  vascularGlow = 1,
  scrim = "none",
  scrimStrength = 0.85,
  paused = false,
  className,
  children,
  ...props
}: HeartHeroSectionProps) {
  const sectionRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = React.useState<Mode>("loading");

  // Latest props, readable from the long-lived effect without restarting it.
  const optionsRef = React.useRef({
    focus,
    pulseSpeed,
    pulseStrength,
    glow,
    exposure,
    vignette,
    resolution,
    maxDpr,
    dataParticles,
    vascularGlow,
    paused,
  });
  optionsRef.current = {
    focus,
    pulseSpeed,
    pulseStrength,
    glow,
    exposure,
    vignette,
    resolution,
    maxDpr,
    dataParticles,
    vascularGlow,
    paused,
  };

  const controlsRef = React.useRef<{ wake: () => void } | null>(null);

  React.useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    if (!section || !canvas) return;

    let renderer: HeartRenderer | null = null;
    let reducedTime = 2.54;
    let disposed = false;
    let raf = 0;
    let last = 0;
    let time = 2.05;
    let inView = true;
    let pageVisible = !document.hidden;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reduced = reducedQuery.matches;

    const shouldAnimate = () =>
      !disposed &&
      renderer !== null &&
      inView &&
      pageVisible &&
      !reduced &&
      !optionsRef.current.paused;

    const syncUniforms = () => {
      const o = optionsRef.current;
      renderer?.set({
        focus: o.focus,
        pulseSpeed: o.pulseSpeed,
        pulseStrength: o.pulseStrength,
        glow: o.glow,
        exposure: o.exposure,
        vignette: o.vignette,
        vascularGlow: o.vascularGlow,
        dataParticles: o.dataParticles,
        quality: o.resolution,
      });
    };

    const syncSize = () => {
      if (!renderer) return;
      const o = optionsRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, o.maxDpr);
      renderer.resize(
        section.clientWidth * dpr * o.resolution,
        section.clientHeight * dpr * o.resolution
      );
    };

    const renderFrame = (t: number) => {
      if (!renderer) return;
      syncUniforms();
      renderer.render(t);
    };

    const tick = (now: number) => {
      if (!shouldAnimate()) {
        raf = 0;
        return;
      }
      const dt = last > 0 ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      time += dt;
      renderFrame(time);
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (raf === 0 && shouldAnimate()) {
        last = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const sleep = () => {
      if (raf !== 0) cancelAnimationFrame(raf);
      raf = 0;
    };

    controlsRef.current = { wake };

    const init = async () => {
      try {
        const mod = await import("@/components/ui/heart-hero-engine");
        if (disposed) return;
        reducedTime = mod.REDUCED_MOTION_TIME;
        renderer?.dispose();
        const o = optionsRef.current;
        renderer = mod.createHeartRenderer(canvas, {
          focus: o.focus,
          pulseSpeed: o.pulseSpeed,
          pulseStrength: o.pulseStrength,
          glow: o.glow,
          exposure: o.exposure,
          vignette: o.vignette,
          vascularGlow: o.vascularGlow,
          dataParticles: o.dataParticles,
          quality: o.resolution,
        });
        if (!renderer) {
          setMode("fallback");
          return;
        }
        syncSize();
        renderFrame(reduced ? reducedTime : time);
        setMode("webgl");
        wake();
      } catch {
        if (!disposed) setMode("fallback");
      }
    };

    const onContextLost = (event: Event) => {
      event.preventDefault();
      sleep();
    };
    const onContextRestored = () => {
      void init();
    };
    canvas.addEventListener("webglcontextlost", onContextLost, false);
    canvas.addEventListener("webglcontextrestored", onContextRestored, false);

    const resizeObserver = new ResizeObserver(() => {
      syncSize();
      if (raf === 0) renderFrame(reduced ? reducedTime : time);
    });
    resizeObserver.observe(section);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
        if (inView) wake();
      },
      { rootMargin: "96px" }
    );
    intersectionObserver.observe(section);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) wake();
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onReducedChange = () => {
      reduced = reducedQuery.matches;
      if (reduced) {
        sleep();
        renderFrame(reducedTime);
      } else {
        wake();
      }
    };
    reducedQuery.addEventListener("change", onReducedChange);

    void init();

    return () => {
      disposed = true;
      sleep();
      controlsRef.current = null;
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onReducedChange);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      renderer?.dispose();
      renderer = null;
    };
  }, []);

  // Resume the loop if `paused` flips back to false.
  React.useEffect(() => {
    if (!paused) controlsRef.current?.wake();
  }, [paused]);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative isolate flex flex-col overflow-hidden bg-[#050505]",
        className
      )}
      {...props}
    >
      {/* Ambient glow at the focus point: pre-load state + fallback base. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(min(70vmin, 640px) at ${focus[0] * 100}% ${
            focus[1] * 100
          }%, rgba(143,23,39,0.30), rgba(143,23,39,0.10) 55%, transparent 75%)`,
        }}
      />

      {mode !== "fallback" ? (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={cn(
            "absolute inset-0 h-full w-full transition-opacity duration-1000",
            mode === "webgl" ? "opacity-100" : "opacity-0"
          )}
        />
      ) : (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <HeartSilhouette
            className="absolute w-[min(64vmin,540px)] -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${focus[0] * 100}%`, top: `${focus[1] * 100}%` }}
          />
        </div>
      )}

      {scrim !== "none" && (
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0",
            SCRIM_GRADIENTS[scrim]
          )}
          style={{ opacity: scrimStrength }}
        />
      )}

      <div className="relative flex w-full flex-1 flex-col">{children}</div>
    </section>
  );
}
