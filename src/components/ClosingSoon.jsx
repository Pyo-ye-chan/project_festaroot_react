import React from 'react';

const ClosingSoon = () => {
  const items = [
    { id: 1, name: '양평 딸기 축제', dDay: 'D-1', region: '경기 양평' },
    { id: 2, name: '진해 군항제', dDay: 'D-2', region: '경남 창원' },
    { id: 3, name: '광양 매화 축제', dDay: 'D-3', region: '전남 광양' },
  ];

  return (
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        마감 임박! 🏃‍♂️
      </h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 font-black text-sm">
                {item.dDay}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-rose-500 transition-colors">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.region}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ClosingSoon;
