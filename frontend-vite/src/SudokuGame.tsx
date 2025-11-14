/*import { useState } from 'react';
import './App.css';
import TabBar from './TabBar';

const levels = {
  easy: [
    // Một ví dụ lưới Sudoku cấp độ dễ (0 là ô trống)
    [5,3,0,0,7,0,0,0,0],
    [6,0,0,1,9,5,0,0,0],
    [0,9,8,0,0,0,0,6,0],
    [8,0,0,0,6,0,0,0,3],
    [4,0,0,8,0,3,0,0,1],
    [7,0,0,0,2,0,0,0,6],
    [0,6,0,0,0,0,2,8,0],
    [0,0,0,4,1,9,0,0,5],
    [0,0,0,0,8,0,0,7,9],
  ],
  medium: [
    // Một ví dụ lưới Sudoku cấp độ vừa
    [0,0,0,0,0,0,2,0,0],
    [0,8,0,0,0,7,0,9,0],
    [6,0,2,0,0,0,5,0,0],
    [0,7,0,0,6,0,0,0,0],
    [0,0,0,9,0,1,0,0,0],
    [0,0,0,0,2,0,0,4,0],
    [0,0,5,0,0,0,6,0,3],
    [0,9,0,4,0,0,0,7,0],
    [0,0,6,0,0,0,0,0,0],
  ],
  hard: [
    // Một ví dụ lưới Sudoku cấp độ khó
    [0,0,0,6,0,0,4,0,0],
    [7,0,0,0,0,3,6,0,0],
    [0,0,0,0,9,1,0,8,0],
    [0,0,0,0,0,0,0,0,0],
    [0,5,0,1,8,0,0,0,3],
    [0,0,0,3,0,6,0,4,5],
    [0,4,0,2,0,0,0,6,0],
    [9,0,3,0,0,0,0,0,0],
    [0,2,0,0,0,0,1,0,0],
  ]
};

function SudokuGame() {
  const [level, setLevel] = useState<'easy'|'medium'|'hard'>('easy');
  const [grid, setGrid] = useState(levels[level].map(row => row.map(n => n === 0 ? '' : n.toString())));
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);

  // Khi đổi cấp độ
  const handleLevelChange = (newLevel: 'easy'|'medium'|'hard') => {
    setLevel(newLevel);
    setGrid(levels[newLevel].map(row => row.map(n => n === 0 ? '' : n.toString())));
    setSelectedCell(null);
  };

  // Chỉ cho nhập số vào ô trống ban đầu
  const handleChange = (row: number, col: number, value: string) => {
    if (levels[level][row][col] !== 0) return;
    if (/^[1-9]?$/.test(value)) {
      const newGrid = grid.map(arr => [...arr]);
      newGrid[row][col] = value;
      setGrid(newGrid);
    }
  };

  // Chọn số để điền
  const handleNumberSelect = (num: string) => {
    if (selectedCell && levels[level][selectedCell.row][selectedCell.col] === 0) {
      handleChange(selectedCell.row, selectedCell.col, num);
    }
  };

  // Xóa từng ô
  const handleCellClear = (row: number, col: number) => {
    if (levels[level][row][col] !== 0) return;
    const newGrid = grid.map(arr => [...arr]);
    newGrid[row][col] = '';
    setGrid(newGrid);
  };

  return (
    <div className="sudoku-app sudoku-vite sudoku-large">
        <TabBar />
      <h2 className="sudoku-title">🧩 Sudoku Game</h2>
      <div className="sudoku-levels">
        <span>Chọn cấp độ:&nbsp;</span>
        <button onClick={() => handleLevelChange('easy')} className={level === 'easy' ? 'active' : ''}>Dễ</button>
        <button onClick={() => handleLevelChange('medium')} className={level === 'medium' ? 'active' : ''}>Vừa</button>
        <button onClick={() => handleLevelChange('hard')} className={level === 'hard' ? 'active' : ''}>Khó</button>
      </div>
      <div className="sudoku-layout">
        <div className="sudoku-board">
          {grid.map((row, i) => (
            <div className="sudoku-row" key={i}>
              {row.map((cell, j) => (
                <div className={`sudoku-cell-wrap${selectedCell && selectedCell.row === i && selectedCell.col === j ? ' cell-selected' : ''}`} key={j}>
                  <input
                    className={`sudoku-cell${(i % 3 === 0 ? ' thick-top' : '')}${(j % 3 === 0 ? ' thick-left' : '')} ${levels[level][i][j] !== 0 ? 'cell-initial' : ''}`}
                    type="text"
                    maxLength={1}
                    value={cell}
                    onFocus={() => setSelectedCell({row: i, col: j})}
                    onClick={() => setSelectedCell({row: i, col: j})}
                    onChange={e => handleChange(i, j, e.target.value.replace(/[^1-9]/, ''))}
                    disabled={levels[level][i][j] !== 0}
                    style={{transition: 'background 0.2s'}}
                    onKeyDown={e => {
                      if (e.key === 'Backspace') handleCellClear(i, j);
                    }}
                  />
                  {cell && levels[level][i][j] === 0 && (
                    <button className="cell-clear-btn" onClick={() => handleCellClear(i, j)} title="Xóa số">×</button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="sudoku-side-panel">
          <div className="sudoku-number-pad">
            {[1,2,3,4,5,6,7,8,9].map(num => (
              <button
                key={num}
                className="number-btn"
                onClick={() => handleNumberSelect(num.toString())}
                disabled={!selectedCell || levels[level][selectedCell.row][selectedCell.col] !== 0}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="sudoku-note">Chỉ nhập số vào các ô trống. Đổi cấp độ để thử thách bản thân!</div>
    </div>
  );
}

export default SudokuGame; */