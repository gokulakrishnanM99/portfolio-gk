/* ============================================================================
   GK.OS — Orbital navigation
   All 8 pages live on a ring around the 3D core. Scrolling an open page pulls
   back into the ring; scrolling / dragging spins it; tapping a page dives in.

   Performance notes
   - Ring cards are light, purpose-built previews (no page clones, no blur).
   - Everything moves via transform/opacity on ~10 small elements, driven by one
     rAF loop that only runs while the ring is visible.
   ========================================================================== */
import { forwardRef, type ReactNode } from 'react';
import gsap from 'gsap';
import {
  BLOGS, CERTIFICATES, DESIGNS, MISSIONS, ORIGIN, PROFILE, PROJECTS, QUOTES, SECTORS,
  SKILL_GROUPS, SOCIALS, TELEMETRY, type SectorId,
} from '../data/profile';
import { sound } from '../lib/sound';
import type { HoloScene } from '../three/HoloScene';
import { IArrowRight, IChevronLeft, IChevronRight } from './icons';

export type OrbitMode = 'page' | 'ring' | 'busy';

/** ring tilt (deg): viewed from above so the core shows between the cards */
const RING_TILT = -15;

export interface OrbitCallbacks {
  onMode: (m: OrbitMode) => void;
  onFront: (k: number) => void;
  onOpen: (k: number) => void;
  blocked: () => boolean;
}

/* ---------------------------------------------------------------- previews */
function Preview({ id }: { id: SectorId }): ReactNode {
  switch (id) {
    case 'identity':
      return (
        <>
          <div className="op-big">{PROFILE.name}</div>
          <div className="op-line">{PROFILE.roles.join(' · ')}</div>
          <div className="op-stats">
            {TELEMETRY.map((t) => <div key={t.label}><b>{t.value}<small>{t.unit}</small></b><span>{t.label}</span></div>)}
          </div>
        </>
      );
    case 'origin':
      return (
        <>
          <div className="op-line op-em">{ORIGIN.title}</div>
          {ORIGIN.education.map((e) => (
            <div className="op-row" key={e.id}><span>{e.institution} · {e.degree.split(',')[0]}</span><b>{e.metric} <small>{e.metricLabel}</small></b></div>
          ))}
        </>
      );
    case 'missions':
      return MISSIONS.map((m) => (
        <div className="op-row" key={m.id}><span>{m.role} <em>@ {m.org}</em></span><small>{m.period.replace(/ – .*/, '')}</small></div>
      ));
    case 'arsenal':
      return <div className="op-chips">{PROJECTS.map((p) => <span key={p.id}>{p.title}</span>)}</div>;
    case 'matrix':
      return SKILL_GROUPS.map((g) => (
        <div className="op-row" key={g.id}><span>{g.label}</span><small>{g.skills.length} skills</small></div>
      ));
    case 'credentials':
      return (
        <>
          <div className="op-stats op-stats--3">
            <div><b>AIR 132</b><span>GATE 2021</span></div>
            <div><b>9.45</b><span>CPI · IIT Bombay</span></div>
            <div><b>{CERTIFICATES.length}</b><span>Certificates</span></div>
          </div>
          <div className="op-line">Best Summer Intern · 7+ cultural wins · Student Companion</div>
        </>
      );
    case 'transmissions':
      return (
        <>
          <div className="op-quote">“{QUOTES[0]}”</div>
          <div className="op-line">{BLOGS.length} blogs · {QUOTES.length} quotes · {DESIGNS.length} designs</div>
        </>
      );
    case 'uplink':
      return (
        <>
          <div className="op-line op-em">{PROFILE.email}</div>
          <div className="op-chips">{SOCIALS.map((s) => <span key={s.id}>{s.label}</span>)}<span>Resume PDF</span></div>
        </>
      );
  }
}

