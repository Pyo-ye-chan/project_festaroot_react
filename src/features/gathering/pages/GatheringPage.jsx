import React, { useEffect, useState } from 'react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import CreateGatheringModal from '../components/CreateGatheringModal';
import GatheringHeader from '../components/GatheringHeader';
import GatheringFilters from '../components/GatheringFilters';
import FestivalGatheringSection from '../components/FestivalGatheringSection';
import FreeGatheringSection from '../components/FreeGatheringSection';
import JoinedGatheringSection from '../components/JoinedGatheringSection';
import gatheringApi from '../../../api/gatheringApi';

const GatheringPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('전체 모임');
  const [keyword, setKeyword] = useState('');
  const [joinedFilter, setJoinedFilter] = useState('전체');

  const categories = ['전체 모임', '축제별 모임', '자유 모임', '참여중인 모임'];

  const festivalRooms = [
    {
      id: 101,
      type: 'festival',
      festivalName: '부산 록 페스티벌',
      title: '부산 록 페스티벌 채팅방',
      location: '부산 삼락생태공원',
      date: '2026.08.10 - 08.12',
      current: 156,
      max: 500,
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=300',
      isJoined: true,
      joinedAt: '2026-06-01'
    },
    {
      id: 102,
      type: 'festival',
      festivalName: '태안 세계 튤립 축제',
      title: '튤립 축제 메이트 찾기',
      location: '태안 코리아플라워파크',
      date: '2026.04.10 - 05.10',
      current: 84,
      max: 200,
      image: 'https://images.unsplash.com/photo-1554123168-b400f9c806ca?auto=format&fit=crop&q=80&w=300',
      isJoined: false
    },
    {
      id: 103,
      type: 'festival',
      festivalName: '서울 재즈 페스티벌',
      title: '서재페 동행 모집방',
      location: '서울 올림픽공원',
      date: '2026.05.28 - 05.30',
      current: 243,
      max: 1000,
      image: 'https://images.unsplash.com/photo-1514525253361-bee8a19744c1?auto=format&fit=crop&q=80&w=300',
      isJoined: true,
      joinedAt: '2026-06-05'
    },
  ];

  const [freeGatherings, setFreeGatherings] = useState([]); // 자유 모임 목록

  // 💡 올바른 비동기 useEffect 구조로 변경
  useEffect(() => {
    const fetchFreeGatherings = async () => {
      try {
        const data = await gatheringApi.freeGatheringList();
        setFreeGatherings(data);
      } catch (error) {
        console.error("자유 모임 목록을 가져오는 중 오류가 발생했습니다 : ", error);
      }
    };

    fetchFreeGatherings();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 참여중인 모임 필터링 로직
  const getJoinedItems = () => {
    const joinedFestivals = festivalRooms.filter(item => item.isJoined);

    const joinedFrees = freeGatherings.map(item => ({
      ...item,
      id: item.room_id,      
      type: 'free',
      isJoined: true,        
      joinedAt: item.created_at || '2026-06-11'
    }));

    let combined = [...joinedFestivals, ...joinedFrees];
    combined.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));

    if (joinedFilter === '축제별 모임') return combined.filter(i => i.type === 'festival');
    if (joinedFilter === '자유 모임') return combined.filter(i => i.type === 'free');
    return combined;
  };

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9 space-y-8">
            <GatheringHeader onOpenModal={() => setIsModalOpen(true)} />

            <GatheringFilters
              categories={categories}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              keyword={keyword}
              onKeywordChange={setKeyword}
            />

            <div className="grid grid-cols-1 gap-10">
              {(activeTab === '전체 모임' || activeTab === '축제별 모임') && (
                <FestivalGatheringSection
                  activeTab={activeTab}
                  festivalRooms={festivalRooms}
                  onTabChange={handleTabChange}
                />
              )}

              {(activeTab === '전체 모임' || activeTab === '자유 모임') && (
                <FreeGatheringSection
                  activeTab={activeTab}
                  freeGatherings={freeGatherings}
                  onTabChange={handleTabChange}
                />
              )}

              {activeTab === '참여중인 모임' && (
                <JoinedGatheringSection
                  joinedFilter={joinedFilter}
                  onFilterChange={setJoinedFilter}
                  joinedItems={getJoinedItems()}
                  activeTab={activeTab}
                />
              )}
            </div>
          </main>
        </div>
      </div>

      {isModalOpen && (
        <CreateGatheringModal onClose={() => setIsModalOpen(false)} />
      )}
    </div>
  );
};

export default GatheringPage;