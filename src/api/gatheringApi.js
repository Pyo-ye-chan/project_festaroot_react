import { maxios } from './axiosApi';

const BASE_PATH = '/api/gathering';

const gatheringApi = {

    // 모임 생성
    createGathering: async (gatheringData) => {
        const response = await maxios.post(BASE_PATH, gatheringData)
        return response.data;
    },

    // 🌟 자유 모임 목록 출력 (페이징 파라미터 추가)
    freeGatheringList: async (page = 1, size = 5) => {
        const response = await maxios.get(`${BASE_PATH}/list`, {
            params: { page, size }
        })
        return response.data;
    },

    // 🌟 축제별 모임 전체 목록 조회 (페이징 파라미터 추가)
    festivalGatheringList: async (memberId, page = 1, size = 5) => {
        const response = await maxios.get(`${BASE_PATH}/festival`, {
            params: { 
                memberId: memberId || '',
                page,
                size
            }
        });
        return response.data;
    },

    // 자유 모임 상세 출력
    gatheringDetail: async (room_id) => {
        const response = await maxios.get(`${BASE_PATH}/${room_id}`);
        return response.data;
    },

    // 자유 모임 참여자 목록 조회
    gatheringParticipants: async (room_id) => {
        const response = await maxios.get(`${BASE_PATH}/${room_id}/participants`);
        return response.data;
    },

    // 상세 모임 참여하기
    joinGathering: async (room_id, member_id) => {
        const response = await maxios.post(`${BASE_PATH}/${room_id}/join`, { member_id })
        return response.data;
    },

    // 모임 나가기
    leaveGathering: async (room_id, member_id) => {
        const response = await maxios.post(`${BASE_PATH}/${room_id}/leave`, { member_id })
        return response.data;
    },

    // 🌟 내가 참여 중인 모임 목록 가져오기 (페이징 및 필터 파라미터 추가)
    getJoinedGatherings: async (member_id, page = 1, size = 5, filter = '전체') => {
        const response = await maxios.get(`${BASE_PATH}/joined`, {
            params: { member_id, page, size, filter }
        });
        return response.data;
    }

}

export default gatheringApi;