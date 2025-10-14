import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Palette, Home, Image } from 'lucide-react';
import { clsx } from 'clsx';

export const Header: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/results', label: 'Results', icon: Image }
  ];
  
  return (
    <header className="bg-[#2d2d2d] shadow-sm border-b border-[#374151]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#3b82f6] p-2 rounded-lg">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Comics Mate</h1>
              <p className="text-xs text-[#9ca3af]">Caricature Generator</p>
            </div>
          </Link>
          
          {/* Navigation */}
          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={clsx(
                    'flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#9ca3af] hover:text-white hover:bg-[#374151]'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};