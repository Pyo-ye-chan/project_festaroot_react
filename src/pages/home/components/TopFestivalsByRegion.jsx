import React, { useState } from 'react';

const TopFestivalsByRegion = () => {
  const [activeRegion, setActiveRegion] = useState('서울');
  
  const regions = ['서울', '경기', '인천', '강원', '부산', '제주'];
  
  const festivalData = {
    '서울': [
      { rank: 1, name: '한강 달빛 야시장', views: '2.5k', img: 'https://picsum.photos/seed/se1/100/100' },
      { rank: 2, name: '경복궁 야간 관람', views: '1.8k', img: 'https://picsum.photos/seed/se2/100/100' },
      { rank: 3, name: '남산골 축제', views: '1.2k', img: 'https://picsum.photos/seed/se3/100/100' },
    ],
    '경기': [
      { rank: 1, name: '에버랜드 튤립 축제', views: '3.1k', img: 'https://picsum.photos/seed/gg1/100/100' },
      { rank: 2, name: '가평 자라섬 재즈', views: '2.2k', img: 'https://picsum.photos/seed/gg2/100/100' },
      { rank: 3, name: '수원 화성 문화제', views: '1.5k', img: 'https://picsum.photos/seed/gg3/100/100' },
    ],
    // Add more mock data as needed
  };

  const currentFestivals = festivalData[activeRegion] || festivalData['서울'];

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-3xl font-bold text-gray-900">지역별 인기 축제 TOP 3</h3>
          <p className="text-gray-500 mt-2">지금 가장 핫한 지역별 축제를 확인하세요.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setActiveRegion(r)}
              className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all whitespace-nowrap ${
                activeRegion === r 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentFestivals.map((fest) => (
          <div key={fest.rank} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-5 hover:shadow-md transition-shadow group cursor-pointer">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden">
                <img src={fest.img} alt={fest.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
                {fest.rank}
              </div>
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{fest.name}</h4>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="text-xs text-gray-400 flex items-center gap-1">
                  👁️ {fest.views}
                </span>
                <span className="text-[10px] text-gray-300">|</span>
                <span className="text-xs text-purple-500 font-bold italic">TRENDING</span>
              </div>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TopFestivalsByRegion;
