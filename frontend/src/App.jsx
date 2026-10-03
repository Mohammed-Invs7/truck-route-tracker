import { useState } from 'react'
import TripForm from './components/TripForm'
import MapComponent from './components/MapComponent'
import EldGrid from './components/EldGrid'

export default function App() {
  const [tripData, setTripData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  // Store origin and destination city names for the printed report header
  const [tripRoute, setTripRoute] = useState({ start: '', end: '' })

  const handleCalculate = async (currentLoc, pickupLoc, dropoffLoc, cycleUsed) => {
    setIsLoading(true)
    setTripRoute({ start: currentLoc, end: dropoffLoc })

    try {
      const response = await fetch('/api/calculate-trip/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          current_location: currentLoc,
          pickup_location: pickupLoc,
          dropoff_location: dropoffLoc,
          current_cycle_used: cycleUsed
        })
      })
      
      const data = await response.json()
      setTripData(data)
    } catch (error) {
      console.error("Error calculating trip:", error)
      alert("Failed to connect to the server.")
    } finally {
      setIsLoading(false)
    }
  }

  // Open the browser print dialog for the logbook report
  const handleDownloadPDF = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto flex flex-col gap-6">
        
        <header className="mb-2 print:hidden">
          <h1 className="text-3xl font-bold text-gray-900">Truck Route & ELD Planner</h1>
          <p className="text-gray-500">FMCSA Compliant Hours of Service Calculator</p>
        </header>

        {/* Hide the trip input form when printing */}
        <div className="print:hidden">
          <TripForm onCalculate={handleCalculate} isLoading={isLoading} />
        </div>

        {/* Results Section */}
        {tripData && (
          <div className="space-y-6">
            
            {/* Hide the map summary when printing the paper report */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 print:hidden">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Trip Summary</h2>
              
              <div className="mb-6">
                <MapComponent mapData={tripData.map_data} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Total Distance</p>
                  <p className="text-2xl font-bold text-gray-800">{tripData.summary?.total_miles} Miles</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Driving Time</p>
                  <p className="text-2xl font-bold text-gray-800">{tripData.summary?.driving_hours} Hours</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-500 font-medium">Trip Days</p>
                  <p className="text-2xl font-bold text-gray-800">{tripData.summary?.total_days} Days</p>
                </div>
              </div>
            </div>

            {/* PDF print controls and daily HOS grids */}
            <div>
              <div className="flex justify-between items-center mb-4 print:hidden">
                <h2 className="text-xl font-bold text-gray-800">HOS Daily Logs</h2>
                <button 
                  onClick={handleDownloadPDF}
                  className="bg-green-600 text-white font-bold px-4 py-2 rounded-md hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                >
                  📥 Download PDF Logbook
                </button>
              </div>

              {/* Printable paper report container */}
              <div id="pdf-report-content" className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 print:shadow-none print:border-none print:p-0">
                
                {/* Report header */}
                <div className="border-b-4 border-gray-800 pb-4 mb-8">
                  <h1 className="text-3xl font-extrabold text-gray-900 uppercase tracking-wider text-center mb-4">
                    Drivers Daily Log
                  </h1>
                  <div className="flex justify-between items-center text-lg px-4">
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-700">From:</span>
                      <span className="border-b border-gray-400 min-w-[200px] inline-block text-center font-semibold text-blue-900">
                        {tripRoute.start}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <span className="font-bold text-gray-700">To:</span>
                      <span className="border-b border-gray-400 min-w-[200px] inline-block text-center font-semibold text-blue-900">
                        {tripRoute.end}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Render a log grid for each trip day */}
                {tripData.daily_logs.map((dayData, index) => (
                  <EldGrid key={index} dayData={dayData} />
                ))}

                {/* Report footer (signature and remarks) */}
                <div className="mt-12 border-t border-gray-300 pt-4 flex justify-between">
                  <div className="w-1/2">
                    <p className="font-bold mb-2">Remarks / Shipping Documents:</p>
                    <div className="border-b border-gray-400 h-6 w-3/4 mb-2"></div>
                    <div className="border-b border-gray-400 h-6 w-3/4"></div>
                  </div>
                  <div className="w-1/3">
                    <p className="font-bold mb-8">Driver's Signature:</p>
                    <div className="border-b border-gray-800"></div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}
        <footer className="mt-12 text-center py-4 text-sm text-gray-500 border-t border-gray-200">
           Developed by 💻<span className="font-semibold text-gray-700">Eng.Mohammed Ali Al-Amoudi - م. محمد علي العمودي</span>
           <span className="mx-2">|</span> 
            <a 
              href="https://www.linkedin.com/in/mohammed-alamoudi-788004367/"
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-blue-600 hover:underline font-medium"
            >
              LinkedIn Profile
            </a>
            <span className="mx-2">|</span> 
            <span>Spotter AI Assessment</span>
        </footer>
      </div>
    </div>
  )
}