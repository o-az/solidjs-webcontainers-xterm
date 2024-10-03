import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';

export default defineConfig({
  // base is set for github pages
  base: '/solidjs-webcontainers-xterm/',
  plugins: [
    solid(),
    {
      name: 'add-cors',
      configureServer(server) {
        server.middlewares.use((_req, res, next) => {
          res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
          res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
          res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
          next();
        });
      },
    },
  ],
  server: {
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
});
