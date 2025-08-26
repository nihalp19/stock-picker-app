export interface Stock {
    symbol: string;
    name: string;
    sector?: string;
    currentPrice?: number;
    change?: number;
    changePercent?: number;
}

export interface StockPrice {
    timestamp: string;
    price: number;
    volume?: number;
}

export interface SearchResult {
    stocks: Stock[];
}

export interface TickerData {
  symbol: string;
  name?: string;
  volume?: number;
  // Additional properties that might come from the API
  [key: string]: any;
}

// Specific interface for the API response
export interface NiftyMoversResponse {
  name: string;
  index_name: string;
  total_count: number;
  losers_count: number;
  gainers_count: number;
  gainers: TickerData[];
  losers: TickerData[];
  exchange: string;
  volume_movers: TickerData[];
}