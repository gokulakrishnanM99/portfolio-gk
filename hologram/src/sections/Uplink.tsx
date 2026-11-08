import { useState } from 'react';
import { PROFILE, SOCIALS } from '../data/profile';
import { useNav } from '../lib/nav';
import { SectionHeaderLabelOnly } from './parts';
import type { SectionProps } from '../components/SectionHeader';
import { IArrowUpRight, ICheck, ICopy, IFile, IGithub, ILinkedin, IMedium, ISend } from '../components/icons';

const ICON = { linkedin: ILinkedin, github: IGithub, medium: IMedium } as const;

export function Uplink({ index, active }: SectionProps) {
  const nav = useNav();
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      nav.toast('Email copied to clipboard');
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      window.location.href = `mailto:${PROFILE.email}`;
    }
  };

  const transmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(name ? `Hello from ${name}` : 'Hello from your portfolio');
    const body = encodeURIComponent(msg || '');
    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="sector-inner">
      <div className="up-wrap">
        <div style={{ display: 'flex', justifyContent: 'center' }}><SectionHeaderLabelOnly index={index} active={active} /></div>
        <h2 className="up-title" data-reveal>Let’s build something <em>intelligent.</em></h2>
        <p className="up-lede" data-reveal>
          Have a problem worth modelling, a pipeline to scale, or an idea that needs an agent? Open a channel.
        </p>

        <div className="email-line" data-reveal>
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <button className="btn btn--primary" onClick={copy} aria-label="Copy email address">
            {copied ? <ICheck /> : <ICopy />} {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <div className="channels">
          {SOCIALS.map((s) => {
            const I = ICON[s.id];
            return (
              <a key={s.id} className="channel panel" href={s.url} target="_blank" rel="noreferrer" data-reveal>
                <span className="ch-top"><I /><IArrowUpRight /></span>
                <span className="ch-name">{s.label}</span>
                <span className="ch-handle">{s.handle}</span>
              </a>
            );
          })}
          <a className="channel panel panel--amber" href={PROFILE.resume} download="Resume_Gokulakrishnan_M.pdf" data-reveal>
            <span className="ch-top" style={{ color: 'var(--amber)' }}><IFile /><span className="label label--amber">PDF</span></span>
            <span className="ch-name">Resume</span>
            <span className="ch-handle">Full dossier · download</span>
          </a>
        </div>

        <form className="compose panel" onSubmit={transmit} data-reveal aria-label="Compose a message">
          <label className="sr-only" htmlFor="up-name">Your name</label>
          <input id="up-name" className="field" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          <label className="sr-only" htmlFor="up-msg">Message</label>
          <input id="up-msg" className="field" placeholder="Message — opens in your mail app" value={msg} onChange={(e) => setMsg(e.target.value)} />
          <button className="btn btn--amber" type="submit"><ISend /> Transmit</button>
        </form>

        <div className="up-foot" data-reveal>
          <span>© {new Date().getFullYear()} {PROFILE.name}</span>
          <span>GK.OS holographic interface</span>
          <a href={PROFILE.classicSite} target="_blank" rel="noreferrer">Classic portfolio ↗</a>
        </div>
      </div>
    </div>
  );
}
