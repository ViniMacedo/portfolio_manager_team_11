// AI Configuration Settings
// You can modify these settings to customize the AI Assistant behavior

export const AI_CONFIG = {
  model: 'cognitivecomputations/dolphin-mistral-24b-venice-edition:free', // Working free model 

  // Response Settings
  maxTokens: 300,     // max response length
  temperature: 0.2,   // Creativity level: 0.0 = deterministic, 1.0 = creative

  // System Prompts - Custom
  systemPrompts: {
    default: 'You are a professional portfolio analyst and financial advisor with expertise in investment analysis, risk management, and tax optimization. Provide clear, actionable insights in a conversational yet professional tone.',
    
    storyteller: 'You are a senior portfolio analyst who excels at creating compelling narratives about investment performance. Focus on concrete numbers, specific holdings, and actionable insights.',
    
    rebalancer: 'You are a portfolio rebalancing specialist with expertise in asset allocation, risk management, and position sizing. Provide specific, actionable recommendations with exact percentages and dollar amounts.',
    
    taxOptimizer: 'You are a tax optimization specialist with deep knowledge of tax-loss harvesting, wash sale rules, and tax-efficient investing strategies. Focus on specific, actionable tax-saving opportunities.'
  },

  // API Settings
  timeout: 30000,     // Request timeout in ms
  retryAttempts: 2,   // # retries

  // Response Formatting
  responseFormat: {
    useMarkdown: false,
    includeSourceData: false,
    maxSentenceLength: 50
  },

  // Cost Management
  costLimits: {
    enableLimits: false,      // Enable cost tracking and limits
    maxDailyCost: 5.00,       // Maximum daily cost in USD
    warningThreshold: 3.00    // Warning threshold in USD
  }
};

// Model Information for Reference
export const AVAILABLE_MODELS = {
  'anthropic/claude-3.5-sonnet': {
    name: 'Claude 3.5 Sonnet',
    description: 'Excellent for analysis and reasoning',
    inputCost: '$3.00 per 1M tokens',
    outputCost: '$15.00 per 1M tokens',
    contextWindow: '200k tokens',
    recommended: true
  },
  'openai/gpt-4o': {
    name: 'GPT-4 Omni',
    description: 'Great all-around model',
    inputCost: '$5.00 per 1M tokens',
    outputCost: '$15.00 per 1M tokens',
    contextWindow: '128k tokens'
  },
  'meta-llama/llama-3.1-8b-instruct': {
    name: 'Llama 3.1 8B',
    description: 'Budget-friendly option',
    inputCost: '$0.18 per 1M tokens',
    outputCost: '$0.18 per 1M tokens',
    contextWindow: '131k tokens'
  }
};

// Usage Tips
export const USAGE_TIPS = {
  temperature: {
    low: '0.1-0.3: For factual analysis and consistent responses',
    medium: '0.4-0.7: Balanced creativity and accuracy (recommended)',
    high: '0.8-1.0: For creative storytelling and diverse responses'
  },
  maxTokens: {
    short: '150-250: Concise summaries',
    medium: '300-500: Detailed analysis (recommended)',
    long: '600-1000: Comprehensive reports'
  }
};

export default AI_CONFIG;
