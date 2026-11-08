import type { ReactNode } from 'react';
import { SECTORS } from '../data/profile';
import { useDecrypt } from '../lib/useDecrypt';
import type { HoloScene } from '../three/HoloScene';

export interface SectionProps { index: number; active: boolean; scene: HoloScene | null }

export function SectionHeader({ index, active, title, lede, children }: {
  index: number; active: boolean; title: ReactNode; lede?: ReactNode; children?: ReactNode;
}) {
  const s = SECTORS[index];
  const label = useDecrypt(`Protocol ${s.code} // ${s.label}`, active, 700, 250);
  return (
    <div className="section-head">
      <div className="protocol" data-reveal><span>{label}</span></div>
      <h2 className="title" data-reveal>{title}</h2>
      {lede && <p className="lede" data-reveal>{lede}</p>}
      {children}
    </div>
  );
}
