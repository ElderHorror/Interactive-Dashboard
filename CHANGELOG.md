# Changelog

All notable changes to StockPulse will be documented in this file.

## [2.0.0] - 2025-10-21

### 🎉 Major Portfolio Enhancements

#### 🎨 Professional Color System (60-30-10 Rule)
- **Neutral Color Palette**: Clean, professional grays and blues
- **Three Theme Variants**:
  - **Classic**: Neutral grays with blue accents (professional)
  - **Warm**: Beige and muted tones (soft, inviting)
  - **Vibrant**: Purple and pink gradients (creative, energetic)
- **60-30-10 Distribution**:
  - 60% Primary colors (backgrounds, main surfaces)
  - 30% Secondary colors (cards, containers)
  - 10% Accent colors (buttons, CTAs, highlights)
- **Light & Dark Modes**: Both modes for each theme
- **Semantic Colors**: Success (green), Error (red), Warning (orange)
- **High Contrast**: Excellent readability in both modes

#### 🎨 UI/UX Redesign
- **Modern Hero Section**: Eye-catching landing with gradient text and animated icons
- **Lucide React Icons**: Professional icon library throughout the app
- **Enhanced Card Design**: Glassmorphism effects with hover animations
- **Stat Cards**: Beautiful stat cards with icons and glow effects
- **Micro-interactions**: Hover effects, scale animations, and smooth transitions
- **Custom Animations**: Fade-in, slide-in, pulse, and shimmer effects
- **Better Typography**: Improved hierarchy with bold headings and better spacing
- **Animated Background**: Subtle floating gradient orbs
- **Modern Buttons**: Gradient buttons with glow effects
- **Enhanced Footer**: Better GitHub link and keyboard shortcuts button

#### Added
- **Smart Search Autocomplete**: Stock symbol search with popular stocks suggestions
- **Keyboard Shortcuts**: Full keyboard navigation support (Ctrl+K, Ctrl+D, Ctrl+C, etc.)
- **Skeleton Loaders**: Professional loading states for better UX
- **Error Handling**: User-friendly error messages with retry functionality
- **Custom Hooks**: 
  - `useStockData` - Centralized data fetching logic
  - `useKeyboardShortcuts` - Reusable keyboard navigation
- **Code Splitting**: Lazy loading of components for improved performance
- **Testing Infrastructure**: Vitest setup with sample tests
- **TypeScript Support**: TypeScript configuration ready for migration
- **Keyboard Shortcuts Modal**: Interactive help dialog (press `?`)

#### Improved
- **Performance**: Implemented code splitting and lazy loading
- **Error States**: Better error handling with retry mechanisms
- **Loading States**: Replaced spinners with skeleton loaders
- **Code Organization**: Extracted reusable hooks and components
- **Documentation**: Enhanced README with detailed features and usage guide

#### Technical
- Added Vitest for unit testing
- Added Testing Library for component testing
- Configured TypeScript (tsconfig.json)
- Created reusable UI components (SkeletonLoader, ErrorDisplay, StockSearch)
- Implemented Suspense boundaries for lazy-loaded components
- Added test scripts to package.json

### 🐛 Bug Fixes
- Fixed duplicate API calls in Dashboard component
- Improved request cancellation handling
- Enhanced watchlist synchronization across components

### 📝 Documentation
- Comprehensive README update with all new features
- Added keyboard shortcuts documentation
- Added project structure overview
- Added usage tips and troubleshooting guide
- Created CHANGELOG.md

---

## [1.0.0] - Initial Release

### Features
- Real-time stock data fetching
- Interactive charts with Chart.js
- Stock comparison mode
- Watchlist functionality
- Dark/Light mode toggle
- Multiple time ranges (1d, 7d, 1m, 4m, 1y)
- Responsive design
- Express backend with yahoo-finance2
- Deployed on Vercel + Render
