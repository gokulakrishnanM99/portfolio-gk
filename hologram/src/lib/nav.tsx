import { createContext, useContext, useEffect, useRef } from 'react';
import { SECTORS, type BlockId, type SectorId } from '../data/profile';
import type { MotionPref } from './motion';
import type { OrbitMode } from '../components/Orbit';
import { atBottom, atTop, scrollerOf } from './pages';

export type FocusKind = 'mission' | 'project' | 'skill';
export interface Focus { kind: FocusKind; id: string; nonce: number }

export type Overlay =
  | { type: 'radial' }
  | { type: 'palette' }
  | { type: 'vault'; category?: string }
  | { type: 'repos' }
  | { type: 'lightbox'; items: LightboxItem[]; index: number }
  | null;

export interface LightboxItem { src: string; title: string; sub?: string; video?: string; href?: string }

export type GateDir = 'down' | 'up';
/** End-of-page state: `armed` = the pause scroll happened (the next one moves on); `idle` = 40 s at the end. */
export interface GateState { armed: GateDir | null; idle: boolean }

export interface NavApi {
  /** page currently open */
  index: number;
  /** page at the front of the orbital ring */
  front: number;
  mode: OrbitMode;
  booted: boolean;
  /** open a page (through the orbital ring) */
  go: (i: number) => void;
  goId: (id: SectorId) => void;
  /** open the page holding a section and scroll to it */
  goBlock: (b: BlockId) => void;
  next: () => void;
  prev: () => void;
  /** leave the open page through its bottom (next page / orbit view) or its top (previous page) */
  advance: (dir: GateDir) => void;
  gate: GateState;
  /** pull back from the open page into the orbital ring */
  orbit: () => void;
  /** rotate the ring by n pages (ring mode) */
  step: (d: number) => void;
  openFront: () => void;
  focus: Focus | null;
  focusOn: (kind: FocusKind, id: string) => void;
  overlay: Overlay;
  setOverlay: (o: Overlay) => void;
  toast: (msg: string) => void;
  soundOn: boolean;
  toggleSound: () => void;
  reducedMotion: boolean;
  setMotion: (p: MotionPref) => void;
}

export const NavContext = createContext<NavApi | null>(null);
export const useNav = () => {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav outside provider');
  return ctx;
};

export const sectorIndex = (id: SectorId) => SECTORS.findIndex((s) => s.id === id);

/* --------------------------------------------------------------------------
   Input while a page is open (ring input lives in Orbit.tsx).

   Pages scroll vertically. Reaching the end does not leave the page at once:
   1. the gesture that scrolls to the end stops there (its momentum is ignored);
   2. the next gesture against the end is a pause: nothing moves, the end-of-page
      marker lights up and a hint appears;
   3. the gesture after that leaves the page (orbital transition to the next one;
      on the last page, to the orbit overview).
   The top edge works the same way towards the previous page (which opens at its end);
   the first page has nothing above it.
   Staying 40 s at the end (and only at the end) shows a reminder and arms step 3 directly. The reminder
   goes away as soon as the visitor is active again (mouse, click, tap, key) or scrolls away from the end;
   it can come back after another 40 quiet seconds at the end.
-------------------------------------------------------------------------- */
const IDLE_MS = 40_000;
const GAP_MS = 220;      // wheel events further apart than this start a new gesture
const MIN_ARM_MS = 350;  // pause → move needs at least this long between the two gestures
const WHEEL_THRESH = 40; // px of wheel travel that make a deliberate gesture
const SWIPE_MIN = 50;    // px of finger travel
const MOVE_MIN = 24;     // px of real mouse travel that count as the visitor being active

/** Keys that scroll the page or move between pages (handled as gestures, not as "activity"). */
export const SCROLL_KEYS = new Set(['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', ' ', 'Home', 'End']);

/** Can an element between the event target and the page scroller still scroll in `dir`? */
function nestedCanScroll(el: Element | null, stop: HTMLElement, dir: GateDir): boolean {
  while (el && el !== stop && el !== document.body) {
    const s = getComputedStyle(el);
    if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2) {
      if (dir === 'down' && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return true;
      if (dir === 'up' && el.scrollTop > 2) return true;
    }
    el = el.parentElement;
  }
  return false;
}

