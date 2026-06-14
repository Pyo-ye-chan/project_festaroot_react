import { create } from 'zustand';

// 모임 페이지의 상태(탭, 페이지 번호, 필터 등)를 전역으로 관리하여 
// 상세 페이지 이동 후 돌아와도 URL 파라미터 없이 상태를 복구할 수 있게 합니다.
const useGatheringStore = create((set) => ({
  activeTab: '전체 모임',
  currentPage: 1,
  joinedFilter: '전체',

  setActiveTab: (tab) => set({ activeTab: tab, currentPage: 1 }), // 탭 변경 시 페이지는 항상 1로 초기화
  setCurrentPage: (page) => set({ currentPage: page }),
  setJoinedFilter: (filter) => set({ joinedFilter: filter, currentPage: 1 }), // 필터 변경 시에도 페이지 1로 초기화

  // 상태 초기화가 필요한 경우 사용
  resetGatheringState: () => set({
    activeTab: '전체 모임',
    currentPage: 1,
    joinedFilter: '전체',
  }),
}));

export default useGatheringStore;
