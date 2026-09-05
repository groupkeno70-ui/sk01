import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import http from 'http';
import path from 'path';
import {defineConfig} from 'vite';

const keepAliveAgent = new http.Agent({
  keepAlive: true,
  keepAliveMsecs: 15000,
  maxSockets: 50,
  maxFreeSockets: 10,
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://168.144.140.4',
          headers: {
            Host: '168.144.140.4.nip.io',
          },
          changeOrigin: true,
          secure: false,
          agent: keepAliveAgent,
          timeout: 12000,
          proxyTimeout: 12000,
          configure: (proxy) => {
            proxy.on('error', (err, req, res) => {
              console.warn(`[vite proxy warning] /api upstream: ${err.message}`);
              if (res && !('headersSent' in res && res.headersSent) && typeof (res as any).writeHead === 'function') {
                (res as any).writeHead(504, { 'Content-Type': 'application/json' });
                (res as any).end(JSON.stringify({
                  message: 'Upstream server took too long to respond. Please try again.',
                  status: 504,
                }));
              }
            });
          },
        },
        '/socket.io': {
          target: 'http://168.144.140.4',
          headers: {
            Host: '168.144.140.4.nip.io',
          },
          ws: true,
          changeOrigin: true,
          secure: false,
          agent: keepAliveAgent,
          configure: (proxy) => {
            proxy.on('error', (err) => {
              console.warn(`[vite proxy warning] /socket.io: ${err.message}`);
            });
          },
        },
        '/storage': {
          target: 'http://168.144.140.4',
          headers: {
            Host: '168.144.140.4.nip.io',
          },
          changeOrigin: true,
          secure: false,
          agent: keepAliveAgent,
          configure: (proxy) => {
            proxy.on('error', (err, req, res) => {
              console.warn(`[vite proxy warning] /storage: ${err.message}`);
              if (res && !('headersSent' in res && res.headersSent) && typeof (res as any).writeHead === 'function') {
                (res as any).writeHead(502, { 'Content-Type': 'text/plain' });
                (res as any).end('Storage proxy error');
              }
            });
          },
        },
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
