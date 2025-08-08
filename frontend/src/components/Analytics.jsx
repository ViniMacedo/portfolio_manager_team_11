import React from 'react';
import { TrendingUp, TrendingDown, BarChart3, Activity, PieChart, Target, DollarSign, Percent, Calendar, AlertTriangle, Brain, Sparkles } from 'lucide-react';
import { 
  formatCurrency, 
  formatPercentage, 
  generateAIInsights,
  calculatePortfolioVolatility,
  getMarketValue,
  getCostBasis,
  getShares,
  getCurrentPrice,
  calculateStockPerformance
} from '../utils/globalUtils';

const Analytics = ({ portfolio, portfolioData, setSelectedStock }) => {
  // Use real portfolio data passed from parent (same as Overview component)
  const totalValue = portfolioData?.totalValue || 0;
  const dayChange = portfolioData?.dayChange || 0;
  const dayChangePercent = portfolioData?.dayChangePercent || 0;
  const totalInvested = portfolioData?.totalInvested || 0;
  const totalReturn = totalInvested > 0 ? ((totalValue - totalInvested) / totalInvested) * 100 : 0;
  
  // For now, set time-based returns to 0 until we have historical data
  const dailyReturn = dayChangePercent; // Use real day change
  const weeklyReturn = 0; // Would come from real API data
  const monthlyReturn = 0; // Would come from real API data
  const ytdReturn = totalReturn; // Use actual total return as YTD

  // Calculate portfolio volatility from real holdings data
  const portfolioVolatility = calculatePortfolioVolatility(portfolio);
  
  // Real metrics calculation - no mock data
  const sharpeRatio = 0; // Would require risk-free rate and historical returns
  const maxDrawdown = 0; // Would require historical portfolio values
  const beta = 1.0; // Market neutral until real calculation
  const dividendYield = 0; // Would come from real dividend data

  // Metrics object for consistency
  const metrics = { 
    totalInvested, 
    currentValue: totalValue, 
    totalReturn, 
    dailyReturn,
    weeklyReturn, 
    monthlyReturn,
    ytdReturn, 
    volatility: portfolioVolatility,
    sharpeRatio,
    maxDrawdown,
    beta,
    dividendYield
  };

  const { 
    currentValue, 
    volatility
  } = metrics;

  const aiInsights = generateAIInsights(portfolio, { totalValue, totalCost: totalInvested, totalGainPercent: totalReturn });

  return (
    <div className="dashboard-grid-2025" style={{gap: 'var(--space-lg)', marginBottom: 'var(--space-lg)'}}>
      {/* Portfolio Analytics Header */}
      <div className="card-2025 portfolio-value-2025" style={{gridColumn: 'span 5', padding: 'var(--space-lg)', position: 'relative'}}>
        {/* Real-time indicator in top corner */}
        <div className="live-indicator-2025" style={{
          position: 'absolute',
          top: 'var(--space-lg)',
          right: 'var(--space-lg)',
          zIndex: 10
        }}>
          <div className="status-dot-2025"></div>
          <span>REAL-TIME</span>
        </div>
        
        <div className="value-header-2025">
          <div className="value-main-2025" style={{paddingRight: '100px'}}>
            <h2 style={{fontSize: 'var(--text-lg)', marginBottom: 'var(--space-sm)'}}>Portfolio Analytics</h2>
            <div className="value-amount-2025" style={{fontSize: 'var(--text-3xl)', marginBottom: 'var(--space-xs)'}}>
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
        </div>
      </div>

      {/* AI Insights for Analytics */}
      <div className="card-2025" style={{gridColumn: 'span 7', padding: 'var(--space-lg)'}}>
        <h3 style={{fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <Brain size={18} />
          AI Portfolio Analysis
          <Sparkles size={14} style={{color: 'var(--color-neon-purple)', marginLeft: '2px'}} />
        </h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-md)'}}>
          {aiInsights.map((insight, index) => (
            <div 
              key={index}
              className={`insight-card-2025 ${insight.type}`}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 'var(--radius-sm)',
                padding: 'var(--space-sm)',
                borderLeft: insight.type === 'success' ? '3px solid var(--color-neon-green)' :
                           insight.type === 'warning' ? '3px solid var(--color-neon-red)' :
                           '3px solid var(--color-neon-blue)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.06)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255, 255, 255, 0.03)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 'var(--space-xs)'}}>
                <span style={{fontSize: '16px', marginTop: '1px'}}>{insight.icon}</span>
                <div style={{flex: 1}}>
                  <div style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-semibold)',
                    color: 'white',
                    marginBottom: '2px'
                  }}>
                    {insight.title}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    lineHeight: '1.3'
                  }}>
                    {insight.message}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Chart */}
      <div className="card-2025" style={{gridColumn: 'span 8', padding: 'var(--space-lg)'}}>
        <h3 style={{fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <BarChart3 size={18} />
          Portfolio Performance Chart
        </h3>
        
        <div style={{position: 'relative', height: '300px', background: 'rgba(255, 255, 255, 0.02)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255, 255, 255, 0.05)'}}>
          {/* Chart Grid */}
          <div style={{position: 'absolute', inset: '20px', opacity: 0.3}}>
            {[...Array(5)].map((_, i) => (
              <div key={`h-${i}`} style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: `${i * 25}%`,
                height: '1px',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
              }} />
            ))}
            {[...Array(7)].map((_, i) => (
              <div key={`v-${i}`} style={{
                position: 'absolute',
                top: 0,
                bottom: 0,
                left: `${i * 16.66}%`,
                width: '1px',
                background: 'linear-gradient(180deg, transparent, rgba(255, 255, 255, 0.1), transparent)'
              }} />
            ))}
          </div>
          
          {/* Performance Line Chart */}
          <svg style={{position: 'absolute', inset: '20px', width: 'calc(100% - 40px)', height: 'calc(100% - 40px)', opacity: 0.7}} viewBox="0 0 300 200">
            <defs>
              <linearGradient id="performanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor: totalReturn >= 0 ? 'var(--color-neon-green)' : 'var(--color-neon-red)', stopOpacity: 0.3}} />
                <stop offset="100%" style={{stopColor: totalReturn >= 0 ? 'var(--color-neon-green)' : 'var(--color-neon-red)', stopOpacity: 0.05}} />
              </linearGradient>
            </defs>
            <path
              d={`M 10 ${150 + (totalReturn * -0.5)} Q 50 ${140 + (dailyReturn * -2)} 80 ${135 + (weeklyReturn * -1)} T 150 ${130 + (monthlyReturn * -1)} Q 200 ${125 + (ytdReturn * -0.3)} 250 ${120 + (totalReturn * -0.5)} T 290 ${115 + (totalReturn * -0.4)}`}
              stroke={totalReturn >= 0 ? 'var(--color-neon-green)' : 'var(--color-neon-red)'}
              strokeWidth="2"
              fill="none"
              style={{filter: 'drop-shadow(0 0 4px currentColor)'}}
            />
            <path
              d={`M 10 ${150 + (totalReturn * -0.5)} Q 50 ${140 + (dailyReturn * -2)} 80 ${135 + (weeklyReturn * -1)} T 150 ${130 + (monthlyReturn * -1)} Q 200 ${125 + (ytdReturn * -0.3)} 250 ${120 + (totalReturn * -0.5)} T 290 ${115 + (totalReturn * -0.4)} L 290 200 L 10 200 Z`}
              fill="url(#performanceGradient)"
            />
          </svg>
          
          {/* Chart Labels */}
          <div style={{position: 'absolute', bottom: '5px', left: '20px', right: '20px', display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)'}}>
            <span>1D</span>
            <span>1W</span>
            <span>1M</span>
            <span>3M</span>
            <span>6M</span>
            <span>YTD</span>
            <span>1Y</span>
          </div>
          
          {/* Performance Indicator */}
          <div style={{position: 'absolute', top: '20px', right: '20px', background: 'rgba(0, 0, 0, 0.4)', padding: '8px 12px', borderRadius: '6px', backdropFilter: 'blur(10px)'}}>
            <div style={{fontSize: '12px', color: 'rgba(255, 255, 255, 0.7)'}}>Total Return</div>
            <div style={{fontSize: '18px', fontWeight: 'bold', color: totalReturn >= 0 ? 'var(--color-neon-green)' : 'var(--color-neon-red)', fontFamily: 'JetBrains Mono, monospace'}}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      {/* Asset Allocation Pie Chart */}
      <div className="card-2025" style={{gridColumn: 'span 4', padding: 'var(--space-lg)'}}>
        <h3 style={{fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <PieChart size={18} />
          Asset Allocation
        </h3>
        
        <div style={{position: 'relative', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {portfolio?.holdings?.length > 0 ? (
            <>
              {/* Pie Chart Visualization */}
              <div style={{position: 'relative', width: '160px', height: '160px'}}>
                <svg width="160" height="160" style={{transform: 'rotate(-90deg)'}}>
                  {portfolio.holdings.map((holding, index) => {
                    const marketValue = getMarketValue(holding);
                    const percentage = totalValue > 0 ? (marketValue / totalValue) * 100 : 0;
                    const angle = (percentage / 100) * 360;
                    const startAngle = portfolio.holdings.slice(0, index).reduce((sum, h) => {
                      const val = getMarketValue(h);
                      return sum + ((val / totalValue) * 360);
                    }, 0);
                    
                    const startAngleRad = (startAngle * Math.PI) / 180;
                    const endAngleRad = ((startAngle + angle) * Math.PI) / 180;
                    
                    const largeArcFlag = angle > 180 ? 1 : 0;
                    const x1 = 80 + 70 * Math.cos(startAngleRad);
                    const y1 = 80 + 70 * Math.sin(startAngleRad);
                    const x2 = 80 + 70 * Math.cos(endAngleRad);
                    const y2 = 80 + 70 * Math.sin(endAngleRad);
                    
                    const pathData = [
                      `M 80 80`,
                      `L ${x1} ${y1}`,
                      `A 70 70 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                      'Z'
                    ].join(' ');
                    
                    const colors = ['var(--color-neon-blue)', 'var(--color-neon-green)', 'var(--color-neon-purple)', 'var(--color-neon-yellow)', 'var(--color-neon-red)'];
                    
                    return (
                      <path
                        key={holding.symbol}
                        d={pathData}
                        fill={colors[index % colors.length]}
                        opacity={0.7}
                        stroke="rgba(255, 255, 255, 0.1)"
                        strokeWidth="1"
                      />
                    );
                  })}
                </svg>
                
                {/* Center Label */}
                <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                  <div style={{fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)'}}>Portfolio</div>
                  <div style={{fontSize: '14px', fontWeight: 'bold', color: 'white'}}>{portfolio.holdings.length}</div>
                  <div style={{fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)'}}>Holdings</div>
                </div>
              </div>
              
              {/* Legend */}
              <div style={{position: 'absolute', top: 0, right: 0, maxHeight: '200px', overflowY: 'auto'}}>
                {portfolio.holdings.slice(0, 5).map((holding, index) => {
                  const marketValue = getMarketValue(holding);
                  const percentage = totalValue > 0 ? (marketValue / totalValue) * 100 : 0;
                  const colors = ['var(--color-neon-blue)', 'var(--color-neon-green)', 'var(--color-neon-purple)', 'var(--color-neon-yellow)', 'var(--color-neon-red)'];
                  
                  return (
                    <div key={holding.symbol} style={{display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px'}}>
                      <div style={{width: '8px', height: '8px', borderRadius: '50%', background: colors[index % colors.length]}} />
                      <div style={{fontSize: '11px'}}>
                        <div style={{color: 'white', fontWeight: '600'}}>{holding.symbol}</div>
                        <div style={{color: 'rgba(255, 255, 255, 0.6)'}}>{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  );
                })}
                {portfolio.holdings.length > 5 && (
                  <div style={{fontSize: '11px', color: 'rgba(255, 255, 255, 0.5)', marginTop: '4px'}}>
                    +{portfolio.holdings.length - 5} more
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{textAlign: 'center', color: 'rgba(255, 255, 255, 0.6)'}}>
              <PieChart size={48} style={{marginBottom: '8px', opacity: 0.5}} />
              <div style={{fontSize: '12px'}}>No holdings to display</div>
            </div>
          )}
        </div>
      </div>
      <div className="card-2025" style={{gridColumn: 'span 6', padding: 'var(--space-lg)'}}>
        <h3 style={{fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <Calendar size={18} />
          Period Returns
        </h3>
        
        <div className="stats-grid-2025" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)'}}>
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>1 Day</div>
            <div className={`stat-value-2025 ${dailyReturn >= 0 ? 'positive-2025' : 'negative-2025'}`} style={{fontSize: 'var(--text-sm)'}}>
              {dailyReturn >= 0 ? '+' : ''}{dailyReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>1 Week</div>
            <div className={`stat-value-2025 ${weeklyReturn >= 0 ? 'positive-2025' : 'negative-2025'}`} style={{fontSize: 'var(--text-sm)'}}>
              {weeklyReturn >= 0 ? '+' : ''}{weeklyReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>1 Month</div>
            <div className={`stat-value-2025 ${monthlyReturn >= 0 ? 'positive-2025' : 'negative-2025'}`} style={{fontSize: 'var(--text-sm)'}}>
              {monthlyReturn >= 0 ? '+' : ''}{monthlyReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>YTD</div>
            <div className={`stat-value-2025 ${ytdReturn >= 0 ? 'positive-2025' : 'negative-2025'}`} style={{fontSize: 'var(--text-sm)'}}>
              {ytdReturn >= 0 ? '+' : ''}{ytdReturn.toFixed(2)}%
            </div>
          </div>
        </div>
      </div>

      <div className="card-2025" style={{gridColumn: 'span 6', padding: 'var(--space-lg)'}}>
        <h3 style={{fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <AlertTriangle size={18} />
          Risk Analysis
        </h3>
        
        <div className="stats-grid-2025" style={{gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)'}}>
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Volatility</div>
            <div className="stat-value-2025 text-gradient-purple" style={{fontSize: 'var(--text-sm)'}}>
              {volatility.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Sharpe Ratio</div>
            <div className="stat-value-2025 text-gradient-blue" style={{fontSize: 'var(--text-sm)'}}>
              {sharpeRatio.toFixed(2)}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Max Drawdown</div>
            <div className="stat-value-2025 negative-2025" style={{fontSize: 'var(--text-sm)'}}>
              -{maxDrawdown.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Beta</div>
            <div className="stat-value-2025 text-gradient-green" style={{fontSize: 'var(--text-sm)'}}>
              {beta.toFixed(2)}
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Composition - Compact */}
      <div className="card-2025" style={{gridColumn: 'span 12', padding: 'var(--space-lg)'}}>
        <h3 style={{fontSize: 'var(--text-base)', marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '6px'}}>
          <PieChart size={18} />
          Portfolio Summary & Holdings Performance
        </h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)'}}>
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Total Invested</div>
            <div className="stat-value-2025" style={{fontSize: 'var(--text-sm)'}}>
              ${totalInvested.toLocaleString()}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Current Value</div>
            <div className="stat-value-2025 text-gradient-blue" style={{fontSize: 'var(--text-sm)'}}>
              ${currentValue.toLocaleString()}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Holdings</div>
            <div className="stat-value-2025 text-gradient-purple" style={{fontSize: 'var(--text-sm)'}}>
              {portfolio?.holdings?.length || 0}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Avg. Dividend</div>
            <div className="stat-value-2025 text-gradient-green" style={{fontSize: 'var(--text-sm)'}}>
              {dividendYield.toFixed(2)}%
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Best Performer</div>
            <div className="stat-value-2025 positive-2025" style={{fontSize: 'var(--text-sm)'}}>
              {portfolio?.holdings?.length > 0 ? (() => {
                // Find actual best performer by gain/loss percentage
                const sortedHoldings = [...portfolio.holdings].sort((a, b) => {
                  const { gainLossPercent: perfA } = calculateStockPerformance(a);
                  const { gainLossPercent: perfB } = calculateStockPerformance(b);
                  return perfB - perfA;
                });
                const bestPerformer = sortedHoldings[0];
                const { gainLossPercent } = calculateStockPerformance(bestPerformer);
                return `${bestPerformer.symbol || 'N/A'} (+${gainLossPercent.toFixed(1)}%)`;
              })() : 'N/A'}
            </div>
          </div>
          
          <div className="stat-item-2025">
            <div className="stat-label-2025" style={{fontSize: '11px'}}>Portfolio Beta</div>
            <div className="stat-value-2025 text-gradient-blue" style={{fontSize: 'var(--text-sm)'}}>
              {beta.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Holdings Performance Analysis - Optimized */}
        {portfolio?.holdings?.length > 0 ? (
          <div className="movers-grid-2025" style={{gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-md)'}}>
            {portfolio.holdings
              .sort((a, b) => {
                const { gainLossPercent: perfA } = calculateStockPerformance(a);
                const { gainLossPercent: perfB } = calculateStockPerformance(b);
                return perfB - perfA;
              })
              .map((stock, index) => {
                const marketValue = getMarketValue(stock);
                const costBasis = getCostBasis(stock);
                const { gainLoss: totalGainLoss, gainLossPercent } = calculateStockPerformance(stock);
                const shares = getShares(stock);
                const currentPrice = getCurrentPrice(stock);
                const isPositive = totalGainLoss >= 0;
                
                return (
                  <div 
                    key={stock.symbol} 
                    className="mover-card-2025"
                    style={{padding: 'var(--space-md)'}}
                    onClick={() => setSelectedStock && setSelectedStock({
                      symbol: stock.symbol,
                      name: stock.name || `${stock.symbol} Inc`,
                      price: currentPrice,
                      change: totalGainLoss,
                      changePercent: gainLossPercent,
                      color: isPositive ? 'from-green-400 to-green-600' : 'from-red-400 to-red-600'
                    })}
                  >
                    <div className="mover-header-2025">
                      <span className="mover-symbol-2025" style={{fontSize: 'var(--text-sm)'}}>
                        {stock.symbol}
                      </span>
                      <span className={`mover-change-2025 ${isPositive ? 'positive-2025' : 'negative-2025'}`} style={{fontSize: 'var(--text-xs)'}}>
                        {isPositive ? '+' : ''}{gainLossPercent.toFixed(2)}%
                      </span>
                    </div>
                    <div className="mover-price-2025" style={{fontSize: 'var(--text-base)'}}>${currentPrice.toFixed(2)}</div>
                    <div className="mover-name-2025" style={{fontSize: '11px'}}>
                      {shares} shares • ${marketValue.toLocaleString()}
                    </div>
                    <div style={{
                      fontSize: '11px', 
                      color: isPositive ? '#10b981' : '#ef4444',
                      fontWeight: '600',
                      marginTop: '6px'
                    }}>
                      {isPositive ? '+' : ''}${totalGainLoss.toLocaleString()} P&L
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="empty-state-2025">
            <div className="empty-icon-2025">Analytics</div>
            <div className="empty-title-2025">No Holdings Data</div>
            <div className="empty-description-2025">
              Add stocks to your portfolio to see detailed performance analytics
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;