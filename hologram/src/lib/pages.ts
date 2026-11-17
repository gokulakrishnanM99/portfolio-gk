/* DOM helpers for the scrollable pages (one `.sector-inner` scroller per page). */
import { BLOCKS, SECTORS, type BlockId } from '../data/profile';
import { blendPose, type Waypoint } from '../three/HoloScene';

export type PagePlace = 'top' | 'end' | 'keep' | BlockId;

/** The scroll container of page k. */
export function scrollerOf(k: number): HTMLElement | null {
  const s = SECTORS[k];
  return s ? document.querySelector<HTMLElement>(`#${s.id} > .sector-inner`) : null;
}

/** Sub-pixel tolerant edge checks. */
export const atBottom = (sc: HTMLElement) => sc.scrollTop + sc.clientHeight >= sc.scrollHeight - 2;
export const atTop = (sc: HTMLElement) => sc.scrollTop <= 1;

/** Scroll offset that brings a block's top to the top of its page. */
export function blockOffset(sc: HTMLElement, b: BlockId) {
  const el = sc.querySelector<HTMLElement>(`[data-block="${b}"]`);
  if (!el) return 0;
  return Math.max(0, el.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - 8);
}

export function scrollToBlock(sc: HTMLElement, b: BlockId, smooth: boolean) {
  sc.scrollTo({ top: blockOffset(sc, b), behavior: smooth ? 'smooth' : 'auto' });
}

/** Put page k at a position before it is shown. */
export function placePage(k: number, at: PagePlace) {
  const sc = scrollerOf(k);
  if (!sc || at === 'keep') return;
  if (at === 'top') sc.scrollTop = 0;
  else if (at === 'end') sc.scrollTop = sc.scrollHeight;
  else sc.scrollTop = blockOffset(sc, at);
}

/** The block the visitor is reading: the last one whose top has passed 45% of the page height. */
export function currentBlock(k: number): BlockId {
  const blocks = SECTORS[k].blocks as readonly BlockId[];
  const sc = scrollerOf(k);
  if (!sc || blocks.length === 1) return blocks[0];
  if (atBottom(sc) && sc.scrollTop > 0) return blocks[blocks.length - 1];
  const line = sc.getBoundingClientRect().top + sc.clientHeight * 0.45;
  let cur = blocks[0];
  for (const b of blocks) {
    const el = sc.querySelector<HTMLElement>(`[data-block="${b}"]`);
    if (el && el.getBoundingClientRect().top <= line) cur = b;
  }
  return cur;
}

const smooth = (x: number) => x * x * (3 - 2 * x);

/**
 * Camera pose for page k at its current scroll position. Between two sections the pose is blended
 * along the scroll, so the scene glides with the reader instead of cutting from one framing to the next:
 * the blend runs while the next section's top travels from 85% to 35% of the page height (finishing by
 * the end of the page, so the last section is always reached).
 */
export function poseOf(k: number): Waypoint {
  const blocks = SECTORS[k].blocks as readonly BlockId[];
  const sc = scrollerOf(k);
  const first = BLOCKS[blocks[0]].pose;
  if (!sc || blocks.length === 1) return blendPose(first, first, 0);
  const h = sc.clientHeight;
  const max = Math.max(0, sc.scrollHeight - h);
  const s = sc.scrollTop;
  const top0 = sc.getBoundingClientRect().top - s;
  // one blend zone per section boundary
  const zones: { a: number; b: number; st: number; e: number }[] = [];
  for (let i = 1; i < blocks.length; i++) {
    const el = sc.querySelector<HTMLElement>(`[data-block="${blocks[i]}"]`);
    if (!el) continue;
    const at = el.getBoundingClientRect().top - top0; // block top in scroll coordinates
    const e = Math.min(at - h * 0.35, max);
    zones.push({ a: BLOCKS[blocks[i - 1]].pose, b: BLOCKS[blocks[i]].pose, st: Math.min(at - h * 0.85, e - h * 0.25), e });
  }
  // short sections near the end can make zones overlap: split the overlap so they run back to back
  for (let i = 1; i < zones.length; i++) {
    const p = zones[i - 1], z = zones[i];
    if (p.e > z.st) {
      p.e = Math.max((p.e + z.st) / 2, p.st + 1);
      z.st = p.e;
      if (z.e <= z.st) z.e = z.st + 1;
    }
  }
  let pose = blendPose(first, first, 0);
  for (const z of zones) {
    if (s <= z.st) break;
    pose = blendPose(z.a, z.b, s >= z.e ? 1 : smooth((s - z.st) / (z.e - z.st)));
  }
  return pose;
}
