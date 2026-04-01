import React from 'react';

const ChatHeader = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <header className="flex items-center justify-between p-4 sticky top-0 z-20 bg-tertiary/90 backdrop-blur-sm">
      <div className="flex items-center">
        {!isSidebarOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 mr-3 text-text-secondary hover:text-text-primary rounded-lg hover:bg-secondary transition-colors cursor-pointer"
            title="Open Sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
            </svg>
          </button>
        )}
      </div>
      
      {/* Top Right Action Button */}
      <div className="flex items-center space-x-2">
        <button className="px-3 py-1.5 text-sm font-medium text-text-secondary hover:bg-secondary border border-theme rounded-lg transition-all shadow-sm cursor-pointer">
          Default Model • <span className="hover:underline text-text-primary transition-all">Change</span>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;
