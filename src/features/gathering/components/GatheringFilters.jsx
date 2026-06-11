import React from 'react';
import { Search } from 'lucide-react';

const GatheringFilters = ({ categories, activeTab, onTabChange, keyword, onKeywordChange }) => (
  <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col xl:flex-row gap-6 items-center">
    <div className="flex flex-wrap gap-2 flex-grow">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onTabChange(cat)}
          className={`px-6 py-3 rounded-2xl font-black text-sm transition-all whitespace-nowrap ${
            activeTab === cat 
            ? 'bg-[var(--festival-purple)] text-white shadow-lg shadow-purple-100' 
            : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
    <div className="relative w-full xl:w-80 group">
      <input 
        type="text" 
        value={keyword}
        onChange={(e) => onKeywordChange(e.target.value)}
        placeholder="모임 제목 검색..." 
        className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 text-sm font-medium focus:ring-2 focus:ring-[var(--festival-purple)]/20 transition-all"
      />
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--festival-purple)] w-5 h-5" />
    </div>
  </div>
);

export default GatheringFilters;
