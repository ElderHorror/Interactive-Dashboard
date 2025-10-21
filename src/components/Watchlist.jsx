import { useState, useEffect } from 'react';

function Watchlist({ darkMode, onSelectSymbol, isComparing }) {
  const [watchlist, setWatchlist] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="relative">
      <button
        onClick={toggleWatchlist}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
          darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
        } text-gray-900 transition-colors`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 ${darkMode ? 'text-white' : 'text-gray-900'}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            clipRule="evenodd"
          />
        </svg>
        <span className="hidden sm:inline text-gray-900 dark:text-white">Watchlist</span>
        <span className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded-full">
          {watchlist.length}
        </span>
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-2 w-64 rounded-lg shadow-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } border ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } z-10`}
        >
          <div className="p-2">
            {watchlist.length === 0 ? (
              <p className={`text-center py-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                No stocks in watchlist
              </p>
            ) : (
              <div className="space-y-1">
                {watchlist.map((symbol) => (
                  <div
                    key={symbol}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                    }`}
                  >
                    <button
                      onClick={() => handleSymbolClick(symbol)}
                      className={`flex-1 text-left ${
                        darkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}
                    >
                      {symbol}
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(symbol)}
                      className={`p-1 rounded-full ${
                        darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-200'
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Watchlist; 