import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    // Ensure all routes are redirected to index.html for SPA routing
    historyApiFallback: true,
  },
  build: {
    // Enable source maps for debugging in production
    sourcemap: true,
  },
  resolve: {
    alias: {
      // Alias '@' to the 'src' directory for cleaner imports
      '@': path.resolve(__dirname, './src'),
      // Directly aliasing packages for easier imports
      'class-variance-authority': 'class-variance-authority',
      'lucide-react': 'lucide-react',
    },
  },
});