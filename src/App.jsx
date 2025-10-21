import React, { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { Analytics } from "@vercel/analytics/react"
import { TrendingUp, BarChart3, Sparkles, Filter } from 'lucide-react';
import './index.css';
import StockSearch from './components/StockSearch';
import SkeletonLoader from './components/SkeletonLoader';
import { useStockData } from './hooks/useStockData';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

// Lazy load heavy components
const Dashboard = lazy(() => import('./components/Dashboard.jsx'));
const ChartDisplay = lazy(() => import('./components/ChartDisplay.jsx'));
const Watchlist = lazy(() => import('./components/Watchlist'));
const KeyboardShortcutsModal = lazy(() => import('./components/KeyboardShortcutsModal'));
const StockScreener = lazy(() => import('./components/StockScreener'));
const NewsFeed = lazy(() => import('./components/NewsFeed'));

function App() {
  const [symbol, setSymbol] = useState('');
  const [compareSymbol, setCompareSymbol] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [colorTheme, setColorTheme] = useState('neutral'); // neutral, warm, vibrant
  const [range, setRange] = useState('7d');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showScreener, setShowScreener] = useState(false);
  const searchInputRef = useRef(null);
  const compareInputRef = useRef(null);

  // Use custom hook for data fetching
  const { data: dashData } = useStockData(symbol, range, !!symbol);
  const { data: compareData } = useStockData(
    compareSymbol,
    range,
    showCompare && !!compareSymbol
  );

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

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': (e) => {
      e.preventDefault();
      searchInputRef.current?.querySelector('input')?.focus();
    },
    'ctrl+d': () => setDarkMode((prev) => !prev),
    'ctrl+c': () => setShowCompare((prev) => !prev),
    'escape': () => {
      if (showShortcuts) {
        setShowShortcuts(false);
      } else if (symbol) {
        setSymbol('');
      }
    },
    '?': () => setShowShortcuts(true),
    '1': () => setRange('1d'),
    '2': () => setRange('7d'),
    '3': () => setRange('1m'),
    '4': () => setRange('4m'),
    '5': () => setRange('1y'),
  });

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

  // Theme configurations
  const themes = {
    neutral: {
      light: 'bg-gradient-to-br from-primary-50 via-white to-primary-100',
      dark: 'bg-gradient-to-br from-primary-900 via-primary-800 to-black',
      accent: 'accent-500',
      orb1: darkMode ? 'bg-accent-500/20' : 'bg-accent-300/30',
      orb2: darkMode ? 'bg-primary-600/20' : 'bg-primary-400/30',
    },
    warm: {
      light: 'bg-gradient-to-br from-warm-50 via-white to-warm-100',
      dark: 'bg-gradient-to-br from-warm-900 via-warm-800 to-black',
      accent: 'warm-600',
      orb1: darkMode ? 'bg-warm-500/20' : 'bg-warm-300/30',
      orb2: darkMode ? 'bg-warm-700/20' : 'bg-warm-400/30',
    },
    vibrant: {
      light: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50',
      dark: 'bg-gradient-to-br from-gray-900 via-purple-900/30 to-black',
      accent: 'purple-500',
      orb1: darkMode ? 'bg-purple-500/20' : 'bg-purple-300/30',
      orb2: darkMode ? 'bg-pink-500/20' : 'bg-pink-300/30',
    },
  };

  const currentTheme = themes[colorTheme];

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-start p-4 sm:p-6 smooth-transition ${
        darkMode ? currentTheme.dark : currentTheme.light
      }`}
    >
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-10 ${
          currentTheme.orb1
        } animate-pulse`} />
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-10 ${
          currentTheme.orb2
        } animate-pulse`} style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-7xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className={`w-8 h-8 sm:w-12 sm:h-12 ${darkMode ? 'text-accent-400' : 'text-accent-600'} animate-pulse`} />
            <h1 className={`text-4xl sm:text-6xl md:text-7xl font-black tracking-tight ${
              darkMode ? 'text-white' : 'text-primary-900'
            }`}>
              Stock<span className={`bg-clip-text text-transparent bg-gradient-to-r ${
                colorTheme === 'neutral' ? 'from-accent-500 to-accent-700' :
                colorTheme === 'warm' ? 'from-warm-600 to-warm-800' :
                'from-purple-500 to-pink-600'
              }`}>Pulse</span>
            </h1>
            <Sparkles className={`w-6 h-6 sm:w-8 sm:h-8 ${darkMode ? 'text-accent-400' : 'text-accent-600'}`} />
          </div>
          <p className={`text-sm sm:text-lg max-w-2xl mx-auto ${
            darkMode ? 'text-primary-300' : 'text-primary-700'
          }`}>
            Real-time stock market insights with beautiful visualizations
          </p>
        </div>

        {/* Main Card */
        <div className={`rounded-3xl shadow-2xl p-4 sm:p-8 border relative animate-fade-in-up ${
          darkMode 
            ? 'bg-primary-800/40 backdrop-blur-xl border-primary-700/50' 
            : 'bg-white/80 backdrop-blur-xl border-primary-200'
        }`} style={{ animationDelay: '0.2s' }}>
      
        {/* Header with controls */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className={`w-6 h-6 ${darkMode ? 'text-accent-400' : 'text-accent-600'}`} />
            <h2 className={`text-xl sm:text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-primary-900'
            }`}>
              Dashboard
            </h2>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Selector */}
            {/* <select
              value={colorTheme}
              onChange={(e) => setColorTheme(e.target.value)}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-medium smooth-transition border ${
                darkMode
                  ? 'bg-primary-700/50 border-primary-600 text-primary-200 hover:bg-primary-600/50'
                  : 'bg-white border-primary-300 text-primary-800 hover:bg-primary-50'
              }`}
              title="Change color theme"
            >
              <option value="neutral">Classic</option>
              <option value="warm">Warm</option>
              <option value="vibrant">Vibrant</option>
            </select> */}

            <Suspense fallback={<div className="w-8 h-8" />}>
              <Watchlist 
                darkMode={darkMode} 
                onSelectSymbol={handleSymbolSelect} 
                isComparing={showCompare}
              />
            </Suspense>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 sm:p-2.5 rounded-xl smooth-transition hover:scale-110 active:scale-95 border ${
                darkMode
                  ? 'bg-primary-700/50 border-primary-600 text-primary-200 hover:bg-primary-600/50'
                  : 'bg-white border-primary-300 text-primary-800 hover:bg-primary-50'
              }`}
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
        
        {/* Search Section */}
        <div className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-3 mb-6">
          <div ref={searchInputRef} className="flex-1">
            <StockSearch
              value={symbol}
              onChange={setSymbol}
              placeholder="Search stocks (e.g., AAPL, TSLA, MSFT)"
              darkMode={darkMode}
              onClear={() => setSymbol('')}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowScreener(true)}
              className={`px-3 sm:px-4 py-3 font-medium rounded-xl smooth-transition text-sm sm:text-base shadow-lg border flex items-center gap-2 ${
                darkMode ? 'bg-primary-700/50 border-primary-600 text-primary-200 hover:bg-primary-600/50' : 'bg-white border-primary-300 text-primary-800 hover:bg-primary-50'
              }`}
              title="Stock Screener"
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">Screener</span>
            </button>
            <button
              onClick={() => setShowCompare(!showCompare)}
              className={`px-4 py-3 font-medium rounded-xl smooth-transition text-sm sm:text-base shadow-lg ${
                showCompare 
                  ? (colorTheme === 'neutral' ? 'bg-gradient-to-r from-accent-500 to-accent-700' : colorTheme === 'warm' ? 'bg-gradient-to-r from-warm-600 to-warm-800' : 'bg-gradient-to-r from-purple-500 to-pink-500') + ' text-white hover:shadow-xl'
                  : darkMode ? 'bg-primary-700/50 border border-primary-600 text-primary-200 hover:bg-primary-600/50' : 'bg-white border border-primary-300 text-primary-800 hover:bg-primary-50'
              }`}
            >
              <span className="hidden sm:inline">Compare Stocks</span>
              <span className="sm:hidden">Compare</span>
            </button>
          </div>
        </div>

        {showCompare && (
          <div className="flex flex-col sm:flex-row max-w-2xl mx-auto gap-3 mb-6 animate-fade-in">
            <div ref={compareInputRef} className="flex-1">
              <StockSearch
                value={compareSymbol}
                onChange={setCompareSymbol}
                placeholder="Enter second stock to compare"
                darkMode={darkMode}
                onClear={() => setCompareSymbol('')}
              />
            </div>
          </div>
        )}

        {/* Time Range Selector */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {ranges.map((r, index) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium smooth-transition border ${
                range === r.value
                  ? (colorTheme === 'neutral' ? 'bg-accent-500 border-accent-600' : colorTheme === 'warm' ? 'bg-warm-600 border-warm-700' : 'bg-purple-500 border-purple-600') + ' text-white shadow-lg scale-105'
                  : darkMode ? 'bg-primary-700/50 border-primary-600 text-primary-300 hover:bg-primary-600/50' : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="mt-4 w-full">
          {symbol && (
            <Suspense fallback={<SkeletonLoader darkMode={darkMode} type="dashboard" />}>
              <div className="space-y-4">
                <div className={showCompare ? 'grid grid-cols-1 lg:grid-cols-2 gap-4' : ''}>
                  <Dashboard symbol={symbol} darkMode={darkMode} range={range} />
                  {showCompare && compareSymbol && <Dashboard symbol={compareSymbol} darkMode={darkMode} range={range} />}
                </div>
                <div className="w-full">
                  <ChartDisplay 
                    dashData={dashData} 
                    compareData={showCompare && compareSymbol ? compareData : null}
                    darkMode={darkMode} 
                    range={range} 
                  />
                </div>
                <div className="w-full">
                  <NewsFeed symbol={symbol} darkMode={darkMode} />
                </div>
              </div>
            </Suspense>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-white/10">
          <a 
            href="https://github.com/ElderHorror/Interactive-Dashboard" 
            className={`text-sm smooth-transition flex items-center gap-2 ${
              darkMode ? 'text-primary-400 hover:text-white' : 'text-primary-600 hover:text-primary-900'
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            View Source
          </a>
          <button
            onClick={() => setShowShortcuts(true)}
            className={`text-sm smooth-transition flex items-center gap-2 hover:scale-105 ${
              darkMode ? 'text-primary-400 hover:text-white' : 'text-primary-600 hover:text-primary-900'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            Keyboard Shortcuts (?)
          </button>
        </div>
        </div>
        }
      </div>

      <Suspense fallback={null}>
        <KeyboardShortcutsModal
          isOpen={showShortcuts}
          onClose={() => setShowShortcuts(false)}
          darkMode={darkMode}
        />
      </Suspense>

      {showScreener && (
        <Suspense fallback={null}>
          <StockScreener
            darkMode={darkMode}
            onSelectStock={setSymbol}
            onClose={() => setShowScreener(false)}
          />
        </Suspense>
      )}

      <Analytics />
      
    </div>
  );
}

export default App;