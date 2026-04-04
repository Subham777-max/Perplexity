import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCurrentChatId, setViewMode } from '../chat.slice';
import { useChat } from '../hooks/useChat';

const Discover = () => {
  const { chats } = useSelector((state) => state.chat);
  const dispatch = useDispatch();
  const { handleOpenChat } = useChat();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter chats based on search query
  const filteredChats = useMemo(() => {
    if (!chats || Object.keys(chats).length === 0) {
      return [];
    }
    
    return Object.values(chats).filter((chat) =>
      chat.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [chats, searchQuery]);

  const handleClickChat = async (chatId) => {
    dispatch(setViewMode('chat'));
    await handleOpenChat(chatId);
  };

  return (
    <div className="flex flex-col h-full bg-tertiary relative text-primary w-full overflow-hidden p-4 lg:px-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-2">Discover</h1>
        <p className="text-text-secondary">Search and browse all your chats</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-secondary"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search chats by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-fit pl-10 pr-4 py-3 rounded-lg bg-secondary text-text-primary placeholder-text-tertiary border border-theme focus:outline-none"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {filteredChats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChats.map((chat, idx) => (
              <button
                key={idx}
                onClick={() => handleClickChat(chat.id)}
                className="p-4 rounded-lg bg-secondary border border-theme hover:border-custom-primary hover:bg-secondary/80 transition-all cursor-pointer text-left group"
              >
                <h3 className="text-text-primary font-semibold truncate group-hover:text-custom-primary transition-colors">
                  {chat.title || `Chat ${idx + 1}`}
                </h3>
                <p className="text-text-secondary text-sm mt-1">
                  {chat.messages?.length || 0} messages
                </p>
                <p className="text-text-tertiary text-xs mt-2">
                  {chat.lastUpdated
                    ? new Date(chat.lastUpdated).toLocaleDateString()
                    : 'No date'}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-text-tertiary mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
              />
            </svg>
            <p className="text-text-secondary text-lg">
              {Object.keys(chats).length === 0
                ? 'No chats yet. Start a new conversation!'
                : 'No chats found matching your search.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
