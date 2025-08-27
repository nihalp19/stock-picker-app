import { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { Heart, Share2, ArrowLeft } from 'lucide-react';
import StockGraph from '../../components/StockGraph';
import { getStockPrices, searchStocks } from '../../utils/api';
import { Stock, StockPrice } from '../../types';
import Link from 'next/link';

interface StockDetailProps {
  stock: Stock | null;
  initialPrices: StockPrice[];
  symbol: string | null;
}

const StockDetail = ({ stock, initialPrices, symbol }: StockDetailProps) => {
  const [prices, setPrices] = useState<StockPrice[]>(initialPrices);
  const [isLoading, setIsLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [timeRange, setTimeRange] = useState<'1D' | '1W' | '1M' | '3M'>('1M');

  const checkIfFavorite = useCallback(() => {
    if (typeof window !== 'undefined' && symbol) {
      const favorites: string[] = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
      setIsFavorite(favorites.includes(symbol));
    }
  }, [symbol]);

  const fetchPriceData = useCallback(async () => {
    if (!symbol) return;
    
    setIsLoading(true);
    try {
      let days = 30;
      let type: 'DAILY' | 'INTRADAY' = 'DAILY';
      switch (timeRange) {
        case '1D':
          days = 1;
          type = 'INTRADAY';
          break;
        case '1W':
          days = 7;
          break;
        case '3M':
          days = 90;
          break;
      }
      const priceData = await getStockPrices(symbol, days, type);
      setPrices(priceData);
    } catch (error) {
      console.error('Error fetching price data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [symbol, timeRange]);

  useEffect(() => {
    if (!symbol) return;
    checkIfFavorite();
  }, [symbol, checkIfFavorite]);

  useEffect(() => {
    if (timeRange !== '1M' && symbol) {
      fetchPriceData();
    }
  }, [timeRange, symbol, fetchPriceData]);

  const toggleFavorite = () => {
    if (typeof window !== 'undefined' && symbol) {
      const favorites: string[] = JSON.parse(localStorage.getItem('favoriteStocks') || '[]');
      const newFavorites = isFavorite
        ? favorites.filter(fav => fav !== symbol)
        : [...favorites, symbol];
      localStorage.setItem('favoriteStocks', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    }
  };

  if (!stock || !symbol) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Stock not found</h1>
          <p className="text-gray-600 mt-2">
            The stock symbol &quot;{symbol}&quot; could not be found.
          </p>
          <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
            Go back to home
          </Link>
        </div>
      </div>
    );
  }

  const latestPrice = prices.length > 0 ? prices[prices.length - 1] : null;

  return (
    <>
      <Head>
        <title>{stock.symbol} - {stock.company} | Stock Ticker App</title>
        <meta 
          name="description" 
          content={`Detailed info and price chart for ${stock.company} (${stock.symbol})`} 
        />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:underline mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>

          {/* Stock Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{stock.symbol}</h1>
              <p className="text-lg text-gray-600">{stock.company}</p>
              <p className="text-sm text-gray-500 mt-1">Type: {stock.type}</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={toggleFavorite}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Current Price */}
          {latestPrice ? (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
              <div>
                <span className="text-3xl text-black font-bold">₹{latestPrice.close.toFixed(2)}</span>
                <span
                  className={`ml-3 font-semibold ${
                    latestPrice.close - latestPrice.open >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {latestPrice.close - latestPrice.open >= 0 ? '↑' : '↓'}{' '}
                  {Math.abs(latestPrice.close - latestPrice.open).toFixed(2)}
                </span>
              </div>
              <div className="text-gray-500 text-sm">
                Open: ₹{latestPrice.open.toFixed(2)} | High: ₹{latestPrice.high.toFixed(2)} | Low: ₹
                {latestPrice.low.toFixed(2)} | Volume: {latestPrice.volume.toLocaleString()}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 text-center text-gray-500">
              Price data not available
            </div>
          )}

          {/* Price Chart */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-xl text-black font-semibold">Price Chart</h2>
              <div className="flex space-x-2 flex-wrap">
                {(['1D', '1W', '1M', '3M'] as const).map(range => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      timeRange === range 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            {stock.symbol && (
              <StockGraph 
                data={prices} 
                symbol={stock.symbol} 
                isLoading={isLoading && timeRange !== '1M'} 
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { symbol } = context.params as { symbol: string };
  try {
    const stocks = await searchStocks(symbol);
    const stock = stocks.length > 0 ? stocks[0] : null;

    let initialPrices: StockPrice[] = [];
    const safeSymbol = stock?.symbol ?? null;
    if (safeSymbol) {
      initialPrices = await getStockPrices(safeSymbol, 30, 'DAILY');
    }

    return {
      props: {
        stock: stock
          ? { 
              ...stock, 
              symbol: safeSymbol, 
              company: stock.company ?? '', 
              type: stock.type ?? '' 
            }
          : null,
        initialPrices,
        symbol: safeSymbol,
      },
    };
  } catch (error) {
    console.error(error);
    return { 
      props: { 
        stock: null, 
        initialPrices: [], 
        symbol: symbol ?? null 
      } 
    };
  }
};

export default StockDetail;