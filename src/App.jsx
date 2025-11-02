import React, { useState, useEffect, lazy, Suspense } from 'react';
import { Analytics } from "@vercel/analytics/react"
import './index.css';
import TopNav from './components/TopNav';
import Sidebar from './components/Sidebar';
import SearchOverlay from './components/SearchOverlay';
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
const Markets = lazy(() => import('./components/Markets'));

function App() {
  const [symbol, setSymbol] = useState('');
  const [compareSymbol, setCompareSymbol] = useState('');
  const [showCompare, setShowCompare] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [range, setRange] = useState('7d');
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showScreener, setShowScreener] = useState(false);
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeView, setActiveView] = useState('dashboard');

  // Use custom hook for data fetching
  const { data: dashData } = useStockData(symbol, range, !!symbol);
  const { data: compareData } = useStockData(
    compareSymbol,
    range,
    showCompare && !!compareSymbol
  );

  const ranges = [
    { label: '1D', value: '1d' },
    { label: '7D', value: '7d' },
    { label: '1M', value: '1m' },
    { label: '4M', value: '4m' },
    { label: '1Y', value: '1y' },
  ];

  useEffect(() => {
    document.title = symbol ? `${symbol} - StockPulse` : 'StockPulse';
  }, [symbol]);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    'ctrl+k': (e) => {
      e.preventDefault();
      setShowSearchOverlay(true);
    },
    'ctrl+d': () => setDarkMode((prev) => !prev),
    'ctrl+c': () => setShowCompare((prev) => !prev),
    'escape': () => {
      if (showSearchOverlay) {
        setShowSearchOverlay(false);
      } else if (showShortcuts) {
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

  return (
    <div className="min-h-screen bg-background-base">
      {/* Top Navigation */}
      <TopNav 
        darkMode={darkMode} 
        setDarkMode={setDarkMode}
        onSearchFocus={() => setShowSearchOverlay(true)}
      />

      {/* Sidebar */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <main className={`pt-20 transition-all duration-300 ease-smooth ${
        sidebarCollapsed ? 'pl-16' : 'pl-60'
      }`}>
        <div className="p-6">
          {/* Stock Symbol Header */}
          {symbol && (
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-2xl font-bold text-text-primary font-mono">{symbol}</h2>
              {showCompare && compareSymbol && (
                <>
                  <span className="text-text-tertiary">vs</span>
                  <h2 className="text-2xl font-bold text-text-secondary font-mono">{compareSymbol}</h2>
                </>
              )}
            </div>
          )}

          {/* Content based on active view */}
          {activeView === 'dashboard' && (
            <>
              {symbol ? (
                <Suspense fallback={<SkeletonLoader darkMode={darkMode} type="dashboard" />}>
                  <div className="space-y-6">
                    {/* Dashboard Stats */}
                    <div className={showCompare && compareSymbol ? 'grid grid-cols-1 xl:grid-cols-2 gap-6' : ''}>
                      <Dashboard symbol={symbol} darkMode={darkMode} range={range} />
                      {showCompare && compareSymbol && (
                        <Dashboard symbol={compareSymbol} darkMode={darkMode} range={range} />
                      )}
                    </div>

                    {/* Chart */}
                    <div className="w-full">
                      <ChartDisplay 
                        dashData={dashData} 
                        compareData={showCompare && compareSymbol ? compareData : null}
                        darkMode={darkMode} 
                        range={range}
                        onRangeChange={setRange}
                      />
                    </div>

                    {/* News Feed */}
                    <div className="w-full">
                      <NewsFeed symbol={symbol} darkMode={darkMode} />
                    </div>
                  </div>
                </Suspense>
              ) : (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
                  <div className="text-center max-w-md">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-primary to-accent-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-2">Search for a stock</h3>
                    <p className="text-text-secondary mb-6">
                      Use the search bar above or press <kbd className="px-2 py-1 bg-background-elevated border border-border rounded text-xs font-mono">⌘K</kbd> to get started
                    </p>
                    <button
                      onClick={() => setShowSearchOverlay(true)}
                      className="btn-primary"
                    >
                      Search Stocks
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {activeView === 'markets' && (
            <Suspense fallback={<SkeletonLoader darkMode={darkMode} type="dashboard" />}>
              <Markets darkMode={darkMode} />
            </Suspense>
          )}

          {activeView === 'watchlist' && (
            <Suspense fallback={<SkeletonLoader darkMode={darkMode} type="dashboard" />}>
              <Watchlist 
                darkMode={darkMode} 
                onSelectSymbol={handleSymbolSelect}
                isComparing={showCompare}
              />
            </Suspense>
          )}

          {activeView === 'screener' && (
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-4">Stock Screener</h2>
              <p className="text-text-secondary">Screener view coming soon...</p>
            </div>
          )}

          {activeView === 'news' && symbol && (
            <Suspense fallback={<SkeletonLoader darkMode={darkMode} type="dashboard" />}>
              <NewsFeed symbol={symbol} darkMode={darkMode} />
            </Suspense>
          )}
        </div>
      </main>

      {/* Search Overlay */}
      <SearchOverlay 
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
        onSelectSymbol={handleSymbolSelect}
      />

      {/* Modals */}
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