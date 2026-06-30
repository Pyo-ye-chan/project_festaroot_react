import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPopularPosts } from '../../../api/boardApi';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';

const PopularPosts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        setIsLoading(true);
        const response = await getPopularPosts();
        setPosts(response.data || []);
      } catch (error) {
        console.error("인기 게시글 로드 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <section className="max-w-7xl mx-auto py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center sm:items-end gap-4 mb-8 sm:mb-10">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">실시간 인기 게시글</h3>
          <p className="text-gray-500 mt-1 sm:mt-2 font-bold text-xs sm:text-sm">커뮤니티에서 지금 가장 핫한 소식들을 확인하세요.</p>
        </div>
        <button
          onClick={() => navigate('/community/board/all')}
          className="flex items-center gap-1 px-3 sm:px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-xs sm:text-sm shadow-sm active:scale-95 whitespace-nowrap shrink-0"
        >
          더보기
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {isLoading ? (
          <div className="text-center py-10 font-bold text-gray-400 text-sm">인기 게시글을 분석 중입니다...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 font-bold text-gray-400 text-sm">현재 집계된 인기 게시글이 없습니다.</div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.post_id}
              onClick={() => navigate(`/community/post/${post.post_id}`)}
              className="flex items-center gap-3 sm:gap-6 p-4 sm:p-6 bg-white rounded-[2rem] sm:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-500 group cursor-pointer"
            >
              {/* 등수 배지 */}
              <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center bg-purple-50 rounded-xl sm:rounded-2xl text-lg sm:text-2xl font-black text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                {index + 1}
              </div>

              {/* 유저 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm group-hover:border-purple-100 transition-all duration-500">
                  <img
                    src={post.profile_image_url || DEFAULT_IMAGES.PROFILE}
                    alt={post.nickname || '익명'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGES.PROFILE;
                    }}
                  />
                </div>
              </div>

              {/* 본문 제목 내용과 통계 상태 노출 */}
              <div className="flex-grow min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-6">
                <div className="flex-grow min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                    <span className="text-[10px] sm:text-xs font-bold text-purple-600/70 group-hover:text-purple-600 transition-colors duration-500">
                      {post.nickname || '익명'}
                    </span>
                  </div>
                  <h4 className="text-sm sm:text-lg font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-500">
                    {post.title}
                  </h4>
                </div>

                {/* 통계 상태 노출 */}
                <div className="flex-shrink-0 flex items-center gap-3 sm:gap-6 text-[10px] sm:text-sm font-bold text-gray-400">
                  <div className="flex items-center gap-1 transition-colors duration-500 group-hover:text-gray-600">
                    <span className="text-xs sm:text-lg">👁️</span>
                    <span>{Number(post.view_count || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1 text-rose-500 transition-transform duration-500 group-hover:scale-110">
                    <span className="text-xs sm:text-lg">❤️</span>
                    <span>{Number(post.like_count || 0).toLocaleString()}</span>
                  </div>
                  <span className="hidden md:inline text-gray-300 font-medium ml-2">
                    {post.created_at}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PopularPosts;