import { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';
import { LineChart, CandlestickChart, TrendingUp, Download } from 'lucide-react';

// Register the zoom plugin
Chart.register(zoomPlugin);

function ChartDisplay({ dashData, compareData, darkMode, range }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const rsiChartRef = useRef(null);
  const rsiChartInstance = useRef(null);
  const [showMA, setShowMA] = useState({ ma20: false, ma50: false });
  const [showIndicators, setShowIndicators] = useState({ rsi: false, macd: false, bb: false });

  // Calculate Moving Average
  const calculateMA = (data, period) => {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        result.push(null);
      } else {
        const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0);
        result.push(sum / period);
      }
    }
    return result;
  };

  // Calculate RSI (Relative Strength Index)
  const calculateRSI = (data, period = 14) => {
    const rsi = [];
    const gains = [];
    const losses = [];

    for (let i = 1; i < data.length; i++) {
      const change = data[i] - data[i - 1];
      gains.push(change > 0 ? change : 0);
      losses.push(change < 0 ? -change : 0);
    }

    for (let i = 0; i < gains.length; i++) {
      if (i < period - 1) {
        rsi.push(null);
      } else {
        const avgGain = gains.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        const avgLoss = losses.slice(i - period + 1, i + 1).reduce((a, b) => a + b, 0) / period;
        const rs = avgLoss === 0 ? 100 : avgGain / avgLoss;
        rsi.push(100 - (100 / (1 + rs)));
      }
    }
    return [null, ...rsi]; // Add null at start to align with price data
  };

  // Calculate MACD (reserved for future use)
  // const calculateMACD = (data) => {
  //   const ema12 = calculateEMA(data, 12);
  //   const ema26 = calculateEMA(data, 26);
  //   const macdLine = ema12.map((val, i) => val !== null && ema26[i] !== null ? val - ema26[i] : null);
  //   const signalLine = calculateEMA(macdLine.filter(v => v !== null), 9);
  //   
  //   // Pad signal line to match length
  //   const paddedSignal = new Array(macdLine.length - signalLine.length).fill(null).concat(signalLine);
  //   const histogram = macdLine.map((val, i) => val !== null && paddedSignal[i] !== null ? val - paddedSignal[i] : null);
  //   
  //   return { macdLine, signalLine: paddedSignal, histogram };
  // };

  // Calculate EMA (Exponential Moving Average)
  const calculateEMA = (data, period) => {
    const k = 2 / (period + 1);
    const ema = [];
    let emaPrev = null;

    for (let i = 0; i < data.length; i++) {
      if (data[i] === null) {
        ema.push(null);
        continue;
      }
      if (emaPrev === null) {
        // Use SMA for first value
        if (i >= period - 1) {
          const sum = data.slice(i - period + 1, i + 1).reduce((a, b) => a + (b || 0), 0);
          emaPrev = sum / period;
          ema.push(emaPrev);
        } else {
          ema.push(null);
        }
      } else {
        emaPrev = data[i] * k + emaPrev * (1 - k);
        ema.push(emaPrev);
      }
    }
    return ema;
  };

  // Calculate Bollinger Bands
  const calculateBollingerBands = (data, period = 20, stdDev = 2) => {
    const sma = calculateMA(data, period);
    const upper = [];
    const lower = [];

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1 || sma[i] === null) {
        upper.push(null);
        lower.push(null);
      } else {
        const slice = data.slice(i - period + 1, i + 1);
        const mean = sma[i];
        const variance = slice.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / period;
        const std = Math.sqrt(variance);
        upper.push(mean + stdDev * std);
        lower.push(mean - stdDev * std);
      }
    }
    return { upper, middle: sma, lower };
  };

  // Export chart as image
  const exportChart = () => {
    if (chartInstance.current) {
      const url = chartInstance.current.toBase64Image();
      const link = document.createElement('a');
      link.download = `${dashData.symbol}_chart_${new Date().toISOString().split('T')[0]}.png`;
      link.href = url;
      link.click();
    }
  };

  useEffect(() => {
    if (!dashData?.trend) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const closePrices = dashData.trend.map((t) => t.close);
    
    const datasets = [
      {
        label: dashData.symbol,
        data: closePrices,
        borderColor: darkMode ? '#2196f3' : '#1976d2',
        backgroundColor: () => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, darkMode ? 'rgba(33, 150, 243, 0.3)' : 'rgba(33, 150, 243, 0.15)');
          gradient.addColorStop(1, darkMode ? 'rgba(33, 150, 243, 0)' : 'rgba(33, 150, 243, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: darkMode ? '#2196f3' : '#1976d2',
        borderWidth: 3,
        order: 1,
      }
    ];

    // Add Bollinger Bands
    if (showIndicators.bb) {
      const bb = calculateBollingerBands(closePrices, 20, 2);
      datasets.push({
        label: 'BB Upper',
        data: bb.upper,
        borderColor: '#a855f7',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
        borderDash: [3, 3],
        yAxisID: 'y',
      });
      datasets.push({
        label: 'BB Middle',
        data: bb.middle,
        borderColor: '#a855f7',
        borderWidth: 1,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
        yAxisID: 'y',
      });
      datasets.push({
        label: 'BB Lower',
        data: bb.lower,
        borderColor: '#a855f7',
        borderWidth: 1,
        pointRadius: 0,
        fill: '+1',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        borderDash: [3, 3],
        yAxisID: 'y',
      });
    }

    // Add Moving Averages
    if (showMA.ma20) {
      datasets.push({
        label: 'MA(20)',
        data: calculateMA(closePrices, 20),
        borderColor: '#f59e0b',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
        yAxisID: 'y',
      });
    }

    if (showMA.ma50) {
      datasets.push({
        label: 'MA(50)',
        data: calculateMA(closePrices, 50),
        borderColor: '#10b981',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        tension: 0.4,
        borderDash: [5, 5],
        yAxisID: 'y',
      });
    }

    if (compareData?.trend) {
      datasets.push({
        label: compareData.symbol,
        data: compareData.trend.map((t) => t.close),
        borderColor: darkMode ? '#60A5FA' : '#3B82F6',
        backgroundColor: () => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, darkMode ? 'rgba(96, 165, 250, 0.2)' : 'rgba(59, 130, 246, 0.1)');
          gradient.addColorStop(1, darkMode ? 'rgba(96, 165, 250, 0)' : 'rgba(59, 130, 246, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      });
    }

    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dashData.trend.map((t) => {
          const date = new Date(t.date);
          const isMobile = window.innerWidth < 640; // sm breakpoint
          if (isMobile) {
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          }
          return `${date.getFullYear().toString().slice(-2)}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }),
        datasets: datasets,
      },
      options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
            display: true,
            position: 'top',
        labels: {
              color: darkMode ? '#E5E7EB' : '#1F2937',
              font: {
                size: 12,
              },
            },
      },
      tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: darkMode ? '#E5E7EB' : '#1F2937',
            bodyColor: darkMode ? '#E5E7EB' : '#1F2937',
            borderColor: darkMode ? '#4B5563' : '#E5E7EB',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function (context) {
                return `${context.dataset.label}: $${context.parsed.y.toFixed(2)}`;
              },
            },
          },
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl',
            },
            zoom: {
              wheel: {
                enabled: true,
                modifierKey: 'ctrl',
              },
              pinch: {
                enabled: true,
          },
              mode: 'x',
            },
          },
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: darkMode ? '#9CA3AF' : '#6B7280',
              maxRotation: 0,
              maxTicksLimit: 6,
            },
          },
          y: {
            grid: {
              color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.2)',
          },
            ticks: {
              color: darkMode ? '#9CA3AF' : '#6B7280',
              callback: function (value) {
                return '$' + value;
            },
            },
          },
          },
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: false,
          },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [dashData, compareData, darkMode, range, showMA, showIndicators, calculateBollingerBands, calculateMA]);

  // RSI Chart Effect
  useEffect(() => {
    if (!showIndicators.rsi || !dashData?.trend) {
      if (rsiChartInstance.current) {
        rsiChartInstance.current.destroy();
        rsiChartInstance.current = null;
      }
      return;
    }

    const ctx = rsiChartRef.current.getContext('2d');
    
    if (rsiChartInstance.current) {
      rsiChartInstance.current.destroy();
    }

    const closePrices = dashData.trend.map((t) => t.close);
    const rsiData = calculateRSI(closePrices, 14);

    rsiChartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dashData.trend.map((t) => {
          const date = new Date(t.date);
          const isMobile = window.innerWidth < 640;
          if (isMobile) {
            return `${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
          }
          return `${date.getFullYear().toString().slice(-2)}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
        }),
        datasets: [{
          label: 'RSI',
          data: rsiData,
          borderColor: '#2196f3',
          backgroundColor: 'rgba(33, 150, 243, 0.1)',
          fill: true,
          tension: 0.4,
          pointRadius: 0,
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: darkMode ? '#E5E7EB' : '#1F2937',
            bodyColor: darkMode ? '#E5E7EB' : '#1F2937',
            borderColor: darkMode ? '#4B5563' : '#E5E7EB',
            borderWidth: 1,
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            min: 0,
            max: 100,
            grid: {
              color: darkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(229, 231, 235, 0.2)',
            },
            ticks: {
              color: darkMode ? '#9CA3AF' : '#6B7280',
            },
          },
        },
      },
      plugins: [{
        id: 'rsiLevels',
        beforeDraw: (chart) => {
          const ctx = chart.ctx;
          const yAxis = chart.scales.y;
          const xAxis = chart.scales.x;
          
          // Draw overbought line (70)
          ctx.save();
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 1;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(xAxis.left, yAxis.getPixelForValue(70));
          ctx.lineTo(xAxis.right, yAxis.getPixelForValue(70));
          ctx.stroke();
          
          // Draw oversold line (30)
          ctx.strokeStyle = '#10b981';
          ctx.beginPath();
          ctx.moveTo(xAxis.left, yAxis.getPixelForValue(30));
          ctx.lineTo(xAxis.right, yAxis.getPixelForValue(30));
          ctx.stroke();
          ctx.restore();
        },
      }],
    });

    return () => {
      if (rsiChartInstance.current) {
        rsiChartInstance.current.destroy();
      }
    };
  }, [dashData, darkMode, showIndicators.rsi]);

  return (
    <div className={`w-full mt-4 sm:mt-6 p-3 sm:p-6 rounded-2xl border shadow-xl ${
      darkMode 
        ? 'bg-primary-800/40 backdrop-blur-xl border-primary-700/50' 
        : 'bg-white/90 backdrop-blur-xl border-primary-200'
    }`}>
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h3 className={`text-base sm:text-lg font-bold ${
            darkMode ? 'text-white' : 'text-primary-900'
          }`}>
            Price Chart
          </h3>
          <button
            onClick={exportChart}
            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium smooth-transition border flex items-center gap-2 ${
              darkMode
                ? 'bg-primary-700/50 border-primary-600 text-primary-200 hover:bg-primary-600/50'
                : 'bg-white border-primary-300 text-primary-800 hover:bg-primary-50'
            }`}
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowMA({ ...showMA, ma20: !showMA.ma20 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium smooth-transition border ${
              showMA.ma20
                ? darkMode
                  ? 'bg-warning/20 border-warning text-warning'
                  : 'bg-warning/10 border-warning/50 text-warning'
                : darkMode
                ? 'bg-primary-700/30 border-primary-600 text-primary-300 hover:bg-primary-600/50'
                : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
            }`}
          >
            MA(20)
          </button>
          <button
            onClick={() => setShowMA({ ...showMA, ma50: !showMA.ma50 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium smooth-transition border ${
              showMA.ma50
                ? darkMode
                  ? 'bg-success/20 border-success text-success'
                  : 'bg-success/10 border-success/50 text-success'
                : darkMode
                ? 'bg-primary-700/30 border-primary-600 text-primary-300 hover:bg-primary-600/50'
                : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
            }`}
          >
            MA(50)
          </button>
          <button
            onClick={() => setShowIndicators({ ...showIndicators, bb: !showIndicators.bb })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium smooth-transition border ${
              showIndicators.bb
                ? darkMode
                  ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                  : 'bg-purple-500/10 border-purple-500/50 text-purple-600'
                : darkMode
                ? 'bg-primary-700/30 border-primary-600 text-primary-300 hover:bg-primary-600/50'
                : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
            }`}
          >
            Bollinger Bands
          </button>
          <button
            onClick={() => setShowIndicators({ ...showIndicators, rsi: !showIndicators.rsi })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium smooth-transition border ${
              showIndicators.rsi
                ? darkMode
                  ? 'bg-accent-500/20 border-accent-500 text-accent-400'
                  : 'bg-accent-500/10 border-accent-500/50 text-accent-600'
                : darkMode
                ? 'bg-primary-700/30 border-primary-600 text-primary-300 hover:bg-primary-600/50'
                : 'bg-white border-primary-300 text-primary-700 hover:bg-primary-50'
            }`}
          >
            RSI
          </button>
          <div className={`px-3 py-1.5 text-xs ${
            darkMode ? 'text-primary-400' : 'text-primary-600'
          }`}>
            💡 Ctrl+Scroll to zoom
          </div>
        </div>
      </div>
      <div className="relative" style={{ height: 'clamp(250px, 50vh, 400px)' }}>
        <canvas ref={chartRef} />
      </div>

      {/* RSI Chart */}
      {showIndicators.rsi && dashData?.trend && (
        <div className="mt-4">
          <h4 className={`text-sm font-bold mb-2 ${
            darkMode ? 'text-white' : 'text-primary-900'
          }`}>
            RSI (14)
          </h4>
          <div className="relative" style={{ height: '150px' }}>
            <canvas ref={rsiChartRef} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartDisplay;
