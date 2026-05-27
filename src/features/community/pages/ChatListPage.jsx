import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Users, 
  ExternalLink, 
  MoreVertical, 
  Image as ImageIcon, 
  Smile, 
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Video,
  MessageCircle
} from 'lucide-react';

const ChatListPage = () => {
  const [selectedChatId, setSelectedChatId] = useState(1);
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
      setShowDetails(!showDetails);
      setShowParticipants(false);
    }
  };

  // Mock Data: Chat Rooms (categorized)
  const chatRooms = [
    { id: 1, type: 'festival', title: '한강 달빛 야시장 같이 가실 분? 🌙', lastMessage: '6시에 여의나루역에서 볼까요?', time: '오후 2:36', unreadCount: 3, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=River' },
    { id: 2, type: 'festival', title: '경복궁 야간개장 티켓팅 성공 기원방 🏯', lastMessage: '내일 오후 2시 오픈이래요!', time: '오후 1:45', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Palace' },
    { id: 3, type: 'group', title: '전국 축제 도장깨기 모임 🚌', lastMessage: '다음 주는 어디로 갈까요?', time: '오전 11:20', unreadCount: 12, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Travel' },
    { id: 4, type: 'group', title: '부산 불꽃축제 사진 동호회 🎆', lastMessage: '마린시티 쪽도 괜찮나요?', time: '어제', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fire' },
    { id: 5, type: 'private', title: '김철수님', lastMessage: '오늘 축제 재밌었어요!', time: '오전 09:12', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix' },
    { id: 6, type: 'festival', title: '보령 머드축제 같이 갈 사람 🌊', lastMessage: '준비물 뭐 챙겨가나요?', time: '오전 08:30', unreadCount: 1, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mud' },
    { id: 7, type: 'festival', title: '전주 한옥마을 투어 🍚', lastMessage: '비빔밥 맛집 어디가 최고인가요?', time: '어제', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Food' },
    { id: 8, type: 'group', title: '축제 사진 공유방 📸', lastMessage: '오늘 사진들 올렸습니다!', time: '2일 전', unreadCount: 5, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Camera' },
    { id: 9, type: 'group', title: '서울 불꽃축제 벙개 모임 🧨', lastMessage: '63빌딩 앞 스팟 확보 완료', time: '3일 전', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Spark' },
    { id: 10, type: 'private', title: '이영희님', lastMessage: '네 알겠습니다!', time: '3일 전', unreadCount: 0, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah' },
  ];

  const sections = [
    { id: 'festival', label: '축제 채팅' },
    { id: 'group', label: '모임 채팅' },
    { id: 'private', label: '1:1 채팅' },
  ];


  // Mock Data: Messages for selected chat
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
    { id: 3, name: '박지민', status: 'online', role: '멤버' },
    { id: 4, name: '최다은', status: 'offline', role: '멤버' },
    { id: 5, name: '정우성', status: 'online', role: '멤버' },
    { id: 6, name: '나', status: 'online', role: '나' },
  ];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, selectedChatId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: '나',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setMessages([...messages, newMessage]);
    setMessage('');
  };

  const handlePopOut = () => {
    const width = 450;
    const height = 700;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);
    
    window.open(
      `/community/chat/${selectedChatId}`,
      `ChatRoom_${selectedChatId}`,
      `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`
    );
  };

  const selectedChat = chatRooms.find(c => c.id === selectedChatId);

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 font-['Pretendard']">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <div className="max-w-7xl mx-auto w-full flex bg-white shadow-xl overflow-hidden md:my-10 md:rounded-[2.5rem] border border-gray-100">
        
        {/* Left Sidebar: Chat List */}
        <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-100 bg-white z-20 custom-scrollbar overflow-y-auto">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              메시지
            </h1>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="채팅방 검색..."
                className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-10 pr-4 text-sm focus:ring-2 focus:ring-purple-600/20 transition-all"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 w-4 h-4" />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {sections.map(section => (
              <div key={section.id} className="border-b border-gray-50 last:border-0">
                <button 
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 font-black text-gray-600 text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors"
                >
                  {section.label}
                  {expandedSections[section.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections[section.id] && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    {chatRooms.filter(c => c.type === section.id).map((chat) => (
                      <button
                        key={chat.id}
                        onClick={() => setSelectedChatId(chat.id)}
                        className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-l-4 ${
                          selectedChatId === chat.id ? 'bg-purple-50/50 border-purple-600' : 'border-transparent'
                        }`}
                      >
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden">
                            <img src={chat.avatar} alt={chat.title} className="w-full h-full object-cover" />
                          </div>
                          {chat.unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="min-w-0 flex-grow text-left">
                          <div className="flex justify-between items-center mb-1">
                            <h3 className="font-black text-gray-900 text-sm truncate">{chat.title}</h3>
                            <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap">{chat.time}</span>
                          </div>
                          <p className="text-xs font-medium text-gray-500 truncate leading-relaxed">
                            {chat.lastMessage}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Right Area: Chat Window + Participants */}
        <div className="hidden md:flex flex-grow min-w-0 bg-gray-50/30">
          
          {/* Main Chat Area */}
          <div className="flex flex-col flex-grow min-w-0 bg-white">
            {/* Chat Header */}
            <header className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10">
              <div className="flex items-center gap-4 min-w-0 cursor-pointer group" onClick={() => toggleSidebar('details')}>
                <div className="w-10 h-10 rounded-xl bg-purple-100 overflow-hidden">
                  <img src={selectedChat?.avatar} alt={selectedChat?.title} />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-black text-gray-900 truncate group-hover:text-purple-600 transition-colors">
                    {selectedChat?.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      <Users className="w-3 h-3" /> 12명 참여 중
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={handlePopOut}
                  className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                  title="새 창으로 열기"
                >
                  <ExternalLink className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => toggleSidebar('participants')}
                  className={`p-2.5 rounded-xl transition-all ${showParticipants ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
                >
                  <Users className="w-5 h-5" />
                </button>
              </div>
            </header>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/30 scrollbar-hide"
            >
              <div className="flex justify-center mb-10">
                <span className="text-[10px] font-black text-gray-400 bg-gray-100 px-4 py-1.5 rounded-full uppercase tracking-widest">
                  2026년 5월 27일
                </span>
              </div>

              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {!msg.isMe && (
                    <div className="w-9 h-9 rounded-2xl bg-purple-100 flex-shrink-0 mb-4 self-start overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} />
                    </div>
                  )}
                  
                  <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    {!msg.isMe && (
                      <span className="text-[10px] font-black text-gray-400 mb-1.5 ml-1">{msg.sender}</span>
                    )}
                    <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm leading-relaxed ${
                      msg.isMe 
                      ? 'bg-purple-600 text-white rounded-tr-none' 
                      : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                  
                  <span className="text-[10px] font-bold text-gray-400 mb-1">{msg.time}</span>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <div className="p-6 bg-white border-t border-gray-100">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <div className="flex gap-1">
                  <button type="button" className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                  <button type="button" className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                    <Smile className="w-5 h-5" />
                  </button>
                </div>
                <input 
                  type="text" 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-grow bg-gray-50 border-none rounded-2xl py-3.5 px-6 focus:ring-2 focus:ring-purple-600/20 transition-all font-medium text-sm"
                />
                <button 
                  type="submit"
                  className={`p-3.5 rounded-2xl transition-all shadow-lg ${
                    message.trim() 
                    ? 'bg-purple-600 text-white shadow-purple-200 hover:bg-purple-700 active:scale-95' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>

          {/* Participants/Details Sidebar (Inside Right Area) */}
          <aside className={`border-l border-gray-100 flex flex-col bg-white overflow-hidden transition-all duration-300 ease-in-out custom-scrollbar overflow-y-auto ${(showParticipants || showDetails) ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
            {showParticipants && (
              <>
                <div className="p-6 border-b border-gray-100 whitespace-nowrap">
                  <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                    참여 인원 
                    <span className="text-purple-600 font-bold">{participants.length}</span>
                  </h3>
                </div>
                
                <div className="flex-grow overflow-y-auto p-3 space-y-1 custom-scrollbar">
                  {participants.map((person) => (
                    <div key={person.id} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 overflow-hidden">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${person.name}`} alt={person.name} />
                          </div>
                          {person.status === 'online' && (
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-800 truncate">{person.name}</p>
                          <p className={`text-[10px] font-bold ${person.role === '방장' ? 'text-purple-600' : 'text-gray-400'}`}>
                            {person.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                  <button className="w-full py-3 bg-white text-rose-500 font-black text-xs rounded-xl hover:bg-rose-50 transition-all border border-rose-100">
                    방 나가기
                  </button>
                </div>
              </>
            )}

            {showDetails && (
              <div className="p-6">
                <h3 className="font-black text-gray-900 mb-4 text-sm">채팅방 상세 정보</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-black text-gray-400 mb-1">채팅방 설명</p>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {selectedChat?.title}에 대한 상세 설명입니다. 축제 기간 정보 및 공지사항을 확인하세요.
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl">
                    <p className="text-xs font-black text-gray-400 mb-1">방 생성일</p>
                    <p className="text-sm font-bold text-gray-700">2026. 05. 20</p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ChatListPage;
