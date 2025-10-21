import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, Settings, Star } from 'lucide-react';
import { useStockData } from '../hooks/useStockData';
import SkeletonLoader from './SkeletonLoader';
import ErrorDisplay from './ErrorDisplay';

function Dashboard({ symbol, darkMode, range }) {
  const { data: dashData, loading, error, refetch } = useStockData(symbol, range, !!symbol);
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
    window.addEventListener('watchlistUpdate', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('watchlistUpdate', handleStorageChange);
    };
  }, [symbol]);

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
      <div className={`stat-card p-4 rounded-xl card-hover border ${
        darkMode ? 'bg-primary-800/60 border-primary-700' : 'bg-white border-primary-200'
      } ${stats?.priceChange >= 0 ? 'shadow-success/20' : 'shadow-error/20'} shadow-lg`}>
        <div className="flex items-center justify-between mb-2">
          <p className={`text-xs font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>Period Change</p>
          {stats?.priceChange >= 0 ? 
            <TrendingUp className="w-4 h-4 text-success" /> : 
            <TrendingDown className="w-4 h-4 text-error" />
          }
        </div>
        <p className={`text-lg sm:text-xl font-bold ${stats?.priceChange >= 0 ? 'text-success' : 'text-error'}`}>
          ${stats?.priceChange.toFixed(2)}
        </p>
        <p className={`text-xs ${stats?.priceChange >= 0 ? 'text-success/70' : 'text-error/70'}`}>
          {stats?.percentChange >= 0 ? '+' : ''}{stats?.percentChange.toFixed(2)}%
        </p>
      </div>
    ),
    periodHighLow: (
      <div className={`stat-card p-2 sm:p-3 rounded-lg card-hover border shadow-md ${
        darkMode ? 'bg-primary-800/60 border-primary-700' : 'bg-white border-primary-200'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-[10px] sm:text-xs font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>High/Low</p>
          <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-accent-500" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
            ${stats?.periodHigh.toFixed(2)}
          </p>
          <p className={`text-xs ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
            ${stats?.periodLow.toFixed(2)}
          </p>
        </div>
      </div>
    ),
    startingPrice: (
      <div className={`stat-card p-2 sm:p-3 rounded-lg card-hover border shadow-md ${
        darkMode ? 'bg-primary-800/60 border-primary-700' : 'bg-white border-primary-200'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-[10px] sm:text-xs font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>Open</p>
          <DollarSign className="w-3 h-3 sm:w-4 sm:h-4 text-accent-500" />
        </div>
        <p className={`text-sm sm:text-base font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>${stats?.firstPrice.toFixed(2)}</p>
      </div>
    ),
    currentPrice: (
      <div className={`stat-card p-4 rounded-xl card-hover border shadow-xl ${
        darkMode ? 'bg-primary-800/60 border-accent-600' : 'bg-accent-50 border-accent-200'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <p className={`text-xs font-medium ${darkMode ? 'text-accent-300' : 'text-accent-700'}`}>Current Price</p>
          <DollarSign className="w-4 h-4 text-accent-500" />
        </div>
        <p className={`text-lg sm:text-xl font-bold ${darkMode ? 'text-accent-400' : 'text-accent-700'}`}>${stats?.lastPrice.toFixed(2)}</p>
      </div>
    ),
    totalVolume: (
      <div className={`stat-card p-2 sm:p-3 rounded-lg card-hover border shadow-md ${
        darkMode ? 'bg-primary-800/60 border-primary-700' : 'bg-white border-primary-200'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-[10px] sm:text-xs font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>Volume</p>
          <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 text-warning" />
        </div>
        <p className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
          {(stats?.totalVolume / 1000000).toFixed(1)}M
        </p>
      </div>
    ),
    avgVolume: (
      <div className={`stat-card p-2 sm:p-3 rounded-lg card-hover border shadow-md ${
        darkMode ? 'bg-primary-800/60 border-primary-700' : 'bg-white border-primary-200'
      }`}>
        <div className="flex items-center justify-between mb-1">
          <p className={`text-[10px] sm:text-xs font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>Avg Vol</p>
          <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4 text-accent-500" />
        </div>
        <p className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
          {(stats?.avgVolume / 1000000).toFixed(1)}M
        </p>
      </div>
    )
  };

  return (
    <div className="mt-6 sm:mt-8 w-full">
      {loading && <SkeletonLoader darkMode={darkMode} type="dashboard" />}
      
      {error && <ErrorDisplay error={error} onRetry={refetch} darkMode={darkMode} />}

      {!loading && !error && dashData && stats ? (
          <div className={`p-4 sm:p-6 rounded-2xl shadow-2xl card-hover animate-fade-in-up w-full border ${
            darkMode 
              ? 'bg-primary-800/40 backdrop-blur-xl border-primary-700/50' 
              : 'bg-white/90 backdrop-blur-xl border-primary-200'
          }`}>
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className={`text-2xl sm:text-4xl font-black flex items-center gap-2 mb-2 ${
                darkMode ? 'text-white' : 'text-primary-900'
              }`}>
                {dashData.symbol}
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-full smooth-transition ${
                    stats.percentChange >= 0
                      ? 'bg-success/20 text-success border border-success/30'
                      : 'bg-error/20 text-error border border-error/30'
                  }`}
                >
                  {stats.percentChange >= 0 ? '▲' : '▼'} {stats.percentChange.toFixed(2)}%
                </span>
              </h2>
              <p className={`text-sm ${
                darkMode ? 'text-primary-400' : 'text-primary-600'
              }`}>
                {getRangeLabel(range)} Period
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleWatchlist}
                className={`p-2.5 rounded-xl smooth-transition hover:scale-110 active:scale-95 border ${
                  isInWatchlist
                    ? 'bg-accent-500 border-accent-600 text-white shadow-lg'
                    : darkMode ? 'bg-primary-700/50 border-primary-600 text-primary-300 hover:bg-primary-600/50' : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
                }`}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Star className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2.5 rounded-xl smooth-transition hover:scale-110 active:scale-95 hover:rotate-90 border ${
                  darkMode ? 'bg-primary-700/50 border-primary-600 text-primary-300 hover:bg-primary-600/50' : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
                }`}
                title="Settings"
              >
                <Settings className="w-5 h-5" />
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

          {/* Featured Stats - Larger on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
            {visibleStats.periodChange && (
              <div className="animate-fade-in-up">
                {statComponents.periodChange}
              </div>
            )}
            {visibleStats.currentPrice && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                {statComponents.currentPrice}
              </div>
            )}
          </div>

          {/* Secondary Stats - Compact grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {visibleStats.periodHighLow && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                {statComponents.periodHighLow}
              </div>
            )}
            {visibleStats.startingPrice && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                {statComponents.startingPrice}
              </div>
            )}
            {visibleStats.totalVolume && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                {statComponents.totalVolume}
              </div>
            )}
            {visibleStats.avgVolume && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
                {statComponents.avgVolume}
              </div>
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