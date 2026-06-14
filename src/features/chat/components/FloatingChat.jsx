import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { 
  Send, 
  Users, 
  X, 
  MessageCircle, 
  Paperclip,
  Minimize2,
  Maximize2
} from 'lucide-react';
import useChatStore from '../../../store/useChatStore';

const FloatingChat = () => {
  // Zustand 스토어 데이터 및 실시간 전송/구독 함수 구조 분해 할당 연동
  const { 
    isFloating, 
    activeChatId, 
    closeFloatingChat, 
    messagesByRoom, 
    sendMessage, 
    subscribeToRoom 
  } = useChatStore();
  
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);
  const nodeRef = useRef(null);

  // 플로팅 챗 오픈 시 서버 토픽 실시간 감시 채널 구독
  useEffect(() => {
    if (activeChatId) {
      subscribeToRoom(activeChatId);
    }
  }, [activeChatId, subscribeToRoom]);

  // Mock data - In real app, fetch based on activeChatId
  const chatRooms = [
    { id: 1, type: 'festival', title: '한강 달빛 야시장 같이 가실 분? 🌙', lastMessage: '6시에 여의나루역에서 볼까요?', time: '오후 2:36', unreadCount: 3, avatar: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=200', date: '2026.06.01 - 06.07', location: '서울 한강공원' },
    { id: 2, type: 'festival', title: '경복궁 야간개장 티켓팅 성공 기원방 🏯', lastMessage: '내일 오후 2시 오픈이래요!', time: '오후 1:45', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1467307983825-619715426c70?auto=format&fit=crop&q=80&w=200', date: '2026.06.15 - 07.15', location: '서울 경복궁' },
    { id: 3, type: 'group', title: '전국 축제 도장깨기 모임 🚌', lastMessage: '다음 주는 어디로 갈까요?', time: '오전 11:20', unreadCount: 12, avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=200' },
    { id: 4, type: 'group', title: '부산 불꽃축제 사진 동호회 🎆', lastMessage: '마린시티 쪽도 괜찮나요?', time: '어제', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200' },
    { id: 5, type: 'private', title: '김철수님', lastMessage: '오늘 축제 재밌었어요!', time: '오전 09:12', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  ];

  const activeChat = chatRooms.find(c => c.id === activeChatId);

  // 💡 로컬 고정 메시지 상태를 전역 실시간 수신 메시지 풀과 스위칭
  const messages = messagesByRoom[activeChatId] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  if (!isFloating) return null;

  // 💡 로컬 발송 로직을 STOMP 웹소켓 퍼블리시 핸들러로 전환
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(activeChatId, message, 'TALK');
    setMessage('');
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="parent">
      <div 
        ref={nodeRef}
        className={`fixed bottom-6 right-6 z-[9999] bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col transition-[height,width,border-radius] duration-300 ${isMinimized ? 'w-16 h-16 rounded-2xl overflow-hidden' : 'w-96 h-[500px]'}`}
      >
        {/* Header / Minimized Icon */}
        <header className={`drag-handle bg-purple-600 text-white cursor-move active:cursor-grabbing flex items-center flex-shrink-0 transition-all duration-300 ${isMinimized ? 'h-full w-full justify-center rounded-2xl' : 'h-16 px-4 border-b border-gray-100 rounded-t-3xl justify-between'}`}>
          <div 
            className={`flex items-center gap-2 ${isMinimized ? 'w-full h-full justify-center' : 'min-w-0'}`}
            onClick={() => isMinimized && setIsMinimized(false)}
          >
            <div className={`rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0 ${isMinimized ? 'w-10 h-10' : 'w-8 h-8'}`}>
              <MessageCircle className={`${isMinimized ? 'w-6 h-6' : 'w-5 h-5'} text-white`} />
            </div>
            {!isMinimized && (
              <span className="font-black text-sm truncate">{activeChat?.title || '채팅'}</span>
            )}
          </div>
          
          {!isMinimized && (
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(true)} className="p-1.5 hover:bg-white/10 rounded-lg transition-all relative z-10">
                <Minimize2 className="w-4 h-4" />
              </button>
              <button onClick={closeFloatingChat} className="p-1.5 hover:bg-rose-500 rounded-lg transition-all relative z-10">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </header>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#F8F9FF] custom-scrollbar">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                  {!msg.isMe && (
                    <div className="w-8 h-8 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} />
                    </div>
                  )}
                  <div className={`flex flex-col gap-1 max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`flex items-end gap-1.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`px-4 py-2 rounded-2xl text-xs font-medium shadow-sm ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[9px] text-gray-400 font-bold mb-1">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white rounded-b-3xl flex-shrink-0">
              <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                <label className="p-1.5 text-gray-400 hover:text-purple-600 cursor-pointer">
                  <input type="file" className="hidden" />
                  <Paperclip className="w-5 h-5" />
                </label>
                <input 
                  type="text" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)} 
                  placeholder="메시지 입력..." 
                  className="flex-grow bg-gray-50 rounded-xl py-2 px-4 text-xs font-medium focus:ring-2 focus:ring-purple-600/20 outline-none" 
                />
                <button type="submit" className="p-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </Draggable>
  );
};

export default FloatingChat;