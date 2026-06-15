import { maxios } from './axiosApi';

/**
 * AI 축제 코스 추천 생성 API
 *
 * POST /ai/planner
 *
 * 역할:
 * - 선택한 축제 content_id와 사용자 조건을 백엔드로 전달
 * - 백엔드에서 축제장 좌표, 날씨, 주변 장소 정보를 기반으로 추천 코스 생성
 * - 생성된 planner_id와 steps를 반환받음
 *
 * @param {Object} data AI 플래너 생성 요청 데이터
 * @returns {Promise} Axios 응답 Promise
 */
export const createAIPlanner = (data) => {
  return maxios.post('/ai/planner', data);
};

/**
 * 내 AI 플래너 목록 조회 API
 *
 * GET /ai/planners/my
 *
 * 역할:
 * - 로그인한 사용자가 생성한 AI 축제 코스 목록 조회
 * - 마이페이지 "내 AI 플래너" 목록에서 사용
 *
 * @returns {Promise} Axios 응답 Promise
 */
export const getMyAIPlanners = () => {
  return maxios.get('/ai/planners/my');
};

/**
 * AI 플래너 상세 조회 API
 *
 * GET /ai/planners/{plannerId}
 *
 * 역할:
 * - 특정 AI 플래너의 기본 정보와 step 목록 조회
 * - 상세 화면에서 타임라인과 지도 마커 복원에 사용
 *
 * @param {number|string} plannerId 조회할 플래너 ID
 * @returns {Promise} Axios 응답 Promise
 */
export const getAIPlannerDetail = (plannerId) => {
  return maxios.get(`/ai/planners/${plannerId}`);
};

/**
 * AI 플래너 삭제 API
 *
 * DELETE /ai/planners/{plannerId}
 *
 * 역할:
 * - 사용자가 생성한 AI 플래너 삭제
 * - ai_planner_step은 DB의 ON DELETE CASCADE로 함께 삭제됨
 *
 * @param {number|string} plannerId 삭제할 플래너 ID
 * @returns {Promise} Axios 응답 Promise
 */
export const deleteAIPlanner = (plannerId) => {
  return maxios.delete(`/ai/planners/${plannerId}`);
};