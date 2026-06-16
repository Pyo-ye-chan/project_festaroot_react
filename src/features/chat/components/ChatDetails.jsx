import React from 'react';
import { Ban, MapPin, X, Calendar, LogOut, Crown, ExternalLink } from 'lucide-react';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';
import { useNavigate } from 'react-router-dom';

const ChatDetails = ({
  showParticipants,
  showDetails,
  participants,
  selectedChat,
  customScrollbarClass,
  toggleSidebar,
  onLeaveRoom,
  currentUserId,        // 로그인한 사용자 ID
  isCurrentUserHost,    // 현재 사용자가 방장인지 여부
  onKickParticipant     // 강퇴 핸들러 함수
}) => {
  const isOpen = showParticipants || showDetails;

  const navigate = useNavigate();

  // Oracle 대소문자 이슈 방어를 위한 데이터 정규화 추출
  const chatType = selectedChat?.type?.toUpperCase() || selectedChat?.room_type?.toUpperCase();
  const startDate = selectedChat?.free_date;
  const endDate = selectedChat?.event_end_date;
  const locationText = selectedChat?.free_location;

  // 백엔드에서 넘어오는 축제 고유 ID (content_id) 추출 -> chat_room에서 저장하는 축제 고유 ID 이름이 festival_id임.
  const contentId = selectedChat?.festival_id || selectedChat?.content_id || selectedChat?.CONTENT_ID;

  return (
    <>
      {/* Backdrop for mobile or just to indicate overlay */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/5 z-20 md:hidden"
          onClick={() => toggleSidebar(showParticipants ? 'participants' : 'details')}
        />
      )}

      <aside className={`absolute right-0 top-0 h-full border-l border-gray-100 flex flex-col bg-white z-30 transition-all duration-300 ease-in-out ${isOpen ? 'w-72 translate-x-0 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.15)]' : 'w-72 translate-x-full'}`}>       <div className="p-4 border-b border-gray-50 flex items-center justify-between">
        <h3 className="font-black text-gray-900 text-base">
          {showParticipants ? '참여 인원' : '채팅방 상세 정보'}
        </h3>
        <button
          onClick={() => toggleSidebar(showParticipants ? 'participants' : 'details')}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors text-gray-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

        <div className="flex-grow overflow-y-auto">
          {showParticipants && (
            <div className="p-4 space-y-2">
              {participants.map(p => {
                const memberId = p.member_id || p.MEMBER_ID || p.id;
                const nickname = p.nickname || p.NICKNAME || '이름 없음';
                const profileImg = p.profile_image_url || p.PROFILE_IMAGE_URL || DEFAULT_IMAGES.PROFILE;;

                const isHost =
                  p.is_host === 'Y' || p.IS_HOST === 'Y' ||
                  p.role === 'HOST' || p.ROLE === 'HOST' ||
                  p.is_owner === 'Y' || p.IS_OWNER === 'Y' ||
                  (selectedChat?.owner_id && String(memberId) === String(selectedChat.owner_id));

                return (
                  <div key={memberId} className="flex items-center justify-between p-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={profileImg}
                        className="w-10 h-10 rounded-full object-cover"
                        alt={nickname}
                      />
                      <span className="text-base font-bold">{nickname}</span>
                      {isHost && (
                        <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                      )}
                    </div>

                    {/* 내가 방장이고, 본인이 아닐 때만 강퇴(Ban) 아이콘 표시 */}
                    {isCurrentUserHost && String(memberId) !== String(currentUserId) && (
                      <button
                        onClick={() => onKickParticipant(memberId, nickname)}
                        className="text-gray-300 hover:text-rose-500 transition-colors"
                        title="추방하기"
                      >
                        <Ban className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {showDetails && (
            <div className="p-6 space-y-6">
              {/* 축제(FESTIVAL) 및 일반 모임(GROUP) 정보 레이아웃 다변화 노출 */}
              {(chatType === 'FESTIVAL' || chatType === 'GROUP') && (
                <>
                  {/* 일정 정보 매핑 */}
                  {startDate ? (
                    <div className="space-y-1">
                      <p className="text-sm font-black text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        {chatType === 'FESTIVAL' ? '축제 기간' : '모임 일정'}
                      </p>
                      <p className="text-base font-bold text-gray-800 pl-5.5">
                        {startDate} {endDate ? `~ ${endDate}` : ''}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-sm font-black text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-purple-600" />
                        일정 정보
                      </p>
                      <p className="text-sm font-medium text-gray-400 pl-5.5">상시 진행 또는 정보 없음</p>
                    </div>
                  )}

                  {/* 위치 정보 매핑 */}
                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-400 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      위치
                    </p>
                    <p className="text-base font-bold text-gray-800 pl-5.5 leading-snug">
                      {locationText || "등록된 위치 정보가 없습니다."}
                    </p>
                  </div>

                  {/* 타입이 축제(FESTIVAL)이고 contentId가 존재할 때만 '축제 찾기 페이지' 이동 버튼 노출 */}
                  {chatType === 'FESTIVAL' && contentId && (
                    <div className="pt-1">
                      <button
                        onClick={() => navigate(`/festival/${contentId}`)}
                        className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg font-bold text-[11px] transition-all flex items-center justify-center gap-1 shadow-2xs"
                      >
                        축제 정보 더보기
                        <ExternalLink className="w-3 h-3 text-amber-600" />
                      </button>
                    </div>
                  )}

                </>
              )}

              {/* 하단 설명 영역 */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-sm font-black text-gray-400 mb-2">소개글 및 규칙</p>
                <p className="text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                  {selectedChat?.room_description || selectedChat?.description ||
                    `${selectedChat?.title || '이'} 채팅방은 자유롭게 소통하는 공간입니다. 매너 있는 대화 부탁드립니다.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 최하단 고정 나가기 버튼 영역 추가 */}
        {/* 1:1 채팅방(PRIVATE)이 아닐 때만 나가기 버튼이 보이도록 안전장치를 둘 수도 있습니다. */}
        {chatType !== 'PRIVATE' && (
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <button
              onClick={onLeaveRoom}
              className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm group"
            >
              <LogOut className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" />
              채팅방 나가기
            </button>
          </div>
        )}

      </aside>
    </>
  );
};

export default ChatDetails;