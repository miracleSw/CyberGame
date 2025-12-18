import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app/App.tsx'
import "./style/index.css"; // Trỏ đúng vào file index.css trong thư mục style

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)