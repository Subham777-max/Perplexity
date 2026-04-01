import React from 'react';
import { useAuth } from '../../../Auth/hooks/useAuth';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth() || {};

  return (
    <aside
      className={`absolute md:relative flex flex-col shrink-0 bg-primary h-full transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'w-full md:w-64 opacity-100 px-4 py-4' : 'w-0 opacity-0 px-0 overflow-hidden'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex items-center justify-between mb-6 w-full">
        <h1 className="text-2xl font-serif font-bold text-text-primary tracking-wide truncate pr-2">Perplexity</h1>
        <button onClick={toggleSidebar} className="p-1.5 text-text-secondary hover:text-text-primary rounded-md hover:bg-secondary hidden md:block cursor-pointer transition-colors" title="Collapse Sidebar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
          </svg>
        </button>
        {/* Mobile toggle */}
        <button onClick={toggleSidebar} className="p-1.5 text-text-secondary hover:text-text-primary rounded-md md:hidden cursor-pointer transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 mb-6 w-full">
        <button className="flex items-center justify-between w-full text-left px-3 py-2.5 text-text-primary rounded-lg border border-theme hover:bg-secondary transition-all cursor-pointer group">
          <div className="flex items-center space-x-3">
             <span className="font-medium text-sm truncate">New Thread</span>
          </div>
          <span className="text-text-secondary group-hover:text-text-primary text-lg leading-none shrink-0">+</span>
        </button>
        <button className="flex items-center space-x-3 w-full text-left px-3 py-2 text-text-primary rounded-lg hover:bg-secondary transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="font-medium text-sm truncate">Discover</span>
        </button>
         <button className="flex items-center space-x-3 w-full text-left px-3 py-2 text-text-primary rounded-lg hover:bg-secondary transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
          </svg>
          <span className="font-medium text-sm truncate">Library</span>
        </button>
      </div>

      {/* Threads / Recents */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full mb-4">
        <p className="text-xs font-semibold text-text-tertiary mb-3 px-3 uppercase tracking-wider">Today</p>
        <div className="space-y-1">
          {/* Mock Chats - Will be mapped from backend chat.model */}
          {[
            'Understanding LangChain and Mistral', 
            'Socket.io real-time chat setup', 
            'React layout components test layout title truncation'
          ].map((chat, idx) => (
            <button key={idx} className="block w-full text-left px-3 py-2 text-sm text-text-secondary hover:bg-secondary hover:text-text-primary rounded-lg truncate transition-all cursor-pointer">
              {chat}
            </button>
          ))}
        </div>
      </div>

      {/* Footer User Profile */}
      <div className="mt-auto w-full flex items-center justify-between">
        <button className="flex items-center space-x-3 w-full text-left p-2 hover:bg-secondary rounded-xl transition-all border border-transparent hover:border-theme cursor-pointer">
          <div className="shrink-0 w-8 h-8 rounded-full bg-custom-primary text-tertiary flex items-center justify-center font-bold text-sm">
            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text-primary truncate">{user?.username || 'User'}</p>
            <p className="text-xs text-text-tertiary truncate">Free plan</p>
          </div>
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="shrink-0 w-4 h-4 text-text-tertiary">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
