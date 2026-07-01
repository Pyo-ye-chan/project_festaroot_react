import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ items, title, renderItem, onItemClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(() => {
    if (typeof window === 'undefined') {
      return 3;
    }

    return window.innerWidth < 1024 ? 1 : 3;
  });

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth < 1024 ? 1 : 3);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [itemsPerPage, items.length]);

  if (!items || items.length === 0) {
    return (
      <div>
        <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
          {title}
        </h3>
        <p className="text-gray-400 font-bold">표시할 정보가 없습니다.</p>
      </div>
    );
  }

  const maxIndex = Math.max(items.length - itemsPerPage, 0);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerPage, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + itemsPerPage, maxIndex));
  };

  return (
    <div>
      <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
        {title}
      </h3>

      <div className="relative overflow-hidden">
        {currentIndex > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors z-10"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div
          className="flex gap-5 transition-transform duration-300"
          style={{
            transform: `translateX(calc(-${currentIndex} * ((100% - ${20 * (itemsPerPage - 1)}px) / ${itemsPerPage} + 20px)))`,
          }}
        >
          {items.map((item, index) => (
            <div
              key={item.contentid || item.content_id || index}
              className={`shrink-0 ${itemsPerPage === 1 ? 'basis-full' : 'basis-[calc((100%-40px)/3)]'}`}
              onClick={() => onItemClick(item)}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>

        {currentIndex < maxIndex && (
          <button
            type="button"
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md hover:bg-white transition-colors z-10"
          >
            <ChevronRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Carousel;
