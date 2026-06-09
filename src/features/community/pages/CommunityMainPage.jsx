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

        </div>
      </div>
    </div>
  );
};

export default CommunityMainPage;
