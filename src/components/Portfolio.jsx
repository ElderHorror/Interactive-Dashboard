import { useState, useEffect } from 'react';
import { Briefcase, Plus, TrendingUp, TrendingDown, DollarSign, PieChart, X } from 'lucide-react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

function Portfolio({ darkMode, onSelectStock }) {
  const [holdings, setHoldings] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHolding, setNewHolding] = useState({ symbol: '', shares: '', avgPrice: '' });

  useEffect(() => {
    const saved = localStorage.getItem('portfolio');
    if (saved) {
      setHoldings(JSON.parse(saved));
    }
  }, []);

  const savePortfolio = (updatedHoldings) => {
    localStorage.setItem('portfolio', JSON.stringify(updatedHoldings));
    setHoldings(updatedHoldings);
  };

  const addHolding = () => {
    if (!newHolding.symbol || !newHolding.shares || !newHolding.avgPrice) return;

    const holding = {
      symbol: newHolding.symbol.toUpperCase(),
      shares: parseFloat(newHolding.shares),
      avgPrice: parseFloat(newHolding.avgPrice),
      currentPrice: parseFloat(newHolding.avgPrice), // Will be updated with real data
      addedDate: new Date().toISOString(),
    };

    const existingIndex = holdings.findIndex(h => h.symbol === holding.symbol);
    let updated;

    if (existingIndex >= 0) {
      const existing = holdings[existingIndex];
      const totalShares = existing.shares + holding.shares;
      const newAvgPrice = ((existing.shares * existing.avgPrice) + (holding.shares * holding.avgPrice)) / totalShares;
      
      updated = [...holdings];
      updated[existingIndex] = { ...existing, shares: totalShares, avgPrice: newAvgPrice };
    } else {
      updated = [...holdings, holding];
    }

    savePortfolio(updated);
    setNewHolding({ symbol: '', shares: '', avgPrice: '' });
    setShowAddModal(false);
  };

  const removeHolding = (symbol) => {
    savePortfolio(holdings.filter(h => h.symbol !== symbol));
  };

  const calculateTotals = () => {
    const totalValue = holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
    const totalCost = holdings.reduce((sum, h) => sum + (h.shares * h.avgPrice), 0);
    const totalPL = totalValue - totalCost;
    const totalPLPercent = totalCost > 0 ? (totalPL / totalCost) * 100 : 0;

    return { totalValue, totalCost, totalPL, totalPLPercent };
  };

  const { totalValue, totalCost, totalPL, totalPLPercent } = calculateTotals();

  const pieData = {
    labels: holdings.map(h => h.symbol),
    datasets: [{
      data: holdings.map(h => h.shares * h.currentPrice),
      backgroundColor: [
        '#2196f3', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
        '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
      ],
      borderWidth: 2,
      borderColor: darkMode ? '#1f2937' : '#ffffff',
    }],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: darkMode ? '#e5e7eb' : '#1f2937',
          padding: 15,
          font: { size: 11 },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${context.label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  return (
    <div className={`w-full p-4 sm:p-6 rounded-2xl border shadow-xl ${
      darkMode ? 'bg-primary-800/40 backdrop-blur-xl border-primary-700/50' : 'bg-white/90 backdrop-blur-xl border-primary-200'
    }`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Briefcase className={`w-6 h-6 ${darkMode ? 'text-accent-400' : 'text-accent-600'}`} />
          <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
            Portfolio
          </h2>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Stock</span>
        </button>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-primary-700/30 border-primary-600' : 'bg-white border-primary-200'}`}>
          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>Total Value</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
            ${totalValue.toFixed(2)}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${darkMode ? 'bg-primary-700/30 border-primary-600' : 'bg-white border-primary-200'}`}>
          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>Total Cost</p>
          <p className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
            ${totalCost.toFixed(2)}
          </p>
        </div>
        <div className={`p-4 rounded-xl border ${
          totalPL >= 0 
            ? 'bg-success/10 border-success/30' 
            : 'bg-error/10 border-error/30'
        }`}>
          <p className={`text-xs font-medium mb-1 ${totalPL >= 0 ? 'text-success' : 'text-error'}`}>
            Total P/L
          </p>
          <div className="flex items-center gap-2">
            {totalPL >= 0 ? <TrendingUp className="w-5 h-5 text-success" /> : <TrendingDown className="w-5 h-5 text-error" />}
            <p className={`text-2xl font-bold ${totalPL >= 0 ? 'text-success' : 'text-error'}`}>
              ${Math.abs(totalPL).toFixed(2)}
            </p>
            <span className={`text-sm ${totalPL >= 0 ? 'text-success/70' : 'text-error/70'}`}>
              ({totalPLPercent >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>

      {holdings.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Holdings List */}
          <div className="space-y-3">
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-primary-900'}`}>Holdings</h3>
            {holdings.map((holding, index) => {
              const pl = (holding.currentPrice - holding.avgPrice) * holding.shares;
              const plPercent = ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;

              return (
                <div
                  key={index}
                  className={`p-4 rounded-xl border smooth-transition cursor-pointer ${
                    darkMode ? 'bg-primary-700/30 border-primary-600 hover:bg-primary-600/50' : 'bg-white border-primary-200 hover:bg-accent-50'
                  }`}
                  onClick={() => onSelectStock(holding.symbol)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>{holding.symbol}</h4>
                      <p className={`text-sm ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
                        {holding.shares} shares @ ${holding.avgPrice.toFixed(2)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeHolding(holding.symbol); }}
                      className={`p-1 rounded hover:bg-error/20 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className={`text-xs ${darkMode ? 'text-primary-500' : 'text-primary-500'}`}>Current Value</p>
                      <p className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>
                        ${(holding.shares * holding.currentPrice).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-bold ${pl >= 0 ? 'text-success' : 'text-error'}`}>
                        {pl >= 0 ? '+' : ''}${pl.toFixed(2)}
                      </p>
                      <p className={`text-xs ${pl >= 0 ? 'text-success/70' : 'text-error/70'}`}>
                        {plPercent >= 0 ? '+' : ''}{plPercent.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pie Chart */}
          <div>
            <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-white' : 'text-primary-900'}`}>Allocation</h3>
            <div className="h-64 sm:h-80">
              <Pie data={pieData} options={pieOptions} />
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <PieChart className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-primary-600' : 'text-primary-300'}`} />
          <p className={`text-lg font-medium ${darkMode ? 'text-primary-400' : 'text-primary-600'}`}>
            No holdings yet
          </p>
          <p className={`text-sm mt-2 ${darkMode ? 'text-primary-500' : 'text-primary-500'}`}>
            Click "Add Stock" to start tracking your portfolio
          </p>
        </div>
      )}

      {/* Add Stock Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border p-6 ${
            darkMode ? 'bg-primary-800/95 border-primary-700' : 'bg-white/95 border-primary-200'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-primary-900'}`}>Add to Portfolio</h3>
              <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-primary-700' : 'hover:bg-primary-100'}`}>
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-primary-300' : 'text-primary-700'}`}>
                  Stock Symbol
                </label>
                <input
                  type="text"
                  value={newHolding.symbol}
                  onChange={(e) => setNewHolding({ ...newHolding, symbol: e.target.value.toUpperCase() })}
                  placeholder="AAPL"
                  className="input-modern"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-primary-300' : 'text-primary-700'}`}>
                  Number of Shares
                </label>
                <input
                  type="number"
                  value={newHolding.shares}
                  onChange={(e) => setNewHolding({ ...newHolding, shares: e.target.value })}
                  placeholder="10"
                  className="input-modern"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-primary-300' : 'text-primary-700'}`}>
                  Average Price per Share
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={newHolding.avgPrice}
                  onChange={(e) => setNewHolding({ ...newHolding, avgPrice: e.target.value })}
                  placeholder="150.00"
                  className="input-modern"
                />
              </div>
              <button onClick={addHolding} className="btn-primary w-full">
                Add to Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Portfolio;
