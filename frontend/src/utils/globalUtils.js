/**
 * Global Utility Functions for Portfolio AI Suite 2025
 * Consolidated functions used across multiple components
 */

// =============================================================================
// NUMBER FORMATTING UTILITIES
// =============================================================================

/**
 * Formats currency values with proper locale and decimals
 * @param {number} value - The value to format
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '$0.00';
  return `$${Number(value).toLocaleString('en-US', { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`;
};

/**
 * Formats market cap values with K, M, B, T suffixes
 * @param {number} value - The market cap value
 * @returns {string} Formatted market cap string
 */
export const formatMarketCap = (value) => {
  if (!value || value === 'N/A' || isNaN(value)) return 'N/A';
  
  const num = Number(value);
  if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
  if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
  return formatCurrency(num, 0);
};

/**
 * Formats volume with K, M, B suffixes
 * @param {number} value - The volume value
 * @returns {string} Formatted volume string
 */
export const formatVolume = (value) => {
  if (!value || value === 'N/A' || isNaN(value)) return 'N/A';
  
  const num = Number(value);
  if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
  return num.toLocaleString();
};

/**
 * Formats percentage values with proper sign and decimals
 * @param {number} value - The percentage value
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 2) => {
  if (value === null || value === undefined || isNaN(value)) return '0.00%';
  const sign = value >= 0 ? '+' : '';
  return `${sign}${Number(value).toFixed(decimals)}%`;
};

/**
 * Formats large numbers with appropriate suffixes
 * @param {number} value - The number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number string
 */
export const formatLargeNumber = (value, decimals = 1) => {
  if (!value || isNaN(value)) return '0';
  
  const num = Number(value);
  if (num >= 1e9) return `${(num / 1e9).toFixed(decimals)}B`;
  if (num >= 1e6) return `${(num / 1e6).toFixed(decimals)}M`;
  if (num >= 1e3) return `${(num / 1e3).toFixed(decimals)}K`;
  return num.toLocaleString();
};

// =============================================================================
// STOCK DATA NORMALIZATION UTILITIES
// =============================================================================

/**
 * Safely gets the number of shares from a stock object
 * @param {Object} stock - Stock holding object
 * @returns {number} Number of shares
 */
export const getShares = (stock) => {
  return Number(stock?.shares || stock?.quantity || stock?.qty || 0);
};

/**
 * Safely gets the current price from a stock object
 * @param {Object} stock - Stock object
 * @returns {number} Current price
 */
export const getCurrentPrice = (stock) => {
  return Number(stock?.current_price || stock?.price || 0);
};

/**
 * Safely gets the average price from a stock object
 * @param {Object} stock - Stock holding object
 * @returns {number} Average purchase price
 */
export const getAveragePrice = (stock) => {
  const currentPrice = getCurrentPrice(stock);
  return Number(stock?.avg_price || stock?.average_cost || currentPrice);
};

/**
 * Calculates the market value of a stock holding
 * @param {Object} stock - Stock holding object
 * @returns {number} Market value (shares * current price)
 */
export const getMarketValue = (stock) => {
  return getShares(stock) * getCurrentPrice(stock);
};

/**
 * Calculates the cost basis of a stock holding
 * @param {Object} stock - Stock holding object
 * @returns {number} Cost basis (shares * average price)
 */
export const getCostBasis = (stock) => {
  return getShares(stock) * getAveragePrice(stock);
};

/**
 * Calculates gain/loss for a stock holding
 * @param {Object} stock - Stock holding object
 * @returns {Object} {gainLoss: number, gainLossPercent: number}
 */
export const calculateStockPerformance = (stock) => {
  const marketValue = getMarketValue(stock);
  const costBasis = getCostBasis(stock);
  const gainLoss = marketValue - costBasis;
  const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis * 100) : 0;
  
  return { gainLoss, gainLossPercent };
};

// =============================================================================
// PORTFOLIO CALCULATION UTILITIES
// =============================================================================

/**
 * Calculates comprehensive portfolio metrics
 * @param {Object} portfolio - Portfolio object with holdings
 * @returns {Object} Portfolio metrics object
 */
