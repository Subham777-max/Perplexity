import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../Auth/hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import ChatHeader from '../ChatHeader';
import ChatGreeting from '../ChatGreeting';
import MessageList from '../MessageList';
import ChatInput from '../ChatInput';

const MainContent = ({ toggleSidebar, isSidebarOpen }) => {
  const { currentChatId, chats, isLoading } = useSelector((state) => state.chat);
  const messages = currentChatId && chats[currentChatId] ? chats[currentChatId].messages : [];
  
  const [inputText, setInputText] = useState('');
  const [isProEnabled, setIsProEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth() || {};
  const { handleSendMessage } = useChat();
  console.log(chats)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chats, currentChatId]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeOfDay = 'evening';
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 18) timeOfDay = 'afternoon';
    return `Good ${timeOfDay}, ${user?.username?.split(' ')[0] || 'there'}`;
  };

  const onSubmitMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const messageToSend = inputText;
    setInputText('');
    await handleSendMessage(currentChatId, messageToSend);
  };

  return (
    <div className="flex flex-col h-full bg-tertiary relative text-primary w-full overflow-hidden">
      <ChatHeader toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />

      {messages.length === 0 ? (
        /* Original layout when no messages */
        <main className={`flex-1 overflow-y-auto no-scrollbar flex flex-col p-4 lg:px-10 w-full mx-auto relative justify-center max-w-3xl`}>
          <ChatGreeting greeting={getGreeting()} />
          <ChatInput 
            inputText={inputText}
            setInputText={setInputText}
            handleSendMessage={onSubmitMessage}
            isProEnabled={isProEnabled}
            setIsProEnabled={setIsProEnabled}
            isMessagesEmpty={true}
          />
        </main>
      ) : (
        /* New layout with fixed input at bottom when messages exist */
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto no-scrollbar flex flex-col p-4 lg:px-10 w-full mx-auto relative max-w-4xl">
            <MessageList messages={messages} messagesEndRef={messagesEndRef} />
            
            {/* Loading indicator while searching */}
            {isLoading && (
              <div className="flex items-center space-x-3 mt-6 px-4 py-3 rounded-lg bg-secondary/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-custom-primary animate-bounce" style={{ animationDelay: '0s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-custom-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-custom-primary animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="text-sm text-text-secondary font-medium">Searching...</span>
              </div>
            )}
          </main>
          
          <div className="shrink-0 border-t border-theme bg-tertiary p-4 lg:px-10 w-full flex justify-center">
            <div className="w-full max-w-3xl">
              <ChatInput 
                inputText={inputText}
                setInputText={setInputText}
                handleSendMessage={onSubmitMessage}
                isProEnabled={isProEnabled}
                setIsProEnabled={setIsProEnabled}
                isMessagesEmpty={false}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;