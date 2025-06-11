import React from 'react';
import { Menu, Mic, Settings, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ onMenuToggle }) => {
  const { user, login, logout } = useAuth();

  return (
    <header className="bg-white py-3 px-4 shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onMenuToggle}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors md:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
              <Mic className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 hidden sm:block">Voxa</h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Link 
            to="/settings"
            className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </Link>
          
          {user ? (
            <button 
              onClick={logout}
              className="flex items-center gap-2 py-1 px-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm text-gray-900 hidden sm:block">{user.name}</span>
            </button>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 py-2 px-4 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white"
            >
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;