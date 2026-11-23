import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  base: './',
  server: { port: 5173, open: false },
  preview: { port: 4173 },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),     // public website
        portal: resolve(__dirname, 'portal/index.html'), // student portal (website Log in)
        admin: resolve(__dirname, 'admin/index.html'),   // staff portal (not linked from the website)
      },
    },
  },
});
