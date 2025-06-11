import React from 'react';
import { 
  Calendar, 
  History, 
  LayoutDashboard, 
  Settings, 
  X, 
  LogOut,
  Mic,
  ExternalLink
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || (path === '/dashboard' && location.pathname === '/');
  };

  const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/history', icon: History, label: 'History' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/notion', icon: ExternalLink, label: 'Notion', badge: 'Connect' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out border-r border-gray-200 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white">
                <Mic className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Voxa</h2>
            </Link>
            <button 
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors md:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* User info */}
          {user && (
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Navigation */}
          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      onClick={onClose}
                      className={`flex items-center justify-between gap-3 px-3 py-2 rounded-lg transition-colors ${
                        active 
                          ? 'bg-blue-50 text-blue-700' 
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${active ? 'text-blue-600' : ''}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {user ? (
              <button 
                onClick={logout}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link 
                to="/signin"
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white"
              >
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;