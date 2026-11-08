import { useEffect, useMemo, useState } from 'react';
import { MISSIONS } from '../data/profile';
import { useNav } from '../lib/nav';
import { sound } from '../lib/sound';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';
import { durationLabel, monthIndex, monthsLabel } from './parts';

export function Missions({ index, active }: SectionProps) {
  const nav = useNav();
  const [sel, setSel] = useState(0);
  const m = MISSIONS[sel];

  // palette / cross-reference focus
  useEffect(() => {
    if (nav.focus?.kind !== 'mission') return;
    const i = MISSIONS.findIndex((x) => x.id === nav.focus!.id);
    if (i >= 0) setSel(i);
  }, [nav.focus]);

  // ← → cycle missions while this sector is active
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (nav.overlay) return;
      if (e.key === 'ArrowRight') { setSel((s) => (s + 1) % MISSIONS.length); sound.tick(); }
      if (e.key === 'ArrowLeft') { setSel((s) => (s - 1 + MISSIONS.length) % MISSIONS.length); sound.tick(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, nav.overlay]);

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
    return { pct, years, nowM, min, max };
  }, []);

  const totalMonths = MISSIONS.reduce((a, x) => a + (monthIndex(x.end) - monthIndex(x.start) + 1), 0);

  return (
    <div className="sector-inner">
      <div className="ms-head">
        <SectionHeader index={index} active={active} title={<>Mission <em>log</em></>} />
        <div className="mono" data-reveal style={{ fontSize: 11.5, color: 'var(--text-3)', letterSpacing: '.1em', textAlign: 'right' }}>
          <div><span style={{ color: 'var(--text)' }}>{MISSIONS.length}</span> deployments · <span style={{ color: 'var(--text)' }}>{monthsLabel(totalMonths)}</span> in industry</div>
          <div style={{ marginTop: 4 }}>Use <span className="kbd">←</span> <span className="kbd">→</span> to cycle</div>
        </div>
      </div>

      <div className="gantt panel panel--flat" data-reveal>
        <div className="gantt-track">
          {MISSIONS.map((x, i) => {
            const l = g.pct(monthIndex(x.start));
            const w = g.pct(monthIndex(x.end) + 1) - l;
            return (
              <button key={x.id} className={`gantt-seg ${i === sel ? 'is-active' : ''}`} style={{ left: `${l}%`, width: `calc(${w}% - 3px)` }}
                onClick={() => { setSel(i); sound.tick(); }} aria-label={`${x.role}, ${x.org}, ${x.period}`}>
                {x.org} · {x.role}
              </button>
            );
          })}
          <div className="gantt-now" style={{ left: `${g.pct(g.nowM + 0.5)}%` }} aria-hidden />
        </div>
        <div className="gantt-axis" aria-hidden>
          {g.years.map((y) => <span key={y} style={{ left: `${g.pct(y * 12)}%` }}>{y}</span>)}
        </div>
      </div>

      <div className="ms-body">
        <div className="ms-list" role="tablist" aria-label="Roles">
          {MISSIONS.map((x, i) => (
            <button key={x.id} role="tab" aria-selected={i === sel} className={`ms-tab ${i === sel ? 'is-active' : ''}`}
              onClick={() => { setSel(i); sound.tick(); }} data-reveal>
              <div className="mt-code">M-{String(MISSIONS.length - i).padStart(2, '0')} · {x.codename}</div>
              <div className="mt-role">{x.role}</div>
              <div className="mt-org">{x.org}{x.type ? ` · ${x.type}` : ''}</div>
              <div className="mt-period">{x.period}</div>
            </button>
          ))}
        </div>

        <article className="ms-detail panel" role="tabpanel" data-reveal>
          <div key={m.id} className="mat-in">
            <div className="ms-detail-top">
              <div>
                <div className="label">Briefing // {m.codename}</div>
                <h3>{m.role} <span>@ {m.org}</span></h3>
              </div>
              <div className="ms-meta">
                <div>{m.period}</div>
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
          </div>
        </article>
      </div>
    </div>
  );
}
