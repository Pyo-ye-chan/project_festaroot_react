import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, X } from 'lucide-react';
import useChatStore from '../store/useChatStore';

function MinimizedChatManager() {
  const navigate = useNavigate();
  const { minimizedChatIds, chatRooms, restoreFloatingChat, removeFloatingChatId } = useChatStore();

  // 만약 스토어에 완전히 닫는 액션 이름이 다르다면(예: closeChat 등) 해당 이름으로 매칭해주세요.
  const handleCloseRoom = (e, id) => {
    e.stopPropagation(); // 버튼 클릭 시 부모의 restoreFloatingChat이 실행되지 않도록 이벤트 전파 차단
    if (removeFloatingChatId) {
      removeFloatingChatId(id);
    } else if (useChatStore.setState) {
      // 스토어에 별도 삭제 액션이 없을 경우 임시 방편 제어 코드
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

            {/* 2. 기존 접힌 채팅방 목록 루프 */}
            {minimizedChatIds.map((id) => {
              const room = chatRooms.find((r) => r.id === id);

              return (
                <button
                  key={id}
                  onClick={() => restoreFloatingChat(id)}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all flex items-center gap-2.5 group/item justify-between"
                >
                  <div className="flex items-center gap-2 min-w-0 flex-grow">
                    <div className="w-6 h-6 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={room?.room_image || 'https://picsum.photos/seed/gathering/100/100'}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                    </div>
                    <span className="truncate flex-grow">
                      {room?.title || `채팅방 ${id}`}
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