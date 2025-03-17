import { useEffect, useState } from "react";
import axios from "axios";
import ChartDisplay from "./ChartDisplay.jsx";

function Dashboard({ symbol, darkMode, range }) {
  const [loading, setLoading] = useState(false);
  const [dashData, setDashData] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"; // Use env var or fallback

  useEffect(() => {
    const debounceFetch = setTimeout(() => {
      if (symbol) {
        setLoading(true);
        axios
          .get(`${API_URL}/api/stock/${symbol}?range=${range}`)
          .then((response) => {
            console.log("Server Response:", response.data);
            setDashData(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error("Error fetching data:", error.message);
            setLoading(false);
            setDashData(null);
          });
      }
    }, 500);

    return () => clearTimeout(debounceFetch);
  }, [symbol, range]);

  return (
    <div className="mt-8">
      {loading && (
        <div className="text-center">
          <svg
            className="animate-spin h-10 w-10 text-white mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <p className={darkMode ? "text-gray-300 mt-3" : "text-white/80 mt-3"}>
            Fetching data...
          </p>
        </div>
      )}
      {dashData ? (
        <>
          <div
            className={`${
              darkMode ? "bg-gray-800/20" : "bg-white/20"
            } backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-[0_0_15px_rgba(167,139,250,0.5)] transition-all duration-300 animate-fade-in-up`}
          >
            <h2
              className={`text-3xl font-bold ${
                darkMode ? "text-gray-100" : "text-white"
              } mb-4 flex items-center`}
            >
              {dashData.symbol}{" "}
              <span
                className={
                  darkMode
                    ? "text-sm text-gray-400 ml-2"
                    : "text-sm text-white/70 ml-2"
                }
              >
                ({dashData.date})
              </span>
              <span
                className={`ml-3 px-2 py-1 text-xs font-medium rounded-full ${
                  dashData["4. close"] > dashData["1. open"]
                    ? darkMode
                      ? "bg-green-600/30 text-green-200"
                      : "bg-green-500/30 text-green-100"
                    : darkMode
                    ? "bg-red-600/30 text-red-200"
                    : "bg-red-500/30 text-red-100"
                }`}
              >
                {dashData["4. close"] > dashData["1. open"] ? "▲" : "▼"}{" "}
                {(dashData["4. close"] - dashData["1. open"]).toFixed(2)}
              </span>
            </h2>
            <div
              className={`grid grid-cols-2 gap-4 ${
                darkMode ? "text-gray-200" : "text-white/90"
              }`}
            >
              <p>
                <span
                  className={
                    darkMode
                      ? "font-medium text-green-400"
                      : "font-medium text-green-300"
                  }
                >
                  Open:
                </span>{" "}
                ${dashData["1. open"].toFixed(2)}
              </p>
              <p>
                <span
                  className={
                    darkMode
                      ? "font-medium text-blue-400"
                      : "font-medium text-blue-300"
                  }
                >
                  High:
                </span>{" "}
                ${dashData["2. high"].toFixed(2)}
              </p>
              <p>
                <span
                  className={
                    darkMode
                      ? "font-medium text-red-400"
                      : "font-medium text-red-300"
                  }
                >
                  Low:
                </span>{" "}
                ${dashData["3. low"].toFixed(2)}
              </p>
              <p>
                <span
                  className={
                    darkMode
                      ? "font-medium text-purple-400"
                      : "font-medium text-purple-300"
                  }
                >
                  Close:
                </span>{" "}
                ${dashData["4. close"].toFixed(2)}
              </p>
              <p className="col-span-2">
                <span
                  className={
                    darkMode
                      ? "font-medium text-gray-300"
                      : "font-medium text-gray-200"
                  }
                >
                  Volume:
                </span>{" "}
                {Number(dashData["5. volume"]).toLocaleString()}
              </p>
            </div>
          </div>
          <ChartDisplay dashData={dashData} darkMode={darkMode} range={range} />
        </>
      ) : (
        <p
          className={
            darkMode
              ? "text-center text-gray-400 mt-4"
              : "text-center text-white/70 mt-4"
          }
        >
          Enter a stock symbol to see the data!
        </p>
      )}
    </div>
  );
}

export default Dashboard;
