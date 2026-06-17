import React, { useState } from 'react';
import { ExternalLink, Users, X, Paperclip, Send, User, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';

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
  participants,
  onStartPrivateChat, // 1:1 채팅 시작
  currentUserId // 로그인한 본인 아이디 받아오기 추가
}) => {

  const navigate = useNavigate();

  // 프로필 클릭 시 드롭다운을 표시하기 위한 메시지 ID 상태 관리
  const [activeProfileMenuId, setActiveProfileMenuId] = useState(null);

  // 데이터 key 바인딩 가공
  const currentRoomId = selectedChat?.id || selectedChat?.room_id;
  const currentRoomTitle = selectedChat?.title || selectedChat?.room_title;

  const chatType = selectedChat?.type?.toUpperCase() || selectedChat?.room_type?.toUpperCase();
  const isPrivateChat = chatType === 'DIRECT'; // 현재 방이 1:1 채팅방인지 여부 확인

  // 1:1 채팅방일 때 참여자 목록(participants)에서 내가 아닌 상대방 추출
  const opponent = isPrivateChat
    ? participants.find(p => {
      const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
      return String(pId) !== String(currentUserId);
    })
    : null;

  // 1. 1:1 채팅방이면서 상대방(opponent)을 찾을 수 없는 경우 퇴장 플래그 생성
  const isOpponentLeft = isPrivateChat && !opponent;

  // 2. 퇴장 플래그가 true면 타이틀을 '퇴장한 사용자'로 강제 고정
  const displayRoomTitle = isOpponentLeft
    ? '퇴장한 사용자'
    : opponent
      ? (opponent.nickname || opponent.NICKNAME || opponent.username || selectedChat?.title || selectedChat?.room_title)
      : (selectedChat?.title || selectedChat?.room_title || '채팅방');

  const displayRoomImage = opponent
    ? (opponent.profile_image_url || opponent.PROFILE_IMAGE_URL)
    : selectedChat?.room_image;

  // 타입별 기본 룸 이미지 선택 함수
  const getDefaultRoomImage = (type) => {
    return type === 'FESTIVAL' ? DEFAULT_IMAGES.FESTIVAL_FALLBACK : DEFAULT_IMAGES.ROOM_COVER;
  };

  return (
    <div className="flex flex-col flex-grow min-w-0 bg-white">
      {/* 헤더 영역 */}
      <header className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10 flex-shrink-0">
        <div
          className={`flex items-center gap-4 min-w-0 ${!isPrivateChat ? 'cursor-pointer group' : ''}`}
          onClick={() => !isPrivateChat && toggleSidebar('details')}
        >
          {/* 3. 아이콘 중앙 정렬을 위해 flex items-center justify-center 추가 */}
          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex items-center justify-center flex-shrink-0">
            {isOpponentLeft ? (
              // 상대방이 나간 1:1 채팅방이면 Lucide User 아이콘 렌더링
              <User className="w-6 h-6 text-gray-400" />
            ) : (
              // 정상 채팅방 혹은 기존 룸 이미지 로직 그대로 유지
              <img
                src={displayRoomImage || (isPrivateChat ? DEFAULT_IMAGES.PROFILE : getDefaultRoomImage(chatType))}
                alt={displayRoomTitle}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = isPrivateChat ? DEFAULT_IMAGES.PROFILE : getDefaultRoomImage(chatType);
                }}
              />
            )}
          </div>
          {/* 가공된 상대방 닉네임 타이틀 실시간 바인딩 */}
          <h2
            className="font-bold text-lg cursor-pointer hover:text-purple-600 transition-colors"
            onClick={() => toggleSidebar('details')}
          >
            {displayRoomTitle}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              openFloatingChat(currentRoomId);
              navigate('/community/chat');
            }}
            className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
          >
            <ExternalLink className="w-6 h-6" />
          </button>
          <button onClick={() => toggleSidebar('participants')} className={`p-2.5 rounded-xl transition-all ${showParticipants ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Users className="w-6 h-6" /></button>
          <button onClick={() => { setSelectedChatId(null); navigate('/community/chat'); }} className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl">
            <X className="w-6 h-6" />
          </button>
        </div>
      </header>

      {/* 채팅 내용 스크롤 영역 */}
      <div ref={scrollRef} className={`flex-grow overflow-y-auto p-6 space-y-6 bg-[#F8F9FF] ${scrollbarHideClass}`}>
        {messages.map(msg => {
          const targetUser = participants.find(p => {
            const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
            const pUsername = p.username || p.userId || p.USER_ID || p.loginId;
            return String(pId) === String(msg.senderId) || (pUsername && String(pUsername) === String(msg.senderId));
          });

          const isLeftUser = !msg.isMe && !targetUser;

          const existingName = targetUser?.nickname || targetUser?.NICKNAME || msg.senderName || msg.sender;
          const displayNickname = isLeftUser
            ? (existingName ? `${existingName}(퇴장한 사용자)` : '퇴장한 사용자')
            : existingName;

          const userProfileImg =
            msg.senderProfile ||
            targetUser?.profile_image_url ||
            targetUser?.PROFILE_IMAGE_URL;

          const isSenderHost =
            targetUser?.is_host === 'Y' || targetUser?.IS_HOST === 'Y' ||
            targetUser?.role === 'HOST' || targetUser?.ROLE === 'HOST' ||
            targetUser?.is_owner === 'Y' || targetUser?.IS_OWNER === 'Y' ||
            (selectedChat?.owner_id && String(msg.senderId) === String(selectedChat.owner_id));

          if (msg.type === 'ENTER' || msg.type === 'LEAVE' || msg.type === 'KICK' || msg.type === 'DM') {
            return (
              <div key={msg.id} className="flex justify-center my-4 w-full select-none">
                <span className="bg-gray-100/80 text-gray-400 text-xs font-semibold px-4 py-1.5 rounded-full shadow-sm border border-gray-50">
                  {msg.type === 'ENTER' && `${msg.sender}님이 입장하셨습니다.`}
                  {msg.type === 'LEAVE' && `${msg.sender}님이 퇴장하셨습니다.`}
                  {msg.type === 'KICK' && (msg.text || `${msg.sender}님이 퇴장당하셨습니다.`)}
                  {msg.type === 'DM' && `채팅이 시작되었습니다.`}
                </span>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-3`}>
              {!msg.isMe && (
                <div className="relative">
                  {/* 이미 1:1 채팅방(isPrivateChat)일 경우 클릭 이벤트 및 마우스 커서 비활성화 */}
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLeftUser && !isPrivateChat) {
                        setActiveProfileMenuId(activeProfileMenuId === msg.id ? null : msg.id);
                      }
                    }}
                    className={`w-11 h-11 rounded-2xl bg-gray-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm flex items-center justify-center transition-all ${isLeftUser || isPrivateChat
                      ? 'bg-gray-200/50 cursor-default'
                      : 'cursor-pointer hover:scale-105 active:scale-95 group'
                      }`}
                  >
                    {isLeftUser ? (
                      <User className="w-5 h-5 text-gray-400" />
                    ) : (
                      <img
                        src={userProfileImg || DEFAULT_IMAGES.PROFILE}
                        alt={displayNickname}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_IMAGES.PROFILE;
                        }}
                      />
                    )}
                  </div>

                  {/* 채팅방 내부 프로필 사진 클릭 시 뜨는 1:1 채팅 미니 팝업 UI */}
                  {activeProfileMenuId === msg.id && !isLeftUser && !isPrivateChat && (
                    <div className="absolute left-0 top-14 w-44 bg-white border border-gray-150/80 rounded-2xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="px-3 py-1 border-b border-gray-50 mb-1">
                        <p className="text-[10px] font-black text-gray-400">유저 메뉴</p>
                        <p className="text-xs font-black text-gray-800 truncate">{displayNickname}</p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const memberId = targetUser?.member_id || targetUser?.MEMBER_ID || targetUser?.id || msg.senderId;
                          onStartPrivateChat(memberId, displayNickname);
                          setActiveProfileMenuId(null);
                        }}
                        className="w-full px-3 py-2 text-left text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-purple-600" />
                        1:1 채팅 보내기
                      </button>
                    </div>
                  )}
                </div>
              )}

              <div className={`flex flex-col gap-1.5 max-w-[75%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                {!msg.isMe && (
                  /* 닉네임 클릭 시에도 1:1 채팅방이면 팝업 방지 및 스타일링 분기 */
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!isLeftUser && !isPrivateChat) {
                        setActiveProfileMenuId(activeProfileMenuId === msg.id ? null : msg.id);
                      }
                    }}
                    className={`text-sm font-black ml-1 select-none ${isLeftUser
                      ? 'text-gray-400 cursor-default'
                      : 'text-black cursor-default'
                      }`}
                  >
                    {isSenderHost && <span className="text-amber-500 text-xs" title="방장">👑 </span>}
                    {displayNickname}
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