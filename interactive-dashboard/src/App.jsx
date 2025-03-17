import React, { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import './index.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [range, setRange] = useState('7d'); // Default to 7 days

  const ranges = [
    { label: 'Today', value: '1d' },
    { label: '7 Days', value: '7d' },
    { label: '1 Month', value: '1m' },
    { label: '4 Months', value: '4m' },
    { label: '1 Year', value: '1y' },
  ];

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
          : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
      }`}
    >
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/20 relative">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="absolute top-4 right-4 px-3 py-1 bg-white/20 text-white rounded-lg hover:bg-white/30 transition duration-300"
        >
          {darkMode ? 'Light' : 'Dark'}
        </button>
        <h1 className="text-4xl font-extrabold text-center text-white mb-8 tracking-wide drop-shadow-md">
          Stock Dashboard
        </h1>
        <div className="flex max-w-lg mx-auto gap-3">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300"
          />
          <button
            onClick={() => setSymbol('')}
            className="px-4 py-2 bg-white/30 text-white rounded-lg hover:bg-white/40 transition duration-300"
          >
            Clear
          </button>
        </div>
        <div className="flex justify-center gap-2 mt-4">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-3 py-1 rounded-lg text-sm transition duration-300 ${
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
      </div>
    </div>
  );
}

export default App;