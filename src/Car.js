import React from 'react';

const Car = ({ position, direction }) => {
    return (
        <div 
            className={`car car-${direction}`}
            style={{
                position: 'absolute',
                left: `${position}px`,
                transform: 'translateX(-50%)',
                transition: 'left 0.05s linear'
            }}
        >
            {direction === 'right' ? '→' : '←'}
        </div>
    );
};

export default Car;