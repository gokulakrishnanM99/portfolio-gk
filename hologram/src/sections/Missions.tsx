import { useEffect, useMemo, useRef, useState } from 'react';
import { MISSIONS, PROFILE } from '../data/profile';
import { useNav } from '../lib/nav';
import { sound } from '../lib/sound';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';
import { durationLabel, monthIndex, monthsLabel } from './parts';

/** Experience: every role stacked as a full briefing; the timeline stays pinned and follows the reader. */
export function Missions({ active }: SectionProps) {
  const nav = useNav();
  const [sel, setSel] = useState(0);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const ganttRef = useRef<HTMLDivElement>(null);

  const scrollTo = (i: number) => {
    const el = cards.current[i];
    if (!el) return;
    setSel(i);
    el.scrollIntoView({ behavior: nav.reducedMotion ? 'auto' : 'smooth', block: 'start' });
  };

  // palette / cross-reference focus: wait until this page has actually opened (scrolling earlier was undone
  // when the page transition placed the page at its top), then handle each request once
  const handledFocus = useRef(0);
  useEffect(() => {
    if (nav.focus?.kind !== 'mission' || !active || nav.mode !== 'page') return;
    if (handledFocus.current === nav.focus.nonce) return;
    const i = MISSIONS.findIndex((x) => x.id === nav.focus!.id);
    if (i < 0) return;
    handledFocus.current = nav.focus.nonce;
    const t = window.setTimeout(() => scrollTo(i), 120);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.focus, active, nav.mode]);

  // highlight the role being read: the last card whose top has passed just under the pinned timeline
  useEffect(() => {
    if (!active) return;
    const sc = cards.current[0]?.closest('.sector-inner') as HTMLElement | null;
    if (!sc) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const line = sc.getBoundingClientRect().top + (ganttRef.current?.offsetHeight ?? 0) + sc.clientHeight * 0.25;
      let k = 0;
      cards.current.forEach((c, i) => { if (c && c.getBoundingClientRect().top <= line) k = i; });
      if (sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2) k = MISSIONS.length - 1;
      setSel(k);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    sc.addEventListener('scroll', on, { passive: true });
    update();
    return () => { sc.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [active]);

  // ← → jump between roles while this page is open
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (nav.overlay || nav.mode !== 'page') return;
      if (e.key === 'ArrowRight') { scrollTo(Math.min(MISSIONS.length - 1, sel + 1)); sound.tick(); }
      if (e.key === 'ArrowLeft') { scrollTo(Math.max(0, sel - 1)); sound.tick(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, nav.overlay, nav.mode, sel]);

  // timeline geometry
  const g = useMemo(() => {
    const starts = MISSIONS.map((x) => monthIndex(x.start));
    const ends = MISSIONS.map((x) => monthIndex(x.end));
    const now = new Date();
    const nowM = now.getFullYear() * 12 + now.getMonth();
    const min = Math.min(...starts) - 1;
    const max = Math.max(nowM, ...ends) + 2;
    const pct = (v: number) => ((v - min) / (max - min)) * 100;
    const years: number[] = [];
    for (let y = Math.ceil(min / 12); y * 12 <= max; y++) years.push(y);
    return { pct, years, nowM };
  }, []);

  // years the highlighted role ran through: their axis labels glow with its bar
  const selYears = (() => {
    const m = MISSIONS[sel];
    return { from: Math.floor(monthIndex(m.start) / 12), to: Math.floor(monthIndex(m.end) / 12) };
  })();

  const totalMonths = MISSIONS.reduce((a, x) => a + (monthIndex(x.end) - monthIndex(x.start) + 1), 0);

  return (
    <div className="blk-body">
      <div className="ms-head">
        <SectionHeader block="missions" active={active} title={<>Mission <em>log</em></>} />
        <div className="mono ms-stat" data-reveal>
          <div><span>{MISSIONS.length}</span> roles · <span>{monthsLabel(totalMonths)}</span> in industry</div>
          <div className="ms-stat-hint">Scroll to read every briefing</div>
        </div>
      </div>

      <div className="ms-open" data-reveal>
        <span className="dot" aria-hidden />
        <span><b>{PROFILE.availability.roles}</b><i> · </i>{PROFILE.availability.places}<i> · </i><em>{PROFILE.availability.when}</em></span>
      </div>

      <div className="gantt panel panel--flat" ref={ganttRef} data-reveal>
        <div className="gantt-track">
          {MISSIONS.map((x, i) => {
            const l = g.pct(monthIndex(x.start));
            const w = g.pct(monthIndex(x.end) + 1) - l;
            return (
              <button key={x.id} className={`gantt-seg ${i === sel ? 'is-active' : ''}`} style={{ left: `${l}%`, width: `calc(${w}% - 3px)` }}
                onClick={() => { scrollTo(i); sound.tick(); }} aria-label={`${x.role}, ${x.org}, ${x.period}`}>
                <span className="gs-org">{x.org}</span><span className="gs-role">{' · '}{x.role}</span>
              </button>
            );
          })}
          <div className="gantt-now" style={{ left: `${g.pct(g.nowM + 0.5)}%` }} aria-hidden />
        </div>
        <div className="gantt-axis" aria-hidden>
          {g.years.map((y) => (
            <span key={y} className={y >= selYears.from && y <= selYears.to ? 'is-on' : ''} style={{ left: `${g.pct(y * 12)}%` }}>{y}</span>
          ))}
        </div>
      </div>

      <div className="ms-roles">
        {MISSIONS.map((m, i) => (
          <article key={m.id} ref={(el) => { cards.current[i] = el; }} className={`ms-detail ms-card panel ${i === sel ? 'is-current' : ''}`}
            data-reveal aria-label={`${m.role} at ${m.org}`}>
            <div className="ms-detail-top">
              <div>
                <div className="label">M-{String(MISSIONS.length - i).padStart(2, '0')} // {m.codename}</div>
                <h3>{m.role} <span>@ {m.org}</span></h3>
              </div>
              <div className="ms-meta">
                <div>{m.period}{m.type ? ` · ${m.type}` : ''}</div>
                <div>Duration <b>{durationLabel(m.start, m.end)}</b></div>
              </div>
            </div>
            <p className="ms-brief">{m.brief}</p>
            <ul className="ms-points">
              {m.points.map((p) => <li key={p.label}><b>{p.label}.</b> {p.text}</li>)}
            </ul>
            <div className="ms-stack">
              <span className="label label--dim" style={{ alignSelf: 'center', marginRight: 6 }}>Stack</span>
              {m.stack.map((s) => <span key={s} className="chip">{s}</span>)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
