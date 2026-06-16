import { maxios } from './axiosApi';

const BASE_PATH = '/api/gathering';

const gatheringApi = {

    // 이미지 업로드
    uploadImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await maxios.post(`${BASE_PATH}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    // 자유 모임 생성
    createGathering: async (gatheringData) => {
        const response = await maxios.post(BASE_PATH, gatheringData);
        return response.data;
    },

    // 자유 모임 목록 출력 (검색 포함)
    freeGatheringList: async (member_id, page = 1, size = 5, keyword = '') => {
        const response = await maxios.get(`${BASE_PATH}/list`, {
            params: {
                member_id: member_id || '',
                page,
                size,
                keyword
            }
        });
        return response.data;
    },

    // 축제별 모임 전체 목록 조회 (검색 포함)
    festivalGatheringList: async (member_id, page = 1, size = 5, keyword = '') => {
        const response = await maxios.get(`${BASE_PATH}/festival`, {
            params: {
                member_id: member_id || '',
                page,
                size,
                keyword
            }
        });
        return response.data;
    },

    // 자유 모임 상세 출력
    gatheringDetail: async (room_id) => {
        const response = await maxios.get(`${BASE_PATH}/${room_id}`);
        return response.data;
    },

    // 채팅 참여자 목록 조회
    gatheringParticipants: async (room_id) => {
        const response = await maxios.get(`${BASE_PATH}/${room_id}/participants`);
        return response.data;
    },

    // 모임 참여자 목록 조회
    selectGatheringParticipants: async (room_id) => {
        const response = await maxios.get(`${BASE_PATH}/${room_id}/participants_meet`);
        return response.data;
    },

    // 상세 모임 참여하기 (※ 백엔드 내부 검증로직에서 블랙리스트 체크 후 403 에러 반환하도록 설계)
    joinGathering: async (room_id, member_id) => {
        const response = await maxios.post(`${BASE_PATH}/${room_id}/join`, { member_id });
        return response.data;
    },

    // 모임 나가기
    leaveGathering: async (room_id, member_id) => {
        const response = await maxios.post(`${BASE_PATH}/${room_id}/leave`, { member_id });
        return response.data;
    },

    // 내가 참여 중인 모임 목록 가져오기
    getJoinedGatherings: async (member_id, page = 1, size = 5, filter = '전체', keyword = '') => {
        const response = await maxios.get(`${BASE_PATH}/joined`, {
            params: { member_id, page, size, filter, keyword }
        });
        return response.data;
    },

    // [RESTful] 모임 수정 (PUT)
    updateGathering: async (room_id, gatheringData) => {
        const response = await maxios.put(`${BASE_PATH}/${room_id}`, gatheringData);
        return response.data;
    },

    // [RESTful] 모임 삭제 (DELETE + Query Params)
    deleteGathering: async (room_id, owner_id) => {
        const response = await maxios.delete(`${BASE_PATH}/${room_id}`, {
            params: { owner_id }
        });
        return response.data;
    },

    // [RESTful] 방장 위임 (PUT)
    delegateOwner: async (room_id, current_owner_id, new_owner_id) => {
        const response = await maxios.put(`${BASE_PATH}/${room_id}/host`, {
            current_owner_id,
            new_owner_id
        });
        return response.data;
    },

    // [RESTful] 참가자 강퇴 (DELETE + Query Params ※ 백엔드 내부에서 BAN 테이블 인서트 연동)
    kickParticipant: async (room_id, owner_id, target_member_id) => {
        const response = await maxios.delete(`${BASE_PATH}/${room_id}/participants/${target_member_id}`, {
            params: { owner_id }
        });
        return response.data;
    },

    // 채팅 읽음 상태 갱신 연동 수정 완료
    // BASE_PATH(/api/gathering) 대신 ChatRestController 주소인 /api/chat으로 직접 지정하고, params로 activeChatId를 전송
    updateReadStatus: async (activeChatId, userId) => {
        const response = await maxios.get(`/api/chat/${userId}`, {
            params: { activeChatId: activeChatId }
        });
        return response.data;
    },

    // 1:1 채팅 생성
    createOrGetDirectRoom: async (currentUserId, targetMemberId) => {
        const response = await maxios.post('/api/chat/direct', {
            currentUserId,
            targetMemberId
        });
        return response.data;
    },

    // 1:1 채팅방 나가기 / 차단하고 나가기 연동 API
    leavePrivateRoom: async (room_id, member_id, isBlock = false, targetMemberId = null) => {
        const response = await maxios.post(`/api/chat/rooms/${room_id}/leave`, {
            memberId: member_id,
            isBlock,
            targetMemberId
        });
        return response.data;
    },
};

export default gatheringApi;