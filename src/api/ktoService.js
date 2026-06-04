import { maxios } from './axiosApi';

// 이 파일에서 사용할 공통 서브 경로
const BASE_PATH = '/api';

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
      const response = await maxios.get(`${BASE_PATH}/festivals/nearby`, {
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
      const response = await maxios.get(`${BASE_PATH}/locations/sigungu`, {
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
