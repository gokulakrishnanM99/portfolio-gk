import { useEffect, useRef, useState } from 'react';
import { SECTORS } from '../data/profile';
import { useNav } from '../lib/nav';
import { sound } from '../lib/sound';
import type { HoloScene } from '../three/HoloScene';
import { GKMark, IChevronLeft, IChevronRight, IDial, ISearch, IVolume, IVolumeOff } from './icons';
import { useDecrypt } from '../lib/useDecrypt';

/** Compact motion toggle (the OS reduced-motion setting can be overridden here). */
function MotionToggle() {
  const nav = useNav();
  return (
    <button className="fx-btn" onClick={() => nav.setMotion(nav.reducedMotion ? 'full' : 'reduced')}
      aria-pressed={!nav.reducedMotion} title="Toggle 3D motion">
      <span className="fx-k">Motion</span><b>{nav.reducedMotion ? 'Reduced' : 'Full'}</b>
    </button>
  );
}

function Clock() {
  const [t, setT] = useState(() => new Date());
  useEffect(() => { const id = setInterval(() => setT(new Date()), 1000); return () => clearInterval(id); }, []);
  return <span className="clock" aria-label="Local time">{t.toLocaleTimeString([], { hour12: false })}</span>;
}

function Coords({ scene }: { scene: HoloScene | null }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!scene) return;
    const id = setInterval(() => {
      const c = scene.cameraReadout();
      const el = ref.current; if (!el) return;
      const b = el.querySelectorAll('b');
      b[0].textContent = c.x.toFixed(1);
      b[1].textContent = c.y.toFixed(1);
      b[2].textContent = c.z.toFixed(1);
      b[3].textContent = `${Math.round(c.heading)}°`;
    }, 120);
    return () => clearInterval(id);
  }, [scene]);
  if (!scene) return <div className="coords" />;
  return (
    <div className="coords" ref={ref} aria-hidden>
      <span>X <b>0.0</b></span><span>Y <b>0.0</b></span><span>Z <b>0.0</b></span><span>HDG <b>0°</b></span>
    </div>
  );
}

export function Hud({ scene }: { scene: HoloScene | null }) {
  const nav = useNav();
  const ring = nav.mode !== 'page';
  const s = SECTORS[ring ? nav.front : nav.index];
  const name = useDecrypt(s.label, nav.booted, 520);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

  return (
    <header className="hud" style={{ opacity: nav.booted ? 1 : 0, transition: 'opacity 1s .4s' }}>
      <div className="hud-frame" aria-hidden><i /><i /><i /><i /></div>

      <div className="hud-top">
        <button className="brand" onClick={() => nav.go(0)} aria-label="GK.OS — go to start">
          <GKMark className="brand-mark" />
          <span style={{ textAlign: 'left' }}>
            <div className="brand-name">GK.OS</div>
            <div className="brand-sub">Holographic interface</div>
          </span>
        </button>

        <div className="hud-center" aria-live="polite">
          <span className="bracket">[</span>
          {ring && <span className="count" style={{ color: 'var(--amber)' }}>Orbit ·</span>}
          <span className="count">{s.code} / {String(SECTORS.length).padStart(2, '0')}</span>
          <span className="sector-name">{name}</span>
          <span className="bracket">]</span>
        </div>

        <div className="hud-right">
          <span className="status"><span className="pulse" />Online</span>
          <Clock />
          <button className="icon-btn" onClick={nav.toggleSound} aria-label={nav.soundOn ? 'Mute interface sounds' : 'Enable interface sounds'} title="Interface sound">
            {nav.soundOn ? <IVolume /> : <IVolumeOff />}
          </button>
          <button className="cmd-btn" onClick={() => nav.setOverlay({ type: 'palette' })} aria-label="Open command console">
            <ISearch width={14} height={14} /> <span className="kbd">{isMac ? '⌘' : 'Ctrl'}</span><span className="kbd">K</span>
          </button>
        </div>
      </div>

      <nav className="rail" aria-label="Sectors">
        {SECTORS.map((x, i) => (
          <button key={x.id} className={`rail-item ${i === nav.index ? 'is-active' : ''}`} onClick={() => nav.go(i)}
            onMouseEnter={() => sound.tick()} aria-current={i === nav.index ? 'step' : undefined} aria-label={`${x.code} ${x.label} — ${x.title}`}>
            <span className="rl">{x.label}</span>
            <span className="rc">{x.code}</span>
            <span className="tick" />
          </button>
        ))}
      </nav>

      <div className="hud-bottom">
        <div className="hud-bl">
          <button className="dial-btn" onClick={() => nav.setOverlay({ type: 'radial' })} aria-label="Open navigation dial">
            <IDial /> <span className="dl">Navigate <span className="kbd">M</span></span>
          </button>
          <MotionToggle />
        </div>
        {!ring && (
          <button className="next-btn" onClick={nav.orbit}>
            <span className="chev" aria-hidden /> Scroll · orbit view
          </button>
        )}
        <Coords scene={scene} />
        <div className="progress-line" aria-hidden><span style={{ width: `${((nav.index + 1) / SECTORS.length) * 100}%` }} /></div>
      </div>

      <div className="mobile-nav panel">
        <button className="icon-btn" onClick={() => (ring ? nav.step(-1) : nav.prev())} disabled={!ring && nav.index === 0} aria-label="Previous page"><IChevronLeft /></button>
        <button className="mn-label" onClick={() => (ring ? nav.openFront() : nav.orbit())}>
          <b>{s.code}</b>{ring ? `Open ${s.label}` : `${s.label} · orbit`}
        </button>
        <button className="icon-btn" onClick={() => (ring ? nav.step(1) : nav.next())} disabled={!ring && nav.index === SECTORS.length - 1} aria-label="Next page"><IChevronRight /></button>
      </div>
    </header>
  );
}
