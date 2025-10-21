StockPulse - Interactive Stock Dashboard

StockPulse is a modern, feature-rich stock market dashboard built with React and Vite. It provides real-time stock data with beautiful visualizations, advanced features, and a polished user experience. Check it live: [https://interactive-dashboard-ivory.vercel.app/](https://interactive-dashboard-ivory.vercel.app/).

## Features

### Core Features
- **Real-Time Stock Data**: View comprehensive stock information including open, high, low, close, and volume
- **Stock Comparison**: Compare multiple stocks side-by-side with synchronized charts
- **Watchlist Management**: Save and track your favorite stocks with localStorage persistence
- **Interactive Charts**: Zoom, pan, and explore historical data with Chart.js
- **Multiple Time Ranges**: View data for 1 day, 7 days, 1 month, 4 months, or 1 year
- **Dark/Light Mode**: Seamless theme switching with smooth transitions
- **Three Color Themes**: Classic (neutral), Warm (beige tones), Vibrant (purple/pink)

### Enhanced UX
- **Smart Search Autocomplete**: Quick stock symbol lookup with popular stocks suggestions
- **Keyboard Shortcuts**: Navigate efficiently with keyboard commands (press `?` to see all)
- **Skeleton Loaders**: Smooth loading states for better perceived performance
- **Error Handling**: User-friendly error messages with retry functionality
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Customizable Stats**: Show/hide specific statistics based on your preferences

### Performance
- **Code Splitting**: Lazy loading of components for faster initial load
- **Custom Hooks**: Reusable logic with `useStockData` and `useKeyboardShortcuts`
- **Request Cancellation**: Automatic cleanup of pending requests
- **Optimized Rendering**: React.memo and proper dependency management

## Tech Stack

**Frontend**
- React 19 with Hooks
- Vite (build tool)
- Tailwind CSS (styling)
- Chart.js with zoom plugin
- TypeScript ready

**Backend**
- Node.js & Express
- yahoo-finance2 API
- CORS enabled

**Testing & Quality**
- Vitest (unit testing)
- Testing Library (component testing)
- ESLint (code quality)

**Deployment**
- Vercel (frontend)
- Render (backend)

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/ElderHorror/Interactive-Dashboard.git
cd Interactive-Dashboard
```

2. **Install dependencies**
```bash
npm install
```

3. **Run locally**

**Development (Frontend + Backend):**
```bash
npm start
```
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

**Run tests:**
```bash
npm test          # Run tests in watch mode
npm run test:ui   # Open Vitest UI
npm run test:coverage  # Generate coverage report
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
│   ├── components/          # React components
│   │   ├── Dashboard.jsx
│   │   ├── ChartDisplay.jsx
│   │   ├── StockSearch.jsx
│   │   ├── Watchlist.jsx
│   │   ├── SkeletonLoader.jsx
│   │   ├── ErrorDisplay.jsx
│   │   └── KeyboardShortcutsModal.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useStockData.jsx
│   │   └── useKeyboardShortcuts.jsx
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── server.js                # Express backend
└── package.json
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