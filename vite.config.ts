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

/** Shown on the role landing footer; set whenever `vite build` or `vite` runs (CI deploy = push date). */
const OSAC_LANDING_LAST_UPDATED_LABEL = new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})

// https://vite.dev/config/
export default defineConfig({
  base,
  define: {
    __OSAC_LANDING_LAST_UPDATED__: JSON.stringify(OSAC_LANDING_LAST_UPDATED_LABEL),
  },
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5181,
    /** Prefer 5181; if something else is using it, Vite picks the next free port (see terminal “Local:”). */
    strictPort: false,
    /** Open the real system browser — Cursor’s Simple Browser does not run Vite; you need this URL live. */
    open: true,
  },
})
