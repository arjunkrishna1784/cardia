/**
 * CARDIA heart hero — WebGL rendering engine.
 *
 * Renders a raymarched, procedurally shaded anatomical heart:
 * ventricular mass, atria, aortic arch, pulmonary trunk, and vena cava are
 * blended signed-distance primitives. Shading layers a crimson tissue base,
 * voronoi-edge vascular illumination, cyan computational scan contours, and
 * data-particle trajectories flowing into and out of the great vessels.
 *
 * This module is dynamically imported by `heart-hero-section.tsx` so the
 * shader/engine code stays out of the initial bundle.
 */

export interface HeartRendererOptions {
  /** Heart center in CSS UV space (x from left, y from top, 0..1). */
  focus: [number, number];
  pulseSpeed: number;
  pulseStrength: number;
  glow: number;
  exposure: number;
  vignette: number;
  vascularGlow: number;
  dataParticles: boolean;
  /** 0..1 quality hint; lowers raymarch steps on small/mobile buffers. */
  quality: number;
}

export interface HeartRenderer {
  render(timeSeconds: number): void;
  /** Resize the drawing buffer (device pixels). */
  resize(width: number, height: number): void;
  set(options: Partial<HeartRendererOptions>): void;
  dispose(): void;
}

/** Frame time used when prefers-reduced-motion freezes the animation. */
export const REDUCED_MOTION_TIME = 2.54;

/** Safety cap so very large hero buffers cannot stall weak GPUs. */
const MAX_BUFFER_PIXELS = 2_600_000;

