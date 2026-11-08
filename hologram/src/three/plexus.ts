/* ============================================================================
   Plexus network — nodes connected to their nearest neighbours, animated
   entirely on the GPU (drift, breathing ripple, "thinking" pulses and signals
   travelling along links). Used for the JARVIS orb, floating network clouds
   and the far network map that fills the sky.
   ========================================================================== */
import * as THREE from 'three';

export interface PlexusOptions {
  count: number;
  radius: number;
  /** 'ball' = filled volume (dense core), 'shell' = spherical shell between shell[0..1]×radius */
  shape: 'ball' | 'shell';
  shell?: [number, number];
  /** <1 pulls nodes towards the centre (dense, glowing core) */
  coreBias?: number;
  /** irregular, organic silhouette amount */
  lumpy?: number;
  /** keep only nodes above this height (shell skies) */
  minY?: number;
  neighbours: number;
  maxDist: number;
  color: THREE.Color;
  amp: number;
  breath?: number;
  pointSize: number;
  pointOpacity: number;
  lineOpacity: number;
  /** fraction of links that carry travelling signals */
  signals?: number;
  seed: number;
}

export interface Plexus {
  group: THREE.Group;
  uniforms: Record<string, THREE.IUniform>;
}

function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const COMMON = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform float uBreath;
  uniform float uFlash;
  uniform float uRadius;
  attribute vec3 aSeed;
  attribute float aCore;
  varying float vCore;
  vec3 displace(vec3 p) {
    float t = uTime;
    vec3 d = vec3(
      sin(t * 0.55 + aSeed.x * 6.2831 + p.y * 0.7),
      sin(t * 0.47 + aSeed.y * 6.2831 + p.z * 0.7),
      sin(t * 0.63 + aSeed.z * 6.2831 + p.x * 0.7));
    float r = length(p);
    vec3 n = r > 1e-4 ? p / r : vec3(0.0);
    float wave = sin(t * 1.3 - r / uRadius * 7.0);
    float push = wave * uBreath * uRadius * 0.035 + uFlash * uRadius * 0.12 * (1.0 - 0.5 * r / uRadius);
    return p + d * uAmp + n * push;
  }
`;

const POINT_VERT = /* glsl */ `
  ${COMMON}
  attribute float aSize;
  uniform float uPixelRatio;
  uniform float uPointSize;
  varying float vTw;
  void main() {
    vec3 p = displace(position);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(aSize * uPointSize * uPixelRatio * (30.0 / -mv.z), 1.0, 10.0 * uPixelRatio);
    vTw = 0.55 + 0.45 * sin(uTime * 2.1 + aSeed.x * 31.0);
    vCore = aCore;
  }
`;

const POINT_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uPointOpacity;
  uniform float uFlash;
  varying float vTw;
  varying float vCore;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a * (0.6 + 0.4 * smoothstep(0.18, 0.0, d));
    vec3 col = mix(uColor, vec3(1.0), vCore * 0.65 + uFlash * 0.25);
    float alpha = a * uPointOpacity * vTw * (0.45 + vCore * 0.9 + uFlash * 0.5);
    if (alpha < 0.003) discard;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

const LINE_VERT = /* glsl */ `
  ${COMMON}
  attribute float aT;
  attribute vec2 aEdge;
  varying float vT;
  varying vec2 vEdge;
  void main() {
    vec3 p = displace(position);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
    vT = aT;
    vEdge = aEdge;
    vCore = aCore;
  }
`;

const LINE_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uLineOpacity;
  uniform float uSignals;
  uniform float uTime;
  uniform float uFlash;
  varying float vT;
  varying vec2 vEdge;
  varying float vCore;
  void main() {
    float fade = 1.0 - vEdge.y;
    float a = uLineOpacity * fade * fade * (0.35 + vCore * 0.9 + uFlash * 0.6);
    float has = step(1.0 - uSignals, vEdge.x);
    float head = fract(uTime * (0.25 + vEdge.x * 0.3) + vEdge.x * 7.0);
    float pulse = has * smoothstep(0.14, 0.0, abs(vT - head));
    vec3 col = mix(uColor, vec3(1.0), pulse * 0.7 + vCore * 0.35);
    float alpha = a + pulse * uLineOpacity * 2.2;
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(col, alpha);
    #include <colorspace_fragment>
  }
`;

