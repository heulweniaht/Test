// frontend-vite/src/SudokuGame.tsx
import { useState, useEffect } from 'react';
import './App.css';
// KHÔNG import TabBar ở đây

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

function SudokuGame() {
  const [solutionGrid, setSolutionGrid] = useState<string[][]>([]);
  const [initialPuzzle, setInitialPuzzle] = useState<string[][]>([]);
  const [playerGrid, setPlayerGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{row: number, col: number} | null>(null);
  const [level, setLevel] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [mistakes, setMistakes] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [time, setTime] = useState(0); // Đếm thời gian bằng giây
  const [isRunning, setIsRunning] = useState(false); // Trạng thái timer (chạy/dừng)
  const [isPaused, setIsPaused] = useState(false);
  const [gameStarted, setGameStarted] = useState(false); // Đã bắt đầu chơi chưa?

  const startNewGame = async (newLevel: 'easy' | 'medium' | 'hard') => {
    setLevel(newLevel);
    setIsLoading(true);
    setMistakes(0);
    setIsGameOver(false);
    setSelectedCell(null);
    setTime(0);         // Reset thời gian
    setIsRunning(false);  // KHÔNG chạy ngay
    setIsPaused(false);   // Bỏ trạng thái pause
    setGameStarted(false); // Đánh dấu là chưa bắt đầu

    try {
      // Đảm bảo bạn đã tạo API này ở backend
      const response = await fetch(`http://localhost:8080/api/sudoku/generate?level=${newLevel}`);
      if (!response.ok) throw new Error('Không thể tải màn chơi mới');
      
      const data = await response.json(); // Mong đợi { puzzle: [...], solution: [...] }

      setSolutionGrid(data.solution);
      setInitialPuzzle(data.puzzle.map((row: string[]) => [...row]));
      setPlayerGrid(data.puzzle.map((row: string[]) => [...row]));
      
    } catch (error) {
      console.error("Lỗi khi tạo game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  let interval: number;

  if (isRunning) {
    interval = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);
  }

  // Dọn dẹp khi component unmount hoặc isRunning thay đổi
  return () => clearInterval(interval);
}, [isRunning]); // Chỉ chạy lại khi isRunning thay đổi

  useEffect(() => {
    startNewGame(level);
  }, []);

  const handleNumberSelect = (num: string) => {
    // === THÊM KIỂM TRA ===
    if (!selectedCell || isGameOver || isPaused) return; // Không làm gì khi đang pause

    // === BẮT ĐẦU TIMER KHI CHƠI LẦN ĐẦU ===
    if (!gameStarted) {
      setGameStarted(true);
      setIsRunning(true);
    }

    const { row, col } = selectedCell;
    if (initialPuzzle[row][col] !== '') return;

    const newPlayerGrid = playerGrid.map(arr => [...arr]);
    newPlayerGrid[row][col] = num;
    setPlayerGrid(newPlayerGrid);

    if (solutionGrid[row][col] !== num) {
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      if (newMistakes >= 3) {
        setIsGameOver(true);
        setIsRunning(false); // Dừng timer khi game kết thúc
      }
    }
  };

  const handleCellClear = () => {
    if (!selectedCell || isGameOver || isPaused) return;
    const { row, col } = selectedCell;
    if (initialPuzzle[row][col] === '') {
      const newPlayerGrid = playerGrid.map(arr => [...arr]);
      newPlayerGrid[row][col] = '';
      setPlayerGrid(newPlayerGrid);
    }
  };

  const togglePause = () => {
  // Chỉ cho phép pause khi game đã bắt đầu và chưa kết thúc
    if (isGameOver || !gameStarted) {
      return;
    }

    setIsPaused(!isPaused);
    setIsRunning(!isRunning); // Dừng timer nếu pause, chạy timer nếu tiếp tục
  };

  return (
    // Xóa các class layout bên ngoài, vì MainLayout đã có
    <> 
      <h2 className="sudoku-title">🧩 Sudoku Game</h2>
      
      <div className="sudoku-levels">
        <span>Chọn cấp độ:&nbsp;</span>
        <button onClick={() => startNewGame('easy')} disabled={isLoading} className={level === 'easy' ? 'active' : ''}>Dễ</button>
        <button onClick={() => startNewGame('medium')} disabled={isLoading} className={level === 'medium' ? 'active' : ''}>Vừa</button>
        <button onClick={() => startNewGame('hard')} disabled={isLoading} className={level === 'hard' ? 'active' : ''}>Khó</button>
      </div>

      <div className="sudoku-game-info">
        <div className="sudoku-mistakes">
          Số lỗi: <strong>{mistakes} / 3</strong>
        </div>

        <button onClick={togglePause} className="pause-btn" disabled={!gameStarted || isGameOver}>
            {isPaused ? "Tiếp tục" : "Tạm dừng"}
        </button>
              
        <div className="sudoku-timer">
          Thời gian: <strong>{formatTime(time)}</strong>
        </div>
      </div>

      {isGameOver && (
        <div className="sudoku-game-over">
          <h3>Game Over!</h3>
          <p>Bạn đã sai quá 3 lần. Chọn cấp độ để chơi màn mới.</p>
        </div>
      )}

      {isLoading ? (
        <div>Đang tải màn chơi...</div>
      ) : (
        <div className="sudoku-layout">
          <div className="sudoku-board-container">

              {/* MÀN HÌNH CHỜ */}
              {isPaused && (
                <div className="pause-overlay" onClick={togglePause}>
                  {/* Icon "Play" (giống ảnh của bạn) */}
                  <div className="play-icon"></div>
                </div>
              )}
            <div className="sudoku-board">
              {playerGrid.map((row, i) => (
                <div className="sudoku-row" key={i}>
                  {row.map((cell, j) => (
                    <div 
                      className={`sudoku-cell-wrap${selectedCell && selectedCell.row === i && selectedCell.col === j ? ' cell-selected' : ''}`} 
                      key={j}
                      onClick={() => !isGameOver && !isPaused && setSelectedCell({row: i, col: j})}
                    >
                      <input
                        className={`sudoku-cell
                          ${(i % 3 === 0 ? ' thick-top' : '')}
                          ${(j % 3 === 0 ? ' thick-left' : '')} 
                          ${initialPuzzle[i][j] !== '' ? 'cell-initial' : ''}
                          ${cell !== '' && initialPuzzle[i][j] === '' && cell !== solutionGrid[i][j] ? 'cell-error' : ''}
                        `}
                        type="text"
                        maxLength={1}
                        value={cell}
                        readOnly
                        disabled={isGameOver}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="sudoku-side-panel">
            <div className="sudoku-number-pad">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                <button
                  key={num}
                  className="number-btn"
                  onClick={() => handleNumberSelect(num.toString())}
                  disabled={!selectedCell || isGameOver}
                >
                  {num}
                </button>
              ))}
              <button 
                className="action-btn btn-clear-cell" 
                onClick={handleCellClear}
                disabled={!selectedCell || isGameOver}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SudokuGame;