import { useEffect, useState } from 'react';
import { BLOGS, DESIGNS, MEDIUM_BASE, QUOTES, QUOTE_AUTHOR, media } from '../data/profile';
import { useNav } from '../lib/nav';
import { sound } from '../lib/sound';
import { isLatin, useDecrypt } from '../lib/useDecrypt';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';
import { IArrowUpRight, IChevronLeft, IChevronRight, IPlay } from '../components/icons';

const QUOTE_MS = 8000;

function Quote({ active }: { active: boolean }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const q = QUOTES[i];
  const latin = isLatin(q);
  const text = useDecrypt(q, active, Math.min(1400, 300 + q.length * 14));

  useEffect(() => {
    if (!active || paused) return;
    const id = window.setTimeout(() => setI((x) => (x + 1) % QUOTES.length), QUOTE_MS);
    return () => clearTimeout(id);
  }, [i, active, paused]);

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
        <blockquote key={i} className={`quote-text ${latin ? '' : 'tamil fade-in'}`} style={{ margin: 0 }} aria-live="polite">
          <span aria-hidden>{text}</span>
          <span className="sr-only">{q}</span>
        </blockquote>
        <div className="quote-author">— {QUOTE_AUTHOR}</div>
      </div>
      <div className="quote-ctrl">
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous quote"><IChevronLeft /></button>
        <div className="quote-progress" aria-hidden>
          <span key={`${i}-${paused}-${active}`} className={active && !paused ? 'run' : ''} style={{ ['--qd' as string]: `${QUOTE_MS}ms` }} />
        </div>
        <button className="icon-btn" onClick={() => go(1)} aria-label="Next quote"><IChevronRight /></button>
      </div>
    </section>
  );
}

export function Transmissions({ index, active }: SectionProps) {
  const nav = useNav();
  const [tab, setTab] = useState<'blogs' | 'designs'>('blogs');

  const openDesign = (k: number) => nav.setOverlay({
    type: 'lightbox', index: k,
    items: DESIGNS.map((d) => ({ src: media(`designs/${d.id}.webp`), title: d.title, sub: d.caption, video: d.video })),
  });

  return (
    <div className="sector-inner">
      <SectionHeader index={index} active={active} title={<>Off-duty <em>transmissions</em></>}
        lede="Away from models and pipelines I write stories, short lines and design posters — under the pen name tinyDragon." />

      <div className="tx-grid">
        <Quote active={active} />

        <section className="tx-side panel" data-reveal>
          <div className="tx-tabs" role="tablist">
            <button role="tab" aria-selected={tab === 'blogs'} className={`tab ${tab === 'blogs' ? 'is-active' : ''}`} onClick={() => setTab('blogs')}>
              Blogs<span className="n">{BLOGS.length}</span>
            </button>
            <button role="tab" aria-selected={tab === 'designs'} className={`tab ${tab === 'designs' ? 'is-active' : ''}`} onClick={() => setTab('designs')}>
              Designs<span className="n">{DESIGNS.length}</span>
            </button>
            <span className="spacer" />
            <a className="link-arrow" href={MEDIUM_BASE} target="_blank" rel="noreferrer">Medium <IArrowUpRight /></a>
          </div>

          {tab === 'blogs' ? (
            <div className="tx-list fade-in" role="tabpanel">
              {BLOGS.map((b) => (
                <a key={b.id} className="blog" href={`${MEDIUM_BASE}${b.id}`} target="_blank" rel="noreferrer">
                  <img src={media(`blogs/${b.id}.thumb.webp`)} alt="" loading="lazy" decoding="async" />
                  <div>
                    <div className="bt">{b.title}</div>
                    <div className="bs">{[b.subtitle, b.date, b.read && `${b.read} read`].filter(Boolean).join(' · ') || 'Read on Medium'}</div>
                  </div>
                  <IArrowUpRight />
                </a>
              ))}
            </div>
          ) : (
            <div className="tx-list fade-in" role="tabpanel">
              <div className="designs">
                {DESIGNS.map((d, k) => (
                  <button key={d.id} className="thumb" onClick={() => openDesign(k)}>
                    <div className="img"><img src={media(`designs/${d.id}.thumb.webp`)} alt="" loading="lazy" /></div>
                    <div className="meta">
                      <div className="t" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {d.title} {d.video && <IPlay width={12} height={12} style={{ color: 'var(--holo)' }} />}
                      </div>
                      <div className="s">{d.video ? 'Poster + title card' : 'Poster'}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
