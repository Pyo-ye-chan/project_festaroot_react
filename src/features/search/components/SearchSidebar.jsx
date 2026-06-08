import React from 'react';
import { SlidersHorizontal, ChevronDown, Search } from 'lucide-react';
import useFestivalFilterStore from '../../../store/useFestivalFilterStore';

const SearchSidebar = ({
  sidoList,
  sigunguList,
  isRegionOpen,
  setIsRegionOpen,
  isSigunguOpen,
  setIsSigunguOpen,
  handleSearchSubmit,
  handleResetClick
}) => {
  const {
    searchQuery, setSearchQuery,
    searchScope, setSearchScope,
    filterRegion, setFilterRegion,
    filterSigungu, setFilterSigungu,
    startDate, setStartDate,
    endDate, setEndDate,
    setCurrentPage
  } = useFestivalFilterStore();

  return (
    <aside className="w-full lg:w-80 space-y-8 shrink-0 lg:sticky lg:top-44 z-30">
      <div className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-50 pb-2">
          <h3 className="font-black text-gray-900 flex items-center gap-2 text-sm">
            <SlidersHorizontal className="w-4 h-4 text-[#5821B6]" /> 상세 검색 필터
          </h3>
        </div>

        {/* 검색어 필터 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-0.5">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">축제명</p>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400">소개글 포함</span>
              <button
                type="button"
                onClick={() => {
                  setSearchScope(searchScope === 'title' ? 'all' : 'title');
                  setCurrentPage(1);
                }}
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 focus:outline-none ${searchScope === 'all' ? 'bg-[#5821B6] text-white' : 'bg-gray-200'}`}
              >
                <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${searchScope === 'all' ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearchSubmit()}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 px-4 text-sm font-medium focus:ring-2 focus:ring-[#5821B6]/20 transition-all"
          />
        </div>

        {/* 기간 설정 필터 */}
        <div className="space-y-3 pt-4 border-t border-gray-50">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider">기간 설정</p>
          <div className="flex items-center gap-2">
            <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); }} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-[11px] font-bold text-gray-600 outline-none focus:border-[#5821B6]/40" />
            <span className="text-gray-300 font-bold text-xs">~</span>
            <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); }} className="w-full bg-gray-50 border border-gray-100 rounded-xl py-2 px-3 text-[11px] font-bold text-gray-600 outline-none focus:border-[#5821B6]/40" />
          </div>
        </div>

        {/* 시도 선택 */}
        <div className="space-y-3 pt-4 border-t border-gray-50">
          <p className="text-xs font-black text-gray-400 uppercase tracking-wider">지역 선택 (시/도)</p>
          <div className="relative">
            <button onClick={() => setIsRegionOpen(!isRegionOpen)} className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all outline-none">
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
                      setFilterSigungu({ sigungu_code: '', sigungu_name: '전체' });
                      setIsRegionOpen(false);
                    }}
                    className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${filterRegion.region_code === r.region_code ? 'bg-[#5821B6] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {r.region_name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 시군구 선택 */}
        {filterRegion.region_code && (
          <div className="space-y-3 pt-4 border-t border-gray-50">
            <p className="text-xs font-black text-gray-400 uppercase tracking-wider">상세 지역 선택 (시/군/구)</p>
            <div className="relative">
              <button onClick={() => setIsSigunguOpen(!isSigunguOpen)} className="w-full flex items-center justify-between bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-sm font-bold text-gray-700 hover:bg-gray-100 transition-all outline-none">
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
                      }}
                      className={`px-3 py-2 text-xs font-bold rounded-xl transition-all ${filterSigungu.sigungu_code === s.sigungu_code ? 'bg-[#5821B6] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      {s.sigungu_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        <div className="pt-2 space-y-3">
          <button onClick={handleSearchSubmit} className="w-full bg-[#5821B6] text-white font-black py-4 rounded-2xl hover:bg-[#451793] transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]">
            <Search className="w-4 h-4" /> 검색하기
          </button>
          <button onClick={handleResetClick} className="w-full text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">
            검색 조건 초기화
          </button>
        </div>
      </div>
    </aside>
  );
};

export default SearchSidebar;