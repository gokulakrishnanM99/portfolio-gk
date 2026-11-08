import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PROJECTS, type Project } from '../data/profile';
import { useNav } from '../lib/nav';
import { sound } from '../lib/sound';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';
import { IArrowUpRight, IChevronLeft, IChevronRight, IRepo } from '../components/icons';

const N = PROJECTS.length;
const STEP = 360 / N;

function CardFace({ p, front }: { p: Project; front: boolean }) {
  const [ok, setOk] = useState(!!p.image);
  return (
    <>
      {ok && p.image && (
        <div className="cimg">
          <img src={p.image} alt="" loading="lazy" decoding="async" onError={() => setOk(false)}
            style={{ objectFit: p.imageFit ?? 'cover', opacity: front ? 1 : 0.8 }} />
        </div>
      )}
      <div className={`cface ${ok ? '' : 'typo'}`}>
        {!ok && <div className="cbig" aria-hidden>{p.code.replace('P-', '')}</div>}
        <div className="ccode">{p.code} · {p.year}</div>
        <div>
          <div className="ctitle">{p.title}</div>
          <div className="ckind">{p.kind}</div>
        </div>
      </div>
    </>
  );
}

export function Arsenal({ index, active }: SectionProps) {
  const nav = useNav();
  const [rot, setRot] = useState(0);         // continuous index (can exceed N)
  const [drag, setDrag] = useState(0);       // live drag offset in degrees
  const [dragging, setDragging] = useState(false);
  const start = useRef<{ x: number; moved: boolean; id: number } | null>(null);
  const justDragged = useRef(false);
  const cardSize = useCardSize();

  const cur = ((Math.round(rot) % N) + N) % N;
  const p = PROJECTS[cur];
  const radius = Math.round((cardSize.w / 2) / Math.tan(Math.PI / N) + 46);

  const goTo = (i: number) => {
    // shortest path to index i
    let d = i - cur;
    if (d > N / 2) d -= N;
    if (d < -N / 2) d += N;
    setRot((r) => Math.round(r) + d);
    sound.tick();
  };
  const step = (d: number) => { setRot((r) => Math.round(r) + d); sound.tick(); };

  useEffect(() => {
    if (nav.focus?.kind !== 'project') return;
    const i = PROJECTS.findIndex((x) => x.id === nav.focus!.id);
    if (i >= 0) goTo(i);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.focus]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (nav.overlay) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, nav.overlay]);

  const onDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, moved: false, id: e.pointerId };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    if (!start.current.moved && Math.abs(dx) > 6) {
      start.current.moved = true;
      setDragging(true);
      (e.currentTarget as HTMLElement).setPointerCapture(start.current.id);
    }
    if (!start.current.moved) return;
    setDrag(dx * 0.32);
  };
  const onUp = () => {
    if (!start.current) return;
    const moved = start.current.moved;
    start.current = null;
    setDragging(false);
    if (moved) {
      justDragged.current = true;
      window.setTimeout(() => { justDragged.current = false; }, 50);
      const d = Math.round(-drag / STEP);
      if (d) { setRot((r) => Math.round(r) + d); sound.tick(); }
    }
    setDrag(0);
  };

  const ringStyle: CSSProperties = {
    transform: `translateZ(${-radius}px) rotateY(${-rot * STEP + drag}deg)`,
  };

  return (
    <div className="sector-inner">
      <SectionHeader index={index} active={active} title={<>Project <em>arsenal</em></>}
        lede="Products I’ve shipped and research I’ve run, from agentic tools to medical imaging. Drag the ring or use ← → to inspect." />

      <div className="ar-grid" style={{ marginTop: 10 }}>
        <div className="carousel-wrap" data-reveal>
          <div
            className="carousel" data-no-swipe
            onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}
            style={{ '--cw': `${cardSize.w}px`, '--ch': `${cardSize.h}px` } as CSSProperties}
            aria-roledescription="carousel" aria-label="Projects"
          >
            <div className="carousel-floor" aria-hidden />
            <div className={`carousel-ring ${dragging ? 'is-dragging' : ''}`} style={ringStyle}>
              {PROJECTS.map((x, i) => {
                let dist = Math.abs(i - cur) % N; dist = Math.min(dist, N - dist);
                const front = i === cur;
                return (
                  <button
                    key={x.id}
                    className={`card3d ${front ? 'is-front' : ''}`}
                    style={{
                      transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)`,
                      opacity: front ? 1 : dist === 1 ? 0.62 : 0.28,
                      filter: front ? 'none' : `saturate(.6) brightness(${dist === 1 ? 0.75 : 0.5})`,
                    }}
                    onClick={() => { if (!justDragged.current) goTo(i); }}
                    aria-label={`${x.title} — ${x.kind}`}
                    aria-current={front}
                    tabIndex={front ? 0 : -1}
                  >
                    <CardFace p={x} front={front} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="carousel-ctrl">
            <button className="icon-btn" onClick={() => step(-1)} aria-label="Previous project"><IChevronLeft /></button>
            <span className="idx"><b>{String(cur + 1).padStart(2, '0')}</b> / {String(N).padStart(2, '0')}</span>
            <button className="icon-btn" onClick={() => step(1)} aria-label="Next project"><IChevronRight /></button>
          </div>
        </div>

        <article className="ar-detail panel" data-reveal aria-live="polite">
          <div key={p.id} className="mat-in">
            <div className="label">{p.code} // {p.kind} · {p.year}</div>
            <h3>{p.title}</h3>
            <p>{p.summary}</p>
            {p.outcome && (
              <div className="ar-outcome"><b>{p.outcome.value}</b><span>{p.outcome.label}</span></div>
            )}
            <div className="ar-tags">{p.tags.map((t) => <span key={t} className="chip">{t}</span>)}</div>
            <div className="ar-actions">
              {p.url && (
                <a className="btn btn--primary" href={p.url} target="_blank" rel="noreferrer">Launch <IArrowUpRight /></a>
              )}
              <button className="btn" onClick={() => nav.setOverlay({ type: 'repos' })}><IRepo /> Live GitHub feed</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function useCardSize() {
  const get = () => {
    const w = window.innerWidth, h = window.innerHeight;
    if (w < 600) return { w: 220, h: 148 };
    const cw = Math.round(Math.min(320, Math.max(240, w * 0.2), h * 0.36));
    return { w: cw, h: Math.round(cw * 0.66) };
  };
  const [s, setS] = useState(get);
  useEffect(() => {
    const on = () => setS(get());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return s;
}
