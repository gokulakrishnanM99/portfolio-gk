/* DOM helpers for the scrollable pages (one `.sector-inner` scroller per page). */
import { BLOCKS, SECTORS, type BlockId } from '../data/profile';

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

/** Camera pose for page k at its current scroll position. */
export const poseOf = (k: number) => BLOCKS[currentBlock(k)].pose;
