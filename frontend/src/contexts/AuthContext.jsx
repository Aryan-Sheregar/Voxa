import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const AuthContext = createContext(undefined);

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('voxa_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = () => {
    // For demo purposes, we'll mock the OAuth login
    const mockUser = {
      id: 'user_123',
      name: 'Alex Smith',
      email: 'alex@example.com'
    };
    
    setUser(mockUser);
    localStorage.setItem('voxa_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('voxa_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};