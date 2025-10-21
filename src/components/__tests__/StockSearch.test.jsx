import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StockSearch from '../StockSearch';

describe('StockSearch', () => {
  it('renders input field', () => {
    render(
      <StockSearch
        value=""
        onChange={vi.fn()}
        placeholder="Enter stock symbol"
        darkMode={true}
        onClear={vi.fn()}
      />
    );

    expect(screen.getByPlaceholderText('Enter stock symbol')).toBeInTheDocument();
  });

  it('calls onChange when typing', () => {
    const handleChange = vi.fn();
    render(
      <StockSearch
        value=""
        onChange={handleChange}
        placeholder="Enter stock symbol"
        darkMode={true}
        onClear={vi.fn()}
      />
    );

    const input = screen.getByPlaceholderText('Enter stock symbol');
    fireEvent.change(input, { target: { value: 'AAPL' } });

    expect(handleChange).toHaveBeenCalledWith('AAPL');
  });

  it('shows suggestions when typing', () => {
    render(
      <StockSearch
        value="APP"
        onChange={vi.fn()}
        placeholder="Enter stock symbol"
        darkMode={true}
        onClear={vi.fn()}
      />
    );

    // Should show Apple Inc. in suggestions
    expect(screen.getByText('Apple Inc.')).toBeInTheDocument();
  });
});
