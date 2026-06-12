import React from 'react';
import { Link } from 'react-router-dom';
import { Users, MapPin, CalendarDays } from 'lucide-react';

const FreeGridCard = ({ item }) => { // 전체 자유 모임 목록 4개
  const isFull = item.current_count >= item.max_capacity;

  // 💡 프로필 이미지가 아닌 모임 생성 시 등록한 이미지를 우선적으로 보여줍니다.
  const gatheringImage = item.room_image_url || item.profile_image_url || 'https://picsum.photos/seed/gathering/300/200';

  return (
    <Link
      to={`/community/gathering/${item.room_id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all flex flex-col"
    >
      <div className="relative h-32 w-full overflow-hidden">
        <img 
          src={gatheringImage} 
          alt={item.room_title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-2 left-2">
          <span className="text-[10px] font-black bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-blue-600 shadow-sm">
            {item.nickname}
          </span>
        </div>
      </div>
      
      <div className="p-4 flex-grow min-w-0">
        <h5 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors mb-2">
          {item.room_title}
        </h5>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 shrink-0">
              <CalendarDays className="w-3 h-3" />
              {item.free_date}
            </div>
            {item.free_location && (
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 truncate">
                <span className="w-0.5 h-0.5 rounded-full bg-gray-300 shrink-0" />
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{item.free_location}</span>
              </div>
            )}
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-black shrink-0 ml-2 ${isFull ? 'text-red-500' : 'text-blue-600'}`}>
            <Users className="w-3 h-3" /> {item.current_count}/{item.max_capacity}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FreeGridCard;
