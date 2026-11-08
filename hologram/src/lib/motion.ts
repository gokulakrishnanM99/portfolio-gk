/* Motion preference.
   The OS-level "reduce motion" setting (on Windows: Settings → Accessibility → Visual effects →
   Animation effects) is respected by default, but the visitor can opt into full motion.
   The choice is stored locally and mirrored as a class on <html> for CSS. */

export type MotionPref = 'full' | 'reduced';
const KEY = 'gkos-motion';

export const isCapture = () => typeof window !== 'undefined' && /[?&#]capture/.test(window.location.href);
export const systemReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function storedMotionPref(): MotionPref | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === 'full' || v === 'reduced' ? v : null;
  } catch { return null; }
}

export function saveMotionPref(p: MotionPref) {
  try { localStorage.setItem(KEY, p); } catch { /* storage blocked */ }
}

/** Effective setting right now. */
export function motionReduced(): boolean {
  if (isCapture()) return true;
  const p = storedMotionPref();
  return p ? p === 'reduced' : systemReducedMotion();
}

export function applyMotionClass(reduced: boolean) {
  document.documentElement.classList.toggle('reduce-motion', reduced);
}
