import React, { useState } from 'react';
import ActionButton from '../../components/ActionButton';

const UsernameChangeModal = ({ isOpen, onClose, onSave }) => {
    const [newUsername, setNewUsername] = useState('');

    const handleSave = () => {
        onSave(newUsername);
        onClose();
    };

    return (
        isOpen && (
            <div className="fixed inset-0 flex justify-center items-center z-50">
                <div className="bg-white rounded-lg p-4 w-1/3 border border-gray-300">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold">Change Username</h2>
                        <button
                            className="text-red-500 hover:text-red-700 text-2xl leading-none"
                            onClick={onClose}
                            style={{ cursor: 'pointer' }}
                        >
                            &times;
                        </button>
                    </div>
                    <input
                        type="text"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full mb-4"
                    />
                    <div className="flex justify-end">
                        <ActionButton onClick={handleSave}>
                            Save
                        </ActionButton>
                    </div>
                </div>
            </div>
        )
    );
};

export default UsernameChangeModal;
