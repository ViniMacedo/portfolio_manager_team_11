import React, { useMemo } from 'react';
import { Eye, Plus, TrendingUp, TrendingDown, Star, Brain, Zap, Target } from 'lucide-react';
import { 
  generateAIInsights, 
  calculatePortfolioMetrics,
  calculatePortfolioVolatility,
  calculatePortfolioConcentration,
  formatCurrency,
  formatPercentage
} from '../utils/globalUtils';

const AIInsights = ({ portfolio, portfolioData, watchlist, setSelectedStock, setActiveTab }) => {
  // Memoize portfolio metrics calculation
  const portfolioMetrics = useMemo(() => {
    return portfolioData ? {
      totalValue: portfolioData.totalValue || 0,
      totalCost: portfolioData.totalInvested || 0,
      totalGainPercent: portfolioData.totalInvested > 0 ? 
        ((portfolioData.totalValue - portfolioData.totalInvested) / portfolioData.totalInvested) * 100 : 0,
      holdingsCount: portfolio?.holdings?.length || 0
    } : calculatePortfolioMetrics(portfolio);
  }, [portfolio, portfolioData]);

  // Memoize AI insights generation to prevent recalculation on every render
  const aiInsights = useMemo(() => {
    return generateAIInsights(portfolio, portfolioMetrics);
  }, [portfolio, portfolioMetrics]);

  // Memoize expensive calculations
  const volatility = useMemo(() => calculatePortfolioVolatility(portfolio), [portfolio]);
  const concentration = useMemo(() => calculatePortfolioConcentration(portfolio), [portfolio]);
  
  // Calculate real portfolio score based on multiple factors
  const calculatePortfolioScore = () => {
    if (!portfolio?.holdings?.length) return 0;
    
    let score = 5; // Base score
    
    // Performance factor
    if (portfolioMetrics.totalGainPercent > 20) score += 2;
    else if (portfolioMetrics.totalGainPercent > 0) score += 1;
    else if (portfolioMetrics.totalGainPercent < -20) score -= 2;
    else if (portfolioMetrics.totalGainPercent < 0) score -= 1;
    
    // Diversification factor
    if (portfolioMetrics.holdingsCount >= 5) score += 1;
    else if (portfolioMetrics.holdingsCount === 1) score -= 2;
    
    // Volatility factor
    if (volatility < 20) score += 1;
    else if (volatility > 50) score -= 1;
    
    // Concentration factor
    if (concentration < 30) score += 1;
    else if (concentration > 60) score -= 1;
    
    return Math.max(0, Math.min(10, score));
  };

  const portfolioScore = calculatePortfolioScore();
  
  // Generate real recommendations based on portfolio analysis
  const generateRecommendations = () => {
    const recommendations = [];
    
    if (concentration > 50) {
      recommendations.push({
        icon: '',
        title: 'Rebalance Suggestion',
        text: `Portfolio is ${concentration.toFixed(1)}% concentrated. Consider diversifying across more holdings.`
      });
    }
    
    if (portfolioMetrics.holdingsCount < 5) {
      recommendations.push({
        icon: '',
        title: 'Diversification',
        text: `Add more holdings to reduce risk. Consider different sectors or asset classes.`
      });
    }
    
    if (volatility > 40) {
      recommendations.push({
        icon: '',
        title: 'Risk Management',
        text: `High volatility detected (${volatility.toFixed(1)}%). Consider adding stable assets.`
      });
    } else if (volatility < 15 && portfolioMetrics.totalGainPercent < 5) {
      recommendations.push({
        icon: '',
        title: 'Growth Opportunity',
        text: `Low volatility suggests room for growth investments if risk tolerance allows.`
      });
    }
    
    // If no specific recommendations, provide general advice
    if (recommendations.length === 0) {
      recommendations.push({
        icon: '',
        title: 'Portfolio Health',
        text: 'Portfolio appears well-balanced. Continue monitoring for optimization opportunities.'
      });
    }
    
    return recommendations.slice(0, 3);
  };

  const recommendations = generateRecommendations();
  return (
    <div className="dashboard-grid-2025">
      {/* AI Insights - Main Section */}
      <div className="card-2025 ai-insights-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>AI Insights</h3>
        
        {aiInsights.length > 0 ? (
          aiInsights.map((insight, index) => (
            <div key={index} className={`insight-card-2025 ${insight.type}`}>
              <div className={`insight-title-2025 ${
                insight.type === 'success' ? 'positive-2025' : 
                insight.type === 'warning' ? '' : ''
              }`} style={{
                color: insight.type === 'warning' ? 'var(--color-neon-yellow)' :
                       insight.type === 'info' ? 'var(--color-neon-blue)' : ''
              }}>
                {insight.icon} {insight.title}
              </div>
              <div className="insight-text-2025">
                {insight.message}
              </div>
            </div>
          ))
        ) : (
          <div className="insight-card-2025 info">
            <div className="insight-title-2025" style={{color: 'var(--color-neon-blue)'}}>
              AI Ready to Analyze
            </div>
            <div className="insight-text-2025">
              Add holdings to your portfolio to receive AI-powered insights and recommendations.
            </div>
          </div>
        )}
      </div>

      {/* Real Portfolio Metrics */}
      <div className="card-2025 ai-predictions-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>Portfolio Metrics</h3>
        
        <div className="prediction-card-2025">
          <div className="prediction-header-2025">
            <span className="prediction-timeframe-2025">Performance</span>
            <span className={`prediction-confidence-2025 ${portfolioMetrics.totalGainPercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
              {portfolioMetrics.totalGainPercent >= 0 ? '+' : ''}{portfolioMetrics.totalGainPercent.toFixed(2)}%
            </span>
          </div>
          <div className="prediction-text-2025">
            Current Value: <strong style={{color: 'var(--color-neon-green)'}}>{formatCurrency(portfolioMetrics.totalValue)}</strong>
          </div>
          <div className="prediction-trend-2025">
            <div className="trend-arrow-2025">{portfolioMetrics.totalGainPercent >= 0 ? '↗' : '↘'}</div>
            <span className="trend-percentage-2025">
              {portfolioMetrics.holdingsCount} Holdings
            </span>
          </div>
        </div>

        <div className="prediction-card-2025">
          <div className="prediction-header-2025">
            <span className="prediction-timeframe-2025">Risk Level</span>
            <span className="prediction-confidence-2025">
              {volatility < 20 ? 'Low' : volatility < 40 ? 'Moderate' : 'High'}
            </span>
          </div>
          <div className="prediction-text-2025">
            Volatility: <strong style={{color: 'var(--color-neon-blue)'}}>{volatility.toFixed(1)}%</strong>
          </div>
          <div className="prediction-trend-2025">
            <div className="trend-arrow-2025">⚡</div>
            <span className="trend-percentage-2025">
              {concentration.toFixed(1)}% Concentrated
            </span>
          </div>
        </div>

        <div className="prediction-card-2025">
          <div className="prediction-header-2025">
            <span className="prediction-timeframe-2025">AI Score</span>
            <span className="prediction-confidence-2025">
              {portfolioScore}/10
            </span>
          </div>
          <div className="prediction-text-2025">
            Health Rating: <strong style={{color: 'var(--color-neon-purple)'}}>
              {portfolioScore >= 8 ? 'Excellent' : 
               portfolioScore >= 6 ? 'Good' : 
               portfolioScore >= 4 ? 'Fair' : 'Needs Improvement'}
            </strong>
          </div>
          <div className="prediction-trend-2025">
            <div className="trend-arrow-2025">●</div>
            <span className="trend-percentage-2025">
              AI Analyzed
            </span>
          </div>
        </div>
      </div>

      {/* AI Portfolio Optimizer Section */}
      <div className="card-2025 ai-optimizer-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>Portfolio Health</h3>
        
        <div className="optimizer-metric-2025">
          <div className="optimizer-label-2025">Health Score</div>
          <div className="optimizer-score-2025">
            <span className="score-value-2025">{portfolioScore.toFixed(1)}</span>
            <span className="score-max-2025">/10</span>
          </div>
          <div className="optimizer-bar-2025">
            <div className="optimizer-fill-2025" style={{
              width: `${portfolioScore * 10}%`,
              background: portfolioScore >= 7 ? 'var(--color-neon-green)' : 
                         portfolioScore >= 4 ? 'var(--color-neon-yellow)' : 'var(--color-neon-red)'
            }}></div>
          </div>
        </div>

        <div className="optimizer-recommendations-2025">
          {recommendations.map((rec, index) => (
            <div key={index} className="recommendation-item-2025">
              <div className="recommendation-icon-2025">{rec.icon}</div>
              <div className="recommendation-text-2025">
                <strong>{rec.title}:</strong> {rec.text}
              </div>
            </div>
          ))}
        </div>

        <div className="optimizer-action-2025">
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            padding: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <span style={{fontSize: '14px', color: 'rgba(255, 255, 255, 0.8)'}}>
              {portfolioMetrics.holdingsCount > 0 ? 
                `Based on ${portfolioMetrics.holdingsCount} holdings analysis` : 
                'Add holdings to get personalized insights'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Real Portfolio Analysis - Full Width */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>🧠 AI Portfolio Analysis</h3>
        
        {portfolioMetrics.holdingsCount > 0 ? (
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
            {/* Portfolio Status */}
            <div className="ai-analysis-section-2025">
              <h4 style={{color: 'var(--color-neon-green)', marginBottom: '12px'}}>Portfolio Status</h4>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Total Value</span>
                <span className="metric-value-2025 positive-2025">{formatCurrency(portfolioMetrics.totalValue)}</span>
              </div>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Total Return</span>
                <span className={`metric-value-2025 ${portfolioMetrics.totalGainPercent >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                  {portfolioMetrics.totalGainPercent >= 0 ? '+' : ''}{portfolioMetrics.totalGainPercent.toFixed(2)}%
                </span>
              </div>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Holdings Count</span>
                <span className="metric-value-2025" style={{color: 'var(--color-neon-blue)'}}>
                  {portfolioMetrics.holdingsCount} stocks
                </span>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="ai-analysis-section-2025">
              <h4 style={{color: 'var(--color-neon-blue)', marginBottom: '12px'}}>Risk Assessment</h4>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Volatility</span>
                <span className="metric-value-2025" style={{
                  color: volatility < 20 ? 'var(--color-neon-green)' : 
                         volatility < 40 ? 'var(--color-neon-yellow)' : 'var(--color-neon-red)'
                }}>
                  {volatility.toFixed(1)}%
                </span>
              </div>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Concentration</span>
                <span className="metric-value-2025" style={{
                  color: concentration < 30 ? 'var(--color-neon-green)' : 
                         concentration < 60 ? 'var(--color-neon-yellow)' : 'var(--color-neon-red)'
                }}>
                  {concentration.toFixed(1)}%
                </span>
              </div>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Risk Level</span>
                <span className="metric-value-2025" style={{
                  color: portfolioScore >= 7 ? 'var(--color-neon-green)' : 
                         portfolioScore >= 4 ? 'var(--color-neon-yellow)' : 'var(--color-neon-red)'
                }}>
                  {volatility < 20 ? 'Low' : volatility < 40 ? 'Moderate' : 'High'}
                </span>
              </div>
            </div>

            {/* AI Recommendations */}
            <div className="ai-analysis-section-2025">
              <h4 style={{color: 'var(--color-neon-purple)', marginBottom: '12px'}}>AI Recommendations</h4>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Portfolio Score</span>
                <span className="metric-value-2025" style={{
                  color: portfolioScore >= 7 ? 'var(--color-neon-green)' : 
                         portfolioScore >= 4 ? 'var(--color-neon-yellow)' : 'var(--color-neon-red)'
                }}>
                  {portfolioScore.toFixed(1)}/10
                </span>
              </div>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Diversification</span>
                <span className="metric-value-2025" style={{
                  color: portfolioMetrics.holdingsCount >= 5 ? 'var(--color-neon-green)' : 
                         portfolioMetrics.holdingsCount >= 3 ? 'var(--color-neon-yellow)' : 'var(--color-neon-red)'
                }}>
                  {portfolioMetrics.holdingsCount >= 5 ? 'Good' : 
                   portfolioMetrics.holdingsCount >= 3 ? 'Fair' : 'Needs Work'}
                </span>
              </div>
              <div className="analysis-metric-2025">
                <span className="metric-label-2025">Health Rating</span>
                <span className="metric-value-2025 positive-2025">
                  {portfolioScore >= 8 ? 'Excellent' : 
                   portfolioScore >= 6 ? 'Good' : 
                   portfolioScore >= 4 ? 'Fair' : 'Poor'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{textAlign: 'center', padding: '40px', color: 'rgba(255, 255, 255, 0.6)'}}>
            <Brain size={48} style={{marginBottom: '16px', opacity: 0.5}} />
            <h4 style={{marginBottom: '8px', color: 'white'}}>No Portfolio Data</h4>
            <p>Add holdings to your portfolio to receive comprehensive AI analysis and insights.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIInsights;