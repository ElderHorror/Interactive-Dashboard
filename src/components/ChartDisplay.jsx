import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

// Register the zoom plugin
Chart.register(zoomPlugin);

function ChartDisplay({ dashData, compareData, darkMode, range }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!dashData?.trend) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy existing chart if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const datasets = [
      {
        label: dashData.symbol,
        data: dashData.trend.map((t) => t.close),
        borderColor: darkMode ? '#A78BFA' : '#8B5CF6',
        backgroundColor: (context) => {
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, darkMode ? 'rgba(167, 139, 250, 0.2)' : 'rgba(167, 139, 250, 0.1)');
          gradient.addColorStop(1, darkMode ? 'rgba(167, 139, 250, 0)' : 'rgba(167, 139, 250, 0)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2,
      }
    ];

    if (compareData?.trend) {
      datasets.push({
        label: compareData.symbol,
        data: compareData.trend.map((t) => t.close),
        borderColor: darkMode ? '#60A5FA' : '#3B82F6',
        backgroundColor: (context) => {
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
  }, [dashData, compareData, darkMode, range]);

  return (
    <div className="mt-6 h-[400px] w-full">
      <canvas ref={chartRef} />
      <div className="mt-2 text-center text-sm text-gray-400 hidden sm:block">
        Hold Ctrl + Scroll to zoom | Hold Ctrl + Drag to pan
      </div>
    </div>
  );
}

export default ChartDisplay;
