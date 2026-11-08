import { createRoot } from 'react-dom/client';
import '@fontsource/rajdhani/500.css';
import '@fontsource/rajdhani/600.css';
import '@fontsource/rajdhani/700.css';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './styles/global.css';
import gsap from 'gsap';
import App from './App';

// keep animation timing honest on slow GPUs (no time-stretching)
gsap.ticker.lagSmoothing(0);

createRoot(document.getElementById('root')!).render(<App />);

// dev-only hook so automated tests can seek transitions frame-accurately
if (import.meta.env.DEV) (window as unknown as { gsap: typeof gsap }).gsap = gsap;
