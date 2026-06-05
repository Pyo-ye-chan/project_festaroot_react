import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  ChevronRight,
  Search,
  Star,
  Clock,
  ThumbsUp,
  Eye,
  MapPin,
  Calendar
} from 'lucide-react';
import CommunitySidebar from '../components/CommunitySidebar';

const CommunityMainPage = () => {
  // Mock Data
  const popularPosts = [
    { id: 1, title: '양평 딸기축제 다녀왔어요! 🍓 너무 재밌네요', author: '축제요정', views: '1.2k', likes: 45, category: '후기', time: '1시간 전' },
    { id: 2, title: '서울 밤거리 페스티벌 주차 꿀팁 공유합니다', author: '베스트드라이버', views: '2.5k', likes: 120, category: '팁', time: '3시간 전' },
    { id: 3, title: '강릉 커피축제 웨이팅 실시간 현황', author: '커피러버', views: '980', likes: 32, category: '정보', time: '5시간 전' },
  ];

  const gatherings = [
    { id: 1, title: '자라섬 재즈 페스티벌 피크닉 메이트', date: '06.15', location: '가평', participants: 4, maxParticipants: 6, image: 'https://picsum.photos/seed/moim1/100/100' },
    { id: 2, title: '부산 불꽃축제 사진 동호회 출사', date: '11.05', location: '부산', participants: 10, maxParticipants: 12, image: 'https://picsum.photos/seed/moim2/100/100' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Grid Layout - Sidebar on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar - Reusable Community Navigation (3 cols) */}
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          {/* Main Content (9 cols) */}
          <main className="lg:col-span-9 space-y-8">
            {/* Search Bar */}
            <div className="relative group">
              <input 
                type="text" 
                placeholder="관심 있는 축제 키워드를 검색해보세요!"
                className="w-full bg-white border-2 border-transparent rounded-[1.5rem] py-5 pl-14 pr-6 shadow-sm focus:outline-none focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 transition-all placeholder:text-gray-400 font-bold text-lg"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-6 h-6" />
            </div>

            {/* Main Banner */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[3rem] p-12 text-white relative overflow-hidden shadow-xl shadow-purple-100">
              <div className="relative z-10 max-w-[400px]">
                <span className="bg-white/20 backdrop-blur px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest mb-6 inline-block">Special Event</span>
                <h3 className="text-4xl md:text-5xl font-black leading-tight mb-6 italic tracking-tight">
                  축제의 감동을 <br/>기록으로 남기세요
                </h3>
                <p className="text-white/80 text-lg font-medium mb-10 leading-relaxed">베스트 후기왕에 도전하고 <br/>특별한 축제 포인트를 선물 받으세요!</p>
                <button className="bg-white text-purple-600 font-black px-10 py-4.5 rounded-[1.5rem] hover:bg-purple-50 hover:shadow-lg transition-all text-base active:scale-95 shadow-md">
                  참여하기
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
              <Star className="absolute right-12 top-12 w-32 h-32 text-white/10 rotate-12" />
            </div>

            {/* Content Row: Popular Posts & Gatherings */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Popular Posts */}
              <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <TrendingUp className="w-8 h-8 text-purple-600" />
                    인기 게시글
                  </h3>
                  <Link to="/community/board/all" className="text-sm font-black text-gray-400 hover:text-purple-600 flex items-center gap-1 transition-colors">
                    더보기 <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  {popularPosts.map((post, idx) => (
                    <Link 
                      key={post.id} 
                      to={`/community/post/${post.id}`}
                      className="flex items-center gap-5 p-5 hover:bg-gray-50 rounded-[2rem] transition-all group border border-transparent hover:border-purple-50"
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl flex-shrink-0 ${idx === 0 ? 'bg-purple-50 text-purple-600' : 'text-gray-200'}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[10px] font-black px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md">
                            {post.category}
                          </span>
                          <span className="text-xs font-bold text-gray-400">{post.author}</span>
                        </div>
                        <h4 className="font-black text-gray-800 group-hover:text-purple-600 transition-colors truncate text-base">
                          {post.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Popular Gatherings */}
              <section className="bg-white rounded-[3rem] p-10 shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
                    <Users className="w-8 h-8 text-purple-600" />
                    핫한 모임
                  </h3>
                  <button className="text-sm font-black text-gray-400 hover:text-purple-600 flex items-center gap-1 transition-colors">
                    더보기 <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-4">
                  {gatherings.map((moim) => (
                    <div key={moim.id} className="p-5 bg-gray-50/50 rounded-[2rem] border border-gray-100 hover:border-purple-100 hover:bg-white transition-all group flex gap-5">
                      <div className="w-20 h-20 rounded-[1.5rem] overflow-hidden flex-shrink-0 shadow-sm border-2 border-white">
                        <img src={moim.image} alt={moim.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="min-w-0 flex-grow py-1">
                        <h4 className="font-black text-base text-gray-900 mb-2 truncate group-hover:text-purple-600">
                          {moim.title}
                        </h4>
                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-purple-400" /> {moim.location}</span>
                          <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-purple-400" /> {moim.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </main>

        </div>
      </div>
    </div>
  );
};

export default CommunityMainPage;
