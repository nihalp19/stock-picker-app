import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockPrice } from '../types';

interface StockGraphProps {
  data: StockPrice[];
  symbol: string;
  isLoading?: boolean;
}

const StockGraph = ({ data, symbol, isLoading }: StockGraphProps) => {
  if (isLoading) {
    return (
      <div className="h-64 w-full bg-gray-50 rounded-xl flex items-center justify-center shadow-sm">
        <div className="text-gray-500">Loading chart data...</div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="h-64 w-full bg-gray-50 rounded-xl flex items-center justify-center shadow-sm">
        <div className="text-gray-500">No data available</div>
      </div>
    );
  }

  // Format date for X-axis
  const formatDate = (timestamp: string) => {
    const dateObj = new Date(timestamp);
    return `${dateObj.getHours()}:${dateObj.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-72 md:h-96 bg-white rounded-xl p-4 shadow-md">
      <h3 className="text-gray-800 font-semibold mb-2 text-lg">{symbol} Price Chart</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={formatDate} 
            fontSize={12} 
            stroke="#9ca3af"
          />
          <YAxis 
            fontSize={12} 
            stroke="#9ca3af" 
            tickFormatter={(value) => `₹${value}`} 
          />
          <Tooltip 
            formatter={(value: number, name: string) => [`₹${value}`, name === 'close' ? 'Close Price' : name]} 
            labelFormatter={formatDate} 
            contentStyle={{ backgroundColor: '#f9fafb', borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
          />
          <Line 
            type="monotone" 
            dataKey="close" 
            stroke="#3b82f6" 
            strokeWidth={2} 
            dot={{ r: 2 }} 
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockGraph;
