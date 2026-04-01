import React from 'react';

const MessageList = ({ messages, messagesEndRef }) => {
  return (
    <div className="flex-1 w-full space-y-6 pb-6">
      {messages.map((msg, index) => (
        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
          <div className={`max-w-[85%] px-5 py-3 rounded-2xl ${msg.role === 'user' ? 'bg-secondary text-text-primary' : 'bg-transparent text-text-primary'}`}>
            {msg.content}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;