export const calculatePortfolioMetrics = (portfolio) => {
  if (!portfolio?.holdings || portfolio.holdings.length === 0) {
    return {
      totalValue: 0,
      totalCost: 0,
      totalGain: 0,
      totalGainPercent: 0,
      holdingsCount: 0,
      topPerformer: null,
      worstPerformer: null,
      bestPerformance: 0,
      worstPerformance: 0
    };
  }

  let totalValue = 0;
  let totalCost = 0;
  let topPerformer = null;
  let worstPerformer = null;
  let bestPerformance = -Infinity;
  let worstPerformance = Infinity;

  portfolio.holdings.forEach((stock) => {
    const marketValue = getMarketValue(stock);
    const costBasis = getCostBasis(stock);
    const { gainLossPercent } = calculateStockPerformance(stock);
    
    totalValue += marketValue;
    totalCost += costBasis;
    
    // Track best and worst performers
    if (gainLossPercent > bestPerformance) {
      bestPerformance = gainLossPercent;
      topPerformer = { ...stock, changePercent: gainLossPercent, value: marketValue };
    }
    if (gainLossPercent < worstPerformance) {
      worstPerformance = gainLossPercent;
      worstPerformer = { ...stock, changePercent: gainLossPercent, value: marketValue };
    }
  });

  const totalGain = totalValue - totalCost;
  const totalGainPercent = totalCost > 0 ? (totalGain / totalCost * 100) : 0;

  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent,
    holdingsCount: portfolio.holdings.length,
    topPerformer,
    worstPerformer,
    bestPerformance,
    worstPerformance
  };
};

/**
 * Calculates effective portfolio data for display
 * @param {Object} portfolio - Portfolio object
 * @param {number} userBalance - User's cash balance
 * @returns {Object} Effective portfolio data
 */
export const getEffectivePortfolioData = (portfolio, userBalance = 0) => {
  const metrics = calculatePortfolioMetrics(portfolio);
  const balance = Number(userBalance) || 0;
  const totalValue = metrics.totalValue + balance;
  
  // Calculate realistic day change based on market conditions
  // For demo purposes, we'll simulate daily portfolio fluctuations
  const now = new Date();
  const dayOfYear = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
  
  // Use a pseudo-random but consistent daily change based on date
  const dailyVolatility = 0.02; // 2% max daily swing
  const changeMultiplier = Math.sin(dayOfYear * 0.1) * dailyVolatility;
  
  // Calculate day change based on portfolio value
  const portfolioValue = metrics.totalValue;
  const dayChange = portfolioValue * changeMultiplier;
  const dayChangePercent = portfolioValue > 0 ? (dayChange / portfolioValue) * 100 : 0;
  
  // Simulate previous day value for more realistic calculations
  const previousValue = portfolioValue - dayChange;
  const actualDayChangePercent = previousValue > 0 ? (dayChange / previousValue) * 100 : 0;
  
  return {
    totalValue: totalValue,
    cashBalance: balance,
    investedAmount: metrics.totalCost,
    totalGain: metrics.totalGain,
    totalGainPercent: metrics.totalGainPercent,
    dayChange: dayChange,
    dayChangePercent: actualDayChangePercent,
    holdings: portfolio?.holdings || [],
    holdingsCount: metrics.holdingsCount,
    previousValue: previousValue
  };
};

/**
 * Gets effective holdings with proper fallbacks
 * @param {Object} portfolio - Portfolio object
 * @returns {Array} Array of holdings
 */
export const getEffectiveHoldings = (portfolio) => {
  return portfolio?.holdings || [];
};

// =============================================================================
// RISK & ANALYTICS UTILITIES
// =============================================================================

/**
 * Calculates portfolio volatility
 * @param {Object} portfolio - Portfolio object
 * @returns {number} Portfolio volatility percentage
 */
export const calculatePortfolioVolatility = (portfolio) => {
  if (!portfolio?.holdings || portfolio.holdings.length === 0) return 0;
  
  const volatilities = portfolio.holdings.map(stock => {
    const currentPrice = getCurrentPrice(stock);
    const avgPrice = getAveragePrice(stock);
    return avgPrice > 0 ? Math.abs((currentPrice - avgPrice) / avgPrice * 100) : 0;
  });
  
  return volatilities.reduce((sum, vol) => sum + vol, 0) / volatilities.length;
};

