import { Stock, StockPrice, TickerData, NiftyMoversResponse } from '../types';

const API_BASE = process.env.NEXT_PUBLIC_STOCK_API;

console.log("APi",API_BASE)

export const searchStocks = async (keyword: string): Promise<Stock[]> => {
  try {
    const response = await fetch(`${API_BASE}/search?keyword=${keyword}&length=10`);
    if (!response.ok) throw new Error('Search failed');

    const data = await response.json();

    // Ensure we always return an array of Stock
    if (Array.isArray(data)) {
      return data.map((item: any) => ({
        type: item.type ?? 'stock',
        symbol: item.symbol ?? null,
        company: item.company ?? 'Unknown Company',
      }));
    }

    if (data && typeof data === 'object') {
      const arraySources = ['stocks', 'data', 'results', 'items'];
      for (const key of arraySources) {
        if (Array.isArray(data[key])) {
          return data[key].map((item: any) => ({
            type: item.type ?? 'stock',
            symbol: item.symbol ?? null,
            company: item.company ?? 'Unknown Company',
          }));
        }
      }
    }

    console.warn('Unexpected API response format:', data);
    return [];
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};



export const getStockPrices = async (
  symbol: string,
  days: number = 30,
  type: string = 'DAILY',
  limit?: number
): Promise<StockPrice[]> => {
  try {
    const url = new URL(`${API_BASE}/stock/${symbol}/prices`);
    url.searchParams.append('days', days.toString());
    url.searchParams.append('type', type);
    if (limit) url.searchParams.append('limit', limit.toString());

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Price data fetch failed');

    const data: StockPrice[] = await response.json();
    return data;
  } catch (error) {
    console.error('Price fetch error:', error);
    return [];
  }
};



export const getTickerData = async (): Promise<TickerData[]> => {
  try {
    const response = await fetch(`${API_BASE}/index/NIFTY/movers/`);
    if (!response.ok) throw new Error('Ticker data fetch failed');

    const data: NiftyMoversResponse = await response.json();

    if (data && typeof data === 'object') {
      const gainers = Array.isArray(data.gainers) ? data.gainers : [];
      const losers = Array.isArray(data.losers) ? data.losers : [];
      const volumeMovers = Array.isArray(data.volume_movers) ? data.volume_movers : [];

      // movers into a single array
      const allMovers = [...gainers, ...losers, ...volumeMovers];

      // Remove duplicates based on symbol
      const uniqueMovers = allMovers.filter(
        (mover, index, array) =>
          array.findIndex(m => m.symbol === mover.symbol) === index
      );

      return uniqueMovers;
    }

    return [];
  } catch (error) {
    console.error('Ticker fetch error:', error);
    return [];
  }
};
