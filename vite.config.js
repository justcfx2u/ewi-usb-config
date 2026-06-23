import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 9002,
  },
  build: {
    // Keep output in build/ so firebase.json hosting (public: "build") stays valid.
    outDir: 'build',
  },
});
