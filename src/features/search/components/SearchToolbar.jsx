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
    <div className="flex items-center justify-between mb-8 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center gap-6">
        <p className="text-sm font-bold text-gray-500 ml-2">
          총 <span className="text-[#5821B6] font-black">{totalCount}</span>개의 결과
        </p>
        <label className="flex items-center gap-3 cursor-pointer select-none border-l border-gray-100 pl-6">
          <input type="checkbox" checked={showOngoingOnly} onChange={(e) => { setShowOngoingOnly(e.target.checked); setCurrentPage(1); }} className="sr-only" />
          <span className="text-xs font-black text-gray-600">진행 및 예정 축제만 보기</span>
          <div className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors duration-300 ${showOngoingOnly ? 'bg-[#5821B6] text-white' : 'bg-gray-200'}`}>
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

        {/* 정렬 드롭다운 */}
        <div className="relative">
          <button onClick={() => setIsSortOpen(!isSortOpen)} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 text-gray-700 font-bold rounded-xl text-xs shadow-sm">
            {SORT_LABELS[sortBy]} <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>
          {isSortOpen && (
            <div className="absolute top-full right-0 mt-2 w-32 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden">
              {sortOptions.map(option => (
                <button
                  key={option}
                  onClick={() => { setSortBy(option); setIsSortOpen(false); setCurrentPage(1); }}
                  className={`w-full px-4 py-2.5 text-left text-xs font-bold ${sortBy === option ? 'bg-purple-50 text-[#5821B6]' : 'text-gray-600 hover:bg-gray-50'}`}
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