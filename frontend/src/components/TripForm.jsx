import { useState } from 'react'

export default function TripForm({ onCalculate, isLoading }) {
  const [current, setCurrent] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [cycleUsed, setCycleUsed] = useState(0)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (current && pickup && dropoff && cycleUsed !== '') {
      onCalculate(current, pickup, dropoff, cycleUsed)
    }
  }

  // دالة تعبئة البيانات التجريبية بضغطة زر لتسهيل الشروع والتسجيل
  const handleDemoFill = () => {
    setCurrent('Houston, TX')
    setPickup('Dallas, TX')
    setDropoff('Denver, CO')
    setCycleUsed(12.5)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Trip Parameters</h3>
        <button
          type="button"
          onClick={handleDemoFill}
          className="bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-semibold px-3 py-1.5 rounded-md transition duration-200 flex items-center gap-1 shadow-sm cursor-pointer"
        >
          Demo Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Current Location</label>
          <input type="text" value={current} onChange={(e) => setCurrent(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Chicago, IL" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Location</label>
          <input type="text" value={pickup} onChange={(e) => setPickup(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Detroit, MI" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Dropoff Location</label>
          <input type="text" value={dropoff} onChange={(e) => setDropoff(e.target.value)} required className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="e.g. Dallas, TX" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cycle Used (Hrs)</label>
          <input type="number" value={cycleUsed} onChange={(e) => setCycleUsed(e.target.value)} required min="0" max="70" step="0.1" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500" placeholder="0 - 70" />
        </div>
      </div>
      <button type="submit" disabled={isLoading} className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 transition duration-200">
        {isLoading ? 'Calculating Route & ELD...' : 'Generate Trip Plan'}
      </button>
    </form>
  )
}