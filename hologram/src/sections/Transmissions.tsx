import { useEffect, useState } from 'react';
import { BLOGS, DESIGNS, MEDIUM_BASE, QUOTES, QUOTE_TRANSLATIONS, media } from '../data/profile';
import { useNav } from '../lib/nav';
import { sound } from '../lib/sound';
import { isLatin, useDecrypt } from '../lib/useDecrypt';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';
import { IArrowUpRight, IChevronLeft, IChevronRight, IPlay } from '../components/icons';

/** Time on each quote: 8.8 s, and 9.6 s for the longer ones. */
const QUOTE_MS = 8800;
const LONG_QUOTE_MS = 9600;
const LONG_QUOTE = 70; // characters
const quoteMs = (q: string) => (q.length > LONG_QUOTE ? LONG_QUOTE_MS : QUOTE_MS);

function Quote({ active }: { active: boolean }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [translated, setTranslated] = useState(false);
  const original = QUOTES[i];
  const translation = QUOTE_TRANSLATIONS[original];
  const q = translated && translation ? translation : original;
  const latin = isLatin(q);
  const text = useDecrypt(q, active, Math.min(1400, 300 + q.length * 14));
  const ms = quoteMs(q);
  // reading a translation holds the quote (it would otherwise move on mid-read)
  const holding = paused || translated;

  useEffect(() => { setTranslated(false); }, [i]);

  useEffect(() => {
    if (!active || holding) return;
    const id = window.setTimeout(() => setI((x) => (x + 1) % QUOTES.length), ms);
    return () => clearTimeout(id);
  }, [i, active, holding, ms]);

  const go = (d: number) => { setI((x) => (x + d + QUOTES.length) % QUOTES.length); sound.tick(); };

  return (
    <section className="quote-panel panel" data-reveal onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      aria-roledescription="quote rotator" aria-label="Quotes">
      <div className="panel-head">
        <span><span className="dot" />Decrypted thought</span>
        <span>Q-{String(i + 1).padStart(2, '0')} / {QUOTES.length}</span>
      </div>
      <div className="quote-body">
        <div className="qmark" aria-hidden>“</div>
        <blockquote key={`${i}-${translated}`} className={`quote-text ${latin ? '' : 'tamil fade-in'}`} style={{ margin: 0 }} aria-live="polite">
          <span aria-hidden>{text}</span>
          <span className="sr-only">{q}</span>
        </blockquote>
        {translation && (
          <button className={`btn btn--sm quote-tr ${translated ? 'is-on' : ''}`} onClick={() => { setTranslated((t) => !t); sound.tick(); }}
            aria-pressed={translated}>
            {translated ? 'Show original' : 'Translate'}
          </button>
        )}
      </div>
      <div className="quote-ctrl">
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous quote"><IChevronLeft /></button>
        <div className="quote-progress" aria-hidden>
          <span key={`${i}-${holding}-${active}`} className={active && !holding ? 'run' : ''} style={{ ['--qd' as string]: `${ms}ms` }} />
        </div>
        <button className="icon-btn" onClick={() => go(1)} aria-label="Next quote"><IChevronRight /></button>
      </div>
    </section>
  );
}

/** Blogs: a vertical stack of transmission cards (cover banner, title, line, date). */
function Blogs() {
  return (
    <section className="tx-window tx-blogs panel" data-reveal aria-label="Blogs">
      <div className="panel-head">
        <span><span className="dot" />Blog transmissions · {BLOGS.length}</span>
        <a className="link-arrow" href={MEDIUM_BASE} target="_blank" rel="noreferrer">Medium <IArrowUpRight /></a>
      </div>
      <div className="blog-list">
        {BLOGS.map((b) => (
          <a key={b.id} className="blog-card" href={`${MEDIUM_BASE}${b.id}`} target="_blank" rel="noreferrer">
            <div className="bc-img">
              <img src={media(`blogs/${b.id}.thumb.webp`)} alt="" loading="lazy" decoding="async" />
            </div>
            <div className="bc-body">
              <div className="bc-title">{b.title}</div>
              {b.subtitle && <div className="bc-sub">{b.subtitle}</div>}
              <div className="bc-foot">
                <span>{[b.date, b.read && `${b.read} read`].filter(Boolean).join(' · ') || 'Medium'}</span>
                <span className="bc-go">Read <IArrowUpRight width={12} height={12} /></span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

/** Designs: one large image per row; selecting one opens it full screen (with its video, if any). */
function Designs() {
  const nav = useNav();
  const open = (k: number) => nav.setOverlay({
    type: 'lightbox', index: k,
    items: DESIGNS.map((d) => ({ src: media(`designs/${d.id}.webp`), title: d.title, sub: d.caption, video: d.video })),
  });
  return (
    <section className="tx-window tx-designs panel" data-reveal aria-label="Designs">
      <div className="panel-head">
        <span><span className="dot" style={{ background: 'var(--amber)', boxShadow: '0 0 10px var(--amber)' }} />Design studio · {DESIGNS.length}</span>
        <span>Select to view full screen</span>
      </div>
      <div className="design-stack">
        {DESIGNS.map((d, k) => (
          <button key={d.id} className="design-item" onClick={() => open(k)} aria-label={`${d.title}: view full screen`}>
            <div className="di-img">
              <img src={media(`designs/${d.id}.webp`)} width={d.w} height={d.h} alt="" loading="lazy" decoding="async" />
              {d.video && <span className="di-play"><IPlay width={14} height={14} /> Title card</span>}
            </div>
            <div className="di-meta">
              <span className="di-title">{d.title}</span>
              <span className="di-cap">{d.caption}</span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

export function Transmissions({ active }: SectionProps) {
  return (
    <div className="blk-body">
      <SectionHeader block="transmissions" active={active} title={<>Beyond the <em>code</em></>}
        lede="Outside work, I write stories and short lines and design posters, all under the pen name tinyDragon." />
      {/* left: quotes over the design studio; right: the blogs, stacked */}
      <div className="tx-cols">
        <div className="tx-col">
          <Quote active={active} />
          <Designs />
        </div>
        <Blogs />
      </div>
    </div>
  );
}
