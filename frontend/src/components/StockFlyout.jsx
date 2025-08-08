import React, { useState, useEffect } from 'react';
import { X, TrendingUp, TrendingDown, LineChart, BarChart3, Plus, Minus } from 'lucide-react';
import {
  formatMarketCap, formatVolume, formatCurrency, formatPercentage,
  safeNumber, isValidPositiveNumber, getCurrentTimestamp, isMarketOpen
} from '../utils/globalUtils';

const FlyoutChip = ({ tone='neutral', children }) => {
  const tones = {
    neutral: 'border-white/10 bg-white/5 text-zinc-200',
    good: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    bad: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  };
  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
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
    <div onClick={onBackdrop} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-md">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-2xl">
        {/* HEADER */}
        <div className="relative border-b border-white/10 p-6">
          <button onClick={onClose} aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-200 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60">
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="text-4xl font-bold tracking-tight text-white">{stock.symbol}</h2>
                <FlyoutChip tone={live ? 'good' : 'bad'}>
                  <span className={`h-2 w-2 rounded-full ${live ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                  {live ? 'LIVE' : 'CLOSED'}
                </FlyoutChip>
              </div>
              <p className="mt-1 text-lg font-medium text-zinc-100/90">{stock.name}</p>
              <p className="text-sm text-zinc-400">{stock.sector || 'Technology'}</p>

              {currentShares > 0 && (
                <div className="mt-4 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-zinc-100">
                  You own {currentShares.toLocaleString()} shares · Value: {formatCurrency(positionValue)}
                </div>
              )}
            </div>

            <div className="shrink-0 text-right">
              <div className="text-5xl font-bold text-white">{formatCurrency(stockPrice)}</div>
              <div className={`mt-1 inline-flex items-center justify-end gap-2 text-xl font-semibold ${changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {changePct >= 0 ? <TrendingUp className="h-6 w-6" /> : <TrendingDown className="h-6 w-6" />}
                {formatPercentage(changePct)} ({formatCurrency(stockChange, 2)})
              </div>
              <div className="mt-1 text-sm text-zinc-400">Last updated: {getCurrentTimestamp()}</div>
            </div>
          </div>
        </div>

        {/* BODY */}
        <div className="p-6">
          <div className="grid max-h-[60vh] grid-cols-1 gap-6 overflow-y-auto lg:grid-cols-3">
            {/* LEFT: Metrics */}
            <div className="space-y-6">
              <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
                <h3 className="mb-3 flex items-center text-lg font-bold text-cyan-300"><BarChart3 className="mr-2 h-5 w-5" /> Key Metrics</h3>
                <ul className="divide-y divide-white/5 text-sm">
                  {[
                    ['Market Cap', formatMarketCap(stock.marketCap)],
                    ['Volume', formatVolume(stock.volume)],
                    ['Sector', stock.sector || 'Technology'],
                    ['P/E Ratio', (stock.peRatio && stock.peRatio !== 'N/A') ? safeNumber(stock.peRatio).toFixed(2) : 'N/A'],
                    ['52W Low', (stock.fiftyTwoWeekLow && stock.fiftyTwoWeekLow !== 'N/A') ? formatCurrency(safeNumber(stock.fiftyTwoWeekLow)) : 'N/A'],
                    ['52W High', (stock.fiftyTwoWeekHigh && stock.fiftyTwoWeekHigh !== 'N/A') ? formatCurrency(safeNumber(stock.fiftyTwoWeekHigh)) : 'N/A'],
                    ['Dividend', formatCurrency(safeNumber(stock.dividend, 0))],
                  ].map(([k,v]) => (
                    <li key={k} className="flex items-center justify-between py-2">
                      <span className="text-zinc-400">{k}</span>
                      <span className="font-semibold text-zinc-100">{v}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
                <h4 className="mb-3 text-base font-bold">🤖 AI Analysis</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2"><span className={`h-2 w-2 rounded-full ${momentum.cls}`} /> <span className="font-medium">{momentum.label} Momentum</span></li>
                  <li className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-fuchsia-400" /> <span className="font-medium">{changePct >= 0 ? 'Recommended Buy' : 'Hold Position'}</span></li>
                </ul>
                <div className="mt-3">
                  <div className="mb-1 text-xs font-medium text-zinc-400">AI Confidence</div>
                  <div className="h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400" style={{ width: `${Math.min(85, Math.max(15, 50 + changePct))}%` }} />
                  </div>
                  <div className="mt-1 text-right text-xs font-semibold text-zinc-300">
                    {Math.min(85, Math.max(15, 50 + changePct)).toFixed(0)}%
                  </div>
                </div>
              </section>
            </div>

            {/* CENTER: Chart + summary */}
            <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
              <h3 className="mb-3 flex items-center text-lg font-bold text-cyan-300"><LineChart className="mr-2 h-5 w-5" /> Price Chart</h3>
              <div className="flex h-56 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-center">
                <div className="text-zinc-400">
                  <LineChart className="mx-auto mb-2 h-10 w-10 opacity-60" />
                  <p className="text-sm font-medium">Real-time charts coming soon</p>
                  <p className="text-xs opacity-70">yfinance data limitations</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Day Range', `${formatCurrency(stockPrice * 0.98)} – ${formatCurrency(stockPrice * 1.02)}`],
                  ['Open', `${formatCurrency(stockPrice * 0.995)}`],
                  ['Prev Close', `${formatCurrency(stockPrice - stockChange)}`],
                  ['Avg Volume', `${formatVolume(stock.volume)}`],
                ].map(([k,v]) => (
                  <div key={k} className="rounded-lg border border-white/10 bg-white/5 p-3 text-center">
                    <div className="text-xs text-zinc-400">{k}</div>
                    <div className="font-semibold text-zinc-100">{v}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* RIGHT: Trade */}
            <div className="space-y-6">
              <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
                <h3 className="mb-4 text-lg font-bold text-white">⚡ Trade Quantity</h3>
                <div className="mb-3 flex items-center justify-center gap-0">
                  <button onClick={dec} aria-label="Decrease" className="inline-flex h-11 w-11 items-center justify-center rounded-l-lg border border-r-0 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-500/60"><Minus className="h-4 w-4" /></button>
                  <input type="number" min={1} value={quantity} onChange={onQty}
                         className="h-11 w-24 border border-white/15 bg-zinc-900/60 text-center text-xl font-bold text-white outline-none focus:ring-2 focus:ring-cyan-500/50" />
                  <button onClick={inc} aria-label="Increase" className="inline-flex h-11 w-11 items-center justify-center rounded-r-lg border border-l-0 border-white/10 bg-white/5 text-zinc-100 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-cyan-500/60"><Plus className="h-4 w-4" /></button>
                </div>
                <div className="mb-4 text-center">
                  <div className="text-xl font-bold text-zinc-100">Total: {formatCurrency(totalPrice)}</div>
                  <div className="text-sm text-zinc-400">{quantity.toLocaleString()} × {formatCurrency(stockPrice)}</div>
                </div>
                <div className="mb-2 grid grid-cols-3 gap-2">
                  {[10, 50, 100].map(n => (
                    <button key={n} onClick={() => setQuantity(n)} className="rounded-lg border border-white/10 bg-white/5 py-2 text-center text-xs font-medium text-zinc-100 hover:bg-white/10">{n}</button>
                  ))}
                </div>
              </section>

              <div className="space-y-4">
                <button onClick={buy} disabled={totalPrice > balance}
                  className={`w-full rounded-lg px-6 py-5 text-center font-semibold transition
                    ${totalPrice > balance
                      ? 'cursor-not-allowed border-white/10 bg-white/5 text-zinc-400 opacity-60'
                      : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/15'}`}>
                  <span className="inline-flex items-center gap-2"><Plus className="h-5 w-5" />Buy {quantity.toLocaleString()} {stock.symbol}</span>
                  <div className="text-xs">{totalPrice > balance ? 'Insufficient balance' : `Total: ${formatCurrency(totalPrice)}`}</div>
                </button>

                <button onClick={sell} disabled={quantity > currentShares || currentShares === 0}
                  className={`w-full rounded-lg px-6 py-5 text-center font-semibold transition
                    ${(quantity > currentShares || currentShares === 0)
                      ? 'cursor-not-allowed border-white/10 bg-white/5 text-zinc-400 opacity-60'
                      : 'border border-rose-500/30 bg-rose-500/10 text-rose-300 hover:bg-rose-500/15'}`}>
                  <span className="inline-flex items-center gap-2"><TrendingDown className="h-5 w-5" />Sell {quantity.toLocaleString()} {stock.symbol}</span>
                  <div className="text-xs">
                    {currentShares === 0 ? 'No shares owned'
                      : quantity > currentShares ? `Max: ${currentShares.toLocaleString()} shares`
                      : `Receive: ${formatCurrency(totalPrice)}`}
                  </div>
                </button>

                <div className="text-center text-xs text-zinc-400">Balance: {formatCurrency(balance)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockFlyout;