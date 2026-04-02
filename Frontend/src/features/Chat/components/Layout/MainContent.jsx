import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../../Auth/hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import ChatHeader from '../ChatHeader';
import ChatGreeting from '../ChatGreeting';
import MessageList from '../MessageList';
import ChatInput from '../ChatInput';

const MainContent = ({ toggleSidebar, isSidebarOpen }) => {
  const { currentChatId, chats } = useSelector((state) => state.chat);
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

      {/* Main Chat Area */}
      <main className={`flex-1 overflow-y-auto no-scrollbar flex flex-col p-4 lg:px-10 w-full mx-auto relative ${messages.length === 0 ? 'justify-center max-w-3xl' : 'max-w-4xl'}`}>
        
        {messages.length === 0 ? (
          <ChatGreeting greeting={getGreeting()} />
        ) : (
          <MessageList messages={messages} messagesEndRef={messagesEndRef} />
        )}

        <ChatInput 
          inputText={inputText}
          setInputText={setInputText}
          handleSendMessage={onSubmitMessage}
          isProEnabled={isProEnabled}
          setIsProEnabled={setIsProEnabled}
          isMessagesEmpty={messages.length === 0}
        />
      </main>
    </div>
  );
};

export default MainContent;