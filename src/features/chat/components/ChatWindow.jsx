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
  sendMessage,
  scrollRef,
  scrollbarHideClass,
  message,
  setMessage,
  handleSendMessage,
  participants
}) => {

  const navigate = useNavigate();

  // 데이터 key 바인딩 가공
  const currentRoomId = selectedChat?.id || selectedChat?.room_id;
  const currentRoomTitle = selectedChat?.title || selectedChat?.room_title;

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
          <h2
            className="cursor-pointer hover:text-purple-600 transition-colors"
            onClick={() => toggleSidebar('details')}
          >
            {selectedChat.title}
          </h2>
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
          // 현재 메시지의 senderId와 Oracle DB 참여자 목록 매핑
          // Mapper.xml에서 대문자 변환 이슈가 있을 수 있으므로 p.member_id와 p.MEMBER_ID 모두 방어 코드 적용
          const targetUser = participants.find(p =>
            String(p.member_id || p.MEMBER_ID) === String(msg.senderId)
          );

          // 참여자 목록에 없으면 방에서 나간 사용자
          const isLeftUser = !targetUser;

          // 닉네임 표시 > 실시간 참여자 닉네임 -> 없으면 MongoDB 저장 당시 닉네임(msg.senderName) -> 없으면 '퇴장한 사용자'
          const displayNickname = targetUser?.nickname || targetUser?.NICKNAME || msg.senderName || '퇴장한 사용자';

          // 프로필 이미지 > MongoDB 프로필 -> 실시간 참여자 프로필 -> 없으면 디바이스베어 기본 아바타 (이름 기준 고정되게)
          const userProfileImg =
            msg.senderProfile ||
            targetUser?.profile_image_url ||
            targetUser?.PROFILE_IMAGE_URL ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayNickname)}`;

          {/* 메시지 송신자가 해당 방의 방장인지 확인 */ }
          const isSenderHost =
            targetUser?.is_host === 'Y' || targetUser?.IS_HOST === 'Y' ||
            targetUser?.role === 'HOST' || targetUser?.ROLE === 'HOST' ||
            targetUser?.is_owner === 'Y' || targetUser?.IS_OWNER === 'Y' ||
            (selectedChat?.owner_id && String(msg.senderId) === String(selectedChat.owner_id));

          // 메시지 타입이 입장(ENTER) 또는 퇴장(LEAVE)인 경우 센터링된 시스템 문구로 렌더링
          if (msg.type === 'ENTER' || msg.type === 'LEAVE') {
            return (
              <div key={msg.id} className="flex justify-center my-4 w-full select-none">
                <span className="bg-gray-100/80 text-gray-400 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm border border-gray-50">
                  {msg.type === 'ENTER'
                    ? `${msg.sender}님이 채팅방 입장하였습니다.`
                    : `${msg.sender}님이 채팅방에서 퇴장하였습니다.`}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-3`}>
              {!msg.isMe && (
                <div className={`w-11 h-11 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm ${isLeftUser ? 'opacity-60 filter grayscale-[30%]' : ''}`}>
                  <img
                    src={userProfileImg}
                    alt={displayNickname}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className={`flex flex-col gap-1.5 max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && (
                  <span className={`text-sm font-black ml-1 ${isLeftUser ? 'text-gray-400' : 'text-gray-700'}`}>
                    {isSenderHost && <span className="text-amber-500 text-xs" title="방장">👑 </span>}
                    {/* 결정된 고정 닉네임을 보여주고, 나간 사람이라면 뒤에 (퇴장) 표시 */}
                    {displayNickname}
                    {isLeftUser && <span className="text-[10px] font-normal text-gray-400 ml-1">(퇴장)</span>}
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
                  sendMessage(currentRoomId, file.name, 'file');
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