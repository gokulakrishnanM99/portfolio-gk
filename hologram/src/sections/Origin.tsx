import { useRef } from 'react';
import { ORIGIN, media } from '../data/profile';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';

export function Origin({ active }: SectionProps) {
  // mouse tilt: the artwork floats in front of its plate, so tilting shows it standing off the screen
  const stage = useRef<HTMLDivElement>(null);
  const tilt = (e: React.PointerEvent<HTMLElement>) => {
    const el = stage.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty('--ry', `${(x * 10).toFixed(2)}deg`);
    el.style.setProperty('--rx', `${(-y * 8).toFixed(2)}deg`);
  };
  const untilt = () => { stage.current?.style.removeProperty('--rx'); stage.current?.style.removeProperty('--ry'); };
  return (
    <div className="blk-body">
      <div className="or-grid">
        <div className="or-copy">
          <SectionHeader block="origin" active={active} title={<>From neurons to <em>neural networks</em></>} />
          <div className="or-body">
            <div className="or-text">
              {ORIGIN.paragraphs.map((p) => <p key={p.slice(0, 20)} data-reveal>{p}</p>)}
            </div>
            <div className="edu">
              {ORIGIN.education.map((e) => (
                <div key={e.id} className="edu-card panel" data-reveal>
                  <div className="ei">{e.institution}</div>
                  <div className="ed">{e.degree}</div>
                  <div className="ep">{e.period}</div>
                  <div className="em"><b>{e.metric}</b><span>{e.metricLabel}</span></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <figure className="signature panel panel--amber" data-reveal style={{ margin: 0 }} onPointerMove={tilt} onPointerLeave={untilt}>
          <div className="panel-head">
            <span><span className="dot" style={{ background: 'var(--amber)', boxShadow: '0 0 10px var(--amber)' }} />Neural signature // GK</span>
            <span>Bio ⟷ AI</span>
          </div>
          <div className="sig-img" ref={stage}>
            <div className="sig-plate" aria-hidden><div className="sig-scan" /></div>
            <img
              className="sig-art"
              src={media('misc/neural-circuit.webp')}
              alt="Gold circuit artwork: a neuron, DNA helix, robotic arm and neural network wired into a heartbeat core, with the initials GK set inside a molecule"
              loading="lazy" decoding="async"
            />
          </div>
          <figcaption className="sig-foot">
            <span className="label label--dim">Neuron · DNA · Robotics · Neural nets</span>
            <span className="label label--amber">Biomedical → AI</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
