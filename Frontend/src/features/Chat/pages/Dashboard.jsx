import React, { useEffect } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../Auth/hooks/useAuth';
import DashboardLayout from '../components/Layout/DashboardLayout';

function Dashboard() {
  const { user } = useAuth();
  const { initializeSocketConnection } = useChat();
  
  useEffect(() => {
    initializeSocketConnection();
  }, [initializeSocketConnection]);

  return (
    <DashboardLayout />
  );
}

export default Dashboard;