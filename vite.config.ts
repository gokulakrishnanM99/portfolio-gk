import fs from 'fs';
import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * GitHub Pages has no server-side rewrites: a path such as /portfolio-gk/missions has no file of its own,
 * so Pages answers with 404.html. Make 404.html a copy of the main page, which reads the path and opens
 * the right page (unknown paths go to /portfolio-gk/identity; ?classic=true goes to the classic site).
 */
const spaFallback = (): Plugin => ({
  name: 'gh-pages-spa-fallback',
  apply: 'build',
  closeBundle() {
    const out = path.resolve(__dirname, 'dist');
    const index = path.join(out, 'index.html');
    if (fs.existsSync(index)) fs.copyFileSync(index, path.join(out, '404.html'));
  },
});

export default defineConfig({
      base: '/portfolio-gk/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), spaFallback()],
      build: {
        chunkSizeWarningLimit: 900,
        rollupOptions: {
          // two pages in one build: the holographic portfolio (index.html, the main site) and the
          // classic site (classic.html, opened with ?classic=true)
          input: {
            main: path.resolve(__dirname, 'index.html'),
            classic: path.resolve(__dirname, 'classic.html'),
          },
          output: { manualChunks: { three: ['three'], gsap: ['gsap'] } },
        },
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
});
