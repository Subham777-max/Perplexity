import React from 'react';

const ChatGreeting = ({ greeting }) => {
  return (
    <div className="w-full animate-fade-in-up space-y-6 sm:space-y-8 flex flex-col items-center mb-8">
      <h1 className="text-3xl sm:text-4xl text-text-primary tracking-wide text-center flex items-center justify-center gap-3">
        <span className="font-serif leading-tight">
          {greeting}
        </span>
      </h1>
    </div>
  );
};

export default ChatGreeting;