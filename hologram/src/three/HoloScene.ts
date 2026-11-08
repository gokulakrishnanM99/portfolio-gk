import * as THREE from 'three';
import gsap from 'gsap';
import {
  ringVert, ringFrag, gridVert, gridFrag, pointsVert, pointsFrag,
  beamVert, beamFrag, pillarVert, pillarFrag,
} from './shaders';
import { buildPlexus, type Plexus } from './plexus';

/* ----------------------------------------------------------------------------
   Camera waypoints — one per sector, in cylindrical coordinates around the core.
   theta (deg) / r = orbit radius / h = height / sx,sy = where the core sits on
   screen (world units at the core's depth; +sx pushes the core to the right).
---------------------------------------------------------------------------- */
export interface Waypoint { theta: number; r: number; h: number; sx: number; sy: number; fov: number }

const WAYPOINTS: Waypoint[] = [
  { theta: 0, r: 13.5, h: 0.9, sx: 3.9, sy: 0.0, fov: 44 },     // identity
  { theta: 52, r: 21, h: 6.5, sx: -7.5, sy: 2.6, fov: 42 },      // origin
  { theta: 104, r: 15, h: 9.5, sx: 7.4, sy: -0.6, fov: 46 },     // missions
  { theta: 158, r: 13.5, h: -0.6, sx: 6.2, sy: -1.6, fov: 46 },  // arsenal (core behind detail panel)
  { theta: 212, r: 3.2, h: 17, sx: 8.2, sy: 0.4, fov: 50 },      // matrix (top-down radar)
  { theta: 266, r: 14, h: -2.4, sx: 5.6, sy: -3.2, fov: 46 },    // credentials (low angle)
  { theta: 318, r: 20, h: 6.5, sx: -8.2, sy: 0.6, fov: 42 },     // transmissions
  { theta: 360, r: 26, h: 3.2, sx: 0.0, sy: -9.4, fov: 40 },     // uplink (wide, core below)
];

const INTRO: Waypoint = { theta: -24, r: 52, h: 18, sx: 0, sy: 0, fov: 38 };

const CORE = new THREE.Vector3(0, 0.2, 0);
const FLOOR_Y = -3.4;
const UP = new THREE.Vector3(0, 1, 0);

const COL = {
  holo: new THREE.Color('#5fd4ff'),
  holoHi: new THREE.Color('#bdf0ff'),
  deep: new THREE.Color('#2a8fd0'),
  amber: new THREE.Color('#ffb547'),
};

export interface SceneOptions { lowPower: boolean; reducedMotion: boolean }
export interface CoreProjection { x: number; y: number; r: number; visible: boolean }

interface RingSpec {
  inner: number; outer: number; mode?: number; seg?: number; duty?: number; speed?: number;
  arc?: number; arcStart?: number; opacity?: number; color?: THREE.Color; major?: number;
}

