import { createContext, useContext, useEffect, useRef } from 'react';
import { SECTORS, type SectorId } from '../data/profile';
import type { MotionPref } from './motion';
import type { OrbitMode } from '../components/Orbit';

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
  next: () => void;
  prev: () => void;
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
   Input while a page is open. Any scroll / swipe that the page itself doesn't
   consume pulls back into the orbital ring (ring input lives in Orbit.tsx).
-------------------------------------------------------------------------- */
function scrollableAncestor(el: Element | null, dir: number): boolean {
  while (el && el !== document.body) {
    const s = getComputedStyle(el);
    if ((s.overflowY === 'auto' || s.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2) {
      if (dir > 0 && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return true;
      if (dir < 0 && el.scrollTop > 2) return true;
    }
    el = el.parentElement;
  }
  return false;
}

export function usePageInput(opts: {
  pageMode: boolean;
  free: boolean;
  orbit: () => void;
  go: (i: number) => void;
  count: number;
  onMenu: () => void;
  onPalette: () => void;
}) {
  const ref = useRef(opts);
  ref.current = opts;

  useEffect(() => {
    let acc = 0;
    let lastWheel = 0;
    const THRESH = 40;

    const onWheel = (e: WheelEvent) => {
      const o = ref.current;
      if (!o.pageMode || e.ctrlKey) return;
      const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
      const d = horizontal ? e.deltaX : e.deltaY;
      if (!horizontal && scrollableAncestor(e.target as Element, Math.sign(d))) { acc = 0; return; }
      if ((e.target as Element).closest?.('[data-no-swipe]')) return;
      const now = performance.now();
      if (now - lastWheel > 300) acc = 0;
      lastWheel = now;
      acc += e.deltaMode === 1 ? d * 32 : d;
      if (Math.abs(acc) > THRESH) { acc = 0; o.orbit(); }
    };

    let ty = 0, tx = 0, tt = 0, tStart: Element | null = null;
    const onTouchStart = (e: TouchEvent) => {
      ty = e.touches[0].clientY; tx = e.touches[0].clientX; tt = performance.now();
      tStart = e.target as Element;
    };
    const onTouchEnd = (e: TouchEvent) => {
      const o = ref.current;
      if (!o.pageMode || performance.now() - tt > 900) return;
      if (tStart?.closest?.('[data-no-swipe], .overlay, .drawer-wrap')) return;
      const dy = ty - e.changedTouches[0].clientY;
      const dx = tx - e.changedTouches[0].clientX;
      if (Math.max(Math.abs(dx), Math.abs(dy)) < 60) return;
      if (Math.abs(dy) > Math.abs(dx) && scrollableAncestor(tStart, Math.sign(dy))) return;
      o.orbit();
    };

    const onKey = (e: KeyboardEvent) => {
      const o = ref.current;
      const t = e.target as HTMLElement;
      const typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault(); o.onPalette(); return;
      }
      if (!o.free || typing) return;
      if (e.key === 'm' || e.key === 'M') { o.onMenu(); return; }
      if (!o.pageMode) return;
      if (['ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Escape'].includes(e.key) || e.key === ' ') { e.preventDefault(); o.orbit(); }
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
  }, []);
}
