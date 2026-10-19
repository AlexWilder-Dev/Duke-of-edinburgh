import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Duke-of-edinburgh/',
  plugins: [react()],
  build: {
    target: 'es2020',
    assetsInlineLimit: 2048,
  },
})
