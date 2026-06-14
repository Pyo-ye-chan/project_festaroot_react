import React from 'react';
import { Ban, MapPin, X, Calendar } from 'lucide-react';

const ChatDetails = ({
  showParticipants,
  showDetails,
  participants,
  selectedChat,
  customScrollbarClass,
  toggleSidebar
}) => {
  const isOpen = showParticipants || showDetails;

  // 💡 Oracle 대소문자 이슈 방어를 위한 데이터 정규화 추출
  const chatType = selectedChat?.type?.toUpperCase() || selectedChat?.room_type?.toUpperCase();

  // 시작일 / 모임일 추출
  const startDate = selectedChat?.free_date;

  // 종료일 추출
  const endDate = selectedChat?.event_end_date;

  // 위치 정보 추출
  const locationText = selectedChat?.free_location;

  return (
    <>
      {/* Backdrop for mobile or just to indicate overlay */}
      {isOpen && (
        <div
          className="absolute inset-0 bg-black/5 z-20 md:hidden"
          onClick={() => toggleSidebar(showParticipants ? 'participants' : 'details')}
        />
      )}

      <aside className={`absolute right-0 top-0 h-full border-l border-gray-100 flex flex-col bg-white z-30 transition-all duration-300 ease-in-out ${isOpen ? 'w-72 translate-x-0 shadow-[-20px_0_40px_-20px_rgba(0,0,0,0.15)]' : 'w-72 translate-x-full'} ${customScrollbarClass}`}>
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
                const profileImg = p.profile_image_url || p.PROFILE_IMAGE_URL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nickname)}`;

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
                        <span className="bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 rounded-md font-black border border-amber-200 shadow-sm flex items-center gap-0.5">
                          👑 방장
                        </span>
                      )}
                    </div>
                    <button className="text-gray-300 hover:text-rose-500">
                      <Ban className="w-5 h-5" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {showDetails && (
            <div className="p-6 space-y-6">
              {/* 💡 축제(FESTIVAL) 및 일반 모임(GROUP) 정보 레이아웃 다변화 노출 */}
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
      </aside>
    </>
  );
};

export default ChatDetails;