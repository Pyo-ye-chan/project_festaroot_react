import React, { useEffect, useState } from 'react';
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
import useGatheringStore from '../../../store/useGatheringStore';

const GatheringPage = () => {
  // 💡 전역 스토어 상태 구조 분해 할당
  const {
    activeTab,
    currentPage,
    joinedFilter,
    setActiveTab,
    setCurrentPage,
    setJoinedFilter
  } = useGatheringStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [keyword, setKeyword] = useState('');

  // 🌟 페이지네이션 관련 상태
  const [totalItems, setTotalItems] = useState(0); 
  const ITEMS_PER_PAGE = 5;

  const [festivalRooms, setFestivalRooms] = useState([]);
  const [freeGatherings, setFreeGatherings] = useState([]);
  const [joinedRooms, setJoinedRooms] = useState([]);

  const { user } = useAuthStore();
  const loggedInUserId = user?.member_id || user?.id;

  // 🌟 [수정] 비회원일 경우 '참여중인 모임' 탭을 배열에서 제외하여 렌더링 차단
  const categories = loggedInUserId 
    ? ['전체 모임', '축제별 모임', '자유 모임', '참여중인 모임']
    : ['전체 모임', '축제별 모임', '자유 모임'];

  // 🌟 DB 연동 페이징 메인 로직 수정 (비회원 대응)
  useEffect(() => {
    // 혹시라도 비회원이 전역 스토어 상태 등의 이유로 '참여중인 모임' 탭에 위치해 있다면 '전체 모임'으로 강제 이동
    if (!loggedInUserId && activeTab === '참여중인 모임') {
      setActiveTab('전체 모임');
      return;
    }

    const fetchGatheringData = async () => {
      // ❌ [삭제] if (!loggedInUserId) return; -> 비회원도 아래 API 호출이 가능하도록 차단 해제

      try {
        // 비회원일 때는 백엔드에 ID 값 대신 null 또는 빈 문자열이 넘어가도록 처리 (백엔드 스펙에 맞춤)
        const currentUserId = loggedInUserId || null;

        if (activeTab === '전체 모임') {
          const [festivalData, freeData] = await Promise.all([
            gatheringApi.festivalGatheringList(currentUserId, 1, 4),
            gatheringApi.freeGatheringList(currentUserId, 1, 4)
          ]);
          
          const fList = festivalData.list || [];
          const gList = freeData.list || [];
          
          setFestivalRooms(fList);
          setFreeGatherings(gList);
          setTotalItems(0); // 전체 모임 탭에서는 하단 네비게이션을 숨김
        } 

        else if (activeTab === '축제별 모임') {
          const res = await gatheringApi.festivalGatheringList(currentUserId, currentPage, ITEMS_PER_PAGE, keyword);
          
          const list = res.list || [];
          const total = res.pageInfo?.totalCount || 0; 
          
          setFestivalRooms(list);
          setTotalItems(total);
        } 

        else if (activeTab === '자유 모임') {
          const res = await gatheringApi.freeGatheringList(currentUserId, currentPage, ITEMS_PER_PAGE, keyword);
          
          const list = res.list || [];
          const total = res.pageInfo?.totalCount || 0; 
          
          setFreeGatherings(list);
          setTotalItems(total);
        }
      } catch (error) {
        console.error("데이터 로드 중 에러 발생:", error);
      }
    };

    fetchGatheringData();
  }, [loggedInUserId, activeTab, currentPage, keyword, setActiveTab]);


  // 🌟 참여중인 모임 전용 페이징/필터 이펙트 (로그인 유저 전용 제어 유지)
  useEffect(() => {
    const fetchJoinedData = async () => {
      if (!loggedInUserId || activeTab !== '참여중인 모임') return;
      try {
        const res = await gatheringApi.getJoinedGatherings(loggedInUserId, currentPage, ITEMS_PER_PAGE, joinedFilter, keyword);
        
        const list = res.list || [];
        const total = res.pageInfo?.totalCount || 0; 
        
        setJoinedRooms(list);
        setTotalItems(total);
      } catch (error) {
        console.error("참여중인 모임 로드 오류:", error);
      }
    };

    fetchJoinedData();
  }, [loggedInUserId, activeTab, currentPage, joinedFilter, keyword]);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setKeyword(''); // 탭 변경 시 검색어 초기화
    setCurrentPage(1); // 탭 변경 시 1페이지로 이동
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 참여중인 모임 필터 변경 핸들러
  const handleFilterChange = (filter) => {
    setJoinedFilter(filter);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
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
                  festivalRooms={festivalRooms}
                  onTabChange={handleTabChange}
                />
              )}

              {/* 자유 모임 섹션 */}
              {(activeTab === '전체 모임' || activeTab === '자유 모임') && (
                <FreeGatheringSection
                  activeTab={activeTab}
                  freeGatherings={freeGatherings}
                  onTabChange={handleTabChange}
                />
              )}

              {/* 참여중인 모임 섹션 (로그인했을 때만 보이도록 조건부 렌더링 보안 강화) */}
              {loggedInUserId && activeTab === '참여중인 모임' && (
                <JoinedGatheringSection
                  joinedFilter={joinedFilter}
                  onFilterChange={handleFilterChange}
                  joinedItems={joinedRooms}
                  activeTab={activeTab}
                />
              )}
            </div>

            {/* 하단 페이지네이션 바 */}
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