import React, { useEffect, useState, useRef } from 'react';
import { useAuth } from '../../../Auth/hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { useSelector } from 'react-redux';
import { setCurrentChatId, setViewMode } from '../../chat.slice';
import { useDispatch } from 'react-redux';
import { useIsMobile } from '../../../../hooks/useIsMobile';
import { MoreVertical, Trash2 } from 'lucide-react';


const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { user } = useAuth() || {};
  const isMobile = useIsMobile();
  const { handleGetChats , handleOpenChat, handleDeleteChat } = useChat();
  const { chats } = useSelector((state) => state.chat);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const menuButtonRef = useRef(null);
  
  console.log(chats)
  useEffect(()=>{
    handleGetChats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside() {
      setOpenMenuId(null);
    }
    if (openMenuId) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [openMenuId]);

  const dispatch = useDispatch();

  function openChat(chatId){
    dispatch(setViewMode('chat'));
    handleOpenChat(chatId);
  }

  function handleDeleteConfirm(chatId, e) {
    e.stopPropagation();
    setChatToDelete(chatId);
    setShowConfirm(true);
    setOpenMenuId(null);
  }

  function confirmDelete() {
    if (chatToDelete) {
      handleDeleteChat(chatToDelete);
      setShowConfirm(false);
      setChatToDelete(null);
      setOpenMenuId(null);
    }
  }

  function cancelDelete() {
    setShowConfirm(false);
    setChatToDelete(null);
  }
  // console.log('Sidebar render - isOpen:', isOpen, 'isMobile:', isMobile);
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
        <button onClick={()=> {
          dispatch(setCurrentChatId(null));
          dispatch(setViewMode('chat'));
          isMobile && toggleSidebar();
        }} className="flex items-center justify-between w-full text-left px-3 py-2.5 text-text-primary rounded-lg border border-theme hover:bg-secondary transition-all cursor-pointer group">
          <div className="flex items-center space-x-3">
             <span className="font-medium text-sm truncate">New Thread</span>
          </div>
          <span className="text-text-secondary group-hover:text-text-primary text-lg leading-none shrink-0">+</span>
        </button>
        <button onClick={() => dispatch(setViewMode('discover'))} className="flex items-center space-x-3 w-full text-left px-3 py-2 text-text-primary rounded-lg hover:bg-secondary transition-all cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 shrink-0 text-text-secondary">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <span className="font-medium text-sm truncate">Discover</span>
        </button>
      </div>

      {/* Threads / Recents */}
      <div className="flex-1 overflow-y-auto no-scrollbar w-full mb-4">
        <p className="text-xs font-semibold text-text-tertiary mb-3 px-3 uppercase tracking-wider">Your Chats</p>
        <div className="space-y-1">
          {chats && Object.values(chats).map((chat, idx) => (
            <div 
              key={idx} 
              className="group flex gap-2 relative w-full text-left px-2 py-1 text-sm text-text-secondary hover:bg-(--secondary-color) hover:text-text-primary rounded-lg truncate transition-all cursor-pointer"
            >
              <button 
                className="flex-1 text-left px-1 py-1 cursor-pointer text-sm text-text-secondary hover:text-text-primary truncate"
                onClick={() => {
                  openChat(chat.id);
                  isMobile && toggleSidebar();
                }}
              >
                {chat.title || `Chat ${idx + 1}`}
              </button>
              <button 
                ref={openMenuId === chat.id ? menuButtonRef : null}
                onClick={(e) => {
                  e.stopPropagation();
                  if (openMenuId === chat.id) {
                    setOpenMenuId(null);
                  } else {
                    setOpenMenuId(chat.id);
                    const rect = e.currentTarget.getBoundingClientRect();
                    const sidebarRect = e.currentTarget.closest('aside').getBoundingClientRect();
                    setMenuPosition({
                      top: rect.bottom - sidebarRect.top,
                      right: sidebarRect.right - rect.right
                    });
                  }
                }}
                className="shrink-0 p-1 cursor-pointer text-text-secondary opacity-0 group-hover:opacity-100 hover:text-text-primary hover:bg-theme/30 rounded-md transition-all"
                title="Chat options"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dropdown Menu - Fixed positioning to escape scroll container */}
      {openMenuId && (
        <div 
          className="fixed bg-tertiary border border-theme rounded-lg shadow-lg py-1 z-40 w-40"
          style={{
            top: `${(document.querySelector('aside')?.getBoundingClientRect().top || 0) + menuPosition.top}px`,
            right: `${(window.innerWidth - (document.querySelector('aside')?.getBoundingClientRect().right || 0)) + menuPosition.right}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={(e) => handleDeleteConfirm(openMenuId, e)}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors flex items-center space-x-2"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      )}

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

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-100">
          <div className="bg-tertiary rounded-lg shadow-lg p-6 max-w-sm mx-4 border border-theme">
            <h3 className="text-text-primary font-semibold text-lg mb-2">Delete Chat?</h3>
            <p className="text-text-secondary text-sm mb-6">This action cannot be undone. Are you sure you want to delete this chat?</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 text-sm text-text-primary hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
