import React from 'react';
import { Eye, Plus, TrendingUp, TrendingDown, Star } from 'lucide-react';

const Watchlist = ({ watchlist, setSelectedStock, setActiveTab }) => {
  return (
    <div className="dashboard-grid-2025">
      {/* Watchlist Header */}
      <div className="card-2025 portfolio-value-2025" style={{gridColumn: 'span 8'}}>
        <div className="value-header-2025">
          <div className="value-main-2025">
            <h2>Your Watchlist</h2>
            <div className="value-amount-2025">{watchlist?.length || 0} Stocks</div>
            <div className="value-change-2025">
              <span className="change-badge-2025">👁️ Tracking {watchlist?.length || 0} Positions</span>
              <span className="change-amount-2025">Market Monitoring</span>
            </div>
          </div>
          <div className="live-indicator-2025">
            <div className="status-dot-2025"></div>
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* Add to Watchlist */}
      <div className="card-2025 quick-actions-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>📝 Quick Actions</h3>
        <div className="actions-grid-2025">
          <div className="action-btn-2025" onClick={() => setActiveTab && setActiveTab('browse')}>
            <div className="action-icon-2025 bg-green-gradient">
              <Plus />
            </div>
            <div className="action-label-2025">Add Stock</div>
          </div>
          <div className="action-btn-2025">
            <div className="action-icon-2025 bg-blue-gradient">
              <Star />
            </div>
            <div className="action-label-2025">Favorites</div>
          </div>
          <div className="action-btn-2025">
            <div className="action-icon-2025 bg-purple-gradient">
              <TrendingUp />
            </div>
            <div className="action-label-2025">Top Movers</div>
          </div>
          <div className="action-btn-2025">
            <div className="action-icon-2025 bg-red-gradient">
              <Eye />
            </div>
            <div className="action-label-2025">Market Watch</div>
          </div>
        </div>
      </div>

      {/* Watchlist Grid */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>👁️ Stocks You're Watching</h3>
        
        <div className="movers-grid-2025">
          {watchlist?.map((stock) => {
            const isPositive = stock.change >= 0;

            return (
              <div 
                key={stock.symbol} 
                className="mover-card-2025"
                onClick={() => setSelectedStock && setSelectedStock({
                  symbol: stock.symbol,
                  name: stock.name,
                  price: stock.price,
                  change: stock.change,
                  changePercent: stock.changePercent,
                  color: isPositive ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
                })}
              >
                <div className="mover-header-2025">
                  <span className="mover-symbol-2025">{stock.symbol}</span>
                  <span className={`mover-change-2025 ${isPositive ? 'positive-2025' : 'negative-2025'}`}>
                    {isPositive ? '+' : ''}{stock.changePercent}%
                  </span>
                </div>
                <div className="mover-price-2025">${stock.price.toLocaleString()}</div>
                <div className="mover-name-2025">{stock.name}</div>
              </div>
            );
          })}
          
          {/* Show empty state if no watchlist items */}
          {(!watchlist || watchlist.length === 0) && (
            <div className="mover-card-2025" style={{gridColumn: 'span 3', textAlign: 'center', opacity: 0.7}}>
              <div className="mover-header-2025">
                <span className="mover-symbol-2025">👁️</span>
              </div>
              <div className="mover-price-2025">No Stocks</div>
              <div className="mover-name-2025">Add stocks to your watchlist to track them here</div>
            </div>
          )}
        </div>
      </div>

      {/* Market Overview */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>📊 Market Overview</h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
          <div className="metric-card-2025">
            <div className="metric-label-2025">S&P 500</div>
            <div className="metric-value-2025 positive-2025">4,567.23</div>
            <div className="holding-change-2025 positive-2025">+1.2%</div>
          </div>
          
          <div className="metric-card-2025">
            <div className="metric-label-2025">NASDAQ</div>
            <div className="metric-value-2025 positive-2025">14,432.11</div>
            <div className="holding-change-2025 positive-2025">+0.8%</div>
          </div>
          
          <div className="metric-card-2025">
            <div className="metric-label-2025">DOW JONES</div>
            <div className="metric-value-2025 negative-2025">34,876.44</div>
            <div className="holding-change-2025 negative-2025">-0.3%</div>
          </div>
          
          <div className="metric-card-2025">
            <div className="metric-label-2025">VIX</div>
            <div className="metric-value-2025">18.76</div>
            <div className="holding-change-2025 positive-2025">+2.1%</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;