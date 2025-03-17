import express from 'express';
import yahooFinance from 'yahoo-finance2';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: '*' })); // Allow all for testing, refine later

app.get('/api/stock/:symbol', async (req, res) => {
  const { symbol } = req.params;
  const { range = '7d' } = req.query;

  try {
    const quote = await yahooFinance.quote(symbol);
    let trendData;

    if (range === '1d') {
      trendData = [{
        date: new Date().toISOString().split('T')[0],
        open: quote.regularMarketOpen,
        high: quote.regularMarketDayHigh,
        low: quote.regularMarketDayLow,
        close: quote.regularMarketPrice,
        volume: quote.regularMarketVolume,
      }];
    } else {
      const today = new Date();
      const startDate = new Date(today);
      switch (range) {
        case '7d':
          startDate.setDate(today.getDate() - 7);
          break;
        case '1m':
          startDate.setMonth(today.getMonth() - 1);
          break;
        case '4m':
          startDate.setMonth(today.getMonth() - 4);
          break;
        case '1y':
          startDate.setFullYear(today.getFullYear() - 1);
          break;
        default:
          startDate.setDate(today.getDate() - 7);
      }

      const chart = await yahooFinance.chart(symbol, {
        period1: startDate.toISOString().split('T')[0],
        period2: today.toISOString().split('T')[0],
        interval: '1d',
      });

      trendData = chart.quotes.map((q) => ({
        date: new Date(q.date).toISOString().split('T')[0],
        open: q.open,
        high: q.high,
        low: q.low,
        close: q.close,
        volume: q.volume,
      }));
    }

    res.json({
      symbol: quote.symbol,
      date: new Date().toISOString().split('T')[0],
      '1. open': quote.regularMarketOpen,
      '2. high': quote.regularMarketDayHigh,
      '3. low': quote.regularMarketDayLow,
      '4. close': quote.regularMarketPrice,
      '5. volume': quote.regularMarketVolume,
      trend: trendData,
    });
  } catch (error) {
    console.error('Error fetching data:', error.message);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});