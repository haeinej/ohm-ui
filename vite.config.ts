import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vite';
import {tanstackStart} from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The gallery is a TanStack Start app (shadcn's `start` template). `@/` is the repository root,
// so registry files import each other as `@/registry/ohm/...`, the paths shadcn rewrites on install.
export default defineConfig({
  resolve: {alias: {'@': fileURLToPath(new URL('.', import.meta.url))}},
  plugins: [tailwindcss(), tanstackStart(), viteReact()],
  server: {port: 5180, strictPort: true},
  preview: {port: 4180, strictPort: true},
});
