import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SECTORS, type SectorId } from './data/profile';
import { NavContext, sectorIndex, usePageInput, type FocusKind, type Focus, type NavApi, type Overlay } from './lib/nav';
import { sound } from './lib/sound';
import type { HoloScene } from './three/HoloScene';
import { World, isCapture } from './components/World';
import { applyMotionClass, motionReduced, saveMotionPref, storedMotionPref, systemReducedMotion, type MotionPref } from './lib/motion';
import { Boot } from './components/Boot';
import { Hud } from './components/Hud';
import { Stage } from './components/Stage';
import type { OrbitController, OrbitMode, OrbitCallbacks } from './components/Orbit';
import { CommandPalette, Lightbox, RadialMenu, RepoDrawer, Reticle, Vault } from './components/Overlays';

const fromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '').split(/[?&]/)[0];
  const i = SECTORS.findIndex((s) => s.id === id);
  return i >= 0 ? i : 0;
};

export default function App() {
  const [scene, setScene] = useState<HoloScene | null>(null);
  const [booted, setBooted] = useState(isCapture);
  const [index, setIndex] = useState(fromHash);
  const [focus, setFocus] = useState<Focus | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [soundOn, setSoundOn] = useState(sound.enabled);
  const [mode, setMode] = useState<OrbitMode>('page');
  const [front, setFront] = useState(index);
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
    orbitCtl.current?.open(n);
  }, []);

  const orbitCb: OrbitCallbacks = useMemo(() => ({
    onMode: setMode,
    onFront: setFront,
    onOpen: (k: number) => {
      indexRef.current = k;
      setIndex(k);
      try { window.history.replaceState(null, '', `#/${SECTORS[k].id}`); } catch { /* ignore */ }
    },
    blocked: () => !!overlayRef.current,
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
    next: () => go(indexRef.current + 1),
    prev: () => go(indexRef.current - 1),
    focus,
    focusOn: (kind: FocusKind, id: string) => {
      const target: SectorId = kind === 'mission' ? 'missions' : kind === 'project' ? 'arsenal' : 'matrix';
      go(sectorIndex(target));
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
  }), [index, front, mode, booted, go, focus, overlay, soundOn, reducedMotion]);

  useEffect(() => {
    applyMotionClass(reducedMotion);
    scene?.setReducedMotion(reducedMotion);
  }, [reducedMotion, scene]);

  usePageInput({
    pageMode: booted && !overlay && mode === 'page',
    free: booted && !overlay,
    orbit: api.orbit,
    go,
    count: SECTORS.length,
    onMenu: () => setOverlay((o) => (o?.type === 'radial' ? null : { type: 'radial' })),
    onPalette: () => setOverlay((o) => (o?.type === 'palette' ? null : { type: 'palette' })),
  });

  useEffect(() => {
    const on = () => go(fromHash());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, [go]);

  useEffect(() => {
    const s = SECTORS[index];
    document.title = index === 0 ? 'Gokulakrishnan M — AI Engineer' : `${s.title} · Gokulakrishnan M`;
  }, [index]);

  useEffect(() => {
    if (scene && isCapture()) scene.flyTo(indexRef.current, { immediate: true });
  }, [scene]);

  const onBootDone = useCallback(() => setBooted(true), []);

  // camera intro once both the boot is done and the 3D scene exists (whichever comes last)
  const introDone = useRef(false);
  useEffect(() => {
    if (!booted || !scene || introDone.current || isCapture()) return;
    introDone.current = true;
    scene.intro(indexRef.current, 3.0);
  }, [booted, scene]);

  return (
    <NavContext.Provider value={api}>
      <World onReady={setScene} />
      <div className="atmos" aria-hidden />
      <Stage scene={scene} cb={orbitCb} bind={(c) => { orbitCtl.current = c; }} />
      <Hud scene={scene} />

      {overlay?.type === 'radial' && <RadialMenu />}
      {overlay?.type === 'palette' && <CommandPalette />}
      {overlay?.type === 'vault' && <Vault category={overlay.category} />}
      {overlay?.type === 'repos' && <RepoDrawer />}
      {overlay?.type === 'lightbox' && <Lightbox items={overlay.items} index={overlay.index} />}

      {toastMsg && <div className="toast panel" role="status">{toastMsg}</div>}
      {booted && motionAsk && (
        <div className="motion-ask panel" role="dialog" aria-label="Motion preference">
          <div className="label label--amber">System notice</div>
          <p>Your device has <b>animation effects turned off</b>, so GK.OS is running in reduced motion. This interface is built around 3D motion — enable it?</p>
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
