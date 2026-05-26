import { RotateCcw, X } from 'lucide-react';
import useMapStore from '../../../store/useMapStore';

function SidebarFilter() {
  // Zustand store에서 상태와 액션 가져오기
  const { 
    searchParams, 
    setSelectedFestival, 
    setRadius, 
    setDates, 
    toggleCategory, 
    resetFilters 
  } = useMapStore();

  const { selectedFestival, radius, startDate, endDate, categories } = searchParams;

  const handleSearch = () => {
    alert(`검색 조건 실행!\n반경: ${radius}km\n기간: ${startDate} ~ ${endDate}\n카테고리: ${JSON.stringify(categories)}`);
  };

  return (
    <div className="flex flex-col h-full p-6 bg-slate-50 overflow-y-auto scrollbar-hide">
      {/* 타이틀 영역 */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-slate-800 mb-2">축제 기반 주변 정보</h2>
        <p className="text-sm text-slate-500 leading-tight">기준 축제를 선택하면 주변 여행 정보를 추천해드려요!</p>
      </div>

      <div className="h-[1px] bg-slate-200 mb-6" />

      {/* 1. 기준 축제 선택 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-800 mb-3">1. 기준 축제 선택</label>
        {selectedFestival ? (
          <div className="relative bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <button className="absolute top-3 right-3 p-1 hover:bg-slate-100 rounded-full transition-colors" onClick={() => setSelectedFestival(null)}>
              <X size={16} className="text-slate-400" />
            </button>
            <div className="flex gap-3 mb-3">
              <img src={selectedFestival.image} alt="축제" className="w-[70px] h-[70px] rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">{selectedFestival.name}</h4>
                <p className="text-xs text-slate-500 mb-1">{selectedFestival.period}</p>
                <p className="text-xs text-slate-400">{selectedFestival.location}</p>
              </div>
            </div>
            <button className="w-full py-2 bg-white border border-[#6B46FE] rounded-lg text-[#6B46FE] text-xs font-semibold hover:bg-purple-50 transition-colors">
              축제 상세보기
            </button>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 border border-dashed border-slate-300 rounded-xl text-sm bg-slate-100/50">
            축제를 먼저 선택해주세요.
          </div>
        )}
      </div>

      {/* 2. 추천 범위 설정 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-800 mb-3">2. 추천 범위 설정</label>
        <div className="grid grid-cols-4 gap-1.5 mb-4">
          {[0, 5, 10, 20].map((val) => (
            <button
              key={val}
              onClick={() => setRadius(val)}
              className={`py-2 text-[11px] rounded-lg transition-all ${
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
          <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-medium px-1">
            <span>0km</span>
            <span>5km</span>
            <span>10km</span>
            <span>20km</span>
          </div>
        </div>
      </div>

      {/* 3. 기간 설정 */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-800 mb-3">3. 기간 설정</label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setDates(e.target.value, endDate)} 
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-purple-200 focus:border-[#6B46FE] outline-none" 
            />
          </div>
          <span className="text-slate-400">~</span>
          <div className="flex-1">
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setDates(startDate, e.target.value)} 
              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-purple-200 focus:border-[#6B46FE] outline-none" 
            />
          </div>
        </div>
      </div>

      {/* 4. 카테고리 선택 */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-800 mb-3">
          4. 카테고리 선택 <span className="text-[10px] text-slate-400 font-normal ml-1">(복수 선택)</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {[
            { id: 'food', label: '음식점', icon: '🍽️' },
            { id: 'tour', label: '관광지', icon: '⛰️' },
            { id: 'festival', label: '축제/행사', icon: '🎉' }
          ].map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-full cursor-pointer hover:border-purple-200 transition-colors">
              <input 
                type="checkbox" 
                checked={categories[cat.id]} 
                onChange={() => toggleCategory(cat.id)} 
                className="w-4 h-4 accent-[#6B46FE] rounded border-slate-300" 
              />
              <span className="text-xs text-slate-600 font-medium">{cat.icon} {cat.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* 하단 버튼 구역 */}
      <div className="mt-auto flex flex-col gap-2">
        <button 
          onClick={handleSearch}
          className="w-full py-3.5 bg-[#6B46FE] text-white rounded-xl text-sm font-bold shadow-lg shadow-purple-100 hover:bg-[#5a3ae6] active:scale-[0.98] transition-all"
        >
          조건으로 검색하기
        </button>
        <button 
          onClick={resetFilters}
          className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-xl text-sm flex items-center justify-center gap-1.5 hover:bg-slate-50 transition-colors"
        >
          <RotateCcw size={14} /> 초기화
        </button>
      </div>

      {/* 하단 푸터 안내문구 */}
      <div className="mt-6 p-3 bg-blue-50/50 rounded-lg text-[10px] text-blue-400/80 leading-relaxed border border-blue-100/50">
        💡 한국관광공사 관광정보 API(TourAPI)를 활용하여 제공됩니다.
      </div>
    </div>
  );
}

export default SidebarFilter;