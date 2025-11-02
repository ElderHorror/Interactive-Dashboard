import { useState, useEffect, useRef } from 'react';
import { Download, LineChart } from 'lucide-react';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

function ChartDisplay({ dashData, compareData, darkMode, range, onRangeChange }) {
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
    }

    const closePrices = dashData.trend.map((t) => t.close);
    
    const datasets = [
      {
        label: dashData.symbol,
        data: closePrices,
        borderColor: '#00C9FF',
        backgroundColor: () => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(0, 201, 255, 0.2)');
          gradient.addColorStop(1, 'rgba(0, 201, 255, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
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
            align: 'start',
        labels: {
              color: '#E0E3EB',
              font: {
                size: 12,
                family: 'Inter, sans-serif',
                weight: '500',
              },
              padding: 12,
              usePointStyle: true,
              pointStyle: 'circle',
            },
      },
      tooltip: {
            mode: 'index',
            intersect: false,
            backgroundColor: 'rgba(30, 34, 45, 0.95)',
            titleColor: '#E0E3EB',
            bodyColor: '#E0E3EB',
            borderColor: '#2A2E39',
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            titleFont: {
              size: 13,
              family: 'Inter, sans-serif',
              weight: '600',
            },
            bodyFont: {
              size: 12,
              family: 'JetBrains Mono, monospace',
            },
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
              display: true,
              color: '#2A2E39',
              drawTicks: false,
            },
            ticks: {
              color: '#9598A1',
              maxRotation: 0,
              maxTicksLimit: 8,
              padding: 8,
              font: {
                size: 11,
                family: 'JetBrains Mono, monospace',
              },
            },
            border: {
              display: false,
            },
          },
          y: {
            position: 'right',
            grid: {
              color: '#2A2E39',
              drawTicks: false,
            },
            ticks: {
              color: '#9598A1',
              padding: 8,
              font: {
                size: 11,
                family: 'JetBrains Mono, monospace',
              },
              callback: function (value) {
                return '$' + value.toFixed(2);
              },
            },
            border: {
              display: false,
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

  const timeRanges = [
    { label: '1D', value: '1d' },
    { label: '7D', value: '7d' },
    { label: '1M', value: '1m' },
    { label: '4M', value: '4m' },
    { label: '1Y', value: '1y' },
  ];

  return (
    <div className="card-elevated p-6 w-full">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <LineChart className="w-5 h-5 text-accent-primary" />
            <h3 className="text-lg font-semibold text-text-primary">
              Price Chart
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {/* Time Range Selector */}
            <div className="flex gap-1 bg-background-surface rounded-lg p-1 border border-border">
              {timeRanges.map((r) => (
                <button
                  key={r.value}
                  onClick={() => onRangeChange && onRangeChange(r.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150 ${
                    range === r.value
                      ? 'bg-accent-primary text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-background-hover'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button
              onClick={exportChart}
              className="btn-secondary flex items-center gap-2 text-sm"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowMA({ ...showMA, ma20: !showMA.ma20 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
              showMA.ma20
                ? 'bg-warning/20 border-warning text-warning'
                : 'bg-background-elevated border-border text-text-secondary hover:bg-background-hover hover:text-text-primary'
            }`}
          >
            MA(20)
          </button>
          <button
            onClick={() => setShowMA({ ...showMA, ma50: !showMA.ma50 })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
              showMA.ma50
                ? 'bg-bull/20 border-bull text-bull'
                : 'bg-background-elevated border-border text-text-secondary hover:bg-background-hover hover:text-text-primary'
            }`}
          >
            MA(50)
          </button>
          <button
            onClick={() => setShowIndicators({ ...showIndicators, bb: !showIndicators.bb })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
              showIndicators.bb
                ? 'bg-info/20 border-info text-info'
                : 'bg-background-elevated border-border text-text-secondary hover:bg-background-hover hover:text-text-primary'
            }`}
          >
            Bollinger Bands
          </button>
          <button
            onClick={() => setShowIndicators({ ...showIndicators, rsi: !showIndicators.rsi })}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border ${
              showIndicators.rsi
                ? 'bg-accent-primary/20 border-accent-primary text-accent-primary'
                : 'bg-background-elevated border-border text-text-secondary hover:bg-background-hover hover:text-text-primary'
            }`}
          >
            RSI
          </button>
          <div className="px-3 py-1.5 text-xs text-text-tertiary flex items-center gap-1">
            <span>💡</span>
            <span className="hidden sm:inline">Ctrl+Scroll to zoom</span>
          </div>
        </div>
      </div>
      
      {/* Main Chart */}
      <div className="relative bg-background-surface rounded-lg p-4 border border-border" style={{ height: 'clamp(300px, 50vh, 500px)' }}>
        <canvas ref={chartRef} />
      </div>

      {/* RSI Chart */}
      {showIndicators.rsi && dashData?.trend && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-sm font-semibold text-text-primary">
              RSI (14)
            </h4>
            <span className="text-xs text-text-tertiary">Relative Strength Index</span>
          </div>
          <div className="relative bg-background-surface rounded-lg p-4 border border-border" style={{ height: '150px' }}>
            <canvas ref={rsiChartRef} />
          </div>
        </div>
      )}
    </div>
  );
}

export default ChartDisplay;
