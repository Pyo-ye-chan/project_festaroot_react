import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  ChevronRight,
  MessageSquare,
} from 'lucide-react';
import CommunitySidebar from '../components/CommunitySidebar';

const BoardListPage = () => {
  const { category = 'all' } = useParams();
  const [sortBy, setSortBy] = useState('latest');

  // Mock Data
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
    notice: '공지사항'
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Main Grid Layout - Sidebar on Left */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Sidebar (3 cols) */}
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          {/* Main Board Content (9 cols) */}
          <div className="lg:col-span-9 space-y-8">
            {/* Page Title & Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
              <div>
                <div className="flex items-center gap-2 text-purple-600 font-bold text-xs mb-3 uppercase tracking-widest">
                  <Link to="/community" className="hover:underline">Community</Link>
                  <ChevronRight className="w-3 h-3" />
                  <span>Board List</span>
                </div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-4">
                  {categoryNames[category] || '게시판'}
                  <span className="text-sm font-bold text-gray-400 bg-white border border-gray-100 px-3 py-1 rounded-full shadow-sm">{posts.length} Posts</span>
                </h2>
              </div>
              
              <Link 
                to="/community/write"
                className="bg-purple-600 text-white font-black px-10 py-4.5 rounded-[1.5rem] flex items-center gap-2 hover:bg-purple-700 transition-all shadow-xl shadow-purple-100 active:scale-95"
              >
                <Plus className="w-5 h-5" />
                새 글 작성하기
              </Link>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-2xl w-full md:w-auto">
                {['latest', 'views', 'likes'].map((sort) => (
                  <button
                    key={sort}
                    onClick={() => setSortBy(sort)}
                    className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl font-black text-[11px] transition-all uppercase tracking-wider ${
                      sortBy === sort 
                      ? 'bg-white text-purple-600 shadow-sm' 
                      : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {sort}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full md:w-[400px]">
                <div className="relative group flex-grow">
                  <input 
                    type="text" 
                    placeholder="검색어를 입력하세요..."
                    className="w-full bg-gray-50 border-none rounded-2xl py-3.5 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-purple-600/10 outline-none transition-all"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-4 h-4" />
                </div>
                <button className="bg-gray-900 text-white font-black px-6 py-3.5 rounded-2xl hover:bg-black transition-all active:scale-95">
                  검색
                </button>
              </div>
            </div>

            {/* Modern Table List */}
            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-gray-100">
              <div className="overflow-x-auto no-scrollbar">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">No.</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">Post Title</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Author</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Date</th>
                      <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Stats</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {posts.map((post, idx) => (
                      <tr key={post.id} className="hover:bg-purple-50/30 transition-all group cursor-pointer border-l-4 border-l-transparent hover:border-l-purple-600">
                        <td className="px-8 py-6 text-center text-[11px] font-bold text-gray-300">
                          {(idx + 1).toString().padStart(2, '0')}
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 bg-purple-50 text-purple-600 text-[10px] font-black rounded-lg">
                            {post.category}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <Link to={`/community/post/${post.id}`} className="flex items-center gap-3">
                            <span className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                              {post.title}
                            </span>
                            {post.comments > 0 && (
                              <span className="flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
                                <MessageSquare className="w-3 h-3" />
                                {post.comments}
                              </span>
                            )}
                          </Link>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 overflow-hidden border border-gray-100">
                               <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.author}`} alt="" />
                            </div>
                            <span className="text-xs font-black text-gray-600">{post.author}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6 text-center text-[11px] font-bold text-gray-400">{post.date}</td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-5">
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[10px] font-black text-gray-300 uppercase">Views</span>
                              <span className="text-xs font-black text-gray-500">{post.views}</span>
                            </div>
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[10px] font-black text-gray-300 uppercase">Likes</span>
                              <span className="text-xs font-black text-rose-500">{post.likes}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center items-center gap-2">
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-purple-600 hover:border-purple-100 transition-all shadow-sm">
                 <ChevronRight className="w-4 h-4 rotate-180" />
              </button>
              {[1, 2, 3, 4, 5].map((page) => (
                <button 
                  key={page}
                  className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
                    page === 1 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                    : 'bg-white text-gray-400 border border-gray-100 hover:bg-gray-50 hover:text-purple-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-purple-600 hover:border-purple-100 transition-all shadow-sm">
                 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default BoardListPage;
