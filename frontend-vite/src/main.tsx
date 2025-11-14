// frontend-vite/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Bỏ comment SudokuGame
import SudokuGame from './SudokuGame.tsx';
// Import layout mới
import MainLayout from './MainLayout.tsx';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Bọc các route của bạn trong MainLayout */}
        <Route element={<MainLayout />}>
          {/* Trang Công cụ giải (App.tsx) sẽ là trang chủ "/" */}
          <Route path="/" element={<App />} />
          {/* Trang Chơi Game sẽ ở "/game" */}
          <Route path="/game" element={<SudokuGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);