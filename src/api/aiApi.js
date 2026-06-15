import { maxios } from './axiosApi';

// AI 플래너 생성 API
export const createAIPlanner = (plannerData) => {
  return maxios.post('/ai/planner', plannerData);
};

// 내 AI 플래너 목록 조회 API
export const getMyAIPlanners = () => {
  return maxios.get('/ai/planners/my');
};

// AI 플래너 상세 조회 API
export const getAIPlannerDetail = (plannerId) => {
  return maxios.get(`/ai/planners/${plannerId}`);
};

// AI 플래너 삭제 API
export const deleteAIPlanner = (plannerId) => {
  return maxios.delete(`/ai/planners/${plannerId}`);
};
