import { useEffect, useRef, type ComponentType } from 'react';
import { BLOCKS, SECTORS, type BlockId } from '../data/profile';

/** Phone-sized screens (portrait phones, or landscape phones with a short height). */
const isPhone = () => window.matchMedia('(max-width: 600px), (max-height: 500px) and (pointer: coarse)').matches;
import { useNav } from '../lib/nav';
import type { HoloScene } from '../three/HoloScene';
import { isCapture } from '../lib/motion';
import { poseOf, scrollerOf, scrollToBlock } from '../lib/pages';
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

  // scrolling through a page: the camera glides with the scroll from one section's framing to the next
  // (one continuous page, no cuts), and the hero callouts hide once the visitor scrolls down.
  // On phones the scene sits behind the content, so it holds still and drops to a lighter frame rate.
  useEffect(() => {
    if (!nav.booted || nav.mode !== 'page') return;
    const k = nav.index;
    const sc = scrollerOf(k);
    if (!sc) return;
    let phone = isPhone();
    scene?.setCalm(phone);
    let raf = 0;
    const update = () => {
      raf = 0;
      if (!phone) scene?.setTrack(poseOf(k));
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(update); };
    const onResize = () => {
      phone = isPhone();
      scene?.setCalm(phone);
      if (phone) scene?.setTrack(null);
      on();
    };
    sc.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', onResize);
    update();
    return () => {
      sc.removeEventListener('scroll', on);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
      scene?.setTrack(null);
      scene?.setCalm(false);
    };
  }, [nav.index, nav.mode, nav.booted, scene]);

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
            {i === 0 && <IdentityCallouts active={active && nav.mode === 'page'} scene={scene} />}
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
