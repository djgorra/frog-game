import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';
import clsx from 'clsx';
import Row from './Row';



function App() {

  const grid = [];
  for (let i = 0; i < 13; i++) { // 13 rows
    var row = [];
    for (let j = 0; j < 11; j++) { // 11 columns
      row.push('');
    }
    grid.push(row);
  } // Grid constructor

  const length = 13
  const width = 500

  const [frog, setFrog] = useState([12 /*row*/, 250 /*horizontal position*/])
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(60)
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState(10);
  const [gameActive, setGameActive] = useState(true);
  const [frogDead, setFrogDead] = useState(false);
  const [furthestRow, setFurthestRow] = useState(length - 1);


  const killFrog = useCallback(() => {
    setGameActive(false);
    setFrogDead(true);
    if (lives > 0) {
      setTimeout(() => {
        setFrog([12, 50]);
        setFurthestRow(length - 1);
        setLives(lives - 1);
        setFrogDead(false);
        setGameActive(true);
      }, 1000);
    } else {
      setGameOver(true);
      alert("Game Over! Thanks for playing! Your score is: " + score);
    }
  })



  const goalFrogs = [1, 3, 5, 7, 9]

  // Handle arrow key presses
  useEffect(() => {

    const handleKeyDown = (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key) && !pressedKeys.has(e.key) && gameActive) {
        setPressedKeys(prev => new Set(prev).add(e.key)); // Mark key as pressed

        const [row, col] = frog;

        switch (e.key) {
          case 'ArrowUp':
            if (row === 1 && goalFrogs.includes(col)) {
              setFrog([row - 1, col])
              setScore((score) => score + 50);
              setFurthestRow(length - 1);
              setTimeout(() => {
                console.log("Score!");
                setFrog([12, 5])
              }, 1000);
            } else if (row > 1) {
              if (row <= furthestRow) {
                setFurthestRow(furthestRow - 1);
                setScore((score) => score + 10);
              }
              setFrog([row - 1, col]) // Move up (decrease row)
            }
            break;
          case 'ArrowDown':
            if (row < length - 1 && row > 0) setFrog([row + 1, col]); // Move down (increase row)
            break;
          case 'ArrowLeft':
            if (col > 0 && row > 0) setFrog([row, col - 50]); // Move left (decrease column)
            break;
          case 'ArrowRight':
            if (col < width - 1 && row > 0) setFrog([row, col + 50]); // Move right (increase column)
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

  }, [frog, pressedKeys]); // Re-run effect when frog or grid changes

  return (
    <div className="App">
      <div className="grid">
        {grid.map((row, rowIndex) => (

          <Row
            key={rowIndex}
            rowIndex={rowIndex}
            frog={frog}
            frogDead={frogDead}
            killFrog={killFrog} />
        ))}
      </div>
      <div className="gameInfoContainer">
        <text>Score: {score}</text>
        <text>Time: {time}</text>

      </div>
      <div className="lifeContainer">
        {[...Array(lives)].map((e, i) => <span className="life" key={i}>🐸</span>)}
      </div>

    </div>
  );
}

export default App;
