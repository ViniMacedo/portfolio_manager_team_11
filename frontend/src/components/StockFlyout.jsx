import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, LineChart, BarChart3, Plus, Minus, Activity, DollarSign, Target, Zap } from 'lucide-react';
import {
  formatMarketCap, formatVolume, formatCurrency, formatPercentage,
  safeNumber, isValidPositiveNumber, getCurrentTimestamp, isMarketOpen
} from '../utils/globalUtils';

const FlyoutChip = ({ tone='neutral', children }) => {
  const tones = {
    neutral: 'flyout-chip-2025 flyout-chip-neutral-2025',
    good: 'flyout-chip-2025 flyout-chip-good-2025',
    bad: 'flyout-chip-2025 flyout-chip-bad-2025',
  };
  return (
    <span className={tones[tone]}>
      {children}
    </span>
  );
};

const StockFlyout = ({ stock, onClose, onTradeStock, holdings = [], userBalance = 0 }) => {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const currentHolding = holdings.find(h => h.symbol === stock.symbol);
  const currentShares = safeNumber(currentHolding?.shares, 0);
  const stockPrice = safeNumber(stock.price, 0);
  const stockChange = safeNumber(stock.change, 0);
  const changePct = safeNumber(stock.changePercent, 0);
  const totalPrice = stockPrice * quantity;
  const positionValue = currentShares * stockPrice;
  const balance = safeNumber(userBalance, 0);
  const live = isMarketOpen();

  const inc = () => setQuantity(q => q + 1);
  const dec = () => setQuantity(q => Math.max(1, q - 1));
  const onQty = (e) => {
    const v = parseInt(e.target.value || '1', 10);
    setQuantity(Math.max(1, Number.isFinite(v) ? v : 1));
  };

  const buy = () => onTradeStock?.(stock.symbol, 'BUY', quantity, stockPrice);
  const sell = () => onTradeStock?.(stock.symbol, 'SELL', quantity, stockPrice);
  const onBackdrop = (e) => { if (e.target === e.currentTarget) onClose?.(); };

  const momentum = changePct >= 2 ? {label:'Strong Bullish', cls:'bg-emerald-400'} :
                   changePct >= 0 ? {label:'Bullish', cls:'bg-amber-300'} :
                                    {label:'Bearish', cls:'bg-rose-400'};

  return (
    <div onClick={onBackdrop} className="stock-flyout-overlay-2025">
      <div className="stock-flyout-container-2025">
        {/* HEADER */}
        <div className="stock-flyout-header-2025">
          <button onClick={onClose} aria-label="Close" className="stock-flyout-close-2025">
            <X className="h-5 w-5" />
          </button>

          <div className="stock-flyout-header-content-2025">
            <div className="stock-flyout-header-left-2025">
              <div className="stock-flyout-title-row-2025">
                <h2 className="stock-flyout-symbol-2025">{stock.symbol}</h2>
                <FlyoutChip tone={live ? 'good' : 'bad'}>
                  <span className={`stock-flyout-status-dot-2025 ${live ? 'animate-pulse' : ''}`} style={{
                    backgroundColor: live ? 'var(--color-neon-green)' : 'var(--color-neon-red)'
                  }} />
                  {live ? 'LIVE' : 'CLOSED'}
                </FlyoutChip>
              </div>
              <p className="stock-flyout-name-2025">{stock.name}</p>
              <p className="stock-flyout-sector-2025">{stock.sector || 'Technology'}</p>

              {currentShares > 0 && (
                <div className="stock-flyout-holdings-2025">
                  <Activity className="h-4 w-4" />
                  You own {currentShares.toLocaleString()} shares · Value: {formatCurrency(positionValue)}
                </div>
              )}
            </div>

            <div className="stock-flyout-header-right-2025">
              <div className="stock-flyout-price-2025">{formatCurrency(stockPrice)}</div>
              <div className={`stock-flyout-change-2025 ${changePct >= 0 ? 'positive-2025' : 'negative-2025'}`}>
                {changePct >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                {formatPercentage(changePct)} ({formatCurrency(stockChange, 2)})
              </div>
              <div className="stock-flyout-timestamp-2025">Last updated: {getCurrentTimestamp()}</div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="stock-flyout-body-2025">
          <div className="stock-flyout-grid-2025">
            {/* LEFT: Metrics */}
            <div className="stock-flyout-metrics-column-2025">
              <section className="card-2025 stock-flyout-metrics-card-2025">
                <h3 className="stock-flyout-section-title-2025">
                  <BarChart3 className="h-5 w-5" style={{color: 'var(--color-neon-blue)'}} />
                  Key Metrics
                </h3>
                <ul className="stock-flyout-metrics-list-2025">
                  {[
                    ['Market Cap', formatMarketCap(stock.marketCap)],
                    ['Volume', formatVolume(stock.volume)],
                    ['Sector', stock.sector || 'Technology'],
                    ['P/E Ratio', (stock.peRatio && stock.peRatio !== 'N/A') ? safeNumber(stock.peRatio).toFixed(2) : 'N/A'],
                    ['52W Low', (stock.fiftyTwoWeekLow && stock.fiftyTwoWeekLow !== 'N/A') ? formatCurrency(safeNumber(stock.fiftyTwoWeekLow)) : 'N/A'],
                    ['52W High', (stock.fiftyTwoWeekHigh && stock.fiftyTwoWeekHigh !== 'N/A') ? formatCurrency(safeNumber(stock.fiftyTwoWeekHigh)) : 'N/A'],
                    ['Dividend', formatCurrency(safeNumber(stock.dividend, 0))],
                  ].map(([k,v]) => (
                    <li key={k} className="stock-flyout-metric-item-2025">
                      <span className="stock-flyout-metric-label-2025">{k}</span>
                      <span className="stock-flyout-metric-value-2025">{v}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="card-2025 stock-flyout-ai-card-2025">
                <h4 className="stock-flyout-ai-title-2025">🤖 AI Analysis</h4>
                <ul className="stock-flyout-ai-list-2025">
                  <li className="stock-flyout-ai-item-2025">
                    <span className="stock-flyout-momentum-dot-2025" style={{backgroundColor: momentum.cls === 'bg-emerald-400' ? 'var(--color-neon-green)' : momentum.cls === 'bg-amber-300' ? 'var(--color-neon-yellow)' : 'var(--color-neon-red)'}} />
                    <span className="stock-flyout-ai-label-2025">{momentum.label} Momentum</span>
                  </li>
                  <li className="stock-flyout-ai-item-2025">
                    <span className="stock-flyout-momentum-dot-2025" style={{backgroundColor: 'var(--color-neon-purple)'}} />
                    <span className="stock-flyout-ai-label-2025">{changePct >= 0 ? 'Recommended Buy' : 'Hold Position'}</span>
                  </li>
                </ul>
                <div className="stock-flyout-confidence-2025">
                  <div className="stock-flyout-confidence-label-2025">AI Confidence</div>
                  <div className="stock-flyout-confidence-bar-2025">
                    <div className="stock-flyout-confidence-fill-2025" style={{ width: `${Math.min(85, Math.max(15, 50 + changePct))}%` }} />
                  </div>
                  <div className="stock-flyout-confidence-value-2025">
                    {Math.min(85, Math.max(15, 50 + changePct)).toFixed(0)}%
                  </div>
                </div>
              </section>
            </div>

            {/* CENTER: Chart + summary */}
            <section className="card-2025 stock-flyout-chart-card-2025">
              <h3 className="stock-flyout-section-title-2025">
                <LineChart className="h-5 w-5" style={{color: 'var(--color-neon-green)'}} />
                Price Chart
              </h3>
              <div className="stock-flyout-chart-container-2025">
                {/* Ghost Chart Design */}
                <div className="stock-flyout-ghost-chart-2025">
                  <div className="stock-flyout-ghost-grid-2025">
                    {/* Horizontal grid lines */}
                    {[...Array(5)].map((_, i) => (
                      <div key={`h-${i}`} className="stock-flyout-ghost-line-horizontal-2025" style={{top: `${i * 25}%`}} />
                    ))}
                    {/* Vertical grid lines */}
                    {[...Array(7)].map((_, i) => (
                      <div key={`v-${i}`} className="stock-flyout-ghost-line-vertical-2025" style={{left: `${i * 16.66}%`}} />
                    ))}
                  </div>
                  
                  {/* Ghost price line */}
                  <svg className="stock-flyout-ghost-svg-2025" viewBox="0 0 300 150">
                    <defs>
                      <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{stopColor: 'var(--color-neon-blue)', stopOpacity: 0.3}} />
                        <stop offset="100%" style={{stopColor: 'var(--color-neon-blue)', stopOpacity: 0.05}} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 120 Q 50 100 80 90 T 150 75 Q 200 70 250 65 T 290 60"
                      stroke="var(--color-neon-blue)"
                      strokeWidth="2"
                      fill="none"
                      className="stock-flyout-ghost-path-2025"
                    />
                    <path
                      d="M 10 120 Q 50 100 80 90 T 150 75 Q 200 70 250 65 T 290 60 L 290 150 L 10 150 Z"
                      fill="url(#ghostGradient)"
                      className="stock-flyout-ghost-fill-2025"
                    />
                  </svg>
                  
                  {/* Coming Soon Overlay */}
                  <div className="stock-flyout-chart-overlay-2025">
                    <LineChart className="stock-flyout-chart-icon-2025" />
                    <p className="stock-flyout-chart-title-2025">Real-time charts coming soon</p>
                    <p className="stock-flyout-chart-subtitle-2025">Live market data integration in progress</p>
                  </div>
                </div>
              </div>
              <div className="stock-flyout-chart-stats-2025">
                {[
                  ['Day Range', `${formatCurrency(stockPrice * 0.98)} – ${formatCurrency(stockPrice * 1.02)}`],
                  ['Open', `${formatCurrency(stockPrice * 0.995)}`],
                  ['Prev Close', `${formatCurrency(stockPrice - stockChange)}`],
                  ['Avg Volume', `${formatVolume(stock.volume)}`],
                ].map(([k,v]) => (
                  <div key={k} className="stock-flyout-stat-card-2025">
                    <div className="stock-flyout-stat-label-2025">{k}</div>
                    <div className="stock-flyout-stat-value-2025">{v}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* RIGHT: Trade */}
            <div className="stock-flyout-trade-column-2025">
              <section className="card-2025 stock-flyout-trade-card-2025">
                <h3 className="stock-flyout-trade-title-2025">
                  <Zap className="h-5 w-5" style={{color: 'var(--color-neon-yellow)'}} />
                  Trade Quantity
                </h3>
                <div className="stock-flyout-quantity-control-2025">
                  <button onClick={dec} aria-label="Decrease" className="stock-flyout-quantity-btn-2025 stock-flyout-quantity-btn-left-2025">
                    <Minus className="h-4 w-4" />
                  </button>
                  <input 
                    type="number" 
                    min={1} 
                    value={quantity} 
                    onChange={onQty}
                    className="stock-flyout-quantity-input-2025"
                  />
                  <button onClick={inc} aria-label="Increase" className="stock-flyout-quantity-btn-2025 stock-flyout-quantity-btn-right-2025">
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="stock-flyout-total-display-2025">
                  <div className="stock-flyout-total-amount-2025">Total: {formatCurrency(totalPrice)}</div>
                  <div className="stock-flyout-total-breakdown-2025">{quantity.toLocaleString()} × {formatCurrency(stockPrice)}</div>
                </div>
                <div className="stock-flyout-quick-amounts-2025">
                  {[10, 50, 100].map(n => (
                    <button 
                      key={n} 
                      onClick={() => setQuantity(n)} 
                      className={`stock-flyout-quick-btn-2025 ${quantity === n ? 'active' : ''}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </section>

              <div className="stock-flyout-trade-actions-2025">
                <button 
                  onClick={buy} 
                  disabled={totalPrice > balance}
                  className={`stock-flyout-trade-btn-2025 ${totalPrice > balance 
                    ? 'stock-flyout-btn-disabled-2025' 
                    : 'stock-flyout-btn-buy-2025'}`}
                >
                  <div className="stock-flyout-btn-content-2025">
                    <span className="stock-flyout-btn-main-2025">
                      <Plus className="h-5 w-5" />
                      Buy {quantity.toLocaleString()} {stock.symbol}
                    </span>
                    <div className="stock-flyout-btn-sub-2025">
                      {totalPrice > balance ? 'Insufficient balance' : `Total: ${formatCurrency(totalPrice)}`}
                    </div>
                  </div>
                </button>

                <button 
                  onClick={sell} 
                  disabled={quantity > currentShares || currentShares === 0}
                  className={`stock-flyout-trade-btn-2025 ${(quantity > currentShares || currentShares === 0)
                    ? 'stock-flyout-btn-disabled-2025' 
                    : 'stock-flyout-btn-sell-2025'}`}
                >
                  <div className="stock-flyout-btn-content-2025">
                    <span className="stock-flyout-btn-main-2025">
                      <TrendingDown className="h-5 w-5" />
                      Sell {quantity.toLocaleString()} {stock.symbol}
                    </span>
                    <div className="stock-flyout-btn-sub-2025">
                      {currentShares === 0 ? 'No shares owned'
                        : quantity > currentShares ? `Max: ${currentShares.toLocaleString()} shares`
                        : `Receive: ${formatCurrency(totalPrice)}`}
                    </div>
                  </div>
                </button>

                <div className="stock-flyout-balance-2025">
                  <DollarSign className="h-4 w-4" />
                  Balance: {formatCurrency(balance)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockFlyout;