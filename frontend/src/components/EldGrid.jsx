export default function EldGrid({ dayData }) {
    if (!dayData || !dayData.events) return null;
  
    // إحداثيات المحور الصادي (Y) لكل حالة في الشبكة
    const STATUS_Y = {
      OFF_DUTY: 20,
      SLEEPER: 45,
      DRIVING: 70,
      ON_DUTY: 95,
    };
  
    // مصفوفة من 0 إلى 24 لرسم خطوط الساعات العمودية
    const hours = Array.from({ length: 25 }, (_, i) => i);
  
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mt-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">
          Logbook - Day {dayData.day_number}
        </h3>
  
        <div className="overflow-x-auto">
          {/* نستخدم SVG لرسم الشبكة والخطوط بدقة عالية */}
          <svg viewBox="0 0 960 140" className="w-full min-w-[700px] h-auto font-sans">
            {/* خلفية الشبكة */}
            <rect x="0" y="0" width="960" height="140" fill="#f8fafc" rx="8" />
  
            {/* أسماء الحالات في اليسار */}
            <text x="10" y={STATUS_Y.OFF_DUTY + 4} fontSize="12" fontWeight="bold" fill="#334155">OFF DUTY</text>
            <text x="10" y={STATUS_Y.SLEEPER + 4} fontSize="12" fontWeight="bold" fill="#334155">SLEEPER</text>
            <text x="10" y={STATUS_Y.DRIVING + 4} fontSize="12" fontWeight="bold" fill="#334155">DRIVING</text>
            <text x="10" y={STATUS_Y.ON_DUTY + 4} fontSize="12" fontWeight="bold" fill="#334155">ON DUTY</text>
  
            {/* رسم خطوط الساعات العمودية والأرقام */}
            {hours.map((h) => (
              <g key={h}>
                <line 
                  x1={90 + h * 34} y1="10" 
                  x2={90 + h * 34} y2="110" 
                  stroke="#cbd5e1" strokeWidth="1" strokeDasharray="4 2" 
                />
                {/* عرض الرقم كل ساعتين لتخفيف الزحمة */}
                {h % 2 === 0 && (
                  <text x={90 + h * 34} y="125" fontSize="10" textAnchor="middle" fill="#64748b">
                    {h}:00
                  </text>
                )}
              </g>
            ))}
  
            {/* رسم خطوط مسار السائق بناءً على البيانات */}
            {dayData.events.map((event, idx) => {
              const x1 = 90 + (event.start * 34); // نقطة البداية الأفقية
              const x2 = 90 + ((event.start + event.duration) * 34); // نقطة النهاية الأفقية
              const y = STATUS_Y[event.status]; // الارتفاع بناءً على الحالة
              
              return (
                <g key={idx}>
                  {/* الخط الأفقي الذي يمثل المدة */}
                  <line x1={x1} y1={y} x2={x2} y2={y} stroke="#2563eb" strokeWidth="4" />
                  
                  {/* الخط العمودي الذي يربط بين الحالة الحالية والحالة السابقة */}
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