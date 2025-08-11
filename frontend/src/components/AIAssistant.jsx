import React, { useState } from 'react';
import { X, Brain, TrendingUp, Calculator, BookOpen, Send, Loader, MessageCircle } from 'lucide-react';
import { generatePortfolioStory, generateRebalanceAdvice, generateTaxLossAdvice, askFollowUpQuestion, AI_SERVICES } from '../services/aiService';

const AIAssistant = ({ isOpen, onClose, portfolioData, performanceData, holdings }) => {
  const [activeService, setActiveService] = useState(null);
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [followUpQuestion, setFollowUpQuestion] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  const services = [
    {
      id: AI_SERVICES.PORTFOLIO_STORYTELLER,
      title: 'Portfolio Storyteller',
      description: 'Get a compelling narrative summary of your portfolio performance',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-400',
      action: async () => {
        setLoading(true);
        try {
          const story = await generatePortfolioStory(portfolioData, performanceData, holdings);
          setResponse(story);
          setConversationHistory([{ type: 'ai', content: story, service: 'Portfolio Storyteller' }]);
        } catch (error) {
          setResponse('Sorry, I encountered an error generating your portfolio story. Please try again.');
        }
        setLoading(false);
      }
    },
    {
      id: AI_SERVICES.REBALANCE_ADVISOR,
      title: 'Rebalance Advisor',
      description: 'Get personalized portfolio rebalancing recommendations',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-400',
      action: async () => {
        setLoading(true);
        try {
          const advice = await generateRebalanceAdvice(portfolioData, holdings);
          setResponse(advice);
          setConversationHistory([{ type: 'ai', content: advice, service: 'Rebalance Advisor' }]);
        } catch (error) {
          setResponse('Sorry, I encountered an error generating rebalancing advice. Please try again.');
        }
        setLoading(false);
      }
    },
    {
      id: AI_SERVICES.TAX_LOSS_HARVESTING,
      title: 'Tax-Loss Harvesting Assistant',
      description: 'Identify tax optimization opportunities in your portfolio',
      icon: Calculator,
      color: 'from-purple-500 to-pink-400',
      action: async () => {
        setLoading(true);
        try {
          const taxAdvice = await generateTaxLossAdvice(portfolioData, holdings);
          setResponse(taxAdvice);
          setConversationHistory([{ type: 'ai', content: taxAdvice, service: 'Tax-Loss Harvesting' }]);
        } catch (error) {
          setResponse('Sorry, I encountered an error generating tax advice. Please try again.');
        }
        setLoading(false);
      }
    }
  ];

  const handleFollowUpQuestion = async (e) => {
    e.preventDefault();
    if (!followUpQuestion.trim() || !response) return;

    setLoading(true);
    const userQuestion = followUpQuestion;
    setFollowUpQuestion('');

    // Add user question to conversation
    const newHistory = [...conversationHistory, { type: 'user', content: userQuestion }];
    setConversationHistory(newHistory);

    try {
      const context = {
        portfolioData,
        performanceData,
        holdings,
        previousResponse: response
      };
      
      const followUpResponse = await askFollowUpQuestion(response, userQuestion, context);
      
      // Add AI response to conversation
      setConversationHistory([...newHistory, { type: 'ai', content: followUpResponse, service: 'Follow-up' }]);
      setResponse(followUpResponse);
    } catch (error) {
      setConversationHistory([...newHistory, { 
        type: 'ai', 
        content: 'Sorry, I had trouble understanding your question. Could you please rephrase it?',
        service: 'Follow-up'
      }]);
    }
    setLoading(false);
  };

  const resetConversation = () => {
    setActiveService(null);
    setResponse('');
    setConversationHistory([]);
    setFollowUpQuestion('');
  };

  if (!isOpen) return null;

  return (
    <div className="stock-flyout-overlay-2025">
      <div className="stock-flyout-container-2025">
        {/* Header */}
        <div className="stock-flyout-header-2025">
          <button
            onClick={onClose}
            className="stock-flyout-close-2025"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="stock-flyout-header-content-2025">
            <div className="stock-flyout-header-left-2025">
              <div className="stock-flyout-title-row-2025">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="stock-flyout-symbol-2025">AI Assistant</h2>
                  <p className="stock-flyout-name-2025">Powered by advanced AI analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="stock-flyout-body-2025">
          <div className="grid grid-cols-12 gap-6 h-full">
            {/* Services Sidebar - Narrower */}
            <div className="col-span-3">
              <section className="card-2025 stock-flyout-metrics-card-2025 h-full">
                <h3 className="stock-flyout-section-title-2025">
                  <Brain className="h-5 w-5" style={{color: 'var(--color-neon-blue)'}} />
                  AI Services
                </h3>
                <ul className="stock-flyout-metrics-list-2025">
                  {services.map((service) => (
                    <li 
                      key={service.id} 
                      className={`stock-flyout-metric-item-2025 cursor-pointer transition-all duration-200 hover:bg-white/5 ${
                        activeService === service.id ? 'bg-white/10' : ''
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      onClick={() => {
                        if (!loading) {
                          setActiveService(service.id);
                          service.action();
                        }
                      }}
                    >
                      <span className="stock-flyout-metric-label-2025 flex items-center">
                        <div className={`w-6 h-6 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center flex-shrink-0 mr-3`}>
                          <service.icon className="h-3 w-3 text-white" />
                        </div>
                        <span>{service.title}</span>
                      </span>
                      <span className="stock-flyout-metric-value-2025">
                        {activeService === service.id && loading ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          '▶'
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            {/* Response Area - Wider */}
            <div className="col-span-9">
              <section className="card-2025 stock-flyout-trade-card-2025" style={{ height: '500px', display: 'flex', flexDirection: 'column' }}>
                <h3 className="stock-flyout-section-title-2025">
                  <MessageCircle className="h-5 w-5" style={{color: 'var(--color-neon-green)'}} />
                  AI Conversation
                </h3>
                
                <div className="flex-1 overflow-y-auto" style={{ minHeight: 0, padding: 0 }}>
                  {!response && !loading && (
                    <div className="h-full flex items-center justify-center px-6">
                      <div className="text-center">
                        <Brain className="h-16 w-16 text-white/40 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">AI Portfolio Assistant</h3>
                        <p className="text-white/60 max-w-md">
                          Select an AI service from the sidebar to get personalized insights about your portfolio.
                          I can help you understand your performance, optimize your allocation, and identify tax opportunities.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Conversation History */}
                  {conversationHistory.length > 0 && (
                    <div className="space-y-6" style={{ padding: '24px' }}>
                      {conversationHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-2xl ${
                              message.type === 'user'
                                ? 'bg-blue-500/20 border border-blue-400/30'
                                : 'bg-white/10 border border-white/20'
                            }`}
                            style={{ padding: '32px' }}
                          >
                            {message.type === 'ai' && message.service && (
                              <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-white/20">
                                <MessageCircle className="h-4 w-4 text-blue-400" />
                                <span className="text-blue-400 text-sm font-medium">{message.service}</span>
                              </div>
                            )}
                            <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Loading indicator */}
                  {loading && (
                    <div className="flex items-center justify-center py-8">
                      <div className="text-center">
                        <Loader className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
                        <p className="text-white/70">Analyzing your portfolio...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Follow-up Question Input - Always Visible */}
                <div className="p-4 border-t border-white/20 bg-white/5 flex-shrink-0">
                  <form onSubmit={handleFollowUpQuestion} className="flex space-x-3">
                    <input
                      type="text"
                      value={followUpQuestion}
                      onChange={(e) => setFollowUpQuestion(e.target.value)}
                      placeholder="Ask a follow-up question about your portfolio..."
                      className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      disabled={!followUpQuestion.trim() || loading}
                      className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
                    >
                      <Send className="h-4 w-4" />
                      <span>Ask</span>
                    </button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
