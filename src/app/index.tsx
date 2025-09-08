import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { ApiProvider } from '../api'
import ErrorBoundary from './components/ErrorBoundary'

import 'bootstrap/dist/css/bootstrap.min.css'
import '../globals.css'

console.log('🚀 App starting...')
console.log('📍 Current URL:', window.location.href)
console.log('🔑 API Token exists:', !!process.env.REACT_APP_API_TOKEN)
console.log('🌐 Environment:', process.env.NODE_ENV)

const domRoot = document.getElementById('root')
console.log('📦 DOM Root found:', !!domRoot)

const root = createRoot(domRoot!)

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ApiProvider
        url="https://jean-test-api.herokuapp.com/"
        token={process.env.REACT_APP_API_TOKEN || 'bc34b8c2-70fb-4ae3-bc90-0c95cd2338d6'}
      >
        <App />
      </ApiProvider>
    </ErrorBoundary>
  </React.StrictMode>
)

console.log('✅ React app rendered')
