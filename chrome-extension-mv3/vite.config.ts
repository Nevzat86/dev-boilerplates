import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, cpSync } from 'fs';

/**
 * Plain Vite config for Chrome Extension MV3.
 * No @crxjs dependency — just multi-page build + manifest copy.
 * Works with any Vite version.
 */
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'chrome-extension-manifest',
      closeBundle() {
        // Copy manifest.json to dist
        const dist = resolve(__dirname, 'dist');
        if (!existsSync(dist)) mkdirSync(dist, { recursive: true });
        copyFileSync(
          resolve(__dirname, 'public/manifest.json'),
          resolve(dist, 'manifest.json'),
        );
        // Copy _locales
        const localesSrc = resolve(__dirname, 'public/_locales');
        const localesDest = resolve(dist, '_locales');
        if (existsSync(localesSrc)) {
          cpSync(localesSrc, localesDest, { recursive: true });
        }
        // Copy icons if they exist
        const iconsSrc = resolve(__dirname, 'public/icons');
        const iconsDest = resolve(dist, 'icons');
        if (existsSync(iconsSrc)) {
          cpSync(iconsSrc, iconsDest, { recursive: true });
        }
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        'service-worker': resolve(__dirname, 'src/background/service-worker.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
