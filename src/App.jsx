import React, { useState, useEffect } from 'react'; // Add useEffect
import { Analytics } from "@vercel/analytics/react"
import Dashboard from './components/Dashboard.jsx';
import './index.css';
import axios from 'axios';
import ChartDisplay from './components/ChartDisplay.jsx';
import Watchlist from './components/Watchlist';

function App() {
  const [symbol, setSymbol] = useState('');
  const [compareSymbol, setCompareSymbol] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [range, setRange] = useState('7d');
  const [compareData, setCompareData] = useState(null);
  const [dashData, setDashData] = useState(null);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (symbol) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const controller = new AbortController();
      
      setLoading(true);
      axios
        .get(`${API_URL}/api/stock/${symbol}?range=${range}`, {
          signal: controller.signal
        })
        .then((response) => {
          setDashData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.name !== 'CanceledError') {
            console.error('Error fetching dashboard data:', error);
            setDashData(null);
            setLoading(false);
          }
        });

      return () => controller.abort();
    } else {
      setDashData(null);
    }
  }, [symbol, range]);

  useEffect(() => {
    if (showCompare && compareSymbol) {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const controller = new AbortController();
      
      setLoading(true);
      axios
        .get(`${API_URL}/api/stock/${compareSymbol}?range=${range}`, {
          signal: controller.signal
        })
        .then((response) => {
          setCompareData(response.data);
          setLoading(false);
        })
        .catch((error) => {
          if (error.name !== 'CanceledError') {
            console.error('Error fetching comparison data:', error);
            setCompareData(null);
            setLoading(false);
          }
        });

      return () => controller.abort();
    } else {
      setCompareData(null);
    }
  }, [compareSymbol, range, showCompare]);

  const handleSymbolSelect = (selectedSymbol, isForComparison = false) => {
    if (isForComparison) {
      setCompareSymbol(selectedSymbol);
      setShowCompare(true);
    } else {
      setSymbol(selectedSymbol);
      setShowCompare(false);
      setCompareSymbol('');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 transition-colors duration-500 ${
        darkMode
          ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
          : 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500'
      }`}
    >
      
      <div className="w-full max-w-6xl bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-4 sm:p-8 border border-white/20 relative">
      
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-white tracking-wide drop-shadow-md">
            Stock Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Watchlist 
              darkMode={darkMode} 
              onSelectSymbol={handleSymbolSelect} 
              currentSymbol={symbol}
              isComparing={showCompare}
            />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition duration-300"
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3">
          <input
            type="text"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder="Enter stock symbol (e.g., AAPL)"
            className="flex-1 min-w-[200px] max-w-[400px] w-full p-2 sm:p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 text-sm sm:text-base"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setSymbol('')}
              className="px-3 py-2 bg-white/30 text-white rounded-lg hover:bg-white/40 transition duration-300 text-sm sm:text-base"
            >
              Clear
            </button>
            <button
              onClick={() => setShowCompare(!showCompare)}
              className={`px-3 py-2 ${
                showCompare 
                  ? 'bg-purple-500/50 hover:bg-purple-500/60' 
                  : 'bg-white/30 hover:bg-white/40'
              } text-white rounded-lg transition duration-300 text-sm sm:text-base`}
            >
              Compare
            </button>
          </div>
        </div>

        {showCompare && (
          <div className="flex flex-col sm:flex-row max-w-lg mx-auto gap-3 mt-3">
            <input
              type="text"
              value={compareSymbol}
              onChange={(e) => setCompareSymbol(e.target.value)}
              placeholder="Enter stock to compare (e.g., MSFT)"
              className="flex-1 min-w-[200px] max-w-[400px] w-full p-2 sm:p-3 bg-white/20 text-white placeholder-gray-300 border border-white/30 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-300 text-sm sm:text-base"
            />
            <button
              onClick={() => setCompareSymbol('')}
              className="px-3 py-2 bg-white/30 text-white rounded-lg hover:bg-white/40 transition duration-300 text-sm sm:text-base"
            >
              Clear
            </button>
          </div>
        )}

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

        <div className="mt-4 w-full">
          {symbol && (
            <div className="space-y-4">
              <div className={`${showCompare ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}`}>
                <Dashboard symbol={symbol} darkMode={darkMode} range={range} onSelectSymbol={handleSymbolSelect} />
                {showCompare && compareSymbol && <Dashboard symbol={compareSymbol} darkMode={darkMode} range={range} onSelectSymbol={handleSymbolSelect} />}
              </div>
              <div className="w-full">
                <ChartDisplay 
                  dashData={dashData} 
                  compareData={showCompare && compareSymbol ? compareData : null}
                  darkMode={darkMode} 
                  range={range} 
                />
              </div>
            </div>
          )}
        </div>

        <a href="https://github.com/ElderHorror/Interactive-Dashboard" className='text-sm text-white/80 hover:text-white'>View Source</a>
      </div>
    </div>
  );
}

export default App;