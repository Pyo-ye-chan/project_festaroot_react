import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Search, ChevronDown, ChevronUp, Users, ArrowRight, User } from 'lucide-react'; // 1. User 아이콘 추가
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';

const ChatSidebar = ({
  sections,
  expandedSections,
  toggleSection,
  chatRooms,
  selectedChatId,
  setSelectedChatId,
  customScrollbarClass,
  currentUserId // 상대방 매핑을 필터링하기 위해 로그인한 본인 아이디 수신
}) => {
  const navigate = useNavigate();

  // 검색어 입력을 관리할 로컬 상태
  const [searchKeyword, setSearchKeyword] = useState('');

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
          <input
            type="text"
            placeholder="채팅방 검색..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-600/20 transition-all"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 w-4 h-4" />
        </div>
      </div>

      <div className={`flex-grow overflow-y-auto pt-4 ${customScrollbarClass}`}>
        {sections.map(section => {
          const filteredRooms = chatRooms.filter(c => {
            // 대/소문자 모두 방어하도록 수정
            const roomType = (c.type || c.room_type || c.ROOM_TYPE)?.toUpperCase();
            const matchesSection = roomType?.toLowerCase() === section.id;

            // 검색 필터링 시에도 1:1 채팅방의 상대방 닉네임 기준으로 검색되도록 개선
            let displayTitle = c.room_title || c.ROOM_TITLE || c.title || c.TITLE || '';

            if (roomType === 'DIRECT') {
              const opponent = c.participants?.find(p => {
                const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
                return String(pId) !== String(currentUserId);
              });

              if (opponent) {
                displayTitle = opponent.nickname || opponent.NICKNAME || opponent.username || displayTitle;
              } else {
                displayTitle = c.opponent_nickname || c.OPPONENT_NICKNAME || c.target_nickname || c.TARGET_NICKNAME || displayTitle;
              }
            }

            const matchesKeyword = displayTitle.toLowerCase().includes(searchKeyword.toLowerCase());
            return matchesSection && matchesKeyword;
          });

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
                  {filteredRooms.length === 0 ? (
                    <div className="text-center py-8 px-6 text-xs font-medium text-gray-400 tracking-tight select-none flex flex-col items-center gap-3">
                      <p className="leading-relaxed whitespace-pre-line">
                        {searchKeyword
                          ? '검색 결과와 일치하는 채팅방이 없습니다.'
                          : section.id === 'festival'
                            ? '축제 찾기를 통해 원하는 축제 채팅에 참여해보세요 !'
                            : `아직 참여 중인 ${section.label}방이 없습니다.`
                        }
                      </p>

                      {!searchKeyword && section.id === 'festival' && (
                        <div className='flex gap-2 justify-center w-full'>
                          <button
                            onClick={() => navigate('/search')}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-[10px] rounded-lg transition-all shadow-sm shadow-purple-600/5 flex items-center gap-1 group/btn whitespace-nowrap"
                          >
                            축제 찾으러 가기
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                          </button>
                          <button
                            onClick={() => navigate('/community/gathering')}
                            className="px-2.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-[10px] rounded-lg transition-all flex items-center gap-1 group/btn whitespace-nowrap"
                          >
                            축제 모임 보러가기
                            <ArrowRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
                          </button>
                        </div>
                      )}

                      {!searchKeyword && section.id === 'group' && (
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
                      // Oracle MyBatis 대문자 키 대응 변환 및 방어코드 추가
                      const currentRoomId = chat.id || chat.room_id || chat.ROOM_ID;
                      const roomType = (chat.type || chat.room_type || chat.ROOM_TYPE)?.toUpperCase();

                      let currentRoomTitle = chat.room_title || chat.ROOM_TITLE || chat.title || chat.TITLE || '퇴장한 사용자';
                      let currentRoomImage = chat.room_image || chat.ROOM_IMAGE;

                      const unreadCount = chat.unread_count ?? chat.UNREAD_COUNT ?? 0;
                      const currentCount = chat.current_count ?? chat.CURRENT_COUNT;
                      const maxCapacity = chat.max_capacity ?? chat.MAX_CAPACITY;
                      const lastMessage = chat.lastMessage || chat.last_message || chat.LAST_MESSAGE;
                      const lastMessageType = chat.lastMessageType || chat.last_message_type || chat.LAST_MESSAGE_TYPE || chat.message_type;

                      if (roomType === 'DIRECT') {
                        // 1) 만약 내부 participants 배열이 존재하는 경우 탐색
                        const opponent = chat.participants?.find(p => {
                          const pId = p.member_id || p.MEMBER_ID || p.id || p.ID;
                          return String(pId) !== String(currentUserId);
                        });

                        if (opponent) {
                          currentRoomTitle = opponent.nickname || opponent.NICKNAME || opponent.username || currentRoomTitle;
                          currentRoomImage = opponent.profile_image_url || opponent.PROFILE_IMAGE_URL || opponent.profile_image || opponent.PROFILE_IMAGE || currentRoomImage;
                        } else {
                          // 2) MyBatis 단층 Join 결과(flat object)인 경우 대/소문자 모두 조회해서 매핑
                          currentRoomTitle = chat.opponent_nickname || chat.OPPONENT_NICKNAME || chat.target_nickname || chat.TARGET_NICKNAME || currentRoomTitle;
                          currentRoomImage = chat.opponent_profile || chat.OPPONENT_PROFILE || chat.target_profile_image || chat.TARGET_PROFILE_IMAGE || chat.opponent_profile_image || chat.OPPONENT_PROFILE_IMAGE || currentRoomImage;
                        }
                      }

                      // 2. 오직 1:1 채팅이면서 최종 방 타이틀이 '퇴장한 사용자'일 때만 true가 되는 안전한 플래그 생성
                      const isOpponentLeft = roomType === 'DIRECT' && currentRoomTitle === '퇴장한 사용자';

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
                            {/* 3. 아이콘 중앙 정렬을 위해 부모 div에 flex items-center justify-center 추가 */}
                            <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden flex items-center justify-center">
                              {isOpponentLeft ? (
                                // 퇴장한 사용자일 때만 Lucide <User /> 아이콘 적용
                                <User className="w-5 h-5 text-gray-400" />
                              ) : (
                                // 퇴장하지 않은 정상 유저는 하늘님이 짜두신 기존 img 로직 그대로 수행
                                <img
                                  src={currentRoomImage || (roomType === 'DIRECT' ? DEFAULT_IMAGES.PROFILE : getDefaultRoomImage(roomType))}
                                  alt={currentRoomTitle}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = (roomType === 'PRIVATE' || roomType === 'DIRECT') ? DEFAULT_IMAGES.PROFILE : getDefaultRoomImage(roomType);
                                  }}
                                />
                              )}
                            </div>

                            {unreadCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white ring-2 ring-white select-none animate-bounce z-10">
                                {unreadCount}
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-grow text-left">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="font-black text-gray-900 text-base truncate flex-grow">
                                {currentRoomTitle}
                              </h3>

                              {roomType !== 'PRIVATE' && roomType !== 'DIRECT' && currentCount !== undefined && (
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full flex-shrink-0 select-none">
                                  <Users className="w-3 h-3" />
                                  <span>
                                    {currentCount}
                                    {maxCapacity ? `/${maxCapacity}` : ''}
                                  </span>
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-500 truncate mt-0.5">
                              {(() => {
                                if (!lastMessage) return '대화 내용이 없습니다.';

                                // 조건 A: 백엔드에서 마지막 메시지 타입을 명확히 내려주는 경우 (가장 이상적)
                                if (lastMessageType?.toUpperCase() === 'IMAGE') {
                                  return '이미지를 보냈습니다.';
                                }
                                if (lastMessageType?.toUpperCase() === 'FILE') {
                                  return '파일을 보냈습니다.';
                                }

                                // 조건 B: 타입이 없어서 프론트에서 URL 주소 자체로 판별해야 하는 경우 (안전 장치)
                                if (typeof lastMessage === 'string' && lastMessage.startsWith('http')) {
                                  // GCS의 chat 폴더 경로를 포함하거나 이미지 확장자로 끝나는지 체크
                                  if (lastMessage.includes('/chat/') || lastMessage.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) {
                                    return '이미지를 보냈습니다.';
                                  }
                                }

                                return lastMessage;
                              })()}
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