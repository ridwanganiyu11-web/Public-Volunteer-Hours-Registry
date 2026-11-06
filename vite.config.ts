import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@wagmi/core/tempo': path.resolve(__dirname, 'src/shims/wagmi-tempo.ts'),
    },
  },
});
