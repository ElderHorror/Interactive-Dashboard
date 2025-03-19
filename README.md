StockPulse - Interactive Stock Dashboard

StockPulse is a personal interactive web app for tracking stock market data. Built with React and Vite, it fetches stock info via a Node.js proxy and displays it with Chart.js-powered visualizations. Check it live: [https://interactive-dashboard-ivory.vercel.app/](https://interactive-dashboard-ivory.vercel.app/).
Features

    Real-Time Stock Data: View open, high, low, close, and volume for any stock symbol (e.g., AAPL).
    Dynamic Charts:
        Today (1d): Bar chart (Open: green, High: blue, Low: red, Close: gray, Volume: orange).
        7 Days / 1 Month: Line chart with orange volume subplot.
        4 Months: Area chart with volume bars.
        1 Year: Detailed line chart with volume.
    Responsive: Works on mobile and desktop.
    Dark/Light Mode: Toggleable themes.
    Branding: Custom favicon and “StockPulse” title.

Tech Stack

    Frontend: React, Vite, Tailwind CSS, Chart.js
    Backend: Node.js, Express, yahoo-finance2
    Deployment: Vercel (frontend), Render (backend)

Installation (Local Use)
Prerequisites

    Node.js (v16+)
    Git

Clone the Repository

    bash
    git clone https://github.com/ElderHorror/Interactive-Dashboard.git

Install Dependencies

    bash
    npm install

Run Locally

Frontend:

    bash
    npm run dev
        Runs at http://localhost:5173.

Backend:

    bash
    npm run server
        Runs at http://localhost:3001.


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
        Start: npm start.
        Env: ALLOWED_ORIGIN=<your-vercel-url> (e.g., your Vercel frontend URL).
    Deploy to get your backend URL.

Note: Keep your Render URL private to prevent unauthorized access.

Usage

    Open http://localhost:5173 (or your deployed URL).
    Enter a stock symbol (e.g., TSLA).
    Select a range (Today, 7 Days, etc.).
    Toggle dark/light mode.

Troubleshooting

    Loading Stuck:
        Check CORS: ALLOWED_ORIGIN must match your frontend URL.
        Verify VITE_API_URL points to your backend.
    Backend Issues:
        Test <your-render-url>/api/stock/AAPL—expect JSON.

About Me

I’m Adedeji, a web developer seeking job opportunities or freelance contracts. Built this to flex my React and API skills. Hit me up on X: @AdedejiAde50479!

Note: This is a personal project. The backend URL is not shared publicly to avoid misuse. To use this app, deploy your own instance.