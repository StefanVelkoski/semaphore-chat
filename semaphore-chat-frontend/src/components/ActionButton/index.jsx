import React from 'react';
import './styles.css';

const ActionButton = ({ children, onClick, disabled }) => {
    return (
        <button
            className={`flex justify-center items-center w-full py-2 text-white bg-custom-button hover:bg-custom-button-hover rounded-full ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default ActionButton;