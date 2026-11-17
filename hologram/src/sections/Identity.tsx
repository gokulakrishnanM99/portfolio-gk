import { useEffect, useRef, useState } from 'react';
import { PROFILE, SOCIALS, TELEMETRY } from '../data/profile';
import { useNav } from '../lib/nav';
import { scrollerOf } from '../lib/pages';
import { useDecrypt } from '../lib/useDecrypt';
import { SectionHeaderLabelOnly } from './parts';
import type { SectionProps } from '../components/SectionHeader';
import { IArrowRight, IDownload, IGithub, ILinkedin, IMail, IMedium } from '../components/icons';

const SOCIAL_ICON = { linkedin: ILinkedin, github: IGithub, medium: IMedium } as const;

/** Callout slots around the projected core: [dx sign, dy sign] */
const SLOTS: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
const BOX_W = 180;
const BOX_H = 72;

/** Telemetry callouts wired to the 3D core. Rendered beside the page scroller (not inside it) and
 *  shown only while the hero is on screen — `on` turns false once the visitor scrolls down. */
export function IdentityCallouts({ active, scene }: { active: boolean; scene: SectionProps['scene'] }) {
  const wrap = useRef<HTMLDivElement>(null);
  // hero still on screen? Tracked here (not in the page component) so hiding the callouts re-renders
  // only this small component instead of every page mid-scroll.
  const [hero, setHero] = useState(true);
  useEffect(() => {
    if (!active) return;
    const sc = scrollerOf(0);
    if (!sc) return;
    const update = () => {
      const h = sc.scrollTop < sc.clientHeight * 0.22;
      setHero(h);
      sc.classList.toggle('is-hero', h);
    };
    sc.addEventListener('scroll', update, { passive: true });
    update();
    return () => sc.removeEventListener('scroll', update);
  }, [active]);
  const on = active && hero;

  useEffect(() => {
    if (!on || !scene) return;
    const seg = (el: HTMLElement | undefined, x1: number, y1: number, x2: number, y2: number) => {
      if (!el) return;
      const len = Math.hypot(x2 - x1, y2 - y1);
      const a = Math.atan2(y2 - y1, x2 - x1);
      el.style.transform = `translate(${x1.toFixed(1)}px, ${y1.toFixed(1)}px) rotate(${a.toFixed(4)}rad) scaleX(${len.toFixed(1)})`;
    };
    // keep the callouts clear of the hero text, the page-nav rail and the page's scrollbar:
    // measured on resize, not every frame
    let copyRight = 0;
    let rail: DOMRect | null = null;
    const measure = () => {
      copyRight = 0;
      const range = document.createRange();
      document.querySelectorAll<HTMLElement>('.blk--identity .id-copy > *').forEach((n) => {
        range.selectNodeContents(n);
        copyRight = Math.max(copyRight, range.getBoundingClientRect().right);
      });
      const r = document.querySelector<HTMLElement>('.rail')?.getBoundingClientRect();
      rail = r && r.width > 0 ? r : null;
      // all four boxes share the tallest one's height (a detail line may wrap onto two lines)
      const boxes = Array.from(document.querySelectorAll<HTMLElement>('.callouts .callout'));
      boxes.forEach((b) => { b.style.minHeight = ''; });
      const tallest = Math.max(0, ...boxes.map((b) => b.offsetHeight));
      boxes.forEach((b) => { b.style.minHeight = `${tallest}px`; });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const el = wrap.current;
      if (!el || el.offsetParent === null) return;
      const pc = scene.projectCore();
      const cx = pc.x, cy = pc.y;
      const r = Math.max(pc.r, Math.min(window.innerHeight * 0.3, 260));
      const W = window.innerWidth, H = window.innerHeight;
      const top = 84, bottom = H - 72;
      const boxes = el.querySelectorAll<HTMLElement>('.callout');
      const lines = el.querySelectorAll<HTMLElement>('.co-line');
      const dots = el.querySelectorAll<HTMLElement>('.co-dot');
      const label = el.querySelector<HTMLElement>('.core-label');
      const gr = r * 0.42; // anchor radius ≈ globe edge
      // read every box height first, then write transforms: interleaving them forced a style/layout
      // pass per box on every frame
      const heights = Array.from(boxes, (b) => b.offsetHeight || BOX_H);
      SLOTS.forEach(([sx, sy], i) => {
        const box = boxes[i]; if (!box) return;
        const bh = heights[i];
        // boxes above and below the core: the left pair just left of its centre, the right pair well to
        // the right of it, never over the hero text, the page-nav rail or the screen edge
        let by = sy < 0 ? cy - r * 0.95 - bh : cy + r * 0.62;
        by = Math.min(Math.max(by, top), bottom - bh);
        let bx: number;
        if (sx < 0) {
          bx = Math.max(cx - BOX_W - gr * 0.3, copyRight + 32);
        } else {
          bx = Math.min(cx + gr * 0.55, W - 36 - BOX_W);
          if (rail && by < rail.bottom + 12 && by + bh > rail.top - 12) bx = Math.min(bx, rail.left - 12 - BOX_W);
          bx = Math.max(bx, Math.max(cx - BOX_W - gr * 0.3, copyRight + 32) + BOX_W + 16); // never under the left pair
        }
        box.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px)`;
        const ang = Math.atan2(sy * 0.8, sx);
        const ax = cx + Math.cos(ang) * gr, ay = cy + Math.sin(ang) * gr;
        const ex = sx < 0 ? bx + BOX_W * 0.62 : bx + BOX_W * 0.38;
        const ey = sy < 0 ? by + bh : by;
        const kx = ax + (ex - ax) * 0.45;
        // composited-only updates (no SVG repaint): each leader is two transformed 1px lines
        seg(lines[i * 2], ax, ay, kx, ey);
        seg(lines[i * 2 + 1], kx, ey, ex, ey);
        if (dots[i]) dots[i].style.transform = `translate(${(ax - 4).toFixed(1)}px, ${(ay - 4).toFixed(1)}px)`;
      });
      if (label) label.style.transform = `translate(${cx.toFixed(1)}px, ${(cy + r * 0.5 + 6).toFixed(1)}px) translateX(-50%)`;
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', measure); };
  }, [on, scene]);

  return (
    <div className={`callouts ${on ? 'on' : ''}`} ref={wrap} aria-hidden>
      {scene && (
        <>
          {Array.from({ length: SLOTS.length * 2 }, (_, i) => <i key={`l${i}`} className="co-line" />)}
          {SLOTS.map((_, i) => <i key={`d${i}`} className="co-dot" />)}
          {TELEMETRY.map((t, i) => (
            <div key={t.label} className="callout panel panel--flat" style={{ left: 0, top: 0, transform: 'translate(-999px,-999px)' }}>
              <div className="cv">{t.value}{t.unit && <small>{t.unit}</small>}</div>
              <div className="cl">{t.label}</div>
              <div className="cd">{t.detail}</div>
              <span className="sr-only">callout {i + 1}</span>
            </div>
          ))}
          <div className="core-label" style={{ left: 0, top: 0 }}>Neural core · online</div>
        </>
      )}
    </div>
  );
}

export function Identity({ active }: SectionProps) {
  const nav = useNav();
  const status = useDecrypt(PROFILE.status, active, 1100, 900);

  // name with the signature red-dotted "i"
  const first = PROFILE.first;
  const iPos = first.indexOf('i');

  return (
    <div className="blk-body">
        <div className="id-grid">
          <div className="id-copy">
            <SectionHeaderLabelOnly block="identity" active={active} />
            <div className="id-roles" data-reveal>
              {PROFILE.roles.map((r) => <span key={r} className="chip">{r}</span>)}
            </div>
            <h1 className="id-name" data-reveal aria-label={PROFILE.name}>
              <span aria-hidden>
                <span className="first">
                  {first.slice(0, iPos)}
                  <span className="idot"><span className="i-red">i</span><span className="i-top">i</span></span>
                  {first.slice(iPos + 1)}
                </span>{' '}
                <span style={{ color: 'var(--holo)' }}>{PROFILE.last}</span>
              </span>
            </h1>
            <p className="id-headline" data-reveal>{PROFILE.headline}</p>
            <p className="id-summary" data-reveal>{PROFILE.summary}</p>
            <div className="id-ctas" data-reveal>
              <button className="btn btn--primary" onClick={() => nav.goBlock('origin')}>Begin briefing <IArrowRight /></button>
              <a className="btn" href={PROFILE.resume} download="Resume_Gokulakrishnan_M.pdf">Resume <IDownload /></a>
            </div>
            <div className="id-socials id-status" data-reveal>
              <span className="label label--dim">Status //</span>
              <span className="mono id-status-text">{status}</span>
            </div>
            <div className="id-socials" data-reveal style={{ marginTop: 10 }}>
              {SOCIALS.map((s) => {
                const I = SOCIAL_ICON[s.id];
                return <a key={s.id} className="icon-btn" href={s.url} target="_blank" rel="noreferrer" aria-label={s.label}><I /></a>;
              })}
              <a className="icon-btn" href={`mailto:${PROFILE.email}`} aria-label="Email"><IMail /></a>
            </div>
            <div className="telemetry-row" data-reveal>
              {TELEMETRY.map((t) => (
                <div key={t.label} className="tm"><b>{t.value}{t.unit && <small style={{ fontSize: 12, color: 'var(--holo)', marginLeft: 2 }}>{t.unit}</small>}</b><span>{t.label}</span><i>{t.detail}</i></div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}
