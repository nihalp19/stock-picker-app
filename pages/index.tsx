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
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
              Stock Ticker App
            </h1>
            <p className="text-lg text-gray-600">
              Search for stocks and view real-time market data
            </p>
          </div>

          {/* Search */}
          <div className="flex justify-center mb-12">
            <SearchBar />
          </div>

          {/* Top Movers */}
          {tickerData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-3xl font-semibold mb-6 text-gray-800">Top Movers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tickerData.slice(0, 12).map((stock) => (
                  <div
                    key={stock.symbol}
                    className="border rounded-xl p-4 hover:shadow-lg transition-shadow bg-gray-50"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-lg text-gray-900">{stock.symbol}</h3>
                      <span className={`font-semibold ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stock.change >= 0 ? '↑' : '↓'} {stock.change?.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2 text-sm">{stock.comp_name}</p>
                    <div className="flex justify-between items-center text-gray-700 text-sm">
                      <span>Price: ₹{stock.close?.toFixed(2)}</span>
                      <span>Change%: {stock.percent?.toFixed(2)}%</span>
                    </div>
                    <div className="mt-2 text-gray-500 text-xs">
                      Volume: {stock.volume?.toLocaleString()}
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
