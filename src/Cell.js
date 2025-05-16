import React from 'react';


const Cell = ({ frog, isCar, frogDead, cellIndex, rowIndex }) => {

    const isFrog = (frog)[0] === rowIndex && (frog)[1] === cellIndex;


    return (
        <>
            <div className={`cell col-${cellIndex}`} key={cellIndex}>
                {isFrog ? (
                    frogDead ? (
                        <div className="frog">💀</div>
                    ) : (
                        <div className="frog">🐸</div>
                    )
                ) : null}
                {isCar ? (
                    <div className="car">🚗</div>
                ) : null}
            </div>
        </>
    );
};

export default Cell;