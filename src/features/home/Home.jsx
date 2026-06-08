import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import festivalService from '../../api/festivalService';
import useLoadingStore from '../../store/useLoadingStore';

// --- Sub-component: Hero ---
const Hero = () => {
  const { startLoading, stopLoading } = useLoadingStore();

  const handleUpdateDB = async () => {
    if (confirm("축제API 데이터가 DB에 업데이트 됩니다. 진행하시겠습니까?")) {
      try {
        startLoading();
        const result = await festivalService.upsertFestivals();
        console.log(result)
        alert(result)
      } catch (error) {
        console.error("메인에서 잡은 에러 : ", error)
        alert("서버 연결에 실패했거나 업데이트 중 오류가 발생했습니다.")
      } finally {
        stopLoading();
      }
    } else {
      alert("업데이트가 취소되었습니다.")
    }
  }

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
          함께 즐기는 모든 순간, <br />
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

          <button onClick={handleUpdateDB} className="px-8 py-4 bg-green-500/10 backdrop-blur-md border border-green-500/20 hover:bg-green-500/20 text-white font-bold rounded-2xl transition-all duration-300 flex items-center gap-2 text-lg active:scale-95">
            축제 데이터 DB 업데이트 하기
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

// --- Sub-component: ClosingSoon ---
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

// --- Sub-component: RandomFestival ---
const RandomFestival = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const handlePick = () => {
    setIsSpinning(true);
    setTimeout(() => { setResult({ id: 1, name: '2026 별빛 밤거리 페스티벌' }); setIsSpinning(false); }, 800);
  };
  return (
    <section className="bg-purple-50 rounded-[2.5rem] p-8 border border-purple-100 shadow-sm relative overflow-hidden h-full flex flex-col justify-center text-center transition-all duration-300 hover:shadow-md hover:border-purple-200">
      <div className="relative z-10">
        <h3 className="text-xl font-black mb-1 text-purple-900 font-black">어디 갈지 고민인가요?</h3>
        <p className="text-purple-400 text-[10px] font-bold opacity-80 mb-8 uppercase tracking-widest">Random Pick</p>

        <div className="min-h-[100px] flex items-center justify-center mb-8">
          {isSpinning ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="text-[10px] font-black text-purple-400 animate-pulse uppercase tracking-wider">Finding Destiny...</p>
            </div>
          ) : result ? (
            <Link to={`/festival/${result.id}`} className="bg-white p-5 rounded-[2rem] shadow-sm border border-purple-100 animate-in zoom-in duration-500 block hover:border-purple-300 transition-all">
              <span className="text-purple-700 font-black text-base block mb-1">✨ {result.name}</span>
              <span className="text-[10px] text-purple-400 font-bold">당신에게 딱 맞는 축제를 찾았어요!</span>
            </Link>
          ) : (
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center border border-purple-100 shadow-inner group-hover:scale-110 transition-transform duration-500">
              <span className="text-3xl">🎲</span>
            </div>
          )}
        </div>

        <button
          onClick={handlePick}
          disabled={isSpinning}
          className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl hover:bg-purple-700 transition-all duration-300 active:scale-95 disabled:opacity-50 shadow-lg shadow-purple-200"
        >
          {isSpinning ? '두구두구...' : '랜덤 축제 뽑기!'}
        </button>
      </div>
    </section>
  );
};

// --- Sub-component: TopFestivalsByRegion ---
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

