function PlaceCardList() {
  const mockPlaces = [
    { id: 1, title: "태안 회센터", category: "한식·해산물", rating: 4.6, reviews: 125, distance: "1.2km", tag: "신선한 해산물", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&q=80" },
    { id: 2, title: "꽃지 해물칼국수", category: "한식·해산물", rating: 4.4, reviews: 98, distance: "2.3km", tag: "바다 전망", img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&q=80" },
    { id: 3, title: "안면도 게국지", category: "한식", rating: 4.7, reviews: 156, distance: "3.8km", tag: "게국지 전문", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80" },
    { id: 4, title: "꽃지 해수욕장", category: "자연관광지", rating: 4.8, reviews: 312, distance: "1.8km", tag: "낙조 명소", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80" },
  ];

  return (
    <div className="flex flex-col h-full bg-white p-4 md:p-6 overflow-hidden">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm md:text-base font-bold text-slate-800">주변 추천 장소 리스트</h3>
        <select className="border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-500 bg-slate-50 outline-none focus:border-purple-300">
          <option>거리순</option>
          <option>인기순</option>
        </select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
        {mockPlaces.map((place) => (
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
        ))}
      </div>
    </div>
  );
}

export default PlaceCardList;