/**
 * Calculates portfolio concentration (weight of largest holding)
 * @param {Object} portfolio - Portfolio object
 * @returns {number} Largest holding weight as percentage
 */
export const calculatePortfolioConcentration = (portfolio) => {
  const metrics = calculatePortfolioMetrics(portfolio);
  if (metrics.totalValue === 0 || !portfolio?.holdings) return 0;
  
  const maxHoldingValue = Math.max(...portfolio.holdings.map(getMarketValue));
  return (maxHoldingValue / metrics.totalValue) * 100;
};

/**
 * Gets portfolio allocation by holding
 * @param {Object} portfolio - Portfolio object
 * @returns {Array} Array of holdings with allocation percentages
 */
export const getPortfolioAllocation = (portfolio) => {
  const metrics = calculatePortfolioMetrics(portfolio);
  if (metrics.totalValue === 0 || !portfolio?.holdings) return [];
  
  return portfolio.holdings.map(stock => {
    const marketValue = getMarketValue(stock);
    const weight = (marketValue / metrics.totalValue) * 100;
    
    return {
      ...stock,
      marketValue,
      weight,
      ...calculateStockPerformance(stock)
    };
  });
};

// =============================================================================
// AI INSIGHTS UTILITIES
// =============================================================================

/**
 * Generates AI insights based on portfolio performance
 * @param {Object} portfolio - Portfolio object
 * @param {Object} metrics - Pre-calculated metrics (optional)
 * @returns {Array} Array of AI insight objects
 */
export const generateAIInsights = (portfolio, metrics = null) => {
  const portfolioMetrics = metrics || calculatePortfolioMetrics(portfolio);
  const volatility = calculatePortfolioVolatility(portfolio);
  const concentration = calculatePortfolioConcentration(portfolio);
  const insights = [];

  // Always add a performance insight
  if (portfolioMetrics.totalGainPercent < -50) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'High Portfolio Drawdown',
      message: `Portfolio is down ${Math.abs(portfolioMetrics.totalGainPercent).toFixed(1)}%. Consider diversification or dollar-cost averaging.`
    });
  } else if (portfolioMetrics.totalGainPercent > 20) {
    insights.push({
      type: 'success',
      icon: '🚀',
      title: 'Strong Performance',
      message: `Excellent returns of ${portfolioMetrics.totalGainPercent.toFixed(1)}%! Consider taking profits or rebalancing.`
    });
  } else if (portfolioMetrics.totalGainPercent < -5) {
    insights.push({
      type: 'warning',
      icon: '�',
      title: 'Portfolio Decline',
      message: `Portfolio is down ${Math.abs(portfolioMetrics.totalGainPercent).toFixed(1)}%. Monitor key positions and consider rebalancing.`
    });
  } else if (portfolioMetrics.totalGainPercent > 5) {
    insights.push({
      type: 'success',
      icon: '📈',
      title: 'Positive Returns',
      message: `Portfolio showing ${portfolioMetrics.totalGainPercent.toFixed(1)}% gains. Good momentum building.`
    });
  } else {
    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Stable Performance',
      message: `Portfolio performing within normal range. Continue monitoring for opportunities.`
    });
  }

  // Always add a risk insight
  if (volatility > 50) {
    insights.push({
      type: 'warning',
      icon: '🌪️',
      title: 'High Volatility Alert',
      message: `Portfolio volatility at ${volatility.toFixed(1)}% suggests high risk. Consider stable assets.`
    });
  } else if (volatility > 30) {
    insights.push({
      type: 'warning',
      icon: '⚡',
      title: 'Moderate Risk Level',
      message: `Volatility at ${volatility.toFixed(1)}% indicates moderate risk. Monitor positions closely.`
    });
  } else if (volatility < 15) {
    insights.push({
      type: 'info',
      icon: '🛡️',
      title: 'Conservative Portfolio',
      message: `Low volatility of ${volatility.toFixed(1)}% indicates stability but limited growth potential.`
    });
  } else {
    insights.push({
      type: 'info',
      icon: '📊',
      title: 'Balanced Risk',
      message: `Volatility at ${volatility.toFixed(1)}% shows balanced risk profile. Well managed portfolio.`
    });
  }

  // Always add a diversification insight
  if (concentration > 60) {
    insights.push({
      type: 'warning',
      icon: '🎯',
      title: 'High Concentration Risk',
      message: `${concentration.toFixed(1)}% concentrated in top holding. Urgent diversification needed.`
    });
  } else if (concentration > 40) {
    insights.push({
      type: 'warning',
      icon: '⚖️',
      title: 'Concentration Risk',
      message: `${concentration.toFixed(1)}% concentrated in top holding. Consider diversification.`
    });
  } else if (portfolioMetrics.holdingsCount === 1) {
    insights.push({
      type: 'warning',
      icon: '🎯',
      title: 'Single Holding Risk',
      message: 'Portfolio has only one holding. Diversification could reduce risk.'
    });
  } else if (portfolioMetrics.holdingsCount < 5) {
    insights.push({
      type: 'info',
      icon: '🔄',
      title: 'Limited Diversification',
      message: `${portfolioMetrics.holdingsCount} holdings provide basic diversification. Consider adding more positions.`
    });
  } else {
    insights.push({
      type: 'success',
      icon: '✨',
      title: 'Well Diversified',
      message: `Good diversification with ${portfolioMetrics.holdingsCount} holdings and ${concentration.toFixed(1)}% max concentration.`
    });
  }

  // Add top performer insight if available
  if (portfolioMetrics.topPerformer && portfolioMetrics.bestPerformance) {
    insights.push({
      type: 'success',
      icon: '🏆',
      title: 'Top Performer',
      message: `${portfolioMetrics.topPerformer.symbol} leading with ${portfolioMetrics.bestPerformance.toFixed(1)}% gain.`
    });
  }

  return insights.slice(0, 4); // Return max 4 insights
};

