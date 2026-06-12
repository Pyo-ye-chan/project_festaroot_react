import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronRight } from 'lucide-react';

// 리스트 형태의 모임 아이템 컴포넌트
const GatheringListItem = ({ item, isFestival, showTypeBadge = false, activeTab }) => {
  // 🌟 백엔드 스네이크 케이스 필드명으로 안전하게 매핑
  const currentCount = item.current_count || 0;
  const maxCapacity = item.max_capacity || 500;
  const isFull = currentCount >= maxCapacity;

  // 🌟 room_title에서 ' 공식 모임'을 제외한 순수 축제 이름 추출
  const festivalName = item.room_title ? item.room_title.replace(' 공식 모임', '') : '';

  return (
    <Link
      // 🌟 item.id -> item.room_id 로 일통
      to={`/community/gathering/${item.room_id}`}
      className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-none"
    >
      <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
        {isFestival ? (
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100">
            {/* 🌟 item.image -> item.profile_image_url (기본 이미지 방어코드 포함) */}
            <img 
              src={item.profile_image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=300'} 
              alt={festivalName} 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <img src={item.profile_image_url} alt={item.nickname} className="w-full h-full object-cover" />
          </div>
        )}
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
                {/* 🌟 가공된 festivalName 사용 */}
                {festivalName}
              </span>
            )
          ) : (
            <span className="text-xs font-black text-blue-500/80">
              {item.nickname}
            </span>
          )}
        </div>
        <h4 className={`font-bold text-gray-900 truncate transition-colors text-base ${
          isFestival ? 'group-hover:text-[var(--festival-purple)]' : 'group-hover:text-blue-600'
        }`}>
          {item.room_title}
        </h4>
        <div className="flex items-center gap-4 mt-1.5">
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
            {/* 🌟 item.date -> item.free_date */}
            <CalendarDays className="w-3.5 h-3.5" /> {item.free_date}
          </div>
          {item.free_location && (
            <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400 overflow-hidden">
              {/* 🌟 item.location -> item.free_location */}
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{item.free_location}</span>
            </div>
          )}
          <div className={`flex items-center gap-1 text-[11px] font-black ${
            isFull ? 'text-red-500' : (isFestival ? 'text-purple-600' : 'text-blue-600')
          }`}>
            {/* 🌟 카멜 케이스 변수 제거 후 스네이크 케이스 기반 변수 출력 */}
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