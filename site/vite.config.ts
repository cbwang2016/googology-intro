import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' keeps the built site portable (GitHub Pages subpath or local preview).
export default defineConfig({
  base: './',
  plugins: [react()],
})
