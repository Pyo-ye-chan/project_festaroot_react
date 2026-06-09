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

  const getCategoryClasses = (category) => {
    switch (category) {
      case '후기':
        return 'bg-[var(--festival-yellow)] text-gray-800';
      case '팁':
        return 'bg-[var(--festival-purple-soft)] text-white';
      case '정보':
        return 'bg-gray-300 text-gray-800';
      case '자유': // Assuming '자유' might appear
        return 'bg-[var(--festival-purple)] text-white';
      case '공지사항': // Assuming '공지사항' might appear
        return 'bg-red-400 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Main Grid Layout - Sidebar on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - Reusable Community Navigation (3 cols) */}
          
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          {/* Main Content (9 cols) */}
          <main className="lg:col-span-9 space-y-8">
            {/* Festival Ad Banner */}
            <section className="relative bg-[var(--festival-purple)] text-white rounded-[2.5rem] p-8 overflow-hidden shadow-lg border border-gray-100">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="md:w-2/3 text-center md:text-left mb-6 md:mb-0">
                  <h2 className="text-3xl font-black mb-2 leading-tight">
                    <span className="text-[var(--festival-yellow)]">FestaRoute</span>와 함께
                    <br />
                    전국 축제를 즐겨보세요!
                  </h2>
                  <p className="text-gray-200 text-lg mb-4">
                    다양한 축제 정보와 특별한 경험이 여러분을 기다립니다.
                  </p>
                  <Link
                    to="/festival-map" // Example link to festival map
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-sm text-[var(--festival-purple)] bg-[var(--festival-yellow)] hover:bg-yellow-400 transition-colors"
                  >
                    축제 찾아보기
                    <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
                  </Link>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  {/* Placeholder for an image or illustration */}
                  <img src="https://picsum.photos/seed/festivalad/300/200" alt="Festival Ad" className="rounded-xl shadow-lg" />
                </div>
              </div>
              {/* Background abstract shapes (optional, for visual flair) */}
              <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full mix-blend-overlay blur-xl"></div>
              <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-[var(--festival-yellow)]/10 rounded-full mix-blend-overlay blur-xl"></div>
            </section>

            {/* Search Bar Placeholder */}
            <div className="relative group">
              <input
                type="text"
                placeholder="궁금한 축제 소식을 검색해보세요!"
                className="w-full bg-white border border-gray-100 rounded-[2rem] py-4 pl-14 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)] transition-all"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--festival-purple)] transition-colors w-5 h-5" />
            </div>

            {/* Popular Posts Section */}
            <section className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-[var(--festival-purple)]" />
                  실시간 인기글
                </h3>
                <Link to="/community/board/all" className="text-sm font-bold text-gray-400 hover:text-[var(--festival-purple)]">전체보기</Link>
              </div>
              <div className="space-y-4">
                {popularPosts.map((post, idx) => (
                  <Link
                    to={`/community/post/${post.id}`}
                    key={post.id}
                    className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-[var(--festival-purple-soft)]"
                  >
                    <span className={`text-xl font-black ${idx === 0 ? 'text-[var(--festival-purple)]' : 'text-gray-300'}`}>
                      {idx + 1}
                    </span>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${getCategoryClasses(post.category)}`}>
                          {post.category}
                        </span>
                        <span className="text-xs font-bold text-gray-400">{post.author}</span>
                      </div>
                      <h4 className="font-bold text-gray-800 group-hover:text-[var(--festival-purple)] transition-colors truncate">
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
                  <Users className="w-6 h-6 text-[var(--festival-purple)]" />
                  이번 주 인기 모임
                </h3>
                <button className="text-sm font-bold text-gray-400 hover:text-[var(--festival-purple)]">더보기</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {gatherings.map((moim) => (
                  <div key={moim.id} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-[var(--festival-purple-soft)] p-3 rounded-2xl group-hover:bg-[var(--festival-purple)] transition-colors duration-500">
                        <Calendar className="w-6 h-6 text-[var(--festival-purple)] group-hover:text-white" />
                      </div>
                      <span className="text-[10px] font-black text-white px-3 py-1 bg-[var(--festival-purple)] rounded-full uppercase tracking-tighter">
                        Recruiting
                      </span>
                    </div>
                    <h4 className="font-black text-gray-900 mb-2 group-hover:text-[var(--festival-purple)] transition-colors">
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
                    <button className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-[var(--festival-purple)] hover:text-white transition-all active:scale-95 border border-gray-100 hover:border-[var(--festival-purple)]">
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
