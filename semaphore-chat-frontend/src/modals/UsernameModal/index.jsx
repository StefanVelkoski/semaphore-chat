import React, { useState } from 'react';

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
                    <h2 className="text-xl font-semibold mb-4">Change Username</h2>
                    <input
                        type="text"
                        placeholder="New Username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full mb-4"
                    />
                    <div className="flex justify-end">
                        <button onClick={onClose} className="mr-4 text-gray-500 hover:text-gray-700">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
                            Save
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default UsernameChangeModal;
