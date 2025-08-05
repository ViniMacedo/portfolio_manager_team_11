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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 p-6 border-b border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AI Portfolio Assistant</h2>
                <p className="text-white/70 text-sm">Powered by advanced AI analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-[600px]">
          {/* Services Sidebar */}
          <div className="w-80 bg-white/5 border-r border-white/20 p-4 overflow-y-auto">
            <h3 className="text-lg font-semibold text-white mb-4">AI Services</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service.id}
                  onClick={() => {
                    setActiveService(service.id);
                    service.action();
                  }}
                  disabled={loading}
                  className={`w-full p-4 rounded-xl border transition-all duration-200 text-left group ${
                    activeService === service.id
                      ? 'bg-white/15 border-white/30'
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${service.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <service.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-semibold text-white text-sm group-hover:text-cyan-200 transition-colors">
                        {service.title}
                      </h4>
                      <p className="text-white/60 text-xs mt-1 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {(response || conversationHistory.length > 0) && (
              <div className="mt-6 pt-4 border-t border-white/20">
                <button
                  onClick={resetConversation}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all duration-200 border border-white/20"
                >
                  Start New Conversation
                </button>
              </div>
            )}
          </div>

          {/* Response Area */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              {!response && !loading && (
                <div className="h-full flex items-center justify-center">
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
                <div className="space-y-4">
                  {conversationHistory.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-4 rounded-2xl ${
                          message.type === 'user'
                            ? 'bg-blue-500/20 border border-blue-400/30'
                            : 'bg-white/10 border border-white/20'
                        }`}
                      >
                        {message.type === 'ai' && message.service && (
                          <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-white/20">
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

              {/* Loading indicator - positioned after conversation history */}
              {loading && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <Loader className="h-8 w-8 text-blue-400 animate-spin mx-auto mb-4" />
                    <p className="text-white/70">Analyzing your portfolio...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Follow-up Question Input */}
            {response && !loading && (
              <div className="p-4 border-t border-white/20 bg-white/5">
                <form onSubmit={handleFollowUpQuestion} className="flex space-x-3">
                  <input
                    type="text"
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    placeholder="Ask a follow-up question about your portfolio..."
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-transparent"
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
