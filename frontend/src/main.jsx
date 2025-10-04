import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// initialize global axios defaults (baseURL, withCredentials)
import './setupAxios'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    <App />
)
