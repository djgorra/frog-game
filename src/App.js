import React, { useState, useEffect } from 'react';
import './App.css';
import clsx from 'clsx';



function App() {
  const [grid, setGrid] = useState([
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', '', '', '', ''],
  ]);
  const [frog, setFrog] = useState([12, 5])
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(60)
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState()

  const checkFrog = (row, col) => {
    return row === frog[0] && col === frog[1];
  }

  const goalFrogs = [1, 3, 5, 7, 9]

  // Handle arrow key presses
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !pressedKeys.has(e.key)) {
        setPressedKeys(prev => new Set(prev).add(e.key)); // Mark key as pressed

        const [row, col] = frog;

        switch (e.key) {
          case 'ArrowUp':
            if (row === 1 && goalFrogs.includes(col)) {
              setFrog([row - 1, col])
              setScore((score) => score + 1)
              setTimeout(() => {
                console.log("Score!");
                setFrog([12, 5])
              }, 1000);
            } else if (row > 1) {
              setFrog([row - 1, col]) // Move up (decrease row)
            }
            break;
          case 'ArrowDown':
            if (row < grid.length - 1 && row > 0) setFrog([row + 1, col]); // Move down (increase row)
            break;
          case 'ArrowLeft':
            if (col > 0 && row > 0) setFrog([row, col - 1]); // Move left (decrease column)
            break;
          case 'ArrowRight':
            if (col < grid[0].length - 1 && row > 0) setFrog([row, col + 1]); // Move right (increase column)
            break;
          default:
            break;
        }
      }
    };

    const handleKeyUp = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        setPressedKeys(prev => {
          const newKeys = new Set(prev);
          newKeys.delete(e.key);
          return newKeys;
        });
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup: Remove event listener on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };

  }, [frog, grid, pressedKeys]); // Re-run effect when frog or grid changes

  return (
    <div className="App">
      <div className="grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className={`row row-${rowIndex}`}>
            {row.map((cell, colIndex) => (
              <> <div className={clsx('cell', `col-${colIndex}`, { frog: checkFrog(rowIndex, colIndex) }, { goalBarrier: row === 0 && !goalFrogs.includes(colIndex) })}>

              </div></>
            ))}
          </div>
        ))}
      </div>
      <text>Score: {score}</text>
    </div>
  );
}

export default App;
