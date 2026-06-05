import { create } from 'zustand';

// 검색/필터 전역 스토어(검색 조건 보존 담당)
const useFestivalFilterStore = create((set) => ({
  searchQuery: '',
  searchScope: 'title',
  showOngoingOnly: false,
  filterRegion: { region_code: '', region_name: '전체' },
  filterSigungu: { sigungu_code: '', sigungu_name: '전체' },
  startDate: '',
  endDate: '',
  sortBy: '인기순',
  currentPage: 1,
  viewMode: 'grid',

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSearchScope: (scope) => set({ searchScope: scope }),
  setShowOngoingOnly: (ongoing) => set({ showOngoingOnly: ongoing }),
  setFilterRegion: (region) => set({ filterRegion: region }),
  setFilterSigungu: (sigungu) => set({ filterSigungu: sigungu }),
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
  setSortBy: (sort) => set({ sortBy: sort }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setViewMode: (mode) => set({ viewMode: mode }),

  resetFilters: () => set({
    searchQuery: '',
    searchScope: 'title',
    showOngoingOnly: false,
    filterRegion: { region_code: '', region_name: '전체' },
    filterSigungu: { sigungu_code: '', sigungu_name: '전체' },
    startDate: '',
    endDate: '',
    sortBy: '인기순',
    currentPage: 1,
  }),
}));

export default useFestivalFilterStore;