const isTyping = (t: EventTarget | null) => {
  const el = t as HTMLElement | null;
  return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.isContentEditable);
};

export function usePageInput(opts: {
  pageMode: boolean;
  free: boolean;
  index: number;
  count: number;
  reducedMotion: boolean;
  orbit: () => void;
  go: (i: number) => void;
  advance: (dir: GateDir) => void;
  onGate: (g: GateState) => void;
  onMenu: () => void;
  onPalette: () => void;
}) {
  const ref = useRef(opts);
  ref.current = opts;
  const st = useRef({
    armed: null as GateDir | null, armedGesture: -1, armedAt: 0, idle: false,
    gesture: 0, lastWheel: 0, acc: 0, scrolled: false, idleTimer: 0,
  });

  const emit = () => ref.current.onGate({ armed: st.current.armed, idle: st.current.idle });
  const disarm = () => {
    const g = st.current;
    if (!g.armed && !g.idle) return;
    g.armed = null; g.idle = false; emit();
  };
  /** One deliberate gesture against an edge of the open page. */
  const step = (dir: GateDir, gesture: number) => {
    const g = st.current;
    if (dir === 'up' && ref.current.index === 0) return; // nothing above the first page
    const now = performance.now();
    if (g.armed === dir && gesture !== g.armedGesture && now - g.armedAt > MIN_ARM_MS) {
      g.armed = null; g.idle = false; emit();
      ref.current.advance(dir);
      return;
    }
    if (g.armed !== dir) { g.armed = dir; g.idle = false; g.armedGesture = gesture; g.armedAt = now; emit(); }
  };

  /* wheel, touch and keys */
  useEffect(() => {
    const scroller = () => scrollerOf(ref.current.index);

    const onWheel = (e: WheelEvent) => {
      const o = ref.current;
      if (!o.pageMode || e.ctrlKey) return;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // sideways swipes belong to carousels
      const sc = scroller(); if (!sc) return;
      const g = st.current;
      const now = performance.now();
      if (now - g.lastWheel > GAP_MS) { g.gesture++; g.acc = 0; g.scrolled = false; }
      g.lastWheel = now;
      const d = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * sc.clientHeight : e.deltaY;
      if (!d) return;
      const dir: GateDir = d > 0 ? 'down' : 'up';
      if (nestedCanScroll(e.target as Element, sc, dir)) return; // an inner list scrolls first
      const edge = dir === 'down' ? atBottom(sc) : atTop(sc);
      if (!edge) { g.scrolled = true; return; }
      if (g.scrolled) return; // momentum of the gesture that just reached the edge
      g.acc += d;
      if (Math.abs(g.acc) < WHEEL_THRESH) return;
      g.acc = 0;
      step(dir, g.gesture);
    };

    let ty = 0, tx = 0, tt = 0, tStart: Element | null = null, startTop = 0, startDown = false, startUp = false;
    const onTouchStart = (e: TouchEvent) => {
      ty = e.touches[0].clientY; tx = e.touches[0].clientX; tt = performance.now();
      tStart = e.target as Element;
      const sc = scroller();
      startTop = sc?.scrollTop ?? 0;
      startDown = !!sc && atBottom(sc);
      startUp = !!sc && atTop(sc);
    };
    const onTouchEnd = (e: TouchEvent) => {
      const o = ref.current;
      if (!o.pageMode || e.touches.length > 0 || performance.now() - tt > 900) return;
      if (tStart?.closest?.('[data-no-swipe], .overlay, .drawer-wrap, .hud, .gate-hint')) return;
      const dy = ty - e.changedTouches[0].clientY;
      const dx = tx - e.changedTouches[0].clientX;
      if (Math.abs(dy) < SWIPE_MIN || Math.abs(dx) > Math.abs(dy)) return;
      const dir: GateDir = dy > 0 ? 'down' : 'up';
      const sc = scroller(); if (!sc) return;
      if (nestedCanScroll(tStart, sc, dir)) return;
      // only a swipe that started at the edge and didn't scroll the page counts
      if (!(dir === 'down' ? startDown : startUp) || Math.abs(sc.scrollTop - startTop) > 2) return;
      st.current.gesture++;
      step(dir, st.current.gesture);
    };

    const onKey = (e: KeyboardEvent) => {
      const o = ref.current;
      const typing = isTyping(e.target);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault(); o.onPalette(); return;
      }
      if (!o.free || typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'm' || e.key === 'M') { o.onMenu(); return; }
      if (!o.pageMode) return;
      const sc = scroller();
      const onControl = !!(e.target as HTMLElement)?.closest?.('button, a, [role="button"], [role="tab"]');
      const page = (sc?.clientHeight ?? 600) * 0.85;
      let dir: GateDir | null = null, amount = 0;
      if (e.key === 'ArrowDown') { dir = 'down'; amount = 90; }
      else if (e.key === 'ArrowUp') { dir = 'up'; amount = 90; }
      else if (e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey && !onControl)) { dir = 'down'; amount = page; }
      else if (e.key === 'PageUp' || (e.key === ' ' && e.shiftKey && !onControl)) { dir = 'up'; amount = page; }
      if (dir && sc) {
        e.preventDefault();
        const edge = dir === 'down' ? atBottom(sc) : atTop(sc);
        if (!edge) sc.scrollBy({ top: dir === 'down' ? amount : -amount, behavior: o.reducedMotion ? 'auto' : 'smooth' });
        else if (!e.repeat) { st.current.gesture++; step(dir, st.current.gesture); } // holding a key never skips the pause
        return;
      }
      if (e.key === 'Escape') { e.preventDefault(); o.orbit(); }
      else if (e.key === 'Home') { e.preventDefault(); o.go(0); }
      else if (e.key === 'End') { e.preventDefault(); o.go(o.count - 1); }
      else if (/^[1-9]$/.test(e.key) && Number(e.key) <= o.count) { o.go(Number(e.key) - 1); }
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('keydown', onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* per open page: leaving the edge disarms, and the 40-second end-of-page reminder */
  const { pageMode, index } = opts;
  useEffect(() => {
    const g = st.current;
    const clearIdle = () => { window.clearTimeout(g.idleTimer); g.idleTimer = 0; };
    g.armed = null; g.idle = false; g.scrolled = false; g.acc = 0;
    emit();
    if (!pageMode) return clearIdle;
    const sc = scrollerOf(index);
    if (!sc) return clearIdle;

    const startIdle = () => {
      clearIdle();
      if (document.hidden || !atBottom(sc)) return;
      g.idleTimer = window.setTimeout(() => {
        g.idleTimer = 0;
        if (!ref.current.pageMode || !atBottom(sc)) return;
        // 40 s at the end counts as the pause: the next scroll moves on
        g.idle = true; g.armed = 'down'; g.armedGesture = -1; g.armedAt = 0;
        emit();
      }, IDLE_MS);
    };
    const onScroll = () => {
      const bottom = atBottom(sc);
      if ((g.armed === 'down' || g.idle) && !bottom) disarm();
      else if (g.armed === 'up' && !atTop(sc)) disarm();
      if (!bottom) clearIdle();
      else if (!g.idleTimer && !g.idle) startIdle();
    };
    const onVis = () => {
      if (document.hidden) clearIdle();
      else if (!g.idle) startIdle(); // the 40 s count only while the page is visible
    };

    // visitor active again: drop the reminder (and the pause it armed) and start counting afresh
    const wake = () => {
      if (g.idle) { g.idle = false; g.armed = null; emit(); }
      startIdle(); // the 40 s are 40 quiet seconds (only counts at the end of the page)
    };
    let moved = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      moved += Math.abs(e.movementX) + Math.abs(e.movementY); // synthetic moves after a scroll have no travel
      if (moved < MOVE_MIN) return;
      moved = 0;
      wake();
    };
    const onClick = (e: MouseEvent) => { if (!(e.target as Element)?.closest?.('.gate-hint')) wake(); };
    const onKeyAct = (e: KeyboardEvent) => { if (!SCROLL_KEYS.has(e.key)) wake(); };

    // content that grows or shrinks without a scroll (lazy images, expanding panels) can move the end
    const ro = new ResizeObserver(() => onScroll());
    ro.observe(sc);
    Array.from(sc.children).forEach((c) => ro.observe(c));

    sc.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('resize', onScroll);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKeyAct);
    startIdle(); // a page shorter than the screen starts at its end
    return () => {
      clearIdle();
      ro.disconnect();
      sc.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('resize', onScroll);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('keydown', onKeyAct);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageMode, index]);
}
