import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import festivalService from '../../../api/festivalService';

const ClosingSoon = () => {
  const [closingList, setClosingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClosingSoonFestivals = async () => {
      try {
        setIsLoading(true);
        const response = await festivalService.getClosingSoonFestivals();
        
        // 데이터 구조 보장 (배열인지 체크)
        const data = Array.isArray(response) ? response : (response.list || []);
        setClosingList(data);
      } catch (error) {
        console.error("종료 임박 축제 데이터를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClosingSoonFestivals();
  }, []);

  // 상세보기 이동 시 조회수를 상승시키는 클릭 핸들러 함수
  const handleFestivalClick = async (contentId) => {
    try {
      if (festivalService.increaseViewCount) {
        await festivalService.increaseViewCount(contentId);
      }
    } catch (error) {
      console.error("종료 임박 축제 목록 조회수 상승 실패:", error);
    }
  };

  // 실시간 D-Day 계산 헬퍼 함수
  const calculateDDay = (endDateStr) => {
    if (!endDateStr) return 'D-?';
    
    // 하이픈 제거 후 포맷 정리 (예: 2026-06-15 -> 20260615)
    const cleanStr = String(endDateStr).replace(/-/g, '');
    if (cleanStr.length !== 8) return 'D-?';

    const year = parseInt(cleanStr.substring(0, 4), 10);
    const month = parseInt(cleanStr.substring(4, 6), 10) - 1;
    const day = parseInt(cleanStr.substring(6, 8), 10);

    const endDate = new Date(year, month, day);
    const today = new Date();

    // 시간 시분초 정규화 (날짜 차이만 정확히 계산하기 위함)
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'D-Day';
    if (diffDays > 0) return `D-${diffDays}`;
    return '종료';
  };

  const formatRegion = (addr) => {
    if (!addr) return '지역 정보 없음';
    const parts = addr.split(' ');
    if (parts.length >= 2) {
      const doName = parts[0].substring(0, 2);
      const siName = parts[1].substring(0, 2);
      return `${doName} ${siName}`;
    }
    return parts[0];
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const cleanStr = String(dateStr).replace(/-/g, '');
    if (cleanStr.length === 8) {
      return `${cleanStr.substring(4, 6)}.${cleanStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  if (isLoading) {
    return (
      <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 h-full flex flex-col justify-center items-center py-20">
        <div className="animate-pulse text-gray-400 font-bold">종료 임박 축제를 확인 중... 🏃‍♂️</div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-[2.5rem] p-7 shadow-sm border border-gray-100 h-full flex flex-col transition-all duration-300 hover:shadow-md text-left">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <span>종료 임박!</span>
          <span className="text-lg animate-bounce">🏃‍♂️</span>
        </h3>
        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full uppercase tracking-tighter border border-gray-100">
          Hurry Up
        </span>
      </div>

      <div className="space-y-3 flex-grow">
        {closingList.length > 0 ? (
          closingList.map((item) => {
            const contentId = item.contentId || item.content_id;
            const name = item.title;
            const region = item.addr1;
            const startDate = item.eventStartDate || item.event_start_date;
            const endDate = item.eventEndDate || item.event_end_date;
            const dDayLabel = calculateDDay(endDate);

            return (
              <Link
                to={`/festival/${contentId}`}
                key={contentId}
                onClick={() => handleFestivalClick(contentId)}
                className="flex items-center gap-4 p-4 bg-gray-50/50 hover:bg-white rounded-2xl transition-all duration-300 cursor-pointer group border border-transparent hover:border-rose-100 hover:shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100 group-hover:bg-rose-500 transition-all duration-300">
                  <span className="text-xs font-black text-rose-500 group-hover:text-white whitespace-nowrap">
                    {dDayLabel}
                  </span>
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-gray-800 truncate group-hover:text-rose-600 transition-colors duration-300">
                    {name}
                  </h4>
                  <div className="mt-1 flex flex-col gap-0.5">
                    <p className="text-[10px] text-gray-500 font-bold group-hover:text-rose-400 transition-colors📌">
                      📍 {formatRegion(region)}
                    </p>
                    <p className="text-[10px] text-gray-400 font-bold group-hover:text-rose-300 transition-colors">
                      📅 {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </div>
                </div>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-rose-400 group-hover:translate-x-1 transition-all duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-12 text-gray-400 font-bold text-sm">
            종료가 임박한 축제가 없습니다. 😌
          </div>
        )}
      </div>
    </section>
  );
};

export default ClosingSoon;