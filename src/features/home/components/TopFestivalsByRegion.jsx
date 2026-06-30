import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import festivalService from '../../../api/festivalService';
import { REGIONS, REGION_MAPPER } from '../../../constants/regionData';

const TopFestivalsByRegion = () => {
  const [activeRegion, setActiveRegion] = useState('서울');
  const [festivals, setFestivals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  // 축제 데이터 불러오기 Effect
  useEffect(() => {
    const fetchTopFestivals = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const fullRegionName = REGION_MAPPER[activeRegion];
        const data = await festivalService.getTopFestivals(fullRegionName);

        if (Array.isArray(data)) {
          setFestivals(data);
        } else {
          console.warn("백엔드에서 배열 형식이 아닌 데이터가 리턴되었습니다:", data);
          setFestivals([]);
        }
      } catch (err) {
        console.error("지역별 인기 축제 조회 실패:", err);
        setError("축제 데이터를 불러오는 중 오류가 발생했습니다.");
        setFestivals([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopFestivals();
  }, [activeRegion]);

  const handleFestivalClick = async (contentId) => {
    try {
      if (festivalService.increaseViewCount) {
        await festivalService.increaseViewCount(contentId);
      } else {
        console.warn("festivalService에 increaseViewCount 메소드가 정의되어 있지 않습니다.");
      }
    } catch (err) {
      console.error("상세보기 조회수 누적 실패:", err);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 150;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* 타이틀 및 지역 선택 탭 섹션 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-2xl sm:text-3xl text-gray-900 font-black">지역별 인기 축제 TOP 3</h3>
          <p className="text-gray-500 mt-1 sm:mt-2 font-bold text-xs sm:text-sm">지금 가장 주목받는 지역별 축제를 확인하세요.</p>
        </div>

        <div className="flex items-center gap-1 max-w-full md:max-w-xl self-center">
          <button
            onClick={() => scroll('left')}
            className="p-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors text-gray-400 hover:text-purple-600 hidden md:block shrink-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto pb-2 scroll-smooth [&::-webkit-scrollbar]:h-[3px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {REGIONS.map((r) => (
              <button
                key={r}
                onClick={() => setActiveRegion(r)}
                className={`px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 whitespace-nowrap ${activeRegion === r
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-100'
                  : 'bg-white text-gray-500 border border-gray-100 hover:bg-gray-50 hover:text-purple-600'
                  }`}
              >
                {r}
              </button>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="p-1.5 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors text-gray-400 hover:text-purple-600 hidden md:block shrink-0"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-gray-50 p-5 rounded-3xl animate-pulse h-28 flex items-center gap-5">
              <div className="w-20 h-20 bg-gray-200 rounded-2xl"></div>
              <div className="flex-grow space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12 text-rose-500 font-bold">{error}</div>
      ) : festivals.length === 0 ? (
        <div className="text-center py-12 text-gray-400 font-bold">해당 지역에 등록된 축제 정보가 없습니다.</div>
      ) : (
        <div className="flex overflow-x-auto pb-4 md:pb-0 gap-6 md:grid md:grid-cols-3 scrollbar-hide snap-x snap-mandatory">
          {festivals.map((fest, index) => {
            const viewCount = fest.view_count || fest.viewCount || fest.views || 0;

            return (
              <Link
                to={`/festival/${fest.content_id}`}
                key={fest.content_id}
                onClick={() => handleFestivalClick(fest.content_id)}
                className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center gap-5 hover:shadow-xl hover:border-purple-100 transition-all duration-500 group cursor-pointer flex-shrink-0 w-[260px] md:w-auto snap-start"
              >
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-gray-100">
                    <img
                      src={fest.first_image || 'https://picsum.photos/seed/default/100/100'}
                      alt={fest.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center font-black text-sm shadow-md">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <h4 className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">
                    {fest.title}
                  </h4>
                  <div className="mt-1 space-y-1">
                    <p className="text-[11px] text-gray-500 font-bold truncate flex items-center gap-1">📍 {fest.addr1}</p>
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      📅 {fest.event_start_date && fest.event_end_date
                        ? `${fest.event_start_date} - ${fest.event_end_date}`
                        : '일정 정보 없음'}
                    </p>
                  </div>

                  {/* 테마 정보 출력 */}
                  {fest.themes && fest.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {fest.themes.map((theme, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[8px] font-bold rounded">
                          #{theme.theme_name}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {/* 조회수 표시 컴포넌트 */}
                  {viewCount > 0 && (
                    <div className="flex items-center gap-1 mt-2 text-gray-400">
                      <Eye className="w-4 h-4 stroke-[2.5]" />
                      <span className="text-xs font-black text-gray-700">
                        {viewCount.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default TopFestivalsByRegion;