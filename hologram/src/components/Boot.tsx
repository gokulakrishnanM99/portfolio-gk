import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { sound } from '../lib/sound';
import { motionReduced } from '../lib/motion';

const STEPS = [
  'Initialising GK.OS kernel',
  'Loading neural core',
  'Syncing mission archive [3]',
  'Mounting project arsenal [6]',
  'Indexing capability matrix',
  'Calibrating holographic projection',
];

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return 'Working late. Welcome.';
  if (h < 12) return 'Good morning. Welcome.';
  if (h < 17) return 'Good afternoon. Welcome.';
  return 'Good evening. Welcome.';
}

const C80 = 2 * Math.PI * 80;

export function Boot({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const finished = useRef(false);
  const doneRef = useRef(onDone);
  doneRef.current = onDone; // always call the latest callback (the scene may arrive after mount)
  const skip = useRef(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('gkos-booted') === '1'; } catch { /* ignore */ }
    const reduce = motionReduced();
    const minDur = reduce ? 400 : seen ? 1100 : 2700;
    let fontsReady = false;
    (document.fonts?.ready ?? Promise.resolve()).then(() => { fontsReady = true; });
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const elapsed = now - start;
      let target = Math.min(1, elapsed / minDur);
      if (!fontsReady) target = Math.min(target, 0.92);
      if (skip.current && fontsReady) target = 1;
      // eased, slightly stepped progress for a "loading" cadence
      const eased = target < 1 ? Math.floor((1 - Math.pow(1 - target, 2.2)) * 100) / 100 : 1;
      setP(eased);
      if (eased >= 1) { finish(); return; }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    const onSkip = () => { skip.current = true; };
    window.addEventListener('keydown', onSkip);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('keydown', onSkip); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    setDone(true);
    try { sessionStorage.setItem('gkos-booted', '1'); } catch { /* ignore */ }
    sound.chord();
    const el = root.current;
    if (!el) { doneRef.current(); return; }
    const tl = gsap.timeline({ onComplete: () => doneRef.current() });
    tl.to(el.querySelector('.boot-core'), { scale: 1.08, duration: 0.5, ease: 'power2.out' }, 0.45)
      .to(el.querySelector('.boot-core'), { scale: 3.2, opacity: 0, duration: 0.9, ease: 'expo.in' }, 0.95)
      .to(el.querySelectorAll('.boot-log, .boot-skip, .boot-brand, .boot-greet'), { opacity: 0, duration: 0.4 }, 0.95)
      .to(el, { opacity: 0, duration: 0.6, ease: 'power2.inOut' }, 1.45);
  };

  const shown = Math.min(STEPS.length, Math.floor(p * (STEPS.length + 0.6)));

  return (
    <div className="boot" ref={root} onClick={() => { skip.current = true; }} role="status" aria-live="polite" aria-label={`Loading interface, ${Math.round(p * 100)} percent`}>
      <div className="boot-brand">GK.OS — Holographic interface · v4.0</div>
      <div className="boot-core">
        <svg viewBox="0 0 200 200" aria-hidden>
          <defs>
            <filter id="bglow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.2" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          <g style={{ transformOrigin: '100px 100px', animation: 'spin 40s linear infinite' }}>
            <circle cx="100" cy="100" r="97" fill="none" stroke="rgba(95,212,255,.35)" strokeWidth="0.6" strokeDasharray="1 3" />
          </g>
          <g style={{ transformOrigin: '100px 100px', animation: 'spin 60s linear infinite reverse' }}>
            <circle cx="100" cy="100" r="89" fill="none" stroke="rgba(95,212,255,.5)" strokeWidth="5" strokeDasharray="0.6 4.06" />
          </g>
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(95,212,255,.12)" strokeWidth="2" />
          <circle cx="100" cy="100" r="80" fill="none" stroke="#5fd4ff" strokeWidth="2.2" filter="url(#bglow)"
            strokeDasharray={C80} strokeDashoffset={C80 * (1 - p)} transform="rotate(-90 100 100)" strokeLinecap="round" />
          <g style={{ transformOrigin: '100px 100px', animation: 'spin 9s linear infinite reverse' }}>
            <circle cx="100" cy="100" r="70" fill="none" stroke="rgba(95,212,255,.55)" strokeWidth="4" strokeDasharray="56 17.3" />
          </g>
          <g style={{ transformOrigin: '100px 100px', animation: 'spin 5s linear infinite' }}>
            <circle cx="100" cy="100" r="62" fill="none" stroke="#ffb547" strokeWidth="1.4" strokeDasharray="22 368" filter="url(#bglow)" />
          </g>
          <circle cx="100" cy="100" r="56" fill="none" stroke="rgba(95,212,255,.3)" strokeWidth="0.6" />
        </svg>
        <div className="boot-center">
          <div>
            <div className="boot-pct">{Math.round(p * 100)}<small>%</small></div>
            <div className="boot-sub">{done ? 'Systems online' : 'Booting'}</div>
          </div>
        </div>
      </div>
      <div className="boot-greet" style={{ opacity: done ? 1 : 0, transition: 'opacity .4s' }}>{greeting()}</div>
      <div className="boot-log" aria-hidden>
        {STEPS.slice(0, shown + 1).map((s, i) => (
          <div key={s}>
            <span className={i < shown ? '' : 'cur'}>&gt; {s}</span>
            <span className="dots">{'.'.repeat(80)}</span>
            <span className={i < shown ? 'ok' : ''}>{i < shown ? 'OK' : '··'}</span>
          </div>
        ))}
      </div>
      <div className="boot-skip">Click or press any key to skip</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
