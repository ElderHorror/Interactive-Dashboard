import React, { useState, useEffect } from 'react'; // Add useEffect
import Dashboard from './components/Dashboard.jsx';
import './index.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [darkMode, setDarkMode] = useState(true);
  const [range, setRange] = useState('7d');

  const ranges = [
    { label: 'Today', value: '1d' },
    { label: '7 Days', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: '4 Months', value: '4m' },
    { label: '1 Year', value: '1y' },
  ];

  useEffect(() => {
    document.title = symbol ? `${symbol} - StockPulse` : 'StockPulse';
  }, [symbol]);

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
          : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
      }`}
    >
      
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-8 border border-white/20 relative">
      
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 px-2 py-1 sm:px-3 sm:py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition duration-300 text-sm sm:text-base"
        >
          
          {darkMode ? 'Light' : 'Dark'}
        </button>
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-white mb-6 sm:mb-8 tracking-wide drop-shadow-md">
          Stock Dashboard
        </h1>
        
        <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
          
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 p-2 sm:p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 text-sm sm:text-base"
          />
          <button
            onClick={() => setSymbol('')}
            className="px-3 py-2 bg-white/30 text-white rounded-lg hover:bg-white/40 transition duration-300 text-sm sm:text-base"
          >
            Clear
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-2 py-1 sm:px-3 sm:py-1 rounded-lg text-xs sm:text-sm transition duration-300 ${
                range === r.value
                  ? darkMode
                    ? 'bg-gray-600 text-white'
                    : 'bg-white/40 text-white'
                  : darkMode
                  ? 'bg-gray-700/50 text-gray-300 hover:bg-gray-600'
                  : 'bg-white/20 text-white/80 hover:bg-white/30'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
        <Dashboard symbol={symbol} darkMode={darkMode} range={range} />
        <a href="https://github.com/ElderHorror/Interactive-Dashboard" className='text-sm text-white/80 hover:text-white'>View Source</a>
      </div>
    </div>
  );
}

export default App;