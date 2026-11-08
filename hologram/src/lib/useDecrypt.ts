import { useEffect, useState } from 'react';
import { motionReduced } from './motion';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+<>/\\[]{}=';
const isLatin = (s: string) => /^[\u0000-ɏ -⁯²⟶\s]*$/.test(s);

/**
 * Holographic "decrypt" text effect. Characters resolve left→right from noise.
 * Non-latin scripts are returned as-is (callers fade them instead).
 */
export function useDecrypt(text: string, play: boolean, duration = 900, delay = 0) {
  const [out, setOut] = useState(play ? '' : text);

  useEffect(() => {
    if (!play) return;
    const reduce = motionReduced();
    if (reduce || !isLatin(text)) { setOut(text); return; }
    const chars = [...text];
    const reveal = chars.map((_, i) => (i / Math.max(1, chars.length)) * 0.65 + Math.random() * 0.35);
    let raf = 0;
    let start = 0;
    const t0 = window.setTimeout(() => {
      const step = (now: number) => {
        if (!start) start = now;
        const p = Math.min(1, (now - start) / duration);
        let s = '';
        for (let i = 0; i < chars.length; i++) {
          const c = chars[i];
          if (c === ' ' || c === '\n' || p >= reveal[i]) s += c;
          else if (p >= reveal[i] - 0.25) s += GLYPHS[(Math.random() * GLYPHS.length) | 0];
          else s += ' ';
        }
        setOut(s);
        if (p < 1) raf = requestAnimationFrame(step);
        else setOut(text);
      };
      raf = requestAnimationFrame(step);
    }, delay);
    return () => { clearTimeout(t0); cancelAnimationFrame(raf); };
  }, [text, play, duration, delay]);

  return play ? out : text;
}

export { isLatin };
