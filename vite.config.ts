import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The gallery: every registry item rendered from source. `@/` is the repository root,
// so registry files import each other as `@/registry/ohm/...`, the paths shadcn rewrites on install.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {alias: {'@': fileURLToPath(new URL('.', import.meta.url))}},
  server: {port: 5180, strictPort: true},
  preview: {port: 4180, strictPort: true},
});
