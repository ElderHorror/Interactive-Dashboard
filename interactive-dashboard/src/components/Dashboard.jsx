import { useEffect, useState } from "react";
import axios from "axios";
import ChartDisplay from "./ChartDisplay";

function Dashboard({ symbol, setStockData }) {
  const [loading, setLoading] = useState(false);
  const API_KEY = import.meta.env.VITE_API_KEY; // Use env var here

  useEffect(() => {
    if (symbol) {
      setLoading(true);
      axios
        .get(
          `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`
        )
        .then((response) => {
          const data = response.data["Time Series (Daily)"];
          if (data) {
            const latestDate = Object.keys(data)[0];
            setStockData({
              symbol: response.data["Meta Data"]["2. Symbol"],
              date: latestDate,
              ...data[latestDate],
            });
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setLoading(false);
          setStockData(null);
        });
    }
  }, [symbol, setStockData]);

  return (
    <div className="max-w-2xl mx-auto">
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : stockData ? (
        <>
          <div className="bg-white p-4 rounded shadow mb-4 hover:shadow-lg transition-shadow">
            <h2 className="text-xl">
              {stockData.symbol} ({stockData.date})
            </h2>
            <p>Open: ${stockData["1. open"]}</p>
            <p>High: ${stockData["2. high"]}</p>
            <p>Low: ${stockData["3. low"]}</p>
            <p>Close: ${stockData["4. close"]}</p>
            <p>Volume: {stockData["5. volume"]}</p>
          </div>
          <ChartDisplay stockData={stockData} />
        </>
      ) : (
        <p className="text-center">Enter a stock symbol to see the data!</p>
      )}
    </div>
  );
}

export default Dashboard;
