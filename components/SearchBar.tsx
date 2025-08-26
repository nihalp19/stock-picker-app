import { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchStocks } from '../utils/api';
import { Stock } from '../types';
import Link from 'next/link';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.length > 1) performSearch();
      else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const performSearch = async () => {
    setIsLoading(true);
    try {
      const stocks = await searchStocks(query);
      setResults(Array.isArray(stocks) ? stocks : []);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
      setShowResults(true);
    }
  };

  const handleInputBlur = () => {
    // Delay hiding results to allow for link clicks
    setTimeout(() => setShowResults(false), 200);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={handleInputBlur}
          onFocus={() => results.length > 0 && setShowResults(true)}
          placeholder="Search for stocks..."
          className="w-full pl-12 pr-4 py-3 text-gray-800 placeholder-gray-400 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-150 shadow-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 animate-spin" />
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-lg mt-2 z-20 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {results.length > 0 ? (
            results.map((stock) => (
              <Link
                key={stock.symbol ?? stock.company} // fallback key if symbol is null
                href={`/stock/${stock.symbol}`}
                onClick={() => {
                  setShowResults(false);
                  setQuery('');
                }}
              >
                <div className="flex flex-col p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors">
                  <div className="font-semibold text-gray-800">{stock.symbol}</div>
                  <div className="text-sm text-gray-600">{stock.company}</div>
                  {/* {stock.sector && <div className="text-xs text-gray-500">{stock.sector}</div>} */}
                </div>
              </Link>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">No stocks found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
