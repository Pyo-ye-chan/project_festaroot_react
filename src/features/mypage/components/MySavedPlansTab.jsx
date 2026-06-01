import React from 'react';

const MySavedPlansTab = () => {
  const savedPlans = [
    {
      id: 1,
      title: '수원 화성 가을 나들이',
      mainFestival: '수원 화성 문화제',
      date: '2024.05.28',
      location: '경기 수원시',
      thumbnail: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80',
      stepsCount: 4
    },
    {
      id: 2,
      title: '강릉 바다와 커피 여행',
      mainFestival: '강릉 커피축제',
      date: '2024.05.15',
      location: '강원 강릉시',
      thumbnail: 'https://images.unsplash.com/photo-1522383225653-ed111181a951?w=500&q=80',
      stepsCount: 5
    },
    {
      id: 3,
      title: '진해 벚꽃 당일치기',
      mainFestival: '진해 군항제',
      date: '2024.04.10',
      location: '경남 창원시',
      thumbnail: 'https://images.unsplash.com/photo-1493962853295-0fd70327578a?w=500&q=80',
      stepsCount: 4
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">저장된 플래너</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">AI와 함께 설계한 나만의 여행 일정들입니다.</p>
        </div>
        <span className="text-xs sm:text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          총 {savedPlans.length}개
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {savedPlans.map((plan) => (
          <div 
            key={plan.id} 
            className="group bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-44 sm:h-48 overflow-hidden">
              <img 
                src={plan.thumbnail} 
                alt={plan.title} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                <span className="text-[10px] font-black text-white flex items-center gap-1">
                  📅 {plan.date}
                </span>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <span className="text-[10px] font-black text-white bg-purple-600 px-2 py-1 rounded-md shadow-sm">
                  {plan.stepsCount}개의 일정 포함
                </span>
              </div>
            </div>
            
            <div className="p-5 space-y-3">
              <div>
                <h3 className="text-lg font-black text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                  {plan.title}
                </h3>
                <p className="text-xs font-bold text-gray-400 mt-1 flex items-center gap-1">
                  <span>📍</span> {plan.location} · {plan.mainFestival}
                </p>
              </div>
              
              <div className="pt-2 flex gap-2">
                <button className="flex-grow py-3 bg-slate-50 text-gray-700 text-xs font-black rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100">
                  일정 불러오기
                </button>
                <button className="px-4 py-3 bg-gray-50 text-gray-400 text-xs font-black rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all">
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {savedPlans.length === 0 && (
        <div className="py-20 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-3xl">📝</span>
          </div>
          <p className="text-gray-400 font-bold">저장된 플랜이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-1">AI 여행 플래너에서 첫 일정을 만들어보세요!</p>
        </div>
      )}
    </div>
  );
};

export default MySavedPlansTab;
