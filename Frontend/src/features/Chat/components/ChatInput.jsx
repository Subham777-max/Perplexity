import React from 'react';

const ChatInput = ({
  inputText,
  setInputText,
  handleSendMessage,
  isProEnabled,
  setIsProEnabled,
  isMessagesEmpty
}) => {
  return (
    <div className="w-full flex shrink-0 flex-col items-center">
      <form onSubmit={handleSendMessage} className="w-full border border-theme rounded-2xl p-3 sm:p-4 bg-tertiary shadow-sm focus-within:shadow-md focus-within:border-theme transition-all duration-300 relative group">
        <textarea
          className="w-full bg-transparent resize-none border-none outline-none text-text-primary placeholder-(--text-tertiary) overflow-y-auto focus:ring-0 text-base sm:text-lg min-h-12.5 max-h-50"
          placeholder={isMessagesEmpty ? "Ask anything..." : "Ask a follow up..."}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
          rows={isMessagesEmpty ? 2 : 1}
        ></textarea>

        <div className="flex items-center justify-between mt-2 pt-2">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg hover:bg-secondary text-text-secondary transition-colors text-sm font-medium cursor-pointer"
              title="Focus"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
              <span className="hidden sm:inline">Focus</span>
            </button>
            <button
              type="button"
              className="flex items-center space-x-1.5 px-2 py-1.5 rounded-lg hover:bg-secondary text-text-secondary transition-colors text-sm font-medium cursor-pointer"
              title="Attach file"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
              </svg>
              <span className="hidden sm:inline">Attach</span>
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-text-secondary">Pro</span>
              <button 
                type="button"
                onClick={() => setIsProEnabled(!isProEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isProEnabled ? 'bg-custom-primary' : 'bg-primary border-theme'}`}
              >
                <span aria-hidden="true" className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-tertiary shadow ring-0 transition duration-200 ease-in-out ${isProEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
            <button 
              type="submit"
              disabled={!inputText.trim()}
              className={`p-2 rounded-lg transition-all cursor-pointer ${
                inputText.trim() 
                ? "bg-custom-primary text-white shadow-sm hover:brightness-110" 
                : "bg-secondary text-text-tertiary cursor-not-allowed"
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </form>

      {isMessagesEmpty && (
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 px-2 mt-4">
          {[
            { label: 'Explain Quantum Computing', icon: '⚛️' },
            { label: 'Latest tech news', icon: '📰' },
            { label: 'Help me write code', icon: '💻' },
          ].map((btn, i) => (
            <button
              key={i}
              className="flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl border border-theme text-text-secondary text-xs sm:text-sm font-medium hover:bg-secondary bg-primary transition-colors shadow-sm cursor-pointer"
              onClick={() => setInputText(btn.label)}
            >
              <span className="opacity-70 text-text-tertiary">{btn.icon}</span>
              <span className="text-text-primary">{btn.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatInput;