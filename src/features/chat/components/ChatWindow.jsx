import React from 'react';
import { ExternalLink, Users, X, Paperclip, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ChatWindow = ({
  selectedChat,
  setSelectedChatId,
  openFloatingChat,
  toggleSidebar,
  showParticipants,
  messages,
  sendMessage, // 💡 부모로부터 스토어의 sendMessage를 받음
  scrollRef,
  scrollbarHideClass,
  message,
  setMessage,
  handleSendMessage,
  participants // 👈 부모(ChatListPage)로부터 참여자 목록 데이터 접수!
}) => {

  const navigate = useNavigate();

  const getDefaultRoomImage = (title) => {
    return 'https://picsum.photos/seed/gathering/100/100';
  };

  return (
    <div className="flex flex-col flex-grow min-w-0 bg-white">
      {/* 헤더 영역 (기존과 동일) */}
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10 flex-shrink-0">
        <div
          className={`flex items-center gap-4 min-w-0 ${selectedChat?.type !== 'private' ? 'cursor-pointer group' : ''}`}
          onClick={() => selectedChat?.type !== 'private' && toggleSidebar('details')}
        >
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
            <img
              src={selectedChat?.room_image || getDefaultRoomImage(selectedChat?.title)}
              alt={selectedChat?.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getDefaultRoomImage(selectedChat?.title);
              }}
            />
          </div>
          <h2 className="text-xl font-black text-gray-900 truncate group-hover:text-purple-600">{selectedChat?.title}</h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              openFloatingChat(selectedChat.id);
              navigate('/community/chat');
            }}
            className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
          >
            <ExternalLink className="w-6 h-6" />
          </button>
          <button onClick={() => toggleSidebar('participants')} className={`p-2.5 rounded-xl transition-all ${showParticipants ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Users className="w-6 h-6" /></button>
          <button onClick={() => setSelectedChatId(null)} className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"><X className="w-6 h-6" /></button>
        </div>
      </header>

      {/* 채팅 내용 스크롤 영역 */}
      <div ref={scrollRef} className={`flex-grow overflow-y-auto p-6 space-y-6 bg-[#F8F9FF] ${scrollbarHideClass}`}>
        {messages.map(msg => {

          // 💡 [여기서 구현!] 현재 메시지의 senderId와 Oracle DB 참여자 목록 매핑
          // Mapper.xml에서 대문자 변환 이슈가 있을 수 있으므로 p.member_id와 p.MEMBER_ID 모두 방어 코드 적용
          const targetUser = participants.find(p =>
            String(p.member_id || p.MEMBER_ID) === String(msg.senderId)
          );

          // 💡 우선순위: 1. MongoDB에 저장된 프로필 -> 2. Oracle DB 실시간 프로필 -> 3. 기본 이니셜 아바타
          const userProfileImg = msg.senderProfile || targetUser?.profile_image_url || targetUser?.PROFILE_IMAGE_URL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(msg.sender)}`;

          {/* 💡 메시지 송신자가 해당 방의 방장인지 확인 */ }
          const isSenderHost =
            targetUser?.is_host === 'Y' || targetUser?.IS_HOST === 'Y' ||
            targetUser?.role === 'HOST' || targetUser?.ROLE === 'HOST' ||
            targetUser?.is_owner === 'Y' || targetUser?.IS_OWNER === 'Y' ||
            (selectedChat?.owner_id && String(msg.senderId) === String(selectedChat.owner_id));

          return (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-3`}>
              {!msg.isMe && (
                <div className="w-11 h-11 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm">
                  {/* 💡 계산된 최적의 프로필 이미지를 여기에 매핑합니다 */}
                  <img
                    src={userProfileImg}
                    alt={msg.sender}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`flex flex-col gap-1.5 max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && (
                  <span className="text-sm font-black text-gray-700 ml-1">
                    {isSenderHost && <span className="text-amber-500 text-xs" title="방장">👑 </span>}
                    {targetUser?.nickname || targetUser?.NICKNAME || msg.senderName || msg.sender}
                  </span>

                )}
                <div className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`px-6 py-3.5 rounded-2xl text-base font-medium shadow-sm ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                    {msg.type === 'file' ? (
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><Paperclip className="w-5 h-5" /></div>
                        <span className="underline cursor-pointer decoration-purple-300 underline-offset-4">{msg.text}</span>
                      </div>
                    ) : msg.text}
                  </div>
                  <span className="text-xs text-gray-400 font-bold mb-1 flex-shrink-0">{msg.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 하단 입력 폼 영역 */}
      <div className="p-6 border-t border-gray-100 bg-white flex-shrink-0">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <label className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl cursor-pointer transition-all">
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  // 💡 백엔드 파일 웹소켓으로 직접 전송하도록 수정
                  sendMessage(selectedChat.id, file.name, 'file');
                }
              }}
            />
            <Paperclip className="w-7 h-7" />
          </label>
          <div className="relative flex-grow flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="w-full bg-gray-50 rounded-2xl py-4 px-6 font-medium text-base focus:ring-2 focus:ring-purple-600/20"
            />
          </div>
          <button type="submit" className="p-4 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
            <Send className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;