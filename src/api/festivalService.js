import { maxios } from './axiosApi';

// 이 파일에서 사용할 공통 서브 경로
const BASE_PATH = '/api/festivals';

const festivalService = {
  /**
   * DB에 저장된 모든 축제 목록을 가져옵니다.
   */


   getAllFestivals: async () => {
    try {
      const response = await maxios.get(`${BASE_PATH}/map`);
      return response.data;
    } catch (error) {
      console.error('Error fetching festivals:', error);
      throw error;
    }
  },



  getFestivals: async (params) => {
    try {
      const response = await maxios.get(BASE_PATH, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching festivals:', error);
      throw error;
    }
  },

  /**
   * 특정 ID의 축제 상세 정보를 가져옵니다.
   */
  getFestivalById: async (id) => {
    try {
      const response = await maxios.get(`${BASE_PATH}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching festival ${id}:`, error);
      throw error;
    }
  },

  /**
   * 백엔드 API로부터 장소 카테고리별 상세 정보를 가져옵니다.
   */
  getFoodDetail: async (contentId) => {
    try {
      const response = await maxios.get(`${BASE_PATH}/food/${contentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching food detail ${contentId}:`, error);
      throw error;
    }
  },

  getTourDetail: async (contentId) => {
    try {
      const response = await maxios.get(`${BASE_PATH}/tour/${contentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tour detail ${contentId}:`, error);
      throw error;
    }
  },

  getEventDetail: async (contentId) => {
    try {
      const response = await maxios.get(`${BASE_PATH}/event/${contentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event detail ${contentId}:`, error);
      throw error;
    }
  },

  // 축제 정보 업데이트 코드
  upsertFestivals: async () => {
    try {
      const response = await maxios.post(`${BASE_PATH}/sync`); // 백엔드에 축제 데이터 동기화 API 호출
      return response.data; // 백엔드가 보낸 결과 데이터 호출부로 반환
    } catch (error) {
      console.error('Error sycing festivals', error);
      throw error; // 에러 메인으로 던지기
    }
  },


  // 조회수 1씩 증가
  increaseViewCount(contentId) {
    return maxios.put(`${BASE_PATH}/${contentId}/view-count`);
  },

  // 로그인한 유저의 찜 목록 조회
  getMyFestivalLikedIds: async (userId) => {
    try {
      const response = await maxios.get(`${BASE_PATH}/likeList`, { headers: { 'user-id': userId } });
      return response.data; // 백엔드가 준 { likedFestivalIds: [...] }를 리턴
    } catch (error) {
      console.error('Error fetching my liked festival IDs:', error);
      throw error;
    }
  },

  // 축제 찜하기 토글
  toggleFestivalLike: async (contentId) => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user?.userId || user?.id || user?.member_id;

      if (!userId) {
        throw new Error('로그인이 필요한 서비스이거나 유저 정보를 찾을 수 없습니다.');
      }

      const response = await maxios.post(`${BASE_PATH}/likeToggle`,
        { contentId: Number(contentId) },
        { headers: { 'user-id': userId } }
      );
      return response.data;
    } catch (error) {
      console.error('Error toggling festival like:', error);
      throw error;
    }
  },

  getNearbyPlaces: async (lat, lng, radius = 5000, contentTypeId = '') => {
  try {
    const response = await maxios.get(`${BASE_PATH}/nearby`, {
      params: {
        lat,
        lng,
        radius,
        contentTypeId,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw error;
  }
}

};

export default festivalService;