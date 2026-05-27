import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  Search, 
  MessageCircle, 
  ChevronRight,
  Plus,
  Flame,
  Star,
  Clock
} from 'lucide-react';

const ChatListPage = () => {
  const chatRooms = [
    { 
      id: 1, 
      title: '한강 달빛 야시장 같이 가실 분? 🌙', 
      description: '이번 주말 한강 야시장 같이 가실 분 구합니다! 맛있는 거 같이 먹어요.',
      participants: 12, 
      maxParticipants: 20,
      tags: ['야시장', '먹방', '주말'],
      lastMessage: '저도 가고 싶어요!',
      time: '2분 전'
    },
    { 
      id: 2, 
      title: '경복궁 야간개장 티켓팅 성공 기원방 🏯', 
      description: '티켓팅 꿀팁 공유하고 같이 성공해서 가요!',
      participants: 45, 
      maxParticipants: 100,
      tags: ['경복궁', '야간개장', '티켓팅'],
      lastMessage: '내일 오후 2시 오픈이래요!',
      time: '10분 전'
    },
    { 
      id: 3, 
      title: '전국 축제 도장깨기 모임 🚌', 
      description: '전국 방방곡곡 축제 다니는 모임입니다. 혼자 가기 심심하신 분들 환영!',
      participants: 8, 
      maxParticipants: 15,
      tags: ['전국', '여행', '정기모임'],
      lastMessage: '다음 주는 어디로 갈까요?',
      time: '30분 전'
    },
    { 
      id: 4, 
      title: '부산 불꽃축제 명당 공유 🎆', 
      description: '불꽃축제 숨은 명당 아시는 분? 정보 공유해요.',
      participants: 32, 
      maxParticipants: 50,
      tags: ['부산', '불꽃축제', '명당'],
      lastMessage: '마린시티 쪽도 괜찮나요?',
      time: '1시간 전'
    },
    { 
      id: 5, 
      title: '진해 군항제 벚꽃 개화 실시간 정보 🌸', 
      description: '벚꽃 얼마나 폈는지 궁금하신 분들 들어오세요!',
      participants: 120, 
      maxParticipants: 200,
      tags: ['진해', '벚꽃', '실시간'],
      lastMessage: '오늘 만개했습니다!',
      time: '방금'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 font-['Pretendard']">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
              <MessageCircle className="w-8 h-8 text-purple-600" />
              오픈채팅
            </h1>
            <p className="text-gray-500 font-bold">축제 친구를 만나고 실시간 정보를 공유해보세요!</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex-1 md:flex-none px-6 py-3 bg-white border border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
              <Star className="w-5 h-5" />
              즐겨찾기
            </button>
            <button className="flex-1 md:flex-none px-6 py-3 bg-purple-600 text-white rounded-2xl font-black hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              방 만들기
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input 
                type="text" 
                placeholder="관심 있는 축제나 지역을 검색해보세요"
                className="w-full bg-gray-50 border-none rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-purple-600/20 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
            <div className="flex gap-2">
              {['전체', '인기순', '최신순', '참여가능'].map((filter) => (
                <button 
                  key={filter}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                    filter === '전체' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chatRooms.map((chat) => (
            <Link 
              to={`/community/chat/${chat.id}`}
              key={chat.id}
              className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden"
            >
              {/* Hot Badge */}
              {chat.participants > 40 && (
                <div className="absolute top-0 right-10 transform -translate-y-1/2 bg-rose-500 text-white px-4 py-3 rounded-b-2xl shadow-lg flex items-center gap-1">
                  <Flame className="w-4 h-4" />
                  <span className="text-xs font-black uppercase">Hot</span>
                </div>
              )}

              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-1.5">
                  {chat.tags.map(tag => (
                    <span key={tag} className="text-[10px] font-black px-2.5 py-1 bg-purple-50 text-purple-600 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-1 text-gray-400 font-bold text-xs">
                  <Clock className="w-3.5 h-3.5" />
                  {chat.time}
                </div>
              </div>

              <h3 className="text-xl font-black text-gray-900 mb-3 group-hover:text-purple-600 transition-colors line-clamp-1">
                {chat.title}
              </h3>
              
              <p className="text-sm font-medium text-gray-500 mb-6 line-clamp-2 leading-relaxed">
                {chat.description}
              </p>

              <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                <p className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" /> 마지막 대화
                </p>
                <p className="text-sm font-bold text-gray-600 truncate italic">
                  "{chat.lastMessage}"
                </p>
              </div>

              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${chat.id}${i}`} alt="user" />
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-purple-100 flex items-center justify-center text-[10px] font-black text-purple-600">
                      +{chat.participants - 3}
                    </div>
                  </div>
                  <span className="text-sm font-black text-gray-400">
                    <span className="text-purple-600">{chat.participants}</span>/{chat.maxParticipants}명 참여 중
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <ChevronRight className="w-5 h-5 text-purple-600 group-hover:text-white" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Floating Action Button for Mobile */}
        <button className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform z-40">
          <Plus className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default ChatListPage;
