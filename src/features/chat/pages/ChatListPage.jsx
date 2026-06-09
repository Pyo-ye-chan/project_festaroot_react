import React, { useState, useEffect, useRef } from 'react';
import useChatStore from '../../../store/useChatStore';
import ChatSidebar from '../components/ChatSidebar';
import ChatWindow from '../components/ChatWindow';
import ChatDetails from '../components/ChatDetails';
import CommunitySidebar from '../../community/components/CommunitySidebar';

const ChatListPage = () => {
  const openFloatingChat = useChatStore(state => state.openFloatingChat);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [message, setMessage] = useState('');
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

  const chatRooms = [
    { id: 1, type: 'festival', title: '한강 달빛 야시장 같이 가실 분? 🌙', lastMessage: '6시에 여의나루역에서 볼까요?', time: '오후 2:36', unreadCount: 3, avatar: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=200', date: '2026.06.01 - 06.07', location: '서울 한강공원' },
    { id: 2, type: 'festival', title: '경복궁 야간개장 티켓팅 성공 기원방 🏯', lastMessage: '내일 오후 2시 오픈이래요!', time: '오후 1:45', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1467307983825-619715426c70?auto=format&fit=crop&q=80&w=200', date: '2026.06.15 - 07.15', location: '서울 경복궁' },
    { id: 3, type: 'group', title: '전국 축제 도장깨기 모임 🚌', lastMessage: '다음 주는 어디로 갈까요?', time: '오전 11:20', unreadCount: 12, avatar: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=200' },
    { id: 4, type: 'group', title: '부산 불꽃축제 사진 동호회 🎆', lastMessage: '마린시티 쪽도 괜찮나요?', time: '어제', unreadCount: 0, avatar: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=200' },
    { id: 5, type: 'private', title: '김철수님', lastMessage: '오늘 축제 재밌었어요!', time: '오전 09:12', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
  ];

  const sections = [
    { id: 'festival', label: '축제 채팅' },
    { id: 'group', label: '모임 채팅' },
    { id: 'private', label: '1:1 채팅' },
  ];

  const [messages, setMessages] = useState([
    { id: 1, sender: '김철수', text: '안녕하세요! 이번 주말에 다들 가시나요?', time: '오후 2:30', isMe: false },
    { id: 2, sender: '이영희', text: '네! 저도 참여하고 싶어요 ㅎㅎ', time: '오후 2:31', isMe: false },
    { id: 3, sender: '박지민', text: '혹시 몇시쯤 모이는 게 좋을까요?', time: '오후 2:33', isMe: false },
    { id: 4, sender: '나', text: '저는 6시쯤이 좋을 것 같아요! 노을도 보고 야시장도 구경하구요.', time: '오후 2:35', isMe: true },
    { id: 5, sender: '이영희', text: '좋아요! 6시에 여의나루역에서 볼까요?', time: '오후 2:36', isMe: false },
  ]);

  const participants = [
    { id: 1, name: '김철수', status: 'online', role: '방장' },
    { id: 2, name: '이영희', status: 'online', role: '멤버' },
    { id: 6, name: '나', status: 'online', role: '나' },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessages([...messages, { id: messages.length + 1, sender: '나', text: message, time: '방금', isMe: true }]);
    setMessage('');
  };

  const selectedChat = chatRooms.find(c => c.id === selectedChatId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChatId]);

  const customScrollbarClass = "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-gray-300";
  const scrollbarHideClass = "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]";

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar (3 cols) */}
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          {/* Main Content (9 cols) */}
          <main className="lg:col-span-9">
            <div className="flex h-[750px] bg-white shadow-xl overflow-hidden rounded-[2.5rem] border border-gray-100">
              <ChatSidebar 
                sections={sections}
                expandedSections={expandedSections}
                toggleSection={toggleSection}
                chatRooms={chatRooms}
                selectedChatId={selectedChatId}
                setSelectedChatId={setSelectedChatId}
                customScrollbarClass={customScrollbarClass}
              />

              {selectedChatId && (
                <div className="hidden md:flex flex-grow min-w-0 bg-[#F8F9FF] relative overflow-hidden">
                  <ChatWindow 
                    selectedChat={selectedChat}
                    setSelectedChatId={setSelectedChatId}
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;