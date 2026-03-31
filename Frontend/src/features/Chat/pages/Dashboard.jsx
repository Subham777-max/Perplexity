import React ,{ useEffect } from 'react'
import { useChat } from '../hooks/useChat';
import { useAuth } from '../../Auth/hooks/useAuth';
function Dashboard() {
  const { user } = useAuth();
  const { initializeSocketConnection } = useChat();
  useEffect(()=>{
    initializeSocketConnection();
  },[initializeSocketConnection])
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard