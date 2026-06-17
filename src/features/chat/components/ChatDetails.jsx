import React, { useState } from 'react';
import { Ban, MapPin, X, Calendar, LogOut, Crown, ExternalLink, MessageCircle, User, Settings } from 'lucide-react';
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
  onKickParticipant,    // 강퇴 핸들러 함수
  onStartDirectChat    // 1:1 채팅 시작
}) => {
  const isOpen = showParticipants || showDetails;
  const navigate = useNavigate();

  // 클릭된 유저의 프로필 메뉴를 토글하기 위한 상태 추가
  const [activeMenuMemberId, setActiveMenuMemberId] = useState(null);

  // Oracle 대소문자 이슈 방어를 위한 데이터 정규화 추출
  const chatType = selectedChat?.type?.toUpperCase() || selectedChat?.room_type?.toUpperCase();
  const startDate = selectedChat?.free_date;
  const endDate = selectedChat?.event_end_date;
  const locationText = selectedChat?.free_location;

  // 백엔드에서 넘어오는 축제 고유 ID (content_id) 추출
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

      <aside className={`absolute right-0 top-0 h-full border-l border-gray-100 flex flex-col bg-white z-30 transition-all duration-300 ease-in-out ${isOpen ? 'w-72 translate-x-0 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.15)]' : 'w-72 translate-x-full'}`}>
        <div className="p-4 border-b border-gray-50 flex items-center justify-between">
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
                const profileImg = p.profile_image_url || p.PROFILE_IMAGE_URL || DEFAULT_IMAGES.PROFILE;

                const isHost =
                  p.is_host === 'Y' || p.IS_HOST === 'Y' ||
                  p.role === 'HOST' || p.ROLE === 'HOST' ||
                  p.is_owner === 'Y' || p.IS_OWNER === 'Y' ||
                  (selectedChat?.owner_id && String(memberId) === String(selectedChat.owner_id));

                const isMe = String(memberId) === String(currentUserId);
                return (
                  <div key={memberId} className="flex flex-col border-b border-gray-50/50 pb-2 last:border-none">
                    <div className="flex items-center justify-between p-2">
                      {/* ✨ [수정] 본인이거나, 1:1 방이 아닐 때만 유저 메뉴를 펼치도록 cursor 및 토글 이벤트 가드 적용 */}
                      <div
                        className={`flex items-center gap-3 group ${isMe || chatType !== 'DIRECT' ? 'cursor-pointer' : 'cursor-default'}`}
                        onClick={() => {
                          if (isMe || chatType !== 'DIRECT') {
                            setActiveMenuMemberId(activeMenuMemberId === memberId ? null : memberId);
                          }
                        }}
                      >
                        <img
                          src={profileImg}
                          className="w-10 h-10 rounded-full object-cover transition-transform group-hover:scale-105"
                          alt={nickname}
                        />
                        <span className={`text-base font-bold transition-colors ${isMe || chatType !== 'DIRECT' ? 'group-hover:text-purple-600' : ''}`}>
                          {nickname}
                        </span>
                        {isHost && (
                          <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                        )}
                      </div>

                      {isCurrentUserHost && !isMe && (
                        <button
                          onClick={() => onKickParticipant(memberId, nickname)}
                          className="text-gray-300 hover:text-rose-500 transition-colors"
                          title="추방하기"
                        >
                          <Ban className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* 하단 드롭다운 메뉴 영역 (본인 유무에 따라 버튼 분기 처리) */}
                    {activeMenuMemberId === memberId && (
                      <div className="px-2 pb-2 animate-in fade-in slide-in-from-top-1 duration-200">
                        {isMe ? (
                          /* 본인 프로필일 때: 프로필 수정 버튼 노출 (/mypage로 이동) */
                          <button
                            onClick={() => {
                              navigate('/mypage');
                              setActiveMenuMemberId(null);
                            }}
                            className="w-full py-1.5 px-3 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                          >
                            <Settings className="w-4 h-4" />
                            내 프로필 수정
                          </button>
                        ) : (
                          /* 타인 프로필일 때: 현재 방이 1:1(DIRECT)이 아닐 때만 1:1 채팅 버튼 노출 */
                          chatType !== 'DIRECT' && (
                            <button
                              onClick={() => {
                                onStartDirectChat(memberId, nickname);
                                setActiveMenuMemberId(null);
                              }}
                              className="w-full py-1.5 px-3 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              1:1 채팅 보내기
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {showDetails && (
            <div className="p-6 space-y-6">
              {(chatType === 'FESTIVAL' || chatType === 'GROUP') && (
                <>
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

                  <div className="space-y-1">
                    <p className="text-sm font-black text-gray-400 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-purple-600" />
                      위치
                    </p>
                    <p className="text-base font-bold text-gray-800 pl-5.5 leading-snug">
                      {locationText || "등록된 위치 정보가 없습니다."}
                    </p>
                  </div>

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

        {/* {chatType !== 'DIRECT' && ( */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex-shrink-0">
            <button
              onClick={onLeaveRoom}
              className="w-full py-3 px-4 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 shadow-sm group"
            >
              <LogOut className="w-4 h-4 text-red-500 group-hover:translate-x-0.5 transition-transform" />
              채팅방 나가기
            </button>
          </div>
        {/* )} */}
      </aside>
    </>
  );
};

export default ChatDetails;