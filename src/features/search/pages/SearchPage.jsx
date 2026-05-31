import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Star, Heart, SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';
import festivalService from '../../../api/festivalService';

// 🛠️ YYYYMMDD -> YYYY.MM.DD 변환기
const formatDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)}`;
};

// 🛠️ YYYYMMDD 기반 D-Day 및 상태 계산기
const getDDay = (startDateStr, endDateStr) => {
  if (!startDateStr) return '진행중';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(
    startDateStr.substring(0, 4),
    parseInt(startDateStr.substring(4, 6)) - 1,
    startDateStr.substring(6, 8)
  );
  
  const end = new Date(
    endDateStr.substring(0, 4),
    parseInt(endDateStr.substring(4, 6)) - 1,
    endDateStr.substring(6, 8)
  );

  if (today > end) return '종료';
  if (today >= start && today <= end) return '진행중';
  
  const diffTime = start - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return `D-${diffDays}`;
};

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterRegion, setFilterRegion] = useState('전체');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('인기순'); 
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  // 백엔드 데이터 상태 관리
  const [festivals, setFestivals] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const sortOptions = ['인기순', '최신순', '조회순', '찜 많은 순'];
  const regions = ['전체', '서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종', '경북', '경남', '대구', '울산', '부산', '전북', '전남', '광주', '제주'];

  // 정렬 기준 바뀔 때마다 백엔드 호출
  useEffect(() => {
    const fetchAllFestivals = async () => {
      try {
        setIsDataLoading(true);
        
        let sortParam = 'like_count';
        if (sortBy === '최신순') sortParam = 'event_start_date';
        if (sortBy === '조회순') sortParam = 'view_count';
        if (sortBy === '찜 많은 순') sortParam = 'like_count';

        const response = await festivalService.getFestivals({ sort: sortParam });
        const data = response?.data || response;
        setFestivals(Array.isArray(data) ? data : []);
        
      } catch (error) {
        console.error("축제 데이터를 가져오는데 실패했습니다.", error);
        setFestivals([]);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAllFestivals();
  }, [sortBy]);

  // 프론트엔드 실시간 필터링 시스템 (종료된 축제 차단 포함)
  const filteredFestivals = festivals.filter(fest => {
    if (!fest.event_start_date || !fest.event_end_date) return false;

    // 기준 오늘 날짜 생성
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 축제 종료일 구하기
    const endDateObj = new Date(
      fest.event_end_date.substring(0, 4),
      parseInt(fest.event_end_date.substring(4, 6)) - 1,
      fest.event_end_date.substring(6, 8)
    );

    // 🔥 [핵심 추가] 오늘 날짜가 종료일보다 늦다면 리스트에서 제외 (종료된 축제 차단)
    if (today > endDateObj) return false;

    // 2. 지역 필터링 (addr1 기준)
    const matchesRegion = filterRegion === '전체' || (fest.addr1 && fest.addr1.includes(filterRegion));
    
    // 3. 검색어 필터링 (title 기준)
    const matchesSearch = !searchQuery || (fest.title && fest.title.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // 4. 기간 수동 필터링
    const pureStart = startDate.replace(/-/g, ''); 
    const pureEnd = endDate.replace(/-/g, '');
    const matchesDate = (!pureStart || fest.event_start_date >= pureStart) && 
                        (!pureEnd || fest.event_end_date <= pureEnd);

    return matchesRegion && matchesSearch && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard'] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            축제 찾기
            <span className="text-purple-600 animate-pulse">🎡</span>
          </h1>
          <p className="text-gray-500 mt-3 font-bold text-sm">진행 중이거나 예정된 축제 정보를 실시간으로 확인해보세요.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 space-y-8 shrink-0 lg:sticky lg:top-24">
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                  상세 검색 필터
                </h3>
              </div>

              {/* Keyword Search */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">축제명</p>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="검색어를 입력하세요..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-purple-600/20 transition-all border" 
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">기간 설정</p>
                <div className="space-y-2">
                  <input 
                    type="date" 
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-600 border outline-none" 
                  />
                  <div className="flex justify-center text-gray-300 font-bold text-xs">~</div>
                  <input 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-600 border outline-none" 
                  />
                </div>
              </div>

              {/* Region Select */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">지역 선택</p>
                <div className="relative">
                  <button 
                    onClick={() => setIsRegionOpen(!isRegionOpen)}
                    className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all outline-none"
                  >
                    <span>{filterRegion}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isRegionOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isRegionOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto grid grid-cols-2 gap-1 p-2">
                      {regions.map(r => (
                        <button
                          key={r}
                          onClick={() => {
                            setFilterRegion(r);
                            setIsRegionOpen(false);
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${filterRegion === r ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl hover:bg-purple-700 transition-all shadow-lg flex items-center justify-center gap-2 group active:scale-[0.98]">
                <Search className="w-4 h-4" />
                검색하기
              </button>
              
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilterRegion('전체');
                  setStartDate('');
                  setEndDate('');
                  setSortBy('인기순');
                }}
                className="w-full py-3 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
              >
                검색 조건 초기화
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow min-w-0">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <p className="text-sm font-bold text-gray-500 ml-2">
                  총 <span className="text-purple-600 font-black">{filteredFestivals.length}</span>개의 결과
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400'}`}>
                    <List className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Sort Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsSortOpen(!isSortOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-xs shadow-sm"
                  >
                    {sortBy}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isSortOpen && (
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
                      {sortOptions.map(option => (
                        <button 
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setIsSortOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-bold ${sortBy === option ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Display */}
            {isDataLoading ? (
              <div className="flex justify-center items-center py-40">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : filteredFestivals.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFestivals.map(fest => (
                    <Link to={`/festival/${fest.content_id}`} key={fest.content_id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img src={fest.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400'} alt={fest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          {/* 실시간 상태값 바인딩 (진행중 혹은 D-Day 출력) */}
                          <span className={`px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm ${getDDay(fest.event_start_date, fest.event_end_date) === '진행중' ? 'bg-purple-600 text-white' : 'bg-white text-gray-900'}`}>
                            {getDDay(fest.event_start_date, fest.event_end_date)}
                          </span>
                        </div>
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-black text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">{fest.title}</h4>
                        <div className="mt-4 space-y-2">
                          <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-purple-400" /> {fest.addr1 || '상세 주소 정보 없음'}
                          </p>
                          <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatDate(fest.event_start_date)} ~ {formatDate(fest.event_end_date)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-50">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                            <span className="text-xs font-black text-gray-700">{fest.rating_avg ? fest.rating_avg.toFixed(1) : '0.0'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-rose-500 font-black">
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[11px]">{fest.like_count || 0}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFestivals.map(fest => (
                    <Link to={`/festival/${fest.content_id}`} key={fest.content_id} className="group flex bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
                      <div className="w-48 h-48 shrink-0 overflow-hidden bg-gray-100">
                        <img src={fest.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400'} alt={fest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-grow p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-2">
                              <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${getDDay(fest.event_start_date, fest.event_end_date) === '진행중' ? 'bg-purple-50 text-purple-600' : 'bg-gray-50 text-gray-500'}`}>
                                {getDDay(fest.event_start_date, fest.event_end_date)}
                              </span>
                            </div>
                            <button className="text-gray-300 hover:text-rose-500"><Heart className="w-5 h-5" /></button>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors">{fest.title}</h4>
                          <div className="mt-3 flex gap-4">
                            <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-purple-400" /> {fest.addr1}
                            </p>
                            <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatDate(fest.event_start_date)} ~ {formatDate(fest.event_end_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-black text-gray-700">{fest.rating_avg ? fest.rating_avg.toFixed(1) : '0.0'}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-rose-500 font-black">
                              <Heart className="w-4 h-4 fill-current" />
                              <span className="text-xs">{fest.like_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">현재 만나볼 수 있는 축제가 없습니다.</h3>
                <p className="text-gray-400 font-bold text-sm">다른 지역이나 키워드를 검색해 보세요.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;