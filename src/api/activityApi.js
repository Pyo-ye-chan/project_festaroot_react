import { maxios } from './axiosApi';

/**
 * 사용자의 활동 로그를 서버에 저장합니다.
 * @param {Object} activityData - 활동 데이터 { type: 'VIEW' | 'SEARCH', festivalId?: string, searchQuery?: string }
 */
export const saveActivityLog = async (activityData) => {
  try {
    const response = await maxios.post('/activities/log', activityData);
    return response.data;
  } catch (error) {
    // 로그 저장은 부가적인 기능이므로 서비스 이용에 방해가 되지 않도록 에러만 출력합니다.
    console.error('활동 로그 저장 실패:', error);
    return null;
  }
};

/**
 * 사용자의 최근 활동 로그 목록을 가져옵니다. (마이페이지 등에서 활용)
 * @returns {Promise<Array>} 최근 로그 목록
 */
export const getRecentActivityLogs = async () => {
  try {
    const response = await maxios.get('/activities/recent');
    return response.data;
  } catch (error) {
    console.error('최근 활동 로그 조회 실패:', error);
    return [];
  }
};
