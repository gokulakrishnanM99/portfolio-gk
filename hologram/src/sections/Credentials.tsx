import { CERTIFICATES, DISTINCTIONS, LEADERSHIP, media } from '../data/profile';
import { useNav } from '../lib/nav';
import { SectionHeader, type SectionProps } from '../components/SectionHeader';
import { IVault } from '../components/icons';

const FAN = ['coursera-intoduction-to-data-engineering', 'gokulakrishnan-page-001', 'coursera-python-for-data-science-ai-development'];

export function Credentials({ index, active }: SectionProps) {
  const nav = useNav();
  const cats = Array.from(new Set(CERTIFICATES.map((c) => c.category)));

  return (
    <div className="sector-inner">
      <SectionHeader index={index} active={active} title={<>Credentials & <em>recognition</em></>} />

      <div className="cr-grid">
        <section className="cr-col panel panel--amber" data-reveal aria-labelledby="dist-h">
          <div className="panel-head"><span id="dist-h">Distinctions</span><span>{DISTINCTIONS.length}</span></div>
          <div className="cr-items">
            {DISTINCTIONS.map((d) => (
              <div key={d.id} className="dist">
                <div className="dv">{d.value}</div>
                <div>
                  <div className="dt">{d.title}</div>
                  <div className="dx">{d.text}</div>
                  <div className="dy">{d.year}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="cr-col panel" data-reveal aria-labelledby="lead-h">
          <div className="panel-head"><span id="lead-h">Leadership</span><span>{LEADERSHIP.length}</span></div>
          <div className="cr-items">
            {LEADERSHIP.map((l) => (
              <div key={l.id} className="lead">
                <div className="lr">{l.role}</div>
                <div className="lo">{l.org} · {l.period}</div>
                <div className="lt">{l.text}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="cr-col panel" data-reveal aria-labelledby="vault-h">
          <div className="panel-head"><span id="vault-h">Certificate vault</span><span><span className="dot" />Secured</span></div>
          <div className="vault-card">
            <button className="fan" onClick={() => nav.setOverlay({ type: 'vault' })} aria-label="Open certificate vault">
              {FAN.map((id) => <img key={id} src={media(`certificates/${id}.thumb.webp`)} alt="" loading="lazy" />)}
            </button>
            <div className="vault-stats">
              <div><b>{CERTIFICATES.length}</b><span>Records</span></div>
              <div><b>{cats.length}</b><span>Categories</span></div>
            </div>
            <div className="vault-cats">
              {cats.map((c) => (
                <button key={c} className="chip" onClick={() => nav.setOverlay({ type: 'vault', category: c })}>{c}</button>
              ))}
            </div>
            <button className="btn" style={{ alignSelf: 'flex-start', marginTop: 'auto' }} onClick={() => nav.setOverlay({ type: 'vault' })}>
              <IVault /> Open vault
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
