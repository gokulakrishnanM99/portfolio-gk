import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
      base: '/portfolio-gk/',
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      build: {
        chunkSizeWarningLimit: 900,
        rollupOptions: {
          // two pages in one build: the classic site (index.html) and ?hologram=true (hologram.html)
          input: {
            main: path.resolve(__dirname, 'index.html'),
            hologram: path.resolve(__dirname, 'hologram.html'),
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
