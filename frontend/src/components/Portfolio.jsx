import React from 'react';
import { TrendingUp, TrendingDown, PieChart, Activity, BarChart3, DollarSign } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/globalUtils';

const Portfolio = ({ portfolio, portfolioData, setSelectedStock }) => {
  // Use real portfolio data passed from parent (same as Overview and Analytics)
  const totalValue = portfolioData?.totalValue || 0;
  const totalInvested = portfolioData?.totalInvested || 0;
  const totalGain = totalValue - totalInvested;
  const totalGainPercent = totalInvested > 0 ? ((totalGain / totalInvested) * 100) : 0;

  // Calculate real top and worst performers from holdings
  const getPerformers = () => {
    if (!portfolio.holdings || portfolio.holdings.length === 0) {
      return { topPerformer: null, worstPerformer: null };
    }

    let topPerformer = null;
    let worstPerformer = null;
    let maxGain = -Infinity;
    let maxLoss = Infinity;

    portfolio.holdings.forEach(stock => {
      const shares = stock.shares || stock.quantity || 0;
      const currentPrice = stock.current_price || stock.price || 0;
      const avgPrice = stock.avg_price || stock.average_cost || currentPrice;
      
      const cost = shares * avgPrice;
      const value = shares * currentPrice;
      const gainLoss = value - cost;
      const changePercent = cost > 0 ? ((gainLoss / cost) * 100) : 0;

      if (changePercent > maxGain) {
        maxGain = changePercent;
        topPerformer = { symbol: stock.symbol, changePercent };
      }

      if (changePercent < maxLoss) {
        maxLoss = changePercent;
        worstPerformer = { symbol: stock.symbol, changePercent };
      }
    });

    return { topPerformer, worstPerformer };
  };

  const { topPerformer, worstPerformer } = getPerformers();

  return (
    <div className="dashboard-grid-2025">
      {/* Portfolio Overview - Top Row */}
      <div className="card-2025" style={{gridColumn: 'span 4'}}>
        <div className="value-header-2025">
          <div className="value-main-2025">
            <h3 className="section-title-2025">💼 Portfolio Value</h3>
            <div className="value-amount-2025">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
            <div className="value-change-2025">
              <span className={`change-badge-2025 ${totalGain >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                {totalGain >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                {totalGain >= 0 ? '+' : ''}${Math.abs(totalGain).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="change-amount-2025">
                {totalGainPercent >= 0 ? '+' : ''}{totalGainPercent.toFixed(2)}% Total Return
              </span>
            </div>
          </div>
          <div className="live-indicator-2025">
            <div className="status-dot-2025"></div>
            <span>LIVE</span>
          </div>
        </div>
      </div>

      {/* Portfolio Stats */}
      <div className="card-2025" style={{gridColumn: 'span 4'}}>
        <h3 className="section-title-2025">📊 Portfolio Analytics</h3>
        <div className="stats-grid-2025">
          <div className="stat-item-2025">
            <span className="stat-label-2025">Active Positions</span>
            <span className="stat-value-2025">{portfolio.holdings?.length || 0}</span>
          </div>
          <div className="stat-item-2025">
            <span className="stat-label-2025">Total Invested</span>
            <span className="stat-value-2025">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="stat-item-2025">
            <span className="stat-label-2025">Market Value</span>
            <span className="stat-value-2025">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="stat-item-2025">
            <span className="stat-label-2025">Portfolio Health</span>
            <span className={`stat-value-2025 ${totalGainPercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {totalGainPercent >= -10 && totalGainPercent < 0 ? 'Fair' : 
               totalGainPercent >= 0 ? 'Excellent' : 'Needs Attention'}
            </span>
          </div>
        </div>
      </div>

      {/* Top/Worst Performers */}
      <div className="card-2025" style={{gridColumn: 'span 4'}}>
        <h3 className="section-title-2025">🏆 Performance Leaders</h3>
        <div className="performance-leaders-2025">
          {topPerformer && (
            <div className="leader-item-2025">
              <div className="leader-header-2025">
                <span className="leader-label-2025">🚀 Top Performer</span>
                <span className="leader-symbol-2025">{topPerformer.symbol}</span>
              </div>
              <div className="leader-performance-2025 positive-2025">
                {topPerformer.changePercent >= 0 ? '+' : ''}{topPerformer.changePercent.toFixed(2)}%
              </div>
            </div>
          )}
          {worstPerformer && (
            <div className="leader-item-2025">
              <div className="leader-header-2025">
                <span className="leader-label-2025">📉 Needs Attention</span>
                <span className="leader-symbol-2025">{worstPerformer.symbol}</span>
              </div>
              <div className="leader-performance-2025 negative-2025">
                {worstPerformer.changePercent.toFixed(2)}%
              </div>
            </div>
          )}
          {!topPerformer && !worstPerformer && portfolio.holdings?.length === 0 && (
            <div className="leader-item-2025">
              <div className="leader-header-2025">
                <span className="leader-label-2025">📈 No Holdings</span>
              </div>
              <div className="leader-performance-2025">
                Add stocks to see performance
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Holdings Table */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>
        <div className="table-header-2025">
          <h3 className="section-title-2025">📋 Holdings Details</h3>
          <div className="table-actions-2025">
            <button className="action-button-2025">
              <PieChart size={16} />
              Allocation
            </button>
            <button className="action-button-2025">
              <Activity size={16} />
              Activity
            </button>
          </div>
        </div>

        <div className="holdings-table-2025">
          <div className="table-header-row-2025">
            <div className="table-cell-2025">Symbol</div>
            <div className="table-cell-2025">Shares</div>
            <div className="table-cell-2025">Avg Cost</div>
            <div className="table-cell-2025">Current Price</div>
            <div className="table-cell-2025">Market Value</div>
            <div className="table-cell-2025">Gain/Loss</div>
            <div className="table-cell-2025">Weight</div>
          </div>

          {portfolio.holdings?.map((stock, index) => {
            const shares = stock.shares || stock.quantity || 0;
            const currentPrice = stock.current_price || stock.price || 0;
            const avgPrice = stock.avg_price || stock.average_cost || currentPrice;
            
            const value = shares * currentPrice;
            const cost = shares * avgPrice;
            const gainLoss = value - cost;
            const gainLossPercent = cost > 0 ? ((gainLoss) / cost * 100) : 0;
            const weight = totalValue > 0 ? ((value / totalValue) * 100) : 0;
            const isPositive = gainLoss >= 0;

            return (
              <div 
                key={stock.symbol || index} 
                className="table-row-2025"
                onClick={() => setSelectedStock && setSelectedStock({
                  symbol: stock.symbol,
                  name: stock.name || stock.symbol,
                  price: currentPrice,
                  change: currentPrice - avgPrice,
                  changePercent: gainLossPercent.toFixed(2),
                  color: isPositive ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
                })}
              >
                <div className="table-cell-2025">
                  <div className="symbol-cell-2025">
                    <span className="symbol-text-2025">{stock.symbol}</span>
                    <span className="company-name-2025">{stock.name || stock.symbol}</span>
                  </div>
                </div>
                <div className="table-cell-2025">{shares.toLocaleString()}</div>
                <div className="table-cell-2025">${avgPrice.toFixed(2)}</div>
                <div className="table-cell-2025">${currentPrice.toFixed(2)}</div>
                <div className="table-cell-2025">${value.toLocaleString()}</div>
                <div className="table-cell-2025">
                  <div className={`gain-loss-cell-2025 ${isPositive ? 'positive-2025' : 'negative-2025'}`}>
                    <span>{isPositive ? '+' : ''}${gainLoss.toLocaleString()}</span>
                    <span className="gain-loss-percent-2025">
                      {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                    </span>
                  </div>
                </div>
                <div className="table-cell-2025">
                  <div className="weight-cell-2025">
                    <div className="weight-bar-2025">
                      <div 
                        className="weight-fill-2025" 
                        style={{width: `${Math.min(weight, 100)}%`}}
                      ></div>
                    </div>
                    <span className="weight-text-2025">{weight.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty State */}
          {(!portfolio.holdings || portfolio.holdings.length === 0) && (
            <div className="empty-state-2025">
              <div className="empty-icon-2025">📈</div>
              <div className="empty-title-2025">No Holdings Yet</div>
              <div className="empty-description-2025">
                Start building your portfolio by browsing and investing in stocks
              </div>
              <button className="empty-action-2025">
                <DollarSign size={16} />
                Browse Stocks
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;