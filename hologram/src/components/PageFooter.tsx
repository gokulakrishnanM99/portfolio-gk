import { useEffect, useState } from 'react';
import { PROFILE, SECTORS, SOCIALS } from '../data/profile';
import { SCROLL_KEYS, useNav } from '../lib/nav';
import { atBottom, atTop, scrollerOf } from '../lib/pages';
import { IArrowUpRight, IFile, IGithub, ILinkedin, IMail, IMedium } from './icons';

const ICON = { linkedin: ILinkedin, github: IGithub, medium: IMedium } as const;

const touchFirst = () => typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

/** Contact channels — under every page. */
export function ContactIcons() {
  return (
    <div className="pf-contacts">
      {SOCIALS.map((s) => {
        const I = ICON[s.id];
        return <a key={s.id} className="icon-btn" href={s.url} target="_blank" rel="noreferrer" aria-label={s.label} title={s.label}><I /></a>;
      })}
      <a className="icon-btn" href={`mailto:${PROFILE.email}`} aria-label={`Email ${PROFILE.email}`} title={PROFILE.email}><IMail /></a>
      <a className="icon-btn" href={PROFILE.resume} download="Resume_Gokulakrishnan_M.pdf" aria-label="Download resume (PDF)" title="Resume (PDF)"><IFile /></a>
    </div>
  );
}

/** What lies past the end of page k. */
export function nextLabel(k: number) {
  const n = SECTORS[k + 1];
  return n ? `${n.code} · ${n.title}` : 'Orbit view';
}

/** Page footer: contact channels, the end-of-page marker (lights up during the scroll pause) and credits. */
export function PageFooter({ index }: { index: number }) {
  const nav = useNav();
  const here = nav.index === index && nav.mode === 'page';
  const armed = here && (nav.gate.armed === 'down' || nav.gate.idle);
  const last = index === SECTORS.length - 1;
  const verb = touchFirst() ? 'Swipe up' : 'Scroll';

  return (
    <footer className={`page-foot ${armed ? 'is-armed' : ''}`} aria-label="Page footer">
      <div className="pf-row">
        <div className="pf-reach">
          <span className="label label--dim">Open a channel</span>
          <ContactIcons />
        </div>
        <button className="pf-next" onClick={() => nav.advance('down')}
          aria-label={last ? 'End of portfolio. Open the orbit view' : `Continue to ${nextLabel(index)}`}>
          <span className="pf-end">End of {SECTORS[index].title}</span>
          <span className="pf-go">
            {armed ? `${verb} again` : last ? 'All pages' : 'Next'} → <b>{nextLabel(index)}</b>
          </span>
          <span className="chev" aria-hidden />
        </button>
      </div>
      <div className="pf-legal">
        <span>© {new Date().getFullYear()} {PROFILE.name}</span>
        <span>GK.OS holographic interface</span>
        <a href={PROFILE.classicSite} target="_blank" rel="noreferrer">Classic portfolio <IArrowUpRight width={11} height={11} /></a>
      </div>
    </footer>
  );
}

/** Bottom pop-up: confirms the scroll pause, and after 40 s at the end of a page reminds how to continue. */
export function GateHint() {
  const nav = useNav();
  const { armed, idle } = nav.gate;
  const [show, setShow] = useState(false);
  const page = nav.mode === 'page' && !nav.overlay;

  useEffect(() => {
    if (!page || (!armed && !idle)) { setShow(false); return; }
    // only at the very edge it talks about: never anywhere else on the page
    const sc = scrollerOf(nav.index);
    const atEdge = !!sc && (armed === 'up' && !idle ? atTop(sc) : atBottom(sc));
    if (!atEdge) { setShow(false); return; }
    setShow(true);
    // gone as soon as the visitor is active again (the 40-second reminder is also reset in nav)
    let moved = 0;
    const hide = () => setShow(false);
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      moved += Math.abs(e.movementX) + Math.abs(e.movementY);
      if (moved >= 24) hide();
    };
    const onClick = (e: MouseEvent) => { if (!(e.target as Element)?.closest?.('.gate-hint')) hide(); };
    const onKey = (e: KeyboardEvent) => { if (!SCROLL_KEYS.has(e.key)) hide(); };
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('click', onClick, true);
    window.addEventListener('keydown', onKey);
    const t = idle ? 0 : window.setTimeout(hide, 3800); // the pause confirmation is brief
    return () => {
      clearTimeout(t);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('click', onClick, true);
      window.removeEventListener('keydown', onKey);
    };
  }, [armed, idle, page, nav.index]);

  if (!show) return null;
  const k = nav.index;
  const s = SECTORS[k];
  const last = k === SECTORS.length - 1;
  const verb = touchFirst() ? 'Swipe' : 'Scroll';
  const up = armed === 'up' && !idle;

  let text: string;
  if (up) text = `Top of ${s.title} · ${verb.toLowerCase()} up again for ${SECTORS[k - 1]?.title}`;
  else if (idle) text = last ? `That’s everything · ${verb.toLowerCase()} further to see all pages in orbit` : `${verb} further to move to the next page · ${SECTORS[k + 1].title}`;
  else text = last ? `End of the portfolio · ${verb.toLowerCase()} again for the orbit view` : `End of ${s.title} · ${verb.toLowerCase()} again for ${SECTORS[k + 1].title}`;

  return (
    <div className={`gate-hint panel ${idle ? 'is-idle' : ''}`} role="status" aria-live="polite">
      <span className={`gh-arrow ${up ? 'up' : ''}`} aria-hidden />
      <span className="gh-text">{text}</span>
      <button className="btn btn--sm btn--primary" onClick={() => nav.advance(up ? 'up' : 'down')}>
        {up ? 'Back' : last ? 'Orbit view' : 'Continue'}
      </button>
    </div>
  );
}
