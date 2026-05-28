import { create } from 'zustand';
import festivalService from '../api/festivalService';
import ktoService from '../api/ktoService';

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const useMapStore = create((set, get) => ({
  // 상태 관리
  festivals: [], // DB에서 가져온 축제 목록
  isLoading: false,
  error: null,

  // 검색 필터 상태
  searchParams: {
    selectedFestival: null, // 초기값 null
    radius: 5,
    startDate: "",
    endDate: "",
    categories: {
      food: true,
      tour: true,
      festival: true
    }
  },

  // 현재 선택된 카테고리 탭
  activeCategory: '전체',

  // 추천 장소 데이터 (KTO API 결과)
  places: [],

  // 상세 정보를 보여줄 선택된 장소
  selectedPlace: null,
  placeDetail: null,
  isDetailLoading: false,

  // Actions
  
  // 1. 백엔드에서 축제 목록 가져오기
  fetchFestivals: async () => {
    set({ isLoading: true });
    try {
      const data = await festivalService.getFestivals();
      set({ festivals: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // 2. 선택된 축제 설정 및 해당 좌표로 주변 정보 호출 준비
  setSelectedFestival: (festival) => {
    if (!festival) {
      set((state) => ({
        searchParams: { 
          ...state.searchParams, 
          selectedFestival: null, 
          startDate: "", 
          endDate: "" 
        }
      }));
      return;
    }

    const formatDate = (dateStr) => {
      if (!dateStr || dateStr.length !== 8) return "";
      return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    };

    // 좌표를 숫자로 변환하여 저장 (snake_case 반영: map_x, map_y)
    const normalizedFestival = {
      ...festival,
      map_x: parseFloat(festival.map_x),
      map_y: parseFloat(festival.map_y)
    };

    set((state) => ({
      searchParams: { 
        ...state.searchParams, 
        selectedFestival: normalizedFestival,
        startDate: formatDate(festival.event_start_date),
        endDate: formatDate(festival.event_end_date)
      }
    }));
    
    // 축제가 선택되면 주변 정보도 자동으로 호출 (map_x: 경도, map_y: 위도)
    if (!isNaN(normalizedFestival.map_x) && !isNaN(normalizedFestival.map_y)) {
      get().fetchNearbyPlaces();
    }
  },

  // 3. 한국관광공사 API를 통한 주변 정보 호출
  fetchNearbyPlaces: async () => {
    const { selectedFestival, radius, categories } = get().searchParams;
    if (!selectedFestival || !selectedFestival.map_x || !selectedFestival.map_y) return;

    set({ isLoading: true });
    try {
      const typeIds = [];
      if (categories.food) typeIds.push('39');
      if (categories.tour) typeIds.push('12');
      if (categories.festival) typeIds.push('15');
      
      const requests = typeIds.map(id => 
        ktoService.getNearbyPlaces(selectedFestival.map_x, selectedFestival.map_y, radius * 1000, id)
      );

      const results = await Promise.all(requests);
      const flatResults = results.flat();

      // KTO 데이터를 UI 구조에 맞게 매핑
      const mappedPlaces = flatResults.map(item => ({
        id: item.contentid,
        contentTypeId: item.contenttypeid, // 백엔드 호출을 위한 ID 추가
        title: item.title,
        category: item.contenttypeid === '39' ? '음식점' : item.contenttypeid === '12' ? '관광지' : '축제/행사',
        distance: item.dist > 1000 ? `${(item.dist / 1000).toFixed(1)}km` : `${Math.floor(item.dist)}m`,
        tag: item.addr1?.split(' ')[1] || '추천 장소',
        img: item.firstimage || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&q=80',
        thumbnail: item.firstimage2, // 썸네일 이미지 추가
        type: item.contenttypeid === '39' ? 'food' : item.contenttypeid === '12' ? 'tour' : 'festival',
        lat: parseFloat(item.mapy),
        lng: parseFloat(item.mapx)
      }));

      set({ places: mappedPlaces, isLoading: false });
    } catch (error) {
      console.error('Fetch Nearby Places Error:', error);
      set({ isLoading: false });
    }
  },

  // 4. 장소 상세 정보 가져오기 (백엔드 API 호출)
  fetchPlaceDetail: async (contentId, contentTypeId) => {
    set({ isDetailLoading: true, placeDetail: null });
    try {
      let data;
      switch (contentTypeId) {
        case '39': // 음식점
          data = await festivalService.getFoodDetail(contentId);
          break;
        case '12': // 관광지
          data = await festivalService.getTourDetail(contentId);
          break;
        case '15': // 축제/행사
          data = await festivalService.getEventDetail(contentId);
          break;
        default:
          data = null;
      }
      set({ placeDetail: data, isDetailLoading: false });
    } catch (error) {
      console.error('Fetch Place Detail Error:', error);
      set({ isDetailLoading: false });
    }
  },

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

  setSelectedPlace: (place) => set({ selectedPlace: place }),

  resetFilters: () => set({
    searchParams: {
      selectedFestival: null,
      radius: 5,
      startDate: "",
      endDate: "",
      categories: {
        food: true,
        tour: true,
        festival: true
      }
    },
    activeCategory: '전체',
    places: [],
    selectedPlace: null
  })
}));

export default useMapStore;
