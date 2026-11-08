import { useEffect, useRef } from 'react';
import { SECTORS } from '../data/profile';
import { useNav } from '../lib/nav';
import type { HoloScene } from '../three/HoloScene';
import { isCapture } from '../lib/motion';
import { OrbitController, OrbitLayer, type OrbitCallbacks } from './Orbit';
import { Identity } from '../sections/Identity';
import { Origin } from '../sections/Origin';
import { Missions } from '../sections/Missions';
import { Arsenal } from '../sections/Arsenal';
import { Matrix } from '../sections/Matrix';
import { Credentials } from '../sections/Credentials';
import { Transmissions } from '../sections/Transmissions';
import { Uplink } from '../sections/Uplink';

const SECTIONS = [Identity, Origin, Missions, Arsenal, Matrix, Credentials, Transmissions, Uplink];

export function Stage({ scene, bind, cb }: {
  scene: HoloScene | null;
  bind: (c: OrbitController | null) => void;
  cb: OrbitCallbacks;
}) {
  const nav = useNav();
  const refs = useRef<(HTMLElement | null)[]>([]);
  const orbitRef = useRef<HTMLDivElement>(null);
  const ctrl = useRef<OrbitController | null>(null);
  const cbRef = useRef(cb);
  cbRef.current = cb;

  // one controller for the lifetime of the stage
  useEffect(() => {
    const c = new OrbitController(orbitRef.current!, refs.current as HTMLElement[], scene, {
      onMode: (m) => cbRef.current.onMode(m),
      onFront: (k) => cbRef.current.onFront(k),
      onOpen: (k) => cbRef.current.onOpen(k),
      blocked: () => cbRef.current.blocked(),
    });
    ctrl.current = c;
    bind(c);
    if (import.meta.env.DEV) (window as unknown as { __orbit: OrbitController }).__orbit = c;
    return () => { c.dispose(); bind(null); ctrl.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { ctrl.current?.setScene(scene); }, [scene]);
  useEffect(() => { ctrl.current?.setReduced(nav.reducedMotion); }, [nav.reducedMotion]);

  // first page after boot
  const revealed = useRef(false);
  useEffect(() => {
    if (!nav.booted || revealed.current || !ctrl.current) return;
    revealed.current = true;
    ctrl.current.reveal(nav.index, !isCapture() && !nav.reducedMotion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.booted]);

  // only the open page is focusable
  useEffect(() => {
    refs.current.forEach((el, k) => { if (el) el.inert = !(nav.booted && k === nav.index && nav.mode === 'page'); });
  }, [nav.index, nav.booted, nav.mode]);

  return (
    <main className={`stage stage--${nav.mode}`}>
      {SECTIONS.map((Comp, i) => {
        const active = nav.booted && nav.index === i;
        return (
          <section
            key={SECTORS[i].id}
            id={SECTORS[i].id}
            ref={(el) => { refs.current[i] = el; }}
            className={`sector sector--${SECTORS[i].id} ${active && nav.mode === 'page' ? 'is-active' : ''}`}
            aria-hidden={!active || nav.mode !== 'page'}
            aria-label={SECTORS[i].title}
          >
            <Comp index={i} active={active} scene={scene} />
          </section>
        );
      })}
      <OrbitLayer
        ref={orbitRef}
        front={nav.front}
        onCard={(i) => { const c = ctrl.current; if (!c || c.consumeDrag()) return; c.open(i); }}
        onStep={(d) => ctrl.current?.stepBy(d)}
        onOpenFront={() => ctrl.current?.openFront()}
      />
    </main>
  );
}
