import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronRight } from 'lucide-react';

const GatheringListItem = ({ item, isFestival, showTypeBadge = false, activeTab }) => {
  // 🌟 백엔드 데이터 필드 매핑 (대문자/소문자 대응)
  const currentCount = item.current_count || item.CURRENT_COUNT || 0;
  const maxCapacity = item.max_capacity || item.MAX_CAPACITY || 500;
  const isFull = currentCount >= maxCapacity;
  
  const roomTitle = item.room_title || item.ROOM_TITLE || '';
  const freeLocation = item.free_location || item.FREE_LOCATION || '';
  const freeDate = item.free_date || item.FREE_DATE || '';
  const roomId = item.room_id || item.ROOM_ID;
  const nickname = item.nickname || item.NICKNAME || '익명';

  // 🌟 room_title에서 ' 공식 모임'을 제거한 순수 축제 이름 추출
  const festivalName = roomTitle ? roomTitle.replace(' 공식 모임', '') : '';

  // 🌟 이미지 우선순위 설정 (다양한 백엔드 필드 대응)
  const gatheringImage = item.room_image || 'https://picsum.photos/seed/gathering/100/100'

  return (
    <Link
      to={`/community/gathering/${roomId}`}
      className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-none"
    >
      <div className="w-16 h-16 flex-shrink-0">
        <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
          <img 
            src={gatheringImage} 
            alt={roomTitle} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>
      </div>

      <div className="flex-grow min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {showTypeBadge && (
            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
              isFestival ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }`}>
              {isFestival ? 'Festival' : 'Free'}
            </span>
          )}
          {isFestival ? (
            activeTab !== '참여중인 모임' && (
              <span className="text-xs font-black text-[var(--festival-purple)] bg-purple-50 px-2 py-0.5 rounded-md">
                {festivalName}
              </span>
            )
          ) : (
            <span className="text-xs font-black text-blue-500/80">
              {nickname}
            </span>
          )}
        </div>
        <h4 className={`font-bold text-gray-900 truncate transition-colors text-base ${
          isFestival ? 'group-hover:text-[var(--festival-purple)]' : 'group-hover:text-blue-600'
        }`}>
          {roomTitle}
        </h4>
        <div className="flex items-center gap-4 mt-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
            <CalendarDays className="w-3.5 h-3.5" /> {freeDate}
          </div>
          {freeLocation && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 overflow-hidden">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{freeLocation}</span>
            </div>
          )}
          <div className={`flex items-center gap-1 text-[11px] font-black ${
            isFull ? 'text-red-500' : (isFestival ? 'text-purple-600' : 'text-blue-600')
          }`}>
            <Users className="w-3.5 h-3.5" /> {currentCount}/{maxCapacity}명
          </div>
        </div>
      </div>

      <ChevronRight className={`w-5 h-5 text-gray-300 transition-all flex-shrink-0 ${
        isFestival ? 'group-hover:text-[var(--festival-purple)]' : 'group-hover:text-blue-600'
      } group-hover:translate-x-1`} />
    </Link>
  );
};

export default GatheringListItem;