import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../../store/useAuthStore';
import { getMyPost } from '../../../api/boardApi';
import Pagination from '../../gathering/components/Pagination';


const MyPostsTab = () => {
  const navigate = useNavigate();

  const categoryMap = {
  free: '자유',
  review: '후기',
  tip: '꿀팁'
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
  const { user, isLoggedIn } = useAuthStore();
  const [myPost, setMyPost] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 검색 및 페이지네이션 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const fetchMyPosts = async () => {
      setIsLoading(true);
      try {
        const userId = user?.member_id || user?.id;
        if (!userId) {
          setIsLoading(false);
          return;
        }
        
        const myPostResp = await getMyPost(userId);
        console.log('API 응답 전체:', myPostResp);
        setMyPost(myPostResp.data || []); // 데이터 배열 저장
        
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoggedIn) {
      fetchMyPosts();
    } else {
      setIsLoading(false);
    }
  }, [user, isLoggedIn]);

  // 검색 필터링 로직
  const filteredPosts = myPost.filter((post) => {
    const titleMatch = post.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryName = categoryMap[post.category] || post.category;
    const categoryMatch = categoryName.toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch || categoryMatch;
  });

  // 검색어가 바뀔 때마다 페이지를 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // 현재 페이지에 보여줄 게시글 계산 (필터링된 결과 기준)
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // 페이지 변경 시 상단으로 스크롤
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">내가 작성한 글</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">커뮤니티에 공유한 소중한 이야기들입니다.</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          {!isLoading && myPost.length > 0 && (
            <span className="text-xs sm:text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              총 {myPost.length}개
            </span>
          )}
          
          {/* 검색 입력창 추가 */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="제목 또는 카테고리 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
            />
            <svg
              className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </header>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-bold animate-pulse">나의 이야기를 불러오는 중...</p>
        </div>
      ) : myPost.length > 0 ? (
        <>
          {currentPosts.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
               {currentPosts.map((post) => (
                <div
                  key={post.post_id}
                  onClick={() => navigate(`/community/post/${post.post_id || post.id}`)}
                  className="group bg-white p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-100 transition-all cursor-pointer"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1 sm:space-y-2">
                      <span
                        className={`inline-flex px-3 py-1 rounded-full text-xs font-black ${getCategoryClasses(
                          post.category
                        )}`}
                      >
                        {categoryMap[post.category] || post.category}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-purple-600 transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      <p className="text-[10px] sm:text-xs text-gray-400 font-medium">{post.created_at}</p>
                    </div>

                    <div className="flex items-center gap-4 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-400">
                        <span>❤️</span>
                        <span className="group-hover:text-rose-500 transition-colors">{post.like_count}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-400">
                        <span>👁️</span>
                        <span className="group-hover:text-blue-500 transition-colors">{post.view_count}</span>
                      </div>
                      <div className="ml-auto sm:ml-4 text-gray-300 group-hover:text-purple-300 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
              <div className="text-4xl mb-4">🔍</div>
              <h2 className="text-xl font-black text-gray-800">검색 결과가 없습니다.</h2>
              <p className="text-gray-500 mt-2 font-medium">다른 검색어를 입력해 보세요.</p>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalItems={filteredPosts.length}
              itemsPerPage={postsPerPage}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
          <div className="text-4xl mb-4">📝</div>
          <h2 className="text-xl font-black text-gray-800">아직 작성한 글이 없습니다.</h2>
          <p className="text-gray-500 mt-2 font-medium">나만의 축제 이야기나 꿀팁을 공유해 보세요!</p>
        </div>
      )}
    </div>
  );



};

export default MyPostsTab;
