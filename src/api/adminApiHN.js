import { maxios } from "./axiosApi";

// 기본 API 경로 설정 (경로 시작 시 '/' 기호 확인)
const BASE_URL = '/admin/members';

const adminMemberApi = {
    // 1. 회원 목록 조회 (검색 키워드, 권한, 상태, 정렬, 기간 등 파라미터 전달)
    getMembers: async (searchParams) => {
        const response = await maxios.get(`${BASE_URL}`, { params: searchParams });
        return response.data; // 백엔드에서 가공된 회원 리스트 반환
    },

    // 2. 활동 정지 처리 (ID와 정지 일수를 함께 전송)
    suspendMember: async (id, suspensionDays) => {
        const response = await maxios.put(`${BASE_URL}/${id}/suspend`, { suspensionDays });
        return response.data;
    },

    // 3. 블랙리스트 등록
    blacklistMember: async (id) => {
        const response = await maxios.put(`${BASE_URL}/${id}/blacklist`);
        return response.data;
    },

    // 4. 제재 해제 및 정상 복원
    restoreMember: async (id) => {
        const response = await maxios.put(`${BASE_URL}/${id}/restore`);
        return response.data;
    },

    // 5. 상단 요약 통계 데이터 조회 (검색 필터 독립)
    getMainStats: async () => {
        const response = await maxios.get(`${BASE_URL}/stats`);
        return response.data;
    }
};

export default adminMemberApi;