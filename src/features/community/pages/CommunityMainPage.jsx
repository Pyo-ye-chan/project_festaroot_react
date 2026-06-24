import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  TrendingUp,
  ChevronRight,
  Search,
  MapPin,
  Calendar
} from 'lucide-react';
import CommunitySidebar from '../components/CommunitySidebar';
import { getPopularPosts } from '../../../api/boardApi';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';
import gatheringApi from '../../../api/gatheringApi';

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '후기',
  tip: '꿀팁',
  notice: '공지',

  전체: '전체',
  자유: '자유',
  후기: '후기',
  팁: '꿀팁',
  꿀팁: '꿀팁',
  공지: '공지',
  공지사항: '공지',
};

const CATEGORY_KEY_MAP = {
  all: 'all',
  free: 'free',
  review: 'review',
  tip: 'tip',
  notice: 'notice',

  전체: 'all',
  자유: 'free',
  후기: 'review',
  팁: 'tip',
  꿀팁: 'tip',
  공지: 'notice',
  공지사항: 'notice',
  정보: 'notice',

  전체게시판: 'all',
  자유게시판: 'free',
  축제후기: 'review',
  꿀팁공유: 'tip',
};

const categoryClass = {
  all: 'bg-gray-100 text-gray-600 border-gray-200',
  free: 'bg-slate-100 text-slate-600 border-slate-200',
  review: 'bg-purple-50 text-purple-600 border-purple-100',
  tip: 'bg-amber-50 text-amber-600 border-amber-100',
  notice: 'bg-blue-50 text-blue-600 border-blue-100',
};

const getCategoryLookupKey = (value) =>
  String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase();

const normalizeCategory = (value, fallback = 'unknown') => {
  const lookupKey = getCategoryLookupKey(value);

  if (!lookupKey) return fallback;

  return CATEGORY_KEY_MAP[lookupKey] || fallback;
};

const getCategoryLabel = (value) => {
  const rawValue = String(value ?? '').trim();
  const normalizedValue = normalizeCategory(rawValue);

  return (
    CATEGORY_LABELS[rawValue] ||
    CATEGORY_LABELS[normalizedValue] ||
    '기타'
  );
};

