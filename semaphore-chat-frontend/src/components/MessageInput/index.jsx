import React, { useState } from 'react';

const MessageInput = () => {
    const [message, setMessage] = useState('');

    const handleSendMessage = () => {
        setMessage('');
    };

    return (
        <div className="p-4 border-t flex items-center">
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="border p-2 flex-grow rounded-l-lg" 
            />
            <button
                onClick={handleSendMessage}
                className="bg-blue-500 text-white p-2 rounded-r-lg" 
            >
                Send
            </button>
        </div>
    );
};

export default MessageInput;