export function buildPlexus(o: PlexusOptions, pixelRatio: number): Plexus {
  const rand = rng(o.seed);
  const pos: number[] = [];
  const seeds: number[] = [];
  const cores: number[] = [];
  const sizes: number[] = [];
  let guard = 0;
  while (pos.length / 3 < o.count && guard++ < o.count * 20) {
    // random direction
    const u = rand() * 2 - 1, th = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const dx = s * Math.cos(th), dy = u, dz = s * Math.sin(th);
    let r: number;
    if (o.shape === 'shell') {
      const [a, b] = o.shell ?? [0.85, 1];
      r = o.radius * (a + rand() * (b - a));
    } else {
      r = o.radius * Math.pow(rand(), o.coreBias ?? 0.6);
    }
    if (o.lumpy) {
      const lump = 1 + o.lumpy * Math.sin(3.1 * dx + 1.3) * Math.sin(2.6 * dy + 0.4) * Math.sin(2.9 * dz + 2.1) * 2.2;
      r *= lump;
    }
    const x = dx * r, y = dy * r, z = dz * r;
    if (o.minY !== undefined && y < o.minY) continue;
    pos.push(x, y, z);
    seeds.push(rand(), rand(), rand());
    const core = o.shape === 'ball' ? Math.max(0, 1 - Math.sqrt(x * x + y * y + z * z) / o.radius) : 0;
    cores.push(core * core);
    sizes.push(0.6 + rand() * 1.4 + core * 1.2);
  }
  const N = pos.length / 3;

  // nearest-neighbour links (brute force, once)
  const edges: [number, number, number][] = [];
  const seen = new Set<number>();
  const md2 = o.maxDist * o.maxDist;
  const best = new Array<[number, number]>(o.neighbours);
  for (let i = 0; i < N; i++) {
    for (let k = 0; k < o.neighbours; k++) best[k] = [Infinity, -1];
    const xi = pos[i * 3], yi = pos[i * 3 + 1], zi = pos[i * 3 + 2];
    for (let j = 0; j < N; j++) {
      if (j === i) continue;
      const ddx = pos[j * 3] - xi, ddy = pos[j * 3 + 1] - yi, ddz = pos[j * 3 + 2] - zi;
      const d2 = ddx * ddx + ddy * ddy + ddz * ddz;
      if (d2 > md2 || d2 >= best[o.neighbours - 1][0]) continue;
      let k = o.neighbours - 1;
      while (k > 0 && best[k - 1][0] > d2) { best[k] = best[k - 1]; k--; }
      best[k] = [d2, j];
    }
    for (const [d2, j] of best) {
      if (j < 0) continue;
      const key = i < j ? i * N + j : j * N + i;
      if (seen.has(key)) continue;
      seen.add(key);
      edges.push([i, j, Math.sqrt(d2) / o.maxDist]);
    }
  }

  const uniforms: Record<string, THREE.IUniform> = {
    uTime: { value: 0 },
    uAmp: { value: o.amp },
    uBreath: { value: o.breath ?? 0.6 },
    uFlash: { value: 0 },
    uRadius: { value: o.radius },
    uColor: { value: o.color.clone() },
    uPixelRatio: { value: pixelRatio },
    uPointSize: { value: o.pointSize },
    uPointOpacity: { value: o.pointOpacity },
    uLineOpacity: { value: o.lineOpacity },
    uSignals: { value: o.signals ?? 0.25 },
  };

  // points
  const pg = new THREE.BufferGeometry();
  pg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  pg.setAttribute('aSeed', new THREE.Float32BufferAttribute(seeds, 3));
  pg.setAttribute('aCore', new THREE.Float32BufferAttribute(cores, 1));
  pg.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
  const pm = new THREE.ShaderMaterial({
    vertexShader: POINT_VERT, fragmentShader: POINT_FRAG, uniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });

  // lines
  const lp: number[] = [], ls: number[] = [], lc: number[] = [], lt: number[] = [], le: number[] = [];
  for (const [i, j, len] of edges) {
    const es = rand();
    for (const [n, t] of [[i, 0], [j, 1]] as const) {
      lp.push(pos[n * 3], pos[n * 3 + 1], pos[n * 3 + 2]);
      ls.push(seeds[n * 3], seeds[n * 3 + 1], seeds[n * 3 + 2]);
      lc.push(cores[n]);
      lt.push(t);
      le.push(es, len);
    }
  }
  const lg = new THREE.BufferGeometry();
  lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
  lg.setAttribute('aSeed', new THREE.Float32BufferAttribute(ls, 3));
  lg.setAttribute('aCore', new THREE.Float32BufferAttribute(lc, 1));
  lg.setAttribute('aT', new THREE.Float32BufferAttribute(lt, 1));
  lg.setAttribute('aEdge', new THREE.Float32BufferAttribute(le, 2));
  const lm = new THREE.ShaderMaterial({
    vertexShader: LINE_VERT, fragmentShader: LINE_FRAG, uniforms,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const group = new THREE.Group();
  const lines = new THREE.LineSegments(lg, lm);
  const points = new THREE.Points(pg, pm);
  lines.frustumCulled = false;
  points.frustumCulled = false;
  group.add(lines, points);
  return { group, uniforms };
}