const VERTEX_SRC = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAGMENT_SRC = `
precision highp float;

varying vec2 vUv;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uFocus;      // GL UV space (y up)
uniform float uZoom;       // world units per screen unit (bigger = smaller heart)
uniform float uBeatHz;
uniform float uPulseStrength;
uniform float uGlow;
uniform float uExposure;
uniform float uVignette;
uniform float uVascular;
uniform float uParticles;
uniform float uSteps;

#define MAX_STEPS 96
#define MAX_DIST 10.0
#define CAM_DIST 4.2

/* ------------------------------------------------------------------ hash */

float hash12(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

vec3 hash33(vec3 p) {
  p = fract(p * vec3(443.897, 441.423, 437.195));
  p += dot(p, p.yxz + 19.19);
  return fract((p.xxy + p.yxx) * p.zyx);
}

float vnoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float n000 = hash33(i + vec3(0.0, 0.0, 0.0)).x;
  float n100 = hash33(i + vec3(1.0, 0.0, 0.0)).x;
  float n010 = hash33(i + vec3(0.0, 1.0, 0.0)).x;
  float n110 = hash33(i + vec3(1.0, 1.0, 0.0)).x;
  float n001 = hash33(i + vec3(0.0, 0.0, 1.0)).x;
  float n101 = hash33(i + vec3(1.0, 0.0, 1.0)).x;
  float n011 = hash33(i + vec3(0.0, 1.0, 1.0)).x;
  float n111 = hash33(i + vec3(1.0, 1.0, 1.0)).x;
  return mix(
    mix(mix(n000, n100, f.x), mix(n010, n110, f.x), f.y),
    mix(mix(n001, n101, f.x), mix(n011, n111, f.x), f.y),
    f.z
  );
}

float fbm(vec3 p) {
  return 0.5 * vnoise(p) + 0.25 * vnoise(p * 2.13) + 0.125 * vnoise(p * 4.31);
}

/* Voronoi: returns (F1, F2, cellId) */
vec3 voro(vec3 x) {
  vec3 n = floor(x);
  vec3 f = fract(x);
  float f1 = 8.0;
  float f2 = 8.0;
  float id = 0.0;
  for (int k = -1; k <= 1; k++)
  for (int j = -1; j <= 1; j++)
  for (int i = -1; i <= 1; i++) {
    vec3 g = vec3(float(i), float(j), float(k));
    vec3 o = hash33(n + g);
    vec3 r = g + o - f;
    float d = dot(r, r);
    if (d < f1) {
      f2 = f1;
      f1 = d;
      id = o.x;
    } else if (d < f2) {
      f2 = d;
    }
  }
  return vec3(sqrt(f1), sqrt(f2), id);
}

/* ------------------------------------------------------------- SDF prims */

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

float sdEll(vec3 p, vec3 r) {
  float k0 = length(p / r);
  float k1 = length(p / (r * r));
  return k0 * (k0 - 1.0) / k1;
}

float sdSeg(vec3 p, vec3 a, vec3 b, float r) {
  vec3 pa = p - a;
  vec3 ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h) - r;
}

float dot2(vec3 v) { return dot(v, v); }

float sdRoundCone(vec3 p, vec3 a, vec3 b, float r1, float r2) {
  vec3 ba = b - a;
  float l2 = dot(ba, ba);
  float rr = r1 - r2;
  float a2 = l2 - rr * rr;
  float il2 = 1.0 / l2;
  vec3 pa = p - a;
  float y = dot(pa, ba);
  float z = y - l2;
  float x2 = dot2(pa * l2 - ba * y);
  float y2 = y * y * l2;
  float z2 = z * z * l2;
  float k = sign(rr) * rr * rr * x2;
  if (sign(z) * a2 * z2 > k) return sqrt(x2 + z2) * il2 - r2;
  if (sign(y) * a2 * y2 < k) return sqrt(x2 + y2) * il2 - r1;
  return (sqrt(x2 * a2 * il2) + y * rr) * il2 - r1;
}

/* Half torus opening downward; ends capped by spheres. */
float sdArch(vec3 p, float R, float r) {
  if (p.y > 0.0) {
    vec2 t = vec2(length(p.xy) - R, p.z);
    return length(t) - r;
  }
  return length(vec3(abs(p.x) - R, p.y, p.z)) - r;
}

/* --------------------------------------------------------- heart mapping */

float gScale;
mat3 gRot;
float gBob;

mat3 rotX(float a) {
  float c = cos(a), s = sin(a);
  return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
}
mat3 rotY(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
}
mat3 rotZ(float a) {
  float c = cos(a), s = sin(a);
  return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
}

vec3 toLocal(vec3 p) {
  p.y -= gBob;
  return (gRot * p) / gScale;
}

vec3 toWorld(vec3 q) {
  // gRot is orthonormal: v * M == transpose(M) * v
  vec3 p = (q * gScale) * gRot;
  p.y += gBob;
  return p;
}

/* Anatomical heart: ventricular mass, atria, and great vessels. */
float mapHeart(vec3 q) {
  // Ventricular mass: broad base tapering to the apex (down-left, forward).
  float d = sdRoundCone(q, vec3(0.10, 0.28, 0.0), vec3(-0.55, -0.99, 0.14), 0.60, 0.13);

  // Right ventricle bulge wrapping the front-right.
  d = smin(d, sdEll(q - vec3(0.34, -0.22, 0.26), vec3(0.46, 0.52, 0.38)), 0.17);

  // Atria.
  d = smin(d, sdEll(q - vec3(-0.44, 0.42, -0.16), vec3(0.33, 0.29, 0.29)), 0.12);
  d = smin(d, sdEll(q - vec3(0.52, 0.24, -0.04), vec3(0.31, 0.36, 0.30)), 0.12);

  // Great vessels.
  float ves = sdSeg(q, vec3(0.10, 0.30, -0.06), vec3(0.14, 0.86, -0.12), 0.150); // ascending aorta
  vec3 ap = q - vec3(-0.08, 0.86, -0.12);
  ap.yz = mat2(cos(0.32), sin(0.32), -sin(0.32), cos(0.32)) * ap.yz;             // arch leans back
  ves = min(ves, sdArch(ap, 0.22, 0.125));                                       // aortic arch
  ves = min(ves, sdSeg(q, vec3(-0.30, 0.84, -0.24), vec3(-0.42, -0.05, -0.42), 0.105)); // descending
  ves = min(ves, sdSeg(q, vec3(0.27, 0.02, 0.33), vec3(-0.11, 0.63, 0.25), 0.135));     // pulmonary trunk
  ves = min(ves, sdSeg(q, vec3(-0.11, 0.63, 0.25), vec3(-0.48, 0.72, 0.10), 0.095));    // pulmonary branch
  ves = min(ves, sdSeg(q, vec3(0.56, 0.34, -0.08), vec3(0.64, 0.92, -0.16), 0.10));     // vena cava
  d = smin(d, ves, 0.075);

  // Organic irregularity.
  d += 0.014 * sin(4.6 * q.x + 1.3) * sin(5.2 * q.y + 0.7) * sin(4.1 * q.z + 2.1);
  return d;
}

float map(vec3 p) {
  return mapHeart(toLocal(p)) * gScale;
}

vec3 calcNormal(vec3 p) {
  const vec2 e = vec2(0.0015, -0.0015);
  return normalize(
    e.xyy * map(p + e.xyy) +
    e.yyx * map(p + e.yyx) +
    e.yxy * map(p + e.yxy) +
    e.xxx * map(p + e.xxx)
  );
}

float calcAO(vec3 p, vec3 n) {
  float occ = 0.0;
  float sca = 1.0;
  for (int i = 1; i <= 4; i++) {
    float h = 0.05 * float(i);
    occ += (h - map(p + n * h)) * sca;
    sca *= 0.6;
  }
  return clamp(1.0 - 1.8 * occ, 0.0, 1.0);
}

/* ----------------------------------------------------------- heart pulse */

float beatWave(float beats) {
  float p = fract(beats);
  float lub = exp(-pow((p - 0.10) / 0.045, 2.0));
  float dub = 0.55 * exp(-pow((p - 0.34) / 0.075, 2.0));
  return lub + dub;
}

/* ---------------------------------------------------------------- main */

void main() {
  // Pulse + gentle idle motion.
  float beat = beatWave(uTime * uBeatHz);
  gScale = 1.0 + 0.05 * uPulseStrength * beat;
  float sway = 0.40 + 0.06 * sin(uTime * 0.26);
  gRot = rotX(0.10) * rotY(sway) * rotZ(-0.06);
  gBob = 0.025 * sin(uTime * 0.31);

  // Camera ray, focus-centred.
  vec2 suv = vUv - uFocus;
  suv.x *= uRes.x / uRes.y;
  vec3 ro = vec3(0.0, 0.0, CAM_DIST);
  vec3 rd = normalize(vec3(suv * uZoom, -1.0));

  // Raymarch with near-surface halo accumulation.
  float t = 0.6;
  float hit = -1.0;
  float halo = 0.0;
  for (int i = 0; i < MAX_STEPS; i++) {
    if (float(i) >= uSteps) break;
    vec3 pos = ro + rd * t;
    float d = map(pos);
    halo += exp(-abs(d) * 14.0);
    if (d < 0.0012 * t) { hit = t; break; }
    t += d * 0.9;
    if (t > MAX_DIST) break;
  }
  halo = 1.0 - exp(-halo * 0.028);

  // Background: near-black with a breathing glow behind the heart.
  vec3 col = vec3(0.012, 0.009, 0.011);
  col += vec3(0.05, 0.012, 0.02) * smoothstep(1.6, 0.0, length(suv));
  col += vec3(0.30, 0.05, 0.09) * exp(-dot(suv, suv) * 2.6) * (0.35 + 0.40 * beat) * uGlow * 0.5;
  col += vec3(0.02, 0.05, 0.06) * smoothstep(0.1, -1.0, suv.y) * 0.35;

  float tHit = hit > 0.0 ? hit : MAX_DIST;

  if (hit > 0.0) {
    vec3 p = ro + rd * hit;
    vec3 n = calcNormal(p);
    vec3 V = -rd;
    vec3 ql = toLocal(p);

    // Vascular network: voronoi edges in tissue space.
    vec3 v1 = voro(ql * 2.3 + 3.7);
    vec3 v2 = voro(ql * 5.0 + 9.1);
    float veins = clamp(
      (1.0 - smoothstep(0.0, 0.16, v1.y - v1.x)) +
      0.35 * (1.0 - smoothstep(0.0, 0.22, v2.y - v2.x)),
      0.0, 1.0
    );
    float patch = smoothstep(0.25, 0.7, fbm(ql * 1.6));
    veins *= mix(0.35, 1.0, patch);

    // Tissue base colour: deep arterial crimson / burgundy.
    float tex = fbm(ql * 3.1);
    vec3 alb = mix(vec3(0.20, 0.024, 0.048), vec3(0.40, 0.055, 0.082), tex);
    alb = mix(alb, vec3(0.52, 0.095, 0.115), veins * 0.55);

    // Lighting: soft key, crimson fill, cool back accent.
    vec3 L1 = normalize(vec3(-0.5, 0.65, 0.7));
    vec3 L2 = normalize(vec3(0.75, -0.2, 0.35));
    vec3 L3 = normalize(vec3(0.1, 0.4, -1.0));
    float ndl1 = clamp(dot(n, L1), 0.0, 1.0);
    float ndl2 = clamp(dot(n, L2), 0.0, 1.0);
    float ndl3 = clamp(dot(n, L3), 0.0, 1.0);
    float ao = calcAO(p, n);
    float fres = pow(1.0 - clamp(dot(n, V), 0.0, 1.0), 3.0);

    vec3 sh = alb * (vec3(0.045, 0.02, 0.032)
      + ndl1 * vec3(1.0, 0.93, 0.88) * 0.95
      + ndl2 * vec3(1.0, 0.22, 0.28) * 0.55) * ao;

    // Moist tissue sheen.
    sh += pow(clamp(dot(reflect(-L1, n), V), 0.0, 1.0), 40.0) * vec3(1.0, 0.85, 0.85) * 0.20 * ao;

    // Crimson rim, brighter during systole.
    sh += fres * mix(vec3(0.70, 0.10, 0.16), vec3(1.0, 0.34, 0.42), beat)
        * (0.45 + 0.85 * beat) * uGlow;

    // Cool computational back-light on the far edge.
    sh += ndl3 * fres * vec3(0.20, 0.45, 0.55) * 0.5;

    // Vascular illumination pulsing with the beat.
    sh += veins * patch * (0.10 + 0.85 * beat) * vec3(0.85, 0.16, 0.22) * uVascular;

    // Cyan scan contours drifting across the tissue.
    float scan = pow(0.5 + 0.5 * sin(ql.y * 42.0 - uTime * 0.9), 30.0);
    sh += scan * (0.25 + 0.75 * fres) * vec3(0.44, 0.84, 0.91) * 0.085;

    // Sparse measurement nodes at voronoi cell centres.
    float nodePt = 1.0 - smoothstep(0.05, 0.16, v1.x);
    float blink = 0.4 + 0.6 * sin(uTime * 1.5 + v1.z * 40.0);
    sh += nodePt * clamp(blink, 0.0, 1.0) * vec3(0.44, 0.84, 0.91) * 0.30;

    col = sh;
  }

  // Silhouette halo / cinematic aura.
  col += halo * vec3(0.55, 0.07, 0.12) * (0.5 + 0.5 * beat) * uGlow * 0.35;

  // Data trajectories: computational particles flowing into and out of the
  // great vessels, occluded by the heart body.
  if (uParticles > 0.5) {
    vec3 mouthLocal = vec3(0.02, 0.90, -0.10);
    for (int i = 0; i < 18; i++) {
      float fi = float(i);
      vec3 h = hash33(vec3(fi * 1.13 + 0.71, fi * 2.71 + 0.13, fi * 0.37 + 0.29));
      float sp = 0.05 + 0.06 * h.x;
      float s = fract(uTime * sp + h.y);
      float outward = mod(fi, 2.0);
      float se = mix(s, 1.0 - s, outward);

      float th = 6.2831 * h.y;
      vec3 P0 = vec3(2.4 * cos(th) * 0.9 + 0.9, 1.7 * sin(th) + 0.5, -0.4 + 1.2 * h.x);
      vec3 P2 = toWorld(mouthLocal + (h - 0.5) * 0.35);
      vec3 Pm = mix(P0, P2, 0.5) + vec3(0.0, 0.55, 0.35) * (h.x - 0.5) * 1.6;
      vec3 pp = mix(mix(P0, Pm, se), mix(Pm, P2, se), se);

      float tp = dot(pp - ro, rd);
      if (tp > 0.0 && tp < tHit) {
        vec3 cl = ro + rd * tp;
        float dr = length(cl - pp);
        float w = smoothstep(0.0, 0.10, s) * smoothstep(1.0, 0.86, s);
        vec3 pcol = outward > 0.5 ? vec3(1.0, 0.45, 0.5) * 0.7 : vec3(0.44, 0.84, 0.91);
        col += exp(-dr * dr * 2600.0) * w * pcol * 0.9;
        col += exp(-dr * dr * 300.0) * w * pcol * 0.025;
      }
    }
  }

  // Grade: exposure, vignette, tonemap, gamma, dither.
  col *= uExposure;
  float vg = 1.0 - uVignette * 0.55 * smoothstep(0.30, 1.25, length(vUv - vec2(0.5)));
  col *= vg;
  col = col / (1.0 + col);
  col = pow(max(col, 0.0), vec3(0.4545));
  col += (hash12(gl_FragCoord.xy + fract(uTime) * 61.7) - 0.5) * (2.0 / 255.0);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS) && !gl.isContextLost()) {
    // eslint-disable-next-line no-console
    console.error("CARDIA heart shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function createHeartRenderer(
  canvas: HTMLCanvasElement,
  initial: HeartRendererOptions
): HeartRenderer | null {
  const attrs: WebGLContextAttributes = {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "high-performance",
    preserveDrawingBuffer: false,
  };

  let gl: WebGLRenderingContext | null = null;
  try {
    gl = (canvas.getContext("webgl2", attrs) ??
      canvas.getContext("webgl", attrs) ??
      canvas.getContext("experimental-webgl", attrs)) as WebGLRenderingContext | null;
  } catch {
    gl = null;
  }
  if (!gl || gl.isContextLost()) return null;

  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  // Shaders are linked into the program; the standalone objects can go.
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS) && !gl.isContextLost()) {
    // eslint-disable-next-line no-console
    console.error("CARDIA heart program link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );

  gl.useProgram(program);
  const aPos = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const u = (name: string) => gl!.getUniformLocation(program, name);
  const loc = {
    res: u("uRes"),
    time: u("uTime"),
    focus: u("uFocus"),
    zoom: u("uZoom"),
    beatHz: u("uBeatHz"),
    pulseStrength: u("uPulseStrength"),
    glow: u("uGlow"),
    exposure: u("uExposure"),
    vignette: u("uVignette"),
    vascular: u("uVascular"),
    particles: u("uParticles"),
    steps: u("uSteps"),
  };

  const state: HeartRendererOptions = { ...initial };
  let width = 0;
  let height = 0;
  let disposed = false;

  const computeZoom = () => {
    const aspect = width > 0 && height > 0 ? width / height : 1.6;
    // Keep the whole heart (world half-width ~1.25) inside narrow viewports.
    const BASE_ZOOM = 0.8;
    const needed = 2.5 / (4.2 * Math.max(aspect, 0.05));
    return Math.max(BASE_ZOOM, needed);
  };

  return {
    resize(w: number, h: number) {
      if (disposed || !gl) return;
      let bw = Math.max(1, Math.round(w));
      let bh = Math.max(1, Math.round(h));
      const px = bw * bh;
      if (px > MAX_BUFFER_PIXELS) {
        const k = Math.sqrt(MAX_BUFFER_PIXELS / px);
        bw = Math.max(1, Math.round(bw * k));
        bh = Math.max(1, Math.round(bh * k));
      }
      if (canvas.width !== bw) canvas.width = bw;
      if (canvas.height !== bh) canvas.height = bh;
      width = bw;
      height = bh;
      gl.viewport(0, 0, bw, bh);
    },

    set(options: Partial<HeartRendererOptions>) {
      Object.assign(state, options);
    },

    render(timeSeconds: number) {
      if (disposed || !gl || gl.isContextLost() || width === 0) return;
      gl.useProgram(program);
      gl.uniform2f(loc.res, width, height);
      gl.uniform1f(loc.time, timeSeconds);
      // CSS focus (y down) -> GL UV (y up).
      gl.uniform2f(loc.focus, state.focus[0], 1.0 - state.focus[1]);
      gl.uniform1f(loc.zoom, computeZoom());
      gl.uniform1f(loc.beatHz, 0.85 * state.pulseSpeed);
      gl.uniform1f(loc.pulseStrength, state.pulseStrength);
      gl.uniform1f(loc.glow, state.glow);
      gl.uniform1f(loc.exposure, state.exposure);
      gl.uniform1f(loc.vignette, state.vignette);
      gl.uniform1f(loc.vascular, state.vascularGlow);
      gl.uniform1f(loc.particles, state.dataParticles ? 1 : 0);
      gl.uniform1f(loc.steps, state.quality >= 0.7 ? 96 : 68);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    dispose() {
      if (disposed) return;
      disposed = true;
      if (!gl) return;
      // Intentionally keep the context alive (StrictMode remounts reuse it);
      // just release GPU resources owned by this renderer.
      try {
        gl.deleteBuffer(buffer);
        gl.deleteProgram(program);
      } catch {
        /* context may already be lost */
      }
    },
  };
}
