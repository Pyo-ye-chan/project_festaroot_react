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
  const [roomDetail, setRoomDetail] = useState(null); // 💡 백엔드에서 긁어올 리얼 상세정보 보관소 추가
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

  // 💡 방 변경 시, 참여자뿐만 아니라 실제 "모임 소개글/규칙"이 포함된 상세 데이터도 패치
  useEffect(() => {
    if (activeChatId) {
      fetchChatHistory(activeChatId);
      subscribeToRoom(activeChatId);

      // 참여자 목록 패치
      const fetchParticipants = async () => {
        try {
          const res = await gatheringApi.gatheringParticipants(activeChatId);
          setParticipants(res || []);
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
  }, [activeChatId, fetchChatHistory, subscribeToRoom]);

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

  useEffect(() => {
    if (roomId) {
      const parsedRoomId = Number(roomId);
      if (activeChatId !== parsedRoomId) {
        setActiveChatId(parsedRoomId);
      }
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
          id: room.room_id,
          type: room.room_type,
          title: room.room_title,
          description: room.room_description,
          room_image: room.room_image,
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
  }, [setChatRooms]);

  const selectedChat = chatRooms.find(c => c.id === (activeChatId || displayChatId));

  // 실시간으로 들고온 상세 정보를 깔끔하게 덧씌웁니다.
  const detailedChat = selectedChat
    ? { ...selectedChat, ...roomDetail }
    : null;

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