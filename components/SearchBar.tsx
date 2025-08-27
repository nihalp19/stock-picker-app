import { useState, useEffect, useRef } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchStocks } from '../utils/api';
import { Stock } from '../types';
import { useRouter } from 'next/router';

const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Stock[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);

    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {
            if (query.length > 1) performSearch(query);
            else {
                setResults([]);
                setShowResults(false);
            }
        }, 300);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
            if (abortControllerRef.current) abortControllerRef.current.abort();
        };
    }, [query]);

    const performSearch = async (searchQuery: string) => {
        setIsLoading(true);

        if (abortControllerRef.current) abortControllerRef.current.abort();
        abortControllerRef.current = new AbortController();

        try {
            const stocks = await searchStocks(searchQuery);
            setResults(Array.isArray(stocks) ? stocks : []);
            console.log("stocks", stocks);
        } catch (error: any) {
            if (error.name === 'AbortError') return;
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
            setShowResults(true);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowResults(false);
        }, 200);
    };

    const handleSelectStock = (symbol: string) => {
        setShowResults(false);
        setQuery('');
        router.push(`/stock/${symbol}`);
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
                            <div
                                key={stock.symbol ?? stock.company}
                                onMouseDown={() => stock.symbol && handleSelectStock(stock.symbol)}
                                className="flex flex-col p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                            >
                                <div className="font-semibold text-gray-800">{stock.symbol}</div>
                                <div className="text-sm text-gray-600">{stock.company}</div>
                            </div>
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
