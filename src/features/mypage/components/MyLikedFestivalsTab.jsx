import React from 'react';

const MyLikedFestivalsTab = ({ likesCount }) => {
  const festivals = [
    { id: 1, title: '서울 세계불꽃축제', period: '2024.10.05 ~ 2024.10.05', location: '서울 영등포구', img: 'https://images.unsplash.com/photo-1533230393619-bcad81548243?w=500&q=80' },
    { id: 2, title: '진해 군항제', period: '2024.03.25 ~ 2024.04.03', location: '경남 창원시', img: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80' },
    { id: 3, title: '보령 머드축제', period: '2024.07.19 ~ 2024.08.04', location: '충남 보령시', img: 'https://images.unsplash.com/photo-1544033527-b192daee1f5b?w=500&q=80' },
    { id: 4, title: '제주 들불축제', period: '2024.03.07 ~ 2024.03.10', location: '제주 제주시', img: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">찜한 축제</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">가보고 싶어서 찜해둔 축제 목록입니다.</p>
        </div>
        <span className="text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
          총 {likesCount}개
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {festivals.map((festival) => (
          <div 
            key={festival.id} 
            className="group bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-40 sm:h-48 overflow-hidden">
              <img 
                src={festival.img} 
                alt={festival.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-3 right-3">
                <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-rose-500 hover:scale-110 transition-transform">
                  ❤️
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-[10px] sm:text-xs font-bold text-white/90 flex items-center gap-1">
                  📍 {festival.location}
                </span>
              </div>
            </div>
            
            <div className="p-4 sm:p-5 space-y-2">
              <h3 className="text-base sm:text-lg font-black text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                {festival.title}
              </h3>
              <p className="text-[11px] sm:text-xs font-bold text-gray-400">
                📅 {festival.period}
              </p>
              <div className="pt-2 flex gap-2">
                <button className="flex-grow py-2 bg-purple-600 text-white text-[11px] sm:text-xs font-black rounded-xl hover:bg-purple-700 transition-colors">
                  상세보기
                </button>
                <button className="px-3 py-2 bg-gray-50 text-gray-400 text-[11px] sm:text-xs font-black rounded-xl hover:bg-gray-100 transition-colors">
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {likesCount > 4 && (
        <div className="pt-4 text-center">
          <button className="text-sm font-bold text-gray-400 hover:text-purple-600 transition-all">
            찜한 축제 더보기
          </button>
        </div>
      )}
    </div>
  );
};

export default MyLikedFestivalsTab;
