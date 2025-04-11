import { useEffect, useState } from 'react';
import axios from 'axios';
import Watchlist from './Watchlist';

function Dashboard({ symbol, darkMode, range, onSelectSymbol }) {
  const [loading, setLoading] = useState(false);
  const [dashData, setDashData] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [visibleStats, setVisibleStats] = useState({
    periodChange: true,
    periodHighLow: true,
    startingPrice: true,
    currentPrice: true,
    totalVolume: true,
    avgVolume: true
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const getRangeLabel = (range) => {
    const labels = {
      "1d": "Today",
      "7d": "7 Day",
      "1m": "1 Month",
      "4m": "4 Month",
      "1y": "1 Year"
    };
    return labels[range] || range;
  };

  const calculatePeriodStats = (data) => {
    if (!data?.trend?.length) return null;

    const prices = data.trend.map(t => t.close);
    const volumes = data.trend.map(t => t.volume);
    const firstPrice = data.trend[0].open;
    const lastPrice = data.trend[data.trend.length - 1].close;
    const periodHigh = Math.max(...prices);
    const periodLow = Math.min(...prices);
    const totalVolume = volumes.reduce((a, b) => a + b, 0);
    const avgVolume = Math.round(totalVolume / volumes.length);
    const priceChange = lastPrice - firstPrice;
    const percentChange = (priceChange / firstPrice) * 100;

    return {
      firstPrice,
      lastPrice,
      periodHigh,
      periodLow,
      totalVolume,
      avgVolume,
      priceChange,
      percentChange
    };
  };

  const toggleStat = (stat) => {
    setVisibleStats(prev => ({
      ...prev,
      [stat]: !prev[stat]
    }));
  };

  const toggleAllStats = () => {
    const allVisible = Object.values(visibleStats).every(v => v);
    setVisibleStats({
      periodChange: !allVisible,
      periodHighLow: !allVisible,
      startingPrice: !allVisible,
      currentPrice: !allVisible,
      totalVolume: !allVisible,
      avgVolume: !allVisible
    });
  };

  useEffect(() => {
    // Check if current symbol is in watchlist
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    if (savedWatchlist) {
      const watchlist = JSON.parse(savedWatchlist);
      setIsInWatchlist(watchlist.includes(symbol));
    }
  }, [symbol]);

  // Listen for storage events to update watchlist status
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWatchlist = localStorage.getItem('stockWatchlist');
      if (savedWatchlist) {
        const watchlist = JSON.parse(savedWatchlist);
        setIsInWatchlist(watchlist.includes(symbol));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [symbol]);

  useEffect(() => {
      if (symbol) {
      const controller = new AbortController();
      
        setLoading(true);
        axios
        .get(`${API_URL}/api/stock/${symbol}?range=${range}`, {
          signal: controller.signal
        })
          .then((response) => {
            setDashData(response.data);
            setLoading(false);
          })
          .catch((error) => {
          if (error.name !== 'CanceledError') {
            console.error('Error fetching data:', error.message);
            setLoading(false);
            setDashData(null);
          }
          });

      return () => controller.abort();
      }
  }, [symbol, range]);

  const stats = dashData ? calculatePeriodStats(dashData) : null;

  const toggleWatchlist = () => {
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    let watchlist = savedWatchlist ? JSON.parse(savedWatchlist) : [];

    if (isInWatchlist) {
      watchlist = watchlist.filter(item => item !== symbol);
    } else {
      watchlist.push(symbol);
    }

    localStorage.setItem('stockWatchlist', JSON.stringify(watchlist));
    setIsInWatchlist(!isInWatchlist);
    
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('watchlistUpdate'));
  };

  const statComponents = {
    periodChange: (
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-white/10'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-white/70'} text-xs`}>Period Change</p>
        <p className={`text-sm font-bold ${stats?.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          ${stats?.priceChange.toFixed(2)} ({stats?.percentChange.toFixed(2)}%)
        </p>
      </div>
    ),
    periodHighLow: (
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-white/10'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-white/70'} text-xs`}>Period High/Low</p>
        <p className="text-sm font-bold">
          ${stats?.periodHigh.toFixed(2)} / ${stats?.periodLow.toFixed(2)}
        </p>
      </div>
    ),
    startingPrice: (
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-white/10'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-white/70'} text-xs`}>Starting Price</p>
        <p className="text-sm font-bold">${stats?.firstPrice.toFixed(2)}</p>
      </div>
    ),
    currentPrice: (
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-white/10'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-white/70'} text-xs`}>Current Price</p>
        <p className="text-sm font-bold">${stats?.lastPrice.toFixed(2)}</p>
      </div>
    ),
    totalVolume: (
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-white/10'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-white/70'} text-xs`}>Total Volume</p>
        <p className="text-sm font-bold">{stats?.totalVolume.toLocaleString()}</p>
      </div>
    ),
    avgVolume: (
      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-white/10'}`}>
        <p className={`${darkMode ? 'text-gray-400' : 'text-white/70'} text-xs`}>Average Volume</p>
        <p className="text-sm font-bold">{stats?.avgVolume.toLocaleString()}</p>
      </div>
    )
  };

  return (
    <div className="mt-6 sm:mt-8 w-full">
      {loading && (
        <div className="text-center">
          <svg
            className="animate-spin h-8 w-8 sm:h-10 sm:w-10 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className={darkMode ? 'text-gray-300 mt-2 sm:mt-3' : 'text-white/80 mt-2 sm:mt-3'}>Fetching data...</p>
        </div>
      )}

      {dashData && stats ? (
          <div
            className={`${
              darkMode ? 'bg-gray-800/20' : 'bg-white/20'
            } backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(167,139,250,0.5)] transition-all duration-300 animate-fade-in-up w-full`}
          >
          <div className="flex justify-between items-center mb-4">
            <h2 className={`text-xl sm:text-3xl font-bold ${darkMode ? 'text-gray-100' : 'text-white'} flex items-center flex-wrap`}>
              {dashData.symbol}{' '}
              <span className={darkMode ? 'text-xs sm:text-sm text-gray-400 ml-2' : 'text-xs sm:text-sm text-white/70 ml-2'}>
                ({getRangeLabel(range)} Period)
              </span>
              <span
                className={`ml-2 sm:ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                  stats.percentChange >= 0
                    ? darkMode
                      ? 'bg-green-600/30 text-green-200'
                      : 'bg-green-500/30 text-green-100'
                    : darkMode
                    ? 'bg-red-600/30 text-red-200'
                    : 'bg-red-500/30 text-red-100'
                }`}
              >
                {stats.percentChange >= 0 ? '▲' : '▼'} {stats.percentChange.toFixed(2)}%
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleWatchlist}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isInWatchlist
                    ? 'bg-purple-500 text-white'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-300 ${
                    isInWatchlist ? 'scale-110' : ''
                  }`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  {isInWatchlist ? (
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  ) : (
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  )}
                </svg>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                } text-gray-900 transition-colors`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>

          {showSettings && (
            <div className={`mb-4 p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-white/10'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className={`text-lg font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Statistics Settings
                </h3>
                <button
                  onClick={toggleAllStats}
                  className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                >
                  {Object.values(visibleStats).every(v => v) ? 'Hide All' : 'Show All'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(visibleStats).map(([key, value]) => (
                  <label
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded cursor-pointer ${
                      darkMode ? 'hover:bg-gray-600/30' : 'hover:bg-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleStat(key)}
                      className="rounded text-purple-500 focus:ring-purple-500"
                    />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${darkMode ? 'text-gray-200' : 'text-white/90'} text-xs sm:text-sm`}>
            {Object.entries(visibleStats).map(([key, visible]) => 
              visible && statComponents[key]
            )}
          </div>
        </div>
      ) : (
        <p className={darkMode ? 'text-center text-gray-400 mt-4' : 'text-center text-white/70 mt-4'}>
          Enter a stock symbol to see the data!
        </p>
      )}
    </div>
  );
}

export default Dashboard;