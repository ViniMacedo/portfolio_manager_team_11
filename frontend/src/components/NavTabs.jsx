// frontend/src/components/NavTabs.jsx
import React from 'react';
import { Sparkles, BarChart3,Zap,Eye,Search  } from 'lucide-react';

const NavTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'holdings', label: 'Holdings', icon: BarChart3 },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'watchlist', label: 'Watchlist', icon: Eye },
    { id: 'browse', label: 'Browse Stocks', icon: Search }
  ];

  return (
    <nav className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-1 sm:py-2">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-1 flex space-x-1">
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
      </div>
    </nav>
  );
};

export default NavTabs;
