import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@patternfly/react-core/dist/styles/base.css'
import './index.css'
import App from './App.tsx'

if (import.meta.env.DEV) {
  console.info(
    '%c[04-osac-demo]%c Dev server prefers http://127.0.0.1:5181/ — if the port is busy, check the terminal for the “Local” URL. Try: npm run dev:fresh',
    'font-weight:bold',
    '',
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
