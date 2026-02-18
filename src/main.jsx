import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UsersProvider } from './context/UsersContext'
import { AuthProvider } from './context/AuthContext'
import { PhaseProvider } from './context/PhaseContext'
import { ItemsProvider } from './context/ItemsContext'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <UsersProvider>
        <AuthProvider>
          <PhaseProvider>
            <ItemsProvider>
              <App />
            </ItemsProvider>
          </PhaseProvider>
        </AuthProvider>
      </UsersProvider>
    </BrowserRouter>
  </React.StrictMode>
)
