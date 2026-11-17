import { useEffect, useRef, useState, type ComponentType } from 'react';
import { BLOCKS, SECTORS, type BlockId } from '../data/profile';
import { useNav } from '../lib/nav';
import type { HoloScene } from '../three/HoloScene';
import { isCapture } from '../lib/motion';
import { currentBlock, scrollerOf, scrollToBlock } from '../lib/pages';
import { OrbitController, OrbitLayer, type OrbitCallbacks } from './Orbit';
import { PageFooter } from './PageFooter';
import type { SectionProps } from './SectionHeader';
import { Identity, IdentityCallouts } from '../sections/Identity';
import { Origin } from '../sections/Origin';
import { Missions } from '../sections/Missions';
import { Arsenal } from '../sections/Arsenal';
import { Matrix } from '../sections/Matrix';
import { Credentials } from '../sections/Credentials';
import { Transmissions } from '../sections/Transmissions';
import { Uplink } from '../sections/Uplink';

const BLOCK_VIEW: Record<BlockId, ComponentType<SectionProps>> = {
  identity: Identity, origin: Origin, uplink: Uplink, missions: Missions,
  arsenal: Arsenal, matrix: Matrix, credentials: Credentials, transmissions: Transmissions,
};

export function Stage({ scene, bind, cb, initialBlock }: {
  scene: HoloScene | null;
  bind: (c: OrbitController | null) => void;
  cb: OrbitCallbacks;
  /** section to open at on first load (deep link such as #/matrix) */
  initialBlock: BlockId | null;
}) {
  const nav = useNav();
  const refs = useRef<(HTMLElement | null)[]>([]);
  const orbitRef = useRef<HTMLDivElement>(null);
  const ctrl = useRef<OrbitController | null>(null);
  const cbRef = useRef(cb);
  cbRef.current = cb;
  const [heroOn, setHeroOn] = useState(true);

  // one controller for the lifetime of the stage
  useEffect(() => {
    const c = new OrbitController(orbitRef.current!, refs.current as HTMLElement[], scene, {
      onMode: (m) => cbRef.current.onMode(m),
      onFront: (k) => cbRef.current.onFront(k),
      onOpen: (k) => cbRef.current.onOpen(k),
      blocked: () => cbRef.current.blocked(),
      place: (k, at) => cbRef.current.place(k, at),
      poseOf: (k) => cbRef.current.poseOf(k),
    });
    ctrl.current = c;
    bind(c);
    if (import.meta.env.DEV) (window as unknown as { __orbit: OrbitController }).__orbit = c;
    return () => { c.dispose(); bind(null); ctrl.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { ctrl.current?.setScene(scene); }, [scene]);
  useEffect(() => { ctrl.current?.setReduced(nav.reducedMotion); }, [nav.reducedMotion]);

  // first page after boot (a deep link may point at a section further down the page)
  const revealed = useRef(false);
  useEffect(() => {
    if (!nav.booted || revealed.current || !ctrl.current) return;
    revealed.current = true;
    const sc = scrollerOf(nav.index);
    if (sc && initialBlock) scrollToBlock(sc, initialBlock, false);
    ctrl.current.reveal(nav.index, !isCapture() && !nav.reducedMotion);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.booted]);

  // only the open page is focusable
  useEffect(() => {
    refs.current.forEach((el, k) => { if (el) el.inert = !(nav.booted && k === nav.index && nav.mode === 'page'); });
  }, [nav.index, nav.booted, nav.mode]);

  // scrolling through a page: re-frame the 3D scene for each section, and hide the hero callouts
  const lastPose = useRef(-1);
  useEffect(() => {
    if (!nav.booted || nav.mode !== 'page') return;
    const k = nav.index;
    const sc = scrollerOf(k);
    if (!sc) return;
    lastPose.current = BLOCKS[currentBlock(k)].pose; // the open transition already flew here
    let raf = 0;
    const update = () => {
      raf = 0;
      if (k === 0) setHeroOn(sc.scrollTop < sc.clientHeight * 0.22);
      const pose = BLOCKS[currentBlock(k)].pose;
      if (pose !== lastPose.current) {
        lastPose.current = pose;
        scene?.flyTo(pose, { duration: nav.reducedMotion ? 0 : 1.3 });
      }
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    sc.addEventListener('scroll', on, { passive: true });
    update();
    return () => { sc.removeEventListener('scroll', on); cancelAnimationFrame(raf); };
  }, [nav.index, nav.mode, nav.booted, scene, nav.reducedMotion]);

  return (
    <main className={`stage stage--${nav.mode}`}>
      {SECTORS.map((s, i) => {
        const active = nav.booted && nav.index === i;
        return (
          <section
            key={s.id}
            id={s.id}
            ref={(el) => { refs.current[i] = el; }}
            className={`sector sector--${s.id} ${active && nav.mode === 'page' ? 'is-active' : ''}`}
            aria-hidden={!active || nav.mode !== 'page'}
            aria-label={s.title}
          >
            <div className="sector-inner">
              {(s.blocks as readonly BlockId[]).map((b) => {
                const View = BLOCK_VIEW[b];
                return (
                  <div key={b} className={`blk blk--${b}`} data-block={b} aria-label={BLOCKS[b].title}>
                    <View active={active} scene={scene} />
                  </div>
                );
              })}
              <PageFooter index={i} />
            </div>
            {i === 0 && <IdentityCallouts on={active && nav.mode === 'page' && heroOn} scene={scene} />}
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