// --- 인기 축제 목록 (진행중인 축제만 필터링) ---
const FestivalList = () => {
  const [popularList, setPopularList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopularFestivals = async () => {
      try {
        setIsLoading(true);
        
        // 진행 중인 축제만 가져오도록 ongoingOnly 속성 추가
        const params = {
          page: 1,
          size: 4,
          sort: 'popular',
          ongoingOnly: true 
        };

        const response = await festivalService.getFestivals(params);
        
        const data = Array.isArray(response) ? response : (response.list || []);
        setPopularList(data);
      } catch (error) {
        console.error("인기 축제 데이터를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPopularFestivals();
  }, []);

  const formatRegion = (addr) => {
    if (!addr) return '지역 정보 없음';
    const parts = addr.split(' ');
    if (parts.length >= 2) {
      const doName = parts[0].substring(0, 2);
      const siName = parts[1].substring(0, 2);
      return `${doName} ${siName}`;
    }
    return parts[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const cleanStr = String(dateStr).replace(/-/g, ''); 
    if (cleanStr.length === 8) {
      return `${cleanStr.substring(0, 4)}.${cleanStr.substring(4, 6)}.${cleanStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="animate-pulse text-gray-400 font-bold">지금 인기 있는 축제들을 불러오고 있어요... 🎡</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">인기 축제 목록</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">지금 사람들에게 가장 사랑받고 있는 축제들이에요.</p>
        </div>
        {/* 🛠️ 링크 수정: 더보기 클릭 시 검색 페이지에서 '진행중만 보기' 토글이 켜지도록 state 값 변경 */}
        <Link 
          to="/search" 
          state={{ ongoingOnly: true, sort: 'popular' }} 
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-sm shadow-sm active:scale-95"
        >
          더보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularList.length > 0 ? (
          popularList.map((fest, index) => {
            const contentId = fest.contentId || fest.content_id;
            const title = fest.title;
            const region = fest.addr1;
            const startDate = fest.eventStartDate || fest.event_start_date;
            const endDate = fest.eventEndDate || fest.event_end_date;
            const image = fest.firstImage || fest.first_image;
            const rating = fest.rating || 0.0; 
            const likes = fest.likes || fest.likeCount || fest.like_count || 0; 

            return (
              <Link to={`/festival/${contentId}`} key={contentId} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-purple-100 border border-transparent transition-all duration-500 bg-gray-100">
                  <img 
                    src={image || `https://picsum.photos/seed/${contentId}/800/1000`} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-sm">
                      추천
                    </span>
                    <span className="bg-purple-600/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-white shadow-sm w-fit">
                      TOP {index + 1}
                    </span>
                  </div>
                  <button className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors duration-300 shadow-sm active:scale-90">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-4 px-1">
                  <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                    {title}
                  </h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1">
                      <span className="text-purple-400">📍</span> {formatRegion(region)}
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      <span>📅</span> {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center gap-0.5">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-xs font-black text-gray-700">{rating}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-rose-500">
                        <span className="text-xs">❤️</span>
                        <span className="text-xs font-black">{likes}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-purple-600 font-black px-2 py-0.5 bg-purple-50 rounded-md tracking-tighter">인기</span>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400 font-bold">
            현재 데이터가 존재하지 않습니다. 🥲
          </div>
        )}
      </div>
    </section>
  );
};

// --- 진행중인 축제 목록 ---
const OngoingFestivals = () => {
  const [ongoingList, setOngoingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOngoingFestivals = async () => {
      try {
        setIsLoading(true);
        const params = {
          ongoingOnly: true,
          page: 1,
          size: 4,
          sort: 'recentStart' 
        };
        const response = await festivalService.getFestivals(params);
        const data = Array.isArray(response) ? response : (response.list || []);
        setOngoingList(data);
      } catch (error) {
        console.error("진행 중인 축제 데이터를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOngoingFestivals();
  }, []);

  const formatRegion = (addr) => {
    if (!addr) return '지역 정보 없음';
    const parts = addr.split(' ');
    if (parts.length >= 2) {
      const doName = parts[0].substring(0, 2);
      const siName = parts[1].substring(0, 2);
      return `${doName} ${siName}`;
    }
    return parts[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const cleanStr = String(dateStr).replace(/-/g, '');
    if (cleanStr.length === 8) {
      return `${cleanStr.substring(0, 4)}.${cleanStr.substring(4, 6)}.${cleanStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-20 px-4 text-center bg-gray-50/50 rounded-[3rem] my-12">
        <div className="animate-pulse text-gray-400 font-bold">지금 열심히 축제 정보를 불러오고 있어요... 🎡</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 rounded-[3rem] my-12 text-left transition-all duration-500 hover:bg-gray-100/50 border border-gray-100/50">
      <div className="flex justify-between items-end mb-10 px-4">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">지금 진행 중인 축제</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">오늘 바로 즐길 수 있는 축제들을 확인해 보세요.</p>
        </div>
        <Link 
          to="/search" 
          state={{ ongoingOnly: true, sort: 'date' }}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-green-600 transition-all duration-300 text-sm shadow-sm active:scale-95"
        >
          전체보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {ongoingList.length > 0 ? (
          ongoingList.map((fest) => {
            const contentId = fest.contentId || fest.content_id;
            const title = fest.title;
            const region = fest.addr1;
            const startDate = fest.eventStartDate || fest.event_start_date;
            const endDate = fest.eventEndDate || fest.event_end_date;
            const image = fest.firstImage || fest.first_image;

            return (
              <Link 
                to={`/festival/${contentId}`} 
                key={contentId} 
                className="group cursor-pointer bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-4 bg-gray-100 border border-gray-50">
                  <img 
                    src={image || `https://picsum.photos/seed/${contentId}/600/600`} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg animate-pulse">
                      ● 진행중
                    </span>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h4 className="text-base font-black text-gray-900 mt-1 line-clamp-1 group-hover:text-green-600 transition-colors duration-300">
                    {title}
                  </h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      📍 {formatRegion(region)}
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      📅 {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400 font-bold">
            현재 진행 중인 축제가 없습니다. 🥲
          </div>
        )}
      </div>
    </section>
  );
};

// --- Sub-component: PopularPosts ---
const PopularPosts = () => {
  const posts = [
    { id: 1, title: '양평 딸기축제 다녀왔어요! 🍓 너무 재밌네요', author: '축제요정', date: '2시간 전', views: '1.2k', likes: 45 },
    { id: 2, title: '서울 밤거리 페스티벌 주차 꿀팁 공유합니다 (필독)', author: '베스트드라이버', date: '5시간 전', views: '2.5k', likes: 120 },
    { id: 3, title: '강릉 커피축제 웨이팅 실시간 현황 알려드려요', author: '커피러버', date: '12시간 전', views: '980', likes: 32 },
    { id: 4, title: '이번 주말에 가기 좋은 가성비 축제 추천 리스트', author: '여행박사', date: '1일 전', views: '3.1k', likes: 210 },
    { id: 5, title: '경주 벚꽃 축제 교촌마을 근처 맛집 추천', author: '미식가', date: '2일 전', views: '1.5k', likes: 88 },
  ];

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">실시간 인기 게시글</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">커뮤니티에서 지금 가장 핫한 소식들을 확인하세요.</p>
        </div>
        <button className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-sm shadow-sm active:scale-95">
          더보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {posts.map((post, index) => (
          <div key={post.id} className="flex items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-500 group cursor-pointer">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-50 rounded-2xl text-2xl font-black text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
              {index + 1}
            </div>
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm group-hover:border-purple-100 transition-all duration-500">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`}
                  alt={post.author}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold text-purple-600/70 group-hover:text-purple-600 transition-colors duration-500">{post.author}</span>
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
          <WeatherDetail />
          <ClosingSoon />
          <RandomFestival />
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