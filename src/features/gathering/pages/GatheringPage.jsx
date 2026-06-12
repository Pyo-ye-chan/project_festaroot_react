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

  const [festivalRooms, setFestivalRooms] = useState([]); 
  const [freeGatherings, setFreeGatherings] = useState([]); 
  const [joinedRooms, setJoinedRooms] = useState([]); 

  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  const categories = ['전체 모임', '축제별 모임', '자유 모임', '참여중인 모임'];

  // 1️⃣ 메인 모임 목록 조회 (백엔드 날것의 데이터 그대로 직결)
  useEffect(() => {
    const fetchMainGatherings = async () => {
      try {
        const [festivalData, freeData] = await Promise.all([
          gatheringApi.festivalGatheringList(loggedInUserId),
          gatheringApi.freeGatheringList()
        ]);

        // 어떠한 가공문도 쓰지 않고 상태값에 그대로 밀어 넣습니다.
        setFestivalRooms(festivalData);
        setFreeGatherings(freeData);
      } catch (error) {
        console.error("메인 모임 목록 로드 중 에러 발생:", error);
      }
    };

    if (loggedInUserId) {
      fetchMainGatherings();
    }
  }, [loggedInUserId]);

  // 2️⃣ 참여중인 모임 목록 조회 (가공문 전면 폐기)
  useEffect(() => {
    const fetchJoinedGatherings = async () => {
      if (!loggedInUserId) return;
      try {
        if (typeof gatheringApi.getJoinedGatherings === 'function') {
          const joinedData = await gatheringApi.getJoinedGatherings(loggedInUserId);
          setJoinedRooms(joinedData);
        }
      } catch (error) {
        console.error("참여중인 모임 로드 중 오류 발생:", error);
      }
    };

    fetchJoinedGatherings();
  }, [loggedInUserId, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 참여중인 모임 필터링 로직 (완전 스네이크 규격 적용)
  const getJoinedItems = () => {
    let combined = [...joinedRooms];

    // 가입한 날짜 최신순 정렬 (joined_at)
    combined.sort((a, b) => new Date(b.joined_at) - new Date(a.joined_at));

    if (joinedFilter === '축제별 모임') return combined.filter(i => i.room_type === 'festival');
    if (joinedFilter === '자유 모임') return combined.filter(i => i.room_type === 'free' || i.room_type === 'group');
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