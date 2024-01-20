import React from 'react';

const MessageList = () => {
    const messages = [
        { id: 1, sender: 'Zmaj', content: 'Hello!' },
        { id: 2, sender: 'Stefan', content: 'Hi there!' },
    ];

    return (
        <div className="flex-grow overflow-auto p-4">
            {messages.map((message) => (
                <div key={message.id} className="mb-2">
                    <strong>{message.sender}:</strong> {message.content}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