// =============================================================================
// DATE & TIME UTILITIES
// =============================================================================

/**
 * Gets current timestamp in readable format
 * @returns {string} Formatted timestamp
 */
export const getCurrentTimestamp = () => {
  return new Date().toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Checks if market is currently open (simplified)
 * @returns {boolean} True if market appears to be open
 */
export const isMarketOpen = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  
  // Monday-Friday, 9:30 AM - 4:00 PM ET (simplified)
  return day >= 1 && day <= 5 && hour >= 9 && hour < 16;
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validates if a value is a valid positive number
 * @param {any} value - Value to validate
 * @returns {boolean} True if valid positive number
 */
export const isValidPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Validates stock symbol format
 * @param {string} symbol - Stock symbol to validate
 * @returns {boolean} True if valid symbol format
 */
export const isValidStockSymbol = (symbol) => {
  return typeof symbol === 'string' && /^[A-Z]{1,5}$/.test(symbol.toUpperCase());
};

/**
 * Safely converts value to number with fallback
 * @param {any} value - Value to convert
 * @param {number} fallback - Fallback value (default: 0)
 * @returns {number} Converted number or fallback
 */
export const safeNumber = (value, fallback = 0) => {
  const num = Number(value);
  return isNaN(num) ? fallback : num;
};

// =============================================================================
// EXPORT DEFAULTS
// =============================================================================

export default {
  // Number formatting
  formatCurrency,
  formatMarketCap,
  formatVolume,
  formatPercentage,
  formatLargeNumber,
  
  // Stock data normalization
  getShares,
  getCurrentPrice,
  getAveragePrice,
  getMarketValue,
  getCostBasis,
  calculateStockPerformance,
  
  // Portfolio calculations
  calculatePortfolioMetrics,
  getEffectivePortfolioData,
  getEffectiveHoldings,
  
  // Risk & analytics
  calculatePortfolioVolatility,
  calculatePortfolioConcentration,
  getPortfolioAllocation,
  generateAIInsights,
  
  // Utilities
  getCurrentTimestamp,
  isMarketOpen,
  isValidPositiveNumber,
  isValidStockSymbol,
  safeNumber
};
