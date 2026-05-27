import React, { useState } from 'react';
import { RotateCcw, X, Search } from 'lucide-react';
import useMapStore from '../../../store/useMapStore';
import FestivalSearchModal from './FestivalSearchModal';

function SidebarFilter() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Zustand store에서 상태와 액션 가져오기
  const { 
    searchParams, 
    setSelectedFestival, 
    setRadius, 
    toggleCategory, 
    resetFilters,
    fetchNearbyPlaces
  } = useMapStore();

  const { selectedFestival, radius, categories } = searchParams;

  const handleSearch = () => {
    if (!selectedFestival) {
      alert('기준 축제를 먼저 선택해주세요!');
      return;
    }
    fetchNearbyPlaces();
  };

  return (
    <div className="flex flex-col h-full px-6 py-12 bg-slate-50 overflow-y-auto scrollbar-hide">
      {/* 타이틀 영역 */}
      <div className="mb-12">
        <h2 className="text-xl font-bold text-slate-800 mb-2">축제 기반 주변 정보</h2>
        <p className="text-[13px] text-slate-500 leading-tight">기준 축제를 선택하면 주변 여행 정보를 추천해드려요!</p>
      </div>

      <div className="h-[1px] bg-slate-200 mb-12" />

      {/* 1. 기준 축제 선택 */}
      <div className="mb-12">
        <label className="block text-[13px] font-semibold text-slate-800 mb-5">1. 기준 축제 선택</label>
        {selectedFestival ? (
          <div className="relative bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:border-[#6B46FE]/30 transition-colors group">
            <button className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-full transition-colors z-10" onClick={(e) => {
              e.stopPropagation();
              setSelectedFestival(null);
            }}>
              <X size={16} className="text-slate-400" />
            </button>
            <div className="flex gap-4 mb-4 cursor-pointer" onClick={() => setIsModalOpen(true)}>
              <img src={selectedFestival.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300&q=80'} alt="축제" className="w-[70px] h-[70px] rounded-xl object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate group-hover:text-[#6B46FE] transition-colors">{selectedFestival.title}</h4>
                <p className="text-[12px] text-slate-500 mb-1">{selectedFestival.event_start_date} ~ {selectedFestival.event_end_date}</p>
                <p className="text-[12px] text-slate-400">{selectedFestival.addr1}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-white border border-[#6B46FE] rounded-xl text-[#6B46FE] text-[12px] font-semibold hover:bg-purple-50 transition-colors">
                축제 상세보기
              </button>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-2 bg-slate-50 text-slate-500 rounded-xl text-[12px] font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1"
              >
                <Search size={14} /> 변경
              </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => setIsModalOpen(true)}
            className="py-10 text-center text-slate-400 border border-dashed border-slate-300 rounded-2xl text-[13px] bg-slate-100/50 cursor-pointer hover:bg-slate-100 transition-colors flex flex-col items-center gap-2"
          >
            <Search size={24} className="text-slate-300" />
            축제를 선택하려면 클릭하세요.
          </div>
        )}
      </div>

      {/* Festival Selection Modal */}
      <FestivalSearchModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSelect={setSelectedFestival}
      />

      {/* 2. 추천 범위 설정 */}
      <div className="mb-12">
        <label className="block text-[13px] font-semibold text-slate-800 mb-5">2. 추천 범위 설정</label>
        <div className="grid grid-cols-4 gap-1.5 mb-6">
          {[0, 5, 10, 20].map((val) => (
            <button
              key={val}
              onClick={() => setRadius(val)}
              className={`py-2 text-[11px] rounded-xl transition-all ${
                radius === val 
                  ? "bg-[#6B46FE] text-white font-bold shadow-md shadow-purple-100" 
                  : "bg-white border border-slate-200 text-slate-500 hover:border-purple-200"
              }`}
            >
              {val === 0 ? "내 주변" : `${val}km`}
            </button>
          ))}
        </div>
        <div className="px-1">
          <input 
            type="range" 
            min="0" 
            max="20" 
            value={radius} 
            onChange={(e) => setRadius(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6B46FE]" 
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-3 font-medium px-1">
            <span>0km</span>
            <span>5km</span>
            <span>10km</span>
            <span>20km</span>
          </div>
        </div>
      </div>

      {/* 3. 카테고리 선택 */}
      <div className="mb-12">
        <label className="block text-[13px] font-semibold text-slate-800 mb-5">
          3. 카테고리 선택 <span className="text-[11px] text-slate-400 font-normal ml-1">(복수 선택)</span>
        </label>
        <div className="flex flex-wrap gap-2.5">
          {[
            { id: 'food', label: '음식점', icon: '🍽️' },
            { id: 'tour', label: '관광지', icon: '⛰️' },
            { id: 'festival', label: '축제/행사', icon: '🎉' }
          ].map((cat) => (
            <label key={cat.id} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-purple-200 transition-colors">
              <input 
                type="checkbox" 
                checked={categories[cat.id]} 
                onChange={() => toggleCategory(cat.id)} 
                className="w-3.5 h-3.5 accent-[#6B46FE] rounded border-slate-300" 
              />
              <span className="text-[12px] text-slate-600 font-medium">{cat.icon} {cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 하단 버튼 구역 */}
      <div className="mt-auto flex flex-col gap-2.5">
        <button 
          onClick={handleSearch}
          className="w-full py-3.5 bg-[#6B46FE] text-white rounded-2xl text-[14px] font-bold shadow-lg shadow-purple-100 hover:bg-[#5a3ae6] active:scale-[0.98] transition-all"
        >
          조건으로 검색하기
        </button>
        <button 
          onClick={resetFilters}
          className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-2xl text-[13px] flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw size={14} /> 초기화
        </button>
      </div>

      {/* 하단 푸터 안내문구 */}
      <div className="mt-10 p-4 bg-blue-50/50 rounded-xl text-[11px] text-blue-400/80 leading-relaxed border border-blue-100/50">
        💡 한국관광공사 관광정보 API(TourAPI)를 활용하여 제공됩니다.
      </div>
    </div>
  );
}

export default SidebarFilter;