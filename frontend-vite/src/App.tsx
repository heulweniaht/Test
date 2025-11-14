import { useState } from 'react';
import './App.css';

const initialGrid = Array(9).fill(null).map(() => Array(9).fill(''));

function App() {
  const [grid, setGrid] = useState(initialGrid);
  const [initialCells, setInitialCells] = useState(() => initialGrid.map(row => row.map(() => false)));
  const [solving, setSolving] = useState(false);
  const [error, setError] = useState('');
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [solved, setSolved] = useState(false);

  // Đánh dấu các ô đã nhập ban đầu
  const handleChange = (row: number, col: number, value: string) => {
    if (solved && !initialCells[row][col]) return; // Không cho xóa số đã giải
    if (/^[1-9]?$/.test(value)) {
      const newGrid = grid.map(arr => [...arr]);
      newGrid[row][col] = value;
      setGrid(newGrid);
      const newInitial = initialCells.map(arr => [...arr]);
      newInitial[row][col] = !!value;
      setInitialCells(newInitial);
    }
  };

  // Khi giải, phân biệt số nhập tay và số giải
  const handleSolve = async () => {
    setSolving(true);
    setError('');
    try {
      const response = await fetch('http://localhost:8080/api/sudoku/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grid }),
      });
      if (!response.ok) throw new Error('Lỗi khi gọi API backend');
      const data = await response.json();
      if (data.solution) {
        setGrid(data.solution);
        setSolved(true);
        // const newInitial = initialCells.map((row, i) => row.map((_cell, j) => !!grid[i][j]));
        // setInitialCells(newInitial);
      } else {
        setError('Không tìm được lời giải hợp lệ!');
      } 
    } catch (e: any) {
      setError(e.message || 'Lỗi không xác định');
    }
    setSolving(false);
  };

  const handleClear = () => {
    setGrid(initialGrid);
    setInitialCells(initialGrid.map(row => row.map(() => false)));
    setError('');
    setSolved(false);
    setSelectedCell(null);
  };

  // Xóa từng ô
  const handleCellClear = (row: number, col: number) => {
    if (solved && !initialCells[row][col]) return; // Không cho xóa số đã giải
    const newGrid = grid.map(arr => [...arr]);
    newGrid[row][col] = '';
    setGrid(newGrid);
    const newInitial = initialCells.map(arr => [...arr]);
    newInitial[row][col] = false;
    setInitialCells(newInitial);
  };

  // Chọn số để điền
  const handleNumberSelect = (num: string) => {
    if (selectedCell && (!solved || initialCells[selectedCell.row][selectedCell.col])) {
      handleChange(selectedCell.row, selectedCell.col, num);
    }
  };

  return (
    <div >
      <h2 className="sudoku-title">🧩 Sudoku Solver </h2>
      <div className="sudoku-layout">
        <div className="sudoku-board">
          {grid.map((row, i) => (
            <div className="sudoku-row" key={i}>
              {row.map((cell, j) => (
                <div className={`sudoku-cell-wrap${selectedCell && selectedCell.row === i && selectedCell.col === j ? ' cell-selected' : ''}`} key={j}>
                  <input
                    className={`sudoku-cell${(i % 3 === 0 ? ' thick-top' : '')}${(j % 3 === 0 ? ' thick-left' : '')} ${initialCells[i][j] ? 'cell-initial' : (cell ? 'cell-solved' : '')}`}
                    type="text"
                    maxLength={1}
                    value={cell}
                    onFocus={() => setSelectedCell({row: i, col: j})}
                    onClick={() => setSelectedCell({row: i, col: j})}
                    onChange={e => handleChange(i, j, e.target.value.replace(/[^1-9]/, ''))}
                    disabled={solving || (solved && !initialCells[i][j])}
                    style={{transition: 'background 0.2s'}}
                    onKeyDown={e => {
                      if (e.key === 'Backspace') handleCellClear(i, j);
                    }}
                  />
                  {cell && !solving && (!solved || initialCells[i][j]) && (
                    <button className="cell-clear-btn" onClick={() => handleCellClear(i, j)} title="Xóa số">×</button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sudoku-side-panel">
          {/* KHU VỰC NÚT HÀNH ĐỘNG PHỤ */}
          <div className="sudoku-actions">
            <button
              className="action-btn btn-clear-cell"
              onClick={() => selectedCell && handleCellClear(selectedCell.row, selectedCell.col)}
              disabled={!selectedCell || (solved && !initialCells[selectedCell.row][selectedCell.col])}
            >
              Xóa
            </button>
            <button className="action-btn btn-clear-all" onClick={handleClear} disabled={solving}>
              Xóa Tất cả
            </button>
          </div>

          {/* BÀN PHÍM SỐ */}
          <div className="sudoku-number-pad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                className="number-btn"
                onClick={() => handleNumberSelect(num.toString())}
                disabled={!selectedCell || (solved && !initialCells[selectedCell.row][selectedCell.col])}
              >
                {num}
              </button>
            ))}
          </div>
          
          {/* NÚT GIẢI CHÍNH */}
          <div className="sudoku-controls">
            <button onClick={handleSolve} disabled={solving}>Giải Sudoku</button>
          </div>

          {error && <div className="sudoku-error">{error}</div>}
          <div className="sudoku-note">Nhập các số ban đầu (đen), số được giải sẽ có màu xanh. Sau khi giải, các số đã giải không thể xóa.</div>
        </div>
      </div>
    </div>
  );
}

export default App;