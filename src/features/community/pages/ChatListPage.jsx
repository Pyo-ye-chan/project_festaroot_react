import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Users, 
  ExternalLink, 
  Image as ImageIcon, 
  Smile, 
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Phone,
  Video,
  MessageCircle,
  MapPin,
  Calendar,
  Ban
} from 'lucide-react';

const ChatListPage = () => {
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

  return (
    <div className="flex h-[calc(100vh-120px)] bg-gray-50 font-['Pretendard']">
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e5e7eb; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #d1d5db; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="max-w-7xl mx-auto w-full flex bg-white shadow-xl overflow-hidden md:my-10 md:rounded-[2.5rem] border border-gray-100">
        
        <aside className="w-full md:w-80 lg:w-96 flex flex-col border-r border-gray-100 bg-white z-20 custom-scrollbar overflow-y-auto">
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

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {sections.map(section => (
              <div key={section.id} className="border-b border-gray-50 last:border-0">
                <button onClick={() => toggleSection(section.id)} className="w-full flex items-center justify-between p-4 font-black text-gray-600 text-sm uppercase tracking-widest hover:bg-gray-50 transition-colors">
                  {section.label}
                  {expandedSections[section.id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {expandedSections[section.id] && (
                  <div className="animate-in slide-in-from-top-2 duration-300">
                    {chatRooms.filter(c => c.type === section.id).map((chat) => (
                      <button key={chat.id} onClick={() => setSelectedChatId(chat.id)} className={`w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-all border-l-4 ${selectedChatId === chat.id ? 'bg-purple-50/50 border-purple-600' : 'border-transparent'}`}>
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-2xl bg-gray-100 overflow-hidden"><img src={chat.avatar} alt={chat.title} className="w-full h-full object-cover" /></div>
                        </div>
                        <div className="min-w-0 flex-grow text-left">
                          <h3 className="font-black text-gray-900 text-sm truncate">{chat.title}</h3>
                          <p className="text-xs font-medium text-gray-500 truncate">{chat.lastMessage}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {selectedChatId ? (
          <div className="hidden md:flex flex-grow min-w-0 bg-gray-50/30">
            <div className="flex flex-col flex-grow min-w-0 bg-white">
              <header className="h-20 border-b border-gray-100 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10">
                <div 
                  className={`flex items-center gap-4 min-w-0 ${selectedChat?.type !== 'private' ? 'cursor-pointer group' : ''}`} 
                  onClick={() => selectedChat?.type !== 'private' && toggleSidebar('details')}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-100 overflow-hidden"><img src={selectedChat?.avatar} alt={selectedChat?.title} className="w-full h-full object-cover" /></div>
                  <h2 className="text-lg font-black text-gray-900 truncate group-hover:text-purple-600">{selectedChat?.title}</h2>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all">
                    <ExternalLink className="w-5 h-5" />
                  </button>
                  <button onClick={() => toggleSidebar('participants')} className={`p-2.5 rounded-xl transition-all ${showParticipants ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-50'}`}><Users className="w-5 h-5" /></button>
                  <button onClick={() => setSelectedChatId(null)} className="p-2.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl"><X className="w-5 h-5" /></button>
                </div>
              </header>

              <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-6 bg-gray-50/30 scrollbar-hide">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} items-start gap-3`}>
                    {!msg.isMe && (
                      <div className="w-10 h-10 rounded-2xl bg-purple-100 overflow-hidden flex-shrink-0 mt-1 shadow-sm">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.sender}`} alt={msg.sender} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className={`flex flex-col gap-1.5 max-w-[70%] ${msg.isMe ? 'items-end' : 'items-start'}`}>
                      {!msg.isMe && (
                        <span className="text-xs font-black text-gray-700 ml-1">{msg.sender}</span>
                      )}
                      <div className={`flex items-end gap-2 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${msg.isMe ? 'bg-purple-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'}`}>
                          {msg.type === 'file' ? (
                            <div className="flex items-center gap-2">
                              <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><ImageIcon className="w-4 h-4" /></div>
                              <span className="underline cursor-pointer decoration-purple-300 underline-offset-4">{msg.text}</span>
                            </div>
                          ) : msg.text}
                        </div>
                        <span className="text-[10px] text-gray-400 font-bold mb-1 flex-shrink-0">{msg.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 border-t border-gray-100 bg-white">
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <label className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl cursor-pointer transition-all">
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setMessages([...messages, { 
                            id: messages.length + 1, 
                            sender: '나', 
                            text: file.name, 
                            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
                            isMe: true,
                            type: 'file'
                          }]);
                        }
                      }} 
                    />
                    <ImageIcon className="w-6 h-6" />
                  </label>
                  <div className="relative flex-grow flex items-center">
                    <input 
                      type="text" 
                      value={message} 
                      onChange={(e) => setMessage(e.target.value)} 
                      placeholder="메시지를 입력하세요..." 
                      className="w-full bg-gray-50 rounded-2xl py-3.5 px-6 font-medium text-sm focus:ring-2 focus:ring-purple-600/20" 
                    />
                  </div>
                  <button type="submit" className="p-3.5 rounded-2xl bg-purple-600 text-white hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200">
                    <Send className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>

            <aside className={`border-l border-gray-100 flex flex-col bg-white overflow-hidden transition-all duration-300 ease-in-out custom-scrollbar ${(showParticipants || showDetails) ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
              {showParticipants && (
                <div className="p-4 space-y-2">
                  <h3 className="font-black text-gray-900 text-sm mb-4">참여 인원</h3>
                  {participants.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-2">
                        <div className="flex items-center gap-3">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} className="w-8 h-8 rounded-full" />
                            <span className="text-sm font-bold">{p.name}</span>
                        </div>
                        <button className="text-gray-300 hover:text-rose-500"><Ban className="w-4 h-4"/></button>
                    </div>
                  ))}
                </div>
              )}
              {showDetails && (
                <div className="p-6 space-y-6">
                  <h3 className="font-black text-gray-900 text-sm">채팅방 상세 정보</h3>
                  {selectedChat?.type === 'festival' && (
                    <>
                      <div><p className="text-xs font-black text-gray-400">축제 기간</p><p className="text-sm font-bold">{selectedChat.date}</p></div>
                      <div><p className="text-xs font-black text-gray-400">위치</p><p className="text-sm font-bold flex items-center gap-1"><MapPin className="w-4 h-4"/>{selectedChat.location}</p></div>
                    </>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">상세 설명이 들어갑니다.</p>
                </div>
              )}
            </aside>
          </div>
        ) : (
          <div className="flex flex-grow items-center justify-center text-gray-400 font-bold">채팅방을 선택해주세요.</div>
        )}
      </div>
    </div>
  );
};

export default ChatListPage;
