import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`px-5 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            activeCategory === cat
            ? 'bg-purple-600 text-white shadow-lg shadow-purple-100'
            : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