/* ---------------------------------------------------------------- markup */
export const OrbitLayer = forwardRef<HTMLDivElement, {
  front: number;
  onCard: (i: number) => void;
  onStep: (d: number) => void;
  onOpenFront: () => void;
}>(function OrbitLayer({ front, onCard, onStep, onOpenFront }, ref) {
  const f = SECTORS[front];
  return (
    <div className="orbit" ref={ref} aria-hidden={false}>
      <div className="orbit-tilt">
        <div className="orbit-ring">
          <div className="orbit-hub" aria-hidden />
          {SECTORS.map((s, i) => <div key={`sp-${s.id}`} className="orbit-spoke" data-i={i} aria-hidden />)}
          {SECTORS.map((s, i) => (
            <button key={s.id} className="ocard" data-i={i} onClick={() => onCard(i)}
              aria-label={`Open ${s.code} ${s.label} — ${s.title}`} tabIndex={-1}>
              <span className="oc-face">
                <span className="oc-head"><b>{s.code}</b><span>{s.label}</span><i aria-hidden /></span>
                <span className="oc-title">{s.title}</span>
                <span className="oc-hint">{s.hint}</span>
                <span className="oc-detail"><Preview id={s.id} /></span>
                <span className="oc-foot">Open <IArrowRight /></span>
              </span>
              <span className="oc-back" aria-hidden><b>{s.code}</b>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <button className="orbit-arrow l" onClick={() => onStep(-1)} aria-label="Rotate to previous page"><IChevronLeft /></button>
      <button className="orbit-arrow r" onClick={() => onStep(1)} aria-label="Rotate to next page"><IChevronRight /></button>

      <div className="orbit-caption">
        <div className="label">{f.code} // {f.label}</div>
        <div className="oc-cap-title">{f.title}</div>
        <div className="oc-cap-row">
          <button className="btn btn--primary btn--sm" onClick={onOpenFront}>Open page <IArrowRight /></button>
          <span className="orbit-help">Scroll or drag to rotate · tap a page to open · <span className="kbd">Esc</span> back</span>
        </div>
      </div>
    </div>
  );
});

/* ---------------------------------------------------------------- controller */
export class OrbitController {
  readonly N = SECTORS.length;
  readonly step = 360 / this.N;
  mode: OrbitMode = 'page';
  current = 0;            // open page
  p = 0;                  // ring position (float, in cards)
  target = 0;
  spread = 1;             // radius multiplier (for burst in/out)
  zoom = 0;               // 0..1 front card zooming towards the viewer
  zoomIdx = -1;
  tilt = RING_TILT;
  reduced = false;

  private R = 460;
  private cw = 340;
  private cards: HTMLElement[] = [];
  private spokes: HTMLElement[] = [];
  private ringEl!: HTMLElement;
  private tiltEl!: HTMLElement;
  private raf = 0;
  private last = 0;
  private frontIdx = -1;
  private tweening = false;
  private wheelTimer = 0;
  private wheelLockUntil = 0;
  private ch = 245;
  /** active pointers (mouse, pen, or each touch finger) */
  private pointers = new Map<number, { x: number; y: number }>();
  private drag: { cx: number; start: number; moved: boolean; vx: number; lx: number; lt: number } | null = null;
  private justDragged = false;
  private seq = 0;
  private tl: gsap.core.Timeline | null = null;
  private gestureStart = 0;
  private pendingSnap = false;

  constructor(private root: HTMLElement, private sectors: HTMLElement[], private scene: HoloScene | null, private cb: OrbitCallbacks) {
    this.ringEl = root.querySelector('.orbit-ring') as HTMLElement;
    this.tiltEl = root.querySelector('.orbit-tilt') as HTMLElement;
    this.cards = [...root.querySelectorAll<HTMLElement>('.ocard')];
    this.spokes = [...root.querySelectorAll<HTMLElement>('.orbit-spoke')];
    gsap.set(root, { autoAlpha: 0 });
    this.measure();
    window.addEventListener('resize', this.measure);
    window.addEventListener('wheel', this.onWheel, { passive: true });
    window.addEventListener('keydown', this.onKey);
    root.addEventListener('pointerdown', this.onDown);
    root.addEventListener('pointermove', this.onMove);
    root.addEventListener('pointerup', this.onUp);
    root.addEventListener('pointercancel', this.onUp);
  }

  dispose() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener('resize', this.measure);
    window.removeEventListener('wheel', this.onWheel);
    window.removeEventListener('keydown', this.onKey);
    this.root.removeEventListener('pointerdown', this.onDown);
    this.root.removeEventListener('pointermove', this.onMove);
    this.root.removeEventListener('pointerup', this.onUp);
    this.root.removeEventListener('pointercancel', this.onUp);
  }

  setScene(s: HoloScene | null) { this.scene = s; }
  setReduced(v: boolean) { this.reduced = v; }
  private D = (s: number) => (this.reduced ? s * 0.35 : s);
  private setMode(m: OrbitMode) { this.mode = m; this.cb.onMode(m); }
  /** Was the last pointer interaction a drag (so the click should be ignored)? */
  consumeDrag() { const d = this.justDragged; this.justDragged = false; return d; }

  /* ------------------------------------------------------------ layout */
  measure = () => {
    const W = window.innerWidth, H = window.innerHeight;
    const mobile = W < 760;
    this.cw = mobile ? Math.min(W * 0.6, 300) : Math.max(270, Math.min(400, W * 0.235, H * 0.44));
    const ch = this.cw * (mobile ? 0.98 : 0.68);
    this.ch = ch;
    this.R = (this.cw * (mobile ? 1.02 : 1.1)) / (2 * Math.tan(Math.PI / this.N));
    this.root.style.setProperty('--cw', `${this.cw}px`);
    this.root.style.setProperty('--ch', `${ch}px`);
    this.root.style.setProperty('--fs', `${this.cw / 340}`);
    this.root.style.setProperty('--R', `${this.R}px`);
    this.spokes.forEach((s, i) => {
      s.style.height = `${this.R}px`;
      s.style.transform = `rotateY(${i * this.step}deg) rotateX(90deg)`;
    });
    this.render();
  };

  /* ------------------------------------------------------------ frame */
  private loop = (now: number) => {
    const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 0.016);
    this.last = now;
    if (!this.tweening && !this.drag) this.p += (this.target - this.p) * (1 - Math.exp(-dt * 10));
    if (this.drag) this.p += (this.target - this.p) * (1 - Math.exp(-dt * 24));
    this.render();
    this.raf = requestAnimationFrame(this.loop);
  };
  private startLoop() { if (!this.raf) { this.last = 0; this.raf = requestAnimationFrame(this.loop); } }
  private stopLoop() { cancelAnimationFrame(this.raf); this.raf = 0; }

  private render() {
    const N = this.N;
    this.tiltEl.style.transform = `rotateX(${this.tilt}deg)`;
    this.ringEl.style.transform = `translateZ(${-this.R}px) rotateY(${-this.p * this.step}deg)`;
    let best = 0, bestA = 99;
    for (let i = 0; i < N; i++) {
      const c = this.cards[i];
      let rel = i - this.p;
      rel = (((rel % N) + N + N / 2) % N) - N / 2;
      const a = Math.abs(rel);
      if (a < bestA) { bestA = a; best = i; }
      const f = Math.max(0, 1 - a);
      let s = 1 + 0.18 * f;
      let z = this.R * this.spread;
      let op = Math.max(0.3, 1 - 0.2 * a);
      if (i === this.zoomIdx) { s *= 1 + this.zoom * 2.4; op *= 1 - this.zoom * 0.95; z += this.zoom * 160; }
      else op *= 1 - this.zoom;
      c.style.transform = `rotateY(${i * this.step}deg) translateZ(${z.toFixed(1)}px) scale(${s.toFixed(4)})`;
      c.style.opacity = op.toFixed(3);
      c.style.setProperty('--f', f.toFixed(3));
    }
    if (best !== this.frontIdx) {
      this.frontIdx = best;
      this.cards.forEach((c, i) => c.classList.toggle('is-front', i === best));
      this.cb.onFront(best);
      if (this.mode === 'ring') sound.tick();
    }
    if (this.mode !== 'page' && this.followCam) this.scene?.orbitView(this.p * this.step * 0.55);
  }
  private followCam = true;

  /* ------------------------------------------------------------ helpers */
  private nearest(k: number) {
    // equivalent position of card k closest to the current p
    const n = Math.round((this.p - k) / this.N);
    return k + n * this.N;
  }
  private frontIndex() { return ((Math.round(this.p) % this.N) + this.N) % this.N; }
  /** Await an animation. Chains onto any existing onComplete (never replaces it). */
  private play(tl: gsap.core.Timeline | gsap.core.Tween) {
    return new Promise<void>((res) => {
      const prev = tl.eventCallback('onComplete') as ((...a: unknown[]) => void) | null | undefined;
      tl.eventCallback('onComplete', (...a: unknown[]) => { prev?.(...a); res(); });
    });
  }

  /** Clear any in-flight rotation / wheel / pointer state. */
  private resetGestures() {
    gsap.killTweensOf(this, 'p');
    this.tweening = false;
    this.pendingSnap = false;
    window.clearTimeout(this.wheelTimer);
    this.pointers.clear();
    this.drag = null;
    this.root.classList.remove('is-dragging');
  }

  /** Snap after a gesture: any deliberate move advances at least one page in its direction. */
  private snapFrom(start: number) {
    const s0 = Math.round(start);
    const d = this.target - s0;
    if (Math.abs(d) < 0.12) this.target = s0;
    else this.target = d > 0 ? Math.max(s0 + 1, Math.round(this.target)) : Math.min(s0 - 1, Math.round(this.target));
  }

  /* ------------------------------------------------------------ commands */
  /** First page shown after boot (or on capture). */
  reveal(k: number, animate: boolean) {
    this.current = k;
    this.sectors.forEach((s, i) => { if (i !== k) gsap.set(s, { autoAlpha: 0 }); });
    const el = this.sectors[k];
    if (!animate) { gsap.set(el, { autoAlpha: 1 }); return; }
    gsap.fromTo(el, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 1.3, delay: 1.4, ease: 'expo.out', clearProps: 'transform' });
    el.querySelectorAll('[data-reveal]').forEach((n, j) => {
      gsap.fromTo(n, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, delay: 1.55 + j * 0.04, ease: 'power3.out', clearProps: 'transform,opacity' });
    });
  }

  /** Open page → ring (current page in front). */
  async enterRing(fast = false) {
    if (this.mode !== 'page') return;
    const my = ++this.seq;
    const k = this.current;
    this.resetGestures();
    this.p = this.target = this.nearest(k);
    this.zoomIdx = k; this.zoom = 1; this.spread = 1.25; this.tilt = -1;
    this.followCam = true;
    // swallow wheel momentum from the gesture that opened the ring, then every scroll counts
    this.wheelLockUntil = performance.now() + 450;
    this.startLoop();
    this.setMode('ring'); // input is live while the ring settles
    const sp = fast ? 0.7 : 1;
    const tl = gsap.timeline();
    tl.to(this.sectors[k], { scale: 0.8, autoAlpha: 0, duration: this.D(0.42 * sp), ease: 'power2.in' }, 0)
      .fromTo(this.root, { autoAlpha: 0 }, { autoAlpha: 1, duration: this.D(0.3 * sp) }, this.D(0.08))
      .to(this, { zoom: 0, spread: 1, tilt: RING_TILT, duration: this.D(0.75 * sp), ease: 'expo.out' }, this.D(0.1 * sp));
    sound.whoosh(0.9);
    this.tl = tl;
    await this.play(tl);
    if (my !== this.seq) return;
    gsap.set(this.sectors[k], { clearProps: 'transform' });
    this.zoomIdx = -1;
    this.tl = null;
  }

  /** Spin the ring to card k (shortest way). */
  private rotateTo(k: number) {
    const t = this.nearest(k);
    const d = Math.abs(t - this.p);
    if (d < 0.02) { this.p = this.target = t; return Promise.resolve(); }
    this.tweening = true;
    this.target = t;
    const tw = gsap.to(this, { p: t, duration: this.D(0.32 + 0.13 * Math.min(4, d)), ease: 'power3.inOut' });
    return this.play(tw).then(() => { this.target = this.p = t; this.tweening = false; });
  }

  /** Ring (or page) → open page k. */
  async open(k: number) {
    k = Math.max(0, Math.min(this.N - 1, k));
    if (this.mode === 'busy') return;
    if (this.mode === 'page') {
      if (k === this.current) return;
      await this.enterRing(true);
      if ((this.mode as OrbitMode) !== 'ring') return;
    }
    const my = ++this.seq;
    if (this.tl) { this.tl.progress(1); this.tl = null; this.zoomIdx = -1; }
    this.setMode('busy');
    await this.rotateTo(k);
    if (my !== this.seq) return;

    this.zoomIdx = k;
    this.current = k;
    this.followCam = false;
    this.cb.onOpen(k);
    this.scene?.flyTo(k, { duration: this.D(1.15) });
    sound.whoosh(0.8);
    const el = this.sectors[k];
    const tl = gsap.timeline();
    tl.to(this, { zoom: 1, spread: 1.35, tilt: -2, duration: this.D(0.62), ease: 'power2.in' }, 0)
      .to(this.root, { autoAlpha: 0, duration: this.D(0.3) }, this.D(0.36))
      .fromTo(el, { autoAlpha: 0, scale: 1.12 }, { autoAlpha: 1, scale: 1, duration: this.D(0.7), ease: 'expo.out', clearProps: 'transform' }, this.D(0.3));
    await this.play(tl);
    if (my !== this.seq) return;
    this.stopLoop();
    this.resetGestures();
    this.zoom = 0; this.spread = 1; this.zoomIdx = -1; this.tilt = RING_TILT;
    this.render();
    el.classList.remove('is-scanning'); void el.offsetWidth; el.classList.add('is-scanning');
    window.setTimeout(() => el.classList.remove('is-scanning'), 1200);
    this.setMode('page');
  }

  stepBy(d: number) {
    if (this.mode !== 'ring') return;
    this.target = Math.round(this.target) + d;
  }
  openFront() { if (this.mode === 'ring') this.open(this.frontIndex()); }

  /* ------------------------------------------------------------ input (ring mode) */
  /** Gesture zone: the orbital ring plus 50% more area around it. */
  private inZone(x: number, y: number) {
    const c = this.tiltEl.getBoundingClientRect(); // 0×0 element at the ring centre
    const hw = (this.R + this.cw * 0.6) * 1.5;
    const hh = (this.ch * 0.75 + this.R * 0.25) * 1.5;
    return Math.abs(x - c.left) <= hw && Math.abs(y - c.top) <= hh;
  }

  /** Mouse wheel, and two-finger trackpad scrolls in either direction. */
  private onWheel = (e: WheelEvent) => {
    if (this.mode !== 'ring' || this.cb.blocked() || e.ctrlKey) return;
    if (performance.now() < this.wheelLockUntil) return;
    if (!this.inZone(e.clientX, e.clientY)) return;
    let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) d *= 32;
    d = Math.max(-140, Math.min(140, d));
    if (!this.pendingSnap) { this.gestureStart = this.target; this.pendingSnap = true; }
    this.target += d * 0.0042;
    window.clearTimeout(this.wheelTimer);
    this.wheelTimer = window.setTimeout(() => { this.pendingSnap = false; this.snapFrom(this.gestureStart); }, 130);
  };

  private onKey = (e: KeyboardEvent) => {
    if (this.mode !== 'ring' || this.cb.blocked()) return;
    const t = e.target as HTMLElement;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA')) return;
    if (['ArrowRight', 'ArrowDown', 'PageDown'].includes(e.key)) { e.preventDefault(); this.stepBy(1); }
    else if (['ArrowLeft', 'ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); this.stepBy(-1); }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.openFront(); }
    else if (e.key === 'Escape') { e.preventDefault(); this.open(this.current); }
    else if (/^[1-9]$/.test(e.key) && Number(e.key) <= this.N) this.open(Number(e.key) - 1);
    else if (e.key === 'Home') this.open(0);
    else if (e.key === 'End') this.open(this.N - 1);
  };

  /* one-finger drag, mouse drag, and two-finger touch swipes (tracked by their centroid) */
  private centroid() {
    let x = 0;
    this.pointers.forEach((p) => { x += p.x; });
    return x / Math.max(1, this.pointers.size);
  }
  private beginDrag() {
    const cx = this.centroid();
    const now = performance.now();
    this.drag = { cx, start: this.target, moved: this.drag?.moved ?? false, vx: 0, lx: cx, lt: now };
  }
  private onDown = (e: PointerEvent) => {
    if (this.mode !== 'ring' || (e.target as HTMLElement).closest('.orbit-caption, .orbit-arrow')) return;
    if (!this.pointers.size && !this.inZone(e.clientX, e.clientY)) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.pendingSnap = false;
    window.clearTimeout(this.wheelTimer);
    this.beginDrag(); // a second finger re-bases the gesture on the new centroid
  };
  private onMove = (e: PointerEvent) => {
    const pt = this.pointers.get(e.pointerId);
    const d = this.drag;
    if (!pt || !d) return;
    pt.x = e.clientX; pt.y = e.clientY;
    const cx = this.centroid();
    const dx = cx - d.cx;
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true;
      this.pointers.forEach((_, id) => { try { this.root.setPointerCapture(id); } catch { /* pointer gone */ } });
      this.root.classList.add('is-dragging');
    }
    if (!d.moved) return;
    const now = performance.now();
    d.vx = (cx - d.lx) / Math.max(1, now - d.lt);
    d.lx = cx; d.lt = now;
    this.target = d.start - dx / (this.cw * 0.9);
  };
  private onUp = (e: PointerEvent) => {
    if (!this.pointers.delete(e.pointerId)) return;
    const d = this.drag;
    if (!d) return;
    if (this.pointers.size > 0) { this.beginDrag(); return; } // lifted one of two fingers — keep going
    this.drag = null;
    this.root.classList.remove('is-dragging');
    if (d.moved) {
      this.justDragged = true;
      window.setTimeout(() => { this.justDragged = false; }, 60);
      const fling = -d.vx * 220 / (this.cw * 0.9);
      this.target += Math.max(-2.5, Math.min(2.5, fling));
      this.snapFrom(d.start);
    }
  };
}
