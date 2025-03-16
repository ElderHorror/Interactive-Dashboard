import { useState } from 'react';
import Dashboard from './components/Dashboard';
import './index.css';

function App() {
  const [symbol, setSymbol] = useState('');
  const [stockData, setStockData] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Stock Dashboard</h1>
      <input
        type="text"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        placeholder="Enter stock symbol (e.g., AAPL)"
        className="border p-2 rounded w-full max-w-xs mx-auto block mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <Dashboard symbol={symbol} setStockData={setStockData} />
    </div>
  );
}

export default App;