import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../Auth/hooks/useAuth';
import ChatHeader from '../ChatHeader';
import ChatGreeting from '../ChatGreeting';
import MessageList from '../MessageList';
import ChatInput from '../ChatInput';

const MainContent = ({ toggleSidebar, isSidebarOpen }) => {
  const [messages, setMessages] = useState([
    { role: 'user', content: 'Explain Quantum Computing' },
    { role: 'ai', content: 'Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers.' },
    { role: 'user', content: 'What are qubits?' },
    { role: 'ai', content: 'A qubit (short for quantum bit) is the basic unit of information in quantum computing. Unlike bits which can only store 0 or 1, qubits can exist in a superposition of both states.' }
  ]);
  const [inputText, setInputText] = useState('');
  const [isProEnabled, setIsProEnabled] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth() || {};

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeOfDay = 'evening';
    if (hour < 12) timeOfDay = 'morning';
    else if (hour < 18) timeOfDay = 'afternoon';
    return `Good ${timeOfDay}, ${user?.username?.split(' ')[0] || 'there'}`;
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    // Optimistically add user message for layout testing
    setMessages(prev => [...prev, { role: 'user', content: inputText }]);
    // Backend integration placeholder
    console.log("Sending:", inputText, "Pro:", isProEnabled);
    setInputText('');
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
          handleSendMessage={handleSendMessage}
          isProEnabled={isProEnabled}
          setIsProEnabled={setIsProEnabled}
          isMessagesEmpty={messages.length === 0}
        />
      </main>
    </div>
  );
};

export default MainContent;