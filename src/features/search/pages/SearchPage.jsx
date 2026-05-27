import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Star, Heart, SlidersHorizontal, ChevronDown, LayoutGrid, List } from 'lucide-react';

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('전체');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const categories = ['전체', '서울', '경기', '강원', '충청', '경상', '전라', '제주'];
  
  // Mock data for festivals
  const festivals = [
    { id: 1, name: '2026 별빛 밤거리 페스티벌', region: '서울 반포한강공원', date: '2026.05.20 - 06.15', category: '서울', rating: 4.8, likes: '1.2k', dDay: 'D-12', img: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400', tags: ['#야경', '#한강', '#푸드트럭'] },
    { id: 2, name: '양평 딸기 축제', region: '경기 양평', date: '2026.05.20 - 05.25', category: '경기', rating: 4.5, likes: '850', dDay: '종료임박', img: 'https://images.unsplash.com/photo-1516211697506-8360bd773497?auto=format&fit=crop&q=80&w=400', tags: ['#체험', '#가족', '#디저트'] },
    { id: 3, name: '강릉 커피 축제', region: '강원 강릉', date: '2026.06.10 - 06.15', category: '강원', rating: 4.9, likes: '2.1k', dDay: 'D-25', img: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&q=80&w=400', tags: ['#바다', '#커피', '#힐링'] },
    { id: 4, name: '경주 벚꽃 축제', region: '경북 경주', date: '2026.04.05 - 04.10', category: '경상', rating: 4.7, likes: '3.5k', dDay: 'D-1', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=400', tags: ['#꽃구경', '#전통', '#인생샷'] },
    { id: 5, name: '부산 국제 영화제', region: '부산 해운대', date: '2026.10.02 - 10.11', category: '경상', rating: 4.9, likes: '5.2k', dDay: 'D-130', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400', tags: ['#영화', '#레드카펫', '#해운대'] },
    { id: 6, name: '제주 들불 축제', region: '제주 애월읍', date: '2026.03.07 - 03.10', category: '제주', rating: 4.6, likes: '1.1k', dDay: 'D-5', img: 'https://images.unsplash.com/photo-1503756234508-e32369269deb?auto=format&fit=crop&q=80&w=400', tags: ['#불꽃', '#민속', '#오름'] },
  ];

  const filteredFestivals = festivals.filter(f => 
    (activeTab === '전체' || f.category === activeTab) &&
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard'] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-2">
                축제 찾기
                <span className="text-purple-600 text-xl animate-bounce">✨</span>
              </h1>
              <p className="text-gray-500 mt-2 font-bold text-sm">원하시는 지역이나 축제 이름을 검색해보세요.</p>
            </div>
            
            <div className="relative group max-w-md w-full">
              <input 
                type="text" 
                placeholder="축제 이름, 지역, 키워드 검색..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-purple-600/20 transition-all shadow-sm group-hover:bg-white border border-transparent group-hover:border-purple-100" 
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 w-5 h-5 transition-colors" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 space-y-8 shrink-0">
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-purple-600" />
                  상세 필터
                </h3>
                <button className="text-[10px] font-bold text-gray-400 hover:text-purple-600 transition-colors uppercase tracking-widest">초기화</button>
              </div>

              {/* Status Filter */}
              <div className="space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">진행 상태</p>
                {['전체', '진행 중', '진행 예정', '종료'].map(status => (
                  <label key={status} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-600/20 transition-all cursor-pointer" />
                    <span className="text-sm font-bold text-gray-600 group-hover:text-purple-600 transition-colors">{status}</span>
                  </label>
                ))}
              </div>

              {/* Region Filter (Simplified for sidebar) */}
              <div className="pt-4 border-t border-gray-50 space-y-3">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider mb-4">인기 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {['#꽃축제', '#야경', '#가족', '#데이트', '#먹거리', '#전통', '#음악'].map(tag => (
                    <button key={tag} className="px-3 py-1.5 bg-gray-50 text-[10px] font-bold text-gray-500 rounded-full hover:bg-purple-50 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100">
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Banner or Promotion */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 p-8 rounded-[2rem] shadow-lg shadow-purple-100 relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                <span className="text-[10px] font-black text-purple-200 uppercase tracking-widest">Premium Pick</span>
                <h4 className="text-white font-black text-lg mt-2 leading-tight">축제 인생샷 <br/>찍는 꿀팁 📸</h4>
                <p className="text-purple-100 text-[10px] mt-4 font-bold opacity-80">에디터가 알려주는 비법 공개</p>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-grow min-w-0">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setActiveTab(cat)}
                    className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === cat ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-3">
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
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all text-xs shadow-sm">
                  최신순
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Search Results Summary */}
            <div className="mb-6 px-1">
              <p className="text-sm font-bold text-gray-500">
                총 <span className="text-purple-600 font-black">{filteredFestivals.length}</span>개의 축제가 검색되었습니다.
              </p>
            </div>

            {/* Festival Grid/List */}
            {viewMode === 'grid' ? (
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
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {fest.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-bold text-purple-400 px-2 py-0.5 bg-purple-50 rounded-md">{tag}</span>
                        ))}
                      </div>
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
                        <div className="flex gap-1.5">
                          {fest.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold text-gray-400">#{tag.replace('#','')}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
