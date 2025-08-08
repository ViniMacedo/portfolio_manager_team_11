import React from 'react';
import { Eye, Plus, TrendingUp, TrendingDown, Star, Brain, Zap, Target } from 'lucide-react';

const AIInsights = ({ watchlist, setSelectedStock, setActiveTab }) => {
  return (
    <div className="dashboard-grid-2025">
      {/* AI Insights - Main Section */}
      <div className="card-2025 ai-insights-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>🤖 AI Insights</h3>
        
        <div className="insight-card-2025 success">
          <div className="insight-title-2025 positive-2025">Buy Opportunity</div>
          <div className="insight-text-2025">
            AAPL showing bullish pattern. 87% confidence for 12% gain.
          </div>
        </div>

        <div className="insight-card-2025 warning">
          <div className="insight-title-2025" style={{color: 'var(--color-neon-yellow)'}}>Risk Alert</div>
          <div className="insight-text-2025">Tech sector volatility increasing. Consider rebalancing.</div>
        </div>

        <div className="insight-card-2025 info">
          <div className="insight-title-2025" style={{color: 'var(--color-neon-purple)'}}>Market Trend</div>
          <div className="insight-text-2025">AI sector outperforming market by 340% this quarter.</div>
        </div>

        <div className="insight-card-2025 info">
          <div className="insight-title-2025" style={{color: 'var(--color-neon-blue)'}}>Portfolio Health</div>
          <div className="insight-text-2025">Diversification score improved to 8.7/10 this month.</div>
        </div>
      </div>

      {/* AI Predictions Section */}
      <div className="card-2025 ai-predictions-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>� AI Predictions</h3>
        
        <div className="prediction-card-2025">
          <div className="prediction-header-2025">
            <span className="prediction-timeframe-2025">7 Days</span>
            <span className="prediction-confidence-2025">94% Confidence</span>
          </div>
          <div className="prediction-text-2025">
            Portfolio expected to reach <strong style={{color: 'var(--color-neon-green)'}}>$1.32M</strong>
          </div>
          <div className="prediction-trend-2025">
            <div className="trend-arrow-2025">↗️</div>
            <span className="trend-percentage-2025">+5.8%</span>
          </div>
        </div>

        <div className="prediction-card-2025">
          <div className="prediction-header-2025">
            <span className="prediction-timeframe-2025">30 Days</span>
            <span className="prediction-confidence-2025">78% Confidence</span>
          </div>
          <div className="prediction-text-2025">
            Optimal time to diversify into <strong style={{color: 'var(--color-neon-blue)'}}>Healthcare</strong>
          </div>
          <div className="prediction-trend-2025">
            <div className="trend-arrow-2025">🏥</div>
            <span className="trend-percentage-2025">+12.4%</span>
          </div>
        </div>

        <div className="prediction-card-2025">
          <div className="prediction-header-2025">
            <span className="prediction-timeframe-2025">90 Days</span>
            <span className="prediction-confidence-2025">85% Confidence</span>
          </div>
          <div className="prediction-text-2025">
            Earnings season boost for <strong style={{color: 'var(--color-neon-purple)'}}>Tech holdings</strong>
          </div>
          <div className="prediction-trend-2025">
            <div className="trend-arrow-2025">🚀</div>
            <span className="trend-percentage-2025">+18.2%</span>
          </div>
        </div>
      </div>

      {/* AI Portfolio Optimizer Section */}
      <div className="card-2025 ai-optimizer-2025" style={{gridColumn: 'span 4'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>⚡ AI Optimizer</h3>
        
        <div className="optimizer-metric-2025">
          <div className="optimizer-label-2025">Portfolio Score</div>
          <div className="optimizer-score-2025">
            <span className="score-value-2025">8.7</span>
            <span className="score-max-2025">/10</span>
          </div>
          <div className="optimizer-bar-2025">
            <div className="optimizer-fill-2025" style={{width: '87%'}}></div>
          </div>
        </div>

        <div className="optimizer-recommendations-2025">
          <div className="recommendation-item-2025">
            <div className="recommendation-icon-2025">⚖️</div>
            <div className="recommendation-text-2025">
              <strong>Rebalance Suggestion:</strong> Move 5% from NVDA to defensive stocks
            </div>
          </div>
          
          <div className="recommendation-item-2025">
            <div className="recommendation-icon-2025">💎</div>
            <div className="recommendation-text-2025">
              <strong>Diversification:</strong> Add international exposure for risk reduction
            </div>
          </div>
          
          <div className="recommendation-item-2025">
            <div className="recommendation-icon-2025">📈</div>
            <div className="recommendation-text-2025">
              <strong>Growth Opportunity:</strong> Consider small-cap value plays
            </div>
          </div>
        </div>

        <div className="optimizer-action-2025">
          <button className="ai-action-btn-2025" onClick={() => setActiveTab && setActiveTab('browse')}>
            Apply AI Recommendations
          </button>
        </div>
      </div>

      {/* AI Analysis Summary - Full Width */}
      <div className="card-2025" style={{gridColumn: 'span 12'}}>
        <h3 style={{fontSize: '18px', marginBottom: '20px'}}>🧠 Comprehensive AI Analysis</h3>
        
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px'}}>
          {/* Market Sentiment */}
          <div className="ai-analysis-section-2025">
            <h4 style={{color: 'var(--color-neon-green)', marginBottom: '12px'}}>📊 Market Sentiment</h4>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">Overall Market</span>
              <span className="metric-value-2025 positive-2025">Bullish +72%</span>
            </div>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">Tech Sector</span>
              <span className="metric-value-2025 positive-2025">Strong Buy +89%</span>
            </div>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">Your Holdings</span>
              <span className="metric-value-2025 positive-2025">Optimistic +81%</span>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="ai-analysis-section-2025">
            <h4 style={{color: 'var(--color-neon-blue)', marginBottom: '12px'}}>🛡️ Risk Assessment</h4>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">Portfolio Risk</span>
              <span className="metric-value-2025" style={{color: 'var(--color-neon-green)'}}>Low 2.4/10</span>
            </div>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">Volatility</span>
              <span className="metric-value-2025" style={{color: 'var(--color-neon-yellow)'}}>Moderate</span>
            </div>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">Sharpe Ratio</span>
              <span className="metric-value-2025 positive-2025">1.82</span>
            </div>
          </div>

          {/* Performance Projection */}
          <div className="ai-analysis-section-2025">
            <h4 style={{color: 'var(--color-neon-purple)', marginBottom: '12px'}}>🚀 Performance Projection</h4>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">6 Month Target</span>
              <span className="metric-value-2025 positive-2025">+24.8%</span>
            </div>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">1 Year Target</span>
              <span className="metric-value-2025 positive-2025">+42.1%</span>
            </div>
            <div className="analysis-metric-2025">
              <span className="metric-label-2025">Probability</span>
              <span className="metric-value-2025" style={{color: 'var(--color-neon-green)'}}>87% Likely</span>
            </div>
          </div>
        </div>

        {/* AI Recommendations Actions */}
        <div style={{marginTop: '24px', padding: '20px', background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)'}}>
          <h4 style={{marginBottom: '16px', color: 'var(--color-neon-green)'}}>🎯 Recommended Actions</h4>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px'}}>
            <button className="ai-action-btn-2025" onClick={() => setActiveTab && setActiveTab('browse')}>
              <Zap className="h-4 w-4" />
              Browse Opportunities
            </button>
            <button className="ai-action-btn-2025" onClick={() => setActiveTab && setActiveTab('holdings')}>
              <Target className="h-4 w-4" />
              Rebalance Portfolio
            </button>
            <button className="ai-action-btn-2025" onClick={() => setActiveTab && setActiveTab('performance')}>
              <TrendingUp className="h-4 w-4" />
              View Analytics
            </button>
            <button className="ai-action-btn-2025">
              <Brain className="h-4 w-4" />
              Advanced AI Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIInsights;