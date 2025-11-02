import { useState, useEffect } from 'react';
import { Star, TrendingUp, TrendingDown, X, BarChart2 } from 'lucide-react';

function Watchlist({ darkMode, onSelectSymbol, isComparing }) {
  const [watchlist, setWatchlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState('symbol'); // symbol, change, volume
  const [sortOrder, setSortOrder] = useState('asc'); // asc, desc

  // Load initial watchlist and set up storage event listener
  useEffect(() => {
    const loadWatchlist = () => {
      const savedWatchlist = localStorage.getItem('stockWatchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    };

    // Load initial watchlist
    loadWatchlist();

    // Listen for storage changes
    const handleStorageChange = (e) => {
      if (e.key === 'stockWatchlist') {
        loadWatchlist();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Also listen for changes in the same window
  useEffect(() => {
    const handleStorageChange = () => {
      const savedWatchlist = localStorage.getItem('stockWatchlist');
      if (savedWatchlist) {
        setWatchlist(JSON.parse(savedWatchlist));
      }
    };

    // Add custom event listener for same-window updates
    window.addEventListener('watchlistUpdate', handleStorageChange);
    return () => window.removeEventListener('watchlistUpdate', handleStorageChange);
  }, []);

  const toggleWatchlist = () => {
    setIsOpen(!isOpen);
  };

  const removeFromWatchlist = (symbol) => {
    const newWatchlist = watchlist.filter(item => item !== symbol);
    setWatchlist(newWatchlist);
    localStorage.setItem('stockWatchlist', JSON.stringify(newWatchlist));
    // Dispatch custom event for same-window updates
    window.dispatchEvent(new Event('watchlistUpdate'));
  };

  const handleSymbolClick = (symbol) => {
    if (isComparing) {
      onSelectSymbol(symbol, true); // true indicates this is for comparison
    } else {
      onSelectSymbol(symbol, false);
    }
    setIsOpen(false);
  };

  return (
    <div className="card-elevated p-6 w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Star className="w-5 h-5 text-warning fill-warning" />
          <h2 className="text-xl font-semibold text-text-primary">Watchlist</h2>
          <span className="badge badge-neutral">{watchlist.length}</span>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
          <p className="text-text-secondary mb-2">Your watchlist is empty</p>
          <p className="text-sm text-text-tertiary">Add stocks to track them here</p>
        </div>
      ) : (
        <div className="overflow-x-auto custom-scrollbar">
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Symbol</th>
                <th className="text-right" style={{ width: '15%' }}>Price</th>
                <th className="text-right" style={{ width: '15%' }}>Change</th>
                <th className="text-right" style={{ width: '20%' }}>Change %</th>
                <th className="text-right" style={{ width: '15%' }}>Volume</th>
                <th className="text-right" style={{ width: '10%' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((symbol) => {
                // Mock data - in real app, fetch from API
                const mockPrice = (Math.random() * 500 + 50).toFixed(2);
                const mockChange = (Math.random() * 20 - 10).toFixed(2);
                const mockChangePercent = (Math.random() * 10 - 5).toFixed(2);
                const mockVolume = (Math.random() * 100).toFixed(1);
                const isPositive = parseFloat(mockChange) >= 0;

                return (
                  <tr key={symbol} className="cursor-pointer" onClick={() => handleSymbolClick(symbol)}>
                    <td style={{ width: '15%' }}>
                      <span className="font-mono font-semibold text-text-primary">{symbol}</span>
                    </td>
                    <td className="text-right" style={{ width: '15%' }}>
                      <span className="font-mono tabular-nums text-text-primary">${mockPrice}</span>
                    </td>
                    <td className="text-right" style={{ width: '15%' }}>
                      <span className={`font-mono tabular-nums ${isPositive ? 'text-bull' : 'text-bear'}`}>
                        {isPositive ? '+' : ''}{mockChange}
                      </span>
                    </td>
                    <td className="text-right" style={{ width: '20%' }}>
                      <div className="flex items-center justify-end gap-1">
                        {isPositive ? (
                          <TrendingUp className="w-4 h-4 text-bull" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-bear" />
                        )}
                        <span className={`font-mono tabular-nums font-medium ${isPositive ? 'text-bull' : 'text-bear'}`}>
                          {isPositive ? '+' : ''}{mockChangePercent}%
                        </span>
                      </div>
                    </td>
                    <td className="text-right" style={{ width: '15%' }}>
                      <span className="font-mono tabular-nums text-text-secondary">{mockVolume}M</span>
                    </td>
                    <td className="text-right" style={{ width: '10%' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromWatchlist(symbol);
                        }}
                        className="btn-icon"
                        title="Remove from watchlist"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Watchlist; 