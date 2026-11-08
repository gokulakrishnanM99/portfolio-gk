import { useEffect, useRef } from 'react';
import { HoloScene, supportsWebGL } from '../three/HoloScene';

import { isCapture, motionReduced } from '../lib/motion';

/** `#…&capture` skips boot + motion (used for automated screenshots). */
export { isCapture };
export const prefersReducedMotion = motionReduced;

export const isLowPower = () => {
  if (typeof window === 'undefined') return true;
  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 600;
  const cores = navigator.hardwareConcurrency || 4;
  return coarse || small || cores <= 2;
};

/** Fixed full-screen WebGL world. Falls back to the CSS gradient if WebGL is unavailable. */
export function World({ onReady }: { onReady: (scene: HoloScene | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!ref.current || !supportsWebGL()) { onReady(null); return; }
    let scene: HoloScene | null = null;
    try {
      scene = new HoloScene(ref.current, { lowPower: isLowPower(), reducedMotion: prefersReducedMotion() });
      scene.start();
    } catch (err) {
      console.warn('[GK.OS] WebGL unavailable, running in 2D mode', err);
      scene = null;
    }
    onReady(scene);
    return () => scene?.dispose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="world" aria-hidden>
      <canvas ref={ref} />
    </div>
  );
}
