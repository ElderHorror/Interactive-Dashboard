# 📈 StockPulse - Professional Trading Terminal

<div align="center">

![StockPulse Banner](https://img.shields.io/badge/StockPulse-Trading%20Terminal-00C9FF?style=for-the-badge&logo=react&logoColor=white)

**A modern, Bloomberg-inspired stock market dashboard with real-time data, advanced charting, and professional-grade UI**

[![Live Demo](https://img.shields.io/badge/Live-Demo-00C9FF?style=flat-square)](https://interactive-dashboard-ivory.vercel.app/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

[Live Demo](https://interactive-dashboard-ivory.vercel.app/) • [Features](#-features) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## ✨ Features

### 🎨 **Modern Dark Terminal UI**
- **Bloomberg-Inspired Design**: Professional dark theme with electric blue accents (`#00C9FF`)
- **Terminal Aesthetics**: Monospace fonts (JetBrains Mono) for all financial data
- **Color-Coded Data**: Bull (`#00E676`) and Bear (`#FF3366`) indicators throughout
- **Smooth Animations**: Fade-in, slide-in, and staggered animations for polished UX
- **Responsive Layout**: Fixed top nav, collapsible sidebar, fluid content area

### 📊 **Advanced Charting**
- **Interactive Price Charts**: Zoom (Ctrl+Scroll), pan (Ctrl+Drag), and explore historical data
- **Technical Indicators**: 
  - Moving Averages (MA20, MA50)
  - Bollinger Bands
  - RSI (Relative Strength Index)
- **Multiple Timeframes**: 1D, 7D, 1M, 4M, 1Y with integrated time selector
- **Comparison Mode**: Overlay multiple stocks on the same chart
- **Professional Grid**: Dark grid lines, right-side price axis, monospace labels
- **Export Functionality**: Download charts as images

### 📈 **Real-Time Market Data**
- **Live Stock Quotes**: Real-time prices, changes, volume, and market cap
- **Market Overview**: Major indices (S&P 500, NASDAQ, Dow Jones, etc.)
- **Top Movers**: Real-time top gainers and losers
- **Sector Performance**: Track performance across 10 major sectors
- **News Feed**: Latest market news with source attribution

### 🎯 **Smart Features**
- **Spotlight Search** (⌘K): Fast, keyboard-driven stock search with recent/trending stocks
- **Watchlist Management**: Track favorite stocks with persistent storage
- **Stock Comparison**: Side-by-side analysis of multiple stocks
- **Customizable Dashboard**: Show/hide statistics based on preferences
- **Portfolio Tracking**: Monitor your investments (coming soon)
- **Stock Screener**: Filter stocks by criteria (coming soon)

### ⚡ **Performance & UX**
- **Code Splitting**: Lazy loading for optimal initial load time
- **Custom Hooks**: `useStockData`, `useKeyboardShortcuts` for clean architecture
- **Request Cancellation**: Automatic cleanup of pending API calls
- **Skeleton Loaders**: Smooth loading states for perceived performance
- **Error Boundaries**: Graceful error handling with retry functionality
- **Keyboard Navigation**: Full keyboard support for power users

## 🛠️ Tech Stack

### **Frontend**
```
React 19.0          → Modern hooks & concurrent features
Vite 6.2            → Lightning-fast build tool
Tailwind CSS 3.4    → Utility-first styling with custom design system
Chart.js 4.5        → Interactive, responsive charts
Lucide React        → Beautiful, consistent icons
Axios               → HTTP client with interceptors
```

### **Backend**
```
Node.js & Express   → RESTful API server
yahoo-finance2      → Real-time stock market data
NewsAPI             → Latest financial news
CORS                → Secure cross-origin requests
```

### **Design System**
```css
/* Color Palette */
Background:  #0A0E27 (base), #131722 (surface), #1E222D (elevated)
Accent:      #00C9FF (primary), #0099CC (dark)
Bull/Bear:   #00E676 (green) / #FF3366 (red-pink)
Text:        #E0E3EB (primary), #9598A1 (secondary), #6B6E76 (tertiary)

/* Typography */
UI Font:     Inter (clean, professional)
Data Font:   JetBrains Mono (monospace, tabular numbers)
```

### **Testing & Quality**
```
Vitest              → Fast unit testing
Testing Library     → Component testing
ESLint              → Code quality & consistency
```

### **Deployment**
```
Vercel              → Frontend hosting (CDN, auto-deploy)
Render              → Backend API hosting
```

## 🚀 Installation

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **npm** or **yarn**

### Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ElderHorror/Interactive-Dashboard.git
cd Interactive-Dashboard

# 2. Install dependencies
npm install

# 3. Start development servers (Frontend + Backend)
npm start
```

**Access the app:**
- 🌐 Frontend: http://localhost:5173
- 🔌 Backend: http://localhost:3001

### Alternative Commands

```bash
# Frontend only
npm run dev

# Backend only
npm run server

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm test                # Watch mode
npm run test:ui         # Vitest UI
npm run test:coverage   # Coverage report
```


Deployment (Optional)
Frontend (Vercel)

    Push to a private GitHub repo.
    In Vercel:
        Import repo.
        Framework: Vite.
        Build: npm run build.
        Output: dist.
        Env: VITE_API_URL=<your-render-url> (e.g., your Render backend URL).
    Deploy to get your frontend URL.

Backend (Render)

    Push to GitHub.
    In Render:
        New Web Service > Your repo.
        Environment: Node.
        Build: npm install.
        Env: ALLOWED_ORIGIN=<your-vercel-url> (e.g., your Vercel frontend URL).
    Deploy to get your backend URL.

Note: Keep your Render URL private to prevent unauthorized access.

## ⌨️ Keyboard Shortcuts

Press `?` in the app to see all shortcuts:

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` | Focus search input |
| `Ctrl + D` | Toggle dark/light mode |
| `Ctrl + C` | Toggle compare mode |
| `Esc` | Clear search or close modals |
| `1-5` | Quick select time range |
| `?` | Show keyboard shortcuts help |

## 📁 Project Structure

```
Interactive-Dashboard/
├── src/
│   ├── components/
│   │   ├── TopNav.jsx              # Fixed navigation bar
│   │   ├── Sidebar.jsx             # Collapsible navigation sidebar
│   │   ├── SearchOverlay.jsx       # ⌘K spotlight search
│   │   ├── Dashboard.jsx           # Stock statistics cards
│   │   ├── ChartDisplay.jsx        # Interactive price charts
│   │   ├── Markets.jsx             # Market overview (indices, movers, sectors)
│   │   ├── Watchlist.jsx           # Watchlist table
│   │   ├── NewsFeed.jsx            # Latest news cards
│   │   ├── StockSearch.jsx         # Search input with autocomplete
│   │   ├── StockScreener.jsx       # Stock filtering tool
│   │   ├── Portfolio.jsx           # Portfolio management
│   │   ├── SkeletonLoader.jsx      # Loading states
│   │   ├── ErrorDisplay.jsx        # Error handling
│   │   └── KeyboardShortcutsModal.jsx  # Shortcuts help
│   ├── hooks/
│   │   ├── useStockData.jsx        # Stock data fetching
│   │   └── useKeyboardShortcuts.jsx # Keyboard navigation
│   ├── App.jsx                     # Main app component
│   ├── index.css                   # Global styles & design system
│   └── main.jsx                    # Entry point
├── server.js                       # Express API server
├── tailwind.config.js              # Tailwind configuration
└── package.json                    # Dependencies & scripts
```

## 🧪 Testing

The project includes tests using Vitest and Testing Library. Run tests with:

```bash
npm test              # Run tests in watch mode
npm run test:ui       # Open Vitest UI
npm run test:coverage # Generate coverage report
```

## 💡 Usage Tips

1. **Search**: Start typing a stock symbol - autocomplete will suggest popular stocks
2. **Compare**: Click "Compare" button to analyze two stocks side-by-side
3. **Watchlist**: Click the + button on any stock to add it to your watchlist
4. **Zoom Charts**: Hold Ctrl + scroll to zoom, Ctrl + drag to pan
5. **Customize**: Use the settings icon to show/hide specific statistics

## 🐛 Troubleshooting

**Loading Issues:**
- Check CORS: `ALLOWED_ORIGIN` must match your frontend URL
- Verify `VITE_API_URL` points to your backend

**Backend Issues:**
- Test the API directly: `<your-backend-url>/api/stock/AAPL`
- Check server logs for errors

## 👨‍💻 About

Built by **Adedeji** - A web developer showcasing modern React development practices and API integration skills.

- **Live Demo**: [StockPulse](https://interactive-dashboard-ivory.vercel.app/)
- **X (Twitter)**: [@AdedejiAde50479](https://x.com/AdedejiAde50479)
- **GitHub**: [@ElderHorror](https://github.com/ElderHorror)

## 📝 Note

This is a personal portfolio project. The backend URL is not shared publicly to prevent misuse. To use this app, deploy your own instance following the deployment instructions above.

---