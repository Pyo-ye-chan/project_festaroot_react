import { create } from 'zustand';
import { Client } from '@stomp/stompjs';
import { maxios } from '../api/axiosApi';

const useChatStore = create((set, get) => ({
  // 1. 기존 UI 상태 관리 유지
  isFloating: false,
  activeChatId: null,
  setFloating: (isFloating) => set({ isFloating }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  openFloatingChat: (chatId) => set({ isFloating: true, activeChatId: chatId }),
  closeFloatingChat: () => set({ isFloating: false, activeChatId: null }),

  // 2. 실시간 상태값
  stompClient: null,
  connected: false,
  messagesByRoom: {}, 

  // 💡 [과거 내역 로드 추가] 방 진입 시 MongoDB 백엔드 API에서 이전 대화 데이터를 채워 넣는 로직
  fetchChatHistory: async (roomId) => {
    try {
      const response = await maxios.get(`/api/chat/room/${roomId}/messages`);
      const rawList = response.data || [];
      
      const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
      
      // 서버에서 내려온 몽고DB 규격을 UI 메세지 스펙으로 일괄 역정규화 매핑
      const mappedHistory = rawList.map((received) => ({
        id: received.id || received._id || Date.now() + Math.random(),
        sender: received.senderName,
        text: received.message,
        time: received.createdAt 
          ? new Date(received.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: String(received.senderId) === String(loggedInUser.id || loggedInUser.memberId), 
        type: received.type 
      }));

      set((state) => ({
        messagesByRoom: {
          ...state.messagesByRoom,
          [roomId]: mappedHistory
        }
      }));
    } catch (error) {
      console.error('이전 채팅 대화 내역 로드 실패:', error);
    }
  },

  // 3. 최상단 진입 시 웹소켓 파이프라인 활성화
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
      },
      onDisconnect: () => {
        set({ connected: false });
      }
    });

    client.activate();
    set({ stompClient: client });
  },

  // 4. 실시간 방 구독 로직
  subscribeToRoom: (roomId) => {
    const client = get().stompClient;
    if (!client || !client.connected) return;

    client.subscribe(`/sub/chat/room/${roomId}`, (stompMessage) => {
      const received = JSON.parse(stompMessage.body);
      const loggedInUser = JSON.parse(localStorage.getItem('user')) || {};
      
      const mappedMsg = {
        id: received.id || received._id || Date.now(), 
        sender: received.senderName, 
        text: received.message, 
        time: received.createdAt 
          ? new Date(received.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
          : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: String(received.senderId) === String(loggedInUser.id || loggedInUser.memberId), 
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

  // 5. 컨트롤러 규격에 맞춘 메시지 발송
  sendMessage: (roomId, text, type = 'TALK') => {
    const client = get().stompClient;
    if (!client || !client.connected) {
      console.warn('웹소켓 연결이 원활하지 않습니다.');
      return;
    }

    const loggedInUser = JSON.parse(localStorage.getItem('user')) || { id: 'system', name: '사용자' };

    const payload = {
      roomId: Number(roomId),
      senderId: loggedInUser.id || loggedInUser.memberId,
      senderName: loggedInUser.name || loggedInUser.nickname || '익명',
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