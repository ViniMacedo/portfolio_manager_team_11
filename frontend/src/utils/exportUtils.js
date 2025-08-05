// Portfolio Export Utilities

/**
 * Converts portfolio data to CSV format and triggers download
 * @param {Object} portfolio - Portfolio object with holdings
 * @param {Object} portfolioData - Portfolio summary data
 */
export const exportPortfolioToCSV = (portfolio, portfolioData) => {
  if (!portfolio.holdings || portfolio.holdings.length === 0) {
    alert('No portfolio data to export');
    return;
  }

  // Calculate real-time values
  const realTotalValue = portfolio.holdings.reduce((sum, stock) => sum + (stock.shares * stock.current_price), 0);
  const realTotalInvested = portfolio.holdings.reduce((sum, stock) => sum + (stock.shares * stock.avg_price), 0);
  const realTotalGain = realTotalValue - realTotalInvested;
  const realTotalGainPercent = realTotalInvested > 0 ? ((realTotalGain / realTotalInvested) * 100).toFixed(2) : 0;

  // Create CSV header
  const headers = [
    'Symbol',
    'Shares',
    'Average Price',
    'Current Price', 
    'Total Investment',
    'Current Value',
    'Gain/Loss ($)',
    'Gain/Loss (%)',
    'Last Updated'
  ];

  // Create CSV rows
  const csvRows = [
    headers.join(','),
    '', // Empty row for spacing
    '=== PORTFOLIO SUMMARY ===',
    `Total Portfolio Value,$${realTotalValue.toLocaleString()}`,
    `Total Invested,$${realTotalInvested.toLocaleString()}`,
    `Total Gain/Loss,$${realTotalGain.toLocaleString()}`,
    `Total Return,${realTotalGainPercent}%`,
    `Number of Holdings,${portfolio.holdings.length}`,
    `Export Date,${new Date().toLocaleDateString()}`,
    `Export Time,${new Date().toLocaleTimeString()}`,
    '', // Empty row for spacing
    '=== INDIVIDUAL HOLDINGS ===',
    headers.join(',') // Headers again for holdings section
  ];

  // Add each holding as a row
  portfolio.holdings.forEach(stock => {
    const totalInvestment = stock.shares * stock.avg_price;
    const currentValue = stock.shares * stock.current_price;
    const gainLoss = currentValue - totalInvestment;
    const gainLossPercent = totalInvestment > 0 ? ((gainLoss / totalInvestment) * 100).toFixed(2) : 0;
    
    const row = [
      stock.symbol,
      stock.shares,
      `$${stock.avg_price}`,
      `$${stock.current_price}`,
      `$${totalInvestment.toLocaleString()}`,
      `$${currentValue.toLocaleString()}`,
      `$${gainLoss.toLocaleString()}`,
      `${gainLossPercent}%`,
      stock.last_updated || new Date().toLocaleDateString()
    ];
    
    csvRows.push(row.join(','));
  });

  // Create and download the CSV file
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `portfolio_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  // Trigger download
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Show success message
  console.log('Portfolio exported successfully!');
};

/**
 * Exports watchlist data to CSV
 * @param {Array} watchlist - Array of watchlist stocks
 */
export const exportWatchlistToCSV = (watchlist) => {
  if (!watchlist || watchlist.length === 0) {
    alert('No watchlist data to export');
    return;
  }

  const headers = ['Symbol', 'Name', 'Price', 'Change (%)', 'Export Date'];
  const csvRows = [
    '=== WATCHLIST EXPORT ===',
    `Export Date,${new Date().toLocaleDateString()}`,
    `Export Time,${new Date().toLocaleTimeString()}`,
    `Total Symbols,${watchlist.length}`,
    '',
    headers.join(',')
  ];

  watchlist.forEach(stock => {
    const row = [
      stock.symbol,
      `"${stock.name}"`, // Quotes to handle commas in names
      `$${stock.price}`,
      `${stock.changePercent >= 0 ? '+' : ''}${stock.changePercent}%`,
      new Date().toLocaleDateString()
    ];
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `watchlist_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  console.log('Watchlist exported successfully!');
};

/**
 * Copies portfolio share link to clipboard
 * @param {Object} portfolio - Portfolio object
 * @param {Object} portfolioData - Portfolio summary data
 */
export const sharePortfolioLink = async (portfolio, portfolioData) => {
  try {
    // Generate shareable portfolio URL
    const baseUrl = window.location.origin;
    const portfolioId = portfolio.id || 'demo';
    const shareUrl = `${baseUrl}/portfolio/${portfolioId}`;
    
    // Calculate current portfolio metrics for share text
    const realTotalValue = portfolio.holdings?.reduce((sum, stock) => sum + (stock.shares * stock.current_price), 0) || 0;
    const realTotalInvested = portfolio.holdings?.reduce((sum, stock) => sum + (stock.shares * stock.avg_price), 0) || 0;
    const realTotalGain = realTotalValue - realTotalInvested;
    const realTotalGainPercent = realTotalInvested > 0 ? ((realTotalGain / realTotalInvested) * 100).toFixed(1) : 0;
    
    // Create share text with portfolio summary
    const shareText = `📊 My Portfolio Performance
💰 Value: $${realTotalValue.toLocaleString()}
📈 Return: ${realTotalGainPercent >= 0 ? '+' : ''}${realTotalGainPercent}%
🏦 Holdings: ${portfolio.holdings?.length || 0} stocks
📅 ${new Date().toLocaleDateString()}

View my portfolio: ${shareUrl}`;

    // Try to use Web Share API if available (mobile/modern browsers)
    if (navigator.share) {
      await navigator.share({
        title: 'My Investment Portfolio',
        text: shareText,
        url: shareUrl
      });
      console.log('Portfolio shared successfully via Web Share API');
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(shareText);
      
      // Show success notification
      showShareNotification('Portfolio link and summary copied to clipboard!');
      console.log('Portfolio link copied to clipboard');
    }
  } catch (error) {
    console.error('Error sharing portfolio:', error);
    
    // Final fallback: Copy just the URL
    try {
      const baseUrl = window.location.origin;
      const portfolioId = portfolio.id || 'demo';
      const shareUrl = `${baseUrl}/portfolio/${portfolioId}`;
      
      await navigator.clipboard.writeText(shareUrl);
      showShareNotification('Portfolio link copied to clipboard!');
    } catch (clipboardError) {
      showShareNotification('Unable to copy link. Please try again.', 'error');
    }
  }
};

/**
 * Shows a temporary notification for share actions
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success' or 'error')
 */
const showShareNotification = (message, type = 'success') => {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg transition-all duration-300 transform translate-x-full ${
    type === 'success' 
      ? 'bg-green-500 text-white' 
      : 'bg-red-500 text-white'
  }`;
  notification.textContent = message;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 100);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = 'translateX(full)';
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
};
