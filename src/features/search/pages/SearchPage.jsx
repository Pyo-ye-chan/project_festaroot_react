import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Star, Heart, SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [filterRegion, setFilterRegion] = useState('전체');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('최신순');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const sortOptions = ['최신순', '인기순', '조회순', '찜 많은 순'];
  const regions = ['전체', '서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종', '경북', '경남', '대구', '울산', '부산', '전북', '전남', '광주', '제주'];
  
  // Mock data for festivals
  const festivals = [
    { id: 1, name: '2026 별빛 밤거리 페스티벌', region: '서울 반포한강공원', date: '2026.05.20 - 06.15', category: '서울', rating: 4.8, likes: '1.2k', dDay: 'D-12', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: '양평 딸기 축제', region: '경기 양평', date: '2026.05.20 - 05.25', category: '경기', rating: 4.5, likes: '850', dDay: '종료임박', img: 'https://images.unsplash.com/photo-1516211697506-8360bd773497?auto=format&fit=crop&q=80&w=400' },
    { id: 3, name: '강릉 커피 축제', region: '강원 강릉', date: '2026.06.10 - 06.15', category: '강원', rating: 4.9, likes: '2.1k', dDay: 'D-25', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400' },
    { id: 4, name: '경주 벚꽃 축제', region: '경북 경주', date: '2026.04.05 - 04.10', category: '경상', rating: 4.7, likes: '3.5k', dDay: 'D-1', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400' },
    { id: 5, name: '부산 국제 영화제', region: '부산 해운대', date: '2026.10.02 - 10.11', category: '경상', rating: 4.9, likes: '5.2k', dDay: 'D-130', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400' },
    { id: 6, name: '제주 들불 축제', region: '제주 애월읍', date: '2026.03.07 - 03.10', category: '제주', rating: 4.6, likes: '1.1k', dDay: 'D-5', img: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?auto=format&fit=crop&q=80&w=400' },
  ];

  const filteredFestivals = festivals.filter(f => 
    (filterRegion === '전체' || f.category === filterRegion) &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard'] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            축제 찾기
            <span className="text-purple-600 animate-pulse">🎡</span>
          </h1>
          <p className="text-gray-500 mt-3 font-bold text-sm">다양한 축제 정보를 한눈에 확인해보세요.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Sidebar Filters - Sticky */}
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
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">축제명 또는 내용</p>
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
                  <div className="relative">
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-gray-50 border-gray-100 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-600 focus:ring-2 focus:ring-purple-600/20 border outline-none" 
                    />
                  </div>
                  <div className="flex justify-center text-gray-300 font-bold text-xs">~</div>
                  <div className="relative">
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-gray-50 border-gray-100 rounded-xl py-2.5 px-4 text-xs font-bold text-gray-600 focus:ring-2 focus:ring-purple-600/20 border outline-none" 
                    />
                  </div>
                </div>
              </div>

              {/* Custom Region Select Dropdown */}
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
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in slide-in-from-top-2 duration-200">
                      <div className="p-2 grid grid-cols-2 gap-1">
                        {regions.map(r => (
                          <button
                            key={r}
                            onClick={() => {
                              setFilterRegion(r);
                              setIsRegionOpen(false);
                            }}
                            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${filterRegion === r ? 'bg-purple-600 text-white shadow-md shadow-purple-100' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Search Button */}
              <button className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl hover:bg-purple-700 transition-all duration-300 shadow-lg shadow-purple-100 flex items-center justify-center gap-2 group active:scale-[0.98]">
                <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                검색하기
              </button>
              
              <button 
                onClick={() => {
                  setSearchQuery('');
                  setFilterRegion('전체');
                  setStartDate('');
                  setEndDate('');
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
              <div className="flex items-center gap-3">
                <p className="text-sm font-bold text-gray-500 ml-2">
                  총 <span className="text-purple-600 font-black">{filteredFestivals.length}</span>개의 결과
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-purple-600 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                  >
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
                    <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                      {sortOptions.map(option => (
                        <button 
                          key={option}
                          onClick={() => {
                            setSortBy(option);
                            setIsSortOpen(false);
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors ${sortBy === option ? 'bg-purple-50 text-purple-600' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Festival Grid/List */}
            {filteredFestivals.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredFestivals.map(fest => (
                    <Link to={`/festival/${fest.id}`} key={fest.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-500 cursor-pointer">
                      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img src={fest.img} alt={fest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-sm">{fest.dDay}</span>
                          <span className="bg-purple-600/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-white shadow-sm">{fest.category}</span>
                        </div>
                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-all duration-300 shadow-sm active:scale-90 group-hover:bg-white group-hover:text-rose-500">
                          <Heart className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="p-6">
                        <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">{fest.name}</h4>
                        <div className="mt-4 space-y-2">
                          <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-purple-400" /> {fest.region}
                          </p>
                          <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-gray-400" /> {fest.date}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-50">
                          <div className="flex items-center gap-1.5">
                            <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                            <span className="text-xs font-black text-gray-700">{fest.rating}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-rose-500 font-black">
                            <Heart className="w-3.5 h-3.5 fill-current" />
                            <span className="text-[11px]">{fest.likes}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFestivals.map(fest => (
                    <Link to={`/festival/${fest.id}`} key={fest.id} className="group flex bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-100 transition-all duration-500 cursor-pointer">
                      <div className="w-48 h-48 shrink-0 overflow-hidden bg-gray-100">
                        <img src={fest.img} alt={fest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="flex-grow p-6 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex gap-2">
                              <span className="bg-purple-50 text-purple-600 px-2 py-1 rounded-lg text-[9px] font-black">{fest.category}</span>
                              <span className="bg-gray-50 text-gray-500 px-2 py-1 rounded-lg text-[9px] font-black">{fest.dDay}</span>
                            </div>
                            <button className="text-gray-300 hover:text-rose-500 transition-colors">
                              <Heart className="w-5 h-5" />
                            </button>
                          </div>
                          <h4 className="text-xl font-black text-gray-900 group-hover:text-purple-600 transition-colors duration-300">{fest.name}</h4>
                          <div className="mt-3 flex gap-4">
                            <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-purple-400" /> {fest.region}
                            </p>
                            <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" /> {fest.date}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                          <div className="flex gap-4">
                            <div className="flex items-center gap-1.5">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-black text-gray-700">{fest.rating}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-rose-500 font-black">
                              <Heart className="w-4 h-4 fill-current" />
                              <span className="text-xs">{fest.likes}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Search className="w-10 h-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-2">검색 결과가 없습니다.</h3>
                <p className="text-gray-400 font-bold text-sm">다른 검색어나 필터를 사용해 보세요.</p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRegion('전체');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="mt-8 px-6 py-3 bg-purple-50 text-purple-600 font-black rounded-xl hover:bg-purple-100 transition-colors text-sm"
                >
                  검색 조건 초기화하기
                </button>
              </div>
            )}

            {/* Pagination */}
            {filteredFestivals.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(page => (
                    <button 
                      key={page}
                      className={`w-10 h-10 rounded-xl font-black text-sm transition-all ${page === 1 ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-white text-gray-400 hover:bg-gray-50 border border-gray-100'}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
