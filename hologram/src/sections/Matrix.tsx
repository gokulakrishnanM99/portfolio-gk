import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { MISSIONS, PROJECTS, SKILL_GROUPS } from '../data/profile';
import { useNav } from '../lib/nav';
import { sound } from '../lib/sound';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';
import { IArrowRight } from '../components/icons';

interface Ref { kind: 'mission' | 'project'; id: string; name: string; sub: string }

const lookup = (id: string): Ref | null => {
  const m = MISSIONS.find((x) => x.id === id);
  if (m) return { kind: 'mission', id, name: `${m.role} · ${m.org}`, sub: m.period };
  const p = PROJECTS.find((x) => x.id === id);
  if (p) return { kind: 'project', id, name: p.title, sub: `${p.kind} · ${p.year}` };
  return null;
};

const ALL_SKILLS = SKILL_GROUPS.flatMap((g) => g.skills.map((s) => ({ ...s, group: g.id })));

export function Matrix({ index, active }: SectionProps) {
  const nav = useNav();
  const [hover, setHover] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const cur = hover ?? pinned;
  const skill = ALL_SKILLS.find((s) => s.name === cur);
  const refs = useMemo(() => (skill?.refs ?? []).map(lookup).filter(Boolean) as Ref[], [skill]);

  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (nav.focus?.kind !== 'skill') return;
    setPinned(nav.focus.id);
  }, [nav.focus]);

  useEffect(() => { if (!active) { setHover(null); } }, [active]);

  // draw neural links: chip → each cross-reference
  useLayoutEffect(() => {
    const svg = svgRef.current, root = rootRef.current;
    if (!svg || !root) return;
    svg.innerHTML = '';
    if (!cur || !refs.length) return;
    const chip = root.querySelector<HTMLElement>(`[data-skill="${CSS.escape(cur)}"]`);
    const items = root.querySelectorAll<HTMLElement>('.xref-item');
    if (!chip || !items.length) return;
    const sb = svg.getBoundingClientRect();
    const a = chip.getBoundingClientRect();
    const ax = a.right - sb.left, ay = a.top + a.height / 2 - sb.top;
    items.forEach((it) => {
      const b = it.getBoundingClientRect();
      const bx = b.left - sb.left, by = b.top + b.height / 2 - sb.top;
      const mx = (ax + bx) / 2;
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${ax},${ay} C${mx},${ay} ${mx},${by} ${bx},${by}`);
      svg.appendChild(path);
    });
  }, [cur, refs]);

  const toggle = (name: string) => {
    setPinned((p) => (p === name ? null : name));
    sound.tick();
  };

  const totalSkills = ALL_SKILLS.length;
  const deployed = new Set(ALL_SKILLS.flatMap((s) => s.refs)).size;

  return (
    <div className="sector-inner" ref={rootRef}>
      <svg ref={svgRef} className="links-svg" aria-hidden style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
      <SectionHeader index={index} active={active} title={<>Neural <em>matrix</em></>}
        lede="Every capability is wired to where it was actually used. Hover or select one to trace it across roles and projects." />

      <div className="mx-grid" onMouseLeave={() => setHover(null)}>
        <div className="mx-groups">
          {SKILL_GROUPS.map((g, gi) => (
            <div key={g.id} className={`mx-group panel ${gi === 0 ? 'span2' : ''}`} data-reveal>
              <h4>{g.label} <span className="label">{g.code}</span></h4>
              <div className="mx-skills">
                {g.skills.map((s) => {
                  const isCur = s.name === cur;
                  const dim = !!cur && !isCur;
                  return (
                    <button
                      key={s.name}
                      data-skill={s.name}
                      className={`skill ${isCur ? 'is-active' : ''} ${dim ? 'is-dim' : ''}`}
                      onMouseEnter={() => { setHover(s.name); sound.tick(); }}
                      onFocus={() => setHover(s.name)}
                      onClick={() => toggle(s.name)}
                      aria-pressed={pinned === s.name}
                    >
                      {s.name}{s.refs.length > 0 && <span className="sc">×{s.refs.length}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <aside className="xref panel" data-reveal aria-live="polite">
          <div className="label">Cross-reference</div>
          {skill ? (
            <div key={skill.name} className="mat-in">
              <h4>{skill.name}</h4>
              <div className="xr-count">
                {refs.length ? `${refs.length} linked deployment${refs.length > 1 ? 's' : ''}` : 'Toolkit · no deployment on record here'}
                {pinned === skill.name && ' · pinned'}
              </div>
              {refs.length > 0 ? (
                <ul className="xref-list">
                  {refs.map((r) => (
                    <li key={r.id}>
                      <button className="xref-item" onClick={() => nav.focusOn(r.kind, r.id)}>
                        <span className={`xt ${r.kind}`}>{r.kind === 'mission' ? 'ROLE' : 'PROJ'}</span>
                        <span className="xn">{r.name}</span>
                        <span className="xs">{r.sub}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="xref-empty">Part of my working toolkit — used in personal builds and coursework rather than a listed role.</p>
              )}
              {refs.length > 0 && (
                <div className="label label--dim" style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  Select a link to jump there <IArrowRight width={12} height={12} />
                </div>
              )}
            </div>
          ) : (
            <div>
              <h4 style={{ color: 'var(--text-2)' }}>Awaiting selection</h4>
              <p className="xref-empty">Point at any capability to trace where it was deployed. Click to pin it.</p>
              <div className="xref-stats">
                <div><b>{totalSkills}</b><span>Skills</span></div>
                <div><b>{SKILL_GROUPS.length}</b><span>Domains</span></div>
                <div><b>{deployed}</b><span>Deployments</span></div>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
