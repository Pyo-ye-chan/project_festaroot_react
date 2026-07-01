import React from 'react';
import { Search, MapPin, Calendar, Star, Eye, Heart } from 'lucide-react';

const formatDate = (dateStr) => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  return `${dateStr.substring(0, 4)}.${dateStr.substring(4, 6)}.${dateStr.substring(6, 8)}`;
};

const getDDay = (startDateStr, endDateStr) => {
  if (!startDateStr) return '진행중';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(
    startDateStr.substring(0, 4),
    parseInt(startDateStr.substring(4, 6)) - 1,
    startDateStr.substring(6, 8)
  );
  const end = new Date(
    endDateStr.substring(0, 4),
    parseInt(endDateStr.substring(4, 6)) - 1,
    endDateStr.substring(6, 8)
  );

  if (today > end) return '종료';
  if (today >= start && today <= end) return '진행중';
  const diffTime = start - today;
  return `D-${Math.ceil(diffTime / (1000 * 60 * 60 * 24))}`;
};

const SearchContent = ({
  festivals,
  viewMode,
  isLoggedIn,
  likedFestivals,
  handleFestivalClick,
  handleLikeToggle
}) => {
  if (festivals.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm">
        <Search className="w-10 h-10 text-gray-300 mb-6" />
        <h3 className="text-xl font-black text-gray-900 mb-2">현재 만나볼 수 있는 축제가 없습니다.</h3>
        <p className="text-gray-400 font-bold text-sm">다른 지역이나 키워드를 검색해 보세요.</p>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {festivals.map(fest => (
            <div onClick={() => handleFestivalClick(fest.content_id)} key={fest.content_id} className="cursor-pointer group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img src={fest.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400'} alt={fest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-black shadow-sm ${getDDay(fest.event_start_date, fest.event_end_date) === '진행중' ? 'bg-green-500 text-white' : 'bg-white text-gray-900'}`}>
                    {getDDay(fest.event_start_date, fest.event_end_date)}
                  </span>
                </div>

                {isLoggedIn && (
                  <button onClick={(e) => handleLikeToggle(e, fest.content_id)} className={`absolute top-4 right-4 w-10 h-10 backdrop-blur rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${likedFestivals?.has?.(Number(fest.content_id)) ? 'bg-rose-50/90 text-rose-500 shadow-sm' : 'bg-white/90 text-gray-400 hover:text-rose-500'}`}>
                    <Heart className={`w-4 h-4 transition-all duration-300 ${likedFestivals?.has?.(Number(fest.content_id)) ? 'fill-rose-500 scale-110' : 'fill-transparent'}`} />
                  </button>
                )}
              </div>
              <div className="p-6">
                <h4 className="text-lg font-black text-gray-900 group-hover:text-[#5821B6] transition-colors line-clamp-1">{fest.title}</h4>
                <div className="mt-4 space-y-2">
                  <p className="text-[11px] text-gray-500 font-bold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {fest.addr1 || '상세 주소 정보 없음'}</p>
                  <p className="text-[11px] text-gray-400 font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatDate(fest.event_start_date)} ~ {formatDate(fest.event_end_date)}</p>
                </div>

                {/* 테마 정보 출력 */}
                {fest.themes && fest.themes.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4">
                    {fest.themes.map((theme, idx) => (
                      <span key={idx} className="px-2 py-1 bg-purple-50 text-purple-600 text-[9px] font-black rounded-lg">
                        #{theme.theme_name}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#FFD23F] fill-current" />
                      <span className="text-sm font-black text-gray-700">
                        {Number(fest.avg_rating || fest.rating_avg || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-black text-gray-600">{fest.view_count || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-rose-500 font-black">
                    <Heart className="w-3.5 h-3.5 fill-current" /> <span className="text-[11px]">{fest.like_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full space-y-4">
          {festivals.map(fest => (
            <div
              onClick={() => handleFestivalClick(fest.content_id)}
              key={fest.content_id}
              className="cursor-pointer group flex w-full max-w-full gap-3 bg-white rounded-[1.5rem] sm:rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 p-3 sm:p-0 items-center sm:items-stretch"
            >
              {/* 이미지 영역: 고정 크기 유지 */}
              <div className="w-24 h-24 sm:w-48 sm:h-48 shrink-0 overflow-hidden rounded-xl sm:rounded-none bg-gray-100">
                <img
                  src={fest.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400'}
                  alt={fest.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* 텍스트 세부정보 영역: w-0 flex-grow 조합으로 가로폭 팽창을 원천 차단 */}
              <div className="w-0 flex-grow sm:p-6 flex flex-col justify-between py-0.5 min-w-0">
                <div className="w-full min-w-0">
                  <div className="flex items-center justify-between mb-1 sm:mb-2 w-full min-w-0">
                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black shrink-0 ${getDDay(fest.event_start_date, fest.event_end_date) === '진행중' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                      {getDDay(fest.event_start_date, fest.event_end_date)}
                    </span>

                    {isLoggedIn && (
                      <button onClick={(e) => handleLikeToggle(e, fest.content_id)} className={`transition-all duration-300 active:scale-95 shrink-0 ${likedFestivals?.has?.(Number(fest.content_id)) ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}>
                        <Heart className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-all duration-300 ${likedFestivals?.has?.(Number(fest.content_id)) ? 'fill-rose-500 scale-110' : 'fill-transparent'}`} />
                      </button>
                    )}
                  </div>

                  {/* 제목: 공간 부족 시 확실하게 말줄임 처리 */}
                  <h4 className="text-xs sm:text-xl font-black text-gray-900 group-hover:text-[#5821B6] transition-colors truncate w-full block">
                    {fest.title}
                  </h4>

                  {/* 주소 및 일정: w-full과 truncate block 설정으로 내부 글자 무조건 압축 */}
                  <div className="mt-1 sm:mt-3 flex flex-col sm:flex-row sm:gap-4 gap-0.5 w-full min-w-0">
                    <p className="text-[10px] sm:text-xs text-gray-500 font-bold flex items-center gap-1 w-full min-w-0">
                      <MapPin className="w-3 h-3 text-purple-400 shrink-0" />
                      <span className="truncate block flex-1 min-w-0">{fest.addr1 || '상세 주소 정보 없음'}</span>
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 font-bold flex items-center gap-1 w-full min-w-0">
                      <Calendar className="w-3 h-3 text-gray-400 shrink-0" />
                      <span className="truncate block flex-1 min-w-0">{formatDate(fest.event_start_date)} ~ {formatDate(fest.event_end_date)}</span>
                    </p>
                  </div>

                  {/* 테마 정보 출력 */}
                  {fest.themes && fest.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1 sm:mt-2 w-full min-w-0">
                      {fest.themes.map((theme, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 bg-purple-50 text-purple-600 text-[8px] sm:text-[9px] font-black rounded-md whitespace-nowrap">
                          #{theme.theme_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 하단 아이콘 정보 영역 */}
                <div className="flex items-center justify-between pt-1 sm:pt-4 border-t border-gray-50 mt-1.5 sm:mt-0 w-full min-w-0">
                  <div className="flex gap-2 sm:gap-4 flex-wrap min-w-0">
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-3 h-3 text-[#FFD23F] fill-current" />
                      <span className="text-[10px] sm:text-xs font-black text-gray-700">
                        {Number(fest.avg_rating || fest.rating_avg || 0).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex items-center gap-0.5 text-gray-500 shrink-0">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="text-[10px] sm:text-sm font-black">{fest.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-rose-500 font-black shrink-0">
                      <Heart className="w-3 h-3 sm:w-4 sm:h-4 fill-current" />
                      <span className="text-[10px] sm:text-sm">{fest.like_count || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default SearchContent;