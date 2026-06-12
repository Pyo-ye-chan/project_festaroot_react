import React, { useEffect, useState } from 'react';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import CreateGatheringModal from '../components/CreateGatheringModal';
import GatheringHeader from '../components/GatheringHeader';
import GatheringFilters from '../components/GatheringFilters';
import FestivalGatheringSection from '../components/FestivalGatheringSection';
import FreeGatheringSection from '../components/FreeGatheringSection';
import JoinedGatheringSection from '../components/JoinedGatheringSection';
import gatheringApi from '../../../api/gatheringApi';
import useAuthStore from '../../../store/useAuthStore';

const GatheringPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('전체 모임');
  const [keyword, setKeyword] = useState('');
  const [joinedFilter, setJoinedFilter] = useState('전체');

  const [festivalRooms, setFestivalRooms] = useState([]); // 💡 DB 연동 축제 모임 상태 관리
  const [freeGatherings, setFreeGatherings] = useState([]); // 자유 모임 목록

  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  const categories = ['전체 모임', '축제별 모임', '자유 모임', '참여중인 모임'];

  // 💡 축제 모임과 자유 모임을 통합하여 API 동적 조회 수행
  useEffect(() => {
    const fetchAllGatherings = async () => {
      try {
        const [festivalData, freeData] = await Promise.all([
          gatheringApi.festivalGatheringList(loggedInUserId),
          gatheringApi.freeGatheringList()
        ]);

        // 💡 Oracle DB 대문자 Map 결과를 기존 프론트엔드 카멜/소문자 규격에 맞게 포맷팅 가공
        const formattedFestivals = festivalData.map(item => ({
          id: Number(item.ROOM_ID),
          type: 'festival',
          festivalName: item.ROOM_TITLE ? item.ROOM_TITLE.replace(' 공식 모임', '') : '',
          title: item.ROOM_TITLE,
          location: item.FREE_LOCATION,
          date: item.FREE_DATE,
          current: item.CURRENT_COUNT || 0,
          max: item.MAX_CAPACITY || 500,
          image: item.FIRST_IMAGE || 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=300',
          isJoined: item.IS_JOINED_INT > 0,
          joinedAt: item.CREATED_AT || '2026-06-12'
        }));

        setFestivalRooms(formattedFestivals);
        setFreeGatherings(freeData);
      } catch (error) {
        console.error("모임 목록 통합 로드 중 에러 발생:", error);
      }
    };

    fetchAllGatherings();
  }, [loggedInUserId]);

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
    if (joinedFilter === '개설한 모임') {
      return combined.filter(i => String(i.owner_id) === String(loggedInUserId));
    }
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