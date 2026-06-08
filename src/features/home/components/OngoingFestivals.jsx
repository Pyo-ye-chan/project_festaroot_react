import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import festivalService from '../../../api/festivalService';

const OngoingFestivals = () => {
  const [ongoingList, setOngoingList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOngoingFestivals = async () => {
      try {
        setIsLoading(true);
        const params = {
          ongoingOnly: true,
          page: 1,
          size: 4,
          sort: 'recentStart' 
        };
        const response = await festivalService.getFestivals(params);
        const data = Array.isArray(response) ? response : (response.list || []);
        setOngoingList(data);
      } catch (error) {
        console.error("진행 중인 축제 데이터를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOngoingFestivals();
  }, []);

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
      return `${cleanStr.substring(0, 4)}.${cleanStr.substring(4, 6)}.${cleanStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-20 px-4 text-center bg-gray-50/50 rounded-[3rem] my-12">
        <div className="animate-pulse text-gray-400 font-bold">지금 열심히 축제 정보를 불러오고 있어요... 🎡</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 rounded-[3rem] my-12 text-left transition-all duration-500 hover:bg-gray-100/50 border border-gray-100/50">
      <div className="flex justify-between items-end mb-10 px-4">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">지금 진행 중인 축제</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">오늘 바로 즐길 수 있는 축제들을 확인해 보세요.</p>
        </div>
        <Link 
          to="/search" 
          state={{ ongoingOnly: true, sort: 'date' }}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-green-600 transition-all duration-300 text-sm shadow-sm active:scale-95"
        >
          전체보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {ongoingList.length > 0 ? (
          ongoingList.map((fest) => {
            const contentId = fest.contentId || fest.content_id;
            const title = fest.title;
            const region = fest.addr1;
            const startDate = fest.eventStartDate || fest.event_start_date;
            const endDate = fest.eventEndDate || fest.event_end_date;
            const image = fest.firstImage || fest.first_image;

            return (
              <Link 
                to={`/festival/${contentId}`} 
                key={contentId} 
                className="group cursor-pointer bg-white p-4 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
              >
                <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-4 bg-gray-100 border border-gray-50">
                  <img 
                    src={image || `https://picsum.photos/seed/${contentId}/600/600`} 
                    alt={title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[10px] font-black shadow-lg animate-pulse">
                      ● 진행중
                    </span>
                  </div>
                </div>
                <div className="px-2 pb-2">
                  <h4 className="text-base font-black text-gray-900 mt-1 line-clamp-1 group-hover:text-green-600 transition-colors duration-300">
                    {title}
                  </h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      📍 {formatRegion(region)}
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1">
                      📅 {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-50 flex justify-end">
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-green-500 group-hover:translate-x-1 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400 font-bold">
            현재 진행 중인 축제가 없습니다. 🥲
          </div>
        )}
      </div>
    </section>
  );
};

export default OngoingFestivals;