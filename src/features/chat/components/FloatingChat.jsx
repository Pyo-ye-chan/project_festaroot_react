import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Send, X, MessageCircle, Minimize2, User } from 'lucide-react';
import useChatStore from '../../../store/useChatStore';
import gatheringApi from '../../../api/gatheringApi';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';

const FloatingChat = ({ roomId, index }) => {
  const {
    chatRooms,
    closeFloatingChat,
    messagesByRoom,
    sendMessage,
    subscribeToRoom,
    fetchChatHistory,
    minimizeFloatingChat,
    focusedFloatingId,
    setFocusedFloatingId
  } = useChatStore();

  const [message, setMessage] = useState('');
  const [participants, setParticipants] = useState([]);

  const scrollRef = useRef(null);
  const nodeRef = useRef(null);

  // 스크린샷 피드백 기반: 축제/소셜 로그인 분기 통합 처리
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.member_id || user?.id || user?.userId;

  // 프로필 이미지가 없는 사용자를 위한 기본 아바타 이미지 지정
  const DEFAULT_USER_AVATAR = 'https://picsum.photos/seed/default-avatar/100/100';

  useEffect(() => {
    if (roomId) {
      if (chatRooms.length > 0 && !chatRooms.some(c => c.id === roomId)) {
        closeFloatingChat(roomId);
        return;
      }

      fetchChatHistory(roomId, userId);
      subscribeToRoom(roomId);

      const fetchParticipants = async () => {
        try {
          const res = await gatheringApi.gatheringParticipants(roomId);
          setParticipants(res || []);
        } catch (e) {
          console.error("플로팅 챗 참여자 목록 로드 실패", e);
        }
      };
      fetchParticipants();

      setFocusedFloatingId(roomId);
    }
  }, [roomId, userId, chatRooms, subscribeToRoom, fetchChatHistory, closeFloatingChat, setFocusedFloatingId]);

  const activeChat = chatRooms.find(c => c.id === roomId);
  const messages = messagesByRoom[roomId] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(roomId, message, 'TALK');
    setMessage('');
  };

  const isFocused = focusedFloatingId === roomId;
  const currentZIndex = isFocused ? 10000 : 9990 + (index || 0);

  return (
    <Draggable
      key={roomId}
      nodeRef={nodeRef}
      handle=".drag-handle"
      bounds="body"
    >
      <div
        ref={nodeRef}
        onMouseDown={() => setFocusedFloatingId(roomId)}
        className="fixed bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col w-86 h-[480px]"
        style={{
          right: `${24 + (index || 0) * 25}px`,
          bottom: `${24 + (index || 0) * 25}px`,
          zIndex: currentZIndex
        }}
      >
        <header className="drag-handle bg-purple-600 text-white cursor-move active:cursor-grabbing flex items-center flex-shrink-0 h-14 px-4 border-b border-gray-100 rounded-t-3xl justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <MessageCircle className="w-5 h-5 text-white flex-shrink-0" />
            <span className="font-black text-xs truncate">{activeChat?.title || `채팅방 ${roomId}`}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); minimizeFloatingChat(roomId); }}
              className="p-1 hover:bg-white/10 rounded"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); e.preventDefault(); closeFloatingChat(roomId); }}
              className="p-1 hover:bg-rose-500 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#F8F9FF]">
          {messages.map(msg => {

            if (msg.type === 'ENTER' || msg.type === 'LEAVE' || msg.type === 'KICK' || msg.type === 'DM') {
              return (
                <div key={msg.id} className="flex justify-center my-2 w-full select-none">
                  <span className="bg-gray-100/80 text-gray-400 text-[10px] font-semibold px-3 py-1.5 rounded-full shadow-xs border border-gray-50">
                    {msg.type === 'ENTER' && `${msg.sender}님이 입장하셨습니다.`}
                    {msg.type === 'LEAVE' && `${msg.sender}님이 퇴장하셨습니다.`}
                    {msg.type === 'KICK' && (msg.text || `${msg.sender}님이 내보내졌습니다.`)}
                    {msg.type === 'DM' && `채팅이 시작되었습니다.`}
                  </span>
                </div>
              );
            }

            // 고유 식별 필드 매칭 다각화 (방어 코드)
            const targetUser = participants.find(p => {
              const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
              const pUsername = p.username || p.userId || p.USER_ID || p.loginId;
              return String(pId) === String(msg.senderId) || (pUsername && String(pUsername) === String(msg.senderId));
            });

            // 본인이 아니고 참여자 명단에도 완전히 결여되어 있을 때만 퇴장 유저 판정
            const isLeftUser = !msg.isMe && !targetUser;

            const userProfileImg = msg.senderProfile || targetUser?.profile_image_url || targetUser?.PROFILE_IMAGE_URL;

            return (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                {!msg.isMe && (
                  <div className={`w-8 h-8 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm flex items-center justify-center ${isLeftUser ? 'bg-gray-200/50 opacity-60' : ''}`}>
                    {isLeftUser ? (
                      /* 1. 진짜 퇴장한 사람만 User 아이콘 처리 */
                      <User className="w-4 h-4 text-gray-400" />
                    ) : (
                      /* 2. 퇴장 안 한 일반 참여자는 이미지 주소 주입 (없으면 기본 아바타) */
                      <img
                        src={userProfileImg || DEFAULT_IMAGES.PROFILE}
                        alt={msg.sender}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGES.PROFILE;
                        }}
                      />
                    )}
                  </div>
                )}
                <div className={`flex flex-col gap-0.5 max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                  {!msg.isMe && (
                    <span className={`text-[10px] font-bold mb-0.5 ${isLeftUser ? 'text-gray-400' : 'text-gray-500'}`}>
                      {isLeftUser
                        ? `${msg.sender} (퇴장한 사용자)`
                        : (targetUser?.nickname || targetUser?.NICKNAME || msg.sender)
                      }
                    </span>
                  )}
                  <div className={`flex items-end gap-1.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`px-3 py-1.5 rounded-2xl text-xs font-medium ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>
                      {msg.text}
                    </div>
                    <span className="text-[8px] text-gray-400 font-bold mb-0.5">{msg.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 border-t bg-white rounded-b-3xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지 입력..."
              className="flex-grow bg-gray-50 rounded-xl py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button type="submit" className="p-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingChat;