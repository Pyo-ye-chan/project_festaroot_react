import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react'; 
import festivalService from '../../../api/festivalService';
import useAuthStore from '../../../store/useAuthStore'; 
import { maxios } from '../../../api/axiosApi'; 

const FestivalList = () => {
  const [popularList, setPopularList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [likedIds, setLikedIds] = useState([]); 
  const [likeLoading, setLikeLoading] = useState(false); 

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
        
        const ids = dataArray.map(fest => {
          const id = typeof fest === 'object' ? (fest.contentId || fest.content_id) : fest;
          return Number(id);
        });
        setLikedIds(ids);
      } catch (error) {
        console.error("사용자의 찜 목록을 불러오는 데 실패했습니다:", error);
      }
    };

    fetchPopularFestivals();
    fetchLikedFestivals();
  }, [isLoggedIn]); 

  const handleLikeToggle = async (e, contentId) => {
    e.stopPropagation(); 
    e.preventDefault();

    if (!isLoggedIn) {
      alert('로그인이 필요한 기능입니다.');
      return;
    }

    if (likeLoading) return; 

    setLikeLoading(true);
    const numericId = Number(contentId);
    const isCurrentlyLiked = likedIds.includes(numericId);

    // 1. UI 선반영 (Optimistic Update) - 프론트에서 먼저 정확하게 계산
    if (isCurrentlyLiked) {
      setLikedIds(prev => prev.filter(id => id !== numericId));
    } else {
      setLikedIds(prev => [...prev, numericId]);
    }

    setPopularList(prevList =>
      prevList.map(fest => {
        const currentId = Number(fest.contentId || fest.content_id);
        if (currentId === numericId) {
          const currentLikes = fest.likes || fest.likeCount || fest.like_count || 0;
          const updatedLikes = isCurrentlyLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
          return {
            ...fest,
            likes: updatedLikes,
            likeCount: updatedLikes,
            like_count: updatedLikes,
          };
        }
        return fest;
      })
    );

    // 2. API 호출
    try {
      // 서버 통신이 성공하면 위의 선반영된 상태(예: 4 -> 5)를 그대로 매끄럽게 유지합니다.
      await festivalService.toggleFestivalLike(numericId);
    } catch (error) {
      console.error("인기 축제 찜하기 실패:", error);
      
      // 통신 실패 시에만 원래 숫자로 롤백 (Rollback)
      if (isCurrentlyLiked) {
        setLikedIds(prev => [...prev, numericId]);
      } else {
        setLikedIds(prev => prev.filter(id => id !== numericId));
      }
      setPopularList(prevList =>
        prevList.map(fest => {
          const currentId = Number(fest.contentId || fest.content_id);
          if (currentId === numericId) {
            const currentLikes = fest.likes || fest.likeCount || fest.like_count || 0;
            const rolledBackLikes = isCurrentlyLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1);
            return {
              ...fest,
              likes: rolledBackLikes,
              likeCount: rolledBackLikes,
              like_count: rolledBackLikes,
            };
          }
          return fest;
        })
      );
      alert("찜 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleFestivalClick = async (contentId) => {
    try {
      if (festivalService.increaseViewCount) {
        await festivalService.increaseViewCount(contentId);
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
    <section className="max-w-7xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center sm:items-end gap-4 mb-8 sm:mb-10">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">인기 축제 목록</h3>
          <p className="text-gray-500 mt-1 sm:mt-2 font-bold text-xs sm:text-sm">지금 사람들에게 가장 사랑받고 있는 축제들이에요.</p>
        </div>
        <Link
          to="/search"
          state={{ ongoingOnly: true, sort: 'popular' }}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-xs sm:text-sm shadow-sm active:scale-95 whitespace-nowrap shrink-0"
        >
          더보기
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="flex overflow-x-auto pb-4 md:pb-0 gap-6 md:grid md:grid-cols-2 lg:grid-cols-4 scrollbar-hide snap-x snap-mandatory">
        {popularList.length > 0 ? (
          popularList.map((fest, index) => {
            const contentId = Number(fest.contentId || fest.content_id);
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
                className="group cursor-pointer flex-shrink-0 w-[260px] md:w-auto snap-start"
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
                  
                  {isLoggedIn && (
                    <button 
                      className={`absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded-full flex items-center justify-center transition-all duration-300 shadow-sm active:scale-90 ${
                        isLiked ? 'bg-rose-50/90 text-rose-500' : 'text-gray-400 hover:text-rose-500'
                      }`}
                      onClick={(e) => handleLikeToggle(e, contentId)}
                    >
                      <Heart className={`w-4 h-4 transition-all duration-300 ${isLiked ? 'fill-rose-500 text-rose-500 scale-110' : 'fill-transparent'}`} />
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