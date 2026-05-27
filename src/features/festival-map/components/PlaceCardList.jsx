import { PulseLoader } from 'react-spinners';
import useMapStore from '../../../store/useMapStore';

function PlaceCardList() {
  const { places, activeCategory, isLoading } = useMapStore();

  // 카테고리에 따른 필터링 로직
  const filteredPlaces = places.filter(place => {
    if (activeCategory === '전체') return true;
    if (activeCategory === '음식점') return place.type === 'food';
    if (activeCategory === '관광지') return place.type === 'tour';
    if (activeCategory === '축제/행사') return place.type === 'festival';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-white p-4 md:p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm md:text-base font-bold text-slate-800">
          {activeCategory} 추천 장소 <span className="text-purple-500 ml-1">{isLoading ? '...' : filteredPlaces.length}</span>
        </h3>
        <select className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-500 bg-slate-50 outline-none focus:border-purple-300">
          <option>거리순</option>
          <option>인기순</option>
        </select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x h-full">
        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <PulseLoader color="#6B46FE" size={10} />
            <p className="text-xs text-slate-400">주변 정보를 불러오는 중입니다...</p>
          </div>
        ) : filteredPlaces.length > 0 ? (
          filteredPlaces.map((place) => (
            <div key={place.id} className="min-w-[200px] md:min-w-[240px] bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow snap-start">
              <div className="relative h-28 md:h-32">
                <img src={place.img} alt={place.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-bold text-slate-700 shadow-sm">
                  {place.distance}
                </div>
              </div>
              <div className="p-3 md:p-4 flex flex-col flex-1">
                <div className="flex flex-col mb-2">
                  <span className="text-[10px] text-[#6B46FE] font-bold mb-0.5">{place.category}</span>
                  <h4 className="text-sm font-bold text-slate-800 truncate">{place.title}</h4>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-3 font-medium">
                  <span className="text-yellow-400">⭐</span>
                  <span>{place.rating}</span>
                  <span className="text-slate-300">({place.reviews})</span>
                </div>
                <div className="mt-auto">
                  <span className="inline-block px-2 py-1 bg-slate-50 text-slate-400 rounded-md text-[10px] border border-slate-100">
                    #{place.tag}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex items-center justify-center py-10 text-slate-400 text-sm">
            해당 카테고리의 장소가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}

export default PlaceCardList;