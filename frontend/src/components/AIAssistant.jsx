import React, { useState } from 'react';
import { X, Brain, TrendingUp, Calculator, BookOpen, Send, Loader, MessageCircle } from 'lucide-react';
import { generatePortfolioStory, generateRebalanceAdvice, generateTaxLossAdvice, askFollowUpQuestion, AI_SERVICES } from '../services/aiService';

const ServiceItem = ({ id, icon: Icon, title, description, selected, disabled, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    aria-pressed={selected}
    className={[
      "w-full min-h-[88px] p-4 rounded-xl border text-left transition-all duration-150",
      selected
        ? "bg-white/15 border-white/20 ring-1 ring-[color:var(--color-neon-purple)]/30 shadow-[0_6px_18px_rgba(0,0,0,0.25)]"
        : "bg-white/10 border-white/15 hover:bg-white/12 hover:border-white/20 hover:shadow-[0_8px_22px_rgba(0,0,0,0.25)]",
      disabled ? "opacity-50 cursor-not-allowed" : ""
    ].join(" ")}
  >
    <div className="grid grid-cols-[40px_1fr] gap-3 items-center">
      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
        style={{ background: 'linear-gradient(135deg,var(--color-neon-purple),var(--color-neon-blue))' }}
      >
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="min-w-0">
        <div className="text-white font-semibold text-sm leading-[1.2] truncate">{title}</div>
        <div className="text-white/70 text-xs leading-relaxed line-clamp-2">
          {description}
        </div>
      </div>
    </div>
  </button>
);

const AIAssistant = ({ isOpen, onClose, portfolioData, performanceData, holdings, onAIError, onAISuccess }) => {
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
          onAISuccess && onAISuccess();
        } catch (error) {
          const errorMessage = 'Sorry, I encountered an error generating your portfolio story. Please try again.';
          setResponse(errorMessage);
          onAIError && onAIError(error.message || 'Portfolio story generation failed');
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
          onAISuccess && onAISuccess();
        } catch (error) {
          const errorMessage = 'Sorry, I encountered an error generating rebalancing advice. Please try again.';
          setResponse(errorMessage);
          onAIError && onAIError(error.message || 'Rebalancing advice generation failed');
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
          onAISuccess && onAISuccess();
        } catch (error) {
          const errorMessage = 'Sorry, I encountered an error generating tax advice. Please try again.';
          setResponse(errorMessage);
          onAIError && onAIError(error.message || 'Tax advice generation failed');
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
      onAISuccess && onAISuccess();
    } catch (error) {
      const errorMessage = 'Sorry, I had trouble understanding your question. Could you please rephrase it?';
      setConversationHistory([...newHistory, { 
        type: 'ai', 
        content: errorMessage,
        service: 'Follow-up'
      }]);
      onAIError && onAIError(error.message || 'Follow-up question failed');
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="AI Portfolio Assistant"
        className="relative z-[61] w-[min(92vw,1100px)] h-[min(80vh,740px)] bg-white/10 backdrop-blur-xl rounded-2xl border border-white/12 shadow-[0_12px_40px_rgba(0,0,0,0.35)] overflow-hidden"
      >
        {/* Header */}
        <div
          className="relative px-6 py-4 border-b border-white/10"
          style={{ background: 'linear-gradient(135deg,var(--color-neon-purple),var(--color-neon-blue))' }}
        >
          <div className="relative flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm"
                style={{ background: 'linear-gradient(135deg,var(--color-neon-purple),var(--color-neon-blue))' }}
              >
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white tracking-wide">AI Portfolio Assistant</h2>
                <p className="text-white/85 text-xs leading-relaxed">Powered by advanced AI analysis</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center transition-all duration-150 border border-white/25 focus:outline-none focus:ring-2 focus:ring-white/60"
            >
              <X className="h-5 w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-[20rem_1fr] h-[calc(100%-56px)] divide-x divide-white/10">
          {/* Services Sidebar */}
          <aside className="bg-white/5 p-5 overflow-y-auto">
            <div className="flex flex-col gap-3">
              {services.map((s) => (
                <ServiceItem
                  key={s.id}
                  id={s.id}
                  icon={s.icon}
                  title={s.title}
                  description={s.description}
                  selected={activeService === s.id}
                  disabled={loading}
                  onClick={() => { setActiveService(s.id); s.action(); }}
                />
              ))}
            </div>

            {(response || conversationHistory.length > 0) && (
              <div className="mt-6 pt-4 border-t border-white/12">
                <button
                  onClick={resetConversation}
                  className="w-full px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white text-sm transition-all duration-150 border border-white/20"
                >
                  Start New Conversation
                </button>
              </div>
            )}
          </aside>

          {/* Response Area */}
          <section className="flex-1 flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto">
              {!response && !loading && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-xl mx-auto">
                    <Brain className="h-16 w-16 text-white/40 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">AI Portfolio Assistant</h3>
                    <p className="text-white/80 text-sm leading-relaxed">
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
                      <div className={`max-w-[80%] p-4 rounded-2xl border ${
                        message.type === 'user'
                          ? 'bg-blue-500/15 border-blue-400/30'
                          : 'bg-white/10 border-white/20'
                      } shadow-[0_6px_18px_rgba(0,0,0,0.25)]`}>
                        {message.type === 'ai' && message.service && (
                          <div className="flex items-center space-x-2 mb-2 pb-2 border-b border-white/12">
                            <MessageCircle className="h-4 w-4 text-blue-400" />
                            <span className="text-blue-400 text-xs font-medium">{message.service}</span>
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
                    <p className="text-white/80">Analyzing your portfolio...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Follow-up Question Input */}
            {response && !loading && (
              <div className="p-4 border-t border-white/12 bg-white/5">
                <form onSubmit={handleFollowUpQuestion} className="flex space-x-3">
                  <input
                    type="text"
                    value={followUpQuestion}
                    onChange={(e) => setFollowUpQuestion(e.target.value)}
                    placeholder="Ask a follow-up question about your portfolio..."
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-[color:var(--color-neon-blue)]/50 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    disabled={!followUpQuestion.trim() || loading}
                    className="px-6 py-3 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 flex items-center space-x-2 shadow-[0_6px_16px_rgba(0,0,0,0.25)]"
                    style={{ background: 'linear-gradient(135deg,var(--color-neon-purple),var(--color-neon-blue))' }}
                  >
                    <Send className="h-4 w-4" />
                    <span>Ask</span>
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
