import { maxios } from './axiosApi';

const BASE_PATH = '/api/gathering';

const gatheringApi = {

    // 🌟 1. 백엔드 @RequestParam("file") 구조에 맞게 이미지 업로드 추가
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file); // 백엔드 변수명 "file"과 일치 필수
        
        const response = await maxios.post(`${BASE_PATH}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data; // { success: true, imageUrl: "..." }
    },

    // 🌟 2. 모임 생성 (백엔드 @RequestBody 구조에 맞게 순수 JSON 전송)
    createGathering: async (gatheringData) => {
        const response = await maxios.post(BASE_PATH, gatheringData);
        return response.data;
    },

    // 자유 모임 목록 출력
    freeGatheringList: async (page = 1, size = 5) => {
        const response = await maxios.get(`${BASE_PATH}/list`, {
            params: { page, size }
        })
        return response.data;
    },

    // 축제별 모임 전체 목록 조회
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

    // 내가 참여 중인 모임 목록 가져오기
    getJoinedGatherings: async (member_id, page = 1, size = 5, filter = '전체') => {
        const response = await maxios.get(`${BASE_PATH}/joined`, {
            params: { member_id, page, size, filter }
        });
        return response.data;
    }
}

export default gatheringApi;