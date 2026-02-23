import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { PhaseProvider } from './context/PhaseContext'
import { ItemsProvider } from './context/ItemsContext'
import { TrucksProvider } from './context/TrucksContext'
import { AnnotationsProvider } from './context/AnnotationsContext'
import { UsersProvider } from './context/UsersContext'
import App from './App'
import './index.css'

// Si la versión cambió, limpia el caché automáticamente
const APP_VERSION = '2.0.1'
if (localStorage.getItem('roadsync_version') !== APP_VERSION) {
  localStorage.clear()
  localStorage.setItem('roadsync_version', APP_VERSION)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PhaseProvider>
          <ItemsProvider>
            <TrucksProvider>
              <AnnotationsProvider>
                <UsersProvider>
                  <App />
                </UsersProvider>
              </AnnotationsProvider>
            </TrucksProvider>
          </ItemsProvider>
        </PhaseProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
