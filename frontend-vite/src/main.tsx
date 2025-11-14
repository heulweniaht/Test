import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// import SudokuGame from './SudokuGame.tsx'

// Thêm React Router để chuyển trang giữa solver và chơi game
import { BrowserRouter, Routes, Route } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        {/* <Route path="/game" element={<SudokuGame />} /> */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)