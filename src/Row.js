import React, { useState, useEffect, useRef, memo } from 'react';
import Cell from './Cell';
import { logRoles } from '@testing-library/dom';

const Row = memo(function Row({ frog, frogDead, rowIndex, gameActive, killFrog }) {

    let width = 13
    const [cars, setCars] = useState([
        { row: 11, col: 9, direction: 'left', speed: 0.02 },
        { row: 11, col: 6, direction: 'left', speed: 0.02 },
        { row: 11, col: 3, direction: 'left', speed: 0.02 },
        { row: 11, col: 1, direction: 'left', speed: 0.02 },
    ]);
    const [logs, setLogs] = useState([]);
    const animationFrameId = useRef(null);

    // const getCars = () => {

    // }

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
                    if (newCol >= width) newCol -= width;
                    if (newCol < 0) newCol += width;

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
            killFrog();
        }
    }, [frog, cars]);

    return (
        <>
            <div key={rowIndex} className={`row row-${rowIndex}`}>
                {Array.from({ length: width }).map((_, i) => (
                    <Cell
                        frog={frog}
                        frogDead={frogDead}
                        cellIndex={i}
                        rowIndex={rowIndex} />
                ))}
            </div>
        </>
    );
});

export default Row;