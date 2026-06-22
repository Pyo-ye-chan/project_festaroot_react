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
  minimizedChatIds: [],
  focusedFloatingId: null,
  chatRooms: [],

  setActiveChatId: (activeChatId) => set({ activeChatId }),
  setChatRooms: (chatRooms) => set({ chatRooms }),
  setFocusedFloatingId: (focusedFloatingId) => set({ focusedFloatingId }),

  // 플로팅 창 열기 정규화 (Number 타입으로 통일)
  openFloatingChat: (chatId) => set((state) => {
    const numericId = Number(chatId); // 안전하게 숫자로 변환
    const nextIds = state.floatingChatIds.map(Number).includes(numericId)
      ? state.floatingChatIds
      : [...state.floatingChatIds, numericId];
    const nextMinimized = state.minimizedChatIds.filter(id => Number(id) !== numericId);
    return {
      floatingChatIds: nextIds,
      minimizedChatIds: nextMinimized,
      focusedFloatingId: numericId
    };
  }),

  // 플로팅 창 완전히 닫기 (Number 타입 강제 변환 후 비교)
  closeFloatingChat: (chatId) => set((state) => {
    const numericId = Number(chatId); // 닫으려는 ID를 숫자로 통일
    return {
      floatingChatIds: state.floatingChatIds.filter(id => Number(id) !== numericId),
      minimizedChatIds: state.minimizedChatIds.filter(id => Number(id) !== numericId),
      focusedFloatingId: Number(state.focusedFloatingId) === numericId ? null : state.focusedFloatingId
    };
  }),

  // 플로팅 창 접기 액션 정규화
  minimizeFloatingChat: (chatId) => set((state) => {
    const numericId = Number(chatId);
    return {
      minimizedChatIds: state.minimizedChatIds.map(Number).includes(numericId)
        ? state.minimizedChatIds
        : [...state.minimizedChatIds, numericId]
    };
  }),

  // 접힌 창 다시 열기 액션 정규화
  restoreFloatingChat: (chatId) => set((state) => {
    const numericId = Number(chatId);
    return {
      minimizedChatIds: state.minimizedChatIds.filter(id => Number(id) !== numericId),
      focusedFloatingId: numericId
    };
  }),

  stompClient: null,
  connected: false,
  messagesByRoom: {},

  fetchChatHistory: async (roomId, memberId) => {
    try {
      const response = await maxios.get(`/api/chat/rooms/${roomId}/messages`, {
        params: { member_id: memberId }
      });

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

  // connectWebSocket: () => {
  //   if (get().stompClient?.connected) return;

  //   const client = new Client({
  //     brokerURL: 'ws://localhost/ws-stomp',
  //     reconnectDelay: 5000,
  //     onConnect: () => {
  //       console.log('STOMP 웹소켓 서버 연결 성공 🚀');
  //       set({ connected: true });

  //       const currentActiveId = get().activeChatId;
  //       if (currentActiveId) get().subscribeToRoom(currentActiveId);
  //       get().floatingChatIds.forEach(id => get().subscribeToRoom(id));
  //     },
  //     onDisconnect: () => { set({ connected: false }); }
  //   });

  //   client.activate();
  //   set({ stompClient: client });
  // },

  connectWebSocket: () => {
    if (get().stompClient?.connected) return;

    // 1. 기본값은 개발 환경용 주소 (Vite Proxy를 타도록 설정)
    let socketUrl = '/ws-stomp';

    // 2. 만약 배포(운영) 환경이라면 .env.production 주소를 가공해서 사용
    if (import.meta.env.MODE === 'production') {
      const backendUrl = import.meta.env.VITE_API_URL || '';
      const wsProtocol = backendUrl.startsWith('https') ? 'wss' : 'ws';
      const pureUrl = backendUrl.replace(/^https?:\/\//, '');

      // [경로 체크] pureUrl 끝에 슬래시가 없으므로, 뒤 경로 시작에 '/'를 확실하게 붙여서 연결
      socketUrl = `${wsProtocol}://${pureUrl}/ws-stomp`;
    }

    // 변경된 socketUrl을 로그로 확인해보면 디버깅하기 편합니다.
    console.log(`현재 웹소켓 연결 시도 주소 (${import.meta.env.MODE}):`, socketUrl);

    const client = new Client({
      brokerURL: socketUrl, // 기존 하드코딩된 주소 대신 변수
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

        // 새로운 메시지가 왔을 때 채팅방 목록(chatRooms) 실시간 갱신
        const updatedRooms = state.chatRooms.map((room) => {
          if (Number(room.id) === Number(roomId)) {
            // 메시지가 도착한 방이 현재 유저가 활성화해서 보고 있는 방인지 확인
            const isCurrentActive = Number(roomId) === Number(state.activeChatId);

            return {
              ...room,
              lastMessage: mappedMsg.text, // 사이드바의 마지막 말풍선 실시간 변경
              // 내가 이미 방에 들어와 있다면 0 유지, 다른 방에 있다면 기존 카운트 + 1
              unread_count: isCurrentActive ? 0 : (room.unread_count || 0) + 1
            };
          }
          return room;
        });

        return {
          messagesByRoom: {
            ...state.messagesByRoom,
            [roomId]: [...currentRoomMsgs, mappedMsg]
          },
          chatRooms: updatedRooms
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
      message: text, // 이미지 url
      type: type // IMAGE
    };

    client.publish({
      destination: '/pub/chat/message',
      body: JSON.stringify(payload)
    });
  },

  clearChatStore: () => set({
    floatingChatIds: [],
    minimizedChatIds: [],
    focusedFloatingId: null,
    activeChatId: null,
    messagesByRoom: {}
  })
}));

export default useChatStore;