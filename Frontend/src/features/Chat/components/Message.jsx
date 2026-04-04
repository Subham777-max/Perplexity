import React from 'react';
import { useMarkdownRenderer } from '../hooks/useMarkdownRenderer';

const Message = ({ msg, index }) => {
  const isUserMessage = msg.role === 'user';
  const content = typeof msg.content === 'string' ? msg.content : JSON.stringify(msg.content);
  const renderedContent = useMarkdownRenderer(content);
  const isStreaming = msg.isStreaming || false;

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
        
        {/* Typing indicator - shows while AI is streaming response */}
        {!isUserMessage && isStreaming && (
          <div className="flex items-center space-x-1 mt-2">
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
            <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
