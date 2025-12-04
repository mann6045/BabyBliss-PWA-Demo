// src/main.jsx (replace/register part)
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(<App />)

// Service worker register (robust logs)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/service-worker.js')
      console.log('Service worker registered at:', reg.scope)
    } catch (err) {
      console.warn('Service worker registration failed:', err)
    }
  })
}