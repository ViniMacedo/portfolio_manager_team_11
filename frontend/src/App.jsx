import React, { useState, useEffect } from "react";
import {
  fetchPortfolioById,
  tradeStock,
  fetchUserById,
  fetchStockBySymbol,
} from "./services/api";
import StockTicker from "./components/StockTicker";
import Header from "./components/Header";
import Overview from "./components/Overview";
import Holdings from "./components/Holdings";
import Performance from "./components/Performance";
import Watchlist from "./components/Watchlist";
import BrowseStocks from "./components/BrowseStocks";
import StockFlyout from "./components/StockFlyout";
import AIAssistant from "./components/AIAssistant";

const App = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedStock, setSelectedStock] = useState(null);
  const [portfolio, setPortfolio] = useState({ holdings: [] });
  const [userInfo, setUserInfo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  useEffect(() => {
    fetchPortfolioById(1)
      .then((data) => {
        console.log("Portfolio data received:", data);
        setPortfolio(data);
      })
      .catch(console.error);
    fetchUserById(1)
      .then((data) => {
        console.log("User data received:", data);
        setUserInfo(data);
      })
      .catch(console.error);
  }, []);

  // Handle trade stock
  const handleTradeStock = async (stockSymbol, action, quantity, price) => {
    if (!userInfo || !portfolio) {
      console.error("User information or portfolio is not available");
      return;
    }

    try {
      const result = await tradeStock(
        userInfo.id,
        portfolio.id,
        stockSymbol,
        quantity,
        price,
        action
      );
      console.log("Trade successful:", result);

      // Refresh portfolio data after successful trade
      fetchPortfolioById(portfolio.id).then(setPortfolio).catch(console.error);
      fetchUserById(userInfo.id).then(setUserInfo).catch(console.error);

      return result;
    } catch (error) {
      console.error("Trade failed:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchAndUpdateStock = async () => {
      if (!selectedStock || !selectedStock.symbol) return;

      // If the stock has complete details (price and other data), no need to fetch again
      if (
        selectedStock.price &&
        selectedStock.marketCap &&
        selectedStock.volume
      ) {
        return;
      }

      try {
        const stockData = await fetchStockBySymbol(selectedStock.symbol);
        setSelectedStock((current) => ({
          ...current, // Keep existing data
          ...stockData, // Update with latest data
          color: current.color || "from-blue-500 to-blue-600", // Keep existing color or use default
        }));
      } catch (error) {
        console.error(`Error on fetching ${selectedStock.symbol}:`, error);
      }
    };

    fetchAndUpdateStock();
  }, [selectedStock]);

  // Calculate real portfolio data from actual holdings
  const calculatePortfolioData = (portfolio, userInfo) => {
    console.log("Calculating portfolio data:", { portfolio, userInfo });

    if (!portfolio?.holdings || portfolio.holdings.length === 0) {
      console.log("No holdings found, using fallback data");
      // Return fallback data when no real data is available
      return {
        totalValue: 125430.5,
        dayChange: 2845.3,
        dayChangePercent: 2.32,
        totalGain: 18745.5,
        totalGainPercent: 17.5,
      };
    }

    let totalValue = 0;
    let totalCost = 0;
    let dayChange = 0;

    console.log("Processing holdings:", portfolio.holdings);

    portfolio.holdings.forEach((holding, index) => {
      console.log(`Processing holding ${index}:`, holding);

      const quantity = holding.quantity || holding.shares || 0;
      const price = holding.price || 0;
      const averageCost = holding.average_cost || holding.cost_basis || price;

      const currentValue = quantity * price;
      const costBasis = quantity * averageCost;

      console.log(
        `Holding ${holding.symbol}: quantity=${quantity}, price=${price}, currentValue=${currentValue}, costBasis=${costBasis}`
      );

      totalValue += currentValue;
      totalCost += costBasis;

      // Simulate day change (in real app, you'd have previous day's price)
      const estimatedDayChange = currentValue * (Math.random() * 0.04 - 0.02); // Random ±2%
      dayChange += estimatedDayChange;
    });

    const totalGain = totalValue - totalCost;
    const totalGainPercent = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;
    const dayChangePercent =
      totalValue > 0 ? (dayChange / totalValue) * 100 : 0;

    const result = {
      totalValue,
      dayChange,
      dayChangePercent,
      totalGain,
      totalGainPercent,
    };

    console.log("Calculated portfolio data:", result);
    return result;
  };

  // Calculate real portfolio data
  const realPortfolioData = calculatePortfolioData(portfolio, userInfo);

  const getEffectiveHoldings = () => {
    if (portfolio?.holdings && portfolio.holdings.length > 0) {
      // Check if we have valid price data
      const hasValidPrices = portfolio.holdings.some(
        (holding) => holding.price && !isNaN(holding.price) && holding.price > 0
      );

      if (hasValidPrices) {
        return portfolio.holdings;
      }
    }

    // Return mock holdings for demonstration when no valid data
    return [
      {
        symbol: "AAPL",
        name: "Apple Inc",
        quantity: 50,
        shares: 50,
        price: 175.5,
        average_cost: 150.0,
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc",
        quantity: 25,
        shares: 25,
        price: 135.2,
        average_cost: 120.0,
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corp",
        quantity: 75,
        shares: 75,
        price: 420.1,
        average_cost: 380.0,
      },
      {
        symbol: "TSLA",
        name: "Tesla Inc",
        quantity: 30,
        shares: 30,
        price: 185.75,
        average_cost: 200.0,
      },
      {
        symbol: "NVDA",
        name: "NVIDIA Corp",
        quantity: 20,
        shares: 20,
        price: 498.32,
        average_cost: 450.0,
      },
    ];
  };

  // Get effective portfolio data for AI (fallback when real data is invalid)
  const getEffectivePortfolioData = () => {
    // If real data has valid total value, use it
    if (realPortfolioData.totalValue > 0) {
      return realPortfolioData;
    }

    // Otherwise use fallback data
    return {
      totalValue: 125430.5,
      dayChange: 2845.3,
      dayChangePercent: 2.32,
      totalGain: 18245.75,
      totalGainPercent: 17.01,
    };
  };

  // Sample data (keeping existing data structure for fallback)
  const portfolioData = {
    totalValue: 125430.5,
    dayChange: 2845.3,
    dayChangePercent: 2.32,
    totalGain: 18745.5,
    totalGainPercent: 17.5,
  };

  const performanceData = [
    { date: "Jan", value: 98000, change: 2.1 },
    { date: "Feb", value: 102000, change: 4.1 },
    { date: "Mar", value: 105500, change: 3.4 },
    { date: "Apr", value: 108200, change: 2.6 },
    { date: "May", value: 112800, change: 4.3 },
    { date: "Jun", value: 118500, change: 5.1 },
    { date: "Jul", value: 125430, change: 5.8 },
  ];

  const watchlist = [
    {
      symbol: "NVDA",
      name: "NVIDIA Corp",
      price: 498.32,
      change: 12.45,
      changePercent: 2.56,
      color: "from-green-500 to-emerald-400",
    },
    {
      symbol: "META",
      name: "Meta Platforms",
      price: 312.87,
      change: -5.43,
      changePercent: -1.71,
      color: "from-blue-500 to-indigo-400",
    },
    {
      symbol: "NFLX",
      name: "Netflix Inc",
      price: 445.23,
      change: 8.9,
      changePercent: 2.04,
      color: "from-red-500 to-pink-400",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <Overview
            portfolioData={portfolioData}
            portfolio={portfolio}
            watchlist={watchlist}
            performanceData={performanceData}
            handleTradeStock={handleTradeStock}
            setActiveTab={setActiveTab}
          />
        );
      case "holdings":
        return (
          <Holdings portfolio={portfolio} setSelectedStock={setSelectedStock} />
        );
      case "performance":
        return (
          <Performance
            portfolio={portfolio}
            setSelectedStock={setSelectedStock}
          />
        );
      case "watchlist":
        return (
          <Watchlist
            watchlist={watchlist}
            setSelectedStock={setSelectedStock}
          />
        );
      case "browse":
        return (
          <BrowseStocks
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            setSelectedStock={setSelectedStock}
          />
        );
      default:
        return (
          <Overview
            portfolioData={portfolioData}
            portfolio={portfolio}
            watchlist={watchlist}
            performanceData={performanceData}
            handleTradeStock={handleTradeStock}
            setActiveTab={setActiveTab}
          />
        );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-purple-400/30 to-pink-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/30 to-cyan-400/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Header with integrated navigation tabs */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAI={() => setIsAIAssistantOpen(true)}
      />
      <StockTicker />

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 flex-1 overflow-hidden min-h-0">
        <div className="h-full overflow-hidden">{renderContent()}</div>
      </main>

      {/* Stock Detail Flyout */}
      {selectedStock && (
        <StockFlyout
          stock={selectedStock}
          onClose={() => setSelectedStock(null)}
          onTradeStock={handleTradeStock}
          holdings={portfolio?.holdings || []}
          userBalance={userInfo?.balance || 0}
        />
      )}

      {/* AI Assistant Modal */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        portfolioData={getEffectivePortfolioData()}
        performanceData={performanceData}
        holdings={getEffectiveHoldings()}
      />
    </div>
  );
};

export default App;
