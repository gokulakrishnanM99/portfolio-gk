import { useEffect, useRef } from 'react';
import { PROFILE, SOCIALS, TELEMETRY } from '../data/profile';
import { useNav } from '../lib/nav';
import { useDecrypt } from '../lib/useDecrypt';
import { SectionHeaderLabelOnly } from './parts';
import type { SectionProps } from '../components/SectionHeader';
import { IArrowRight, IDownload, IGithub, ILinkedin, IMail, IMedium } from '../components/icons';

const SOCIAL_ICON = { linkedin: ILinkedin, github: IGithub, medium: IMedium } as const;

/** Callout slots around the projected core: [dx sign, dy sign] */
const SLOTS: [number, number][] = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
const BOX_W = 196;
const BOX_H = 84;

export function Identity({ index, active, scene }: SectionProps) {
  const nav = useNav();
  const status = useDecrypt(PROFILE.status, active, 1100, 900);
  const wrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !scene) return;
    const seg = (el: HTMLElement | undefined, x1: number, y1: number, x2: number, y2: number) => {
      if (!el) return;
      const len = Math.hypot(x2 - x1, y2 - y1);
      const a = Math.atan2(y2 - y1, x2 - x1);
      el.style.transform = `translate(${x1.toFixed(1)}px, ${y1.toFixed(1)}px) rotate(${a.toFixed(4)}rad) scaleX(${len.toFixed(1)})`;
    };
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
      SLOTS.forEach(([sx, sy], i) => {
        const box = boxes[i]; if (!box) return;
        let bx = sx < 0 ? cx - r * 0.6 - BOX_W : cx + r * 0.25;
        bx = Math.min(Math.max(bx, W * 0.5), W - 150 - BOX_W);
        let by = sy < 0 ? cy - r * 0.95 - BOX_H : cy + r * 0.62;
        by = Math.min(Math.max(by, top), bottom - BOX_H);
        box.style.transform = `translate(${bx.toFixed(1)}px, ${by.toFixed(1)}px)`;
        const ang = Math.atan2(sy * 0.8, sx);
        const ax = cx + Math.cos(ang) * gr, ay = cy + Math.sin(ang) * gr;
        const ex = sx < 0 ? bx + BOX_W : bx;
        const ey = sy < 0 ? by + BOX_H : by;
        const kx = ax + (ex - ax) * 0.45;
        // composited-only updates (no SVG repaint): each leader is two transformed 1px lines
        seg(lines[i * 2], ax, ay, kx, ey);
        seg(lines[i * 2 + 1], kx, ey, ex, ey);
        if (dots[i]) dots[i].style.transform = `translate(${(ax - 4).toFixed(1)}px, ${(ay - 4).toFixed(1)}px)`;
      });
      if (label) label.style.transform = `translate(${cx.toFixed(1)}px, ${(cy + r * 0.5 + 6).toFixed(1)}px) translateX(-50%)`;
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [active, scene]);

  // name with the signature red-dotted "i"
  const first = PROFILE.first;
  const iPos = first.indexOf('i');

  return (
    <>
      <div className="sector-inner">
        <div className="id-grid">
          <div className="id-copy">
            <SectionHeaderLabelOnly index={index} active={active} />
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
              <button className="btn btn--primary" onClick={nav.next}>Begin briefing <IArrowRight /></button>
              <a className="btn" href={PROFILE.resume} download="Resume_Gokulakrishnan_M.pdf">Resume <IDownload /></a>
            </div>
            <div className="id-socials" data-reveal>
              <span className="label label--dim">Status //</span>
              <span className="mono" style={{ fontSize: 12, color: 'var(--ok)', marginRight: 14, minWidth: '30ch' }}>{status}</span>
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
                <div key={t.label} className="tm"><b>{t.value}{t.unit && <small style={{ fontSize: 13, color: 'var(--holo)', marginLeft: 2 }}>{t.unit}</small>}</b><span>{t.label}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={`callouts ${active ? 'on' : ''}`} ref={wrap} aria-hidden>
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
    </>
  );
}
