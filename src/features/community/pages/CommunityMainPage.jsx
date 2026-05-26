import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageSquare, 
  Users, 
  TrendingUp, 
  Plus, 
  MapPin, 
  Calendar,
  ChevronRight,
  Search,
  Flame,
  Star,
  Bell
} from 'lucide-react';

const CommunityMainPage = () => {
  // Mock Data
  const popularPosts = [
    { id: 1, title: '양평 딸기축제 다녀왔어요! 🍓 너무 재밌네요', author: '축제요정', views: '1.2k', likes: 45, category: '후기' },
    { id: 2, title: '서울 밤거리 페스티벌 주차 꿀팁 공유합니다', author: '베스트드라이버', views: '2.5k', likes: 120, category: '팁' },
    { id: 3, title: '강릉 커피축제 웨이팅 실시간 현황', author: '커피러버', views: '980', likes: 32, category: '정보' },
  ];

  const chatRooms = [
    { id: 1, title: '한강 달빛 야시장 같이 가실 분?', participants: 12, maxParticipants: 20 },
    { id: 2, title: '경복궁 야간개장 티켓팅 성공 기원방', participants: 45, maxParticipants: 100 },
    { id: 3, title: '전국 축제 도장깨기 모임', participants: 8, maxParticipants: 15 },
  ];

  const gatherings = [
    { id: 1, title: '자라섬 재즈 페스티벌 피크닉 메이트', date: '2026.06.15', location: '가평 자라섬', participants: 4 },
    { id: 2, title: '부산 불꽃축제 사진 동호회 출사', date: '2026.11.05', location: '부산 광안리', participants: 10 },
  ];

  const categories = [
    { name: '전체', path: 'all' },
    { name: '자유게시판', path: 'free' },
    { name: '축제후기', path: 'review' },
    { name: '꿀팁공유', path: 'tip' },
    { name: '공지사항', path: 'notice' },
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 font-['Pretendard']">
      {/* Header Space for MainLayout (assuming it exists) or just Padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Menu */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 sticky top-10">
              <h2 className="text-xl font-black text-gray-900 mb-6 px-2 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-600 fill-purple-600" />
                커뮤니티
              </h2>
              <nav className="space-y-1">
                {categories.map((cat) => (
                  <Link 
                    key={cat.path}
                    to={`/community/board/${cat.path}`}
                    className="flex items-center justify-between px-4 py-3 rounded-2xl text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 group"
                  >
                    <span className="font-bold">{cat.name}</span>
                    <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </nav>
              
              <div className="mt-8 px-2">
                <Link 
                  to="/community/write"
                  className="w-full bg-purple-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  글쓰기
                </Link>
              </div>
            </div>
          </aside>

          {/* Center Content */}
          <main className="lg:col-span-6 space-y-8">
            
            {/* Search Bar Placeholder */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="궁금한 축제 소식을 검색해보세요!"
                className="w-full bg-white border border-gray-100 rounded-[2rem] py-4 pl-14 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-5 h-5" />
            </div>

            {/* Popular Posts Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                  실시간 인기글
                </h3>
                <Link to="/community/board/all" className="text-sm font-bold text-gray-400 hover:text-purple-600">전체보기</Link>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, idx) => (
                  <Link 
                    to={`/community/post/${post.id}`} 
                    key={post.id} 
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-purple-100"
                  >
                    <span className={`text-xl font-black ${idx === 0 ? 'text-purple-600' : 'text-gray-300'}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md">
                          {post.category}
                        </span>
                        <span className="text-xs font-bold text-gray-400">{post.author}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors truncate">
                        {post.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                      <span className="flex items-center gap-1">👁️ {post.views}</span>
                      <span className="flex items-center gap-1 text-rose-500">❤️ {post.likes}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Popular Gatherings (Moim) Section */}
            <section>
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  이번 주 인기 모임
                </h3>
                <button className="text-sm font-bold text-gray-400 hover:text-purple-600">더보기</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gatherings.map((moim) => (
                  <div key={moim.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-purple-50 p-3 rounded-2xl group-hover:bg-purple-600 transition-colors duration-500">
                        <Calendar className="w-6 h-6 text-purple-600 group-hover:text-white" />
                      </div>
                      <span className="text-[10px] font-black text-purple-600 px-3 py-1 bg-purple-50 rounded-full uppercase tracking-tighter">
                        Recruiting
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {moim.title}
                    </h4>
                    <div className="space-y-1 mb-6">
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {moim.location}
                      </p>
                      <p className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {moim.date}
                      </p>
                    </div>
                    <button className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-purple-600 hover:text-white transition-all active:scale-95 border border-gray-100 hover:border-purple-600">
                      참여하기
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </main>

          {/* Right Sidebar - Chat & Notice */}
          <aside className="lg:col-span-3 space-y-8">
            {/* HOT Chat Rooms */}
            <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-rose-500" />
                HOT 오픈채팅
              </h3>
              <div className="space-y-3">
                {chatRooms.map((chat) => (
                  <div key={chat.id} className="p-4 bg-gray-50/50 rounded-2xl border border-transparent hover:border-purple-100 hover:bg-white transition-all cursor-pointer group">
                    <h4 className="text-sm font-bold text-gray-800 mb-2 truncate group-hover:text-purple-600">
                      {chat.title}
                    </h4>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                        <Users className="w-3.5 h-3.5" />
                        <span>{chat.participants}/{chat.maxParticipants}</span>
                      </div>
                      <button className="text-[10px] font-black text-purple-600 hover:underline">입장하기</button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Quick Notice or Banner */}
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-[2.5rem] p-8 text-white relative overflow-hidden group cursor-pointer shadow-lg shadow-purple-200">
              <div className="relative z-10">
                <p className="text-[10px] font-black opacity-60 mb-2 uppercase tracking-widest">Notice</p>
                <h4 className="text-lg font-black leading-tight mb-4">
                  커뮤니티 클린 <br/>
                  캠페인 안내
                </h4>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:translate-x-2 transition-transform">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <Bell className="absolute -right-4 -bottom-4 w-24 h-24 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default CommunityMainPage;
