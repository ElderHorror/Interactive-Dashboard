import { useEffect, useRef, useState } from 'react';
import { Search, TrendingUp, X, Clock } from 'lucide-react';
import StockSearch from './StockSearch';

function SearchOverlay({ isOpen, onClose, onSelectSymbol }) {
  const overlayRef = useRef(null);
  const inputRef = useRef(null);
  const [recentSearches, setRecentSearches] = useState([]);

  useEffect(() => {
    if (isOpen) {
      // Focus input when opened
      setTimeout(() => inputRef.current?.querySelector('input')?.focus(), 100);
      
      // Load recent searches
      const saved = localStorage.getItem('recentSearches');
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (overlayRef.current === e.target) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSelect = (symbol) => {
    // Save to recent searches
    const updated = [symbol, ...recentSearches.filter(s => s !== symbol)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
    
    onSelectSymbol(symbol);
    onClose();
  };

  if (!isOpen) return null;

  const trendingStocks = ['AAPL', 'TSLA', 'NVDA', 'MSFT', 'GOOGL', 'AMZN'];

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-start justify-center pt-20 animate-fade-in"
    >
      <div className="w-full max-w-2xl mx-4 bg-background-elevated border border-border rounded-xl shadow-2xl animate-fade-in-up">
        {/* Search Input */}
        <div className="p-4 border-b border-border">
          <div className="relative" ref={inputRef}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search stocks, ETFs, crypto..."
              className="w-full pl-12 pr-12 py-3 bg-background-surface text-text-primary placeholder-text-tertiary border border-border rounded-lg focus:border-border-focus focus:outline-none focus:ring-1 focus:ring-border-focus transition-all"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-background-hover rounded transition-colors"
            >
              <X className="w-5 h-5 text-text-tertiary" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {/* Recent Searches */}
          {recentSearches.length > 0 && (
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-text-tertiary" />
                <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Recent</h3>
              </div>
              <div className="space-y-1">
                {recentSearches.map((symbol) => (
                  <button
                    key={symbol}
                    onClick={() => handleSelect(symbol)}
                    className="w-full px-3 py-2 text-left rounded-lg hover:bg-background-hover transition-colors flex items-center gap-3 group"
                  >
                    <span className="font-mono font-semibold text-text-primary">{symbol}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Trending */}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-text-tertiary" />
              <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Trending</h3>
            </div>
            <div className="space-y-1">
              {trendingStocks.map((symbol) => (
                <button
                  key={symbol}
                  onClick={() => handleSelect(symbol)}
                  className="w-full px-3 py-2 text-left rounded-lg hover:bg-background-hover transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold text-text-primary">{symbol}</span>
                    <span className="text-sm text-text-secondary">Company Name</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono text-text-primary">$150.25</span>
                    <span className="text-xs font-medium text-bull">+2.5%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-background-surface rounded-b-xl">
          <div className="flex items-center justify-between text-xs text-text-tertiary">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background-elevated border border-border rounded font-mono">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-background-elevated border border-border rounded font-mono">↓</kbd>
                <span>Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-background-elevated border border-border rounded font-mono">↵</kbd>
                <span>Select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-background-elevated border border-border rounded font-mono">ESC</kbd>
              <span>Close</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchOverlay;
