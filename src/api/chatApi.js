import { maxios } from './axiosApi';

const BASE_PATH = '/api/chat';

const chatApi = {
    // 채팅 읽음 상태 갱신 
    updateReadStatus: async (activeChatId, userId) => {
        const response = await maxios.get(`${BASE_PATH}/${userId}`, {
            params: { activeChatId: activeChatId }
        });
        return response.data;
    },

    // 1:1 채팅 생성
    createOrGetDirectRoom: async (currentUserId, targetMemberId) => {
        const response = await maxios.post(`${BASE_PATH}/direct`, {
            currentUserId,
            targetMemberId
        });
        return response.data;
    },

    // 1:1 채팅방 나가기 / 차단하고 나가기 연동
    leaveDirectRoom: async (room_id, member_id, isBlock = false, targetMemberId = null) => {
        const response = await maxios.post(`${BASE_PATH}/rooms/${room_id}/leave`, {
            memberId: member_id,
            isBlock,
            targetMemberId
        });
        return response.data;
    },

    // 채팅방 목록 조회
    getUserChatRooms: async (userId) => {
        const response = await maxios.get(`${BASE_PATH}/rooms/user/${userId}`);
        return response.data;
    },

    //  채팅 전용 이미지 업로드 (아래 GCS 설명 참고 후 적용)
    uploadChatImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await maxios.post(`${BASE_PATH}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    }
};

export default chatApi;