import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages serves at /<repo-name>/; Vercel/Netlify/local use "/".
// CI sets BASE_PATH (see .github/workflows/deploy-pages.yml).
const base =
  process.env.BASE_PATH && process.env.BASE_PATH !== '/'
    ? process.env.BASE_PATH.endsWith('/')
      ? process.env.BASE_PATH
      : `${process.env.BASE_PATH}/`
    : '/'

// https://vite.dev/config/
export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5181,
    /** Fail fast if 5181 is taken so the URL stays predictable. */
    strictPort: true,
  },
})
