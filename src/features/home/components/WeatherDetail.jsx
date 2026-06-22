import React, { useEffect, useState } from 'react';
import { CloudRain, Sun, Wind } from 'lucide-react';
import WeatherApi from '../../../api/weatherApi';

const WeatherDetail = ({ activeRegion }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        const data = await WeatherApi.todayWeather(activeRegion); 
        setWeather(data);
      } catch (error) {
        console.error("실시간 날씨 데이터 수신 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    if (activeRegion) {
      fetchWeather();
    }
  }, [activeRegion]); // 탭 전환 시 날씨가 실시간으로 재요청

  if (loading || !weather) {
    return (
      <div className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 h-full flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const details = [
    { label: '미세먼지', value: weather.dust, color: 'text-green-500', icon: '🍃' },
    { label: '강수확률', value: weather.rainProb, color: 'text-blue-500', icon: '💧' },
    { label: '습도', value: weather.humidity, color: 'text-blue-400', icon: '☁️' },
  ];

  return (
    <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="mb-6">
        <h3 className="text-lg font-black text-gray-900">오늘의 날씨</h3>
        <p className="text-xs text-gray-400 mt-0.5 font-bold">{activeRegion} 기준</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <span className="text-5xl drop-shadow-sm">{weather.icon}</span>
        <div>
          <p className="text-4xl font-black text-purple-600 leading-none tracking-tighter">{weather.temp}°C</p>
          <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-wider">{weather.description}</p>
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

      <div className="mt-auto p-4 bg-purple-50 rounded-2xl border border-purple-100/50">
        <p className="text-sm font-bold text-purple-700 text-center leading-relaxed whitespace-pre-line">
          "{weather.comment}"
        </p>
      </div>
    </section>
  );
};

export default WeatherDetail;