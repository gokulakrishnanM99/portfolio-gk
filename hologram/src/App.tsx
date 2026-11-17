import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BLOCKS, SECTORS, pageOfBlock, type BlockId, type SectorId } from './data/profile';
import { NavContext, sectorIndex, usePageInput, type FocusKind, type Focus, type GateDir, type GateState, type NavApi, type Overlay } from './lib/nav';
import { placePage, poseOf, scrollerOf, scrollToBlock } from './lib/pages';
import { GateHint } from './components/PageFooter';
import { sound } from './lib/sound';
import type { HoloScene } from './three/HoloScene';
import { World, isCapture } from './components/World';
import { applyMotionClass, motionReduced, saveMotionPref, storedMotionPref, systemReducedMotion, type MotionPref } from './lib/motion';
import { Boot } from './components/Boot';
import { Hud } from './components/Hud';
import { Stage } from './components/Stage';
import type { OrbitController, OrbitMode, OrbitCallbacks } from './components/Orbit';
import { CommandPalette, Lightbox, RadialMenu, RepoDrawer, Reticle, Vault } from './components/Overlays';

/* Addresses are plain paths: /portfolio-gk/missions opens a page; /portfolio-gk/origin, /uplink and /matrix
   (the former pages) open the page holding that section. The site root and any unknown path go to
   /portfolio-gk/identity. Old links (?hologram=true#/missions) still work. */
const BASE = import.meta.env.BASE_URL; // '/portfolio-gk/'

const resolve = (id: string): { page: number; block: BlockId | null } | null => {
  const i = SECTORS.findIndex((s) => s.id === id);
  if (i >= 0) return { page: i, block: null };
  if (Object.prototype.hasOwnProperty.call(BLOCKS, id)) return { page: pageOfBlock(id as BlockId), block: id as BlockId };
  return null;
};

