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
      <div className="stat-card p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Period Change</p>
          {stats?.priceChange >= 0 ? 
            <TrendingUp className="w-4 h-4 text-bull" /> : 
            <TrendingDown className="w-4 h-4 text-bear" />
          }
        </div>
        <p className={`text-2xl font-bold font-mono tabular-nums ${stats?.priceChange >= 0 ? 'text-bull' : 'text-bear'}`}>
          ${stats?.priceChange.toFixed(2)}
        </p>
        <p className={`text-sm font-medium ${stats?.priceChange >= 0 ? 'text-bull' : 'text-bear'}`}>
          {stats?.percentChange >= 0 ? '+' : ''}{stats?.percentChange.toFixed(2)}%
        </p>
      </div>
    ),
    periodHighLow: (
      <div className="stat-card p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">High/Low</p>
          <Activity className="w-4 h-4 text-accent-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">H</span>
            <p className="text-base font-bold font-mono tabular-nums text-text-primary">
              ${stats?.periodHigh.toFixed(2)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-tertiary">L</span>
            <p className="text-base font-bold font-mono tabular-nums text-text-secondary">
              ${stats?.periodLow.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    ),
    startingPrice: (
      <div className="stat-card p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Open</p>
          <DollarSign className="w-4 h-4 text-accent-primary" />
        </div>
        <p className="text-base font-bold font-mono tabular-nums text-text-primary">${stats?.firstPrice.toFixed(2)}</p>
      </div>
    ),
    currentPrice: (
      <div className="stat-card p-4 border-accent-primary/30">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-accent-primary uppercase tracking-wider">Current Price</p>
          <DollarSign className="w-4 h-4 text-accent-primary" />
        </div>
        <p className="text-2xl font-bold font-mono tabular-nums text-accent-primary">${stats?.lastPrice.toFixed(2)}</p>
      </div>
    ),
    totalVolume: (
      <div className="stat-card p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Volume</p>
          <BarChart2 className="w-4 h-4 text-warning" />
        </div>
        <p className="text-base font-bold font-mono tabular-nums text-text-primary">
          {(stats?.totalVolume / 1000000).toFixed(1)}M
        </p>
      </div>
    ),
    avgVolume: (
      <div className="stat-card p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Avg Vol</p>
          <BarChart2 className="w-4 h-4 text-accent-secondary" />
        </div>
        <p className="text-base font-bold font-mono tabular-nums text-text-primary">
          {(stats?.avgVolume / 1000000).toFixed(1)}M
        </p>
      </div>
    )
  };

  return (
    <div className="w-full">
      {loading && <SkeletonLoader darkMode={darkMode} type="dashboard" />}
      
      {error && <ErrorDisplay error={error} onRetry={refetch} darkMode={darkMode} />}

      {!loading && !error && dashData && stats ? (
          <div className="card-elevated p-6 animate-fade-in-up w-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-3xl font-bold font-mono text-text-primary">
                  {dashData.symbol}
                </h2>
                <span
                  className={`px-2.5 py-1 text-sm font-bold rounded font-mono ${
                    stats.percentChange >= 0
                      ? 'badge-bull'
                      : 'badge-bear'
                  }`}
                >
                  {stats.percentChange >= 0 ? '▲' : '▼'} {stats.percentChange.toFixed(2)}%
                </span>
              </div>
              <p className="text-sm text-text-secondary">
                {getRangeLabel(range)} Period
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleWatchlist}
                className={`btn-icon ${
                  isInWatchlist
                    ? 'bg-accent-primary text-white'
                    : ''
                }`}
                title={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Star className={`w-5 h-5 ${isInWatchlist ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="btn-icon"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>

          {showSettings && (
            <div className="mb-4 p-4 rounded-lg bg-background-surface border border-border">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-base font-semibold text-text-primary">
                  Statistics Settings
                </h3>
                <button
                  onClick={toggleAllStats}
                  className="text-sm text-accent-primary hover:text-accent-primary-dark transition-colors"
                >
                  {Object.values(visibleStats).every(v => v) ? 'Hide All' : 'Show All'}
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(visibleStats).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-background-hover transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={() => toggleStat(key)}
                      className="rounded text-accent-primary focus:ring-accent-primary"
                    />
                    <span className="text-sm text-text-secondary">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleStats.currentPrice && (
              <div className="animate-fade-in-up">
                {statComponents.currentPrice}
              </div>
            )}
            {visibleStats.periodChange && (
              <div className="animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
                {statComponents.periodChange}
              </div>
            )}
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
      ) : null}
    </div>
  );
}

export default Dashboard;