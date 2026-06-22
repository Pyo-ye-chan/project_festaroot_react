import React from 'react';
import { Calendar, ArrowRight, Info } from 'lucide-react';
import FestivalGridCard from './FestivalGridCard';
import GatheringListItem from './GatheringListItem';

const FestivalGatheringSection = ({ activeTab, festivalRooms, onTabChange, keyword }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className={`flex items-center justify-between p-8 ${activeTab === '전체 모임' ? 'pb-4' : 'border-b border-gray-50'}`}>
      <div className="flex items-center gap-3">
        <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">축제별 모임</h3>
          {activeTab === '축제별 모임' && (
            <p className="text-xs text-gray-400 font-medium mt-1">
              가고 싶은 전국 축제를 선택하고 함께 동행할 매력적인 메이트를 구해보세요!
            </p>
          )}
        </div>
      </div>
      {activeTab === '전체 모임' && (
        <button
          onClick={() => onTabChange('축제별 모임')}
          className="text-xs font-black text-gray-400 hover:text-purple-600 flex items-center gap-1 group"
        >
          더보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>

    {festivalRooms.length === 0 ? (
      <div className="py-20 text-center">
        <Info className="w-12 h-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-400 font-black">
          {keyword ? '검색 결과와 일치하는 축제 모임이 없습니다.' : '현재 개설된 축제 모임이 없습니다.'}
        </p>
      </div>
    ) : activeTab === '전체 모임' ? (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-8 pt-4">
        {festivalRooms.slice(0, 3).map(gathering => (
          <FestivalGridCard key={gathering.room_id} item={gathering} />
        ))}
      </div>
    ) : (
      <div className="divide-y divide-gray-50">
        {festivalRooms.map(gathering => (
          <GatheringListItem key={gathering.room_id} item={gathering} isFestival={true} activeTab={activeTab} />
        ))}
      </div>
    )}
  </section>
);

export default FestivalGatheringSection;