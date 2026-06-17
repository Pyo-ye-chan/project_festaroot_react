import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Send, X, MessageCircle, Minimize2, User, Paperclip } from 'lucide-react'; // ✨ Paperclip 추가
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

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.member_id || user?.id || user?.userId;

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

  const chatType = activeChat?.type?.toUpperCase() || activeChat?.room_type?.toUpperCase();
  const isPrivateChat = chatType === 'DIRECT';

  const opponent = isPrivateChat
    ? participants.find(p => {
        const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
        return String(pId) !== String(userId);
      })
    : null;

  const isOpponentLeft = isPrivateChat && participants.length > 0 && !opponent;

  const displayRoomTitle = isOpponentLeft
    ? '퇴장한 사용자'
    : activeChat?.title || `채팅방 ${roomId}`;

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
            <span className="font-black text-xs truncate">{displayRoomTitle}</span>
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

            const targetUser = participants.find(p => {
              const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
              const pUsername = p.username || p.userId || p.USER_ID || p.loginId;
              return String(pId) === String(msg.senderId) || (pUsername && String(pUsername) === String(msg.senderId));
            });

            const isLeftUser = !msg.isMe && !targetUser;
            const userProfileImg = msg.senderProfile || targetUser?.profile_image_url || targetUser?.PROFILE_IMAGE_URL;

            return (
              <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                {!msg.isMe && (
                  <div className={`w-8 h-8 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm flex items-center justify-center ${isLeftUser ? 'bg-gray-200/50 opacity-60' : ''}`}>
                    {isLeftUser ? (
                      <User className="w-4 h-4 text-gray-400" />
                    ) : (
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
                    {/* 플로팅 창 이미지/파일 랜더링 고도화 */}
                    <div className={`rounded-2xl text-xs font-medium overflow-hidden ${
                      msg.type === 'IMAGE' || msg.type === 'image'
                        ? 'p-0 shadow-none'
                        : msg.isMe ? 'bg-purple-600 text-white rounded-tr-none px-3 py-1.5' : 'bg-white text-gray-800 rounded-tl-none border px-3 py-1.5'
                    }`}>
                      {msg.type === 'IMAGE' || msg.type === 'image' ? (
                        <img 
                          src={msg.text} 
                          alt="첨부 이미지" 
                          className="max-w-[180px] max-h-40 rounded-xl object-cover border border-gray-100 cursor-pointer"
                          onClick={() => window.open(msg.text, '_blank')}
                        />
                      ) : msg.type === 'file' ? (
                        <div className="flex items-center gap-1">
                          <Paperclip className="w-3 h-3 text-purple-600 flex-shrink-0" />
                          <span className="underline truncate max-w-[110px] cursor-pointer" title={msg.text}>{msg.text}</span>
                        </div>
                      ) : (
                        msg.text
                      )}
                    </div>
                    <span className="text-[8px] text-gray-400 font-bold mb-0.5">{msg.time}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 하단 입력 폼 영역 */}
        <div className="p-3 border-t bg-white rounded-b-3xl">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            {/* 플로팅 챗 이미지 첨부 UI 추가 */}
            <label className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl cursor-pointer transition-all flex-shrink-0">
              <input
                type="file"
                accept="image/*, .pdf, .doc, .docx, .xls, .xlsx, .txt"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const isImage = file.type.startsWith('image/');
                    const fileUrl = isImage ? URL.createObjectURL(file) : file.name;
                    sendMessage(roomId, fileUrl, isImage ? 'IMAGE' : 'file');
                  }
                }}
              />
              <Paperclip className="w-4 h-4" />
            </label>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지 입력..."
              className="flex-grow bg-gray-50 rounded-xl py-1.5 px-3 text-xs outline-none focus:ring-1 focus:ring-purple-500"
            />
            <button type="submit" className="p-1.5 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors flex-shrink-0">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingChat;