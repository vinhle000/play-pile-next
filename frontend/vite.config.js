import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  build: {
    sourcemap: true, // Enable source maps
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'class-variance-authority': 'class-variance-authority',
      'lucide-react': 'lucide-react',
    },
  },
})
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
