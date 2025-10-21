import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useStockData } from '../useStockData';
import axios from 'axios';

vi.mock('axios');

describe('useStockData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch stock data successfully', async () => {
    const mockData = {
      symbol: 'AAPL',
      '1. open': 150,
      '2. high': 155,
      '3. low': 148,
      '4. close': 152,
      '5. volume': 1000000,
      trend: [],
    };

    axios.get.mockResolvedValue({ data: mockData });

    const { result } = renderHook(() => useStockData('AAPL', '7d', true));

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
  });

  it('should handle errors', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useStockData('INVALID', '7d', true));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.data).toBeNull();
  });

  it('should not fetch when enabled is false', () => {
    const { result } = renderHook(() => useStockData('AAPL', '7d', false));

    expect(axios.get).not.toHaveBeenCalled();
    expect(result.current.data).toBeNull();
  });
});
