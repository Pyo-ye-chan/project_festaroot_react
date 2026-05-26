import React from 'react';

const FestivalCard = ({ fest }) => {
  return (
    <div className="group cursor-pointer">
      <div className="relative h-72 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 bg-gray-100">
        <img 
          src={`https://picsum.photos/seed/${fest.id + 20}/800/600`} 
          alt={fest.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        <div className="absolute top-5 left-5 flex gap-2">
          <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-gray-900 shadow-sm">
            {fest.dDay}
          </span>
          <span className="bg-purple-600/90 backdrop-blur px-3 py-1.5 rounded-full text-xs font-black text-white shadow-sm">
            TOP {fest.id}
          </span>
        </div>

        <button className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-gray-400 hover:text-rose-500 transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
          </svg>
        </button>

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
          <button className="w-full bg-white text-gray-900 font-bold py-3 rounded-2xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            상세보기
          </button>
        </div>
      </div>

      <div className="mt-6 px-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">{fest.category}</span>
          <span className="text-xs text-gray-400 font-medium">|</span>
          <span className="text-xs text-gray-500 font-medium">{fest.region}</span>
        </div>
        <h4 className="text-xl font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors">
          {fest.name}
        </h4>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 text-sm text-gray-400 font-bold">
            <span className="flex items-center gap-1">📅 {fest.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400">★</span>
            <span className="text-sm font-black text-gray-700">{fest.rating}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FestivalCard;
