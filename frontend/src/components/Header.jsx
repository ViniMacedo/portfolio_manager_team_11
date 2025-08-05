// frontend/src/components/Header.jsx
import React from 'react';
import { Sparkles, Search, Bell, Settings, BarChart3, Zap, Eye, TrendingUp } from 'lucide-react';

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Sparkles, color: 'from-cyan-400 to-blue-500' },
    { id: 'holdings', label: 'Holdings', icon: BarChart3, color: 'from-purple-400 to-indigo-500' },
    { id: 'performance', label: 'Performance', icon: Zap, color: 'from-green-400 to-emerald-500' },
    { id: 'watchlist', label: 'Watchlist', icon: Eye, color: 'from-orange-400 to-red-500' },
    { id: 'browse', label: 'Browse Stocks', icon: Search, color: 'from-pink-400 to-purple-500' }
  ];

  return (
    <header className="relative z-20 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-3">
      {/* Main header container with enhanced glassmorphism */}
      <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-3 sm:p-4 border border-white/20 shadow-xl overflow-hidden">
        {/* Background gradient effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-cyan-500/10"></div>
        <div className="absolute top-0 right-0 w-64 h-32 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-24 bg-gradient-to-tr from-blue-400/10 to-transparent rounded-full blur-2xl"></div>
        
        <div className="relative z-10">
          {/* Top row with enhanced logo and action buttons */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3 flex-shrink-0">
              {/* Enhanced logo with gradient and animation */}
              <div className="relative group">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300 border border-white/20">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
              </div>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-white via-blue-100 to-cyan-100 bg-clip-text text-transparent">
                  Portfolio Manager
                </h1>
                <p className="text-white/60 text-xs sm:text-sm font-medium hidden sm:block">
                  Professional Investment Tracking
                </p>
              </div>
            </div>

            {/* Enhanced action buttons */}
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button className="group w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/30 hover:scale-105">
                <Search className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white/80 group-hover:text-white transition-colors" />
              </button>
              <button className="group relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/30 hover:scale-105">
                <Bell className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white/80 group-hover:text-white transition-colors" />
                {/* Notification dot */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-400 to-pink-500 rounded-full border-2 border-white/20 animate-pulse"></div>
              </button>
              <button className="group w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/30 hover:scale-105">
                <Settings className="h-4 w-4 sm:h-4.5 sm:w-4.5 lg:h-5 lg:w-5 text-white/80 group-hover:text-white group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* Enhanced navigation tabs */}
          <nav className="relative bg-white/5 backdrop-blur-lg rounded-xl p-1.5 border border-white/10">
            <div className="flex space-x-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group relative flex items-center space-x-2 px-3 sm:px-4 lg:px-5 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm overflow-hidden
                    ${activeTab === tab.id 
                      ? 'bg-white text-slate-900 shadow-xl scale-105 transform' 
                      : 'text-white/70 hover:text-white hover:bg-white/10 hover:scale-102 transform'
                    }
                  `}
                >
                  {/* Active tab gradient background */}
                  {activeTab === tab.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-90 rounded-lg`}></div>
                  )}
                  
                  {/* Tab content */}
                  <div className="relative z-10 flex items-center space-x-2">
                    <div className={`p-1 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-white/20' 
                        : 'group-hover:bg-white/10'
                    }`}>
                      <tab.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </div>
                    <span className="hidden sm:inline whitespace-nowrap">{tab.label}</span>
                  </div>

                  {/* Hover glow effect */}
                  {activeTab !== tab.id && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${tab.color} opacity-0 group-hover:opacity-20 rounded-lg transition-opacity duration-300`}></div>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
