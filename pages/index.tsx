import { useState, useEffect } from 'react';
import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import TickerBar from '../components/TickerBar';
import { getTickerData } from '../utils/api';
import { TickerData } from '../types';

export default function Home() {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);

  useEffect(() => {
    const fetchTickerData = async () => {
      const data = await getTickerData();
      setTickerData(data);
    };

    fetchTickerData();
  }, []);

  return (
    <>
      <Head>
        <title>Stock Ticker App</title>
        <meta name="description" content="Real-time stock market data and analysis" />
        <meta name="keywords" content="stocks, market, investing, NSE, BSE, Nifty" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <TickerBar />
        
        <main className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Stock Ticker App
            </h1>
            <p className="text-lg text-gray-600">
              Search for stocks and view real-time market data
            </p>
          </div>

          <div className="flex justify-center mb-12">
            <SearchBar />
          </div>

          {tickerData.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Top Movers</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tickerData.slice(0, 6).map((stock) => (
                  <div key={stock.symbol} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg">{stock.symbol}</h3>
                    <p className="text-gray-600">{stock.name}</p>
                    <div className="mt-2">
                      <span className="text-xl font-semibold">₹{stock.price.toFixed(2)}</span>
                      <span className={`ml-2 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '↑' : '↓'} {Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}