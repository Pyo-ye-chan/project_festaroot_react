import React from 'react';
import { Link } from 'react-router-dom';
import { Users } from 'lucide-react';

const FreeGridCard = ({ item }) => ( // 전체 자유 모임 목록 4개
  <Link
    to={`/community/gathering/${item.room_id}`}
    className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-xl hover:shadow-blue-100/50 transition-all flex items-center gap-3"
  >
    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
      <img src={item.profile_image_url} alt={item.nickname} className="w-full h-full object-cover" />
    </div>
    <div className="flex-grow min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <span className="text-[10px] font-black text-blue-500/80">
          {item.nickname}
        </span>
      </div>
      <h5 className="font-bold text-gray-900 text-sm truncate group-hover:text-blue-600 transition-colors">
        {item.room_title}
      </h5>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[10px] font-bold text-gray-400">{item.free_date}</span>
        <div className="flex items-center gap-1 text-[10px] font-black text-blue-600">
          {/* <Users className="w-3 h-3" /> {item.current}/{item.max_capacity} */}
          <Users className="w-3 h-3" /> {item.current_count}/{item.max_capacity}
        </div>
      </div>
    </div>
  </Link>
);

export default FreeGridCard;
