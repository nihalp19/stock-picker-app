import { useEffect, useState } from 'react';
import { getTickerData } from '../utils/api';
import { TickerData } from '../types';

const TickerBar = () => {
  const [tickerData, setTickerData] = useState<TickerData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTickerData = async () => {
      setIsLoading(true);
      try {
        const data = await getTickerData();
        setTickerData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching ticker data:', error);
        setTickerData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickerData();
    const interval = setInterval(fetchTickerData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="bg-gray-900 text-white py-2 overflow-hidden">
        <div className="animate-pulse text-center">
          Loading market data...
        </div>
      </div>
    );
  }

  if (!tickerData || tickerData.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-white py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        {tickerData.map((stock, index) => (
          <span key={`${stock.symbol}-${index}`} className="mx-4 inline-block">
            <span className="font-bold">{stock.symbol}</span>
            <span className="mx-2">₹{(stock.price || 0).toFixed(2)}</span>
            <span className={stock.change >= 0 ? 'text-green-400' : 'text-red-400'}>
              {stock.change >= 0 ? '↑' : '↓'} 
              {Math.abs(stock.change || 0).toFixed(2)} 
              ({(stock.changePercent || 0).toFixed(2)}%)
            </span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
          display: inline-block;
        }
      `}</style>
    </div>
  );
};

export default TickerBar;