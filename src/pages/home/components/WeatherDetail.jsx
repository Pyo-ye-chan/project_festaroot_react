import React from 'react';

const WeatherDetail = () => {
  const details = [
    { label: '미세먼지', value: '좋음', color: 'text-green-500' },
    { label: '초미세먼지', value: '보통', color: 'text-yellow-500' },
    { label: '강수확률', value: '10%', color: 'text-blue-500' },
    { label: '습도', value: '45%', color: 'text-blue-400' },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">오늘의 날씨</h3>
          <p className="text-sm text-gray-500 mt-1">서울 중구 기준</p>
        </div>
        <div className="text-right">
          <span className="text-3xl">☀️</span>
          <p className="text-2xl font-black text-blue-600">24°C</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {details.map((item) => (
          <div key={item.label} className="bg-gray-50 p-3 rounded-2xl">
            <p className="text-xs font-bold text-gray-500 mb-1">{item.label}</p>
            <p className={`text-sm font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 p-3 bg-blue-50 rounded-2xl text-center">
        <p className="text-xs font-bold text-blue-700">"축제 가기 딱 좋은 날씨예요! 🎡"</p>
      </div>
    </section>
  );
};

export default WeatherDetail;
