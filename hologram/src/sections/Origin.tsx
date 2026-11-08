import { ORIGIN, media } from '../data/profile';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';

export function Origin({ index, active }: SectionProps) {
  return (
    <div className="sector-inner">
      <div className="or-grid">
        <figure className="signature panel panel--amber" data-reveal style={{ margin: 0 }}>
          <div className="panel-head">
            <span><span className="dot" style={{ background: 'var(--amber)', boxShadow: '0 0 10px var(--amber)' }} />Neural signature // GK</span>
            <span>Bio ⟷ AI</span>
          </div>
          <div className="sig-img">
            <img
              src={media('misc/neural-circuit.webp')}
              alt="Gold circuit artwork: a neuron, DNA helix, robotic arm and neural network wired into a heartbeat core, with the initials GK set inside a molecule"
              loading="lazy" decoding="async"
            />
            <div className="sig-scan" aria-hidden />
          </div>
          <figcaption className="sig-foot">
            <span className="label label--dim">Neuron · DNA · Robotics · Neural nets</span>
            <span className="label label--amber">Biomedical → AI</span>
          </figcaption>
        </figure>

        <div className="or-copy">
          <SectionHeader index={index} active={active} title={<>From neurons to <em>neural networks</em></>} />
          {ORIGIN.paragraphs.map((p) => <p key={p.slice(0, 20)} data-reveal>{p}</p>)}

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

          <div className="interests" data-reveal>
            <span className="label label--dim" style={{ marginRight: 6 }}>Off-duty</span>
            {ORIGIN.interests.map((i) => <span key={i} className="chip">{i}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}
