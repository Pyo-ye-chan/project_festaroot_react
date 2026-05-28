import axios from 'axios';

// 백엔드 API 베이스 URL (개발 환경에 맞춰 조정 필요)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost/api';

const festivalService = {
  /**
   * DB에 저장된 모든 축제 목록을 가져옵니다.
   */
  getFestivals: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/festivals`);
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
      const response = await axios.get(`${API_BASE_URL}/festivals/${id}`);
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
      const response = await axios.get(`${API_BASE_URL}/festivals/food/${contentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching food detail ${contentId}:`, error);
      throw error;
    }
  },

  getTourDetail: async (contentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/festivals/tour/${contentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching tour detail ${contentId}:`, error);
      throw error;
    }
  },

  getEventDetail: async (contentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/festivals/event/${contentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching event detail ${contentId}:`, error);
      throw error;
    }
  }
};

export default festivalService;
