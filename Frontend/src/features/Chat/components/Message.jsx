import React from 'react';
import { useMarkdownRenderer } from '../hooks/useMarkdownRenderer';

const Message = ({ msg, index }) => {
  const isUserMessage = msg.role === 'user';
  const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
  const renderedContent = useMarkdownRenderer(content);

  return (
    <div className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] px-5 py-3 rounded-2xl ${
          isUserMessage
            ? 'bg-secondary text-text-primary'
            : 'bg-transparent text-text-primary'
        }`}
      >
        {isUserMessage ? (
          content
        ) : (
          <div className="markdown-content">
            {renderedContent}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
