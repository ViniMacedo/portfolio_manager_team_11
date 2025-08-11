// frontend/src/components/Header.jsx
import React from 'react';
import { Brain, Search, Bell, Settings, Sparkles, BarChart3, Zap, Eye, TrendingUp } from 'lucide-react';
import { isMarketOpen } from '../utils/globalUtils';

const Header = ({ activeTab, setActiveTab, onOpenAI }) => {
  const marketOpen = isMarketOpen();
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
          <div className="logo-2025">
            <TrendingUp size={24} style={{color: 'white'}} />
          </div>
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
          <div className={`ai-status-2025 ${marketOpen ? '' : 'closed'}`}>
            <div className={`status-dot-2025 ${marketOpen ? '' : 'closed'}`}></div>
            <span style={{fontSize: '13px'}}>{marketOpen ? 'Market Open' : 'Market Closed'}</span>
          </div>
          
          {/* AI Assistant Button */}
          <button
            onClick={onOpenAI}
            className="ai-assistant-btn-2025"
            style={{
              background: 'linear-gradient(135deg, var(--color-neon-purple), var(--color-neon-blue))',
              border: 'none',
              borderRadius: '50px',
              padding: '8px 16px',
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 20px rgba(147, 51, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Brain size={14} />
            AI Chat
          </button>
          
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
