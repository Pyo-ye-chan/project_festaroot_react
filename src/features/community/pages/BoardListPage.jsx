import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronRight,
  MessageSquare,
  Eye,
  Heart,
} from 'lucide-react';
import CommunitySidebar from '../components/CommunitySidebar';

const BoardListPage = () => {
  const { category = 'all' } = useParams();

  const [sortBy, setSortBy] = useState('latest');
  const [searchType, setSearchType] = useState('title');
  const [keyword, setKeyword] = useState('');

  const posts = [
    { id: 1, category: '후기', title: '양평 딸기축제 다녀왔어요! 🍓 너무 재밌네요', author: '축제요정', date: '2026.05.25', views: 1240, likes: 45, comments: 12 },
    { id: 2, category: '팁', title: '서울 밤거리 페스티벌 주차 꿀팁 공유합니다 (필독)', author: '베스트드라이버', date: '2026.05.24', views: 2500, likes: 120, comments: 28 },
    { id: 3, category: '정보', title: '강릉 커피축제 웨이팅 실시간 현황 알려드려요', author: '커피러버', date: '2026.05.24', views: 980, likes: 32, comments: 5 },
    { id: 4, category: '자유', title: '이번 주말에 비 온다는데 축제 취소될까요?', author: '걱정인형', date: '2026.05.23', views: 560, likes: 10, comments: 15 },
    { id: 5, category: '후기', title: '경주 벚꽃 축제 교촌마을 근처 맛집 추천', author: '미식가', date: '2026.05.22', views: 1500, likes: 88, comments: 20 },
    { id: 6, category: '꿀팁', title: '축제 사진 잘 찍는 보정법 공유합니다!', author: '포토그래퍼', date: '2026.05.21', views: 3200, likes: 450, comments: 62 },
  ];

  const categoryNames = {
    all: '전체 게시판',
    free: '자유게시판',
    review: '축제후기',
    tip: '꿀팁공유',
    notice: '공지사항',
  };

  const sortOptions = [
    { label: '최신순', value: 'latest' },
    { label: '조회순', value: 'views' },
    { label: '좋아요순', value: 'likes' },
  ];

  const getCategoryClasses = (postCategory) => {
    switch (postCategory) {
      case '후기':
        return 'bg-[var(--festival-yellow)] text-gray-800';
      case '팁':
        return 'bg-[var(--festival-purple-soft)] text-white';
      case '정보':
        return 'bg-gray-300 text-gray-800';
      case '자유':
        return 'bg-gray-500 text-white';
      case '꿀팁': // Specific for '꿀팁공유'
        return 'bg-blue-400 text-white'; 
      case '공지사항':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          <main className="lg:col-span-9">
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div>
                <div className="flex items-center gap-2 text-[var(--festival-purple)] font-bold text-sm mb-2">
                  <Link to="/community" className="hover:underline">
                    커뮤니티
                  </Link>
                  <ChevronRight className="w-3 h-3" />
                  <span>게시판</span>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  {categoryNames[category] || '게시판'}
                </h2>
              </div>

              <Link
                to="/community/write"
                className="h-12 px-6 bg-[var(--festival-purple)] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[var(--festival-purple-soft)] transition-all shadow-lg shadow-[var(--festival-purple)]/20 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                글쓰기
              </Link>
            </div>

            <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col xl:flex-row gap-4">
                <div className="flex flex-col sm:flex-row flex-1 gap-3">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="h-12 bg-gray-50 rounded-2xl px-4 text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20"
                  >
                    <option value="title">제목</option>
                    <option value="content">내용</option>
                    <option value="author">작성자</option>
                  </select>

                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      value={keyword}
                      onChange={(e) => setKeyword(e.target.value)}
                      type="text"
                      placeholder="검색어를 입력하세요"
                      className="w-full h-12 bg-gray-50 rounded-2xl pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20"
                    />
                  </div>

                  <button className="h-12 px-6 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all">
                    검색
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {sortOptions.map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value)}
                      className={`h-12 px-5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${sortBy === sort.value
                          ? 'bg-[var(--festival-purple)] text-white shadow-md shadow-[var(--festival-purple)]/20'
                          : 'bg-gray-50 text-gray-500 hover:bg-[var(--festival-purple-soft)]/20 hover:text-[var(--festival-purple)]'
                        }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* Board List */}
            <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/community/post/${post.id}`}
                    className="block px-6 py-5 hover:bg-[var(--festival-purple-soft)]/20 transition-all group"
                  >
                    <div className="flex flex-col gap-3">
                      {/* 상단: 카테고리 + 날짜 */}
                      <div className="flex items-center justify-between gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-black ${getCategoryClasses(post.category)}`}>
                          {post.category}
                        </span>

                        <span className="text-xs font-bold text-gray-400">
                          {post.date}
                        </span>
                      </div>

                      {/* 제목 */}
                      <div className="flex items-center gap-2">
                        <h3 className="text-[17px] font-black text-gray-900 group-hover:text-[var(--festival-purple)] transition-colors line-clamp-1">
                          {post.title}
                        </h3>

                        {post.comments > 0 && (
                          <span className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 text-rose-500 text-xs font-black">
                            <MessageSquare className="w-3 h-3" />
                            {post.comments}
                          </span>
                        )}
                      </div>

                      {/* 하단 정보 */}
                      <div className="flex items-center justify-between gap-4 text-xs font-bold text-gray-400">
                        <span className="text-gray-500">
                          {post.author}
                        </span>

                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            조회 {post.views.toLocaleString()}
                          </span>

                          <span className="flex items-center gap-1 text-rose-500">
                            좋아요 {post.likes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
            <div className="mt-8 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)]">
                ‹
              </button>

              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-xl text-xs font-black ${page === 1
                      ? 'bg-[var(--festival-purple)] text-white'
                      : 'bg-white border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)]'
                    }`}
                >
                  {page}
                </button>
              ))}

              <button className="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)]">
                ›
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default BoardListPage;