import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

if ((window.location.pathname === '/admin' || window.location.pathname === '/admin/') && !window.location.hash) {
  window.history.replaceState(null, '', '/#/admin')
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
