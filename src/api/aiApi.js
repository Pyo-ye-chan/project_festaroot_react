import { maxios } from './axiosApi';


/**
 * AI 플래너 미리보기 생성
 *
 * DB에 저장하지 않고 화면에 보여줄 코스만 생성한다.
 */
export const previewAIPlanner = (data) => {
  return maxios.post('/ai/planner/preview', data);
};

/**
 * AI 플래너 저장
 *
 * 사용자가 마음에 든 경우에만 마이페이지 저장용으로 호출한다.
 */
export const saveAIPlanner = (data) => {
  return maxios.post('/ai/planner/save', data);
};

/**
 * 내 AI 플래너 목록 조회 API
 *
 * GET /ai/planners/my
 *
 * 역할:
 * - 로그인한 사용자가 생성한 AI 주변 추천 목록 조회
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
 * - 상세 화면에서 추천 장소 목록과 지도 마커 복원에 사용
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