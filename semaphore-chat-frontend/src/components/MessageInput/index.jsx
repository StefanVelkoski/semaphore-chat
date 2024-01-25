import React, { useState } from 'react';

const MessageInput = ({ socket, username }) => {
    const [message, setMessage] = useState('');


    const sendMessage = () => {
        const username = sessionStorage.getItem('newUsername') || 'Anonymous';
        if (message && socket && username) {
            socket.emit('sendMessage', { message, username });
            setMessage('');
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            sendMessage();
        }
    };

    return (
        <div className="p-4 border-t flex items-center">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="border p-2 flex-grow rounded-l-lg"
            />
            <button
                onClick={sendMessage}
                className="bg-custom-button hover:bg-custom-button-hover text-white p-2 rounded-r-lg"
            >
                Send
            </button>
        </div>
    );
};

export default MessageInput;
