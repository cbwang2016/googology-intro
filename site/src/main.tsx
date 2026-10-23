import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './styles.css'
import App from './App.tsx'
import { LangProvider } from './i18n.tsx'
import { ViewProvider } from './ui/view.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <ViewProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ViewProvider>
    </LangProvider>
  </StrictMode>,
)
