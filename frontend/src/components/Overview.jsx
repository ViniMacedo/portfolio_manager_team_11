import React, { useState, useEffect } from 'react';
import { Zap, Eye, Download, Share } from 'lucide-react';
import { exportPortfolioToCSV, sharePortfolioLink } from '../utils/exportUtils';
import { fetchStockBySymbol } from '../services/api';
import { 
  formatCurrency, 
  formatPercentage, 
  safeNumber, 
  calculatePortfolioMetrics,
  isMarketOpen,
  getCurrentTimestamp 
} from '../utils/globalUtils';

const Overview = ({ portfolioData, portfolio, setActiveTab }) => {
  const [marketMovers, setMarketMovers] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [portfolioInsights, setPortfolioInsights] = useState({});
  const [chartData, setChartData] = useState([]);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);

  // Calculate portfolio metrics
  const totalValue = safeNumber(portfolioData.totalValue, 0);
  const dayChange = safeNumber(portfolioData.dayChange, 0);
  const dayChangePercent = safeNumber(portfolioData.dayChangePercent, 0);
  const totalHoldings = portfolio?.holdings?.length || 0;

  // Fetch market movers data on component mount
  useEffect(() => {
    const fetchMarketMovers = async () => {
      const popularSymbols = ['PLTR', 'AMD', 'COIN', 'RBLX', 'META']; // for poc, should be dynamic in real app
      const moversData = [];

      for (const symbol of popularSymbols) {
        try {
          const stockData = await fetchStockBySymbol(symbol);
          moversData.push({
            symbol: symbol,
            name: stockData.name || `${symbol} Inc`,
            price: stockData.price || 0,
            change: stockData.change || 0,
            changePercent: stockData.changePercent || 0
          });
        } catch (error) {
          console.error(`Failed to fetch market mover data for ${symbol}:`, error);
        }
      }
      setMarketMovers(moversData);
    };

    fetchMarketMovers();
  }, []);

  // Calculate portfolio insights
  useEffect(() => {
    if (!portfolio.holdings || portfolio.holdings.length === 0) return;

    const calculateInsights = async () => {
      let bestPerformer = null;
      let worstPerformer = null;
      let maxGain = -Infinity;
      let maxLoss = Infinity;

      // Get current prices for all holdings and calculate performance
      for (const holding of portfolio.holdings) {
        try {
          const currentPrice = holding.current_price || 0;
          const avgPrice = safeNumber(holding.avg_price, 0);
          const performancePercent = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;
          const symbol = holding.product_symbol || holding.symbol || 'Unknown';

          if (performancePercent > maxGain) {
            maxGain = performancePercent;
            bestPerformer = { ...holding, performancePercent, product_symbol: symbol };
          }

          if (performancePercent < maxLoss) {
            maxLoss = performancePercent;
            worstPerformer = { ...holding, performancePercent, product_symbol: symbol };
          }
        } catch (error) {
          console.error(`Error calculating performance for ${holding.product_symbol || 'unknown holding'}:`, error);
        }
      }

      setPortfolioInsights({
        bestPerformer,
        worstPerformer,
        diversificationScore: Math.min(10, totalHoldings * 1.2), // Simplified diversification calculation
        riskScore: totalHoldings > 5 ? 'Low' : totalHoldings > 2 ? 'Medium' : 'High'
      });
    };

    calculateInsights();
  }, [portfolio.holdings, totalHoldings]);

  // Generate chart data based on portfolio performance and holdings
  useEffect(() => {
    // Create more realistic chart data based on actual portfolio data
    const generateChartData = () => {
      const baseValue = Math.max(totalValue * 0.8, 10000); // Start from 80% of current value
      const volatility = Math.min(Math.max(totalHoldings * 0.02, 0.05), 0.15); // Volatility based on diversification
      const trend = dayChangePercent > 0 ? 1.02 : 0.98; // Slight upward/downward trend
      
      const data = [];
      let currentValue = baseValue;
      
      // Generate 15 data points representing the last 15 days
      for (let i = 0; i < 15; i++) {
        // Add some realistic volatility
        const randomChange = (Math.random() - 0.5) * volatility;
        const trendAdjustment = Math.pow(trend, i * 0.1);
        
        currentValue = currentValue * (1 + randomChange) * trendAdjustment;
        
        // Calculate height percentage for chart display (35-98%)
        const heightPercent = Math.min(98, Math.max(35, (currentValue / (totalValue * 1.2)) * 100));
        
        // Create date for tooltip (15 days ago to today)
        const date = new Date();
        date.setDate(date.getDate() - (14 - i));
        
        data.push({
          value: currentValue,
          height: heightPercent,
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          change: i > 0 ? ((currentValue - data[i - 1]?.value) / data[i - 1]?.value * 100) : 0,
          dayIndex: i
        });
      }
      
      return data;
    };

    setChartData(generateChartData());
  }, [dayChangePercent, totalValue, totalHoldings]);

  return (
    <div className="dashboard-grid-2025">
      {/* Top Row - Portfolio Value (Large Card) and AI Insights */}
      <div className="card-2025 portfolio-value-2025" style={{gridColumn: 'span 8'}}>
        <div className="value-header-2025">
          <div className="value-main-2025">
            <h3 className="section-title-2025">Portfolio Value</h3>
            <div className="value-amount-2025">{formatCurrency(totalValue)}</div>
            <div className="value-change-2025">
              <span className={`change-badge-2025 ${dayChangePercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                {dayChangePercent >= 0 ? '↑' : '↓'} {formatPercentage(Math.abs(dayChangePercent))}
              </span>
              <span className="change-amount-2025">
                {dayChangePercent >= 0 ? '+' : ''}{formatCurrency(dayChange)} Today
              </span>
            </div>
          </div>
          <div className={`live-indicator-2025 ${!isMarketOpen() ? 'closed' : ''}`}>
            <div className={`status-dot-2025 ${isMarketOpen() ? 'live' : 'closed'}`}></div>
            <span>{isMarketOpen() ? 'LIVE' : 'CLOSED'}</span>
          </div>
        </div>
        
        {/* Mini Chart */}
        <div className="mini-chart-2025" style={{ position: 'relative' }}>
          {chartData.map((dataPoint, index) => (
            <div 
              key={index}
              className="chart-bar-2025" 
              style={{ 
                height: `${dataPoint.height}%`,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={() => setHoveredBarIndex(index)}
              onMouseLeave={() => setHoveredBarIndex(null)}
            />
          ))}
          
          {/* Single tooltip container positioned relative to entire chart */}
          {hoveredBarIndex !== null && (
            <div 
              className="chart-tooltip"
              style={{
                position: 'absolute',
                bottom: '100%',
                left: `${(hoveredBarIndex / (chartData.length - 1)) * 100}%`,
                transform: hoveredBarIndex < 3 ? 'translateX(0%)' : 
                          hoveredBarIndex > chartData.length - 4 ? 'translateX(-100%)' : 
                          'translateX(-50%)',
                background: 'rgba(0, 0, 0, 0.9)',
                color: 'white',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                whiteSpace: 'nowrap',
                zIndex: 10,
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                marginBottom: '5px',
                pointerEvents: 'none'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {chartData[hoveredBarIndex]?.date}
              </div>
              <div style={{ color: '#10b981' }}>
                Value: {formatCurrency(chartData[hoveredBarIndex]?.value)}
              </div>
              <div style={{ 
                color: chartData[hoveredBarIndex]?.change >= 0 ? '#10b981' : '#ef4444',
                fontSize: '11px'
              }}>
                {chartData[hoveredBarIndex]?.change >= 0 ? '+' : ''}{chartData[hoveredBarIndex]?.change?.toFixed(2)}%
              </div>
              {/* Tooltip arrow */}
              <div 
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: hoveredBarIndex < 3 ? '20px' : 
                        hoveredBarIndex > chartData.length - 4 ? 'calc(100% - 20px)' : 
                        '50%',
                  transform: hoveredBarIndex < 3 ? 'translateX(0%)' : 
                            hoveredBarIndex > chartData.length - 4 ? 'translateX(-100%)' : 
                            'translateX(-50%)',
                  width: 0,
                  height: 0,
                  borderLeft: '4px solid transparent',
                  borderRight: '4px solid transparent',
                  borderTop: '4px solid rgba(0, 0, 0, 0.9)'
                }}
              />
            </div>
          )}
        </div>

        {/* Bottom Metrics */}
        <div className="metrics-grid-2025">
          <div className="metric-card-2025">
            <div className="metric-label-2025">24h Change</div>
            <div className={`metric-value-2025 ${dayChangePercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {dayChangePercent >= 0 ? '+' : ''}{formatCurrency(dayChange)}
            </div>
          </div>
          <div className="metric-card-2025">
            <div className="metric-label-2025">Best Performer</div>
            <div className="metric-value-2025 text-gradient-blue">
              {portfolioInsights.bestPerformer ? 
                `${portfolioInsights.bestPerformer.product_symbol} ${formatPercentage(portfolioInsights.bestPerformer.performancePercent)}` : 
                'Loading...'
              }
            </div>
          </div>
          <div className="metric-card-2025">
            <div className="metric-label-2025">Risk Score</div>
            <div className="metric-value-2025 text-gradient-purple">
              {portfolioInsights.riskScore || 'Medium'} {portfolioInsights.diversificationScore?.toFixed(1) || '5.0'}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights - Right side */}
      <div className="card-2025 ai-insights-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>🤖 AI Insights</h3>
        
        <div className="insight-card-2025 success">
          <div className="insight-title-2025 positive-2025">Portfolio Health</div>
          <div className="insight-text-2025">
            {totalHoldings > 3 ? 
              `Well diversified with ${totalHoldings} holdings. Good risk management.` :
              `Consider diversifying beyond ${totalHoldings} holdings for better risk distribution.`
            }
          </div>
        </div>

        <div className="insight-card-2025 warning">
          <div className="insight-title-2025" style={{color: 'var(--color-neon-yellow)'}}>
            {dayChangePercent < -2 ? 'Risk Alert' : 'Market Trend'}
          </div>
          <div className="insight-text-2025">
            {dayChangePercent < -2 ? 
              'Portfolio down today. Consider reviewing positions.' :
              'Market conditions favorable. Good time for strategic moves.'
            }
          </div>
        </div>

        <div className="insight-card-2025 info">
          <div className="insight-title-2025" style={{color: 'var(--color-neon-purple)'}}>Performance</div>
          <div className="insight-text-2025">
            {portfolioInsights.bestPerformer ? 
              `${portfolioInsights.bestPerformer.product_symbol} leading gains at ${formatPercentage(portfolioInsights.bestPerformer.performancePercent)}.` :
              'Analyzing portfolio performance...'
            }
          </div>
        </div>

        <div className="insight-card-2025 info">
          <div className="insight-title-2025" style={{color: 'var(--color-neon-blue)'}}>Market Status</div>
          <div className="insight-text-2025">
            Market is currently {isMarketOpen() ? 'open' : 'closed'}. Last updated: {getCurrentTimestamp()}.
          </div>
        </div>
      </div>

      {/* Second Row - Top Holdings */}
      <div className="card-2025 holdings-card-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>📊 Top Holdings</h3>

        {portfolio.holdings && portfolio.holdings.length > 0 ? (
          portfolio.holdings.slice(0, 3).map((holding, index) => {
            const currentPrice = safeNumber(holding.current_price, 0);
            const avgPrice = safeNumber(holding.avg_price, 0);
            const quantity = safeNumber(holding.qty, 0);
            const value = currentPrice * quantity;
            const performancePercent = avgPrice > 0 ? ((currentPrice - avgPrice) / avgPrice) * 100 : 0;
            const symbol = holding.product_symbol || holding.symbol || 'N/A';
            
            return (
              <div key={symbol} className="holding-item-2025">
                <div className="holding-left-2025">
                  <div className="holding-icon-2025" style={{
                    background: index === 0 ? 'linear-gradient(135deg, #10b981, #059669)' :
                              index === 1 ? 'linear-gradient(135deg, #3b82f6, #2563eb)' :
                              'linear-gradient(135deg, #8b5cf6, #7c3aed)'
                  }}>
                    {symbol.charAt(0)}
                  </div>
                  <div className="holding-info-2025">
                    <h4>{symbol}</h4>
                    <p>{quantity.toLocaleString()} shares</p>
                  </div>
                </div>
                <div className="holding-value-2025">
                  <div className="holding-price-2025">{formatCurrency(value)}</div>
                  <div className={`holding-change-2025 ${performancePercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                    {formatPercentage(performancePercent)}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8" style={{color: 'rgba(255, 255, 255, 0.6)'}}>
            <p>No holdings found</p>
            <button 
              onClick={() => setActiveTab('browse')}
              className="action-button-2025 mt-4 px-4 py-2"
            >
              Start Trading
            </button>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card-2025 quick-actions-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>⚡ Quick Actions</h3>
        
        <div className="actions-grid-2025">
          <div className="action-btn-2025" onClick={() => setActiveTab('browse')}>
            <div className="action-icon-2025" style={{background: 'linear-gradient(135deg, #10b981, #059669)'}}>
              <Eye size={20} />
            </div>
            <div className="action-label-2025">Browse Stocks</div>
          </div>
          <div className="action-btn-2025" onClick={() => exportPortfolioToCSV(portfolio, portfolioData)}>
            <div className="action-icon-2025" style={{background: 'linear-gradient(135deg, #3b82f6, #2563eb)'}}>
              <Download size={20} />
            </div>
            <div className="action-label-2025">Export</div>
          </div>
          <div className="action-btn-2025" onClick={() => sharePortfolioLink(portfolio, portfolioData)}>
            <div className="action-icon-2025" style={{background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)'}}>
              <Share size={20} />
            </div>
            <div className="action-label-2025">Share</div>
          </div>
          <div className="action-btn-2025" onClick={() => setActiveTab('ai-insights')}>
            <div className="action-icon-2025" style={{background: 'linear-gradient(135deg, #f59e0b, #d97706)'}}>
              <Zap size={20} />
            </div>
            <div className="action-label-2025">AI Insights</div>
          </div>
        </div>
      </div>

      {/* Performance */}
      <div className="card-2025 performance-card-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>📈 Performance</h3>
        
        <div className="performance-item-2025">
          <div className="performance-header-2025">
            <span className="performance-label-2025">Daily Return</span>
            <span className={`performance-value-2025 ${dayChangePercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {formatPercentage(dayChangePercent)}
            </span>
          </div>
          <div className="performance-bar-2025">
            <div className="performance-fill-2025" style={{
              width: `${Math.min(95, Math.max(5, 50 + dayChangePercent * 2))}%`, 
              background: dayChangePercent >= 0 ? 
                'linear-gradient(90deg, #10b981, #059669)' : 
                'linear-gradient(90deg, #ef4444, #dc2626)'
            }}></div>
          </div>
        </div>

        <div className="performance-item-2025">
          <div className="performance-header-2025">
            <span className="performance-label-2025">Portfolio Value</span>
            <span className="performance-value-2025" style={{color: 'var(--color-neon-blue)'}}>
              {formatCurrency(totalValue)}
            </span>
          </div>
          <div className="performance-bar-2025">
            <div className="performance-fill-2025" style={{
              width: `${Math.min(95, Math.max(10, (totalValue / 200000) * 100))}%`, 
              background: 'linear-gradient(90deg, #3b82f6, #2563eb)'
            }}></div>
          </div>
        </div>

        <div className="performance-item-2025">
          <div className="performance-header-2025">
            <span className="performance-label-2025">Holdings Count</span>
            <span className="performance-value-2025" style={{color: 'var(--color-neon-purple)'}}>
              {totalHoldings} stocks
            </span>
          </div>
          <div className="performance-bar-2025">
            <div className="performance-fill-2025" style={{
              width: `${Math.min(95, Math.max(10, (totalHoldings / 10) * 100))}%`, 
              background: 'linear-gradient(90deg, #8b5cf6, #7c3aed)'
            }}></div>
          </div>
        </div>

        <div className="performance-item-2025">
          <div className="performance-header-2025">
            <span className="performance-label-2025">Risk Level</span>
            <span className="performance-value-2025" style={{color: 'var(--color-neon-yellow)'}}>
              {portfolioInsights.riskScore || 'Medium'}
            </span>
          </div>
          <div className="performance-bar-2025">
            <div className="performance-fill-2025" style={{
              width: `${
                portfolioInsights.riskScore === 'Low' ? '85%' : 
                portfolioInsights.riskScore === 'Medium' ? '65%' : '40%'
              }`, 
              background: 'linear-gradient(90deg, #f59e0b, #d97706)'
            }}></div>
          </div>
        </div>
      </div>

      {/* Market Movers - Full Width */}
      <div className="card-2025 market-movers-2025" style={{gridColumn: 'span 12'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>🚀 Market Movers</h3>
        
        <div className="movers-grid-2025">
          {marketMovers.length > 0 ? (
            marketMovers.map((stock) => (
              <div key={stock.symbol} className="mover-card-2025">
                <div className="mover-header-2025">
                  <span className="mover-symbol-2025">{stock.symbol}</span>
                  <span className={`mover-change-2025 ${stock.changePercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                    {formatPercentage(stock.changePercent)}
                  </span>
                </div>
                <div className="mover-price-2025">{formatCurrency(stock.price)}</div>
                <div className="mover-name-2025">{stock.name}</div>
              </div>
            ))
          ) : (
            // Loading state with placeholders
            ['PLTR', 'AMD', 'COIN', 'RBLX', 'META'].map((symbol) => (
              <div key={symbol} className="mover-card-2025">
                <div className="mover-header-2025">
                  <span className="mover-symbol-2025">{symbol}</span>
                  <span className="mover-change-2025">Loading...</span>
                </div>
                <div className="mover-price-2025">--</div>
                <div className="mover-name-2025">Loading...</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
