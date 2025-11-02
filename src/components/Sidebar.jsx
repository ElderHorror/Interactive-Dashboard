import { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Star, 
  Filter, 
  Briefcase, 
  Newspaper,
  BarChart3,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function Sidebar({ activeView, setActiveView, collapsed, setCollapsed }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'markets', label: 'Markets', icon: TrendingUp },
    { id: 'watchlist', label: 'Watchlist', icon: Star, badge: null },
    { id: 'screener', label: 'Screener', icon: Filter },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'news', label: 'News', icon: Newspaper },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <aside 
      className={`fixed left-0 top-16 bottom-0 bg-background-surface border-r border-border transition-all duration-300 ease-smooth z-40 ${
        collapsed ? 'w-16' : 'w-60'
      }`}
    >
      <div className="h-full flex flex-col">
        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`nav-item w-full ${isActive ? 'active' : ''}`}
                title={collapsed ? item.label : ''}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 text-left text-sm">{item.label}</span>
                    {item.badge !== null && item.badge !== undefined && (
                      <span className="badge badge-neutral">{item.badge}</span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="p-3 border-t border-border">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="btn-icon w-full flex items-center justify-center"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
