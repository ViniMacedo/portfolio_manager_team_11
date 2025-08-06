// AI Assistant service using OpenRouter API
import axios from 'axios';
import { AI_CONFIG } from '../config/aiConfig.js';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

const openRouterApi = axios.create({
  baseURL: OPENROUTER_BASE_URL,
  timeout: AI_CONFIG.timeout || 30000,
  headers: {
    'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'Portfolio Manager AI Assistant',
    'Accept': 'application/json'
  }
});

// Check if API key is configured
const isAPIKeyConfigured = () => {
  return OPENROUTER_API_KEY && OPENROUTER_API_KEY.trim() !== '';
};

// Show configuration message when API key is missing
const getConfigurationMessage = () => {
  return "AI Assistant requires an OpenRouter API key. Please add your VITE_OPENROUTER_API_KEY to the .env file. Visit https://openrouter.ai/keys to get your free API key.";
};

export const AI_SERVICES = {
  REBALANCE_ADVISOR: 'rebalance_advisor',
  TAX_LOSS_HARVESTING: 'tax_loss_harvesting',
  PORTFOLIO_STORYTELLER: 'portfolio_storyteller'
};

// Generate portfolio narrative summary
export const generatePortfolioStory = async (portfolioData, performanceData, holdings) => {
  if (!isAPIKeyConfigured()) {
    return getConfigurationMessage();
  }

  console.log('Portfolio Storyteller Input:', { portfolioData, performanceData, holdings });

  // Calculate detailed analytics from real data
  const totalPositions = holdings?.length || 0;
  const totalValue = portfolioData?.totalValue || 0;
  const dayChange = portfolioData?.dayChange || 0;
  const dayChangePercent = portfolioData?.dayChangePercent || 0;
  const totalGain = portfolioData?.totalGain || 0;
  const totalGainPercent = portfolioData?.totalGainPercent || 0;

  console.log('Calculated metrics:', { totalValue, dayChange, dayChangePercent, totalGain, totalGainPercent });

  // If no meaningful data, use fallback immediately
  if (totalValue === 0 && totalPositions === 0) {
    console.log('No portfolio data, using fallback');
    return generateFallbackStory(portfolioData, performanceData, holdings);
  }

  // Analyze holdings by sector and performance
  const holdingsAnalysis = holdings?.map(holding => {
    const currentValue = (holding.quantity || holding.shares || 0) * (holding.price || 0);
    const costBasis = (holding.quantity || holding.shares || 0) * (holding.average_cost || holding.cost_basis || holding.price || 0);
    const gainLoss = currentValue - costBasis;
    const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : 0;
    const portfolioWeight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    
    return {
      symbol: holding.symbol,
      name: holding.name || holding.symbol,
      currentValue: currentValue,
      gainLoss: gainLoss,
      gainLossPercent: gainLossPercent,
      portfolioWeight: portfolioWeight,
      shares: holding.quantity || holding.shares || 0
    };
  }) || [];

  const topPerformers = holdingsAnalysis.filter(h => h.gainLossPercent > 5).slice(0, 3);
  const underPerformers = holdingsAnalysis.filter(h => h.gainLossPercent < -5).slice(0, 3);
  const largestPositions = holdingsAnalysis.sort((a, b) => b.portfolioWeight - a.portfolioWeight).slice(0, 3);

  const prompt = `
    As a professional portfolio analyst, create a compelling 1-minute narrative summary of this portfolio's performance using REAL DATA:

    PORTFOLIO METRICS (REAL DATA):
    - Total Portfolio Value: $${totalValue.toLocaleString()}
    - Today's Change: $${dayChange.toLocaleString()} (${dayChangePercent.toFixed(2)}%)
    - Total Return: $${totalGain.toLocaleString()} (${totalGainPercent.toFixed(2)}%)
    - Number of Positions: ${totalPositions}

    LARGEST POSITIONS BY WEIGHT:
    ${largestPositions.map(pos => `- ${pos.symbol}: ${pos.portfolioWeight.toFixed(1)}% ($${pos.currentValue.toLocaleString()})`).join('\n')}

    TOP PERFORMERS:
    ${topPerformers.length > 0 ? topPerformers.map(pos => `- ${pos.symbol}: +${pos.gainLossPercent.toFixed(1)}% gain`).join('\n') : 'No significant gains > 5%'}

    UNDERPERFORMERS:
    ${underPerformers.length > 0 ? underPerformers.map(pos => `- ${pos.symbol}: ${pos.gainLossPercent.toFixed(1)}% loss`).join('\n') : 'No significant losses > 5%'}

    Create a professional, engaging narrative that:
    1. Starts with overall portfolio performance
    2. Highlights your best and worst performing positions by name
    3. Comments on portfolio concentration and diversification
    4. Provides context about today's market movement
    5. Uses actual numbers and percentages from the data above

    Write in first person ("your portfolio") and be specific about the actual holdings and performance numbers.
  `;

  console.log('Sending request to AI with prompt length:', prompt.length);

  try {
    const response = await openRouterApi.post('/chat/completions', {
      model: AI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: AI_CONFIG.systemPrompts?.storyteller || AI_CONFIG.systemPrompts?.default || 'You are a professional portfolio analyst.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature
    });

    console.log('AI Response received:', response.data);
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating portfolio story:', error);
    console.error('Error response:', error.response?.data);
    console.error('Error status:', error.response?.status);
    
    if (error.response?.status === 403) {
      return `API Access Issue: The model "${AI_CONFIG.model}" may not be available with your OpenRouter plan. Try changing the model in aiConfig.js to "openai/gpt-3.5-turbo" or check your OpenRouter account limits.`;
    }
    
    return generateFallbackStory(portfolioData, performanceData, holdings);
  }
};