const CommunityMainPage = () => {
  const navigate = useNavigate();

  const [popularPosts, setPopularPosts] = useState([]);
  const [gatherings, setGatherings] = useState([]);
  const [isPostsLoading, setIsPostsLoading] = useState(true);
  const [isGatheringsLoading, setIsGatheringsLoading] = useState(true);
  
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    const fetchHomeData = async () => {
      // 1. 실시간 인기글 로딩
      try {
        setIsPostsLoading(true);
        const postRes = await getPopularPosts();
        
        // 데이터 구조가 배열인지 객체인지 안전하게 검사하는 방어 로직
        let postsArray = [];
        if (postRes) {
          if (Array.isArray(postRes)) {
            postsArray = postRes;
          } else if (Array.isArray(postRes.data)) {
            postsArray = postRes.data;
          } else if (postRes.data && Array.isArray(postRes.data.list)) {
            postsArray = postRes.data.list;
          } else if (Array.isArray(postRes.list)) {
            postsArray = postRes.list;
          }
        }
        
        setPopularPosts(postsArray);
      } catch (error) {
        console.error("실시간 인기글 로딩 실패:", error);
        setPopularPosts([]);
      } finally {
        setIsPostsLoading(false);
      }

      // 2. 인기 모임 로딩
      try {
        setIsGatheringsLoading(true);
        const gatheringData = await gatheringApi.getPopularGatherings();
        setGatherings(gatheringData || []);
      } catch (error) {
        console.error("인기 모임 로딩 실패:", error);
        setGatherings([]);
      } finally {
        setIsGatheringsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getCategoryClasses = (value) => {
    const normalizedValue = normalizeCategory(value);

    return (
      categoryClass[normalizedValue] ||
      'bg-gray-100 text-gray-500 border-gray-200'
    );
  };

  const formatMoimDate = (dateStr) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchKeyword.trim()) {
      navigate('/community/board/all', { 
        state: { keyword: searchKeyword.trim() } 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar */}
          <aside className="lg:col-span-3">
            <CommunitySidebar />
          </aside>

          {/* Main Content */}
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
                    to="/search"
                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-sm text-[var(--festival-purple)] bg-[var(--festival-yellow)] hover:bg-yellow-400 transition-colors"
                  >
                    축제 찾아보기
                    <ChevronRight className="ml-2 -mr-1 w-5 h-5" />
                  </Link>
                </div>
                <div className="md:w-1/3 flex justify-center">
                  <img src="https://picsum.photos/seed/festivalad/300/200" alt="Festival Ad" className="rounded-xl shadow-lg" />
                </div>
              </div>
            </section>

            {/* Search Bar */}
            <div className="relative group">
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                placeholder="궁금한 축제 소식을 검색해보세요!"
                className="w-full bg-white border border-gray-100 rounded-[2rem] py-4 pl-14 pr-6 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600/20 focus:border-purple-600 transition-all font-bold text-gray-700"
              />
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-600 transition-colors w-5 h-5" />
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
                {isPostsLoading ? (
                  <div className="text-center py-10 font-bold text-gray-400">인기 게시글 집계 중...</div>
                ) : popularPosts.length === 0 ? (
                  <div className="text-center py-10 font-bold text-gray-400">현재 집계된 인기 게시글이 없습니다.</div>
                ) : (
                  popularPosts.slice(0, 3).map((post, idx) => (
                    <Link
                      to={`/community/post/${post.post_id || post.id}`}
                      key={post.post_id || post.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-2xl transition-all group border border-transparent hover:border-[var(--festival-purple-soft)]"
                    >
                      <span className={`text-xl font-black ${idx === 0 ? 'text-[var(--festival-purple)]' : 'text-gray-300'}`}>
                        {idx + 1}
                      </span>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex border text-[10px] font-black px-2 py-0.5 rounded-md ${getCategoryClasses(post.category || '자유')}`}>
                            {getCategoryLabel(post.category || '자유')}
                          </span>
                          <span className="text-xs font-bold text-gray-400">{post.nickname || post.author || '익명'}</span>
                        </div>
                        <h4 className="font-bold text-gray-800 group-hover:text-[var(--festival-purple)] transition-colors truncate">
                          {post.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-gray-400">
                        <span className="flex items-center gap-1">👁️ {Number(post.view_count || post.views || 0).toLocaleString()}</span>
                        <span className="flex items-center gap-1 text-rose-500">❤️ {Number(post.like_count || post.likes || 0).toLocaleString()}</span>
                      </div>
                    </Link>
                  ))
                )}
              </div>
            </section>

            {/* Popular Gatherings (Moim) Section */}
            <section>
              <div className="flex justify-between items-center mb-6 px-2">
                <h3 className="text-2xl font-black text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-[var(--festival-purple)]" />
                  이번 주 인기 모임
                </h3>
                <button onClick={() => navigate('/community/gathering')} className="text-sm font-bold text-gray-400 hover:text-[var(--festival-purple)]">더보기</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isGatheringsLoading ? (
                  <div className="col-span-2 text-center py-10 font-bold text-gray-400">추천 모임을 탐색 중입니다...</div>
                ) : gatherings.length === 0 ? (
                  <div className="col-span-2 text-center py-10 font-bold text-gray-400">이번 주 활성화된 인기 모임이 존재하지 않습니다.</div>
                ) : (
                  gatherings.map((moim) => (
                    <div key={moim.roomId} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between overflow-hidden">
                      <div>
                        <div className="relative w-full h-48 bg-gray-50 overflow-hidden border-b border-gray-50">
                          <img
                            src={moim.roomImage || DEFAULT_IMAGES.ROOM_COVER}
                            alt="모임 커버"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = DEFAULT_IMAGES.ROOM_COVER;
                            }}
                          />
                          
                          <span className={`absolute top-4 left-4 text-[10px] font-black px-3 py-1 rounded-full shadow-md backdrop-blur-sm ${
                            moim.roomType?.toUpperCase() === 'FESTIVAL' 
                              ? 'bg-purple-100/90 text-[var(--festival-purple)] border border-purple-200' 
                              : 'bg-amber-100/90 text-amber-700 border border-amber-200'
                          }`}>
                            {moim.roomType?.toUpperCase() === 'FESTIVAL' ? '축제 모임' : '자유 모임'}
                          </span>
                        </div>
                        
                        <div className="p-6">
                          <h4 className="font-black text-xl text-gray-900 mb-3 group-hover:text-[var(--festival-purple)] transition-colors line-clamp-1">
                            {moim.roomTitle}
                          </h4>
                          <div className="space-y-1.5 mb-2">
                            <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5" /> {moim.freeLocation || '온라인/미정'}
                            </p>
                            <p className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5" /> 
                              {moim.roomType?.toUpperCase() === 'FESTIVAL' && moim.endDate
                                ? `${formatMoimDate(moim.freeDate)} ~ ${formatMoimDate(moim.endDate)}`
                                : formatMoimDate(moim.freeDate)
                              }
                            </p>
                            <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5 pt-1">
                              <Users className="w-3.5 h-3.5" /> 인원수: <span className="text-[var(--festival-purple)] font-black">{moim.participants}</span> / {moim.maxCapacity}명
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-6">
                        <button
                          onClick={() => navigate(`/community/gathering/${moim.roomId}`)}
                          className="w-full py-3 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-[var(--festival-purple)] hover:text-white transition-all active:scale-95 border border-gray-100 hover:border-[var(--festival-purple)]"
                        >
                          참여하기
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
};

export default CommunityMainPage;
