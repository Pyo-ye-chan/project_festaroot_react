import { create } from 'zustand';

const useMapStore = create((set) => ({
  // 검색 필터 상태
  searchParams: {
    selectedFestival: {
      name: "태안 세계튤립축제",
      period: "2025.04.12 ~ 2025.05.07",
      location: "충청남도 태안군",
      image: "https://images.unsplash.com/photo-1526310283981-d25a8166c4c0?w=150&q=80"
    },
    radius: 5,
    startDate: "2025-04-12",
    endDate: "2025-05-07",
    categories: {
      food: true,
      tour: true,
      festival: true
    }
  },

  // 현재 선택된 카테고리 탭 (전체, 음식점, 관광지, 축제/행사)
  activeCategory: '전체',

  // 추천 장소 데이터
  places: [
    { id: 1, title: "태안 회센터", category: "한식·해산물", rating: 4.6, reviews: 125, distance: "1.2km", tag: "신선한 해산물", img: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=200&q=80", type: 'food' },
    { id: 2, title: "꽃지 해물칼국수", category: "한식·해산물", rating: 4.4, reviews: 98, distance: "2.3km", tag: "바다 전망", img: "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=200&q=80", type: 'food' },
    { id: 3, title: "안면도 게국지", category: "한식", rating: 4.7, reviews: 156, distance: "3.8km", tag: "게국지 전문", img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80", type: 'food' },
    { id: 4, title: "꽃지 해수욕장", category: "자연관광지", rating: 4.8, reviews: 312, distance: "1.8km", tag: "낙조 명소", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80", type: 'tour' },
  ],

  // Actions
  setSelectedFestival: (festival) => set((state) => ({
    searchParams: { ...state.searchParams, selectedFestival: festival }
  })),

  setRadius: (radius) => set((state) => ({
    searchParams: { ...state.searchParams, radius }
  })),

  setDates: (startDate, endDate) => set((state) => ({
    searchParams: { ...state.searchParams, startDate, endDate }
  })),

  toggleCategory: (categoryKey) => set((state) => ({
    searchParams: {
      ...state.searchParams,
      categories: {
        ...state.searchParams.categories,
        [categoryKey]: !state.searchParams.categories[categoryKey]
      }
    }
  })),

  setActiveCategory: (category) => set({ activeCategory: category }),

  resetFilters: () => set({
    searchParams: {
      selectedFestival: {
        name: "태안 세계튤립축제",
        period: "2025.04.12 ~ 2025.05.07",
        location: "충청남도 태안군",
        image: "https://images.unsplash.com/photo-1526310283981-d25a8166c4c0?w=150&q=80"
      },
      radius: 5,
      startDate: "2025-04-12",
      endDate: "2025-05-07",
      categories: {
        food: true,
        tour: true,
        festival: true
      }
    },
    activeCategory: '전체'
  })
}));

export default useMapStore;
