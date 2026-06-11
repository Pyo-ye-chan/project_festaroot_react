import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, CalendarDays, Users } from 'lucide-react';

const FestivalGridCard = ({ item }) => (
  <Link 
    to={`/community/gathering/${item.id}`}
    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl hover:shadow-purple-100/50 transition-all flex flex-col"
  >
    <div className="relative h-32 overflow-hidden">
      <img src={item.image} alt={item.festivalName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="absolute bottom-3 left-4">
        <span className="text-[10px] font-black text-white bg-purple-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
          Official
        </span>
        <h4 className="text-white font-black text-sm mt-1">{item.festivalName}</h4>
      </div>
    </div>
    <div className="p-4 flex flex-col flex-grow">
      <h5 className="font-bold text-gray-900 text-sm mb-3 line-clamp-1 group-hover:text-[var(--festival-purple)] transition-colors">
        {item.title}
      </h5>
      <div className="mt-auto space-y-1.5">
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
          <MapPin className="w-3 h-3" /> {item.location}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400">
            <CalendarDays className="w-3 h-3" /> {item.date}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-black text-purple-600">
            <Users className="w-3 h-3" /> {item.current}/{item.max}
          </div>
        </div>
      </div>
    </div>
  </Link>
);

export default FestivalGridCard;
