import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import {
  CERTIFICATES, GITHUB_USER, HIDDEN_REPOS, HIDDEN_REPO_TOPICS, MISSIONS, PROFILE, PROJECTS,
  SECTORS, SKILL_GROUPS, SOCIALS, media,
} from '../data/profile';
import { useNav, type LightboxItem } from '../lib/nav';
import { sound } from '../lib/sound';
import { IArrowUpRight, IChevronLeft, IChevronRight, ISearch, IStar, IX } from './icons';

/* --------------------------------------------------------------- shell */
function useEscape(onClose: () => void, extra?: (e: KeyboardEvent) => void) {
  const ref = useRef({ onClose, extra });
  ref.current = { onClose, extra };
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.stopPropagation(); ref.current.onClose(); return; }
      ref.current.extra?.(e);
    };
    window.addEventListener('keydown', on, true);
    return () => window.removeEventListener('keydown', on, true);
  }, []);
}

function Shell({ children, onClose, label, className = 'overlay' }: { children: ReactNode; onClose: () => void; label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    if (el) {
      gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      const f = el.querySelector<HTMLElement>('[data-autofocus]') ?? el.querySelector<HTMLElement>('button, a, input');
      f?.focus({ preventScroll: true });
    }
    return () => prev?.focus?.({ preventScroll: true });
  }, []);
  return (
    <div ref={ref} className={className} role="dialog" aria-modal="true" aria-label={label}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      {children}
    </div>
  );
}

