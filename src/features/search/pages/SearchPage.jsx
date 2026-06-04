import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Calendar, MapPin, Star, Heart, SlidersHorizontal, 
  ChevronDown, LayoutGrid, List, ChevronLeft, ChevronRight, 
  ChevronsLeft, ChevronsRight, Eye 
} from 'lucide-react';
import festivalService from '../../../api/festivalService';
import RegionService from '../../../api/regionService';

// YYYYMMDD -> YYYY.MM.DD 변환기
const formatDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)}`;
};

// YYYYMMDD 기반 D-Day 및 상태 계산기
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
  const navigate = useNavigate(); //
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filterRegion, setFilterRegion] = useState({ region_code: '', region_name: '전체' });
  const [filterSigungu, setFilterSigungu] = useState({ sigungu_code: '', sigungu_name: '전체' });
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('인기순');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isSigunguOpen, setIsSigunguOpen] = useState(false);

  // 토글 스위치 상태 관리
  const [searchScope, setSearchScope] = useState('title'); 
  const [showOngoingOnly, setShowOngoingOnly] = useState(false); 

  // 페이징 처리 상태 관리
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 9; 

  // 백엔드에서 받아올 페이징 블록 정보 상태
  const [pageInfo, setPageInfo] = useState({
    startPage: 1,
    endPage: 1,
    existPrev: false,
    textNext: false,
    totalCount: 0 
  });

  // 백엔드 데이터 상태 관리
  const [festivals, setFestivals] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // 개별 축제 찜(하트) 상태 관리 (Set을 활용한 ID 관리)
  const [likedFestivals, setLikedFestivals] = useState(new Set());

  // 초기 배열을 객체 형태로 포맷팅
  const [sidoList, setSidoList] = useState([{ region_code: '', region_name: '전체' }]);
  const [sigunguList, setSigunguList] = useState([{ sigungu_code: '', sigungu_name: '전체' }]);

  const sortOptions = ['인기순', '일정순', '조회순'];

  // 총 페이지 수 계산 (전체 개수 / 페이지당 보여줄 개수)
  const totalPages = Math.ceil(pageInfo.totalCount / ITEMS_PER_PAGE) || 1;

  /* 축제 데이터 요청 함수 */
  const fetchAllFestivals = async (customParams = {}) => {
    try {
      setIsDataLoading(true);

      // 🔥 마이바티스 매퍼 조건에 맞게 파라미터 매핑 변경
      let sortParam = 'created_time';
      if (sortBy === '인기순') sortParam = 'like_count';      // 인기순 -> 좋아요순 매핑
      if (sortBy === '일정순') sortParam = 'event_start_date';
      if (sortBy === '조회순') sortParam = 'view_count';     // 조회순 -> 조회수 매핑

      const params = {
        sort: sortParam,
        keyword: searchQuery,
        searchScope: searchScope, 
        event_start_date: startDate.replace(/-/g, ''),
        event_end_date: endDate.replace(/-/g, ''),
        region_code: filterRegion.region_code,
        sigungu_code: filterSigungu.sigungu_code,
        page: currentPage,
        size: ITEMS_PER_PAGE,
        ongoingOnly: showOngoingOnly,
        ...customParams
      };

      const response = await festivalService.getFestivals(params);
      const data = response?.data || response;
      
      setFestivals(Array.isArray(data.list) ? data.list : []);
      if (data.pageInfo) {
        setPageInfo(data.pageInfo);
      }

    } catch (error) {
      console.error("축제 데이터를 가져오는데 실패했습니다.", error);
      setFestivals([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  // 🔥 축제 카드 클릭 핸들러 (조회수 업 시키고 상세페이지 이동)
  const handleFestivalClick = async (contentId) => {
    try {
      // 상세 페이지로 가기 전 백엔드에 조회수 1 증가 요청
      await festivalService.increaseViewCount(contentId);
    } catch (error) {
      console.error("조회수 업데이트에 실패했습니다.", error);
    } finally {
      // 성공 여부와 상관없이 상세 페이지 이동은 보장
      navigate(`/festival/${contentId}`);
    }
  };

  // 하트 토글 핸들러 (이벤트 버블링 차단)
  const handleLikeToggle = (e, contentId) => {
    e.preventDefault();  // 부모 클릭 이벤트 방지
    e.stopPropagation(); // 부모 div로의 이벤트 전파 방지

    setLikedFestivals((prev) => {
      const next = new Set(prev);
      if (next.has(contentId)) {
        next.delete(contentId);
      } else {
        next.add(contentId);
      }
      return next;
    });
  };

  // 컴포넌트 마운트 시 '시도 목록' 로드
  useEffect(() => {
    const fetchSidoData = async () => {
      try {
        const response = await RegionService.regionList();
        const data = response?.data || response;

        if (Array.isArray(data)) {
          setSidoList([{ region_code: '', region_name: '전체' }, ...data]);
        }
      } catch (error) {
        console.error("시도 목록을 불러오는데 실패했습니다.", error);
      }
    };
    fetchSidoData();
  }, []);

  // 선택된 시도가 변경될 때마다 '시군구 목록' 로드
  useEffect(() => {
    const fetchSigunguData = async () => {
      if (!filterRegion.region_code) {
        setSigunguList([{ sigungu_code: '', sigungu_name: '전체' }]);
        setFilterSigungu({ sigungu_code: '', sigungu_name: '전체' });
        return;
      }

      try {
        const response = await RegionService.sigunguList(filterRegion.region_code);
        const data = response?.data || response;
        if (Array.isArray(data)) {
          setSigunguList([{ sigungu_code: '', sigungu_name: '전체' }, ...data]);
        } else {
          setSigunguList([{ sigungu_code: '', sigungu_name: '전체' }]);
        }
      } catch (error) {
        console.error("시군구 목록을 불러오는데 실패했습니다.", error);
        setSigunguList([{ sigungu_code: '', sigungu_name: '전체' }]);
      }
      setFilterSigungu({ sigungu_code: '', sigungu_name: '전체' });
    };

    fetchSigunguData();
    setCurrentPage(1); 
  }, [filterRegion]);

  // 통합 데이터 요청 Effect
  useEffect(() => {
    fetchAllFestivals();
  }, [sortBy, currentPage, showOngoingOnly]);

  // 검색 조건 초기화 함수
  const handleReset = () => {
    setSearchQuery('');
    setFilterRegion({ region_code: '', region_name: '전체' });
    setFilterSigungu({ sigungu_code: '', sigungu_name: '전체' });
    setStartDate('');
    setEndDate('');
    setSortBy('인기순');
    setSearchScope('title'); 
    setShowOngoingOnly(false);
    setCurrentPage(1);

    fetchAllFestivals({
      keyword: '',
      searchScope: 'title',
      region_code: '',
      sigungu_code: '',
      event_start_date: '',
      event_end_date: '',
      page: 1,
      ongoingOnly: false
    });
  };

  const handleSearchSubmit = () => {
    setCurrentPage(1);
    fetchAllFestivals({ page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard'] pb-20">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-100 pt-7 pb-7">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            축제 찾기
            <span className="text-[#FFD23F] animate-pulse">🎡</span>
          </h1>
          <p className="text-gray-500 mt-3 font-bold text-sm">진행 중이거나 예정된 축제 정보를 실시간으로 확인해보세요.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Sidebar Filters */}
          <aside className="w-full lg:w-80 space-y-8 shrink-0 lg:sticky lg:top-44 z-30">
            <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
                  <SlidersHorizontal className="w-4 h-4 text-[#5821B6]" />
                  상세 검색 필터
                </h3>
              </div>

              {/* Keyword Search */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-0.5">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">축제명</p>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-gray-400">소개글 포함</span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchScope(prev => prev === 'title' ? 'all' : 'title');
                        setCurrentPage(1);
                      }}
                      className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${searchScope === 'all' ? 'bg-[#5821B6]' : 'bg-gray-200'}`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${searchScope === 'all' ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#5821B6]/20 transition-all border"
                  />
                </div>
              </div>

              {/* Date Filter */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">기간 설정</p>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-2 px-3 text-[11px] font-bold text-gray-600 border outline-none focus:border-[#5821B6]/40"
                  />
                  <span className="text-gray-300 font-bold text-xs">~</span>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-gray-50 border-gray-100 rounded-xl py-2 px-3 text-[11px] font-bold text-gray-600 border outline-none focus:border-[#5821B6]/40"
                  />
                </div>
              </div>

              {/* Region (시도) Select */}
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">지역 선택 (시/도)</p>
                <div className="relative">
                  <button
                    onClick={() => setIsRegionOpen(!isRegionOpen)}
                    className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all outline-none"
                  >
                    <span>{filterRegion.region_name}</span>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isRegionOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isRegionOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto grid grid-cols-2 gap-1 p-2">
                      {sidoList.map(r => (
                        <button
                          key={r.region_code || 'all'}
                          onClick={() => {
                            setFilterRegion(r);
                            setIsRegionOpen(false);
                          }}
                          className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${filterRegion.region_code === r.region_code ? 'bg-[#5821B6] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                          {r.region_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sigungu (시군구) Select */}
              {filterRegion.region_code && (
                <div className="space-y-3 pt-4 border-t border-gray-50">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">상세 지역 선택 (시/군/구)</p>
                  <div className="relative">
                    <button
                      onClick={() => setIsSigunguOpen(!isSigunguOpen)}
                      className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all outline-none"
                    >
                      <span>{filterSigungu.sigungu_name}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSigunguOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {isSigunguOpen && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 max-h-60 overflow-y-auto grid grid-cols-2 gap-1 p-2">
                        {sigunguList.map(s => (
                          <button
                            key={s.sigungu_code || 'all'}
                            onClick={() => {
                              setFilterSigungu(s);
                              setIsSigunguOpen(false);
                              setCurrentPage(1);
                            }}
                            className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${filterSigungu.sigungu_code === s.sigungu_code ? 'bg-[#5821B6] text-white shadow-md' : 'text-gray-600 hover:bg-gray-50'}`}
                          >
                            {s.sigungu_name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={handleSearchSubmit}
                className="w-full bg-[#5821B6] text-white font-black py-4 rounded-2xl hover:bg-[#451793] transition-all shadow-lg shadow-purple-900/10 flex items-center justify-center gap-2 group active:scale-[0.98]"
              >
                <Search className="w-4 h-4" />
                검색하기
              </button>

              <button
                onClick={handleReset}
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
              <div className="flex items-center gap-6">
                <p className="text-sm font-bold text-gray-500 ml-2">
                  총 <span className="text-[#5821B6] font-black">{pageInfo.totalCount}</span>개의 결과
                </p>
                
                <label className="flex items-center gap-3 cursor-pointer select-none border-l border-gray-100 pl-6">
                  <input
                    type="checkbox"
                    checked={showOngoingOnly}
                    onChange={(e) => {
                      setShowOngoingOnly(e.target.checked);
                      setCurrentPage(1); 
                    }}
                    className="sr-only"
                  />
                  <span className="text-xs font-black text-gray-600">진행 및 예정 축제만 보기</span>
                  <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${showOngoingOnly ? 'bg-[#5821B6]' : 'bg-gray-200'}`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${showOngoingOnly ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </label>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-white text-[#5821B6] shadow-sm' : 'text-gray-400'}`}>
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-white text-[#5821B6] shadow-sm' : 'text-gray-400'}`}>
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
                            setCurrentPage(1); 
                          }}
                          className={`w-full px-4 py-2.5 text-left text-xs font-bold ${sortBy === option ? 'bg-purple-50 text-[#5821B6]' : 'text-gray-600 hover:bg-gray-50'}`}
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
                <div className="w-10 h-10 border-4 border-[#5821B6] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : festivals.length > 0 ? ( 
              <>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {festivals.map(fest => ( 
                      // 🔥 Link 태그를 div onClick 구조로 변경
                      <div 
                        onClick={() => handleFestivalClick(fest.content_id)} 
                        key={fest.content_id} 
                        className="cursor-pointer group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                          <img src={fest.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400'} alt={fest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          <div className="absolute top-4 left-4 flex gap-2">
                            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm ${getDDay(fest.event_start_date, fest.event_end_date) === '진행중' ? 'bg-green-500 text-white' : 'bg-white text-gray-900'}`}>
                              {getDDay(fest.event_start_date, fest.event_end_date)}
                            </span>
                          </div>
                          
                          {/* Grid 찜 버튼 */}
                          <button 
                            onClick={(e) => handleLikeToggle(e, fest.content_id)}
                            className={`absolute top-4 right-4 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-all duration-300 ease-in-out active:scale-95 ${
                              likedFestivals.has(fest.content_id) 
                                ? 'bg-rose-50/90 text-rose-500 shadow-sm' 
                                : 'bg-white/90 text-gray-400 hover:text-rose-500'
                            }`}
                          >
                            <Heart className={`w-4 h-4 transition-all duration-300 ease-in-out ${
                              likedFestivals.has(fest.content_id) ? 'fill-rose-500 scale-110' : 'fill-transparent'
                            }`} />
                          </button>
                        </div>
                        <div className="p-6">
                          <h4 className="text-lg font-black text-gray-900 group-hover:text-[#5821B6] transition-colors line-clamp-1">{fest.title}</h4>
                          <div className="mt-4 space-y-2">
                            <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-purple-400" /> {fest.addr1 || '상세 주소 정보 없음'}
                            </p>
                            <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatDate(fest.event_start_date)} ~ {formatDate(fest.event_end_date)}
                            </p>
                          </div>
                          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-50">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1.5">
                                <Star className="w-3.5 h-3.5 text-[#FFD23F] fill-current" />
                                <span className="text-xs font-black text-gray-700">{fest.rating_avg ? fest.rating_avg.toFixed(1) : '0.0'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-400">
                                <Eye className="w-3.5 h-3.5" />
                                <span className="text-[11px] font-black text-gray-600">{fest.view_count || 0}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-rose-500 font-black">
                              <Heart className="w-3.5 h-3.5 fill-current" />
                              <span className="text-[11px]">{fest.like_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {festivals.map(fest => ( 
                      // 🔥 Link 태그를 div onClick 구조로 변경
                      <div 
                        onClick={() => handleFestivalClick(fest.content_id)} 
                        key={fest.content_id} 
                        className="cursor-pointer group flex bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500"
                      >
                        <div className="w-48 h-48 shrink-0 overflow-hidden bg-gray-100">
                          <img src={fest.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400'} alt={fest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                        <div className="flex-grow p-6 flex flex-col justify-between">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${getDDay(fest.event_start_date, fest.event_end_date) === '진행중' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-500'}`}>
                                  {getDDay(fest.event_start_date, fest.event_end_date)}
                                </span>
                              </div>
                              
                              {/* List 찜 버튼 */}
                              <button 
                                onClick={(e) => handleLikeToggle(e, fest.content_id)}
                                className={`transition-all duration-300 ease-in-out active:scale-95 ${
                                  likedFestivals.has(fest.content_id) ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'
                                }`}
                              >
                                <Heart className={`w-5 h-5 transition-all duration-300 ease-in-out ${
                                  likedFestivals.has(fest.content_id) ? 'fill-rose-500 scale-110' : 'fill-transparent'
                                }`} />
                              </button>
                            </div>
                            <h4 className="text-xl font-black text-gray-900 group-hover:text-[#5821B6] transition-colors">{fest.title}</h4>
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
                                <Star className="w-4 h-4 text-[#FFD23F] fill-current" />
                                <span className="text-sm font-black text-gray-700">{fest.rating_avg ? fest.rating_avg.toFixed(1) : '0.0'}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-gray-500">
                                <Eye className="w-4 h-4" />
                                <span className="text-sm font-black">{fest.view_count || 0}</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-rose-500 font-black">
                                <Heart className="w-4 h-4 fill-current" />
                                <span className="text-xs">{fest.like_count || 0}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* 페이지네이션 블록 UI */}
                <div className="flex items-center justify-center gap-2 mt-12 select-none">
                  {currentPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(1)}
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                      title="맨 처음 페이지로"
                    >
                      <ChevronsLeft className="w-4 h-4" />
                    </button>
                  )}

                  {pageInfo.startPage > 1 && (
                    <button
                      onClick={() => setCurrentPage(pageInfo.startPage - 1)}
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                      title="이전 블록으로"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  {Array.from(
                    { length: pageInfo.endPage - pageInfo.startPage + 1 }, 
                    (_, i) => pageInfo.startPage + i
                  ).map(pageNumber => (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${
                        currentPage === pageNumber
                          ? 'bg-[#5821B6] text-white shadow-md shadow-purple-900/20'
                          : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}

                  {pageInfo.endPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(pageInfo.endPage + 1)}
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                      title="다음 블록으로"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {currentPage < totalPages && (
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all active:scale-95"
                      title="맨 마지막 페이지로"
                    >
                      <ChevronsRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </>
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