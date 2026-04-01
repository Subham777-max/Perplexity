import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MainContent from './MainContent';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-primary text-primary">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col relative min-w-0 pr-4 py-4">
        {/* The main content area where chat and input will reside */}
        <div className="flex-1 flex flex-col bg-tertiary rounded-2xl border border-theme shadow-sm overflow-hidden">
           <MainContent toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
