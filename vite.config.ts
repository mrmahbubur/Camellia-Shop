import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, Plugin } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function resolveBasePath(): string {
  const raw = process.env.VITE_BASE_PATH?.trim();
  if (!raw || raw === './') return './';
  if (raw === '/') return '/';
  return `/${raw.replace(/^\/+|\/+$/g, '')}/`;
}

function stripStaticRootFallback(): Plugin {
  return {
    name: 'strip-static-root-fallback',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        return html.replace(
          /<!--\s*GH_STATIC_FALLBACK_START\s*-->[\s\S]*?<!--\s*GH_STATIC_FALLBACK_END\s*-->\s*/g,
          ''
        );
      }
    }
  };
}

export default defineConfig(() => {
  const isDocsBuild = process.env.VITE_STATIC_DOCS === '1';

  return {
    base: resolveBasePath(),
    plugins: [react(), tailwindcss(), stripStaticRootFallback()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: isDocsBuild
      ? {
          outDir: 'docs',
          emptyOutDir: true,
          rollupOptions: {
            output: {
              entryFileNames: 'assets/camellia-app.js',
              chunkFileNames: 'assets/camellia-[name].js',
              assetFileNames: (assetInfo) => {
                if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                  return 'assets/camellia-app.css';
                }
                return 'assets/[name]-[hash][extname]';
              }
            }
          }
        }
      : undefined,
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
