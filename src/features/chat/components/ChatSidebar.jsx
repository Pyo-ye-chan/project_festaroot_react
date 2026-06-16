import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, ChevronDown, ChevronUp, Users, ArrowRight } from 'lucide-react';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';

const ChatSidebar = ({
  sections,
  expandedSections,
  toggleSection,
  chatRooms,
  selectedChatId,
  setSelectedChatId,
  customScrollbarClass
}) => {
  const navigate = useNavigate();

  // roomType에 맞게 축제 또는 일반 커버 이미지를 반환하는 함수
  const getDefaultRoomImage = (roomType) => {
    return roomType === 'FESTIVAL' ? DEFAULT_IMAGES.FESTIVAL_FALLBACK : DEFAULT_IMAGES.ROOM_COVER;
  };

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
        {sections.map(section => {
          // 각 섹션 ID 유형('festival', 'group', 'private')에 맞는 채팅방 필터링
          const filteredRooms = chatRooms.filter(
            c => (c.type || c.room_type)?.toLowerCase() === section.id
          );

          return (
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
                  {/* 참여 중인 방이 없을 때 섹션별 맞춤 안내 및 이동 버튼 분기 처리 */}
                  {filteredRooms.length === 0 ? (
                    <div className="text-center py-8 px-6 text-xs font-medium text-gray-400 tracking-tight select-none flex flex-col items-center gap-3">
                      <p className="leading-relaxed whitespace-pre-line">
                        {section.id === 'festival'
                          ? '축제 찾기를 통해 원하는 축제 채팅에 참여해보세요 !'
                          : `아직 참여 중인 ${section.label}방이 없습니다.`}
                      </p>

                      {/* 축제 채팅방이 비었을 때 버튼 컴포넌트 */}
                      {section.id === 'festival' && (
                        <div className='flex gap-2 justify-center w-full'>
                          {/* 메인 액션 버튼 (크기 축소) */}
                          <button
                            onClick={() => navigate('/search')}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] rounded-lg transition-all shadow-sm shadow-purple-600/5 flex items-center gap-1 group/btn whitespace-nowrap"
                          >
                            축제 찾으러 가기
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                          </button>

                          {/* 서브 이동 버튼 (회색 톤 + 크기 축소) */}
                          <button
                            onClick={() => navigate('/community/gathering')}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 group/btn whitespace-nowrap"
                          >
                            축제 모임 보러가기
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                          </button>
                        </div>
                      )}

                      {/* 모임 채팅방이 비었을 때 버튼 (회색 톤 + 크기 축소) */}
                      {section.id === 'group' && (
                        <button
                          onClick={() => navigate('/community/gathering')}
                          className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 group/btn"
                        >
                          자유 모임 보러가기
                          <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredRooms.map((chat) => {
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
                          <div className="relative flex-shrink-0">
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden">
                              <img
                                src={chat.room_image || getDefaultRoomImage(roomType)}
                                alt={currentRoomTitle}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = getDefaultRoomImage(roomType);
                                }}
                              />
                            </div>

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
          );
        })}
      </div>
    </aside>
  );
};

export default ChatSidebar;