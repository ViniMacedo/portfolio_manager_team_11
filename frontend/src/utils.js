export const browsableStocks = [
  // Technology Sector
  { symbol: 'AAPL', name: 'Apple Inc', price: 185.32, change: 2.45, changePercent: 1.34, marketCap: 2900000000000, volume: 65000000, sector: 'Technology', color: 'from-blue-500 to-cyan-400' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 142.87, change: -1.23, changePercent: -0.85, marketCap: 1800000000000, volume: 45000000, sector: 'Technology', color: 'from-emerald-500 to-teal-400' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 378.45, change: 5.67, changePercent: 1.52, marketCap: 2800000000000, volume: 55000000, sector: 'Technology', color: 'from-purple-500 to-pink-400' },
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 498.32, change: 12.45, changePercent: 2.56, marketCap: 1200000000000, volume: 85000000, sector: 'Technology', color: 'from-green-500 to-emerald-400' },
  { symbol: 'META', name: 'Meta Platforms', price: 312.87, change: -5.43, changePercent: -1.71, marketCap: 850000000000, volume: 40000000, sector: 'Technology', color: 'from-blue-500 to-indigo-400' },
  { symbol: 'NFLX', name: 'Netflix Inc', price: 445.23, change: 8.90, changePercent: 2.04, marketCap: 195000000000, volume: 12000000, sector: 'Technology', color: 'from-red-500 to-pink-400' },
  
  // Financial Services
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 154.23, change: 1.87, changePercent: 1.23, marketCap: 450000000000, volume: 18000000, sector: 'Financial Services', color: 'from-indigo-500 to-blue-400' },
  { symbol: 'BAC', name: 'Bank of America', price: 32.45, change: -0.67, changePercent: -2.02, marketCap: 260000000000, volume: 35000000, sector: 'Financial Services', color: 'from-blue-500 to-purple-400' },
  { symbol: 'WFC', name: 'Wells Fargo', price: 43.21, change: 0.89, changePercent: 2.10, marketCap: 165000000000, volume: 25000000, sector: 'Financial Services', color: 'from-red-500 to-orange-400' },
  { symbol: 'GS', name: 'Goldman Sachs', price: 368.75, change: 4.23, changePercent: 1.16, marketCap: 125000000000, volume: 8000000, sector: 'Financial Services', color: 'from-yellow-500 to-orange-400' },
  
  // Healthcare
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 167.89, change: 2.34, changePercent: 1.41, marketCap: 440000000000, volume: 15000000, sector: 'Healthcare', color: 'from-green-500 to-blue-400' },
  { symbol: 'PFE', name: 'Pfizer Inc', price: 28.67, change: -0.45, changePercent: -1.54, marketCap: 165000000000, volume: 42000000, sector: 'Healthcare', color: 'from-cyan-500 to-blue-400' },
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 512.34, change: 7.89, changePercent: 1.56, marketCap: 485000000000, volume: 6000000, sector: 'Healthcare', color: 'from-blue-500 to-indigo-400' },
  { symbol: 'MRK', name: 'Merck & Co', price: 108.45, change: 1.23, changePercent: 1.15, marketCap: 275000000000, volume: 12000000, sector: 'Healthcare', color: 'from-purple-500 to-pink-400' },
  
  // Consumer Discretionary
  { symbol: 'AMZN', name: 'Amazon.com Inc', price: 156.78, change: 3.21, changePercent: 2.09, marketCap: 1600000000000, volume: 52000000, sector: 'Consumer Discretionary', color: 'from-orange-500 to-yellow-400' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 248.90, change: -8.45, changePercent: -3.28, marketCap: 790000000000, volume: 95000000, sector: 'Consumer Discretionary', color: 'from-red-500 to-pink-400' },
  { symbol: 'HD', name: 'Home Depot', price: 312.56, change: 4.67, changePercent: 1.52, marketCap: 325000000000, volume: 8000000, sector: 'Consumer Discretionary', color: 'from-orange-500 to-red-400' },
  { symbol: 'MCD', name: 'McDonalds Corp', price: 287.45, change: -1.34, changePercent: -0.46, marketCap: 210000000000, volume: 5000000, sector: 'Consumer Discretionary', color: 'from-yellow-500 to-red-400' }
];

export const formatMarketCap = (value) => {
  if (value >= 1000000000000) {
    return `$${(value / 1000000000000).toFixed(2)}T`;
  } else if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(2)}B`;
  } else if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }
  return `$${value.toLocaleString()}`;
};

export const formatVolume = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toLocaleString();
};