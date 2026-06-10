import React from 'react';
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from 'lucide-react';

const SearchPagination = ({
  currentPage,
  setCurrentPage,
  pageInfo,
  totalPages
}) => {
  return (
    <div className="flex items-center justify-center gap-2 mt-12 select-none">
      {currentPage > 1 && (
        <button onClick={() => setCurrentPage(1)} className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
          <ChevronsLeft className="w-4 h-4" />
        </button>
      )}
      {pageInfo.startPage > 1 && (
        <button onClick={() => setCurrentPage(pageInfo.startPage - 1)} className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      {Array.from({ length: pageInfo.endPage - pageInfo.startPage + 1 }, (_, i) => pageInfo.startPage + i).map(pageNumber => (
        <button
          key={pageNumber}
          onClick={() => setCurrentPage(pageNumber)}
          className={`w-9 h-9 rounded-xl font-bold text-xs transition-all ${currentPage === pageNumber ? 'bg-[#5821B6] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
        >
          {pageNumber}
        </button>
      ))}
      {pageInfo.endPage < totalPages && (
        <button onClick={() => setCurrentPage(pageInfo.endPage + 1)} className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
      {currentPage < totalPages && (
        <button onClick={() => setCurrentPage(totalPages)} className="p-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 transition-all">
          <ChevronsRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchPagination;