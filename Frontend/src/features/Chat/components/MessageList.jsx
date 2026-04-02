import React from 'react';
import Message from './Message';

const MessageList = ({ messages, messagesEndRef }) => {
  return (
    <div className="flex-1 w-full space-y-6 pb-6">
      {messages.map((msg, index) => (
        <Message key={index} msg={msg} index={index} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;