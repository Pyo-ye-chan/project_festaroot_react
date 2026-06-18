import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, User } from 'lucide-react';
import useChatStore from '../store/useChatStore';
import { DEFAULT_IMAGES } from '../constants/DefaultImages';

function MinimizedChatManager() {
  const navigate = useNavigate();
  const { minimizedChatIds, chatRooms, restoreFloatingChat, removeFloatingChatId, currentUserId } = useChatStore();
  
  // 모바일 터치 대응을 위한 열림/닫힘 상태 관리
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // 채팅 리스트 외부 영역을 터치/클릭하면 자동으로 목록창을 닫아주는 로직
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick); // 모바일 터치 이벤트 대응
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // 채팅방 리스트가 비어있으면 아예 렌더링하지 않음
  if (!minimizedChatIds || minimizedChatIds.length === 0) return null;

  const handleCloseRoom = (e, id) => {
    e.stopPropagation(); // 부모 버튼의 복원 이벤트 전파 차단
    if (removeFloatingChatId) {
      removeFloatingChatId(id);
    } else if (useChatStore.setState) {
      useChatStore.setState((state) => ({
        minimizedChatIds: state.minimizedChatIds.filter((chatId) => chatId !== id),
        floatingChatIds: state.floatingChatIds.filter((chatId) => chatId !== id),
      }));
    }
  };

  return (
    <div 
      ref={containerRef} 
      className="fixed bottom-6 right-6 z-[10000] font-['Pretendard']"
    >
      {/* 하단 플로팅 원형 버튼: 이제 누르면(onClick) 상태가 토글됩니다 */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
          {minimizedChatIds.length}
        </span>
      </button>

      {isOpen && (
        <div className="absolute bottom-18 pt-3 right-0 z-[10001] animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* 실제 UI가 표현되는 팝업창 바디 */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl w-64 p-2">
            <p className="text-xs font-black text-gray-400 p-2 border-b border-gray-100 select-none">
              접힌 채팅방 목록
            </p>

            {/* 팝업/드롭다운 내부 목록 영역 */}
            <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1">

              {/* 1. 최상단: 전체 채팅 페이지 이동 버튼 */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/community/chat');
                }}
                className="w-full text-center py-2 mb-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-98"
              >
                💬 채팅 페이지로 이동
              </button>

              <hr className="border-gray-100 my-1" />

              {/* 기존 접힌 채팅방 목록 루프 */}
              {minimizedChatIds.map((id) => {
                const room = chatRooms.find((r) => r.id === id);

                const roomType = (room?.type || room?.room_type || room?.ROOM_TYPE)?.toUpperCase();
                const isDirect = roomType === 'DIRECT';
                const isOpponentLeft = isDirect && ((room?.current_count ?? room?.CURRENT_COUNT) <= 1);

                let displayTitle = isOpponentLeft
                  ? '퇴장한 사용자'
                  : (room?.room_title || room?.ROOM_TITLE || room?.title || room?.TITLE || `채팅방 ${id}`);

                let resolvedRoomImage = room?.room_image || room?.ROOM_IMAGE;

                if (isDirect) {
                  const opponent = room?.participants?.find(p => {
                    const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
                    return String(pId) !== String(currentUserId);
                  });

                  if (opponent) {
                    displayTitle = isOpponentLeft ? '퇴장한 사용자' : (opponent.nickname || opponent.NICKNAME || opponent.username || displayTitle);
                    resolvedRoomImage = opponent.profile_image_url || opponent.PROFILE_IMAGE_URL || opponent.profile_image || opponent.PROFILE_IMAGE || resolvedRoomImage;
                  } else {
                    displayTitle = isOpponentLeft ? '퇴장한 사용자' : (room?.opponent_nickname || room?.OPPONENT_NICKNAME || room?.target_nickname || room?.target_NICKNAME || displayTitle);
                    resolvedRoomImage = room?.opponent_profile || room?.OPPONENT_PROFILE || room?.target_profile_image || room?.TARGET_PROFILE_IMAGE || room?.opponent_profile_image || room?.OPPONENT_PROFILE_IMAGE || resolvedRoomImage;
                  }
                }

                return (
                  <button
                    key={id}
                    onClick={() => {
                      restoreFloatingChat(id); // 채팅방 복원
                      setIsOpen(false); // 복원 시 목록창을 닫아주어 모바일 뷰 최적화
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all flex items-center gap-2.5 group/item justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-grow">
                      <div className="w-6 h-6 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {isOpponentLeft ? (
                          <User className="w-3.5 h-3.5 text-gray-400" />
                        ) : (
                          <img
                            src={resolvedRoomImage || DEFAULT_IMAGES.PROFILE}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        )}
                      </div>
                      <span className="truncate flex-grow">
                        {displayTitle}
                      </span>
                    </div>

                    {/* 열기 안내 및 개별 닫기 버튼 영역 */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-md opacity-0 lg:group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
                        열기
                      </span>
                      <div
                        onClick={(e) => handleCloseRoom(e, id)}
                        className="p-1 text-gray-400 hover:text-rose-500 rounded-md hover:bg-gray-100 transition-colors"
                        title="채팅방 닫기"
                      >
                        <X className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MinimizedChatManager;