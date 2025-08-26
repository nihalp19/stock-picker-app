// add types because we are working with the external api 

export interface Stock {
  symbol: string;
  name: string;
  currentPrice?: number;
  change?: number;
  volume?: number;
  marketCap?: number;
  openPrice?: number;
  highPrice?: number;
  lowPrice?: number;
  previousClose?: number;
  week52High?: number;
  week52Low?: number;
}

export interface StockPrice {
  time: string;
  price: number;
}

export interface TickerItem {
  symbol: string;
  price: number;
  change: number;
}