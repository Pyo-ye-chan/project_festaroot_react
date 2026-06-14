import React from 'react';
import { LayoutGrid, Info } from 'lucide-react';
import GatheringListItem from './GatheringListItem';

const JoinedGatheringSection = ({ joinedFilter, onFilterChange, joinedItems, activeTab }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className="p-8 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-rose-100 rounded-2xl text-rose-500">
          <LayoutGrid className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-black text-gray-900">참여중인 모임</h3>
      </div>
      
      {/* 토글 필터 */}
      <div className="flex p-1 bg-gray-50 rounded-xl border border-gray-100 self-start md:self-auto">
        {['전체', '축제별 모임', '자유 모임', '개설한 모임'].map(filter => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
              joinedFilter === filter 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
    
    <div className="divide-y divide-gray-50">
      {joinedItems.map(item => (
        <GatheringListItem 
          key={item.room_id} 
          item={item} 
          isFestival={item.room_type === 'festival'} 
          showTypeBadge={true} 
          activeTab={activeTab}
        />
      ))}
      {joinedItems.length === 0 && (
        <div className="py-20 text-center">
          <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-black">해당하는 참여 모임이 없습니다.</p>
        </div>
      )}
    </div>
  </section>
);

export default JoinedGatheringSection;