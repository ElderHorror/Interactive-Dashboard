import { useState } from 'react';
import { TrendingUp, TrendingDown, Globe, DollarSign, Activity } from 'lucide-react';

function Markets({ darkMode }) {
  const [activeTab, setActiveTab] = useState('indices'); // indices, movers, sectors

  // Mock data - in real app, fetch from API
  const indices = [
    { symbol: 'SPX', name: 'S&P 500', price: 4783.45, change: 23.45, changePercent: 0.49 },
    { symbol: 'DJI', name: 'Dow Jones', price: 37440.34, change: -45.23, changePercent: -0.12 },
    { symbol: 'IXIC', name: 'NASDAQ', price: 14510.30, change: 125.67, changePercent: 0.87 },
    { symbol: 'RUT', name: 'Russell 2000', price: 2045.67, change: 15.23, changePercent: 0.75 },
    { symbol: 'VIX', name: 'Volatility Index', price: 13.45, change: -0.67, changePercent: -4.75 },
    { symbol: 'FTSE', name: 'FTSE 100', price: 7654.32, change: 34.56, changePercent: 0.45 },
  ];

  const topGainers = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: 495.22, change: 45.67, changePercent: 10.15, volume: 145.2 },
    { symbol: 'TSLA', name: 'Tesla Inc', price: 242.84, change: 18.34, changePercent: 8.17, volume: 234.5 },
    { symbol: 'AMD', name: 'Advanced Micro', price: 145.67, change: 9.23, changePercent: 6.76, volume: 98.3 },
    { symbol: 'META', name: 'Meta Platforms', price: 352.89, change: 21.45, changePercent: 6.47, volume: 67.8 },
    { symbol: 'AAPL', name: 'Apple Inc', price: 189.95, change: 8.95, changePercent: 4.94, volume: 156.4 },
  ];

  const topLosers = [
    { symbol: 'INTC', name: 'Intel Corp', price: 42.34, change: -3.45, changePercent: -7.54, volume: 89.2 },
    { symbol: 'PYPL', name: 'PayPal Holdings', price: 58.67, change: -3.23, changePercent: -5.22, volume: 45.6 },
    { symbol: 'DIS', name: 'Walt Disney', price: 89.45, change: -4.12, changePercent: -4.40, volume: 78.9 },
    { symbol: 'BA', name: 'Boeing Co', price: 198.23, change: -7.89, changePercent: -3.83, volume: 34.5 },
    { symbol: 'NFLX', name: 'Netflix Inc', price: 445.67, change: -15.34, changePercent: -3.33, volume: 56.7 },
  ];

  const sectors = [
    { name: 'Technology', change: 1.45, stocks: 245, marketCap: '12.4T' },
    { name: 'Healthcare', change: 0.67, stocks: 189, marketCap: '8.2T' },
    { name: 'Financials', change: -0.34, stocks: 312, marketCap: '9.8T' },
    { name: 'Consumer Discretionary', change: 0.89, stocks: 156, marketCap: '6.5T' },
    { name: 'Energy', change: -1.23, stocks: 98, marketCap: '4.3T' },
    { name: 'Industrials', change: 0.45, stocks: 234, marketCap: '7.1T' },
    { name: 'Materials', change: -0.56, stocks: 145, marketCap: '3.9T' },
    { name: 'Real Estate', change: 0.23, stocks: 167, marketCap: '2.8T' },
    { name: 'Utilities', change: -0.12, stocks: 89, marketCap: '2.1T' },
    { name: 'Communication Services', change: 1.12, stocks: 134, marketCap: '5.6T' },
  ];

  const tabs = [
    { id: 'indices', label: 'Indices', icon: Globe },
    { id: 'movers', label: 'Top Movers', icon: Activity },
    { id: 'sectors', label: 'Sectors', icon: DollarSign },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">Markets Overview</h1>
          <p className="text-text-secondary">Real-time market data and performance</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-background-elevated rounded-lg border border-border">
          <div className="w-2 h-2 bg-bull rounded-full animate-pulse" />
          <span className="text-xs text-text-secondary">Market Open</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-all duration-150 border-b-2 ${
                activeTab === tab.id
                  ? 'border-accent-primary text-accent-primary'
                  : 'border-transparent text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      {activeTab === 'indices' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {indices.map((index) => {
            const isPositive = index.change >= 0;
            return (
              <div key={index.symbol} className="card-hover p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-1">
                      {index.symbol}
                    </h3>
                    <p className="text-xs text-text-tertiary">{index.name}</p>
                  </div>
                  {isPositive ? (
                    <TrendingUp className="w-5 h-5 text-bull" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-bear" />
                  )}
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold font-mono tabular-nums text-text-primary">
                    {index.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-mono tabular-nums ${isPositive ? 'text-bull' : 'text-bear'}`}>
                      {isPositive ? '+' : ''}{index.change.toFixed(2)}
                    </span>
                    <span className={`text-sm font-mono tabular-nums font-medium ${isPositive ? 'text-bull' : 'text-bear'}`}>
                      ({isPositive ? '+' : ''}{index.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'movers' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Gainers */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-bull" />
              <h3 className="text-lg font-semibold text-text-primary">Top Gainers</h3>
            </div>
            <div className="space-y-3">
              {topGainers.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-background-hover transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-tertiary w-6">#{index + 1}</span>
                    <div>
                      <p className="font-mono font-semibold text-text-primary">{stock.symbol}</p>
                      <p className="text-xs text-text-tertiary">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono tabular-nums text-text-primary">${stock.price.toFixed(2)}</p>
                    <p className="text-sm font-mono tabular-nums font-medium text-bull">
                      +{stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Losers */}
          <div className="card-elevated p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-bear" />
              <h3 className="text-lg font-semibold text-text-primary">Top Losers</h3>
            </div>
            <div className="space-y-3">
              {topLosers.map((stock, index) => (
                <div
                  key={stock.symbol}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-background-hover transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-text-tertiary w-6">#{index + 1}</span>
                    <div>
                      <p className="font-mono font-semibold text-text-primary">{stock.symbol}</p>
                      <p className="text-xs text-text-tertiary">{stock.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono tabular-nums text-text-primary">${stock.price.toFixed(2)}</p>
                    <p className="text-sm font-mono tabular-nums font-medium text-bear">
                      {stock.changePercent.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sectors' && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-accent-primary" />
            <h3 className="text-lg font-semibold text-text-primary">Sector Performance</h3>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '30%' }}>Sector</th>
                  <th className="text-right" style={{ width: '15%' }}>Change %</th>
                  <th className="text-right" style={{ width: '15%' }}>Stocks</th>
                  <th className="text-right" style={{ width: '20%' }}>Market Cap</th>
                  <th className="text-right" style={{ width: '20%' }}>Performance</th>
                </tr>
              </thead>
              <tbody>
                {sectors.map((sector) => {
                  const isPositive = sector.change >= 0;
                  return (
                    <tr key={sector.name} className="cursor-pointer">
                      <td style={{ width: '30%' }}>
                        <span className="font-medium text-text-primary">{sector.name}</span>
                      </td>
                      <td className="text-right" style={{ width: '15%' }}>
                        <span className={`font-mono tabular-nums font-medium ${isPositive ? 'text-bull' : 'text-bear'}`}>
                          {isPositive ? '+' : ''}{sector.change.toFixed(2)}%
                        </span>
                      </td>
                      <td className="text-right" style={{ width: '15%' }}>
                        <span className="font-mono tabular-nums text-text-secondary">{sector.stocks}</span>
                      </td>
                      <td className="text-right" style={{ width: '20%' }}>
                        <span className="font-mono tabular-nums text-text-primary">{sector.marketCap}</span>
                      </td>
                      <td className="text-right" style={{ width: '20%' }}>
                        <div className="flex items-center justify-end gap-2">
                          {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-bull" />
                          ) : (
                            <TrendingDown className="w-4 h-4 text-bear" />
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default Markets;
