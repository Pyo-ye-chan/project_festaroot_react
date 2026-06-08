import React from 'react';

const SearchHeader = () => {
  return (
    <div className="bg-white border-b border-gray-100 pt-7 pb-7">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-2">
          축제 찾기 <span className="text-[#FFD23F] animate-pulse">🎡</span>
        </h1>
        <p className="text-gray-500 mt-3 font-bold text-sm">진행 중이거나 예정된 축제 정보를 실시간으로 확인해보세요.</p>
      </div>
    </div>
  );
};

export default SearchHeader;