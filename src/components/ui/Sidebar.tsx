import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FileText, 
  Settings,
  Palette,
  ImageIcon
} from 'lucide-react';
import clsx from 'clsx';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="w-64 bg-[#2d2d2d] text-white h-screen fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-[#374151]">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-lg">
            <Palette className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-white">Comics Mate</span>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <nav className="space-y-2">
          <Link
            to="/"
            className={clsx(
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
              location.pathname === '/' 
                ? 'bg-[#3b82f6] text-white shadow-md' 
                : 'text-[#9ca3af] hover:bg-[#374151] hover:text-white'
            )}
          >
            <Palette className="w-5 h-5" />
            <span className="font-medium">Image Generator</span>
          </Link>
          
          <Link
            to="/results"
            className={clsx(
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
              location.pathname === '/results' 
                ? 'bg-[#3b82f6] text-white shadow-md' 
                : 'text-[#9ca3af] hover:bg-[#374151] hover:text-white'
            )}
          >
            <ImageIcon className="w-5 h-5" />
            <span className="font-medium">Results</span>
          </Link>
          
          <Link
            to="/settings"
            className={clsx(
              'flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200',
              location.pathname === '/settings' 
                ? 'bg-[#3b82f6] text-white shadow-md' 
                : 'text-[#9ca3af] hover:bg-[#374151] hover:text-white'
            )}
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </Link>
        </nav>
      </nav>
    </div>
  );
};