// frontend-vite/src/TabBar.tsx
// (Bỏ comment toàn bộ file)

import { NavLink } from 'react-router-dom';
// Xóa './TabBar.css' nếu có, vì App.css đã có style
// import './TabBar.css'; 

function TabBar() {
  return (
    <nav className="tabbar">
      <NavLink
        to="/"
        className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
      >
        Công cụ giải
      </NavLink>
      <NavLink
        to="/game"
        className={({ isActive }) => (isActive ? 'tab active' : 'tab')}
      >
        Chơi Sudoku
      </NavLink>
    </nav>
  );
}

export default TabBar;