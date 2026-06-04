import { maxios } from './axiosApi';

// 이 파일에서 사용할 공통 서브 경로
const BASE_PATH = '/api/festivals';

const festivalService = {
  /**
   * DB에 저장된 모든 축제 목록을 가져옵니다.
   */
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

  // 축제 찾기 > 목록을 눌렀을 때, 조회수 1씩 증가
  increaseViewCount(contentId) {
    return maxios.put(`${BASE_PATH}/${contentId}/view-count`);
  }

};

export default festivalService;