export class HoloScene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  /** plexus networks: the JARVIS orb, floating clouds and the sky network map */
  private nets: { net: Plexus; obj: THREE.Object3D; spin: number; flash: number }[] = [];
  private orb!: Plexus;
  private clock = new THREE.Clock();
  private raf = 0;
  private running = false;
  private disposed = false;

  private ringMats: THREE.ShaderMaterial[] = [];
  private spinners: { obj: THREE.Object3D; axis: 'x' | 'y' | 'z'; speed: number }[] = [];
  private gridMat!: THREE.ShaderMaterial;
  private particleMat!: THREE.ShaderMaterial;
  private beamMat!: THREE.ShaderMaterial;
  private pillarMat!: THREE.ShaderMaterial;
  private glow!: THREE.Sprite;
  private sats: { pts: THREE.Points; orbit: THREE.Object3D; radius: number; speed: number; phase: number }[] = [];

  /** live camera params (interpolated) */
  private wp: Waypoint = { ...INTRO };
  /** When set, the camera eases continuously towards this waypoint (orbital ring view). */
  private follow: Waypoint | null = null;
  private flight: gsap.core.Tween | null = null;
  private roll = 0;
  private pointer = new THREE.Vector2();
  private pointerSmooth = new THREE.Vector2();
  private current = 0;
  private fx = { boost: 0, flash: 0, pulseR: 0, pulseA: 0 };
  private perf = { frames: 0, time: 0, checks: 0, degraded: false };

  private tmpDir = new THREE.Vector3();
  private tmpRight = new THREE.Vector3();
  private tmpUp = new THREE.Vector3();
  private tmpTarget = new THREE.Vector3();
  private tmpV = new THREE.Vector3();

  constructor(canvas: HTMLCanvasElement, private opts: SceneOptions) {
    this.renderer = new THREE.WebGLRenderer({
      canvas, antialias: !opts.lowPower, alpha: false, powerPreference: 'high-performance',
    });
    this.renderer.setClearColor(0x02060c, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, opts.lowPower ? 1.25 : 1.5));
    this.camera = new THREE.PerspectiveCamera(44, 1, 0.1, 400);
    this.scene.fog = null;

    this.buildSky();
    this.buildCore();
    this.buildNetworks();
    this.buildProjector();
    this.buildGrid();
    this.buildParticles();
    this.buildPillars();
    this.buildSatellites();
    this.resize();
    this.applyCamera(0);

    window.addEventListener('resize', this.resize);
    window.addEventListener('pointermove', this.onPointer, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  /* ============================================================ BUILDERS */
  private ring(spec: RingSpec): THREE.Mesh {
    const half = spec.outer * 1.04;
    const mat = new THREE.ShaderMaterial({
      vertexShader: ringVert,
      fragmentShader: ringFrag,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uInner: { value: spec.inner / half },
        uOuter: { value: spec.outer / half },
        uSeg: { value: spec.seg ?? 0 },
        uDuty: { value: spec.duty ?? 0.5 },
        uSpeed: { value: spec.speed ?? 0 },
        uArc: { value: spec.arc ?? 1 },
        uArcStart: { value: spec.arcStart ?? 0 },
        uOpacity: { value: spec.opacity ?? 0.5 },
        uMode: { value: spec.mode ?? 0 },
        uMajor: { value: spec.major ?? 5 },
        uFlash: { value: 0 },
        uColor: { value: (spec.color ?? COL.holo).clone() },
      },
    });
    this.ringMats.push(mat);
    return new THREE.Mesh(new THREE.PlaneGeometry(half * 2, half * 2), mat);
  }

  private flat(mesh: THREE.Mesh) { mesh.rotation.x = -Math.PI / 2; return mesh; }

  private buildCore() {
    const core = new THREE.Group();
    core.position.copy(CORE);
    this.scene.add(core);

    // Horizontal instrument rings
    core.add(this.flat(this.ring({ inner: 3.62, outer: 3.66, opacity: 0.55 })));
    core.add(this.flat(this.ring({ inner: 3.76, outer: 4.02, mode: 1, seg: 180, duty: 0.1, major: 5, speed: 0.004, opacity: 0.55 })));
    core.add(this.flat(this.ring({ inner: 3.04, outer: 3.22, seg: 6, duty: 0.84, speed: -0.012, opacity: 0.42 })));
    core.add(this.flat(this.ring({ inner: 4.3, outer: 4.32, seg: 120, duty: 0.55, speed: 0.006, opacity: 0.32 })));
    core.add(this.flat(this.ring({ inner: 4.42, outer: 4.5, arc: 0.18, arcStart: 0.1, speed: -0.02, opacity: 0.8, color: COL.amber })));

    // Gyroscopic tilted rings
    const gyroA = new THREE.Group();
    gyroA.rotation.set(0.55, 0, 0.25);
    const rA = this.ring({ inner: 2.56, outer: 2.6, seg: 72, duty: 0.5, speed: 0.02, opacity: 0.55 });
    gyroA.add(rA);
    const rA2 = this.ring({ inner: 2.66, outer: 2.72, arc: 0.62, speed: 0.035, opacity: 0.7 });
    gyroA.add(rA2);
    core.add(gyroA);
    this.spinners.push({ obj: gyroA, axis: 'y', speed: 0.12 });

    const gyroC = new THREE.Group();
    gyroC.rotation.set(Math.PI / 2, 0, 0.6);
    gyroC.add(this.ring({ inner: 2.95, outer: 2.97, opacity: 0.35 }));
    gyroC.add(this.ring({ inner: 3.02, outer: 3.1, mode: 1, seg: 96, duty: 0.14, major: 8, speed: -0.01, opacity: 0.4 }));
    core.add(gyroC);
    this.spinners.push({ obj: gyroC, axis: 'z', speed: 0.05 });

    // JARVIS orb — an organic plexus of ~1.5k nodes with a white-hot core
    this.orb = buildPlexus({
      count: this.opts.lowPower ? 650 : 1500, radius: 2.3, shape: 'ball', coreBias: 0.55, lumpy: 0.16,
      neighbours: 3, maxDist: 0.75, color: COL.holo, amp: 0.045, breath: 0.7,
      pointSize: 1.1, pointOpacity: 0.95, lineOpacity: 0.42, signals: 0.18, seed: 7,
    }, this.renderer.getPixelRatio());
    core.add(this.orb.group);
    this.nets.push({ net: this.orb, obj: this.orb.group, spin: 0.07, flash: 1 });

    // Core glow
    const tex = this.glowTexture();
    this.glow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, color: COL.holo, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    this.glow.scale.setScalar(7.5);
    core.add(this.glow);
    const hot = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, color: COL.holoHi, transparent: true, opacity: 0.55, blending: THREE.AdditiveBlending, depthWrite: false,
    }));
    hot.scale.setScalar(2.2);
    core.add(hot);
  }

  private buildProjector() {
    const proj = new THREE.Group();
    proj.position.set(0, FLOOR_Y + 0.01, 0);
    this.scene.add(proj);
    proj.add(this.flat(this.ring({ inner: 0.86, outer: 0.98, opacity: 0.9, color: COL.holoHi })));
    proj.add(this.flat(this.ring({ inner: 1.25, outer: 1.5, seg: 24, duty: 0.6, speed: 0.03, opacity: 0.55 })));
    proj.add(this.flat(this.ring({ inner: 1.95, outer: 2.15, mode: 1, seg: 90, duty: 0.14, major: 6, speed: -0.01, opacity: 0.5 })));
    proj.add(this.flat(this.ring({ inner: 4.8, outer: 4.83, opacity: 0.3 })));
    proj.add(this.flat(this.ring({ inner: 5.4, outer: 5.7, mode: 1, seg: 240, duty: 0.1, major: 10, speed: 0.002, opacity: 0.3 })));
    proj.add(this.flat(this.ring({ inner: 8.6, outer: 8.62, seg: 160, duty: 0.4, opacity: 0.18 })));

    this.beamMat = new THREE.ShaderMaterial({
      vertexShader: beamVert, fragmentShader: beamFrag, transparent: true, depthWrite: false,
      side: THREE.DoubleSide, blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uOpacity: { value: 0.12 }, uColor: { value: COL.holo.clone() } },
    });
    const h = CORE.y - FLOOR_Y + 0.6;
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(2.7, 0.92, h, 96, 1, true), this.beamMat);
    beam.position.y = FLOOR_Y + h / 2;
    this.scene.add(beam);
  }

  private buildGrid() {
    this.gridMat = new THREE.ShaderMaterial({
      vertexShader: gridVert, fragmentShader: gridFrag, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 }, uPulseR: { value: 0 }, uPulseA: { value: 0 },
        uColor: { value: COL.deep.clone() }, uAccent: { value: COL.holoHi.clone() },
      },
    });
    const grid = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), this.gridMat);
    grid.rotation.x = -Math.PI / 2;
    grid.position.y = FLOOR_Y;
    this.scene.add(grid);
  }

  private pointsMaterial() {
    return new THREE.ShaderMaterial({
      vertexShader: pointsVert, fragmentShader: pointsFrag, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uPixelRatio: { value: this.renderer.getPixelRatio() }, uBoost: { value: 0 } },
    });
  }

  private buildParticles() {
    const N = this.opts.lowPower ? 700 : 1400;
    const pos = new Float32Array(N * 3), phase = new Float32Array(N), size = new Float32Array(N), color = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = 5 + Math.pow(Math.random(), 0.7) * 60;
      const t = Math.random() * Math.PI * 2;
      pos[i * 3] = Math.cos(t) * r;
      pos[i * 3 + 1] = FLOOR_Y + Math.random() * 26;
      pos[i * 3 + 2] = Math.sin(t) * r;
      phase[i] = Math.random() * 10;
      size[i] = 0.6 + Math.random() * 1.8;
      (Math.random() < 0.07 ? COL.amber : Math.random() < 0.5 ? COL.holo : COL.holoHi).toArray(color, i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
    geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
    geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
    this.particleMat = this.pointsMaterial();
    this.scene.add(new THREE.Points(geo, this.particleMat));
  }

  private buildPillars() {
    const N = this.opts.lowPower ? 50 : 110;
    const pos: number[] = [], t: number[] = [], ph: number[] = [];
    for (let i = 0; i < N; i++) {
      const r = 14 + Math.random() * 55;
      const a = Math.random() * Math.PI * 2;
      const x = Math.cos(a) * r, z = Math.sin(a) * r;
      const h = 0.8 + Math.pow(Math.random(), 2.2) * 14;
      const p = Math.random() * 10;
      pos.push(x, FLOOR_Y, z, x, FLOOR_Y + h, z);
      t.push(0, 1);
      ph.push(p, p);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aT', new THREE.Float32BufferAttribute(t, 1));
    geo.setAttribute('aPhase', new THREE.Float32BufferAttribute(ph, 1));
    this.pillarMat = new THREE.ShaderMaterial({
      vertexShader: pillarVert, fragmentShader: pillarFrag, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uTime: { value: 0 }, uColor: { value: COL.holo.clone() }, uOpacity: { value: 0.35 } },
    });
    this.scene.add(new THREE.LineSegments(geo, this.pillarMat));
  }

  private buildSatellites() {
    const defs = [
      { radius: 5.6, tilt: [0.35, 0, 0.2], speed: 0.22 },
      { radius: 6.6, tilt: [-0.5, 0.4, -0.1], speed: -0.15 },
      { radius: 7.8, tilt: [0.15, 0.9, 0.45], speed: 0.1 },
    ];
    for (const d of defs) {
      const orbit = new THREE.Group();
      orbit.position.copy(CORE);
      orbit.rotation.set(d.tilt[0], d.tilt[1], d.tilt[2]);
      orbit.add(this.flat(this.ring({ inner: d.radius - 0.012, outer: d.radius + 0.012, seg: 220, duty: 0.35, opacity: 0.22 })));
      const TR = 26;
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(TR * 3), 3));
      const phase = new Float32Array(TR), size = new Float32Array(TR), color = new Float32Array(TR * 3);
      for (let i = 0; i < TR; i++) {
        phase[i] = 1.57;
        size[i] = i === 0 ? 5 : 3.2 * (1 - i / TR);
        (i === 0 ? COL.holoHi : COL.holo).toArray(color, i * 3);
      }
      geo.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));
      geo.setAttribute('aSize', new THREE.BufferAttribute(size, 1));
      geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));
      const pts = new THREE.Points(geo, this.particleMat);
      pts.frustumCulled = false;
      orbit.add(pts);
      this.scene.add(orbit);
      this.sats.push({ pts, orbit, radius: d.radius, speed: d.speed, phase: Math.random() * Math.PI * 2 });
    }
  }

  private glowTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const g = c.getContext('2d')!;
    const grd = g.createRadialGradient(128, 128, 0, 128, 128, 128);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.18, 'rgba(255,255,255,0.55)');
    grd.addColorStop(0.45, 'rgba(255,255,255,0.12)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 256, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }

  /** Deep navy-teal sky gradient with a soft horizon haze (replaces flat black). */
  private buildSky() {
    const mat = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, depthTest: false,
      uniforms: { uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec3 vDir;
        void main() {
          vDir = normalize(position);
          vec4 p = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          gl_Position = p.xyww;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTime;
        varying vec3 vDir;
        void main() {
          float y = vDir.y;
          vec3 zen = vec3(0.0008, 0.0022, 0.0048);
          vec3 hor = vec3(0.0032, 0.0150, 0.0300);
          vec3 low = vec3(0.0016, 0.0060, 0.0125);
          vec3 c = y > 0.0 ? mix(hor, zen, smoothstep(0.0, 0.7, y)) : mix(hor, low, smoothstep(0.0, 0.35, -y));
          float neb = sin(vDir.x * 3.1 + uTime * 0.02) * sin(vDir.y * 4.3 + 1.7) * sin(vDir.z * 2.7 + 0.6);
          c += vec3(0.0, 0.0050, 0.0110) * smoothstep(0.15, 0.95, neb);
          float haze = exp(-abs(y) * 9.0);
          c += vec3(0.002, 0.009, 0.016) * haze;
          gl_FragColor = vec4(c, 1.0);
          #include <colorspace_fragment>
        }`,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(200, 48, 24), mat);
    sky.renderOrder = -10;
    sky.frustumCulled = false;
    this.skyMat = mat;
    this.scene.add(sky);
  }
  private skyMat!: THREE.ShaderMaterial;

  /** Network map across the sky + floating plexus clouds (incl. a gold one). */
  private buildNetworks() {
    const pr = this.renderer.getPixelRatio();
    const low = this.opts.lowPower;
    const dome = buildPlexus({
      count: low ? 340 : 780, radius: 120, shape: 'shell', shell: [0.86, 1], minY: -30,
      neighbours: 3, maxDist: 30, color: new THREE.Color('#3aa8e0'), amp: 0.9, breath: 0,
      pointSize: 2.6, pointOpacity: 0.45, lineOpacity: 0.085, signals: 0.12, seed: 21,
    }, pr);
    this.scene.add(dome.group);
    this.nets.push({ net: dome, obj: dome.group, spin: 0.006, flash: 0 });

    const clouds = [
      { at: [-32, 17, -34], r: 7, n: 300, color: '#5fd4ff', seed: 31 },
      { at: [34, 10, -20], r: 8, n: 320, color: '#4fc3ff', seed: 32 },
      { at: [-26, 4, 30], r: 5.5, n: 220, color: '#7fe0ff', seed: 33 },
      { at: [30, 13, 28], r: 6, n: 260, color: '#ffb547', seed: 34 },
    ].slice(0, low ? 2 : 4);
    for (const c of clouds) {
      const net = buildPlexus({
        count: c.n, radius: c.r, shape: 'ball', coreBias: 0.7, lumpy: 0.25,
        neighbours: 3, maxDist: c.r * 0.42, color: new THREE.Color(c.color), amp: 0.12, breath: 0.5,
        pointSize: 1.7, pointOpacity: 0.75, lineOpacity: 0.3, signals: 0.2, seed: c.seed,
      }, pr);
      net.group.position.set(c.at[0], c.at[1], c.at[2]);
      net.group.rotation.set(c.seed * 0.3, c.seed, 0);
      this.scene.add(net.group);
      this.nets.push({ net, obj: net.group, spin: 0.04 + (c.seed % 3) * 0.015, flash: 0.4 });
    }
  }

  /* ============================================================ CAMERA */
  private applyCamera(dt: number) {
    if (this.follow) {
      const f = this.follow, w0 = this.wp;
      const k = 1 - Math.exp(-(dt || 0.016) * 3.2);
      let dth = f.theta - w0.theta;
      dth = ((dth % 360) + 540) % 360 - 180;
      w0.theta += dth * k;
      w0.r += (f.r - w0.r) * k; w0.h += (f.h - w0.h) * k;
      w0.sx += (f.sx - w0.sx) * k; w0.sy += (f.sy - w0.sy) * k; w0.fov += (f.fov - w0.fov) * k;
      this.roll *= 1 - k;
    }
    const w = this.wp;
    const th = THREE.MathUtils.degToRad(w.theta);
    const cam = this.camera;
    cam.position.set(Math.sin(th) * w.r, w.h, Math.cos(th) * w.r);

    // pointer parallax + idle drift
    const t = this.clock.elapsedTime;
    const k = 1 - Math.pow(0.0015, dt || 0.016);
    this.pointerSmooth.lerp(this.pointer, this.opts.reducedMotion ? 1 : k * 0.6);
    this.tmpDir.subVectors(CORE, cam.position).normalize();
    this.tmpRight.crossVectors(this.tmpDir, UP).normalize();
    this.tmpUp.crossVectors(this.tmpRight, this.tmpDir).normalize();
    const drift = this.opts.reducedMotion ? 0 : 1;
    cam.position
      .addScaledVector(this.tmpRight, this.pointerSmooth.x * 0.55 + Math.sin(t * 0.21) * 0.25 * drift)
      .addScaledVector(this.tmpUp, -this.pointerSmooth.y * 0.32 + Math.sin(t * 0.17) * 0.18 * drift);

    // target: offset so the core sits at (sx, sy) on screen
    this.tmpTarget.copy(CORE)
      .addScaledVector(this.tmpRight, -w.sx)
      .addScaledVector(this.tmpUp, -w.sy);

    cam.up.copy(UP).applyAxisAngle(this.tmpDir, this.roll);
    cam.lookAt(this.tmpTarget);
    if (Math.abs(cam.fov - w.fov) > 0.01) { cam.fov = w.fov; cam.updateProjectionMatrix(); }
  }

  /** A copy of a sector's camera waypoint. */
  waypoint(index: number): Waypoint {
    return { ...WAYPOINTS[Math.max(0, Math.min(WAYPOINTS.length - 1, index))] };
  }

  /**
   * Fly the camera to a sector. Returns duration (s).
   * `via` adds intermediate stops reached at normalised times `at` (0..1),
   * used by the orbital transitions to swing out to an overview of the core.
   */
  flyTo(index: number, opts: { duration?: number; immediate?: boolean; via?: { wp: Partial<Waypoint>; at: number }[] } = {}) {
    this.follow = null;
    const to = WAYPOINTS[Math.max(0, Math.min(WAYPOINTS.length - 1, index))];
    const dir = Math.sign(index - this.current) || 1;
    this.current = index;
    this.flight?.kill();
    if (opts.immediate || this.opts.reducedMotion) {
      this.wp = { ...to };
      this.roll = 0;
      return 0;
    }
    const from = { ...this.wp };
    const duration = opts.duration ?? 1.55;
    const p = { t: 0 };

    if (opts.via?.length) {
      // piecewise path through explicit stops, shortest angular route between each
      const stops: { wp: Waypoint; at: number }[] = [{ wp: from, at: 0 }];
      const push = (w: Waypoint, at: number) => {
        const prev = stops[stops.length - 1].wp;
        let d = w.theta - prev.theta;
        d = ((d % 360) + 540) % 360 - 180;
        stops.push({ wp: { ...w, theta: prev.theta + d }, at });
      };
      for (const v of opts.via) push({ ...from, ...v.wp }, v.at);
      push({ ...to }, 1);
      const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
      this.flight = gsap.to(p, {
        t: 1, duration, ease: 'none',
        onUpdate: () => {
          const t = p.t;
          let k = 0;
          while (k < stops.length - 2 && t > stops[k + 1].at) k++;
          const a = stops[k], b = stops[k + 1];
          const e = ease(Math.min(1, Math.max(0, (t - a.at) / Math.max(1e-4, b.at - a.at))));
          const L = THREE.MathUtils.lerp;
          this.wp.theta = L(a.wp.theta, b.wp.theta, e);
          this.wp.r = L(a.wp.r, b.wp.r, e);
          this.wp.h = L(a.wp.h, b.wp.h, e);
          this.wp.sx = L(a.wp.sx, b.wp.sx, e);
          this.wp.sy = L(a.wp.sy, b.wp.sy, e);
          this.wp.fov = L(a.wp.fov, b.wp.fov, e);
          const s = Math.sin(Math.PI * t);
          this.roll = -dir * 0.05 * s;
          this.fx.boost = s * 0.8;
        },
        onComplete: () => { this.roll = 0; this.fx.boost = 0; },
      });
      this.pulse();
      return duration;
    }

    let dTheta = to.theta - from.theta;
    dTheta = ((dTheta % 360) + 540) % 360 - 180;
    const bumpR = Math.min(7, 2 + Math.abs(dTheta) * 0.035);
    this.flight = gsap.to(p, {
      t: 1, duration, ease: 'power3.inOut',
      onUpdate: () => {
        const e = p.t;
        const s = Math.sin(Math.PI * e);
        this.wp.theta = from.theta + dTheta * e;
        this.wp.r = THREE.MathUtils.lerp(from.r, to.r, e) + bumpR * s;
        this.wp.h = THREE.MathUtils.lerp(from.h, to.h, e) + 1.6 * s;
        this.wp.sx = THREE.MathUtils.lerp(from.sx, to.sx, e);
        this.wp.sy = THREE.MathUtils.lerp(from.sy, to.sy, e);
        this.wp.fov = THREE.MathUtils.lerp(from.fov, to.fov, e) + 7 * s;
        this.roll = -dir * 0.07 * s;
        this.fx.boost = s;
      },
      onComplete: () => { this.roll = 0; this.fx.boost = 0; },
    });
    this.pulse();
    return duration;
  }

  /** Orbital-ring overview: core centred, camera turning with the ring. */
  orbitView(theta: number) {
    if (this.flight) { this.flight.kill(); this.flight = null; this.fx.boost = 0; }
    const portrait = this.camera.aspect < 1;
    this.follow = { theta, r: portrait ? 30 : 21, h: 3.4, sx: 0, sy: portrait ? -4.2 : 3.6, fov: 44 };
    if (this.opts.reducedMotion) { this.wp = { ...this.follow }; }
  }

  /** Cinematic arrival after boot. */
  intro(index = 0, duration = 3.2) {
    this.wp = { ...INTRO };
    this.current = -1;
    this.flyTo(index, { duration });
  }

  pulse() {
    gsap.killTweensOf(this.fx, 'pulseR,pulseA,flash');
    this.fx.pulseR = 0; this.fx.pulseA = 1; this.fx.flash = 1;
    gsap.to(this.fx, { pulseR: 46, duration: 2.6, ease: 'power2.out' });
    gsap.to(this.fx, { pulseA: 0, duration: 2.6, ease: 'power1.in' });
    gsap.to(this.fx, { flash: 0, duration: 0.9, ease: 'power2.out' });
  }

  /** Screen-space position & radius of the core, for HTML callouts. */
  projectCore(): CoreProjection {
    const el = this.renderer.domElement;
    const w = el.clientWidth, h = el.clientHeight;
    const v = this.tmpV.copy(CORE).project(this.camera);
    const x = (v.x * 0.5 + 0.5) * w;
    const y = (-v.y * 0.5 + 0.5) * h;
    const camRight = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    const edge = CORE.clone().addScaledVector(camRight, 3.9).project(this.camera);
    const r = Math.abs((edge.x * 0.5 + 0.5) * w - x);
    return { x, y, r, visible: v.z < 1 };
  }

  cameraReadout() {
    const p = this.camera.position;
    const heading = ((THREE.MathUtils.radToDeg(Math.atan2(p.x, p.z)) % 360) + 360) % 360;
    return { x: p.x, y: p.y, z: p.z, heading };
  }

  setPointer(x: number, y: number) { this.pointer.set(x, y); }

  setReducedMotion(v: boolean) { this.opts.reducedMotion = v; }

  /** Current camera flight tween (used by automated tests to scrub transitions). */
  get flightTween() { return this.flight; }

  /* ============================================================ LOOP */
  start() {
    if (this.running || this.disposed) return;
    this.running = true;
    this.clock.getDelta();
    const loop = () => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      this.tick();
    };
    loop();
  }

  stop() { this.running = false; cancelAnimationFrame(this.raf); }

  /** Adaptive quality: if the GPU can't hold ~45fps, render at 1× resolution. */
  private monitor(raw: number) {
    if (this.perf.degraded || this.perf.checks > 4) return;
    this.perf.frames++; this.perf.time += raw;
    if (this.perf.frames < 90) return;
    const avg = this.perf.time / this.perf.frames;
    this.perf.frames = 0; this.perf.time = 0; this.perf.checks++;
    if (avg > 1 / 45 && this.renderer.getPixelRatio() > 1) {
      this.perf.degraded = true;
      this.renderer.setPixelRatio(1);
      this.resize();
    }
  }

  private tick() {
    const raw = this.clock.getDelta();
    this.monitor(raw);
    const dt = Math.min(raw, 0.05);
    const t = this.clock.elapsedTime;
    const motion = this.opts.reducedMotion ? 0.15 : 1;

    for (const m of this.ringMats) {
      m.uniforms.uTime.value = t * motion;
      m.uniforms.uFlash.value = this.fx.flash;
    }
    for (const s of this.spinners) s.obj.rotation[s.axis] += s.speed * dt * motion;

    this.gridMat.uniforms.uTime.value = t * motion;
    this.gridMat.uniforms.uPulseR.value = this.fx.pulseR;
    this.gridMat.uniforms.uPulseA.value = this.fx.pulseA;
    this.particleMat.uniforms.uTime.value = t * motion;
    this.particleMat.uniforms.uBoost.value = this.fx.boost;
    this.skyMat.uniforms.uTime.value = t;
    for (const n of this.nets) {
      n.net.uniforms.uTime.value = t * motion;
      n.net.uniforms.uFlash.value = this.fx.flash * n.flash;
      n.obj.rotation.y += n.spin * dt * motion;
    }
    this.orb.uniforms.uBreath.value = 0.7 + this.fx.boost * 0.8;
    this.beamMat.uniforms.uTime.value = t * motion;
    this.pillarMat.uniforms.uTime.value = t * motion;

    const gm = this.glow.material as THREE.SpriteMaterial;
    gm.opacity = 0.26 + Math.sin(t * 1.6) * 0.04 + this.fx.flash * 0.25;

    for (const s of this.sats) {
      const attr = s.pts.geometry.getAttribute('position') as THREE.BufferAttribute;
      const base = s.phase + t * s.speed * motion;
      for (let i = 0; i < attr.count; i++) {
        const a = base - i * 0.018 * Math.sign(s.speed);
        attr.setXYZ(i, Math.cos(a) * s.radius, 0, Math.sin(a) * s.radius);
      }
      attr.needsUpdate = true;
    }

    this.applyCamera(dt);

    this.renderer.render(this.scene, this.camera);
  }

  /* ============================================================ EVENTS */
  private resize = () => {
    const w = window.innerWidth, h = window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    // keep framing on portrait screens: widen FOV a bit
    this.camera.updateProjectionMatrix();
    const pr = this.renderer.getPixelRatio();
    this.particleMat && (this.particleMat.uniforms.uPixelRatio.value = pr);
    this.nets.forEach((n) => { n.net.uniforms.uPixelRatio.value = pr; });
  };

  private onPointer = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    this.pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
  };

  private onVisibility = () => {
    if (document.hidden) this.stop(); else this.start();
  };

  dispose() {
    this.disposed = true;
    this.stop();
    this.flight?.kill();
    window.removeEventListener('resize', this.resize);
    window.removeEventListener('pointermove', this.onPointer);
    document.removeEventListener('visibilitychange', this.onVisibility);
    this.scene.traverse((o) => {
      const m = o as THREE.Mesh;
      m.geometry?.dispose?.();
      const mat = m.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((x) => x.dispose()); else mat?.dispose?.();
    });
    this.renderer.dispose();
  }
}

export const SECTOR_COUNT = WAYPOINTS.length;

export function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch { return false; }
}
