import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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
        // Browser → same-origin /media. The media server (MinIO) has no https
        // listener, so an https page cannot load its images directly (mixed
        // content). See src/common/utils/mediaUrl.ts.
        '/media': {
          target: mediaOrigin,
          changeOrigin: true,
          secure: false,
          rewrite: path => path.replace(/^\/media/, '')
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
