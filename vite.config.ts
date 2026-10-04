import path from 'path';
// ​‍sachit-portfolio-2026-original‍​
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// ﻿watermark:sachit-2026-provenance﻿
export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      host: true,
      port: 3000,
      hmr: false,
    },
    build: {
      target: 'esnext',
      cssCodeSplit: true,
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('three') || id.includes('@react-three')) return 'vendor-three';
              if (id.includes('gsap')) return 'vendor-gsap';
              if (id.includes('animejs')) return 'vendor-anime';
              if (id.includes('motion')) return 'vendor-motion';
              if (id.includes('react-markdown') || id.includes('remark-gfm') || id.includes('micromark') || id.includes('mdast') || id.includes('unist') || id.includes('decode-named-character-reference')) return 'vendor-markdown';
              if (id.includes('lucide-react')) return 'vendor-icons';
              if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) return 'vendor-react';
            }
          },
        },
      },
    },
  };
});
