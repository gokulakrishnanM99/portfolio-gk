import { SECTORS } from '../data/profile';
import { useDecrypt } from '../lib/useDecrypt';

export function SectionHeaderLabelOnly({ index, active }: { index: number; active: boolean }) {
  const s = SECTORS[index];
  const label = useDecrypt(`Protocol ${s.code} // ${s.label}`, active, 700, 250);
  return <div className="protocol" data-reveal><span>{label}</span></div>;
}

const ym = (s: string) => { const [y, m] = s.split('-').map(Number); return y * 12 + (m - 1); };
export const monthsBetween = (a: string, b: string) => ym(b) - ym(a) + 1;
export const monthIndex = ym;

export const durationLabel = (start: string, end: string) => monthsLabel(monthsBetween(start, end));

export function monthsLabel(m: number) {
  const y = Math.floor(m / 12), r = m % 12;
  return [y ? `${y} yr` : '', r ? `${r} mo` : ''].filter(Boolean).join(' ');
}
