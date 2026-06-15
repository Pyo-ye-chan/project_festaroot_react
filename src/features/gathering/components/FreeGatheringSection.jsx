import React from 'react';
import { Users, ArrowRight } from 'lucide-react';
import FreeGridCard from './FreeGridCard';
import GatheringListItem from './GatheringListItem';

const FreeGatheringSection = ({ activeTab, freeGatherings, onTabChange }) => (
  <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
    <div className={`flex items-center justify-between p-8 ${activeTab === '전체 모임' ? 'pb-4' : 'border-b border-gray-50'}`}>
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-900">자유 모임</h3>
          {activeTab === '자유 모임' && (
            <p className="text-xs text-gray-400 font-medium mt-1">
              관심사가 비슷한 사람들을 찾아 자유롭게 소통하고 축제 메이트가 되어보세요!
            </p>
          )}
        </div>
      </div>
      {activeTab === '전체 모임' && (
        <button 
          onClick={() => onTabChange('자유 모임')}
          className="text-xs font-black text-gray-400 hover:text-blue-600 flex items-center gap-1 group"
        >
          더보기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>

    {activeTab === '전체 모임' ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 pt-4">
        {freeGatherings.slice(0, 4).map(gathering => (
          <FreeGridCard key={gathering.room_id} item={gathering} />
        ))}
      </div>
    ) : (
      <div className="divide-y divide-gray-50">
        {freeGatherings.map(gathering => (
          <GatheringListItem key={gathering.room_id} item={gathering} isFestival={false} activeTab={activeTab} />
        ))}
      </div>
    )}
  </section>
);

export default FreeGatheringSection;
