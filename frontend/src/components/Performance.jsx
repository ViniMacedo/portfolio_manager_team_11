import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, PieChart, Target, DollarSign, Percent, Calendar, AlertTriangle } from 'lucide-react';

const Analytics = ({ portfolio, setSelectedStock }) => {
  // Calculate comprehensive analytics metrics
  const calculateMetrics = () => {
    if (!portfolio?.holdings || portfolio.holdings.length === 0) {
      return { 
        totalInvested: 0, 
        currentValue: 0, 
        totalReturn: 0, 
        dailyReturn: 0,
        weeklyReturn: 0,
        monthlyReturn: 0,
        ytdReturn: 0, 
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        beta: 0,
        dividendYield: 0
      };
    }

    const totalInvested = portfolio.holdings.reduce((sum, holding) => {
      const shares = holding.shares || holding.quantity || 0;
      const avgPrice = holding.avg_price || holding.average_cost || 0;
      return sum + (avgPrice * shares);
    }, 0);
    
    const currentValue = portfolio.holdings.reduce((sum, holding) => {
      const shares = holding.shares || holding.quantity || 0;
      const currentPrice = holding.current_price || holding.price || 0;
      return sum + (currentPrice * shares);
    }, 0);
    
    const totalReturn = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested * 100) : 0;
    
    // Simulate different time period returns (in real app, this would come from historical data)
    const dailyReturn = totalReturn * 0.05; // Approximate daily movement
    const weeklyReturn = totalReturn * 0.15;
    const monthlyReturn = totalReturn * 0.4;
    const ytdReturn = totalReturn * 0.8;
    
    const volatility = portfolio.holdings.length > 0 ? 
      portfolio.holdings.reduce((sum, holding) => {
        const currentPrice = holding.current_price || holding.price || 0;
        const avgPrice = holding.avg_price || holding.average_cost || currentPrice;
        const change = avgPrice > 0 ? Math.abs((currentPrice - avgPrice) / avgPrice * 100) : 0;
        return sum + change;
      }, 0) / portfolio.holdings.length : 0;

    // Advanced metrics (simulated for demo)
    const sharpeRatio = totalReturn > 0 ? (totalReturn / Math.max(volatility, 1)) * 0.1 : 0;
    const maxDrawdown = Math.abs(totalReturn) * 0.6; // Simulated max drawdown
    const beta = 0.85 + (Math.random() * 0.3); // Simulated beta vs market
    const dividendYield = portfolio.holdings.reduce((sum, holding) => {
      // Simulate dividend yield based on stock type
      const estimatedYield = Math.random() * 4; // 0-4% yield
      return sum + estimatedYield;
    }, 0) / Math.max(portfolio.holdings.length, 1);

    return { 
      totalInvested, 
      currentValue, 
      totalReturn, 
      dailyReturn,
      weeklyReturn, 
      monthlyReturn,
      ytdReturn, 
      volatility,
      sharpeRatio,
      maxDrawdown,
      beta,
      dividendYield
    };
  };

  const { 
    totalInvested, 
    currentValue, 
    totalReturn, 
    dailyReturn,
    weeklyReturn,
    monthlyReturn,
    ytdReturn, 
    volatility,
    sharpeRatio,
    maxDrawdown,
    beta,
    dividendYield
  } = calculateMetrics();

  return (
    <div className="dashboard-grid-2025">
      {/* Portfolio Analytics Header */}
      <div className="card-2025 portfolio-value-2025">
        <div className="value-header-2025">
          <div className="value-main-2025">
            <h2>📊 Portfolio Analytics</h2>
            <div className="value-amount-2025">
              ${currentValue.toLocaleString()}
            </div>
            <div className="value-change-2025">
              <span className={`change-badge-2025 ${totalReturn >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                {totalReturn >= 0 ? '▲' : '▼'} {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
              </span>
              <span className="change-amount-2025">
                {totalReturn >= 0 ? '+' : ''}${(currentValue - totalInvested).toLocaleString()} Total Return
              </span>
            </div>
          </div>
          <div className="live-indicator-2025">
            <div className="status-dot-2025"></div>
            <span>REAL-TIME</span>
          </div>
        </div>
      </div>

      {/* Time Period Returns */}
      <div className="card-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Calendar size={20} />
          Period Returns
        </h3>
        
        <div className="stats-grid-2025">
          <div className="stat-item-2025">
            <div className="stat-label-2025">1 Day</div>
            <div className={`stat-value-2025 ${dailyReturn >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {dailyReturn >= 0 ? '+' : ''}{dailyReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">1 Week</div>
            <div className={`stat-value-2025 ${weeklyReturn >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {weeklyReturn >= 0 ? '+' : ''}{weeklyReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">1 Month</div>
            <div className={`stat-value-2025 ${monthlyReturn >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {monthlyReturn >= 0 ? '+' : ''}{monthlyReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">YTD</div>
            <div className={`stat-value-2025 ${ytdReturn >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {ytdReturn >= 0 ? '+' : ''}{ytdReturn.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Risk Metrics */}
      <div className="card-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <AlertTriangle size={20} />
          Risk Analysis
        </h3>
        
        <div className="stats-grid-2025">
          <div className="stat-item-2025">
            <div className="stat-label-2025">Volatility</div>
            <div className="stat-value-2025 text-gradient-purple">
              {volatility.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">Sharpe Ratio</div>
            <div className="stat-value-2025 text-gradient-blue">
              {sharpeRatio.toFixed(2)}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">Max Drawdown</div>
            <div className="stat-value-2025 negative-2025">
              -{maxDrawdown.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">Beta</div>
            <div className="stat-value-2025 text-gradient-green">
              {beta.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Composition */}
      <div className="card-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <PieChart size={20} />
          Composition
        </h3>
        
        <div className="stats-grid-2025">
          <div className="stat-item-2025">
            <div className="stat-label-2025">Total Invested</div>
            <div className="stat-value-2025">
              ${totalInvested.toLocaleString()}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">Holdings Count</div>
            <div className="stat-value-2025 text-gradient-purple">
              {portfolio?.holdings?.length || 0}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">Avg. Dividend Yield</div>
            <div className="stat-value-2025 text-gradient-green">
              {dividendYield.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025">Portfolio Beta</div>
            <div className="stat-value-2025 text-gradient-blue">
              {beta.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Holdings Performance Analysis */}
      <div className="card-2025" style={{gridColumn: 'span 8'}}>
        <h3 style={{fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <BarChart3 size={20} />
          Holdings Performance Analysis
        </h3>
        
        <div className="movers-grid-2025">
          {portfolio?.holdings?.length > 0 ? (
            portfolio.holdings
              .sort((a, b) => {
                const currentPriceA = a.current_price || a.price || 0;
                const avgPriceA = a.avg_price || a.average_cost || currentPriceA;
                const currentPriceB = b.current_price || b.price || 0;
                const avgPriceB = b.avg_price || b.average_cost || currentPriceB;

                const perfA = avgPriceA > 0 ? (currentPriceA - avgPriceA) / avgPriceA : 0;
                const perfB = avgPriceB > 0 ? (currentPriceB - avgPriceB) / avgPriceB : 0;
                return perfB - perfA;
              })
              .map((stock, index) => {
                const currentPrice = stock.current_price || stock.price || 0;
                const avgPrice = stock.avg_price || stock.average_cost || currentPrice;
                const shares = stock.shares || stock.quantity || 0;
                const totalValue = currentPrice * shares;
                const totalCost = avgPrice * shares;
                const totalGainLoss = totalValue - totalCost;
                const changePercent = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice * 100).toFixed(2) : '0.00';
                const isPositive = totalGainLoss >= 0;
                
                const performanceIcons = ['🏆', '🥇', '🥈', '🥉', '📈', '📊'];
                
                return (
                  <div 
                    key={stock.symbol} 
                    className="mover-card-2025"
                    onClick={() => setSelectedStock && setSelectedStock({
                      symbol: stock.symbol,
                      name: stock.name || `${stock.symbol} Inc`,
                      price: currentPrice,
                      change: totalGainLoss,
                      changePercent: changePercent,
                      color: isPositive ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
                    })}
                  >
                    <div className="mover-header-2025">
                      <span className="mover-symbol-2025">
                        {performanceIcons[index] || '📊'} {stock.symbol}
                      </span>
                      <span className={`mover-change-2025 ${isPositive ? 'positive-2025' : 'negative-2025'}`}>
                        {isPositive ? '+' : ''}{changePercent}%
                      </span>
                    </div>
                    <div className="mover-price-2025">${currentPrice.toFixed(2)}</div>
                    <div className="mover-name-2025">
                      {shares} shares • ${totalValue.toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '12px', 
                      color: isPositive ? '#10b981' : '#ef4444',
                      fontWeight: '600',
                      marginTop: '8px'
                    }}>
                      {isPositive ? '+' : ''}${totalGainLoss.toLocaleString()} P&L
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="empty-state-2025" style={{gridColumn: 'span 4'}}>
              <div className="empty-icon-2025">📊</div>
              <div className="empty-title-2025">No Holdings Data</div>
              <div className="empty-description-2025">
                Add stocks to your portfolio to see detailed performance analytics
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Performance Summary */}
      <div className="card-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px'}}>
          <Target size={20} />
          Performance Summary
        </h3>
        
        <div className="performance-leaders-2025">
          <div className="leader-item-2025">
            <div className="leader-header-2025">
              <span className="leader-label-2025">Best Performer</span>
              <span className="leader-symbol-2025">
                {portfolio?.holdings?.length > 0 ? portfolio.holdings[0]?.symbol || 'N/A' : 'N/A'}
              </span>
            </div>
            <div className="leader-performance-2025 positive-2025">
              +{Math.max(...(portfolio?.holdings?.map(h => {
                const current = h.current_price || h.price || 0;
                const avg = h.avg_price || h.average_cost || current;
                return avg > 0 ? ((current - avg) / avg * 100) : 0;
              }) || [0])).toFixed(2)}%
            </div>
          </div>
          
          <div className="leader-item-2025">
            <div className="leader-header-2025">
              <span className="leader-label-2025">Worst Performer</span>
              <span className="leader-symbol-2025">
                {portfolio?.holdings?.length > 0 ? portfolio.holdings[portfolio.holdings.length - 1]?.symbol || 'N/A' : 'N/A'}
              </span>
            </div>
            <div className="leader-performance-2025 negative-2025">
              {Math.min(...(portfolio?.holdings?.map(h => {
                const current = h.current_price || h.price || 0;
                const avg = h.avg_price || h.average_cost || current;
                return avg > 0 ? ((current - avg) / avg * 100) : 0;
              }) || [0])).toFixed(2)}%
            </div>
          </div>
          
          <div className="leader-item-2025">
            <div className="leader-header-2025">
              <span className="leader-label-2025">Portfolio Correlation</span>
              <span className="leader-symbol-2025">vs S&P 500</span>
            </div>
            <div className="leader-performance-2025 text-gradient-blue">
              {(beta * 0.85).toFixed(2)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;