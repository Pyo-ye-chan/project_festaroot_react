import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TopFestivalsByRegion = () => {
  const [activeRegion, setActiveRegion] = useState('서울');
  const regions = ['서울', '경기', '인천', '강원', '부산', '제주'];
  const festivalData = {
    '서울': [
      { id: 1, rank: 1, name: '2026 별빛 밤거리 페스티벌', likes: '1.2k', region: '서울 반포한강공원', date: '05.20 - 06.15', img: 'https://picsum.photos/seed/se1/100/100' },
      { id: 5, rank: 2, name: '경복궁 야간 관람', likes: '850', region: '서울 종로구', date: '04.01 - 05.31', img: 'https://picsum.photos/seed/se2/100/100' },
      { id: 6, rank: 3, name: '남산골 축제', likes: '420', region: '서울 중구', date: '05.25 - 05.28', img: 'https://picsum.photos/seed/se3/100/100' }
    ],
    '경기': [
      { id: 7, rank: 1, name: '에버랜드 튤립 축제', likes: '2.1k', region: '경기 용인', date: '03.22 - 06.16', img: 'https://picsum.photos/seed/gg1/100/100' },
      { id: 8, rank: 2, name: '가평 자라섬 재즈', likes: '1.5k', region: '경기 가평', date: '10.05 - 10.08', img: 'https://picsum.photos/seed/gg2/100/100' },
      { id: 9, rank: 3, name: '수원 화성 문화제', likes: '900', region: '경기 수원', date: '10.07 - 10.09', img: 'https://picsum.photos/seed/gg3/100/100' }
    ],
  };
  const currentFestivals = festivalData[activeRegion] || festivalData['서울'];
  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div><h3 className="text-3xl font-bold text-gray-900 font-black">지역별 인기 축제 TOP 3</h3><p className="text-gray-500 mt-2 font-bold text-sm">지금 가장 핫한 지역별 축제를 확인하세요.</p></div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">{regions.map((r) => (<button key={r} onClick={() => setActiveRegion(r)} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap ${activeRegion === r ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:text-purple-600'}`}>{r}</button>))}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentFestivals.map((fest) => (
          <Link to={`/festival/${fest.id}`} key={fest.rank} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:border-purple-100 transition-all duration-500 group cursor-pointer">
            <div className="relative flex-shrink-0"><div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100"><img src={fest.img} alt={fest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div><div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">{fest.rank}</div></div>
            <div className="flex-grow min-w-0">
              <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">{fest.name}</h4>
              <div className="mt-1 space-y-1">
                <p className="text-[11px] text-gray-500 font-bold truncate flex items-center gap-1">📍 {fest.region}</p>
                <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">📅 {fest.date}</p>
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-rose-500 font-black">
                <span className="text-xs">❤️</span>
                <span className="text-[11px]">{fest.likes}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default TopFestivalsByRegion;