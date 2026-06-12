import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users } from 'lucide-react';

const FestivalGridCard = ({ item }) => {
  // 🌟 item.current_count와 item.max_capacity로 변경
  const isFull = (item.current_count || 0) >= (item.max_capacity || 500);
  
  // 🌟 상단 타이틀에서 ' 공식 모임' 제거한 순수 축제명 추출
  const festivalName = item.room_title ? item.room_title.replace(' 공식 모임', '') : '';

  return (
    <Link 
      // 🌟 item.id -> item.room_id
      to={`/community/gathering/${item.room_id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all flex flex-col"
    >
      <div className="relative h-32 overflow-hidden">
        {/* 🌟 item.image -> item.profile_image_url (기본 이미지 썸네일 방어코드 포함) */}
        <img 
          src={item.profile_image_url || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=300'} 
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
          {/* 🌟 item.title -> item.room_title */}
          {item.room_title}
        </h5>
        <div className="mt-auto space-y-1.5">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            {/* 🌟 item.location -> item.free_location */}
            <MapPin className="w-3 h-3" /> {item.free_location}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
              {/* 🌟 item.date -> item.free_date */}
              <CalendarDays className="w-3 h-3" /> {item.free_date}
            </div>
            <div className={`flex items-center gap-1 text-[11px] font-black ${isFull ? 'text-red-500' : 'text-purple-600'}`}>
              {/* 🌟 item.current / item.max -> item.current_count / item.max_capacity */}
              <Users className="w-3 h-3" /> {item.current_count || 0}/{item.max_capacity || 500}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FestivalGridCard;