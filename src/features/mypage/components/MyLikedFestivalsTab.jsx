import React, { useEffect, useState } from 'react';

const MyLikedFestivalsTab = ({ userDetails }) => {
  const likedFestivals = userDetails?.likedFestivals || [];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">찜한 축제</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">가보고 싶어서 찜해둔 축제 목록입니다.</p>
        </div>
        <span className="text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
          총 {likedFestivals.length}개
        </span>
      </header>

      {likedFestivals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {likedFestivals.map((festival) => (
            <div 
              key={festival.CONTENT_ID} 
              className="group bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
                <img 
                  src={festival.FIRST_IMAGE || festival.FIRST_IMAGE2 || 'https://via.placeholder.com/500x300?text=이미지+없음'} 
                  alt={festival.TITLE} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <button className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-rose-500 hover:scale-110 transition-transform">
                    ❤️
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-[10px] sm:text-xs font-bold text-white/90 flex items-center gap-1">
                    📍 {festival.ADDR1 || '장소 정보 없음'}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 space-y-2">
                <h3 className="text-base sm:text-lg font-black text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {festival.TITLE}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-gray-400">
                  📅 {festival.EVENT_START_DATE && festival.EVENT_END_DATE 
                    ? `${festival.EVENT_START_DATE} ~ ${festival.EVENT_END_DATE}`
                    : '일정 정보 없음'}
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
      ) : (
        <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
          <div className="text-4xl mb-4">❤️</div>
          <h2 className="text-xl font-black text-gray-800">찜한 축제가 아직 없네요.</h2>
          <p className="text-gray-500 mt-2 font-medium text-sm">마음에 드는 축제를 발견하면 하트를 눌러보세요!</p>
        </div>
      )}
    </div>
  );
};

export default MyLikedFestivalsTab;
