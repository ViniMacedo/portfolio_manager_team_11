/**
 * AI Insights Generator - Dynamic, varied portfolio insights
 * Provides randomized, contextual AI insights based on portfolio data
 */

// Portfolio Health Insights
const portfolioHealthInsights = {
  wellDiversified: [
    "Excellent diversification with {holdings} holdings. Portfolio risk is well-managed.",
    "Strong portfolio structure across {holdings} positions. Risk distribution looks optimal.",
    "Well-balanced portfolio with {holdings} holdings. Diversification strategy is working.",
    "Your {holdings}-stock portfolio shows excellent risk management principles.",
    "Solid diversification across {holdings} positions. Risk exposure is well-controlled."
  ],
  needsDiversification: [
    "Consider expanding beyond {holdings} holdings for better risk distribution.",
    "Portfolio concentration is high with only {holdings} positions. Diversification recommended.",
    "Adding more positions to your {holdings}-stock portfolio could reduce volatility.",
    "Risk exposure could be lowered by diversifying beyond {holdings} holdings.",
    "Consider building a more diversified portfolio beyond your current {holdings} positions."
  ]
};

// Market Trend Insights
const marketTrendInsights = {
  riskAlert: [
    "Portfolio down {change}% today. Consider reviewing positions for rebalancing opportunities.",
    "Significant decline of {change}% detected. Time to assess risk exposure.",
    "Portfolio experiencing {change}% drawdown. Risk management review recommended.",
    "Down {change}% today - market volatility presents both risks and opportunities.",
    "Portfolio decline of {change}% warrants strategic position evaluation."
  ],
  favorable: [
    "Market conditions favorable with portfolio up {change}%. Good time for strategic moves.",
    "Positive momentum detected (+{change}%). Consider capitalizing on current trends.",
    "Portfolio gaining {change}% - market environment supports growth strategies.",
    "Strong performance today (+{change}%). Opportunity for strategic positioning.",
    "Market tailwinds pushing portfolio up {change}%. Strategic entry points available."
  ],
  neutral: [
    "Market showing stability. Good time to review long-term strategy.",
    "Sideways market action - focus on fundamentals and quality picks.",
    "Consolidation phase detected. Perfect time for portfolio optimization.",
    "Market in equilibrium. Opportunity to strengthen core positions.",
    "Stable market conditions favor methodical investment approach."
  ]
};

// Performance Insights
const performanceInsights = {
  hasPerformer: [
    "{symbol} leading gains at {performance}. Strong momentum in this position.",
    "{symbol} showing excellent performance with {performance} gains. Winner confirmed.",
    "Outstanding performance from {symbol} at {performance}. Trend strength evident.",
    "{symbol} driving portfolio returns with {performance} gains. Momentum player.",
    "Top performer {symbol} delivering {performance} returns. Strength continues."
  ],
  loading: [
    "Analyzing portfolio performance... market data processing.",
    "Computing performance metrics... real-time analysis in progress.",
    "Evaluating position strength... algorithmic assessment running.",
    "Performance calculation in progress... data synthesis ongoing.",
    "Portfolio analysis underway... AI insights generating."
  ]
};

// Market Status Insights
const marketStatusInsights = {
  open: [
    "Market is currently open. Live trading opportunities available. Last updated: {timestamp}.",
    "Active trading session in progress. Real-time execution enabled. Updated: {timestamp}.",
    "Market open for business. Optimal time for position adjustments. Last sync: {timestamp}.",
    "Live market conditions. Strategic moves can be executed now. Updated: {timestamp}.",
    "Trading session active. Market opportunities ready for capture. Last update: {timestamp}."
  ],
  closed: [
    "Market is currently closed. Perfect time for strategy planning. Last updated: {timestamp}.",
    "Trading session ended. Ideal for portfolio analysis and planning. Updated: {timestamp}.",
    "Market closed - excellent opportunity for research and strategy. Last sync: {timestamp}.",
    "After-hours period. Time for deep analysis and position planning. Updated: {timestamp}.",
    "Market closed for trading. Strategic planning mode activated. Last update: {timestamp}."
  ]
};

// Risk Level Insights
const riskLevelInsights = {
  low: [
    "Low risk profile detected. Conservative approach paying dividends.",
    "Risk-managed portfolio showing stability. Defensive positioning effective.",
    "Low volatility strategy in effect. Capital preservation prioritized.",
    "Conservative risk profile. Steady growth trajectory maintained.",
    "Risk-controlled approach delivering consistent results."
  ],
  medium: [
    "Balanced risk approach. Good mix of growth and stability.",
    "Medium risk profile offers growth potential with managed downside.",
    "Moderate risk strategy. Balanced approach to growth and preservation.",
    "Well-calibrated risk level. Growth opportunities with protection.",
    "Optimal risk balance. Strategic positioning for various market conditions."
  ],
  high: [
    "Aggressive growth strategy. High risk, high reward positioning.",
    "Bold investment approach. Significant upside potential with elevated risk.",
    "High-octane portfolio. Maximum growth potential with increased volatility.",
    "Aggressive positioning. Built for maximum appreciation potential.",
    "High-risk, high-reward strategy. Positioned for outsized returns."
  ]
};

/**
 * AI Insights Generator Class
 */
export class AIInsightsGenerator {
  constructor() {
    this.lastUsedInsights = new Map();
  }

