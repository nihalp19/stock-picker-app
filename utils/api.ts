import { Stock, StockPrice, TickerData, SearchResult } from '../types';

const API_BASE = 'https://portal.tradebrains.in/api/assignment';

export const searchStocks = async (keyword: string): Promise<Stock[]> => {
  try {
    const response = await fetch(`${API_BASE}/search?keyword=${keyword}&length=10`);
    if (!response.ok) throw new Error('Search failed');
    
    const data = await response.json();
    
    // Handle different possible response formats
    if (Array.isArray(data)) {
      return data; // Direct array response
    } else if (data && typeof data === 'object') {
      // Check for common response structures
      if (Array.isArray(data.stocks)) return data.stocks;
      if (Array.isArray(data.data)) return data.data;
      if (Array.isArray(data.results)) return data.results;
      if (Array.isArray(data.items)) return data.items;
      
      // If it's an object but we can't find an array, return empty
      console.warn('Unexpected API response format:', data);
      return [];
    }
    
    return []; // Fallback for unexpected formats
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
};



