import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5181,
    /** Fail fast if 5181 is taken so the URL stays predictable. */
    strictPort: true,
  },
})
