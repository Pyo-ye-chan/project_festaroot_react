import React from 'react';
import { Link } from 'react-router-dom';

const ClosingSoon = () => {
  const items = [
    { id: 1, name: '양평 딸기 축제', dDay: 'D-1', region: '경기 양평', date: '05.01 - 05.27' },
    { id: 2, name: '진해 군항제', dDay: 'D-2', region: '경남 창원', date: '05.20 - 05.28' },
    { id: 3, name: '광양 매화 축제', dDay: 'D-3', region: '전남 광양', date: '05.15 - 05.29' },
  ];
  return (
    <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span>종료 임박!</span>
          <span className="text-lg animate-bounce">🏃‍♂️</span>
        </h3>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase tracking-tighter border border-gray-100">Hurry Up</span>
      </div>

      <div className="space-y-3 flex-grow">
        {items.map((item) => (
          <Link to={`/festival/${item.id}`} key={item.id} className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-white rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-rose-100 hover:shadow-sm">
            <div className="flex-shrink-0 w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 group-hover:bg-rose-500 transition-all duration-300">
              <span className="text-sm font-black text-rose-500 group-hover:text-white">{item.dDay}</span>
            </div>
            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-gray-800 truncate group-hover:text-rose-600 transition-colors duration-300">{item.name}</h4>
              <div className="mt-1 flex flex-col gap-0.5">
                <p className="text-[10px] text-gray-500 font-bold group-hover:text-rose-400 transition-colors">📍 {item.region}</p>
                <p className="text-[10px] text-gray-400 font-bold group-hover:text-rose-300 transition-colors">📅 {item.date}</p>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ClosingSoon;