/* --------------------------------------------------------------- radial menu */
export function RadialMenu() {
  const nav = useNav();
  const close = () => nav.setOverlay(null);
  const [hover, setHover] = useState<number | null>(null);
  const svg = useRef<SVGSVGElement>(null);
  useEscape(close);

  useEffect(() => {
    const el = svg.current; if (!el) return;
    gsap.fromTo(el.querySelectorAll('.seg'), { opacity: 0, scale: 0.85, transformOrigin: '300px 300px' },
      { opacity: 1, scale: 1, duration: 0.5, stagger: 0.035, ease: 'back.out(1.6)' });
    gsap.fromTo(el.querySelectorAll('.deco'), { rotate: -60, opacity: 0, transformOrigin: '300px 300px' },
      { rotate: 0, opacity: 1, duration: 0.9, ease: 'expo.out' });
  }, []);

  const n = SECTORS.length;
  const R1 = 150, R2 = 250, GAP = 1.6;
  const arc = (i: number) => {
    const a0 = ((i / n) * 360 - 90 - 180 / n + GAP / 2) * (Math.PI / 180);
    const a1 = (((i + 1) / n) * 360 - 90 - 180 / n - GAP / 2) * (Math.PI / 180);
    const p = (r: number, a: number) => `${300 + r * Math.cos(a)},${300 + r * Math.sin(a)}`;
    return `M${p(R1, a0)} L${p(R2, a0)} A${R2},${R2} 0 0 1 ${p(R2, a1)} L${p(R1, a1)} A${R1},${R1} 0 0 0 ${p(R1, a0)} Z`;
  };
  const mid = (i: number, r: number) => {
    const a = ((i / n) * 360 - 90) * (Math.PI / 180);
    return { x: 300 + r * Math.cos(a), y: 300 + r * Math.sin(a) };
  };
  const shown = SECTORS[hover ?? nav.index];

  return (
    <Shell onClose={close} label="Navigation dial">
      <button className="icon-btn overlay-close" onClick={close} aria-label="Close"><IX /></button>
      <div className="radial">
        <svg ref={svg} viewBox="0 0 600 600">
          <g className="deco" aria-hidden>
            <circle cx="300" cy="300" r="282" fill="none" stroke="rgba(95,212,255,.25)" strokeDasharray="2 6" />
            <circle cx="300" cy="300" r="268" fill="none" stroke="rgba(95,212,255,.5)" strokeWidth="6" strokeDasharray="0.8 7.6" />
            <circle cx="300" cy="300" r="138" fill="none" stroke="rgba(95,212,255,.3)" />
            <circle cx="300" cy="300" r="128" fill="none" stroke="#ffb547" strokeWidth="1.2" strokeDasharray="40 764" />
          </g>
          {SECTORS.map((s, i) => {
            const m = mid(i, 200);
            return (
              <g key={s.id} className={`seg ${i === nav.index ? 'is-active' : ''}`} tabIndex={0} role="button"
                aria-label={`${s.code} ${s.label} — ${s.title}`}
                onMouseEnter={() => { setHover(i); sound.tick(); }} onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onClick={() => { nav.go(i); close(); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nav.go(i); close(); } }}>
                <path className="shape" d={arc(i)} />
                <text className="code" x={m.x} y={m.y - 8} textAnchor="middle">{s.code}</text>
                <text x={m.x} y={m.y + 10} textAnchor="middle">{s.label}</text>
              </g>
            );
          })}
        </svg>
        <div className="radial-center">
          <div>
            <div className="label">{shown.code} // {shown.label}</div>
            <div className="rc-title">{shown.title}</div>
            <div className="rc-hint">{shown.hint}</div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- command palette */
interface Cmd { id: string; type: string; title: string; sub?: string; keywords: string; run: () => void }

export function CommandPalette() {
  const nav = useNav();
  const close = () => nav.setOverlay(null);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(0);
  const list = useRef<HTMLDivElement>(null);

  const cmds = useMemo<Cmd[]>(() => {
    const out: Cmd[] = [];
    SECTORS.forEach((s, i) => out.push({
      id: `s-${s.id}`, type: 'Sector', title: `${s.code} · ${s.title}`, sub: s.label,
      keywords: `${s.label} ${s.title} ${s.hint} go open`, run: () => nav.go(i),
    }));
    MISSIONS.forEach((m) => out.push({
      id: `m-${m.id}`, type: 'Role', title: `${m.role} — ${m.org}`, sub: m.period,
      keywords: `${m.role} ${m.org} ${m.codename} ${m.stack.join(' ')} experience work job`, run: () => nav.focusOn('mission', m.id),
    }));
    PROJECTS.forEach((p) => out.push({
      id: `p-${p.id}`, type: 'Project', title: p.title, sub: p.kind,
      keywords: `${p.title} ${p.kind} ${p.tags.join(' ')} project`, run: () => nav.focusOn('project', p.id),
    }));
    SKILL_GROUPS.forEach((g) => g.skills.forEach((s) => out.push({
      id: `k-${s.name}`, type: 'Skill', title: s.name, sub: g.label,
      keywords: `${s.name} ${g.label} skill`, run: () => nav.focusOn('skill', s.name),
    })));
    out.push(
      { id: 'a-resume', type: 'Action', title: 'Download resume (PDF)', keywords: 'resume cv pdf download dossier', run: () => { const a = document.createElement('a'); a.href = PROFILE.resume; a.download = 'Resume_Gokulakrishnan_M.pdf'; a.click(); } },
      { id: 'a-email', type: 'Action', title: 'Copy email address', sub: PROFILE.email, keywords: 'email mail contact copy', run: () => { navigator.clipboard?.writeText(PROFILE.email).then(() => nav.toast('Email copied to clipboard')); } },
      { id: 'a-vault', type: 'Action', title: 'Open certificate vault', keywords: 'certificates certificate vault course coursera', run: () => nav.setOverlay({ type: 'vault' }) },
      { id: 'a-repos', type: 'Action', title: 'Open live GitHub feed', keywords: 'github repos repositories code', run: () => nav.setOverlay({ type: 'repos' }) },
      { id: 'a-orbit', type: 'Action', title: 'Orbit view — all pages on the ring', keywords: 'orbit ring overview all pages', run: () => nav.orbit() },
      { id: 'a-motion', type: 'Action', title: nav.reducedMotion ? 'Enable full motion' : 'Reduce motion', keywords: 'motion animation reduce accessibility', run: () => nav.setMotion(nav.reducedMotion ? 'full' : 'reduced') },
      { id: 'a-sound', type: 'Action', title: nav.soundOn ? 'Mute interface sounds' : 'Enable interface sounds', keywords: 'sound audio mute', run: nav.toggleSound },
      { id: 'a-classic', type: 'Link', title: 'Classic portfolio', sub: 'Previous site', keywords: 'old classic portfolio previous', run: () => window.open(PROFILE.classicSite, '_blank', 'noopener') },
      ...SOCIALS.map((s) => ({ id: `l-${s.id}`, type: 'Link', title: `Open ${s.label}`, sub: s.handle, keywords: `${s.label} social ${s.handle}`, run: () => window.open(s.url, '_blank', 'noopener') })),
    );
    return out;
  }, [nav]);

  const results = useMemo(() => {
    const terms = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
    if (!terms.length) return cmds.filter((c) => c.type === 'Sector' || c.type === 'Action').slice(0, 12);
    return cmds
      .map((c) => {
        const t = c.title.toLowerCase();
        const tw = t.split(/[^a-z0-9+#.]+/);
        const kw = c.keywords.toLowerCase().split(/[^a-z0-9+#.]+/);
        let score = 0;
        for (const term of terms) {
          if (t.startsWith(term)) score += 6;
          else if (tw.some((w) => w.startsWith(term))) score += 4;
          else if (term.length >= 4 && t.includes(term)) score += 2.5;
          else if (kw.some((w) => w.startsWith(term))) score += 1.5;
          else return { c, score: -1 };
        }
        return { c, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 14)
      .map((x) => x.c);
  }, [q, cmds]);

  useEffect(() => setSel(0), [q]);
  useEffect(() => {
    list.current?.querySelector('.is-sel')?.scrollIntoView({ block: 'nearest' });
  }, [sel]);

  const run = (c?: Cmd) => { if (!c) return; sound.blip(1500); close(); window.setTimeout(c.run, 30); };

  useEscape(close, (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); e.stopPropagation(); setSel((s) => Math.min(results.length - 1, s + 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); e.stopPropagation(); setSel((s) => Math.max(0, s - 1)); }
    if (e.key === 'Enter') { e.preventDefault(); run(results[sel]); }
  });

  return (
    <Shell onClose={close} label="Command console">
      <div className="palette panel">
        <div className="palette-input">
          <ISearch />
          <input data-autofocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask GK.OS — try “RAG”, “IIT”, “resume”, “projects”…"
            aria-label="Search commands" aria-controls="palette-list" aria-activedescendant={results[sel] ? `pc-${results[sel].id}` : undefined} />
          <span className="kbd">Esc</span>
        </div>
        <div className="palette-list" id="palette-list" ref={list} role="listbox">
          {!q && <div className="palette-group label label--dim">Quick access</div>}
          {results.length === 0 && <div className="palette-empty">No match in the archive. Try a skill, company or project name.</div>}
          {results.map((c, i) => (
            <button key={c.id} id={`pc-${c.id}`} role="option" aria-selected={i === sel}
              className={`palette-item ${i === sel ? 'is-sel' : ''}`} onMouseMove={() => setSel(i)} onClick={() => run(c)}>
              <span className="pi-type">{c.type}</span>
              <span className="pi-title">{c.title}</span>
              {c.sub && <span className="pi-sub">{c.sub}</span>}
            </button>
          ))}
        </div>
        <div className="palette-foot">
          <span><span className="kbd">↑</span> <span className="kbd">↓</span> select</span>
          <span><span className="kbd">↵</span> execute</span>
          <span style={{ marginLeft: 'auto' }}>{cmds.length} indexed records</span>
        </div>
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- lightbox */
export function Lightbox({ items, index }: { items: LightboxItem[]; index: number }) {
  const nav = useNav();
  const close = () => nav.setOverlay(null);
  const [i, setI] = useState(index);
  const [showVideo, setShowVideo] = useState(false);
  const it = items[i];
  const go = (d: number) => { setI((x) => (x + d + items.length) % items.length); setShowVideo(false); };
  useEscape(close, (e) => {
    if (e.key === 'ArrowRight') { e.stopPropagation(); go(1); }
    if (e.key === 'ArrowLeft') { e.stopPropagation(); go(-1); }
  });

  return (
    <Shell onClose={close} label={it.title}>
      <div className="lightbox panel">
        <div className="panel-head">
          <span><span className="dot" />Visual record · {String(i + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <button className="icon-btn" onClick={close} aria-label="Close" data-autofocus><IX /></button>
        </div>
        <div className="lightbox-media">
          {showVideo && it.video ? (
            <video key={it.video} src={it.video} controls autoPlay playsInline />
          ) : (
            <img key={it.src} className="mat-in" src={it.src} alt={it.title} />
          )}
        </div>
        <div className="lightbox-bar">
          <div>
            <div className="lb-title">{it.title}</div>
            {it.sub && <div className="lb-sub">{it.sub}</div>}
          </div>
          <span className="spacer" />
          {it.video && (
            <button className="btn btn--sm" onClick={() => setShowVideo((v) => !v)}>{showVideo ? 'Show poster' : 'Play title card'}</button>
          )}
          {items.length > 1 && (
            <>
              <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous"><IChevronLeft /></button>
              <button className="icon-btn" onClick={() => go(1)} aria-label="Next"><IChevronRight /></button>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- certificate vault */
export function Vault({ category }: { category?: string }) {
  const nav = useNav();
  const close = () => nav.setOverlay(null);
  const cats = ['All', ...Array.from(new Set(CERTIFICATES.map((c) => c.category)))];
  const [cat, setCat] = useState(category ?? 'All');
  const list = cat === 'All' ? CERTIFICATES : CERTIFICATES.filter((c) => c.category === cat);
  useEscape(close);

  const open = (k: number) => nav.setOverlay({
    type: 'lightbox', index: k,
    items: list.map((c) => ({ src: media(`certificates/${c.id}.webp`), title: c.title, sub: `${c.issuer} · ${c.category}` })),
  });

  return (
    <Shell onClose={close} label="Certificate vault">
      <div className="vault panel">
        <div className="panel-head">
          <span><span className="dot" />Certificate vault · {CERTIFICATES.length} records</span>
          <button className="icon-btn" onClick={close} aria-label="Close"><IX /></button>
        </div>
        <div className="vault-tabs" role="tablist">
          {cats.map((c) => (
            <button key={c} role="tab" aria-selected={c === cat} className={`tab ${c === cat ? 'is-active' : ''}`} onClick={() => setCat(c)}>
              {c}<span className="n">{c === 'All' ? CERTIFICATES.length : CERTIFICATES.filter((x) => x.category === c).length}</span>
            </button>
          ))}
        </div>
        <div className="vault-grid" key={cat}>
          {list.map((c, k) => (
            <button key={c.id} className="thumb fade-in" style={{ animationDelay: `${Math.min(k, 16) * 25}ms` }} onClick={() => open(k)}>
              <div className="img"><img src={media(`certificates/${c.id}.thumb.webp`)} alt="" loading="lazy" decoding="async" /></div>
              <div className="meta">
                <div className="t">{c.title}</div>
                <div className="s">{c.issuer}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </Shell>
  );
}

/* --------------------------------------------------------------- GitHub feed */
interface Repo { id: number; name: string; description: string | null; html_url: string; language: string | null; stargazers_count: number; updated_at: string; topics?: string[]; fork: boolean }

const LANG_COLOR: Record<string, string> = {
  Python: '#5fd4ff', TypeScript: '#7aa8ff', JavaScript: '#ffd75f', HTML: '#ff8a5f', CSS: '#b18cff',
  'Jupyter Notebook': '#ffb547', Java: '#ff6b6b', GDScript: '#57f2b0', MATLAB: '#ff9f43', 'C++': '#f472b6',
};

export function RepoDrawer() {
  const nav = useNav();
  const close = () => nav.setOverlay(null);
  const [repos, setRepos] = useState<Repo[] | null>(null);
  const [err, setErr] = useState(false);
  const [lang, setLang] = useState('All');
  const panel = useRef<HTMLDivElement>(null);
  useEscape(close);

  useEffect(() => {
    if (panel.current) gsap.fromTo(panel.current, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
    const KEY = 'gkos-repos-v1';
    try {
      const cached = sessionStorage.getItem(KEY);
      if (cached) { setRepos(JSON.parse(cached)); return; }
    } catch { /* ignore */ }
    fetch(`https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=100`)
      .then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); })
      .then((data: Repo[]) => {
        const list = data.filter((r) => !HIDDEN_REPOS.includes(r.name)
          && !(r.topics ?? []).some((t) => HIDDEN_REPO_TOPICS.includes(t.toLowerCase())));
        setRepos(list);
        try { sessionStorage.setItem(KEY, JSON.stringify(list)); } catch { /* ignore */ }
      })
      .catch(() => setErr(true));
  }, []);

  const langs = useMemo(() => ['All', ...Array.from(new Set((repos ?? []).map((r) => r.language).filter(Boolean) as string[]))], [repos]);
  const shown = (repos ?? []).filter((r) => lang === 'All' || r.language === lang);

  return (
    <div className="drawer-wrap" role="dialog" aria-modal="true" aria-label="GitHub repositories" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
      <div className="drawer panel" ref={panel}>
        <div className="drawer-head">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="label"><span className="dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--ok)', marginRight: 8 }} />Live uplink · github.com/{GITHUB_USER}</span>
            <button className="icon-btn" onClick={close} aria-label="Close" data-autofocus><IX /></button>
          </div>
          <h3 className="title" style={{ fontSize: 34 }}>Repositories</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}>
            {langs.map((l) => (
              <button key={l} className={`tab ${l === lang ? 'is-active' : ''}`} onClick={() => setLang(l)}>{l}</button>
            ))}
          </div>
        </div>
        <div className="drawer-body">
          {!repos && !err && <p className="label label--dim" style={{ padding: '20px 0' }}>Establishing uplink…</p>}
          {err && (
            <p style={{ color: 'var(--text-2)', padding: '16px 0' }}>
              GitHub’s API didn’t respond (it rate-limits anonymous visitors).{' '}
              <a className="link-arrow" href={`https://github.com/${GITHUB_USER}`} target="_blank" rel="noreferrer">Open profile <IArrowUpRight /></a>
            </p>
          )}
          {shown.map((r) => (
            <a key={r.id} className="repo" href={r.html_url} target="_blank" rel="noreferrer">
              <div className="repo-name">{r.name}</div>
              {r.description && <div className="repo-desc">{r.description}</div>}
              <div className="repo-meta">
                {r.language && <span><span className="lang-dot" style={{ background: LANG_COLOR[r.language] ?? 'var(--holo)' }} />{r.language}</span>}
                {r.stargazers_count > 0 && <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><IStar width={11} height={11} />{r.stargazers_count}</span>}
                <span>Updated {new Date(r.updated_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------- reticle cursor */
export function Reticle() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    if (!fine) return;
    document.body.classList.add('has-reticle');
    const el = ref.current!;
    const dot = el.querySelector<HTMLElement>('.r-dot')!;
    const ring = el.querySelector<HTMLElement>('.r-ring')!;
    let x = -100, y = -100, rx = -100, ry = -100, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      dot.style.transform = `translate(${x}px, ${y}px)`;
      const t = e.target as Element;
      el.classList.toggle('is-hover', !!t.closest?.('a, button, [role="button"], [role="tab"], input, label'));
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const leave = () => { el.style.opacity = '0'; };
    const enter = () => { el.style.opacity = '1'; };
    const loop = () => {
      rx += (x - rx) * 0.22; ry += (y - ry) * 0.22;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };
    loop();
    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('mouseleave', leave);
    document.documentElement.addEventListener('mouseenter', enter);
    return () => {
      cancelAnimationFrame(raf);
      document.body.classList.remove('has-reticle');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('mouseleave', leave);
      document.documentElement.removeEventListener('mouseenter', enter);
    };
  }, []);
  return (
    <div className="reticle" ref={ref} aria-hidden>
      <div className="r-ring">
        <svg viewBox="0 0 30 30">
          <circle cx="15" cy="15" r="13" fill="none" stroke="rgba(95,212,255,.75)" strokeWidth="1" strokeDasharray="6 4.2" />
          <path d="M15 0v4M15 26v4M0 15h4M26 15h4" stroke="rgba(181,236,255,.9)" strokeWidth="1" />
        </svg>
      </div>
      <div className="r-dot" />
    </div>
  );
}
