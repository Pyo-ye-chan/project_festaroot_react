import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users } from 'lucide-react';

const FestivalGridCard = ({ item }) => {
  // 🌟 데이터 필드 추출 (대문자/소문자 대응 및 우선순위 설정)
  const currentCount = item.current_count || item.CURRENT_COUNT || 0;
  const maxCapacity = item.max_capacity || item.MAX_CAPACITY || 500;
  const isFull = currentCount >= maxCapacity;
  
  const roomTitle = item.room_title || item.ROOM_TITLE || '';
  const freeLocation = item.free_location || item.FREE_LOCATION || '';
  const freeDate = item.free_date || item.FREE_DATE || '';
  const roomId = item.room_id || item.ROOM_ID;
  
  // 🌟 이미지 우선순위: 모임 대표 이미지 -> 프로필 이미지 -> 기본 축제 이미지
  const festivalImage = 
    item.room_image_url || item.ROOM_IMAGE_URL || 
    item.room_image || item.ROOM_IMAGE || 
    item.profile_image_url || item.PROFILE_IMAGE_URL || 
    'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=300';
  
  // 🌟 상단 타이틀에서 ' 공식 모임' 제거한 순수 축제명 추출
  const festivalName = roomTitle ? roomTitle.replace(' 공식 모임', '') : '';

  return (
    <Link 
      to={`/community/gathering/${roomId}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all flex flex-col"
    >
      <div className="relative h-32 overflow-hidden">
        <img 
          src={festivalImage} 
          alt={festivalName} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-3 left-4">
          <span className="text-[10px] font-black text-white bg-purple-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
            Official
          </span>
          <h4 className="text-white font-black text-sm mt-1">{festivalName}</h4>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="font-bold text-gray-900 text-sm mb-3 line-clamp-1 group-hover:text-[var(--festival-purple)] transition-colors">
          {roomTitle}
        </h5>
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            <MapPin className="w-3 h-3" /> {freeLocation}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              <CalendarDays className="w-3 h-3" /> {freeDate}
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-black ${isFull ? 'text-red-500' : 'text-purple-600'}`}>
              <Users className="w-3 h-3" /> {currentCount}/{maxCapacity}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FestivalGridCard;