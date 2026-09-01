import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const MEDIA_MIME_TYPES: Record<string, string> = {
  webp: 'image/webp',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  pdf: 'application/pdf'
};

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const mediaOrigin = env.VITE_MEDIA_ORIGIN || 'http://45.80.149.4:9000';

  return {
    server: {
      port: 3000,
      // host: true,
      allowedHosts: true,
      // Browser → same-origin /api (avoids CORS). Vite forwards to the real API.
      // Needed because api.magic-store.uz allows http://localhost:3000 but not https://localhost:3000.
      proxy: {
        '/api': {
          target: 'https://api.magic-store.uz',
          changeOrigin: true,
          secure: true,
          rewrite: path => path.replace(/^\/api/, ''),
          // API CORS allowlist rejects https://localhost — drop Origin so the
          // server-side proxy request is treated as non-browser.
          configure: proxy => {
            proxy.on('proxyReq', proxyReq => {
              proxyReq.removeHeader('origin');
            });
          }
        },
        // Browser → same-origin /media. See src/common/utils/mediaUrl.ts.
        '/media': {
          target: mediaOrigin,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/media/, ''),
          // MinIO stores these objects as `application/octet-stream` and sends
          // `nosniff`, so the browser refuses to render them as images. Derive the
          // real type from the extension and drop the nosniff opt-out.
          configure: proxy => {
            proxy.on('proxyRes', (proxyRes, req) => {
              const ext = (req.url ?? '').split('?')[0].split('.').pop()?.toLowerCase();
              const mime = ext ? MEDIA_MIME_TYPES[ext] : undefined;

              if (!mime) return;

              // Now a same-origin response, so MinIO's HSTS would apply to this app.
              delete proxyRes.headers['strict-transport-security'];
              delete proxyRes.headers['x-content-type-options'];
              proxyRes.headers['content-type'] = mime;
            });
          }
        }
      }
    },
    plugins: [react()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@common': path.resolve(__dirname, './src/common'),
        '@modules': path.resolve(__dirname, './src/modules'),
        '@pages': path.resolve(__dirname, './src/pages')
      }
    }
  };
});
