// frontend-vite/src/MainLayout.tsx
import { Outlet } from 'react-router-dom';
import TabBar from './TabBar'; // Import TabBar đã bỏ comment

function MainLayout() {
  return (
    <div className="sudoku-app sudoku-vite sudoku-large">
      <TabBar /> {/* Menu của bạn sẽ ở đây */}
      
      {/* Outlet sẽ render trang con (Game hoặc Solver) */}
      <Outlet />
    </div>
  );
}

export default MainLayout;