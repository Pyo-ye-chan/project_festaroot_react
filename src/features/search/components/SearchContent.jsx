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
                      <Star className="w-3.5 h-3.5 text-[#FFD23F] fill-current" />
                      <span className="text-xs font-black text-gray-700">{fest.rating_avg ? fest.rating_avg.toFixed(1) : '0.0'}</span>
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
        <div className="space-y-4">
          {festivals.map(fest => (
            <div onClick={() => handleFestivalClick(fest.content_id)} key={fest.content_id} className="cursor-pointer group flex bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="w-48 h-48 shrink-0 overflow-hidden bg-gray-100">
                <img src={fest.first_image || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=400'} alt={fest.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="flex-grow p-6 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-lg text-[9px] font-black ${getDDay(fest.event_start_date, fest.event_end_date) === '진행중' ? 'bg-green-500 text-white' : 'bg-gray-50 text-gray-500'}`}>
                      {getDDay(fest.event_start_date, fest.event_end_date)}
                    </span>

                    {isLoggedIn && (
                      <button onClick={(e) => handleLikeToggle(e, fest.content_id)} className={`transition-all duration-300 active:scale-95 ${likedFestivals?.has?.(Number(fest.content_id)) ? 'text-rose-500' : 'text-gray-300 hover:text-rose-500'}`}>
                        <Heart className={`w-5 h-5 transition-all duration-300 ${likedFestivals?.has?.(Number(fest.content_id)) ? 'fill-rose-500 scale-110' : 'fill-transparent'}`} />
                      </button>
                    )}
                  </div>
                  <h4 className="text-xl font-black text-gray-900 group-hover:text-[#5821B6] transition-colors">{fest.title}</h4>
                  <div className="mt-3 flex gap-4">
                    <p className="text-xs text-gray-500 font-bold flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {fest.addr1}</p>
                    <p className="text-xs text-gray-400 font-bold flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-400" /> {formatDate(fest.event_start_date)} ~ {formatDate(fest.event_end_date)}</p>
                  </div>
                  
                  {/* 테마 정보 출력 (리스트 뷰) */}
                  {fest.themes && fest.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {fest.themes.map((theme, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[9px] font-black rounded-md">
                          #{theme.theme_name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-[#FFD23F] fill-current" />
                      <span className="text-sm font-black text-gray-700">{fest.rating_avg ? fest.rating_avg.toFixed(1) : '0.0'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <Eye className="w-4 h-4" /> <span className="text-sm font-black">{fest.view_count || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-rose-500 font-black">
                      <Heart className="w-4 h-4 fill-current" /> <span className="text-sm">{fest.like_count || 0}</span>
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