const fromUrl = (): { page: number; block: BlockId | null } => {
  const path = window.location.pathname.startsWith(BASE) ? window.location.pathname.slice(BASE.length) : '';
  const fromPath = resolve(path.split('/')[0]);
  if (fromPath) return fromPath;
  const legacy = resolve(window.location.hash.replace(/^#\/?/, '').split(/[?&]/)[0]);
  return legacy ?? { page: 0, block: null };
};

/** Write the open page into the address bar (keeps only the ?capture test flag). */
const setUrl = (id: string) => {
  try {
    const keep = /[?&#]capture/.test(window.location.href) ? '?capture' : '';
    window.history.replaceState(null, '', `${BASE}${id}${keep}`);
  } catch { /* ignore */ }
};

const initialHash = fromUrl();
setUrl(initialHash.block ?? SECTORS[initialHash.page].id);

export default function App() {
  const [scene, setScene] = useState<HoloScene | null>(null);
  const [booted, setBooted] = useState(isCapture);
  const [index, setIndex] = useState(initialHash.page);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(sound.enabled);
  const [mode, setMode] = useState<OrbitMode>('page');
  const [front, setFront] = useState(index);
  const [gate, setGate] = useState<GateState>({ armed: null, idle: false });
  const modeRef = useRef<OrbitMode>('page');
  modeRef.current = mode;
  const orbitCtl = useRef<OrbitController | null>(null);
  const overlayRef = useRef<Overlay>(null);
  overlayRef.current = overlay;
  const [reducedMotion, setReducedMotion] = useState(motionReduced);
  const [motionAsk, setMotionAsk] = useState(() => !isCapture() && systemReducedMotion() && !storedMotionPref());
  const indexRef = useRef(index);
  const toastTimer = useRef(0);

  /** every page change travels through the orbital ring */
  const go = useCallback((i: number) => {
    const n = Math.max(0, Math.min(SECTORS.length - 1, i));
    if (n === indexRef.current && modeRef.current === 'page') {
      // already here (e.g. its rail tick): back to the top of the page
      scrollerOf(n)?.scrollTo({ top: 0, behavior: motionReduced() ? 'auto' : 'smooth' });
      return;
    }
    orbitCtl.current?.open(n);
  }, []);

  /** open the page holding section b, scrolled to it */
  const goBlock = useCallback((b: BlockId) => {
    const n = pageOfBlock(b);
    if (n === indexRef.current && modeRef.current === 'page') {
      const sc = scrollerOf(n);
      if (sc) scrollToBlock(sc, b, !motionReduced());
      return;
    }
    orbitCtl.current?.open(n, b);
  }, []);

  /** leave the open page past its end (next page, or the orbit overview after the last) or its top */
  const advance = useCallback((dir: GateDir) => {
    const c = orbitCtl.current;
    if (!c || modeRef.current !== 'page') return;
    const k = indexRef.current;
    if (dir === 'down') {
      if (k < SECTORS.length - 1) c.open(k + 1, 'top');
      else c.enterRing();
    } else if (k > 0) c.open(k - 1, 'end');
  }, []);

  const orbitCb: OrbitCallbacks = useMemo(() => ({
    onMode: setMode,
    onFront: setFront,
    onOpen: (k: number) => {
      indexRef.current = k;
      setIndex(k);
      setUrl(SECTORS[k].id);
    },
    blocked: () => !!overlayRef.current,
    place: placePage,
    poseOf,
  }), []);

  const api: NavApi = useMemo(() => ({
    index,
    front,
    mode,
    booted,
    go,
    orbit: () => orbitCtl.current?.enterRing(),
    step: (d: number) => orbitCtl.current?.stepBy(d),
    openFront: () => orbitCtl.current?.openFront(),
    goId: (id: SectorId) => go(sectorIndex(id)),
    goBlock,
    advance,
    gate,
    next: () => go(indexRef.current + 1),
    prev: () => go(indexRef.current - 1),
    focus,
    focusOn: (kind: FocusKind, id: string) => {
      const target: BlockId = kind === 'mission' ? 'missions' : kind === 'project' ? 'arsenal' : 'matrix';
      goBlock(target);
      setFocus({ kind, id, nonce: Date.now() });
    },
    overlay,
    setOverlay: (o: Overlay) => { if (o) sound.blip(980); setOverlay(o); },
    toast: (msg: string) => {
      setToastMsg(msg);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToastMsg(null), 2200);
    },
    soundOn,
    toggleSound: () => { const v = !sound.enabled; sound.set(v); setSoundOn(v); },
    reducedMotion,
    setMotion: (p: MotionPref) => {
      saveMotionPref(p);
      setReducedMotion(p === 'reduced');
      setMotionAsk(false);
    },
  }), [index, front, mode, booted, go, goBlock, advance, gate, focus, overlay, soundOn, reducedMotion]);

  useEffect(() => {
    applyMotionClass(reducedMotion);
    scene?.setReducedMotion(reducedMotion);
  }, [reducedMotion, scene]);

  usePageInput({
    pageMode: booted && !overlay && mode === 'page',
    free: booted && !overlay,
    index,
    reducedMotion,
    orbit: api.orbit,
    go,
    advance,
    onGate: setGate,
    count: SECTORS.length,
    onMenu: () => setOverlay((o) => (o?.type === 'radial' ? null : { type: 'radial' })),
    onPalette: () => setOverlay((o) => (o?.type === 'palette' ? null : { type: 'palette' })),
  });

  useEffect(() => {
    // back/forward, or an old #/page link typed into the address bar
    const on = () => { const h = fromUrl(); if (h.block) goBlock(h.block); else go(h.page); };
    window.addEventListener('popstate', on);
    window.addEventListener('hashchange', on);
    return () => { window.removeEventListener('popstate', on); window.removeEventListener('hashchange', on); };
  }, [go, goBlock]);

  useEffect(() => {
    const s = SECTORS[index];
    document.title = index === 0 ? 'Gokulakrishnan M · AI/ML Engineer' : `${s.title} · Gokulakrishnan M`;
  }, [index]);

  useEffect(() => {
    if (scene && isCapture()) scene.flyTo(initialHash.block ? BLOCKS[initialHash.block].pose : poseOf(indexRef.current), { immediate: true });
  }, [scene]);

  const onBootDone = useCallback(() => setBooted(true), []);

  // camera intro once both the boot is done and the 3D scene exists (whichever comes last)
  const introDone = useRef(false);
  useEffect(() => {
    if (!booted || !scene || introDone.current || isCapture()) return;
    introDone.current = true;
    scene.intro(initialHash.block ? BLOCKS[initialHash.block].pose : poseOf(indexRef.current), 3.0);
  }, [booted, scene]);

  return (
    <NavContext.Provider value={api}>
      <World onReady={setScene} />
      <div className="atmos" aria-hidden />
      <Stage scene={scene} cb={orbitCb} bind={(c) => { orbitCtl.current = c; }} initialBlock={initialHash.block} />
      <Hud scene={scene} />

      {overlay?.type === 'radial' && <RadialMenu />}
      {overlay?.type === 'palette' && <CommandPalette />}
      {overlay?.type === 'vault' && <Vault category={overlay.category} />}
      {overlay?.type === 'repos' && <RepoDrawer />}
      {overlay?.type === 'lightbox' && <Lightbox items={overlay.items} index={overlay.index} back={overlay.back} />}

      {toastMsg && <div className="toast panel" role="status">{toastMsg}</div>}
      {booted && !motionAsk && <GateHint />}
      {booted && motionAsk && (
        <div className="motion-ask panel" role="dialog" aria-label="Motion preference">
          <div className="label label--amber">System notice</div>
          <p>Your device has <b>animation effects turned off</b>, so GK.OS is running in reduced motion. This interface is built around 3D motion. Turn it on?</p>
          <div className="ma-actions">
            <button className="btn btn--primary btn--sm" onClick={() => { api.setMotion('full'); api.toast('Full motion enabled'); }}>Enable full motion</button>
            <button className="btn btn--sm" onClick={() => api.setMotion('reduced')}>Keep reduced</button>
          </div>
        </div>
      )}
      {!booted && <Boot onDone={onBootDone} />}
      <Reticle />
    </NavContext.Provider>
  );
}
