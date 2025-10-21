import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * Custom hook for fetching stock data
 * @param {string} symbol - Stock symbol to fetch
 * @param {string} range - Time range for data
 * @param {boolean} enabled - Whether to fetch data
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useStockData(symbol, range = '7d', enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const fetchData = async (controller) => {
    if (!symbol || !enabled) {
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_URL}/api/stock/${symbol}?range=${range}`,
        { signal: controller.signal }
      );
      setData(response.data);
      setError(null);
      setRetryCount(0);
    } catch (err) {
      if (err.name !== 'CanceledError') {
        console.error('Error fetching stock data:', err);
        setError({
          message: err.response?.data?.error || 'Failed to fetch stock data',
          status: err.response?.status,
          canRetry: err.response?.status !== 404,
        });
        setData(null);
      }
    } finally {
      if (err?.name !== 'CanceledError') {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller);
    return () => controller.abort();
  }, [symbol, range, enabled, retryCount]);

  const refetch = () => {
    setRetryCount((prev) => prev + 1);
  };

  return { data, loading, error, refetch };
}
