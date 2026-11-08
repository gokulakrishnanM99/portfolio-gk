import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.6,
  strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, ...p,
});

export const IArrowRight = (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const IArrowUpRight = (p: P) => <svg {...base(p)}><path d="M7 17 17 7M8 7h9v9" /></svg>;
export const IChevronLeft = (p: P) => <svg {...base(p)}><path d="m15 18-6-6 6-6" /></svg>;
export const IChevronRight = (p: P) => <svg {...base(p)}><path d="m9 18 6-6-6-6" /></svg>;
export const IDownload = (p: P) => <svg {...base(p)}><path d="M12 4v11M7 10l5 5 5-5M5 20h14" /></svg>;
export const IMail = (p: P) => <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="m4 7 8 6 8-6" /></svg>;
export const ICopy = (p: P) => <svg {...base(p)}><rect x="8" y="8" width="12" height="12" rx="1.5" /><path d="M16 8V5.5A1.5 1.5 0 0 0 14.5 4h-9A1.5 1.5 0 0 0 4 5.5v9A1.5 1.5 0 0 0 5.5 16H8" /></svg>;
export const ICheck = (p: P) => <svg {...base(p)}><path d="m5 12 5 5 9-10" /></svg>;
export const IX = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6 6 18" /></svg>;
export const ISearch = (p: P) => <svg {...base(p)}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>;
export const ISend = (p: P) => <svg {...base(p)}><path d="M21 3 10 14M21 3l-7 18-4-7-7-4 18-7Z" /></svg>;
export const IStar = (p: P) => <svg {...base(p)}><path d="m12 3.5 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" /></svg>;
export const IVault = (p: P) => <svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="1.5" /><circle cx="12" cy="12" r="3.5" /><path d="M12 8.5V7M12 17v-1.5M15.5 12H17M7 12h1.5" /></svg>;
export const IPlay = (p: P) => <svg {...base(p)}><path d="M8 5v14l11-7z" /></svg>;
export const IRepo = (p: P) => <svg {...base(p)}><path d="M5 4.5A1.5 1.5 0 0 1 6.5 3H19v15H6.5A1.5 1.5 0 0 0 5 19.5zM5 19.5A1.5 1.5 0 0 0 6.5 21H19v-3" /></svg>;
export const IFile = (p: P) => <svg {...base(p)}><path d="M14 3H7a1.5 1.5 0 0 0-1.5 1.5v15A1.5 1.5 0 0 0 7 21h10a1.5 1.5 0 0 0 1.5-1.5V7.5z" /><path d="M14 3v4.5h4.5M9 13h6M9 16.5h6" /></svg>;
export const IVolume = (p: P) => <svg {...base(p)}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>;
export const IVolumeOff = (p: P) => <svg {...base(p)}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="m16 9.5 5 5M21 9.5l-5 5" /></svg>;

export const IGithub = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);
export const ILinkedin = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0" />
  </svg>
);
export const IMedium = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...p}>
    <path d="M13.54 12a6.8 6.8 0 0 1-6.77 6.82A6.8 6.8 0 0 1 0 12a6.8 6.8 0 0 1 6.77-6.82A6.8 6.8 0 0 1 13.54 12M20.96 12c0 3.54-1.51 6.42-3.38 6.42S14.2 15.54 14.2 12s1.51-6.42 3.38-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75s-1.19-2.58-1.19-5.75.53-5.75 1.19-5.75S24 8.83 24 12" />
  </svg>
);

/** GK hex monogram */
export const GKMark = (p: P) => (
  <svg viewBox="0 0 40 40" fill="none" aria-hidden {...p}>
    <path d="M20 2.5 35.2 11.25v17.5L20 37.5 4.8 28.75v-17.5z" stroke="currentColor" strokeWidth="1.2" opacity="0.9" />
    <path d="M20 7 31.3 13.5v13L20 33 8.7 26.5v-13z" stroke="currentColor" strokeWidth="0.6" opacity="0.4" strokeDasharray="2 2" />
    <text x="20" y="24.6" textAnchor="middle" fontFamily="Rajdhani, sans-serif" fontWeight="700" fontSize="13" fill="currentColor" letterSpacing="0.5">GK</text>
  </svg>
);

/** Radial dial icon (menu) */
export const IDial = (p: P) => (
  <svg viewBox="0 0 40 40" fill="none" aria-hidden {...p}>
    <circle cx="20" cy="20" r="17" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="1.2" />
    <path d="M20 8v5M20 27v5M8 20h5M27 20h5" stroke="currentColor" strokeWidth="1.2" />
    <circle cx="20" cy="20" r="2.5" fill="currentColor" />
  </svg>
);
