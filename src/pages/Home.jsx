import React, { useState, useEffect } from 'react';

// --- Sub-component: Hero ---
const Hero = () => {
  return (
    <section className="relative h-[550px] flex items-center justify-center overflow-hidden bg-slate-900">
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
        <div className="flex flex-wrap justify-center gap-4">
          <button className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center gap-2 text-lg active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            축제 찾기
          </button>
          <button className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 text-lg active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            지도에서 찾기
          </button>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['#인기축제', '#가족과함께', '#서울야경', '#먹거리축제'].map(tag => (
            <span key={tag} className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white border border-white/20 cursor-default hover:bg-white/20 transition-colors duration-300">
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
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md">
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
          <div key={item.label} className="bg-gray-50 p-3 rounded-2xl transition-colors duration-300 hover:bg-blue-50/50">
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
    <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 h-full transition-all duration-300 hover:shadow-md">
      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">마감 임박! 🏃‍♂️</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 hover:bg-rose-50/50 rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-rose-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-rose-500 font-black text-sm group-hover:bg-rose-500 group-hover:text-white transition-all duration-300">{item.dDay}</div>
              <div>
                <h4 className="font-bold text-gray-900 group-hover:text-rose-600 transition-colors duration-300">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.region}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-gray-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
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
    setTimeout(() => { setResult('강원도 대관령 양떼목장 축제'); setIsSpinning(false); }, 800);
  };
  return (
    <section className="bg-purple-600 rounded-3xl p-8 text-white shadow-lg shadow-purple-200 relative overflow-hidden h-full flex flex-col justify-center text-center transition-all duration-300 hover:shadow-xl hover:scale-[1.02]">
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500 rounded-full opacity-50"></div>
      <h3 className="text-2xl font-black mb-2 relative z-10">어디 갈지 고민인가요?</h3>
      <p className="text-purple-100 text-sm mb-8 relative z-10">오늘의 랜덤 축제를 뽑아보세요!</p>
      <div className="min-h-[60px] flex items-center justify-center mb-8 relative z-10">
        {isSpinning ? <div className="flex gap-2"><div className="w-3 h-3 bg-white rounded-full animate-bounce"></div><div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div><div className="w-3 h-3 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div></div> : result ? <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-2xl animate-in zoom-in duration-300"><span className="font-bold text-lg">✨ {result}</span></div> : <div className="text-purple-200 font-bold italic">행운의 축제를 뽑아주세요!</div>}
      </div>
      <button onClick={handlePick} disabled={isSpinning} className="w-full bg-white text-purple-600 font-black py-4 rounded-2xl hover:bg-purple-50 transition-all duration-300 active:scale-95 disabled:opacity-50 relative z-10 shadow-lg hover:shadow-white/20">{isSpinning ? '두구두구...' : '랜덤 축제 뽑기 🎲'}</button>
    </section>
  );
};

// --- Sub-component: TopFestivalsByRegion ---
const TopFestivalsByRegion = () => {
  const [activeRegion, setActiveRegion] = useState('서울');
  const regions = ['서울', '경기', '인천', '강원', '부산', '제주'];
  const festivalData = {
    '서울': [{ rank: 1, name: '한강 달빛 야시장', views: '2.5k', img: 'https://picsum.photos/seed/se1/100/100' }, { rank: 2, name: '경복궁 야간 관람', views: '1.8k', img: 'https://picsum.photos/seed/se2/100/100' }, { rank: 3, name: '남산골 축제', views: '1.2k', img: 'https://picsum.photos/seed/se3/100/100' }],
    '경기': [{ rank: 1, name: '에버랜드 튤립 축제', views: '3.1k', img: 'https://picsum.photos/seed/gg1/100/100' }, { rank: 2, name: '가평 자라섬 재즈', views: '2.2k', img: 'https://picsum.photos/seed/gg2/100/100' }, { rank: 3, name: '수원 화성 문화제', views: '1.5k', img: 'https://picsum.photos/seed/gg3/100/100' }],
  };
  const currentFestivals = festivalData[activeRegion] || festivalData['서울'];
  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div><h3 className="text-3xl font-bold text-gray-900">지역별 인기 축제 TOP 3</h3><p className="text-gray-500 mt-2">지금 가장 핫한 지역별 축제를 확인하세요.</p></div>
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">{regions.map((r) => (<button key={r} onClick={() => setActiveRegion(r)} className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap ${activeRegion === r ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:text-purple-600'}`}>{r}</button>))}</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {currentFestivals.map((fest) => (
          <div key={fest.rank} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:border-purple-100 transition-all duration-500 group cursor-pointer">
            <div className="relative"><div className="w-20 h-20 rounded-2xl overflow-hidden"><img src={fest.img} alt={fest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /></div><div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">{fest.rank}</div></div>
            <div className="flex-grow"><h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{fest.name}</h4><p className="text-xs text-gray-400 mt-1 flex items-center gap-1">👁️ {fest.views}</p></div>
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-500 transition-all duration-300 group-hover:rotate-45"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg></div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Sub-component: FestivalList ---
const FestivalList = () => {
  const festivals = [
    { id: 1, name: '2026 별빛 밤거리 페스티벌', region: '서울 중구', date: '05.28 - 06.01', dDay: 'D-12', rating: 4.8 },
    { id: 2, name: '양평 딸기 축제', region: '경기 양평', date: '05.20 - 05.25', dDay: '종료임박', rating: 4.5 },
    { id: 3, name: '강릉 커피 축제', region: '강원 강릉', date: '06.10 - 06.15', dDay: 'D-25', rating: 4.9 },
    { id: 4, name: '경주 벚꽃 축제', region: '경북 경주', date: '04.05 - 04.10', dDay: 'D-1', rating: 4.7 },
  ];
  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div><h3 className="text-3xl font-black text-gray-900 tracking-tight">인기 축제 목록</h3><p className="text-gray-500 mt-2">지금 사람들에게 가장 사랑받고 있는 축제들이에요.</p></div>
        <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-sm shadow-sm active:scale-95">더보기<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {festivals.map((fest) => (
          <div key={fest.id} className="group cursor-pointer">
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-purple-100 border border-transparent transition-all duration-500 bg-gray-100">
              <img src={`https://picsum.photos/seed/${fest.id + 20}/800/1000`} alt={fest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute top-4 left-4 flex gap-2"><span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-sm">{fest.dDay}</span><span className="bg-purple-600/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-white shadow-sm w-fit">TOP {fest.id}</span></div>
              <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors duration-300 shadow-sm active:scale-90"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" /></svg></button>
            </div>
            <div className="mt-4 px-1">
              <p className="text-[10px] text-gray-500 font-bold mb-1 group-hover:text-purple-400 transition-colors duration-300">{fest.region}</p>
              <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">{fest.name}</h4>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1"><span className="text-yellow-400 text-xs">★</span><span className="text-xs font-black text-gray-700">{fest.rating}</span></div>
                <span className="text-[10px] text-gray-400 font-bold">📅 {fest.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Sub-component: OngoingFestivals ---
const OngoingFestivals = () => {
  const ongoing = [
    { id: 10, name: '에버랜드 산리오 캐릭터즈 튤립 축제', region: '경기 용인', date: '03.22 - 06.16' },
    { id: 11, name: '아침고요수목원 봄꽃페스타', region: '경기 가평', date: '04.19 - 05.26' },
    { id: 12, name: '태안 세계튤립꽃박람회', region: '충남 태안', date: '04.12 - 05.07' },
    { id: 13, name: '담양 대나무 축제', region: '전남 담양', date: '05.11 - 05.15' },
  ];
  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 rounded-[3rem] my-12 text-left">
      <div className="flex justify-between items-end mb-10 px-4">
        <div><h3 className="text-3xl font-black text-gray-900 tracking-tight">지금 진행 중인 축제</h3><p className="text-gray-500 mt-2">오늘 바로 즐길 수 있는 축제들을 확인해 보세요.</p></div>
        <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-green-600 transition-all duration-300 text-sm shadow-sm active:scale-95">전체보기<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {ongoing.map((fest) => (
          <div key={fest.id} className="group cursor-pointer bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-xl hover:border-green-100 transition-all duration-500 border border-gray-100">
            <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-4 bg-gray-100">
              <img src={`https://picsum.photos/seed/${fest.id + 50}/600/600`} alt={fest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute top-3 left-3"><span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg animate-pulse">● 진행중</span></div>
            </div>
            <div className="px-2 pb-2">
              <h4 className="text-base font-black text-gray-900 mt-1 line-clamp-1 group-hover:text-green-600 transition-colors duration-300">{fest.name}</h4>
              <p className="text-xs text-gray-400 mt-1 font-bold">📍 {fest.region}</p>
              <div className="mt-3 pt-3 border-t border-gray-50 flex justify-between items-center"><span className="text-[10px] text-gray-500 font-black">📅 {fest.date}</span><svg className="w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// --- Sub-component: PopularPosts ---
const PopularPosts = () => {
  const posts = [
    { id: 1, title: '양평 딸기축제 다녀왔어요! 🍓 너무 재밌네요', author: '축제요정', region: '경기 양평', date: '2시간 전', views: '1.2k', likes: 45 },
    { id: 2, title: '서울 밤거리 페스티벌 주차 꿀팁 공유합니다 (필독)', author: '베스트드라이버', region: '서울 중구', date: '5시간 전', views: '2.5k', likes: 120 },
    { id: 3, title: '강릉 커피축제 웨이팅 실시간 현황 알려드려요', author: '커피러버', region: '강원 강릉', date: '12시간 전', views: '980', likes: 32 },
    { id: 4, title: '이번 주말에 가기 좋은 가성비 축제 추천 리스트', author: '여행박사', region: '전체', date: '1일 전', views: '3.1k', likes: 210 },
    { id: 5, title: '경주 벚꽃 축제 교촌마을 근처 맛집 추천', author: '미식가', region: '경북 경주', date: '2일 전', views: '1.5k', likes: 88 },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">실시간 인기 게시글</h3>
          <p className="text-gray-500 mt-2">커뮤니티에서 지금 가장 핫한 소식들을 확인하세요.</p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-sm shadow-sm active:scale-95">
          더보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post, index) => (
          <div key={post.id} className="flex items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-300 transition-all duration-500 group cursor-pointer">
            <div className="flex-shrink-0 w-14 h-14 flex items-center justify-center bg-purple-50 rounded-2xl text-2xl font-black text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              {index + 1}
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-500 transition-colors duration-500">📍 {post.region}</span>
                <span className="text-xs text-gray-200">•</span>
                <span className="text-xs font-bold text-purple-500/70 group-hover:text-purple-600 transition-colors duration-500">{post.author}</span>
              </div>
              <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-500">
                {post.title}
              </h4>
            </div>
            <div className="flex-shrink-0 flex items-center gap-6 text-sm font-bold text-gray-400">
              <div className="flex items-center gap-1.5 transition-colors duration-500 group-hover:text-gray-600">
                <span className="text-lg">👁️</span>
                <span>{post.views}</span>
              </div>
              <div className="flex items-center gap-1.5 text-rose-500 transition-transform duration-500 group-hover:scale-110">
                <span className="text-lg">❤️</span>
                <span>{post.likes}</span>
              </div>
              <span className="hidden md:inline text-gray-300 font-medium ml-2">{post.date}</span>
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
    <div className="space-y-12 pb-20 bg-gray-50/30">
      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="flex flex-col h-full"><div className="mb-4"><h3 className="text-xl font-black text-gray-900">오늘의 날씨</h3><p className="text-gray-500 text-xs">축제 여행 전 확인하세요</p></div><WeatherDetail /></div>
          <div className="flex flex-col h-full"><div className="mb-4"><h3 className="text-xl font-black text-gray-900">마감 임박</h3><p className="text-gray-500 text-xs">서두르세요! 곧 끝나요</p></div><ClosingSoon /></div>
          <div className="flex flex-col h-full"><div className="mb-4"><h3 className="text-xl font-black text-gray-900">오늘의 추천</h3><p className="text-gray-500 text-xs">어디 갈지 고민이라면?</p></div><RandomFestival /></div>
        </div>
      </section>
      <section className="bg-white py-12 border-y border-gray-100 transition-colors duration-500 hover:bg-gray-50/30"><TopFestivalsByRegion /></section>
      <section><FestivalList /></section>
      <section><OngoingFestivals /></section>
      <section><PopularPosts /></section>
    </div>
  );
};

export default Home;
