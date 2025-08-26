import axios from 'axios';
import { Stock, StockPrice, TickerItem } from '../types';

const API_BASE = 'https://portal.tradebrains.in/api/assignment';


export const searchStocks = async (keyword: string): Promise<Stock[]> => {
  try {
    const response = await axios.get(
      `${API_BASE}/search?keyword=${encodeURIComponent(keyword)}&length=10`
    );
    
    // api return here array of object with symbol and name
    return response.data.map((item: any) => ({
      symbol: item.symbol,
      name: item.name,
    }));
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
};
