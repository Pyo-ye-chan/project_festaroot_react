import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import festivalService from '../../../api/festivalService';
import useAuthStore from '../../../store/useAuthStore'; 
import { maxios } from '../../../api/axiosApi'; 

const FestivalList = () => {
  const [popularList, setPopularList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedIds, setLikedIds] = useState([]); 

  const { isLoggedIn } = useAuthStore(); 

  useEffect(() => {
    const fetchPopularFestivals = async () => {
      try {
        setIsLoading(true);

        const params = {
          page: 1,
          size: 4,
          sort: 'popular',
          ongoingOnly: true
        };

        const response = await festivalService.getFestivals(params);
        const data = Array.isArray(response) ? response : (response.list || []);
        setPopularList(data);
      } catch (error) {
        console.error("인기 축제 데이터를 가져오는데 실패했습니다:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchLikedFestivals = async () => {
      if (!isLoggedIn) {
        setLikedIds([]); 
        return;
      }

      try {
        const response = await maxios.get('/api/festivals/likeList');
        const resData = response.data || response;
        const dataArray = Array.isArray(resData) ? resData : (resData.list || []);
        
        const ids = dataArray.map(fest => (typeof fest === 'object' ? (fest.contentId || fest.content_id) : fest));
        setLikedIds(ids);
      } catch (error) {
        console.error("사용자의 찜 목록을 불러오는 데 실패했습니다:", error);
      }
    };

    fetchPopularFestivals();
    fetchLikedFestivals();
  }, [isLoggedIn]); 

  const handleFestivalClick = async (contentId) => {
    try {
      if (festivalService.increaseViewCount) {
        await festivalService.increaseViewCount(contentId);
      } else {
        console.warn("festivalService에 increaseViewCount 메소드가 정의되어 있지 않습니다.");
      }
    } catch (error) {
      console.error("인기 축제 목록 조회수 상승 실패:", error);
    }
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
      return `${cleanStr.substring(0, 4)}.${cleanStr.substring(4, 6)}.${cleanStr.substring(6, 8)}`;
    }
    return dateStr;
  };

  if (isLoading) {
    return (
      <section className="max-w-7xl mx-auto py-20 px-4 text-center">
        <div className="animate-pulse text-gray-400 font-bold">지금 인기 있는 축제들을 불러오고 있어요... 🎡</div>
      </section>
    );
  }

  return (
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">인기 축제 목록</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">지금 사람들에게 가장 사랑받고 있는 축제들이에요.</p>
        </div>
        <Link
          to="/search"
          state={{ ongoingOnly: true, sort: 'popular' }}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-sm shadow-sm active:scale-95"
        >
          더보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularList.length > 0 ? (
          popularList.map((fest, index) => {
            const contentId = fest.contentId || fest.content_id;
            const title = fest.title;
            const region = fest.addr1;
            const startDate = fest.eventStartDate || fest.event_start_date;
            const endDate = fest.eventEndDate || fest.event_end_date;
            const image = fest.firstImage || fest.first_image;
            const rating = fest.rating || 0.0;
            const likes = fest.likes || fest.likeCount || fest.like_count || 0;

            const isLiked = likedIds.includes(contentId);

            return (
              <Link 
                to={`/festival/${contentId}`} 
                key={contentId} 
                onClick={() => handleFestivalClick(contentId)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:border-purple-100 border border-transparent transition-all duration-500 bg-gray-100">
                  <img
                    src={image || `https://picsum.photos/seed/${contentId}/800/1000`}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-gray-900 shadow-sm">
                      추천
                    </span>
                    <span className="bg-purple-600/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black text-white shadow-sm w-fit">
                      TOP {index + 1}
                    </span>
                  </div>
                  
                  {/* 변경된 핵심 파트: 로그인한 유저(isLoggedIn === true)에게만 찜 버튼 렌더링 */}
                  {isLoggedIn && (
                    <button 
                      className={`absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center transition-colors duration-300 shadow-sm active:scale-90 ${
                        isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-500'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation(); 
                        e.preventDefault();
                      }}
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" />
                      </svg>
                    </button>
                  )}
                </div>
                
                <div className="mt-4 px-1">
                  <h4 className="text-lg font-black text-gray-900 leading-tight group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
                    {title}
                  </h4>
                  <div className="mt-2 space-y-1">
                    <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1">
                      <span className="text-purple-400">📍</span> {formatRegion(region)}
                    </p>
                    <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5">
                      <span>📅</span> {formatDate(startDate)} - {formatDate(endDate)}
                    </p>
                  </div>

                  {fest.themes && fest.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {fest.themes.map((theme, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-bold rounded">
                          #{theme.theme_name}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2.5">
                      {rating > 0 && (
                        <div className="flex items-center gap-0.5">
                          <span className="text-yellow-400 text-xs">★</span>
                          <span className="text-xs font-black text-gray-700">{rating}</span>
                        </div>
                      )}

                      {likes > 0 && (
                        <div className="flex items-center gap-0.5 text-rose-500">
                          <span className="text-xs">❤️</span>
                          <span className="text-xs font-black">{likes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full text-center py-12 text-gray-400 font-bold">
            현재 데이터가 존재하지 않습니다. 🥲
          </div>
        )}
      </div>
    </section>
  );
};

export default FestivalList;