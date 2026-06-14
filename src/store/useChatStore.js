import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import { maxios } from '../api/axiosApi';

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
  minimizedChatIds: [], // 💡 전역 접힘 상태 추가
  focusedFloatingId: null, // 💡 전역 포커스 레이어 상태 추가
  chatRooms: [],

  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setChatRooms: (chatRooms) => set({ chatRooms }),
  setFocusedFloatingId: (focusedFloatingId) => set({ focusedFloatingId }),

  // 💡 플로팅 창 열기 (접혀있었다면 접힘 해제 + 포커스 부여)
  openFloatingChat: (chatId) => set((state) => {
    const nextIds = state.floatingChatIds.includes(chatId)
      ? state.floatingChatIds
      : [...state.floatingChatIds, chatId];
    const nextMinimized = state.minimizedChatIds.filter(id => id !== chatId);
    return { 
      floatingChatIds: nextIds, 
      minimizedChatIds: nextMinimized,
      focusedFloatingId: chatId 
    };
  }),

  // 💡 플로팅 창 완전히 닫기 (오픈 목록 및 접힘 목록 동시 제거)
  closeFloatingChat: (chatId) => set((state) => ({
    floatingChatIds: state.floatingChatIds.filter(id => id !== chatId),
    minimizedChatIds: state.minimizedChatIds.filter(id => id !== chatId),
    focusedFloatingId: state.focusedFloatingId === chatId ? null : state.focusedFloatingId
  })),

  // 💡 플로팅 창 접기 액션 추가
  minimizeFloatingChat: (chatId) => set((state) => ({
    minimizedChatIds: state.minimizedChatIds.includes(chatId)
      ? state.minimizedChatIds
      : [...state.minimizedChatIds, chatId]
  })),

  // 💡 접힌 창 다시 열기 액션 추가
  restoreFloatingChat: (chatId) => set((state) => ({
    minimizedChatIds: state.minimizedChatIds.filter(id => id !== chatId),
    focusedFloatingId: chatId
  })),

  stompClient: null,
  connected: false,
  messagesByRoom: {},

  fetchChatHistory: async (roomId) => {
    try {
      const response = await maxios.get(`/api/chat/room/${roomId}/messages`);
      const rawList = response.data || [];
      const loggedUser = getLocalUser();

      const mappedHistory = rawList.map((received) => ({
        id: received.id || received._id || Date.now() + Math.random(),
        senderId: received.senderId,
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
        senderId: received.senderId,
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
  },

  clearChatStore: () => set({
    floatingChatIds: [],
    minimizedChatIds: [], // 청소 추가
    focusedFloatingId: null, // 청소 추가
    activeChatId: null,
    messagesByRoom: {}
  })
}));

export default useChatStore;