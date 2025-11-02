import { Search, Settings, Moon, Sun } from 'lucide-react';

function TopNav({ darkMode, setDarkMode, onSearchFocus }) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-background-surface border-b border-border z-50">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-primary-dark rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-xl font-bold">
              <span className="text-text-primary">Stock</span>
              <span className="gradient-text-blue">Pulse</span>
            </h1>
          </div>
        </div>

        {/* Center Search */}
        <div className="flex-1 max-w-xl mx-8">
          <button
            onClick={onSearchFocus}
            className="w-full px-4 py-2 bg-background-elevated border border-border rounded-lg flex items-center gap-3 text-text-secondary hover:border-border-light transition-colors duration-150 group"
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left text-sm">Search stocks...</span>
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 bg-background-surface border border-border rounded text-xs font-mono">
              <span>⌘</span>
              <span>K</span>
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Market Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-background-elevated rounded-lg border border-border">
            <div className="w-2 h-2 bg-bull rounded-full animate-pulse" />
            <span className="text-xs text-text-secondary">Market Open</span>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="btn-icon"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Settings */}
          <button className="btn-icon" aria-label="Settings">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;
