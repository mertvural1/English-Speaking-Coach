import React from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import App from './App'
import './styles.css'

const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm('Yeni sürüm mevcut. Sayfayı yenileyerek güncellemek ister misiniz?')) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('PWA hazır: artık çevrimdışı kullanılabilir.')
  }
})

createRoot(document.getElementById('root')).render(
    <App />
)
