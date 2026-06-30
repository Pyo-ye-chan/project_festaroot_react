import React from 'react';
import { LayoutGrid, List, ChevronDown } from 'lucide-react';
import useFestivalFilterStore from '../../../store/useFestivalFilterStore';

const SORT_LABELS = {
  popular: '인기순',
  date: '일정순',
  views: '조회순'
};

const SearchToolbar = ({
  totalCount,
  isSortOpen,
  setIsSortOpen,
  sortOptions
}) => {
  const {
    showOngoingOnly, setShowOngoingOnly,
    sortBy, setSortBy,
    viewMode, setViewMode,
    setCurrentPage
  } = useFestivalFilterStore();

  return (
    <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 sm:flex sm:items-center sm:justify-between sm:gap-6">
      {/* 1. 결과 건수 (모바일 grid: 좌측 상단 / 데스크톱: 좌측) */}
      <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex items-center">
        <p className="text-sm font-bold text-gray-500 ml-2 whitespace-nowrap">
          총 <span className="text-[#5821B6] font-black">{totalCount}</span>개의 결과
        </p>
      </div>

      {/* 2. 진행 및 예정 축제만 보기 (모바일 grid: 하단 전체 가로폭 / 데스크톱: 결과 수 다음) */}
      <div className="col-span-2 row-start-2 row-end-3 sm:col-span-1 sm:row-auto flex items-center border-t border-gray-50 pt-3.5 sm:pt-0 sm:border-t-0 sm:border-l sm:border-gray-100 sm:pl-6">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" checked={showOngoingOnly} onChange={(e) => { setShowOngoingOnly(e.target.checked); setCurrentPage(1); }} className="sr-only" />
          <span className="text-xs font-black text-gray-600 whitespace-nowrap">진행 및 예정 축제만 보기</span>
          <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${showOngoingOnly ? 'bg-[#5821B6] text-white' : 'bg-gray-200'}`}>
            <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${showOngoingOnly ? 'translate-x-4' : 'translate-x-0'}`} />
          </div>
        </label>
      </div>

      {/* 3. 뷰모드 및 정렬 컨트롤러 (모바일 grid: 우측 상단 / 데스크톱: 우측 끝 - 중복 없음) */}
      <div className="col-start-2 col-end-3 row-start-1 row-end-2 sm:col-span-1 sm:row-auto flex items-center justify-end gap-3 shrink-0">
        <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100">
          <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'grid' ? 'bg-white text-[#5821B6] shadow-sm' : 'text-gray-400 hover:text-[#5821B6]'}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-colors duration-200 ${viewMode === 'list' ? 'bg-white text-[#5821B6] shadow-sm' : 'text-gray-400 hover:text-[#5821B6]'}`}>
            <List className="w-4 h-4" />
          </button>
        </div>

        <div className="relative">
          <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-700 font-bold rounded-xl text-xs shadow-sm transition-all active:scale-95">
            {SORT_LABELS[sortBy]} <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSortOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              {sortOptions.map(option => (
                <button
                  key={option}
                  onClick={() => { setSortBy(option); setIsSortOpen(false); setCurrentPage(1); }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold transition-colors ${sortBy === option ? 'bg-purple-50 text-[#5821B6]' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {SORT_LABELS[option]}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchToolbar;