import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './Context/AuthContext.jsx'
import { UserDataProvider } from './Context/UserDataContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  
    <AuthProvider>
      < UserDataProvider>
      <App />
    
    </UserDataProvider>
    </AuthProvider>
  </BrowserRouter>
)
