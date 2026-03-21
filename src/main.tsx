import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { useSettingsStore } from './store/index.ts';
import type { Language } from './i18n/index.ts';

const urlParams = new URLSearchParams(window.location.search);
const langParam = urlParams.get('lang');
if (langParam === 'en' || langParam === 'zh') {
  useSettingsStore.getState().setLanguage(langParam as Language);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
