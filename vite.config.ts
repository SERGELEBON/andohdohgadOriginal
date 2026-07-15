import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'resolve-ts-extensions',
      resolveId(source) {
        if (source.includes('@/lib/supabase/client')) {
          return path.resolve(process.cwd(), 'src/lib/supabase/client.ts');
        }
        if (source.includes('@/lib/stripe/client')) {
          return path.resolve(process.cwd(), 'src/lib/stripe/client.ts');
        }
      },
    },
  ],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
    extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'supabase': ['@supabase/supabase-js'],
          'animations': ['gsap', 'framer-motion'],
        },
      },
    },
  },
});
