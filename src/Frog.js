import React from 'react';


const Frog = ({ frog, rowIndex, isDead }) => {


    return (
        <>
            <div 
            className={`frog ${isDead ? 'frog-dead' : ''}`}
            style={{
                position: 'absolute',
                left: `${frog[1]}px`,
                transition: 'left 0.1s ease-out'
            }}
            >
                🐸
            </div>
        </>
    );
};

export default Frog;