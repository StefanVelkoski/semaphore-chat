import React from 'react';
import './styles.css';

const ActionButton = ({ children, onClick }) => {
    return (
        <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full custom-button"
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default ActionButton;