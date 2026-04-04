import React, { useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../Auth/hooks/useAuth';
import DashboardLayout from '../components/Layout/DashboardLayout';

function Dashboard() {
  const { user } = useAuth();
  
  // useChat hook automatically initializes socket connection with user token
  // No need to manually call initializeSocketConnection
  const { handleSendMessage, handleGetChats, handleOpenChat } = useChat();
  
  useEffect(() => {
    if (user) {
      console.log("Dashboard mounted - socket connection initialized in useChat hook");
    }
  }, [user]);

  return (
    <DashboardLayout />
  );
}

export default Dashboard;