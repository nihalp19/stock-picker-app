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

export const fetchStockDetails = async (symbol: string): Promise<Stock | null> => {
  try {
    const pricesResponse = await axios.get(
      `${API_BASE}/stock/${symbol}/prices?days=1&type=INTRADAY&limit=1`
    );
    
    if (!pricesResponse.data || pricesResponse.data.length === 0) {
      return null;
    }
    
    const priceData = pricesResponse.data[0];
    
    const searchResponse = await axios.get(
      `${API_BASE}/search?keyword=${encodeURIComponent(symbol)}&length=1`
    );
    
    let name = symbol;
    if (searchResponse.data && searchResponse.data.length > 0) {
      name = searchResponse.data[0].name;
    }
    
    return {
      symbol,
      name,
      currentPrice: priceData.close || priceData.price,
      change: priceData.change || 0,
      volume: priceData.volume || 0,
      openPrice: priceData.open || 0,
      highPrice: priceData.high || 0,
      lowPrice: priceData.low || 0,
    };
  } catch (error) {
    console.error('Error fetching stock details:', error);
    return null;
  }
};

