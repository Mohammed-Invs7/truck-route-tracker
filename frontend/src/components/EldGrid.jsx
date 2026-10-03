export default function EldGrid({ dayData }) {
    if (!dayData || !dayData.events) return null;
  
    // Y-axis positions for each duty status on the grid
    const STATUS_Y = {
      OFF_DUTY: 20,
      SLEEPER: 45,
      DRIVING: 70,
      ON_DUTY: 95,
    };
  
    // Hour ticks from 0 to 24 for vertical grid lines
    const hours = Array.from({ length: 25 }, (_, i) => i);
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Logbook - Day {dayData.day_number}
        </h3>
  
        <div className="overflow-x-auto">
          {/* SVG grid for precise log lines */}
          <svg viewBox="0 0 960 140" className="w-full min-w-[700px] h-auto font-sans">
            {/* Grid background */}
            <rect x="0" y="0" width="960" height="140" fill="#f8fafc" rx="8" />
  
            {/* Status labels on the left */}
            <text x="10" y={STATUS_Y.OFF_DUTY + 4} fontSize="12" fontWeight="bold" fill="#334155">OFF DUTY</text>
            <text x="10" y={STATUS_Y.SLEEPER + 4} fontSize="12" fontWeight="bold" fill="#334155">SLEEPER</text>
            <text x="10" y={STATUS_Y.DRIVING + 4} fontSize="12" fontWeight="bold" fill="#334155">DRIVING</text>
            <text x="10" y={STATUS_Y.ON_DUTY + 4} fontSize="12" fontWeight="bold" fill="#334155">ON DUTY</text>
  
            {/* Vertical hour lines and labels */}
            {hours.map((h) => (
              <g key={h}>
                <line 
                  x1={90 + h * 34} y1="10" 
                  x2={90 + h * 34} y2="110" 
                  stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 2" 
                />
                {/* Show hour labels every two hours to reduce clutter */}
                {h % 2 === 0 && (
                  <text x={90 + h * 34} y="125" fontSize="10" textAnchor="middle" fill="#64748b">
                    {h}:00
                  </text>
                )}
              </g>
            ))}
  
            {/* Duty-status path based on event data */}
            {dayData.events.map((event, idx) => {
              const x1 = 90 + (event.start * 34); // Horizontal start
              const x2 = 90 + ((event.start + event.duration) * 34); // Horizontal end
              const y = STATUS_Y[event.status]; // Vertical position for the duty status
              
              return (
                <g key={idx}>
                  {/* Horizontal line representing event duration */}
                  <line x1={x1} y1={y} x2={x2} y2={y} stroke="#2563eb" strokeWidth="4" />
                  
                  {/* Vertical connector from the previous duty status */}
                  {idx > 0 && (
                    <line 
                      x1={x1} 
                      y1={STATUS_Y[dayData.events[idx - 1].status]} 
                      x2={x1} 
                      y2={y} 
                      stroke="#2563eb" 
                      strokeWidth="2" 
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }