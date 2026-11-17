import type { ReactNode } from 'react';
import { BLOCKS, blockCode, type BlockId } from '../data/profile';
import { useDecrypt } from '../lib/useDecrypt';
import type { HoloScene } from '../three/HoloScene';

/** Props every section block receives. `active` = its page is the open page. */
export interface SectionProps { active: boolean; scene: HoloScene | null }

export function SectionHeader({ block, active, title, lede, children }: {
  block: BlockId; active: boolean; title: ReactNode; lede?: ReactNode; children?: ReactNode;
}) {
  const label = useDecrypt(`Protocol ${blockCode(block)} // ${BLOCKS[block].label}`, active, 700, 250);
  return (
    <div className="section-head">
      <div className="protocol" data-reveal><span>{label}</span></div>
      <h2 className="title" data-reveal>{title}</h2>
      {lede && <p className="lede" data-reveal>{lede}</p>}
      {children}
    </div>
  );
}
