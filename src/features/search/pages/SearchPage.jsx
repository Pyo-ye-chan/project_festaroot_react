import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import festivalService from '../../../api/festivalService';
import RegionService from '../../../api/regionService';
import useAuthStore from '../../../store/useAuthStore';
import { saveActivityLog } from '../../../api/activityApi';
import useFestivalLikeStore from '../../../store/useFestivalLikeStore';
import useFestivalFilterStore from '../../../store/useFestivalFilterStore';

import SearchHeader from '../components/SearchHeader';
import SearchSidebar from '../components/SearchSidebar';
import SearchToolbar from '../components/SearchToolbar';
import SearchContent from '../components/SearchContent';
import SearchPagination from '../components/SearchPagination';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  // 1. Store Hooks 선언
  const { likedFestivals, toggleLike, setInitialLikes } = useFestivalLikeStore();
  const { isLoggedIn, user } = useAuthStore();
  const userId = user?.userId || user?.id || user?.member_id;
  
  const {
    searchQuery, setSearchQuery,
    searchScope, setSearchScope,
    showOngoingOnly, setShowOngoingOnly,
    filterRegion, setFilterRegion,
    filterSigungu, setFilterSigungu,
    startDate, setStartDate,
    endDate, setEndDate,
    sortBy, setSortBy,
    currentPage, setCurrentPage,
    viewMode,
    resetFilters
  } = useFestivalFilterStore();

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isSigunguOpen, setIsSigunguOpen] = useState(false);
  const [festivals, setFestivals] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);
  const [sidoList, setSidoList] = useState([{ region_code: '', region_name: '전체' }]);
  const [sigunguList, setSigunguList] = useState([{ sigungu_code: '', sigungu_name: '전체' }]);
  const [pageInfo, setPageInfo] = useState({
    startPage: 1, endPage: 1, existPrev: false, existNext: false, totalCount: 0
  });

  const ITEMS_PER_PAGE = 9;
  const sortOptions = ['popular', 'date', 'views'];
  const totalPages = Math.ceil(pageInfo.totalCount / ITEMS_PER_PAGE) || 1;

  // [★수정] 무작위 렌더링 및 F5 레이스 컨디션을 방지하기 위한 초기화 완료 플래그 상태 추가
  const [isInitialized, setIsInitialized] = useState(false);

  // 2. 데이터 페치 함수 정의
  const fetchAllFestivals = async (customParams = {}) => {
    try {
      setIsDataLoading(true);
      const targetPage = customParams.page !== undefined ? customParams.page : currentPage;

      const rawParams = {
        sort: sortBy,
        keyword: searchQuery?.trim() || null,
        searchScope,
        event_start_date: startDate ? startDate.replace(/-/g, '') : null,
        event_end_date: endDate ? endDate.replace(/-/g, '') : null,
        region_code: filterRegion.region_code || null,
        sigungu_code: filterSigungu.sigungu_code || null,
        page: targetPage,
        size: ITEMS_PER_PAGE,
        ongoingOnly: showOngoingOnly,
        ...customParams
      };

      const cleanedParams = Object.fromEntries(
        Object.entries(rawParams).filter(([_, value]) => value !== null && value !== '')
      );

      const response = await festivalService.getFestivals(cleanedParams);
      const data = response?.data || response;

      setFestivals(Array.isArray(data.list) ? data.list : []);
      if (data.pageInfo) setPageInfo(data.pageInfo);
    } catch (error) {
      console.error("데이터 로드 실패:", error);
      setFestivals([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  // 3. [★수정] URL 파라미터를 Zustand 스토어 상태와 깨끗하게 동기화 후 초기화 완료 처리
  useEffect(() => {
    const initialSort = searchParams.get('sort') || location.state?.sort || 'popular';
    const initialOngoing = searchParams.get('ongoingOnly') === 'true' || !!location.state?.ongoingOnly;
    const initialKeyword = searchParams.get('keyword') || location.state?.keyword || ''; 

    setSortBy(initialSort);
    setShowOngoingOnly(initialOngoing);
    setSearchQuery(initialKeyword); 

    if (currentPage !== 1) {
      setCurrentPage(1);
    }

    // 초기 주입이 완벽히 끝났음을 명시
    setIsInitialized(true);
  }, [searchParams, location.state]); 

  // 4. [★수정] 핵심 상태 변경 감지 페치 (초기 동기화가 완전히 끝난 직후부터 안전하게 반응)
  useEffect(() => {
    if (!isInitialized) return; // URL 동기화 전 스태일(stale) 데이터 호출 가드

    fetchAllFestivals();
  }, [sortBy, currentPage, showOngoingOnly, isInitialized]);

  const handleFestivalClick = async (contentId) => {
    try {
      await festivalService.increaseViewCount(contentId);
    } catch (error) {
      console.error("조회수 증가 실패:", error);
    } finally {
      navigate(`/festival/${contentId}`);
    }
  };

  const handleLikeToggle = async (e, contentId) => {
    e.preventDefault();
    e.stopPropagation();

    if (likeLoading) return;

    setLikeLoading(true);
    const numericId = Number(contentId);
    const isCurrentlyLiked = likedFestivals?.has?.(numericId);

    try {
      const response = await festivalService.toggleFestivalLike(numericId, { isLiked: !isCurrentlyLiked });
      toggleLike(numericId);

      const updatedLikeCount = response?.data?.like_count ?? (isCurrentlyLiked ? (festivals.find(f => f.content_id === numericId)?.like_count || 1) - 1 : (festivals.find(f => f.content_id === numericId)?.like_count || 0) + 1);

      setFestivals((prev) =>
        prev.map((fest) =>
          fest.content_id === numericId
            ? { ...fest, like_count: Math.max(0, updatedLikeCount) }
            : fest
        )
      );
    } catch (error) {
      console.error("DB 찜 상태 동기화 실패:", error);
      alert("찜 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLikeLoading(false);
    }
  };

  useEffect(() => {
    const fetchSidoData = async () => {
      try {
        const response = await RegionService.regionList();
        const data = response?.data || response;
        if (Array.isArray(data)) {
          setSidoList([{ region_code: '', region_name: '전체' }, ...data]);
        }
      } catch (error) {
        console.error("시도 로드 실패:", error);
      }
    };
    fetchSidoData();
  }, []);

  useEffect(() => {
    const fetchSigunguData = async () => {
      if (!filterRegion.region_code) {
        setSigunguList([{ sigungu_code: '', sigungu_name: '전체' }]);
        return;
      }
      try {
        const response = await RegionService.sigunguList(filterRegion.region_code);
        const data = response?.data || response;
        if (Array.isArray(data)) {
          setSigunguList([{ sigungu_code: '', sigungu_name: '전체' }, ...data]);
        }
      } catch (error) {
        console.error("시군구 로드 실패:", error);
      }
    };
    fetchSigunguData();
  }, [filterRegion.region_code]);

  useEffect(() => {
    if (isLoggedIn && userId) {
      festivalService.getMyFestivalLikedIds(userId)
        .then(response => {
          const ids = response?.data || response;
          const normalizedIds = Array.isArray(ids)
            ? ids.map(item => item && typeof item === 'object' ? Number(item.content_id || item.id) : Number(item))
            : [];
          setInitialLikes(normalizedIds);
        })
        .catch(error => {
          console.error("찜 목록 초기화 실패:", error);
          setInitialLikes([]);
        });
    } else {
      setInitialLikes([]);
    }
  }, [isLoggedIn, userId, setInitialLikes]);

  const handleResetClick = () => {
    const isAlreadyDefault =
      sortBy === 'popular' &&
      currentPage === 1 &&
      !showOngoingOnly;

    resetFilters();

    if (isAlreadyDefault) {
      fetchAllFestivals({
        sort: 'popular', keyword: '', searchScope: 'title',
        region_code: null, sigungu_code: null, event_start_date: null, event_end_date: null,
        page: 1, ongoingOnly: false
      });
    }
  };

  const handleSearchSubmit = () => {
    if (currentPage === 1) {
      fetchAllFestivals({ page: 1 });
    } else {
      setCurrentPage(1);
    }

    if (isLoggedIn && searchQuery.trim()) {
      saveActivityLog({ type: 'SEARCH', searchQuery: searchQuery });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-['Pretendard'] pb-20">
      <SearchHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <SearchSidebar 
            sidoList={sidoList}
            sigunguList={sigunguList}
            isRegionOpen={isRegionOpen}
            setIsRegionOpen={setIsRegionOpen}
            isSigunguOpen={isSigunguOpen}
            setIsSigunguOpen={setIsSigunguOpen}
            handleSearchSubmit={handleSearchSubmit}
            handleResetClick={handleResetClick}
          />

          <main className="flex-grow min-w-0">
            <SearchToolbar 
              totalCount={pageInfo.totalCount}
              isSortOpen={isSortOpen}
              setIsSortOpen={setIsSortOpen}
              sortOptions={sortOptions}
            />

            {isDataLoading ? (
              <div className="flex justify-center items-center py-40">
                <div className="w-10 h-10 border-4 border-[#5821B6] border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <>
                <SearchContent 
                  festivals={festivals}
                  viewMode={viewMode}
                  isLoggedIn={isLoggedIn}
                  likedFestivals={likedFestivals}
                  handleFestivalClick={handleFestivalClick}
                  handleLikeToggle={handleLikeToggle}
                />
                
                {festivals.length > 0 && (
                  <SearchPagination 
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageInfo={pageInfo}
                    totalPages={totalPages}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;