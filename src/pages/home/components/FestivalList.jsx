import React, { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import FestivalCard from './FestivalCard';

const FestivalList = () => {
  const [activeCategory, setActiveCategory] = useState('전체');

  const categories = ['전체', '가족과 함께', '연인과 함께', '음식/먹거리', '음악/공연', '전통문화'];

  const festivals = [
    { id: 1, name: '2026 별빛 밤거리 페스티벌', region: '서울 중구', date: '05.28 - 06.01', dDay: 'D-12', category: '음악/공연', views: '2.5k', rating: 4.8 },
    { id: 2, name: '양평 딸기 축제', region: '경기 양평', date: '05.20 - 05.25', dDay: '종료임박', category: '음식/먹거리', views: '1.9k', rating: 4.5 },
    { id: 3, name: '강릉 커피 축제', region: '강원 강릉', date: '06.10 - 06.15', dDay: 'D-25', category: '음식/먹거리', views: '3.2k', rating: 4.9 },
    { id: 4, name: '경주 벚꽃 축제', region: '경북 경주', date: '04.05 - 04.10', dDay: 'D-1', category: '전통문화', views: '5.1k', rating: 4.7 },
    { id: 5, name: '제주 유채꽃 축제', region: '제주 서귀포', date: '04.15 - 04.20', dDay: 'D-8', category: '가족과 함께', views: '2.8k', rating: 4.6 },
    { id: 6, name: '부산 국제 락 페스티벌', region: '부산 사상구', date: '08.15 - 08.17', dDay: 'D-120', category: '음악/공연', views: '4.5k', rating: 4.9 },
  ];

  const filteredFestivals = activeCategory === '전체' 
    ? festivals 
    : festivals.filter(f => f.category === activeCategory);

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      {/* Header & Categories */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">실시간 인기 축제</h3>
          <p className="text-gray-500 mt-2">사용자들이 지금 가장 많이 찾는 축제들이에요.</p>
        </div>
        
        <CategoryFilter 
          categories={categories} 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredFestivals.map((fest) => (
          <FestivalCard key={fest.id} fest={fest} />
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-16 text-center">
        <button className="px-10 py-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
          축제 더보기
        </button>
      </div>
    </section>
  );
};

export default FestivalList;
