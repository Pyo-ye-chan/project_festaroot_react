import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import { maxios } from '../api/axiosApi';

// 💡 LocalStorage에서 유저 정보를 안전하고 일관되게 추출하는 헬퍼 함수
const getLocalUser = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {};
  return {
    id: user.userId || user.id || user.memberId || user.member_id || 'system',
    name: user.nickname || user.id || user.member_id || '사용자',
    profileImg: user.profile_image_url || user.profileImg || ''
  };
};

const useChatStore = create((set, get) => ({
  activeChatId: null,
  floatingChatIds: [],
  chatRooms: [],

  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setChatRooms: (chatRooms) => set({ chatRooms }),

  openFloatingChat: (chatId) => set((state) => {
    const nextIds = state.floatingChatIds.includes(chatId)
      ? state.floatingChatIds
      : [...state.floatingChatIds, chatId];
    return { floatingChatIds: nextIds };
  }),

  closeFloatingChat: (chatId) => set((state) => ({
    floatingChatIds: state.floatingChatIds.filter(id => id !== chatId)
  })),

  stompClient: null,
  connected: false,
  messagesByRoom: {},

  // 과거 내역 로드
  fetchChatHistory: async (roomId) => {
    try {
      const response = await maxios.get(`/api/chat/room/${roomId}/messages`);
      const rawList = response.data || [];
      const loggedUser = getLocalUser();

      const mappedHistory = rawList.map((received) => ({
        id: received.id || received._id || Date.now() + Math.random(),
        senderId: received.senderId, // 💡 ChatWindow에서 Oracle DB 유저와 비교하기 위해 추가!
        sender: received.senderName,
        senderProfile: received.senderProfile || '',
        text: received.message,
        time: received.createdAt
          ? new Date(received.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: String(received.senderId) === String(loggedUser.id),
        type: received.type
      }));

      set((state) => ({
        messagesByRoom: { ...state.messagesByRoom, [roomId]: mappedHistory }
      }));
    } catch (error) {
      console.error('이전 채팅 대화 내역 로드 실패:', error);
    }
  },

  connectWebSocket: () => {
    if (get().stompClient?.connected) return;

    const client = new Client({
      brokerURL: 'ws://localhost/ws-stomp',
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('STOMP 웹소켓 서버 연결 성공 🚀');
        set({ connected: true });

        const currentActiveId = get().activeChatId;
        if (currentActiveId) get().subscribeToRoom(currentActiveId);
        get().floatingChatIds.forEach(id => get().subscribeToRoom(id));
      },
      onDisconnect: () => { set({ connected: false }); }
    });

    client.activate();
    set({ stompClient: client });
  },

  subscribeToRoom: (roomId) => {
    const client = get().stompClient;
    if (!client || !client.connected) return;

    client.subscribe(`/sub/chat/room/${roomId}`, (stompMessage) => {
      const received = JSON.parse(stompMessage.body);
      const loggedUser = getLocalUser();

      const mappedMsg = {
        id: received.id || received._id || Date.now(),
        senderId: received.senderId, // 💡 여기도 추가!
        sender: received.senderName,
        senderProfile: received.senderProfile || '',
        text: received.message,
        time: received.createdAt
          ? new Date(received.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: String(received.senderId) === String(loggedUser.id),
        type: received.type
      };

      set((state) => {
        const currentRoomMsgs = state.messagesByRoom[roomId] || [];
        if (currentRoomMsgs.some(m => m.id === mappedMsg.id)) return state;

        return {
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: [...currentRoomMsgs, mappedMsg]
          }
        };
      });
    });
  },

  sendMessage: (roomId, text, type = 'TALK') => {
    const client = get().stompClient;
    if (!client || !client.connected) {
      console.warn('웹소켓 연결이 원활하지 않습니다.');
      return;
    }

    const loggedUser = getLocalUser();

    // 💡 에러 수정: user 대신 완전히 정제된 loggedUser 데이터를 사용해 전송합니다.
    const payload = {
      roomId: Number(roomId),
      senderId: loggedUser.id,
      senderName: loggedUser.name,
      senderProfile: loggedUser.profileImg,
      message: text,
      type: type
    };

    client.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(payload)
    });
  }
}));

export default useChatStore;