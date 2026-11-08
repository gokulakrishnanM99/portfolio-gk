/* GLSL for the holographic world. All materials are additive & unlit. */

export const ringVert = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Procedural HUD ring drawn on a quad.
 * uMode: 0 = solid/dashed band, 1 = tick ring (major every uMajor), 2 = dotted
 */
export const ringFrag = /* glsl */ `
  #define TAU 6.28318530718
  uniform float uTime;
  uniform float uInner;
  uniform float uOuter;
  uniform float uSeg;
  uniform float uDuty;
  uniform float uSpeed;
  uniform float uArc;
  uniform float uArcStart;
  uniform float uOpacity;
  uniform float uMode;
  uniform float uMajor;
  uniform float uFlash;
  uniform vec3 uColor;
  varying vec2 vUv;

  void main() {
    vec2 p = vUv * 2.0 - 1.0;
    float r = length(p);
    float aa = fwidth(r) * 1.25;
    float inner = uInner;
    float a = atan(p.y, p.x) / TAU + 0.5;
    float ang = fract(a + uTime * uSpeed);
    float da = length(fwidth(p)) / max(r, 1e-3) / TAU;

    float m = 1.0;
    if (uMode > 0.5 && uMode < 1.5) {
      // tick ring
      float idx = floor(ang * uSeg);
      bool major = mod(idx, uMajor) < 0.5;
      inner = major ? uInner : mix(uInner, uOuter, 0.55);
      float f = fract(ang * uSeg);
      float fw = da * uSeg * 1.5;
      float w = major ? uDuty * 1.6 : uDuty;
      m = smoothstep(0.0, fw, f) * (1.0 - smoothstep(w, w + fw, f));
    } else if (uMode > 1.5) {
      // dotted
      float f = fract(ang * uSeg) - 0.5;
      float mid = (uInner + uOuter) * 0.5;
      float rad = (uOuter - uInner) * 0.5;
      float d = length(vec2(f * TAU * r / uSeg, r - mid));
      m = 1.0 - smoothstep(rad - aa, rad + aa, d);
    } else if (uSeg > 0.0) {
      float f = fract(ang * uSeg);
      float fw = da * uSeg * 1.5;
      m = smoothstep(0.0, fw, f) * (1.0 - smoothstep(uDuty - fw, uDuty, f));
    }

    float band = smoothstep(inner - aa, inner + aa, r) * (1.0 - smoothstep(uOuter - aa, uOuter + aa, r));
    if (uMode > 1.5) band = 1.0;

    float arc = fract(ang - uArcStart);
    float arcMask = uArc >= 0.999 ? 1.0 : (1.0 - smoothstep(uArc - 0.003, uArc, arc));

    float alpha = band * m * arcMask * uOpacity * (1.0 + uFlash * 1.5);
    if (alpha < 0.002) discard;
    gl_FragColor = vec4(uColor, alpha);
    #include <colorspace_fragment>
  }
`;

export const gridVert = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

export const gridFrag = /* glsl */ `
  uniform float uTime;
  uniform float uPulseR;
  uniform float uPulseA;
  uniform vec3 uColor;
  uniform vec3 uAccent;
  varying vec3 vWorld;

  float gridLine(vec2 g, float s, float w) {
    vec2 c = g / s;
    vec2 fw = fwidth(c);
    vec2 d = abs(fract(c - 0.5) - 0.5) / (fw * w);
    float l = 1.0 - min(min(d.x, d.y), 1.0);
    // anti-moire: fade lines once cells approach pixel size
    return l * (1.0 - smoothstep(0.08, 0.35, max(fw.x, fw.y)));
  }

  void main() {
    vec2 g = vWorld.xz;
    float d = length(g);
    float minor = gridLine(g, 1.0, 1.0);
    float major = gridLine(g, 5.0, 1.4);
    float fade = exp(-d * 0.085);
    float near = smoothstep(2.0, 4.5, d);
    float base = (minor * 0.035 + major * 0.11) * fade * near;

    // ambient ripple
    float rr = mod(uTime * 4.0, 48.0);
    float ripple = exp(-abs(d - rr) * 1.6) * 0.1 * fade * (1.0 - rr / 48.0);
    // navigation pulse
    float pulse = exp(-abs(d - uPulseR) * 2.2) * uPulseA * exp(-d * 0.03);

    vec3 col = uColor * (base + ripple * (major + minor * 0.6 + 0.15)) + uAccent * pulse * (0.35 + major);
    float a = base + ripple * 0.5 + pulse * 0.6;
    gl_FragColor = vec4(col, clamp(a, 0.0, 1.0));
    #include <colorspace_fragment>
  }
`;

export const pointsVert = /* glsl */ `
  attribute float aPhase;
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uBoost;
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    vec3 p = position;
    p.y += sin(uTime * 0.2 + aPhase) * 0.25;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = min(aSize * uPixelRatio * (34.0 / -mv.z) * (1.0 + uBoost * 0.6), 6.0 * uPixelRatio);
    float tw = 0.45 + 0.55 * sin(uTime * 1.4 + aPhase * 6.0);
    vAlpha = tw * smoothstep(80.0, 10.0, -mv.z) * smoothstep(1.5, 7.0, -mv.z) * (0.45 + uBoost * 0.6);
    vColor = aColor;
  }
`;

export const pointsFrag = /* glsl */ `
  varying float vAlpha;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    a = a * a * vAlpha;
    if (a < 0.003) discard;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`;

export const beamVert = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

export const beamFrag = /* glsl */ `
  #define TAU 6.28318530718
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  varying vec2 vUv;
  varying vec3 vN;
  varying vec3 vView;
  void main() {
    float h = vUv.y;
    float fall = pow(1.0 - h, 1.6) * smoothstep(0.0, 0.08, h);
    float rim = 1.0 - abs(dot(vN, vView));
    float streak = 0.65 + 0.35 * sin(vUv.x * TAU * 36.0 + uTime * 0.8);
    float scan = smoothstep(0.03, 0.0, abs(fract(h - uTime * 0.25) - 0.5) - 0.47);
    float a = (fall * (0.35 + rim * 0.9) * streak + scan * 0.25 * fall) * uOpacity;
    gl_FragColor = vec4(uColor, a);
    #include <colorspace_fragment>
  }
`;

export const pillarVert = /* glsl */ `
  attribute float aT;
  attribute float aPhase;
  uniform float uTime;
  varying float vA;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    float flicker = 0.7 + 0.3 * sin(uTime * 0.9 + aPhase * 9.0);
    vA = (1.0 - aT) * flicker * smoothstep(90.0, 20.0, -mv.z);
  }
`;

export const pillarFrag = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vA;
  void main() {
    gl_FragColor = vec4(uColor, vA * uOpacity);
    #include <colorspace_fragment>
  }
`;
