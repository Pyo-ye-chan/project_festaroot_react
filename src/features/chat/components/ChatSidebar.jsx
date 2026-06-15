import React from 'react';
import { MessageCircle, Search, ChevronDown, ChevronUp, Users } from 'lucide-react';

const ChatSidebar = ({
  sections,
  expandedSections,
  toggleSection,
  chatRooms,
  selectedChatId,
  setSelectedChatId,
  customScrollbarClass
}) => {
  // 임시 이미지 기본 생성 함수
  const getDefaultRoomImage = (title) => {
    return 'https://picsum.photos/seed/gathering/100/100';
  };

  // 1:1 채팅방만 필터링
  const privateRooms = chatRooms.filter(
    (room) =>
      room.type?.toUpperCase() === 'PRIVATE' ||
      room.room_type?.toUpperCase() === 'PRIVATE'
  );

  return (
    <aside className={`flex flex-col bg-white z-20 overflow-y-auto transition-all duration-500 ${customScrollbarClass} ${selectedChatId ? 'w-full md:w-64 lg:w-72 border-r border-gray-100' : 'flex-grow w-full'}`}>
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-purple-600" />
          메시지
        </h1>
        <div className="relative group">
          <input type="text" placeholder="채팅방 검색..." className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-600/20 transition-all" />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 w-4 h-4" />
        </div>
      </div>

      <div className={`flex-grow overflow-y-auto pt-4 ${customScrollbarClass}`}>
        {sections.map(section => (
          <div key={section.id} className="mb-2 last:mb-0">
            <div className="px-6 py-2">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between font-black text-gray-600 text-sm uppercase tracking-wider hover:text-purple-600 transition-colors"
              >
                {section.label}
                {expandedSections[section.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div className="mt-2 border-b border-gray-200"></div>
            </div>

            {expandedSections[section.id] && (
              <div className="animate-in slide-in-from-top-2 duration-300">
                {section.id === 'private' && privateRooms.length === 0 ? (
                  <div className="text-center py-8 text-xs font-medium text-gray-400 tracking-tight select-none">
                    아직 참여 중인 1:1 채팅방이 없습니다.
                  </div>
                ) : (
                  chatRooms
                    .filter(c => (c.type || c.room_type)?.toLowerCase() === section.id)
                    .map((chat) => {
                      const currentRoomId = chat.id || chat.room_id;
                      const currentRoomTitle = chat.title || chat.room_title;
                      const roomType = (chat.type || chat.room_type)?.toUpperCase();

                      return (
                        <button
                          key={currentRoomId}
                          onClick={() =>
                            setSelectedChatId(
                              selectedChatId === currentRoomId ? null : currentRoomId
                            )
                          }
                          className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-l-4 ${selectedChatId === currentRoomId
                            ? 'bg-purple-50/50 border-purple-600'
                            : 'border-transparent'
                            }`}
                        >

                          {/* 핵심 수정: 배지 위치 레이아웃을 부모 relative 공간 안으로 격리 */}
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden">
                              <img
                                src={chat.room_image || getDefaultRoomImage(currentRoomTitle)}
                                alt={currentRoomTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = getDefaultRoomImage(currentRoomTitle);
                                }}
                              />
                            </div>

                            {/* 읽지 않은 메시지 수 배지 위치를 이미지 우상단 딱 맞는 곳으로 이동 완료 */}
                            {chat.unread_count > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white select-none animate-bounce z-10">
                                {chat.unread_count}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-grow text-left">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-black text-gray-900 text-base truncate flex-grow">
                                {currentRoomTitle}
                              </h3>

                              {/* 1:1 채팅이 아닐 때만 현재인원/최대인원 배지 표시 */}
                              {roomType !== 'PRIVATE' && chat.current_count !== undefined && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex-shrink-0 select-none">
                                  <Users className="w-3 h-3" />
                                  <span>
                                    {chat.current_count}
                                    {chat.max_capacity ? `/${chat.max_capacity}` : ''}
                                  </span>
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-500 truncate mt-0.5">
                              {chat.lastMessage}
                            </p>
                          </div>
                        </button>
                      );
                    })
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default ChatSidebar;