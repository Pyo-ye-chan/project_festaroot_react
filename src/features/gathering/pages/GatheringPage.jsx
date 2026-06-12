import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import CreateGatheringModal from '../components/CreateGatheringModal';
import GatheringHeader from '../components/GatheringHeader';
import GatheringFilters from '../components/GatheringFilters';
import FestivalGatheringSection from '../components/FestivalGatheringSection';
import FreeGatheringSection from '../components/FreeGatheringSection';
import JoinedGatheringSection from '../components/JoinedGatheringSection';
import Pagination from '../components/Pagination'; 
import gatheringApi from '../../../api/gatheringApi';
import useAuthStore from '../../../store/useAuthStore';

const GatheringPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // 💡 URL 파라미터에서 현재 탭과 페이지 정보를 가져옴
  const activeTab = searchParams.get('tab') || '전체 모임';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [joinedFilter, setJoinedFilter] = useState('전체');

  // 🌟 페이지네이션 관련 상태
  const [totalItems, setTotalItems] = useState(0); // DB에서 받아올 전체 아이템 수
  const ITEMS_PER_PAGE = 5; 

  const [festivalRooms, setFestivalRooms] = useState([]); 
  const [freeGatherings, setFreeGatherings] = useState([]); 
  const [joinedRooms, setJoinedRooms] = useState([]); 

  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  const categories = ['전체 모임', '축제별 모임', '자유 모임', '참여중인 모임'];

  // 🌟 DB 연동 페이징 메인 로직
  useEffect(() => {
    const fetchGatheringData = async () => {
      if (!loggedInUserId) return;

      try {
        if (activeTab === '전체 모임') {
          // 대시보드 형태의 전체 화면일 때는 페이징 없이 상위 4개씩만 요청해서 꽂아줌
          const [festivalData, freeData] = await Promise.all([
            gatheringApi.festivalGatheringList(loggedInUserId, 1, 4),
            gatheringApi.freeGatheringList(1, 4)
          ]);
          setFestivalRooms(festivalData.list || festivalData);
          setFreeGatherings(freeData.list || freeData);
          setTotalItems(0); // 전체 모임 탭에서는 하단 네비게이션을 숨김
        } 
        
        else if (activeTab === '축제별 모임') {
          const res = await gatheringApi.festivalGatheringList(loggedInUserId, currentPage, ITEMS_PER_PAGE);
          setFestivalRooms(res.list || []);
          setTotalItems(res.total_count || 0); // DB에서 받아온 실제 카운트 적용
        } 
        
        else if (activeTab === '자유 모임') {
          const res = await gatheringApi.freeGatheringList(currentPage, ITEMS_PER_PAGE);
          setFreeGatherings(res.list || []);
          setTotalItems(res.total_count || 0);
        }
      } catch (error) {
        console.error("데이터 로드 중 에러 발생:", error);
      }
    };

    fetchGatheringData();
  }, [loggedInUserId, activeTab, currentPage]); // 🌟 탭이나 페이지 번호가 바뀌면 DB 자동 재요청

  // 🌟 참여중인 모임 전용 페이징/필터 이펙트
  useEffect(() => {
    const fetchJoinedData = async () => {
      if (!loggedInUserId || activeTab !== '참여중인 모임') return;
      try {
        const res = await gatheringApi.getJoinedGatherings(loggedInUserId, currentPage, ITEMS_PER_PAGE, joinedFilter);
        setJoinedRooms(res.list || []);
        setTotalItems(res.total_count || 0);
      } catch (error) {
        console.error("참여중인 모임 로드 오류:", error);
      }
    };

    fetchJoinedData();
  }, [loggedInUserId, activeTab, currentPage, joinedFilter]); // 🌟 서브 필터 변경 시에도 DB 재요청

  // 탭 변경 핸들러 (URL 파라미터 업데이트)
  const handleTabChange = (tab) => {
    setSearchParams({ tab, page: 1 }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 참여중인 모임 필터 변경 핸들러
  const handleFilterChange = (filter) => {
    setJoinedFilter(filter);
    setSearchParams({ tab: activeTab, page: 1 }, { replace: true });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setSearchParams({ tab: activeTab, page }, { replace: true });
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              {/* 축제별 모임 섹션 */}
              {(activeTab === '전체 모임' || activeTab === '축제별 모임') && (
                <FestivalGatheringSection
                  activeTab={activeTab}
                  festivalRooms={festivalRooms} // 🌟 이제 이미 DB에서 잘려온 데이터이므로 그대로 전달
                  onTabChange={handleTabChange}
                />
              )}

              {/* 자유 모임 섹션 */}
              {(activeTab === '전체 모임' || activeTab === '자유 모임') && (
                <FreeGatheringSection
                  activeTab={activeTab}
                  freeGatherings={freeGatherings} // 🌟 그대로 전달
                  onTabChange={handleTabChange}
                />
              )}

              {/* 참여중인 모임 섹션 */}
              {activeTab === '참여중인 모임' && (
                <JoinedGatheringSection
                  joinedFilter={joinedFilter}
                  onFilterChange={handleFilterChange}
                  joinedItems={joinedRooms} // 🌟 그대로 전달
                  activeTab={activeTab}
                />
              )}
            </div>

            {/* 🌟 하단 네비게이션바 바인딩 ('전체 모임'이 아니고 데이터가 존재할 때만 노출) */}
            {activeTab !== '전체 모임' && totalItems > 0 && (
              <Pagination
                currentPage={currentPage}
                totalItems={totalItems}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={handlePageChange}
              />
            )}
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