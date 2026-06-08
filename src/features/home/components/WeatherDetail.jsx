import React from 'react';

const WeatherDetail = () => {
  const details = [
    { label: '미세먼지', value: '좋음', color: 'text-green-500', icon: '🍃' },
    { label: '강수확률', value: '10%', color: 'text-blue-500', icon: '💧' },
    { label: '습도', value: '45%', color: 'text-blue-400', icon: '☁️' },
  ];
  return (
    <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-black text-gray-900">오늘의 날씨</h3>
        <p className="text-xs text-gray-400 mt-0.5 font-bold">서울 중구 기준</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl drop-shadow-sm">☀️</span>
        <div>
          <p className="text-4xl font-black text-blue-600 leading-none tracking-tighter">24°C</p>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">Sunny Day</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-6">
        {details.map((item) => (
          <div key={item.label} className="bg-gray-50 p-2.5 rounded-2xl border border-gray-100/50 text-center">
            <p className="text-[9px] font-bold text-gray-500 mb-1">{item.label}</p>
            <p className={`text-xs font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-auto p-4 bg-blue-50 rounded-2xl border border-blue-100/50">
        <p className="text-sm font-bold text-blue-600 text-center leading-relaxed">
          "오늘은 축제 가기 딱 좋은 날씨예요! 🎡"
        </p>
      </div>
    </section>
  );
};

export default WeatherDetail;