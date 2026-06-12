import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Search,
  Plus,
  ChevronRight,
  Eye,
  Heart,
} from 'lucide-react';
import CommunitySidebar from '../components/CommunitySidebar';
import { getPosts } from '../../../api/boardApi';

const BoardListPage = () => {
  const { category = 'all' } = useParams();

  const [sortBy, setSortBy] = useState('latest');
  const [searchType, setSearchType] = useState('title');
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const boardCategories = [
    { id: 'all', label: '전체게시판' },
    { id: 'free', label: '자유게시판' },
    { id: 'review', label: '축제후기' },
    { id: 'tip', label: '꿀팁공유' },
    { id: 'notice', label: '공지사항' },
  ];

  const categoryNames = {
    all: '전체 게시판',
    free: '자유게시판',
    review: '축제후기',
    tip: '꿀팁공유',
    notice: '공지사항',
  };

  const categoryLabels = {
    all: '전체',
    free: '자유',
    review: '후기',
    tip: '꿀팁',
    notice: '공지',
  };

  const sortOptions = [
    { label: '최신순', value: 'latest' },
    { label: '조회순', value: 'views' },
    { label: '좋아요순', value: 'likes' },
  ];

  useEffect(() => {
    setCurrentPage(1);
  }, [category]);

  useEffect(() => {
    loadPosts();
  }, [currentPage, category, sortBy]);

  const loadPosts = async () => {
    try {
      const result = await getPosts(currentPage);
      setPosts(result.data.list || []);
      setTotalCount(result.data.totalPostCount || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const getCategoryClasses = (postCategory) => {
    switch (postCategory) {
      case 'review':
        return 'bg-[#FFF4C2] text-[#7C5A00]';

      case 'tip':
        return 'bg-[#EEE7FF] text-[var(--festival-purple)]';

      case 'notice':
        return 'bg-[#FFE4E6] text-rose-500';

      case 'free':
        return 'bg-gray-100 text-gray-500';

      default:
        return 'bg-gray-100 text-gray-500';
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
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-4">
                <Link
                  to="/community"
                  className="hover:text-[var(--festival-purple)] transition-colors"
                >
                  커뮤니티
                </Link>
                <ChevronRight className="w-3 h-3" />
                <span>게시판</span>
              </div>

              <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-2 h-2 rounded-full bg-[var(--festival-yellow)]" />
                    <span className="text-sm font-black text-[var(--festival-purple)]">
                      FESTA COMMUNITY
                    </span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-black text-[var(--dark-gray)]">
                    {categoryNames[category] || '게시판'}
                  </h2>

                  <p className="mt-3 text-gray-500 font-medium">
                    축제 후기와 여행 팁을 자유롭게 나눠보세요.
                  </p>
                </div>

                <Link
                  to="/community/write"
                  className="h-12 px-6 bg-[var(--festival-purple)] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-[var(--festival-purple-soft)] transition-all shadow-lg shadow-purple-100 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  글쓰기
                </Link>
              </div>
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
              {boardCategories.map((board) => (
                <Link
                  key={board.id}
                  to={`/community/board/${board.id}`}
                  className={`px-4 py-2.5 rounded-full text-sm font-black transition-all whitespace-nowrap border ${category === board.id
                    ? 'bg-[var(--festival-yellow)] text-[var(--dark-gray)] border-[var(--festival-yellow)]'
                    : 'bg-white text-gray-500 border-gray-100 hover:text-[var(--festival-purple)] hover:border-purple-100'
                    }`}
                >
                  {board.label}
                </Link>
              ))}
            </div>

            <section className="bg-white rounded-[2rem] p-5 shadow-sm border border-gray-100 mb-6">
              <div className="flex flex-col xl:flex-row gap-3">
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

                  <button className="h-12 px-6 rounded-2xl bg-[var(--dark-gray)] text-white text-sm font-black hover:bg-black transition-all">
                    검색
                  </button>
                </div>

                <div className="flex gap-2 overflow-x-auto">
                  {sortOptions.map((sort) => (
                    <button
                      key={sort.value}
                      onClick={() => setSortBy(sort.value)}
                      className={`h-12 px-5 rounded-2xl text-sm font-black whitespace-nowrap transition-all ${sortBy === sort.value
                        ? 'bg-[var(--festival-purple)] text-white'
                        : 'bg-gray-50 text-gray-500 hover:bg-purple-50 hover:text-[var(--festival-purple)]'
                        }`}
                    >
                      {sort.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>

            <section className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-5">
              <div className="mb-4 flex items-center justify-between px-1">
                <p className="text-sm font-black text-gray-700">
                  게시글{' '}
                  <span className="text-[var(--festival-purple)]">
                    {totalCount}
                  </span>
                  개
                </p>
              </div>

              <div className="rounded-3xl border border-gray-100 overflow-hidden">
                <div className="hidden md:grid grid-cols-[90px_1fr_120px_110px_100px] items-center px-5 py-4 bg-gray-50 border-b border-gray-100 text-xs font-black text-gray-400">
                  <span className="text-center">분류</span>
                  <span className="text-center">제목</span>
                  <span className="text-center">작성자</span>
                  <span className="text-center">작성일</span>
                  <span className="text-center">반응</span>
                </div>

                <div className="divide-y divide-gray-100">
                  {posts.map((post) => (
                    <Link
                      key={post.post_id}
                      to={`/community/post/${post.post_id}`}
                      className="grid grid-cols-1 md:grid-cols-[90px_1fr_120px_110px_100px] items-center gap-3 md:gap-0 px-5 py-4 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="md:text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${getCategoryClasses(
                            post.category
                          )}`}
                        >
                          {categoryLabels[post.category] || post.category}
                        </span>
                      </div>

                      <div className="min-w-0 md:px-4">
                        <h3 className="text-[15px] md:text-base font-extrabold text-gray-800 line-clamp-1 group-hover:text-[var(--festival-purple)] transition-colors">
                          {post.title}
                        </h3>

                        <div className="md:hidden mt-2 flex items-center flex-wrap gap-2 text-xs text-gray-400 font-bold">
                          <span>{post.nickname || '익명'}</span>
                          <span>·</span>
                          <span>
                            {post.created_at
                              ?.split('T')[0]
                              .replace(/-/g, '.')}
                          </span>
                          <span>·</span>
                          <span>
                            조회 {(post.view_count ?? 0).toLocaleString()}
                          </span>
                          <span>·</span>
                          <span className="text-rose-500">
                            좋아요 {(post.like_count ?? 0).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="hidden md:block text-center text-sm font-bold text-gray-500 truncate px-2">
                        {post.nickname || '익명'}
                      </div>

                      <div className="hidden md:block text-center text-sm font-bold text-gray-400">
                        {post.created_at
                          ?.split('T')[0]
                          .replace(/-/g, '.')}
                      </div>

                      <div className="hidden md:flex justify-center items-center gap-3 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {(post.view_count ?? 0).toLocaleString()}
                        </span>

                        <span className="flex items-center gap-1 text-rose-500">
                          <Heart className="w-4 h-4" />
                          {(post.like_count ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </Link>
                  ))}

                  {posts.length === 0 && (
                    <div className="p-12 text-center">
                      <p className="text-gray-400 font-bold">
                        아직 등록된 게시글이 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)] hover:bg-purple-50 transition-all"
                >
                  ‹
                </button>

                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${page === currentPage
                        ? 'bg-[var(--festival-purple)] text-white'
                        : 'bg-gray-50 border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)] hover:bg-purple-50'
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 text-gray-400 hover:text-[var(--festival-purple)] hover:bg-purple-50 transition-all"
                >
                  ›
                </button>
              </div>
            </section>



          </main>
        </div>
      </div>
    </div>
  );
};

export default BoardListPage;