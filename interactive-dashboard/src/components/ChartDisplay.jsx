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
        labels: { font: { size: 14, weight: 'bold' }, color: darkMode ? '#D1D5DB' : '#fff' },
      },
      title: {
        display: true,
        text: `${dashData.symbol} - ${rangeLabels[range]}`,
        font: { size: 20, weight: 'bold' },
        color: darkMode ? '#D1D5DB' : '#fff',
        padding: { top: 10, bottom: 20 },
      },
      tooltip: { backgroundColor: darkMode ? '#374151' : '#1F2937', titleFont: { size: 14 }, bodyFont: { size: 12 } },
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: darkMode ? 'rgba(209, 213, 219, 0.1)' : 'rgba(255, 255, 255, 0.1)' },
        ticks: { color: darkMode ? '#D1D5DB' : '#fff', font: { size: 12 } },
        title: { display: true, text: 'Price ($)', color: darkMode ? '#D1D5DB' : '#fff' },
      },
      yVolume: {
        beginAtZero: true,
        position: 'right',
        grid: { display: false },
        ticks: { color: darkMode ? '#D1D5DB' : '#fff', font: { size: 12 } },
        title: { display: true, text: 'Volume', color: darkMode ? '#D1D5DB' : '#fff' },
      },
      x: {
        grid: { display: false },
        ticks: { color: darkMode ? '#D1D5DB' : '#fff', font: { size: 12 } },
      },
    },
  };

  let ChartComponent, chartData, chartOptions;

  switch (range) {
    case '1d': // Bar Chart for Today with OHLC and Volume
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
              darkMode ? '#34D399' : '#10B981', // Green for Open
              darkMode ? '#60A5FA' : '#A78BFA', // Blue for High
              darkMode ? '#F87171' : '#EF4444', // Red for Low
              darkMode ? '#D1D5DB' : '#fff',    // Gray/White for Close
            ],
            borderColor: darkMode ? '#2563EB' : '#7C3AED',
            borderWidth: 1,
            barPercentage: 0.5, // Thinner bars
            yAxisID: 'y',
          },
          {
            label: 'Volume',
            data: [dashData.trend[0].volume, null, null, null], // Volume only for "Open" slot
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
          x: { ticks: { font: { size: 14 } } },
        },
      };
      break;

    case '7d': // Line Chart for 7 Days with Volume
    case '1m': // Line Chart for 1 Month with Volume
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
            pointHoverRadius: 8,
            pointRadius: 5,
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

    case '4m': // Area Chart for 4 Months with Volume
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

    case '1y': // Line Chart for 1 Year with Volume
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
            pointHoverRadius: 8,
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
      className={`mt-8 ${
        darkMode ? 'bg-gray-800/20' : 'bg-white/10'
      } backdrop-blur-md p-6 rounded-xl shadow-lg h-[500px] w-full max-w-4xl mx-auto`}
    >
      <ChartComponent data={chartData} options={chartOptions} />
    </div>
  );
}

export default ChartDisplay;