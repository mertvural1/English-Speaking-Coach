import React from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './styles.css'

const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm('A new version is available. Would you like to refresh and update now?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('PWA is ready: it can now be used offline.')
  }
})

createRoot(document.getElementById('root')).render(
    <App />
)
