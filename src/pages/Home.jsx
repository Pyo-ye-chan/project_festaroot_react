import React, { useState, useEffect } from 'react';

// --- Sub-component: Hero ---
const Hero = () => {
  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Background with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=2070" 
          alt="Festival background" 
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-900/60"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl px-4 text-center">
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 drop-shadow-lg leading-tight">
          함께 즐기는 모든 순간, <br/>
          <span className="text-purple-400">축제로</span>부터
        </h2>
        
        {/* Action Buttons - Per Wireframe 1 */}
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            축제 찾기
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-2xl transition-all flex items-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            지도에서 찾기
          </button>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['#인기축제', '#가족과함께', '#서울야경', '#먹거리축제'].map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/20">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

// --- Sub-component: WeatherDetail ---
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
    </section>
  );
};

// --- Sub-component: ClosingSoon ---
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

// --- Sub-component: RandomFestival ---
const RandomFestival = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const handlePick = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setResult('강원도 대관령 양떼목장 축제');
      setIsSpinning(false);
    }, 800);
  };

  return (
    <section className="bg-purple-600 rounded-3xl p-8 text-white shadow-lg shadow-purple-200 relative overflow-hidden h-full flex flex-col justify-center text-center">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full opacity-50"></div>
      <h3 className="text-2xl font-black mb-2 relative z-10">어디 갈지 고민인가요?</h3>
      <p className="text-purple-100 text-sm mb-8 relative z-10">오늘의 랜덤 축제를 뽑아보세요!</p>
      <div className="min-h-[60px] flex items-center justify-center mb-8 relative z-10">
        {isSpinning ? (
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
          </div>
        ) : result ? (
          <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl animate-in zoom-in duration-300">
            <span className="font-bold text-lg">✨ {result}</span>
          </div>
        ) : (
          <div className="text-purple-200 font-bold italic">행운의 축제를 뽑아주세요!</div>
        )}
      </div>
      <button 
        onClick={handlePick}
        disabled={isSpinning}
        className="w-full bg-white text-purple-600 font-black py-4 rounded-2xl hover:bg-purple-50 transition-all active:scale-95 disabled:opacity-50 relative z-10"
      >
        {isSpinning ? '두구두구...' : '랜덤 축제 뽑기 🎲'}
      </button>
    </section>
  );
};

// --- Sub-component: TopFestivalsByRegion ---
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
              <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">👁️ {fest.views}</p>
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

// --- Sub-component: FestivalList ---
const FestivalList = () => {
  const [activeCategory, setActiveCategory] = useState('전체');
  const categories = ['전체', '가족과 함께', '연인과 함께', '음식/먹거리', '음악/공연', '전통문화'];
  const festivals = [
    { id: 1, name: '2026 별빛 밤거리 페스티벌', region: '서울 중구', date: '05.28 - 06.01', dDay: 'D-12', category: '음악/공연', rating: 4.8 },
    { id: 2, name: '양평 딸기 축제', region: '경기 양평', date: '05.20 - 05.25', dDay: '종료임박', category: '음식/먹거리', rating: 4.5 },
    { id: 3, name: '강릉 커피 축제', region: '강원 강릉', date: '06.10 - 06.15', dDay: 'D-25', category: '음식/먹거리', rating: 4.9 },
    { id: 4, name: '경주 벚꽃 축제', region: '경북 경주', date: '04.05 - 04.10', dDay: 'D-1', category: '전통문화', rating: 4.7 },
    { id: 5, name: '제주 유채꽃 축제', region: '제주 서귀포', date: '04.15 - 04.20', dDay: 'D-8', category: '가족과 함께', rating: 4.6 },
    { id: 6, name: '부산 국제 락 페스티벌', region: '부산 사상구', date: '08.15 - 08.17', dDay: 'D-120', category: '음악/공연', rating: 4.9 },
  ];
  const filteredFestivals = activeCategory === '전체' ? festivals : festivals.filter(f => f.category === activeCategory);

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">실시간 인기 축제</h3>
          <p className="text-gray-500 mt-2">사용자들이 지금 가장 많이 찾는 축제들이에요.</p>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFestivals.map((fest) => (
          <div key={fest.id} className="group cursor-pointer">
            <div className="relative h-72 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-100">
              <img src={`https://picsum.photos/seed/${fest.id + 20}/800/600`} alt={fest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-5 left-5 flex gap-2">
                <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-gray-900 shadow-sm">{fest.dDay}</span>
                <span className="bg-purple-600/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-white shadow-sm">TOP {fest.id}</span>
              </div>
              <button className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" /></svg>
              </button>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">상세보기</button>
              </div>
            </div>
            <div className="mt-6 px-2">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{fest.category}</span>
                <span className="text-xs text-gray-400 font-medium">|</span>
                <span className="text-xs text-gray-500 font-medium">{fest.region}</span>
              </div>
              <h4 className="text-xl font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">{fest.name}</h4>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1"><span className="text-yellow-400">★</span><span className="text-sm font-black text-gray-700">{fest.rating}</span></div>
                <span className="text-xs text-gray-400 font-bold">📅 {fest.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Home Component (Main) ---
const Home = () => {
  return (
    <div className="space-y-12 pb-20">
      <Hero />
      
      {/* Utility Grid: Weather, Closing, Random */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-xl font-black text-gray-900">오늘의 날씨</h3>
              <p className="text-gray-500 text-xs">축제 여행 전 확인하세요</p>
            </div>
            <WeatherDetail />
          </div>
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-xl font-black text-gray-900">마감 임박</h3>
              <p className="text-gray-500 text-xs">서두르세요! 곧 끝나요</p>
            </div>
            <ClosingSoon />
          </div>
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <h3 className="text-xl font-black text-gray-900">오늘의 추천</h3>
              <p className="text-gray-500 text-xs">어디 갈지 고민이라면?</p>
            </div>
            <RandomFestival />
          </div>
        </div>
      </section>

      {/* Region Section */}
      <section className="bg-white py-12 border-y border-gray-100">
        <TopFestivalsByRegion />
      </section>

      {/* Main List Section */}
      <section>
        <FestivalList />
      </section>
    </div>
  );
};

export default Home;