  /**
   * Get a random insight that hasn't been used recently
   */
  getRandomInsight(category, subcategory, maxHistory = 3) {
    const key = `${category}-${subcategory}`;
    const insights = this.getInsightArray(category, subcategory);
    
    if (!insights || insights.length === 0) return "AI analysis in progress...";

    // Get previously used insights
    const usedInsights = this.lastUsedInsights.get(key) || [];
    
    // Filter out recently used insights
    const availableInsights = insights.filter((insight, index) => 
      !usedInsights.includes(index)
    );
    
    // If all insights have been used, reset the history
    const finalInsights = availableInsights.length > 0 ? availableInsights : insights;
    
    // Select random insight
    const selectedInsight = finalInsights[Math.floor(Math.random() * finalInsights.length)];
    const selectedIndex = insights.indexOf(selectedInsight);
    
    // Update history
    const newHistory = [selectedIndex, ...usedInsights].slice(0, maxHistory);
    this.lastUsedInsights.set(key, newHistory);
    
    return selectedInsight;
  }

  /**
   * Get insight array by category and subcategory
   */
  getInsightArray(category, subcategory) {
    const categories = {
      portfolioHealth: portfolioHealthInsights,
      marketTrend: marketTrendInsights,
      performance: performanceInsights,
      marketStatus: marketStatusInsights,
      riskLevel: riskLevelInsights
    };

    return categories[category]?.[subcategory] || [];
  }

  /**
   * Generate portfolio health insight
   */
  generatePortfolioHealthInsight(totalHoldings) {
    const subcategory = totalHoldings > 3 ? 'wellDiversified' : 'needsDiversification';
    const insight = this.getRandomInsight('portfolioHealth', subcategory);
    return insight.replace('{holdings}', totalHoldings);
  }

  /**
   * Generate market trend insight
   */
  generateMarketTrendInsight(dayChangePercent) {
    let subcategory, changeValue;
    
    if (dayChangePercent < -2) {
      subcategory = 'riskAlert';
      changeValue = Math.abs(dayChangePercent).toFixed(1);
    } else if (dayChangePercent > 0.5) {
      subcategory = 'favorable';
      changeValue = dayChangePercent.toFixed(1);
    } else {
      subcategory = 'neutral';
      changeValue = null;
    }
    
    const insight = this.getRandomInsight('marketTrend', subcategory);
    return changeValue ? insight.replace('{change}', changeValue) : insight;
  }

  /**
   * Generate performance insight
   */
  generatePerformanceInsight(bestPerformer) {
    if (!bestPerformer) {
      return this.getRandomInsight('performance', 'loading');
    }
    
    // Get symbol with multiple fallbacks - use safeSymbol if available
    const symbol = bestPerformer.product_symbol || 
                   bestPerformer.symbol || 
                   bestPerformer.stock_symbol || 
                   bestPerformer.ticker || 
                   'Unknown Stock';
    
    // Get performance with multiple fallbacks and safe number conversion
    const performanceKeys = ['performancePercent', 'changePercent', 'change_percent', 'gain_loss_percent'];
    let performance = 0;
    for (const key of performanceKeys) {
      if (bestPerformer[key] !== undefined && bestPerformer[key] !== null && !isNaN(bestPerformer[key])) {
        performance = Number(bestPerformer[key]);
        break;
      }
    }
    
    const insight = this.getRandomInsight('performance', 'hasPerformer');
    return insight
      .replace('{symbol}', symbol)
      .replace('{performance}', `${performance >= 0 ? '+' : ''}${performance.toFixed(1)}%`);
  }

  /**
   * Generate market status insight
   */
  generateMarketStatusInsight(isOpen, timestamp) {
    const subcategory = isOpen ? 'open' : 'closed';
    const insight = this.getRandomInsight('marketStatus', subcategory);
    return insight.replace('{timestamp}', timestamp);
  }

  /**
   * Generate risk level insight
   */
  generateRiskLevelInsight(riskScore) {
    const subcategory = riskScore?.toLowerCase() || 'medium';
    return this.getRandomInsight('riskLevel', subcategory);
  }

  /**
   * Generate insight title variations
   */
  generateInsightTitle(baseTitle, dayChangePercent) {
    const titleVariations = {
      'Portfolio Health': [
        'Portfolio Health', 'Risk Analysis', 'Portfolio Strength', 'Risk Assessment', 'Portfolio Status'
      ],
      'Market Trend': dayChangePercent < -2 ? 
        ['Risk Alert', 'Market Warning', 'Volatility Alert', 'Risk Notice', 'Market Risk'] :
        ['Market Trend', 'Market Outlook', 'Trend Analysis', 'Market View', 'Market Signal'],
      'Performance': [
        'Performance', 'Top Performers', 'Portfolio Leaders', 'Star Holdings', 'Performance Update'
      ],
      'Market Status': [
        'Market Status', 'Trading Hours', 'Market Update', 'Session Status', 'Market Info'
      ]
    };

    const variations = titleVariations[baseTitle] || [baseTitle];
    return variations[Math.floor(Math.random() * variations.length)];
  }
}

// Create singleton instance
export const aiInsights = new AIInsightsGenerator();

// Export individual functions for convenience
export const generatePortfolioHealthInsight = (totalHoldings) => 
  aiInsights.generatePortfolioHealthInsight(totalHoldings);

export const generateMarketTrendInsight = (dayChangePercent) => 
  aiInsights.generateMarketTrendInsight(dayChangePercent);

export const generatePerformanceInsight = (bestPerformer) => 
  aiInsights.generatePerformanceInsight(bestPerformer);

export const generateMarketStatusInsight = (isOpen, timestamp) => 
  aiInsights.generateMarketStatusInsight(isOpen, timestamp);

export const generateRiskLevelInsight = (riskScore) => 
  aiInsights.generateRiskLevelInsight(riskScore);

export const generateInsightTitle = (baseTitle, dayChangePercent) => 
  aiInsights.generateInsightTitle(baseTitle, dayChangePercent);
