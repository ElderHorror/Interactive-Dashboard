import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ChartDisplay({ dashData, darkMode, range }) {
  const rangeLabels = {
    '1d': 'Today',
    '7d': '7 Day Trend',
    '1m': '1 Month Trend',
    '4m': '4 Month Trend',
    '1y': '1 Year Trend',
  };

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: { font: { size: 12, weight: 'bold' }, color: darkMode ? '#D1D5DB' : '#fff' },
      },
      title: {
        display: true,
        text: `${dashData.symbol} - ${rangeLabels[range]}`,
        font: { size: 16, weight: 'bold' }, // Smaller on mobile
        color: darkMode ? '#D1D5DB' : '#fff',
        padding: { top: 10, bottom: 20 },
      },
      tooltip: { backgroundColor: darkMode ? '#374151' : '#1F2937', titleFont: { size: 12 }, bodyFont: { size: 10 } },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: darkMode ? 'rgba(209, 213, 219, 0.1)' : 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: darkMode ? '#D1D5DB' : '#fff', font: { size: 10 } },
        title: { display: true, text: 'Price ($)', color: darkMode ? '#D1D5DB' : '#fff', font: { size: 12 } },
      },
      yVolume: {
        beginAtZero: true,
        position: 'right',
        grid: { display: false },
        ticks: { color: darkMode ? '#D1D5DB' : '#fff', font: { size: 10 } },
        title: { display: true, text: 'Volume', color: darkMode ? '#D1D5DB' : '#fff', font: { size: 12 } },
      },
      x: {
        grid: { display: false },
        ticks: { color: darkMode ? '#D1D5DB' : '#fff', font: { size: 10 } },
      },
    },
  };

  let ChartComponent, chartData, chartOptions;

  switch (range) {
    case '1d':
      ChartComponent = Bar;
      chartData = {
        labels: ['Open', 'High', 'Low', 'Close'],
        datasets: [
          {
            label: 'Today’s Prices ($)',
            data: [
              dashData.trend[0].open,
              dashData.trend[0].high,
              dashData.trend[0].low,
              dashData.trend[0].close,
            ],
            backgroundColor: [
              darkMode ? '#34D399' : '#10B981',
              darkMode ? '#60A5FA' : '#A78BFA',
              darkMode ? '#F87171' : '#EF4444',
              darkMode ? '#D1D5DB' : '#fff',
            ],
            borderColor: darkMode ? '#2563EB' : '#7C3AED',
            borderWidth: 1,
            barPercentage: 0.5,
            yAxisID: 'y',
          },
          {
            label: 'Volume',
            data: [dashData.trend[0].volume, null, null, null],
            backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.5)' : 'rgba(167, 139, 250, 0.5)',
            borderColor: darkMode ? '#60A5FA' : '#A78BFA',
            borderWidth: 1,
            barPercentage: 0.5,
            yAxisID: 'yVolume',
          },
        ],
      };
      chartOptions = {
        ...baseOptions,
        scales: {
          ...baseOptions.scales,
          x: { ticks: { font: { size: 12 } } },
        },
      };
      break;

    case '7d':
    case '1m':
      ChartComponent = Line;
      chartData = {
        labels: dashData.trend.map((t) => t.date.slice(-5)),
        datasets: [
          {
            label: 'Closing Price ($)',
            data: dashData.trend.map((t) => t.close),
            borderColor: darkMode ? '#60A5FA' : '#A78BFA',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, range === '7d' ? 300 : 400);
              gradient.addColorStop(0, darkMode ? 'rgba(96, 165, 250, 0.4)' : 'rgba(167, 139, 250, 0.4)');
              gradient.addColorStop(1, darkMode ? 'rgba(96, 165, 250, 0)' : 'rgba(167, 139, 250, 0)');
              return gradient;
            },
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: darkMode ? '#60A5FA' : '#A78BFA',
            pointHoverRadius: 6,
            pointRadius: 4,
            yAxisID: 'y',
          },
          {
            label: 'Volume',
            type: 'bar',
            data: dashData.trend.map((t) => t.volume),
            backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(167, 139, 250, 0.3)',
            borderColor: darkMode ? '#60A5FA' : '#A78BFA',
            borderWidth: 1,
            barPercentage: 0.7,
            yAxisID: 'yVolume',
          },
        ],
      };
      chartOptions = baseOptions;
      break;

    case '4m':
      ChartComponent = Line;
      chartData = {
        labels: dashData.trend.map((t) => t.date.slice(-5)),
        datasets: [
          {
            label: 'Closing Price ($)',
            data: dashData.trend.map((t) => t.close),
            borderColor: darkMode ? '#60A5FA' : '#A78BFA',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 450);
              gradient.addColorStop(0, darkMode ? 'rgba(96, 165, 250, 0.6)' : 'rgba(167, 139, 250, 0.6)');
              gradient.addColorStop(1, darkMode ? 'rgba(96, 165, 250, 0)' : 'rgba(167, 139, 250, 0)');
              return gradient;
            },
            fill: true,
            tension: 0.3,
            yAxisID: 'y',
          },
          {
            label: 'Volume',
            type: 'bar',
            data: dashData.trend.map((t) => t.volume),
            backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(167, 139, 250, 0.3)',
            borderColor: darkMode ? '#60A5FA' : '#A78BFA',
            borderWidth: 1,
            barPercentage: 0.7,
            yAxisID: 'yVolume',
          },
        ],
      };
      chartOptions = baseOptions;
      break;

    case '1y':
      ChartComponent = Line;
      chartData = {
        labels: dashData.trend.map((t) => t.date.slice(-5)),
        datasets: [
          {
            label: 'Closing Price ($)',
            data: dashData.trend.map((t) => t.close),
            borderColor: darkMode ? '#60A5FA' : '#A78BFA',
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 500);
              gradient.addColorStop(0, darkMode ? 'rgba(96, 165, 250, 0.4)' : 'rgba(167, 139, 250, 0.4)');
              gradient.addColorStop(1, darkMode ? 'rgba(96, 165, 250, 0)' : 'rgba(167, 139, 250, 0)');
              return gradient;
            },
            fill: true,
            tension: 0.4,
            pointBackgroundColor: '#fff',
            pointBorderColor: darkMode ? '#60A5FA' : '#A78BFA',
            pointHoverRadius: 6,
            pointRadius: 3,
            yAxisID: 'y',
          },
          {
            label: 'Volume',
            type: 'bar',
            data: dashData.trend.map((t) => t.volume),
            backgroundColor: darkMode ? 'rgba(96, 165, 250, 0.3)' : 'rgba(167, 139, 250, 0.3)',
            borderColor: darkMode ? '#60A5FA' : '#A78BFA',
            borderWidth: 1,
            barPercentage: 0.7,
            yAxisID: 'yVolume',
          },
        ],
      };
      chartOptions = baseOptions;
      break;

    default:
      ChartComponent = Line;
      chartData = chartData;
      chartOptions = baseOptions;
  }

  return (
    <div
      className={`mt-6 sm:mt-8 ${
        darkMode ? 'bg-gray-800/20' : 'bg-white/10'
      } backdrop-blur-md p-4 sm:p-6 rounded-xl shadow-lg w-full h-[300px] sm:h-[400px] md:h-[500px]`}
    >
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
}

export default ChartDisplay;