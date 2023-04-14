import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { BrowserRouter as Router } from "react-router-dom"
import './index.css'
import { SocketProvider } from './context/SocketProvider'

ReactDOM.createRoot(document.getElementById('root')).render(
    <Router>
      <SocketProvider>
        <App />
      </SocketProvider>
    </Router>
)
