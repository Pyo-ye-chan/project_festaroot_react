import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../../../store/useChatStore';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatDetails from '../components/ChatDetails';
import CommunitySidebar from '../../community/components/CommunitySidebar';
import gatheringApi from '../../../api/gatheringApi';
import { useNavigate, useParams } from 'react-router-dom';

const ChatListPage = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [participants, setParticipants] = useState([]);
  const { roomId } = useParams(); // 주소창의 room_id (/community/chat/19 -> 19)
  const navigate = useNavigate();

  // Zustand 스토어에서 정확한 상태와 액션 명칭으로 구조분해할당
  const {
    activeChatId,
    setActiveChatId,
    connectWebSocket,
    subscribeToRoom,
    fetchChatHistory,
    messagesByRoom,
    sendMessage,
    openFloatingChat
  } = useChatStore();

  const [displayChatId, setDisplayChatId] = useState(null);
  const [message, setMessage] = useState('');

  // 최초 진입 시 글로벌 웹소켓 파이프라인 연결
  useEffect(() => {
    connectWebSocket();
  }, [connectWebSocket]);

  // 대화방 선택(activeChatId 변경) 시 실시간 토픽 채널 구독 트리거
  // 💡 [대화방 진입 동기화 변경] 방 번호가 바뀔 때 과거 히스토리와 실시간 구독을 연속적으로 활성화합니다.
  useEffect(() => {
    if (activeChatId) {
      // 1. 먼저 MongoDB 백엔드에서 이전 채팅 내역 로드
      fetchChatHistory(activeChatId);
      // 2. 이어서 실시간 수신용 파이프 연결
      subscribeToRoom(activeChatId);
    }
  }, [activeChatId, fetchChatHistory, subscribeToRoom]);

  // 사이드바 닫힘 애니메이션을 위한 displayChatId 딜레이 처리
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

  // 1. 주소창의 roomId가 변경될 때마다 스토어의 activeChatId 상태를 동기화
  useEffect(() => {
    if (roomId) {
      const parsedRoomId = Number(roomId);
      if (activeChatId !== parsedRoomId) {
        setActiveChatId(parsedRoomId);
      }
    }
  }, [roomId, activeChatId, setActiveChatId]);

  // 2. 왼쪽 채팅방 목록에서 다른 방을 클릭했을 때 처리하는 함수
  const handleRoomClick = (id) => {
    // URL 자체를 변경하여 useParams(roomId)가 감지하도록 유도합니다.
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
      if (selectedChat?.type === 'private') return;
      setShowDetails(!showDetails);
      setShowParticipants(false);
    }
  };

  // 내가 참여 중인 모임(채팅방) 리스트 조회 및 이미지 매핑
  useEffect(() => {
    const fetchMyChatRooms = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?.userId || user?.id || user?.member_id;
        if (!userId) {
          console.warn("로그인한 유저 정보를 찾을 수 없습니다.");
          return;
        }

        const responseData = await gatheringApi.getJoinedGatherings(userId, 1, 100, '전체');
        const rawRooms = Array.isArray(responseData) ? responseData : (responseData.list || []);

        // DB에서 가져온 데이터(축제 기본이미지 or 모임 등록 이미지)를 UI 포맷으로 매핑
        const formattedRooms = rawRooms.map(room => ({
          id: room.room_id,
          type: room.room_type,
          title: room.room_title,
          description: room.room_description,
          room_image: room.room_image, // Mapper의 NVL 처리에 의해 항상 유효한 URL이 담김
          current_count: room.current_count,
          max_capacity: room.max_capacity,
          nickname: room.nickname,
          profile_image_url: room.profile_image_url
        }));

        setChatRooms(formattedRooms);
      } catch (error) {
        console.error("채팅방 목록 로드 실패:", error);
      }
    };

    fetchMyChatRooms();
  }, []);

  const sections = [
    { id: 'festival', label: '축제 채팅' },
    { id: 'group', label: '모임 채팅' },
    { id: 'private', label: '1:1 채팅' },
  ];

  // 스토어에서 실시간 메시지 바인딩
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

  // 선택된 채팅방 정보 객체 추출
  const selectedChat = chatRooms.find(c => c.id === (activeChatId || displayChatId));

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChatId, displayChatId]);

  const customScrollbarClass = "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300";
  const scrollbarHideClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar */}
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-9">
            <div className="flex h-[750px] bg-white shadow-xl overflow-hidden rounded-[2.5rem] border border-gray-100">
              {/* 채팅 리스트 사이드바 */}
              <ChatSidebar
                sections={sections}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                chatRooms={chatRooms}
                selectedChatId={activeChatId}
                setSelectedChatId={handleRoomClick} // 클릭 시 URL 변경 함수로 교체
                customScrollbarClass={customScrollbarClass}
              />

              {/* 오른쪽 채팅 메인 창 영역 (activeChatId가 있을 때 열림) */}
              <div className={`hidden md:flex flex-grow min-w-0 bg-[#F8F9FF] relative overflow-hidden transition-all duration-500 ease-in-out ${activeChatId ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
                style={{ flexGrow: activeChatId ? 1 : 0.00001, minWidth: activeChatId ? '0' : '0', width: activeChatId ? 'auto' : '0' }}>
                {selectedChat && (
                  <div className="w-full h-full flex">
                    <ChatWindow
                      selectedChat={selectedChat}
                      setSelectedChatId={setActiveChatId}
                      openFloatingChat={openFloatingChat}
                      toggleSidebar={toggleSidebar}
                      showParticipants={showParticipants}
                      messages={messages}
                      setMessages={setMessages}
                      scrollRef={scrollRef}
                      scrollbarHideClass={scrollbarHideClass}
                      message={message}
                      setMessage={setMessage}
                      handleSendMessage={handleSendMessage}
                    />

                    <ChatDetails
                      showParticipants={showParticipants}
                      showDetails={showDetails}
                      participants={participants}
                      selectedChat={selectedChat}
                      customScrollbarClass={customScrollbarClass}
                      toggleSidebar={toggleSidebar}
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