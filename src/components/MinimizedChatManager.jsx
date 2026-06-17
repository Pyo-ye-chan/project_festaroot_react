import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X, User } from 'lucide-react';
import useChatStore from '../store/useChatStore';
import { DEFAULT_IMAGES } from '../constants/DefaultImages';

function MinimizedChatManager() {
  const navigate = useNavigate();
  const { minimizedChatIds, chatRooms, restoreFloatingChat, removeFloatingChatId, currentUserId } = useChatStore();

  const handleCloseRoom = (e, id) => {
    e.stopPropagation();
    if (removeFloatingChatId) {
      removeFloatingChatId(id);
    } else if (useChatStore.setState) {
      useChatStore.setState((state) => ({
        minimizedChatIds: state.minimizedChatIds.filter((chatId) => chatId !== id),
        floatingChatIds: state.floatingChatIds.filter((chatId) => chatId !== id),
      }));
    }
  };

  if (!minimizedChatIds || minimizedChatIds.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[10000] group font-['Pretendard']">
      {/* 하단 플로팅 원형 버튼 */}
      <button className="w-16 h-16 bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
          {minimizedChatIds.length}
        </span>
      </button>

      <div className="absolute bottom-16 pt-3 right-0 hidden group-hover:block z-[10001]">
        {/* 실제 UI가 표현되는 팝업창 바디 */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl w-64 p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <p className="text-xs font-black text-gray-400 p-2 border-b border-gray-100">접힌 채팅방 목록</p>

          {/* 팝업/드롭다운 내부 목록 영역 */}
          <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1">

            {/* 1. 최상단: 전체 채팅 페이지 이동 버튼 */}
            <button
              onClick={() => navigate('/community/chat')}
              className="w-full text-center py-2 mb-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
            >
              💬 채팅 페이지로 이동
            </button>

            <hr className="border-gray-100 my-1" />

            {/* 기존 접힌 채팅방 목록 루프 */}
            {minimizedChatIds.map((id) => {
              const room = chatRooms.find((r) => r.id === id);

              // 대/소문자 및 다양한 방 키(room_type 등) 방어 코드
              const roomType = (room?.type || room?.room_type || room?.ROOM_TYPE)?.toUpperCase();
              const isDirect = roomType === 'DIRECT';
              const isOpponentLeft = isDirect && ((room?.current_count ?? room?.CURRENT_COUNT) <= 1);

              // 기본 타이틀 및 이미지 설정
              let displayTitle = isOpponentLeft
                ? '퇴장한 사용자'
                : (room?.room_title || room?.ROOM_TITLE || room?.title || room?.TITLE || `채팅방 ${id}`);

              let resolvedRoomImage = room?.room_image || room?.ROOM_IMAGE;

              // 1:1 채팅방(DIRECT)일 때 상대방 데이터 매핑 추출 (ChatSidebar 로직 동기화)
              if (isDirect) {
                // participants 배열 내부 탐색
                const opponent = room?.participants?.find(p => {
                  const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
                  return String(pId) !== String(currentUserId);
                });

                if (opponent) {
                  displayTitle = isOpponentLeft ? '퇴장한 사용자' : (opponent.nickname || opponent.NICKNAME || opponent.username || displayTitle);
                  resolvedRoomImage = opponent.profile_image_url || opponent.PROFILE_IMAGE_URL || opponent.profile_image || opponent.PROFILE_IMAGE || resolvedRoomImage;
                } else {
                  // 3-2) MyBatis 단층 Join flat object인 경우
                  displayTitle = isOpponentLeft ? '퇴장한 사용자' : (room?.opponent_nickname || room?.OPPONENT_NICKNAME || room?.target_nickname || room?.TARGET_NICKNAME || displayTitle);
                  resolvedRoomImage = room?.opponent_profile || room?.OPPONENT_PROFILE || room?.target_profile_image || room?.TARGET_PROFILE_IMAGE || room?.opponent_profile_image || room?.OPPONENT_PROFILE_IMAGE || resolvedRoomImage;
                }
              }

              return (
                <button
                  key={id}
                  onClick={() => restoreFloatingChat(id)}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all flex items-center gap-2.5 group/item justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-grow">
                    {/* 아이콘 중앙 정렬을 위해 flex items-center justify-center 추가 */}
                    <div className="w-6 h-6 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                      {isOpponentLeft ? (
                        // 퇴장한 사용자일 경우 <User /> 아이콘 노출
                        <User className="w-3.5 h-3.5 text-gray-400" />
                      ) : (
                        // 정상적인 1:1 혹은 그룹방 커버 이미지 노출
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
                    <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity">
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
    </div>
  );
}

export default MinimizedChatManager;