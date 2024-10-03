import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  // base is set for github pages
  base: '/solidjs-webcontainers-xterm/',
  plugins: [solid()],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
