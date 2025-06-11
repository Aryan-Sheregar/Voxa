import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import History from './pages/History';
import Calendar from './pages/Calendar';
import Settings from './pages/Settings';
import NotionIntegration from './pages/NotionIntegration';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, isLoading } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/signin\" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-900">
      <Header onMenuToggle={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        
        <main className="flex-1 flex flex-col overflow-hidden md:ml-64">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<History />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notion" element={<NotionIntegration />} />
            <Route path="*" element={<Navigate to="/dashboard\" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <Router>
          <AppContent />
        </Router>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;