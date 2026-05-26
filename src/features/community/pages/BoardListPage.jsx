import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ChevronDown, 
  Filter,
  Eye,
  Heart,
  MessageSquare,
  ChevronRight
} from 'lucide-react';

const BoardListPage = () => {
  const { category = 'all' } = useParams();
  const [searchType, setSearchType] = useState('title');
  const [sortBy, setSortBy] = useState('latest');

  // Mock Data
  const posts = [
    { id: 1, category: '후기', title: '양평 딸기축제 다녀왔어요! 🍓', author: '축제요정', date: '2026.05.25', views: 1240, likes: 45, comments: 12 },
    { id: 2, category: '팁', title: '서울 밤거리 페스티벌 주차 꿀팁 공유', author: '베스트드라이버', date: '2026.05.24', views: 2500, likes: 120, comments: 28 },
    { id: 3, category: '정보', title: '강릉 커피축제 웨이팅 실시간 현황', author: '커피러버', date: '2026.05.24', views: 980, likes: 32, comments: 5 },
    { id: 4, category: '자유', title: '이번 주말에 비 온다는데 축제 취소될까요?', author: '걱정인형', date: '2026.05.23', views: 560, likes: 10, comments: 15 },
    { id: 5, category: '후기', title: '경주 벚꽃 축제 교촌마을 근처 맛집 추천', author: '미식가', date: '2026.05.22', views: 1500, likes: 88, comments: 20 },
  ];

  const categoryNames = {
    all: '전체 게시판',
    free: '자유게시판',
    review: '축제후기',
    tip: '꿀팁공유',
    notice: '공지사항'
  };

  return (
    <div className="min-h-screen bg-gray-50/30 font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div>
            <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-2">
              <Link to="/community" className="hover:underline">커뮤니티</Link>
              <ChevronRight className="w-3 h-3" />
              <span>게시판</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              {categoryNames[category] || '게시판'}
            </h2>
          </div>
          
          <Link 
            to="/community/write"
            className="bg-purple-600 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-2 hover:bg-purple-700 transition-all shadow-lg shadow-purple-200 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            글쓰기
          </Link>
        </div>

        {/* Filters & Search */}
        <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-grow flex items-center gap-2">
              <select 
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-600 focus:ring-2 focus:ring-purple-600/20 outline-none cursor-pointer"
              >
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="author">작성자</option>
              </select>
              <div className="flex-grow relative group">
                <input 
                  type="text" 
                  placeholder="검색어를 입력하세요"
                  className="w-full bg-gray-50 border-none rounded-2xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-purple-600/20 outline-none"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
              </div>
              <button className="bg-gray-900 text-white font-bold px-6 py-3 rounded-2xl hover:bg-black transition-all active:scale-95">
                검색
              </button>
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              {[
                { label: '최신순', value: 'latest' },
                { label: '조회순', value: 'views' },
                { label: '좋아요순', value: 'likes' }
              ].map((sort) => (
                <button
                  key={sort.value}
                  onClick={() => setSortBy(sort.value)}
                  className={`px-5 py-3 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                    sortBy === sort.value 
                    ? 'bg-purple-50 text-purple-600 border border-purple-100' 
                    : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  {sort.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Post List */}
        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50 border-b border-gray-100">
                <tr>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">카테고리</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest">제목</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">작성자</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">날짜</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">조회</th>
                  <th className="px-8 py-5 text-xs font-black text-gray-400 uppercase tracking-widest text-center">좋아요</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer">
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <Link to={`/community/post/${post.id}`} className="flex items-center gap-2">
                        <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {post.title}
                        </span>
                        {post.comments > 0 && (
                          <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded">
                            {post.comments}
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-100 overflow-hidden">
                           <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="" />
                        </div>
                        <span className="text-xs font-bold text-gray-600">{post.author}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center text-xs font-bold text-gray-400">{post.date}</td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-gray-400">
                        <Eye className="w-3 h-3" />
                        {post.views}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <div className="flex items-center justify-center gap-1 text-xs font-bold text-rose-500">
                        <Heart className="w-3 h-3 fill-rose-500" />
                        {post.likes}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination Placeholder */}
        <div className="mt-10 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((page) => (
            <button 
              key={page}
              className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                page === 1 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' 
                : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardListPage;
