import React from 'react';
import { Film, Heart, Home } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAppContext();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/favorites', icon: Heart, label: `Favorites (${state.favorites.length})` },
  ];

  return (
    <header className="bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-orange-400 transition-colors"
          >
            <Film className="w-8 h-8 text-orange-500" />
            <span className="text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              CineDiscover
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            {navItems.map(({ path, icon: Icon, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  location.pathname === path
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}