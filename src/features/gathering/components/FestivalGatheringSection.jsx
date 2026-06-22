import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import FestivalGridCard from './FestivalGridCard';
import GatheringListItem from './GatheringListItem';

const FestivalGatheringSection = ({ activeTab, festivalRooms, onTabChange }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className={`flex items-center justify-between p-8 ${activeTab === '전체 모임' ? 'pb-4' : 'border-b border-gray-50'}`}>
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 rounded-2xl text-[var(--festival-purple)]">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">축제별 모임</h3>
          {activeTab === '축제별 모임' && (
            <p className="text-xs text-gray-400 font-medium mt-1">
              축제 정보에 관심이 있다면, 모임에 참여해 채팅방으로 대화를 나눠보세요!
            </p>
          )}
        </div>
      </div>
      {activeTab === '전체 모임' && (
        <button 
          onClick={() => onTabChange('축제별 모임')}
          className="text-xs font-black text-gray-400 hover:text-[var(--festival-purple)] flex items-center gap-1 group"
        >
          더보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
    
    {activeTab === '전체 모임' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8 pt-4">
        {festivalRooms.slice(0, 3).map(room => (
          <FestivalGridCard key={room.room_id} item={room} />
        ))}
      </div>
    ) : (
      <div className="divide-y divide-gray-50">
        {festivalRooms.map(room => (
          <GatheringListItem key={room.room_id} item={room} isFestival={true} activeTab={activeTab} />
        ))}
      </div>
    )}
  </section>
);

export default FestivalGatheringSection;