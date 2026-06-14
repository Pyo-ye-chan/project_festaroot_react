import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Send, X, MessageCircle, Paperclip, Minimize2 } from 'lucide-react';
import useChatStore from '../../../store/useChatStore';

const FloatingChat = ({ roomId }) => {
  // 💡 특정 roomId를 기준으로 스토어 데이터를 동적으로 분리 바인딩합니다.
  const { 
    chatRooms,
    closeFloatingChat, 
    messagesByRoom, 
    sendMessage, 
    subscribeToRoom,
    fetchChatHistory
  } = useChatStore();
  
  const [message, setMessage] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef(null);
  const nodeRef = useRef(null);

  // 💡 플로팅 창 독자적으로 히스토리 수신 및 실시간 채널 파이프 연결
  useEffect(() => {
    if (roomId) {
      fetchChatHistory(roomId);
      subscribeToRoom(roomId);
    }
  }, [roomId, subscribeToRoom, fetchChatHistory]);

  // 전역 대화방 풀에서 내 ID 정보 추출
  const activeChat = chatRooms.find(c => c.id === roomId);
  const messages = messagesByRoom[roomId] || [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isMinimized]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(roomId, message, 'TALK');
    setMessage('');
  };

  return (
    <Draggable nodeRef={nodeRef} handle=".drag-handle" bounds="parent">
      <div 
        ref={nodeRef}
        className={`bg-white shadow-2xl rounded-3xl border border-gray-100 flex flex-col transition-[height,width,border-radius] duration-300 ${isMinimized ? 'w-16 h-16 rounded-2xl overflow-hidden' : 'w-86 h-[480px]'}`}
      >
        <header className={`drag-handle bg-purple-600 text-white cursor-move active:cursor-grabbing flex items-center flex-shrink-0 transition-all duration-300 h-14 px-4 border-b border-gray-100 rounded-t-3xl justify-between ${isMinimized ? 'h-full w-full justify-center rounded-2xl' : ''}`}>
          <div className="flex items-center gap-2 min-w-0" onClick={() => isMinimized && setIsMinimized(false)}>
            <MessageCircle className="w-5 h-5 text-white flex-shrink-0" />
            {!isMinimized && (
              <span className="font-black text-xs truncate">{activeChat?.title || `채팅방 ${roomId}`}</span>
            )}
          </div>
          
          {!isMinimized && (
            <div className="flex items-center gap-1">
              <button onClick={() => setIsMinimized(true)} className="p-1 hover:bg-white/10 rounded"><Minimize2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => closeFloatingChat(roomId)} className="p-1 hover:bg-rose-500 rounded"><X className="w-3.5 h-3.5" /></button>
            </div>
          )}
        </header>

        {!isMinimized && (
          <>
            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4 bg-[#F8F9FF]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-2`}>
                  {!msg.isMe && (
                    <div className="w-8 h-8 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1">
                      {/* 💡 가짜 아바타 주소 대신 유저의 실제 프로필 이미지를 렌더링하도록 대체 */}
                      <img 
                        src={msg.senderProfile || `https://api.dicebear.com/7.x/initials/svg?seed=${msg.sender}`} 
                        alt={msg.sender} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className={`flex flex-col gap-0.5 max-w-[80%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                    {!msg.isMe && <span className="text-[10px] font-bold text-gray-500 mb-0.5">{msg.sender}</span>}
                    <div className={`flex items-end gap-1.5 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`px-3 py-1.5 rounded-2xl text-xs font-medium ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none border'}`}>
                        {msg.text}
                      </div>
                      <span className="text-[8px] text-gray-400 font-bold mb-0.5">{msg.time}</span>
                    </div>
                  </div>
                </div>
              ))}
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
          </>
        )}
      </div>
    </Draggable>
  );
};

export default FloatingChat;