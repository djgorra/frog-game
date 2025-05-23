import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import Cell from './Cell';
import Frog from './Frog';
import Car from './Car';
import { logRoles } from '@testing-library/dom';

const Row = memo(function Row({ frog, frogDead, rowIndex, gameActive, killFrog }) {

    const rowRef = useRef(null);
    const [rowWidth, setRowWidth] = useState(0);
    const animationFrameId = useRef(null);
    const lastUpdateTime = useRef(performance.now());
    
    // Cars configuration - using pixel positions
    const [cars, setCars] = useState(() => {
        // Only create cars for rowIndex 11 (road row)
        if (rowIndex === 11) {
            return [
                { id: 1, position: 200, direction: 'left', speed: 100 }, // pixels per second
                { id: 2, position: 400, direction: 'left', speed: 100 },
                { id: 3, position: 300, direction: 'left', speed: 100 },
                { id: 4, position: 540, direction: 'left', speed: 100 },
            ];
        }
        return [];
    });

    // Measure row width on mount/resize
    useEffect(() => {
        const handleResize = () => {
            if (rowRef.current) {
                setRowWidth(rowRef.current.offsetWidth);
            }
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Convert frog's percentage position to pixels
    const frogPositionPx = rowWidth * (frog[1] / 100);

    // Smooth movement for cars
    
    useEffect(() => {
        console.log('Game active:', gameActive); // Should be true
console.log('Cars length:', cars.length); // Should be > 0
        console.log('hello');
        if (!gameActive) {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
            }
            return;
        }
    
        // Initialize lastUpdateTime when starting
        lastUpdateTime.current = performance.now();
    
        const moveCars = (timestamp) => {
            const deltaTime = (timestamp - lastUpdateTime.current) / 1000; // Correct calculation
            console.log(deltaTime);
            lastUpdateTime.current = timestamp;
            
            setCars(prevCars => 
                prevCars.map(car => {
                    const movement = car.speed * deltaTime;
                    let newPosition = car.position + (car.direction === 'right' ? movement : -movement);
                    
                    // Wrap around edges
                    if (newPosition > 540) newPosition = 0;
                    if (newPosition < 0) newPosition = 540;
                    
                    return { ...car, position: newPosition };
                })
            );
            
            animationFrameId.current = requestAnimationFrame(moveCars);
        };
    
        // Start the animation loop
        animationFrameId.current = requestAnimationFrame(moveCars);
    
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [gameActive]);

    // // Start/stop animation
    // useEffect(() => {
    //     if (!gameActive || rowWidth === 0 || cars.length === 0) {
    //         if (animationFrameId.current) {
    //             cancelAnimationFrame(animationFrameId.current);
    //             animationFrameId.current = null;
    //         }
    //         return;
    //     }
        
    //     lastUpdateTime.current = performance.now();
    //     animationFrameId.current = requestAnimationFrame(moveCars);
        
    //     return () => {
    //         if (animationFrameId.current) {
    //             cancelAnimationFrame(animationFrameId.current);
    //             animationFrameId.current = null;
    //         }
    //     };
    // }, [gameActive, rowWidth, cars.length, moveCars]);

    // --- Collision detection ---
    useEffect(() => {
        if (!gameActive || frog[0] !== rowIndex || rowWidth === 0 || cars.length === 0) return;
        
        const frogWidth = 40; // Approximate frog width in pixels
        const carWidth = 50; // Approximate car width in pixels
        
        const collision = cars.some(car => {
            const carLeft = car.position - carWidth/2;
            const carRight = car.position + carWidth/2;
            const frogLeft = frogPositionPx - frogWidth/2;
            const frogRight = frogPositionPx + frogWidth/2;
            
            return (
                (frogLeft >= carLeft && frogLeft <= carRight) ||
                (frogRight >= carLeft && frogRight <= carRight) ||
                (frogLeft <= carLeft && frogRight >= carRight)
            );
        });
        
        if (collision) {
            killFrog();
        }
    }, [cars, frogPositionPx, gameActive, rowIndex, killFrog, rowWidth, frog]);
    // --- End of collision detection ---

    const hasFrog = frog[0] === rowIndex;

    return (
        <>
            <div key={rowIndex} className={`row row-${rowIndex}`}>
                {hasFrog ? (<Frog frog={frog} isDead={frogDead} rowIndex={rowIndex} />) : null}

                {cars.map(car => (
                <Car 
                    key={car.id}
                    position={car.position}
                    direction={car.direction}
                />
            ))}
            </div>
        </>
    );
});

export default Row;