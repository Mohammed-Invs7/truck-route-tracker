import { useState } from 'react';

export default function TripForm({ onCalculate, isLoading }) {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

  // دالة لتعبئة البيانات التجريبية بضغطة زر
  const handleTestFill = () => {
    setStart('Chicago, IL');
    setEnd('Dallas, TX');
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // لمنع إعادة تحميل الصفحة
    if (start && end) {
      onCalculate(start, end);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6 z-10 relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Location</label>
          <input 
            type="text" 
            value={start}
            onChange={(e) => setStart(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Chicago, IL"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
          <input 
            type="text" 
            value={end}
            onChange={(e) => setEnd(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Dallas, TX"
            required
          />
        </div>
      </div>
      
      <div className="flex gap-4">
        <button 
          type="button" 
          onClick={handleTestFill}
          className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
        >
          🧪 Fill Test Data
        </button>
        <button 
          type="submit" 
          disabled={isLoading}
          className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
        >
          {isLoading ? 'Calculating Trip...' : 'Calculate Route & HOS Logs'}
        </button>
      </div>
    </form>
  );
}