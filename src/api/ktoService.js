import axios from 'axios';

// 백엔드 API 베이스 URL (개발 환경에 맞춰 조정 필요)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:80/api';

const ktoService = {
  /**
   * 백엔드 프록시를 통해 주변 관광 정보 목록을 가져옵니다.
   * @param {number} mapX 경도 (lng)
   * @param {number} mapY 위도 (lat)
   * @param {number} radius 반경 (m)
   * @param {string} contentTypeId (관광지: 12, 행사: 15, 음식점: 39 등)
   */
  getNearbyPlaces: async (mapX, mapY, radius = 5000, contentTypeId = '') => {
    try {
      // 프론트엔드에서는 우리 백엔드 서버의 엔드포인트만 호출합니다.
      const response = await axios.get(`${API_BASE_URL}/festivals/nearby`, {
        params: {
          lat: mapY,
          lng: mapX,
          radius,
          contentTypeId
        },
      });
      
      // 백엔드에서 이미 데이터 정제(Mapping)를 해서 보내준다고 가정하거나,
      // 원본 데이터를 그대로 넘겨준다면 여기서 처리합니다.
      return response.data || [];
    } catch (error) {
      console.error('Error fetching nearby places from backend:', error);
      return [];
    }
  },

  /**
   * 특정 시/도에 해당하는 시/군/구 목록을 백엔드에서 가져옵니다.
   * @param {string} sidoName 시/도 이름 (예: '서울')
   */
  getSigunguBySidoName: async (sidoName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/sigungu`, {
        params: { sidoName },
      });
      return response.data || [];
    } catch (error) {
      console.error(`Error fetching sigungu for ${sidoName}:`, error);
      return [];
    }
  }
};

export default ktoService;
