import React from 'react';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // 페이지가 1개 이하일 경우 네비게이터를 굳이 보여주지 않음
  if (totalPages <= 1) return null;

  // 화면에 한 번에 보여줄 페이지 번호의 최대 개수
  const maxPageButtons = 5;

  // 현재 페이지를 중심으로 시작 페이지와 끝 페이지 계산 (슬라이딩 윈도우)
  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
  let endPage = startPage + maxPageButtons - 1;

  // 끝 페이지가 전체 페이지를 초과하면 조정
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPageButtons + 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-1.5 mt-10 font-['Pretendard']">
      {/* [이전] 버튼 */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium border border-transparent text-gray-600 hover:bg-gray-100 transition-colors"
          >
            1
          </button>
          {startPage > 2 && <span className="text-gray-400 text-sm px-1">...</span>}
        </>
      )}

      {/* 쪼개진 5개의 핵심 페이지 번호 버튼들 */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-all ${
            currentPage === page
              ? 'bg-[#7C3AED] text-white shadow-sm shadow-purple-200' // 활성화된 페이지 (보라색 포인트)
              : 'text-gray-600 hover:bg-gray-100 border border-transparent'
          }`}
        >
          {page}
        </button>
      ))}

      {/* 마지막 페이지 번호와 생략 기호 (...) */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400 text-sm px-1">...</span>}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium border border-transparent text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      {/* [다음] 버튼 */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:hover:bg-white transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;