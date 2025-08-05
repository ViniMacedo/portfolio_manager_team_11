// frontend/src/components/Header.jsx
import React from 'react';
import { Sparkles, Search, Bell, Settings, BarChart3, Zap, Eye } from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'holdings', label: 'Holdings', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
    { id: 'browse', label: 'Browse Stocks', icon: Search }
  ];

  return (
    <header className="relative z-10 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-1 sm:py-2">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 sm:p-3 border border-white/20 min-w-0">
        {/* Top row with logo and action buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xs sm:text-sm lg:text-lg font-bold text-white truncate">Portfolio Manager</h1>
              <p className="text-white/70 text-xs hidden lg:block truncate">Track your investments</p>
            </div>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
            <button className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors border border-white/20">
              <Search className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-white/80" />
            </button>
            <button className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors border border-white/20">
              <Bell className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-white/80" />
            </button>
            <button className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors border border-white/20">
              <Settings className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4 text-white/80" />
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="bg-white/5 backdrop-blur-sm rounded-lg p-1 flex space-x-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-lg font-medium transition-all duration-200 text-xs sm:text-sm
                ${activeTab === tab.id 
                  ? 'bg-white text-slate-900 shadow-lg' 
                  : 'text-white/70 hover:text-white hover:bg-white/5'
                }
              `}
            >
              <span><tab.icon className="h-3 w-3 sm:h-4 sm:w-4" /></span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
