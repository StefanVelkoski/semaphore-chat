import React from 'react';

const MessageList = ({messages}) => {
 

    return (
        <div className="flex-grow overflow-auto p-4">
            {messages.map((message) => (
                <div key={message.id} className="mb-2">
                    <strong>{message.from}:</strong> {message.body}
                </div>
            ))}
        </div>
    );
};

export default MessageList;
