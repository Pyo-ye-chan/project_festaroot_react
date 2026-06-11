import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users, ChevronRight } from 'lucide-react';

// 자유 모임 목록 탭
const GatheringListItem = ({ item, isFestival, showTypeBadge = false, activeTab }) => (
  <Link
    to={`/community/gathering/${item.id || item.room_id}`}
    className="flex items-center gap-4 py-4 px-6 hover:bg-gray-50 transition-all group border-b border-gray-50 last:border-none"
  >
    <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center">
      {isFestival ? (
        <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-100">
          <img src={item.image} alt={item.festivalName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        </div>
      ) : (
        <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-white shadow-sm">
          {/* <img src={item.creator.avatar} alt={item.creator.name} className="w-full h-full object-cover" /> */}
          <img src={item.profile_image_url} alt={item.nickname} className="w-full h-full object-cover" />
        </div>
      )}
    </div>

    <div className="flex-grow min-w-0">
      <div className="flex items-center gap-2 mb-1">
        {showTypeBadge && (
          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${isFestival ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
            }`}>
            {isFestival ? 'Festival' : 'Free'}
          </span>
        )}
        {isFestival ? (
          activeTab !== '참여중인 모임' && (
            <span className="text-[10px] font-black text-[var(--festival-purple)] bg-purple-50 px-2 py-0.5 rounded-md">
              {item.festivalName}
            </span>
          )
        ) : (
          <span className="text-[10px] font-black text-blue-500/80">
            {/* {item.creator.name} */}
            {item.nickname}
          </span>
        )}
      </div>
      <h4 className={`font-bold text-gray-900 truncate transition-colors text-base ${isFestival ? 'group-hover:text-[var(--festival-purple)]' : 'group-hover:text-blue-600'
        }`}>
        {item.room_title}
      </h4>
      <div className="flex items-center gap-4 mt-1.5">
        {isFestival && (
          <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
            <MapPin className="w-3.5 h-3.5" /> {item.free_location}
          </div>
        )}
        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
          <CalendarDays className="w-3.5 h-3.5" /> {item.free_date}
        </div>
        <div className={`flex items-center gap-1 text-[11px] font-black ${isFestival ? 'text-purple-600' : 'text-blue-600'}`}>
          {/* <Users className="w-3.5 h-3.5" /> {item.current}/{item.max_capacity}명 */}
          <Users className="w-3.5 h-3.5" /> {item.current_count || item.current || 1}/{item.max_capacity}명
        </div>
      </div>
    </div>

    <ChevronRight className={`w-5 h-5 text-gray-300 transition-all flex-shrink-0 ${isFestival ? 'group-hover:text-[var(--festival-purple)]' : 'group-hover:text-blue-600'
      } group-hover:translate-x-1`} />
  </Link>
);

export default GatheringListItem;
