import { useState } from 'react';
import { Filter, X, TrendingUp, DollarSign, BarChart3 } from 'lucide-react';

const popularStocks = [
  // Technology
  { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'INTC', name: 'Intel Corp.', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'AMD', name: 'AMD Inc.', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'CRM', name: 'Salesforce', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'ORCL', name: 'Oracle Corp.', sector: 'Technology', marketCap: 'Large' },
  { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology', marketCap: 'Large' },
  
  // Consumer
  { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer', marketCap: 'Large' },
  { symbol: 'NKE', name: 'Nike Inc.', sector: 'Consumer', marketCap: 'Large' },
  { symbol: 'SBUX', name: 'Starbucks Corp.', sector: 'Consumer', marketCap: 'Large' },
  { symbol: 'MCD', name: 'McDonalds Corp.', sector: 'Consumer', marketCap: 'Large' },
  { symbol: 'HD', name: 'Home Depot', sector: 'Consumer', marketCap: 'Large' },
  
  // Financial
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Financial', marketCap: 'Large' },
  { symbol: 'V', name: 'Visa Inc.', sector: 'Financial', marketCap: 'Large' },
  { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financial', marketCap: 'Large' },
  { symbol: 'BAC', name: 'Bank of America', sector: 'Financial', marketCap: 'Large' },
  { symbol: 'GS', name: 'Goldman Sachs', sector: 'Financial', marketCap: 'Large' },
  
  // Entertainment
  { symbol: 'DIS', name: 'Walt Disney Co.', sector: 'Entertainment', marketCap: 'Large' },
  { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Entertainment', marketCap: 'Large' },
  { symbol: 'SPOT', name: 'Spotify', sector: 'Entertainment', marketCap: 'Mid' },
  
  // Retail
  { symbol: 'WMT', name: 'Walmart Inc.', sector: 'Retail', marketCap: 'Large' },
  { symbol: 'TGT', name: 'Target Corp.', sector: 'Retail', marketCap: 'Large' },
  { symbol: 'COST', name: 'Costco', sector: 'Retail', marketCap: 'Large' },
  
  // Automotive
  { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Automotive', marketCap: 'Large' },
  { symbol: 'F', name: 'Ford Motor Co.', sector: 'Automotive', marketCap: 'Large' },
  { symbol: 'GM', name: 'General Motors', sector: 'Automotive', marketCap: 'Large' },
  
  // Aerospace
  { symbol: 'BA', name: 'Boeing Co.', sector: 'Aerospace', marketCap: 'Large' },
  { symbol: 'LMT', name: 'Lockheed Martin', sector: 'Aerospace', marketCap: 'Large' },
  
  // Healthcare
  { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', marketCap: 'Large' },
  { symbol: 'UNH', name: 'UnitedHealth', sector: 'Healthcare', marketCap: 'Large' },
  { symbol: 'PFE', name: 'Pfizer Inc.', sector: 'Healthcare', marketCap: 'Large' },
  
  // Energy
  { symbol: 'XOM', name: 'Exxon Mobil', sector: 'Energy', marketCap: 'Large' },
  { symbol: 'CVX', name: 'Chevron Corp.', sector: 'Energy', marketCap: 'Large' },
];

function StockScreener({ darkMode, onSelectStock, onClose }) {
  const [filters, setFilters] = useState({
    sector: 'All',
    marketCap: 'All',
    searchTerm: '',
  });

  const sectors = ['All', 'Technology', 'Financial', 'Consumer', 'Entertainment', 'Retail', 'Aerospace', 'Automotive', 'Healthcare', 'Energy'];
  const marketCaps = ['All', 'Large', 'Mid', 'Small'];

  const filteredStocks = popularStocks.filter(stock => {
    const matchesSector = filters.sector === 'All' || stock.sector === filters.sector;
    const matchesMarketCap = filters.marketCap === 'All' || stock.marketCap === filters.marketCap;
    const matchesSearch = stock.symbol.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
    return matchesSector && matchesMarketCap && matchesSearch;
  });

  const handleStockSelect = (symbol) => {
    onSelectStock(symbol);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className={`w-full max-w-4xl rounded-2xl shadow-2xl border animate-fade-in-up ${
        darkMode 
          ? 'bg-primary-800/95 backdrop-blur-xl border-primary-700' 
          : 'bg-white/95 backdrop-blur-xl border-primary-200'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-primary-700/50">
          <div className="flex items-center gap-3">
            <Filter className={`w-6 h-6 ${darkMode ? 'text-accent-400' : 'text-accent-600'}`} />
            <h2 className={`text-xl sm:text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-primary-900'
            }`}>
              Stock Screener
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg smooth-transition ${
              darkMode ? 'hover:bg-primary-700' : 'hover:bg-primary-100'
            }`}
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-primary-300' : 'text-primary-600'}`} />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 sm:p-6 border-b border-primary-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Search */}
            <input
              type="text"
              placeholder="Search symbol or name..."
              value={filters.searchTerm}
              onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
              className={`px-4 py-2 rounded-lg border smooth-transition ${
                darkMode
                  ? 'bg-primary-700/50 border-primary-600 text-white placeholder-primary-400'
                  : 'bg-white border-primary-300 text-primary-900 placeholder-primary-500'
              }`}
            />

            {/* Sector Filter */}
            <select
              value={filters.sector}
              onChange={(e) => setFilters({ ...filters, sector: e.target.value })}
              className={`px-4 py-2 rounded-lg border smooth-transition ${
                darkMode
                  ? 'bg-primary-700/50 border-primary-600 text-white'
                  : 'bg-white border-primary-300 text-primary-900'
              }`}
            >
              {sectors.map(sector => (
                <option key={sector} value={sector}>{sector} Sector</option>
              ))}
            </select>

            {/* Market Cap Filter */}
            <select
              value={filters.marketCap}
              onChange={(e) => setFilters({ ...filters, marketCap: e.target.value })}
              className={`px-4 py-2 rounded-lg border smooth-transition ${
                darkMode
                  ? 'bg-primary-700/50 border-primary-600 text-white'
                  : 'bg-white border-primary-300 text-primary-900'
              }`}
            >
              {marketCaps.map(cap => (
                <option key={cap} value={cap}>{cap === 'All' ? 'All Caps' : `${cap} Cap`}</option>
              ))}
            </select>
          </div>

          {/* Active Filters */}
          {(filters.sector !== 'All' || filters.marketCap !== 'All' || filters.searchTerm) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {filters.searchTerm && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-accent-500/20 text-accent-300' : 'bg-accent-100 text-accent-700'
                }`}>
                  Search: {filters.searchTerm}
                </span>
              )}
              {filters.sector !== 'All' && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-accent-500/20 text-accent-300' : 'bg-accent-100 text-accent-700'
                }`}>
                  {filters.sector}
                </span>
              )}
              {filters.marketCap !== 'All' && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  darkMode ? 'bg-accent-500/20 text-accent-300' : 'bg-accent-100 text-accent-700'
                }`}>
                  {filters.marketCap} Cap
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        <div className="p-4 sm:p-6 max-h-96 overflow-y-auto custom-scrollbar">
          {filteredStocks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filteredStocks.map((stock, index) => (
                <button
                  key={stock.symbol}
                  onClick={() => handleStockSelect(stock.symbol)}
                  className={`p-4 rounded-xl border smooth-transition text-left animate-fade-in ${
                    darkMode
                      ? 'bg-primary-700/30 border-primary-600 hover:bg-primary-600/50 hover:border-accent-500'
                      : 'bg-white border-primary-200 hover:bg-accent-50 hover:border-accent-300'
                  }`}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`text-lg font-bold ${
                        darkMode ? 'text-white' : 'text-primary-900'
                      }`}>
                        {stock.symbol}
                      </h3>
                      <p className={`text-sm ${
                        darkMode ? 'text-primary-400' : 'text-primary-600'
                      }`}>
                        {stock.name}
                      </p>
                    </div>
                    <TrendingUp className={`w-5 h-5 ${
                      darkMode ? 'text-accent-400' : 'text-accent-600'
                    }`} />
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      darkMode ? 'bg-primary-600/50 text-primary-300' : 'bg-primary-100 text-primary-700'
                    }`}>
                      {stock.sector}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      darkMode ? 'bg-primary-600/50 text-primary-300' : 'bg-primary-100 text-primary-700'
                    }`}>
                      {stock.marketCap} Cap
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className={`w-16 h-16 mx-auto mb-4 ${
                darkMode ? 'text-primary-600' : 'text-primary-300'
              }`} />
              <p className={`text-lg font-medium ${
                darkMode ? 'text-primary-400' : 'text-primary-600'
              }`}>
                No stocks found
              </p>
              <p className={`text-sm mt-2 ${
                darkMode ? 'text-primary-500' : 'text-primary-500'
              }`}>
                Try adjusting your filters
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${
          darkMode ? 'border-primary-700/50' : 'border-primary-200'
        }`}>
          <p className={`text-xs text-center ${
            darkMode ? 'text-primary-400' : 'text-primary-600'
          }`}>
            Showing {filteredStocks.length} of {popularStocks.length} stocks
          </p>
        </div>
      </div>
    </div>
  );
}

export default StockScreener;
