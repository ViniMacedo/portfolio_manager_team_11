// frontend/src/components/Header.jsx
import React from 'react';
import { Brain, Search, Bell, Settings, Sparkles, BarChart3, Zap, Eye, TrendingUp } from 'lucide-react';

const Header = ({ activeTab, setActiveTab, onOpenAI }) => {
  const tabs = [
    { id: 'overview', label: 'Dashboard' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'ai-insights', label: 'AI Insights' },
    { id: 'browse', label: 'Browse Stocks' }
  ];

  return (
    <div className="header-2025">
      <div className="header-top-2025">
        <div className="logo-section-2025">
          <div className="logo-2025">💎</div>
          <div className="brand-2025">
            <h1>Portfolio AI Suite</h1>
            <p>Next-Gen Wealth Management</p>
          </div>
        </div>
        
        <div className="header-actions-2025">
          <div className="ai-status-2025">
            <div className="status-dot-2025"></div>
            <span style={{fontSize: '13px'}}>AI Active</span>
          </div>
          <div className="user-avatar-2025">JD</div>
        </div>
      </div>
      
      <nav className="nav-2025">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`nav-item-2025 ${activeTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Header;
