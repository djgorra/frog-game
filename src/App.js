import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import clsx from 'clsx';



function App() {

  const grid = [];
  for (let i = 0; i < 13; i++) { // 13 rows
    var row = [];
    for (let j = 0; j < 11; j++) { // 11 columns
      row.push('');
    }
    grid.push(row);
  } // Grid constructor

  const [frog, setFrog] = useState([12, 5])
  const [cars, setCars] = useState([
    { row: 11, col: 9, direction: 'left', speed: 0.02 },
    { row: 11, col: 6, direction: 'left', speed: 0.02 },
    { row: 10, col: 2, direction: 'right', speed: 0.03 },
    { row: 9, col: 4, direction: 'left', speed:0.02},
    { row: 8, col: 6, direction: 'right', speed: 0.06},
    { row: 7, col: 1, direction: 'left', speed: 0.01},
  ]);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(60)
  const [gameOver, setGameOver] = useState(false);
  const [lives, setLives] = useState()
  const [gameActive, setGameActive] = useState(true);

  const animationFrameId = useRef(null);

    // Move cars using requestAnimationFrame
    useEffect(() => {
      if (!gameActive) {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
          animationFrameId.current = null;
        }
        return;
      }
  
      const moveCars = () => {  
        setCars(prevCars => 
          prevCars.map(car => {
            const movement = car.speed
            let newCol = car.col + (car.direction === 'right' ? movement : -movement);
            
            // Wrap around edges
            if (newCol >= 11) newCol -= 11;
            if (newCol < 0) newCol += 11;
            
            return { ...car, col: newCol };
          })
        );
  
        animationFrameId.current = requestAnimationFrame(moveCars);
      };
  
      animationFrameId.current = requestAnimationFrame(moveCars);
  
      return () => {
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };
    }, [gameActive]);
  
    // Check for collisions
    useEffect(() => {
      const collision = cars.some(car => {
        const frogCol = Math.round(frog[1]);
        const carCol = Math.round(car.col);
        return car.row === frog[0] && carCol === frogCol;
      });
  
      if (collision) {
        setGameActive(false);
        setTimeout(() => {
          setFrog([12, 5]);
          setGameActive(true);
        }, 1000);
      }
    }, [frog, cars]);

  const checkFrog = (row, col) => {
    return row === frog[0] && col === frog[1];
  }

  const checkCar = (row, col) => {
    return cars.some(car => {
      const carCol = Math.round(car.col);
      return car.row === row && carCol === col;
    });
  };

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
              <> <div className={clsx('cell', `col-${colIndex}`)}>
                {checkFrog(rowIndex, colIndex) && <div className="frog">🐸</div>}
                {checkCar(rowIndex, colIndex) && (
                  <div className={`car car-${cars.find(c => c.row === rowIndex)?.direction}`}>
                    🚗
                    
                  </div>
                )}
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
