import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../../../store/useChatStore';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatDetails from '../components/ChatDetails';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import gatheringApi from '../../../api/gatheringApi';
import { useNavigate, useParams } from 'react-router-dom';

const ChatListPage = () => {
  const [participants, setParticipants] = useState([]);
  const [roomDetail, setRoomDetail] = useState(null);
  const { roomId } = useParams();
  const navigate = useNavigate();

  const {
    activeChatId,
    setActiveChatId,
    floatingChatIds,
    chatRooms,
    setChatRooms,
    connectWebSocket,
    subscribeToRoom,
    fetchChatHistory,
    messagesByRoom,
    sendMessage,
    openFloatingChat,
    closeFloatingChat
  } = useChatStore();

  const [displayChatId, setDisplayChatId] = useState(null);
  const [message, setMessage] = useState('');

  // 로컬스토리지에서 로그인한 유저 ID 추출
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user?.userId || user?.id || user?.member_id;

  // 선택된 채팅 및 상세정보 매핑 변수를 함수들이 참조
  const selectedChat = chatRooms.find(c => Number(c.id) === Number(activeChatId || displayChatId));
  const detailedChat = selectedChat ? { ...selectedChat, ...roomDetail } : null;

  // 컴포넌트 마운트 시 웹소켓 서버 최초 연결
  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  // 방 변경 시, 참여자뿐만 아니라 실제 "모임 소개글/규칙"이 포함된 상세 데이터도 패치
  useEffect(() => {
    if (activeChatId) {
      fetchChatHistory(activeChatId, userId);
      subscribeToRoom(activeChatId);

      // 채팅 읽음 처리 요청 보내기
      gatheringApi.updateReadStatus(activeChatId, userId);

      // 참여자 목록 패치
      const fetchParticipants = async () => {
        try {
          const res = await gatheringApi.gatheringParticipants(activeChatId);

          // 방장의 ID를 구해서 각 참여자 객체에 정확히 방장 여부(isOwner) 주입하기
          const resParticipants = res || [];
          const currentOwnerId = roomDetail?.owner_id || selectedChat?.owner_id;

          const mappedParticipants = resParticipants.map(p => {
            const pId = p.member_id || p.MEMBER_ID || p.id;
            return {
              ...p,
              isOwner: currentOwnerId && String(pId) === String(currentOwnerId) // 정확한 방장 조건 검사
            };
          });

          setParticipants(mappedParticipants);
        } catch (e) {
          console.error("참여자 목록 로드 실패", e);
        }
      };

      // ✨ 모임 상세 원격 내용 패치 (오른쪽 레이어에 띄울 핵심 알맹이)
      const fetchRoomDetail = async () => {
        try {
          const res = await gatheringApi.gatheringDetail(activeChatId);
          setRoomDetail(res); // 백엔드 내부의 room_description 등이 완벽하게 탑재됨
        } catch (e) {
          console.error("모임 상세 내용 패치 실패", e);
        }
      };

      fetchParticipants();
      fetchRoomDetail();
    }
  }, [activeChatId, userId, fetchChatHistory, subscribeToRoom]);

  // 채팅방(모임) 나가기 핸들러 함수
  const handleLeaveRoom = async () => {
    if (!activeChatId || !userId) return;

    // 1. 현재 사용자가 이 방의 방장(Owner)인지 확인
    // detailedChat 이나 selectedChat 에 owner_id 가 포함되어 있는지 확인하세요.
    const isOwner = selectedChat?.owner_id === userId || roomDetail?.owner_id === userId;

    if (isOwner) {
      // 참여자가 방장 자신 제외하고 더 있는지 확인 (participants는 자신을 포함하고 있음)
      const otherParticipants = participants.filter(p => {
        const pId = p.member_id || p.MEMBER_ID || p.id;
        return String(pId) !== String(userId);
      });

      if (otherParticipants.length === 0) {
        if (window.confirm("참여자가 없어 모임이 자동으로 삭제됩니다. 정말 나가시겠습니까?")) {
          try {
            await gatheringApi.deleteGathering(activeChatId, userId);
            alert("모임이 삭제되었습니다.");
            setActiveChatId(null);
            navigate('/community/chat');
            setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
          } catch (error) {
            alert("모임 삭제 중 오류가 발생했습니다.");
          }
        }
        return; // 함수 종료
      } else {
        // ⚠️ 중요: 채팅방 화면에는 위임 팝업UI가 없을 수 있으므로, 
        // 가장 간단하게는 '가장 먼저 들어온 사람(혹은 첫 번째 참여자)'에게 자동 위임되도록 처리하거나 알림을 줘야 합니다.
        if (window.confirm("방장 권한이 다음 참여자에게 자동 위임되고 퇴장합니다. 나가시겠습니까?")) {
          try {
            const nextOwnerId = otherParticipants[0].member_id || otherParticipants[0].MEMBER_ID || otherParticipants[0].id;

            // 백엔드 위임 API 호출
            await gatheringApi.delegateOwner(activeChatId, userId, nextOwnerId);
            // 그 후 퇴장 API 호출
            await gatheringApi.leaveGathering(activeChatId, userId);

            alert("방장 권한을 위임하고 채팅방에서 퇴장하였습니다.");
            setActiveChatId(null);
            navigate('/community/chat');
            setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
          } catch (error) {
            console.error("위임 퇴장 중 오류:", error);
            alert("위임 처리 중 오류가 발생했습니다.");
          }
        }
        return;
      }
    }

    // 방장이 아닌 일반 유저의 기존 퇴장 로직
    if (!window.confirm("정말 이 채팅방(모임)에서 나가시겠습니까?")) return;

    try {
      await gatheringApi.leaveGathering(activeChatId, userId);
      alert("채팅방에서 퇴장하였습니다.");
      setActiveChatId(null);
      navigate('/community/chat');
      setChatRooms(chatRooms.filter((room) => room.id !== activeChatId));
    } catch (error) {
      console.error("채팅방 나가기 실패:", error);
      alert("채팅방을 나가는 도중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (activeChatId) {
      setDisplayChatId(activeChatId);
    } else {
      const timer = setTimeout(() => {
        setDisplayChatId(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [activeChatId]);

  // URL 주소에 roomId가 없을 때는 자동으로 빈 화면(목록만) 렌더링하도록 분기 처리
  useEffect(() => {
    if (roomId) {
      const parsedRoomId = Number(roomId);
      if (activeChatId !== parsedRoomId) {
        setActiveChatId(parsedRoomId);
      }
    } else {
      // URL 경로가 '/community/chat' 형태로 들어왔다면 열려있던 방 선택을 지워줌
      setActiveChatId(null);
    }
  }, [roomId, activeChatId, setActiveChatId]);

  const handleRoomClick = (id) => {
    navigate(`/community/chat/${id}`);
  };

  const [showParticipants, setShowParticipants] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    festival: true,
    group: true,
    private: true
  });
  const scrollRef = useRef(null);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleSidebar = (type) => {
    if (type === 'participants') {
      setShowParticipants(!showParticipants);
      setShowDetails(false);
    } else {
      if (selectedChat?.type?.toUpperCase() === 'PRIVATE') return;
      setShowDetails(!showDetails);
      setShowParticipants(false);
    }
  };

  useEffect(() => {
    const fetchMyChatRooms = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.userId || user?.id || user?.member_id;
        if (!userId) return;

        const responseData = await gatheringApi.getJoinedGatherings(userId, 1, 100, '전체');
        const rawRooms = Array.isArray(responseData) ? responseData : (responseData.list || []);

        const formattedRooms = rawRooms.map(room => ({
          id: Number(room.room_id),
          type: room.room_type,
          title: room.room_title,
          description: room.room_description,
          room_image: room.room_image,
          current_count: room.current_count,
          max_capacity: room.max_capacity,
          nickname: room.nickname,
          profile_image_url: room.profile_image_url,
          unread_count: room.unread_count || 0, // 미확인 메세지 수
          lastMessage: room.lastMessage || room.last_message || room.LAST_MESSAGE || '대화 내용이 없습니다.', // 백엔드에서 넘겨준 마지막 메시지 필드를 프론트 상태에 매핑 
          owner_id: room.owner_id
        }));

        setChatRooms(formattedRooms);
      } catch (error) {
        console.error("채팅방 목록 로드 실패:", error);
      }
    };
    fetchMyChatRooms();
  }, [setChatRooms]);

  const sections = [
    { id: 'festival', label: '축제 채팅' },
    { id: 'group', label: '모임 채팅' },
    { id: 'private', label: '1:1 채팅' },
  ];

  const messages = messagesByRoom[activeChatId] || [];

  const setMessages = (updater) => {
    if (Array.isArray(updater)) {
      const lastAddedMsg = updater[updater.length - 1];
      if (lastAddedMsg && lastAddedMsg.type === 'file') {
        sendMessage(activeChatId, lastAddedMsg.text, 'file');
      }
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(activeChatId, message, 'TALK');
    setMessage('');
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChatId, displayChatId]);

  const customScrollbarClass = "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300";
  const scrollbarHideClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  // 활성화된 채팅방이 바뀌면 해당 방의 unread_count를 0으로 리셋 (무한루프 방지 조건 포함)
  useEffect(() => {
    if (!activeChatId) return;

    const targetRoom = chatRooms.find(r => r.id === Number(activeChatId));
    // 해당 방이 존재하고, 읽지 않은 메시지가 1개 이상일 때만 상태 업데이트 트리거
    if (targetRoom && targetRoom.unread_count > 0) {
      const updated = chatRooms.map(room =>
        room.id === Number(activeChatId) ? { ...room, unread_count: 0 } : room
      );
      setChatRooms(updated);
    }
  }, [activeChatId, chatRooms, setChatRooms]);

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9">
            <div className="flex h-[750px] bg-white shadow-xl overflow-hidden rounded-[2.5rem] border border-gray-100">
              <ChatSidebar
                sections={sections}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                chatRooms={chatRooms}
                selectedChatId={activeChatId}
                setSelectedChatId={handleRoomClick}
                customScrollbarClass={customScrollbarClass}
              />

              <div className={`hidden md:flex flex-grow min-w-0 bg-[#F8F9FF] relative overflow-hidden transition-all duration-500 ease-in-out ${activeChatId ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                style={{ flexGrow: activeChatId ? 1 : 0.00001, minWidth: activeChatId ? '0' : '0', width: activeChatId ? 'auto' : '0' }}>
                {selectedChat && (
                  <div className="w-full h-full flex">
                    <ChatWindow
                      selectedChat={detailedChat}
                      setSelectedChatId={setActiveChatId}
                      openFloatingChat={openFloatingChat}
                      toggleSidebar={toggleSidebar}
                      showParticipants={showParticipants}
                      messages={messages}
                      sendMessage={sendMessage}
                      scrollRef={scrollRef}
                      scrollbarHideClass={scrollbarHideClass}
                      message={message}
                      setMessage={setMessage}
                      handleSendMessage={handleSendMessage}
                      participants={participants}
                    />

                    <ChatDetails
                      showParticipants={showParticipants}
                      showDetails={showDetails}
                      participants={participants}
                      selectedChat={detailedChat}
                      customScrollbarClass={customScrollbarClass}
                      toggleSidebar={toggleSidebar}
                      onLeaveRoom={handleLeaveRoom}
                    />
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;