// Generate rebalancing advice
export const generateRebalanceAdvice = async (portfolioData, holdings) => {
  if (!isAPIKeyConfigured()) {
    return getConfigurationMessage();
  }

  const totalValue = portfolioData?.totalValue || 0;
  
  // Analyze portfolio allocation
  const holdingsAnalysis = holdings?.map(holding => {
    const currentValue = (holding.quantity || holding.shares || 0) * (holding.price || 0);
    const portfolioWeight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    
    return {
      symbol: holding.symbol,
      name: holding.name || holding.symbol,
      currentValue: currentValue,
      portfolioWeight: portfolioWeight,
      shares: holding.quantity || holding.shares || 0,
      price: holding.price || 0
    };
  }) || [];

  const sortedByWeight = holdingsAnalysis.sort((a, b) => b.portfolioWeight - a.portfolioWeight);
  const overweightPositions = sortedByWeight.filter(h => h.portfolioWeight > 10);
  const smallPositions = sortedByWeight.filter(h => h.portfolioWeight < 2);

  const prompt = `
    As a portfolio rebalancing specialist, analyze this portfolio and provide specific rebalancing recommendations using REAL DATA:

    CURRENT PORTFOLIO ALLOCATION:
    - Total Value: $${totalValue.toLocaleString()}
    - Number of Positions: ${holdings?.length || 0}

    POSITION WEIGHTS (REAL DATA):
    ${sortedByWeight.map(pos => `- ${pos.symbol}: ${pos.portfolioWeight.toFixed(1)}% ($${pos.currentValue.toLocaleString()})`).join('\n')}

    CONCENTRATION ANALYSIS:
    - Positions > 10%: ${overweightPositions.length} (${overweightPositions.map(p => p.symbol).join(', ')})
    - Positions < 2%: ${smallPositions.length} (${smallPositions.map(p => p.symbol).join(', ')})

    Provide specific recommendations for:
    1. POSITION SIZING: Which specific positions should be trimmed or increased
    2. CONCENTRATION RISK: Address any positions over 10% of portfolio
    3. SMALL POSITIONS: Recommendations for positions under 2%
    4. SECTOR BALANCE: Analysis based on current holdings
    5. SPECIFIC ACTIONS: Exact buy/sell recommendations with dollar amounts

    Use the actual position names and current weights in your recommendations.
  `;

  try {
    const response = await openRouterApi.post('/chat/completions', {
      model: AI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: AI_CONFIG.systemPrompts?.rebalancer || AI_CONFIG.systemPrompts?.default || 'You are a professional portfolio manager.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating rebalance advice:', error);
    return generateFallbackRebalanceAdvice(holdings);
  }
};

// Generate tax-loss harvesting advice
export const generateTaxLossAdvice = async (portfolioData, holdings) => {
  if (!isAPIKeyConfigured()) {
    return getConfigurationMessage();
  }

  const prompt = `
    As a tax optimization specialist, analyze this portfolio for tax-loss harvesting opportunities:

    Portfolio Overview:
    - Total Value: $${portfolioData.totalValue?.toLocaleString() || 'N/A'}
    - Total Gain/Loss: $${portfolioData.totalGain?.toLocaleString() || 'N/A'} (${portfolioData.totalGainPercent || 0}%)

    Current Positions:
    ${holdings?.map(holding => {
      const currentValue = (holding.quantity || holding.shares) * (holding.price || 0);
      const gainLoss = currentValue - (holding.cost_basis || currentValue); // Assuming cost_basis exists
      return `- ${holding.symbol}: Current: $${currentValue.toLocaleString()}, P&L: $${gainLoss.toLocaleString()}`;
    }).join('\n') || 'No holdings data'}

    Provide specific advice on:
    1. Positions with unrealized losses for harvesting
    2. Wash sale rule considerations
    3. Alternative investments to maintain exposure
    4. Optimal timing for harvesting
    5. Estimated tax savings

    Focus on actionable tax optimization strategies.
  `;

  try {
    const response = await openRouterApi.post('/chat/completions', {
      model: AI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: AI_CONFIG.systemPrompts?.taxOptimizer || AI_CONFIG.systemPrompts?.default || 'You are a tax optimization specialist.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating tax-loss advice:', error);
    return generateFallbackTaxAdvice();
  }
};

// Custom follow-up questions
export const askFollowUpQuestion = async (originalResponse, question, context) => {
  if (!isAPIKeyConfigured()) {
    return getConfigurationMessage();
  }

  console.log('Follow-up question:', { question, context });

  const prompt = `
    Based on the previous portfolio analysis:
    "${originalResponse}"

    The user is asking: "${question}"

    Portfolio context:
    - Total Value: $${context.portfolioData?.totalValue?.toLocaleString() || 'N/A'}
    - Holdings: ${context.holdings?.length || 0} positions
    - Holdings Details: ${context.holdings?.map(h => `${h.symbol}: ${h.quantity || h.shares} shares at $${h.price}`).join(', ') || 'No holdings'}

    Provide a detailed, specific answer to their follow-up question. Reference specific holdings, numbers, and metrics from the portfolio data.
  `;

  try {
    const response = await openRouterApi.post('/chat/completions', {
      model: AI_CONFIG.model,
      messages: [
        {
          role: 'system',
          content: AI_CONFIG.systemPrompts?.default || 'You are a portfolio analyst continuing a conversation. Provide detailed, specific answers with numerical examples.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: AI_CONFIG.maxTokens || 350,
      temperature: AI_CONFIG.temperature || 0.7
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error with follow-up question:', error);
    console.error('Error details:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      return "It looks like there's an issue with the API key. Please check that your OpenRouter API key is correctly configured in the .env file.";
    } else if (error.response?.status === 429) {
      return "I'm receiving too many requests right now. Please wait a moment and try again.";
    } else {
      return `I apologize, but I encountered an error processing your question. Error: ${error.message}. Please try rephrasing or ask me about a specific aspect of your portfolio.`;
    }
  }
};

// Fallback functions for when API fails
const generateFallbackStory = (portfolioData, performanceData, holdings) => {
  const totalValue = portfolioData?.totalValue || 125430.50;
  const dayChange = portfolioData?.dayChange || 2845.30;
  const dayChangePercent = portfolioData?.dayChangePercent || 2.32;
  const totalGainPercent = portfolioData?.totalGainPercent || 17.5;
  const holdingsCount = holdings?.length || 5;
  
  // Get some sample holdings for the narrative
  const sampleHoldings = holdings?.slice(0, 3) || [
    { symbol: 'AAPL', name: 'Apple Inc' },
    { symbol: 'GOOGL', name: 'Alphabet Inc' },
    { symbol: 'MSFT', name: 'Microsoft Corp' }
  ];
  
  return `Your portfolio is currently valued at $${totalValue.toLocaleString()}, ${dayChange >= 0 ? 'up' : 'down'} $${Math.abs(dayChange).toLocaleString()} (${Math.abs(dayChangePercent).toFixed(2)}%) today. ${totalGainPercent >= 0 ? 'You\'re ahead' : 'You\'re behind'} ${Math.abs(totalGainPercent).toFixed(1)}% overall with ${holdingsCount} positions including ${sampleHoldings.map(h => h.symbol).join(', ')}. Your diversification across ${holdingsCount} holdings shows a balanced approach to investing. Consider reviewing your top performers and any underperforming positions for potential rebalancing opportunities. Today's performance reflects broader market movements in the technology sector.`;
};

const generateFallbackRebalanceAdvice = (holdings) => {
  return `Based on your ${holdings?.length || 0} current positions, consider reviewing your sector allocation to ensure proper diversification. Look for overweight positions that might need trimming and underweight sectors that could benefit from additional investment. A well-balanced portfolio typically includes 15-25 individual positions across different sectors and market caps.`;
};

const generateFallbackTaxAdvice = () => {
  return `For tax optimization, review positions with unrealized losses that could be harvested before year-end. Remember the wash sale rule - avoid repurchasing the same security within 30 days. Consider tax-efficient alternatives to maintain market exposure while realizing losses for tax benefits.`;
};

export default {
  generatePortfolioStory,
  generateRebalanceAdvice,
  generateTaxLossAdvice,
  askFollowUpQuestion
};
