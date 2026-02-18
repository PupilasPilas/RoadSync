import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UsersProvider } from './context/UsersContext'
import { AuthProvider } from './context/AuthContext'
import { PhaseProvider } from './context/PhaseContext'
import { ItemsProvider } from './context/ItemsContext'
import { TrucksProvider } from './context/TrucksContext'
import App from './App'
import './index.css'

// Si la versión cambió, limpia el caché automáticamente
const APP_VERSION = '1.2.0'
if (localStorage.getItem('roadsync_version') !== APP_VERSION) {
  localStorage.clear()
  localStorage.setItem('roadsync_version', APP_VERSION)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UsersProvider>
        <AuthProvider>
          <PhaseProvider>
            <ItemsProvider>
              <TrucksProvider>
                <App />
              </TrucksProvider>
            </ItemsProvider>
          </PhaseProvider>
        </AuthProvider>
      </UsersProvider>
    </BrowserRouter>
  </React.StrictMode>
)
