import { useState, useEffect, useRef } from 'react';

// Popular stock symbols for autocomplete
const POPULAR_STOCKS = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'META', name: 'Meta Platforms Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.' },
  { symbol: 'V', name: 'Visa Inc.' },
  { symbol: 'WMT', name: 'Walmart Inc.' },
  { symbol: 'DIS', name: 'The Walt Disney Company' },
  { symbol: 'NFLX', name: 'Netflix Inc.' },
  { symbol: 'BA', name: 'Boeing Company' },
  { symbol: 'INTC', name: 'Intel Corporation' },
  { symbol: 'AMD', name: 'Advanced Micro Devices' },
  { symbol: 'PYPL', name: 'PayPal Holdings Inc.' },
  { symbol: 'ADBE', name: 'Adobe Inc.' },
  { symbol: 'CRM', name: 'Salesforce Inc.' },
  { symbol: 'ORCL', name: 'Oracle Corporation' },
  { symbol: 'IBM', name: 'IBM Corporation' },
];

function StockSearch({ value, onChange, placeholder, darkMode, onClear, autoFocus = false }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredStocks, setFilteredStocks] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    if (value) {
      const filtered = POPULAR_STOCKS.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(value.toLowerCase()) ||
          stock.name.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 8);
      setFilteredStocks(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredStocks([]);
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (!showSuggestions || filteredStocks.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredStocks.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          selectStock(filteredStocks[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
    }
  };

  const selectStock = (stock) => {
    onChange(stock.symbol);
    setShowSuggestions(false);
    setSelectedIndex(-1);
  };

  return (
    <div className="relative flex-1 min-w-[200px] max-w-[400px] w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value.toUpperCase())}
        onKeyDown={handleKeyDown}
        onFocus={() => value && setShowSuggestions(filteredStocks.length > 0)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="input-modern"
      />

      {showSuggestions && filteredStocks.length > 0 && (
        <div
          ref={suggestionsRef}
          className={`absolute z-50 w-full mt-1 rounded-lg shadow-lg border overflow-hidden ${
            darkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200'
          }`}
        >
          {filteredStocks.map((stock, index) => (
            <button
              key={stock.symbol}
              onClick={() => selectStock(stock)}
              className={`w-full px-4 py-2 text-left transition-colors ${
                index === selectedIndex
                  ? darkMode
                    ? 'bg-purple-600 text-white'
                    : 'bg-purple-100 text-purple-900'
                  : darkMode
                  ? 'hover:bg-gray-700 text-gray-200'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              <div className="font-semibold">{stock.symbol}</div>
              <div className={`text-xs ${index === selectedIndex ? 'text-white/80' : darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {stock.name}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default StockSearch;
