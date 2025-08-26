export interface Stock {
  type: string;        
  symbol: string | null; 
  company: string;       
}


export interface StockPrice {
  open: number;
  high: number;
  low: number;
  close: number;
  date: string;       // timestamp as string, e.g., "2025-08-26 10:22:00+05:30"
  volume: number;
  value: number;      // total traded value
  change: number;     // price change
  percent: number;    // % change
  prev_close: number; // previous closing price
}


export interface SearchResult {
    stocks: Stock[];
}

// Represents a single stock/mover from the API
export interface TickerData {
  id: number;
  company_id: number;
  symbol: string;
  comp_name: string;
  close: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  percent: number;
  date: string;
  scripcode: number;
  prev_close: number;
  mcap: number;
  pe: number;
  roe_ttm: number;
  roce_ttm: number;
  [key: string]: any; // for any additional unknown fields
}

// Represents the API response for Nifty movers
export interface NiftyMoversResponse {
  name: string;
  index_name: string;
  total_count: number;
  losers_count: number;
  gainers_count: number;
  gainers: TickerData[];
  losers: TickerData[];
  volume_movers: TickerData[];
  exchange: string;
}
