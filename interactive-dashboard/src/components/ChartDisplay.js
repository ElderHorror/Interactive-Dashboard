import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ChartDisplay({ stockData }) {
  const data = {
    labels: ['Open', 'High', 'Low', 'Close'],
    datasets: [
      {
        label: 'Stock Prices ($)',
        data: [
          stockData['1. open'],
          stockData['2. high'],
          stockData['3. low'],
          stockData['4. close'],
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `${stockData.symbol} Daily Overview` },
    },
  };

  return <Bar data={data} options={options} />;
}

export default ChartDisplay;