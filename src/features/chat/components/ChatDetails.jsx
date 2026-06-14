import React from 'react';
import { Ban, MapPin, X } from 'lucide-react';

const ChatDetails = ({
  showParticipants,
  showDetails,
  participants,
  selectedChat,
  customScrollbarClass,
  toggleSidebar
}) => {
  const isOpen = showParticipants || showDetails;

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
                // 💡 1. Oracle 대문자 이슈 및 id/member_id 통합 방어 조치
                const memberId = p.member_id || p.MEMBER_ID || p.id;
                const nickname = p.nickname || p.NICKNAME || '이름 없음';

                // 💡 2. 구글 프로필 URL 우선 적용 -> 없으면 이니셜 아바타로 대체
                const profileImg = p.profile_image_url || p.PROFILE_IMAGE_URL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(nickname)}`;

                {/* 💡 대소문자 속성 및 선택한 방의 개설자 ID 정보를 비교하여 방장 판별 */ }
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
              {selectedChat?.type === 'festival' && (
                <>
                  <div><p className="text-sm font-black text-gray-400">축제 기간</p><p className="text-base font-bold">{selectedChat.date}</p></div>
                  <div><p className="text-sm font-black text-gray-400">위치</p><p className="text-base font-bold flex items-center gap-1"><MapPin className="w-5 h-5" />{selectedChat.location}</p></div>
                </>
              )}
              <div className="pt-4 border-t border-gray-50">
                <p className="text-sm font-black text-gray-400 mb-2">설명</p>
                <p className="text-base text-gray-600 leading-relaxed">
                  이 채팅방은 {selectedChat?.title}에 대한 정보를 공유하고 함께 방문할 메이트를 찾는 공간입니다. 매너 있는 대화 부탁드립니다.
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