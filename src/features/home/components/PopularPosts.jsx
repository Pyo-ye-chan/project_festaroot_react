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
    <section className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h3 className="text-3xl font-black text-gray-900 tracking-tight">실시간 인기 게시글</h3>
          <p className="text-gray-500 mt-2 font-bold text-sm">커뮤니티에서 지금 가장 핫한 소식들을 확인하세요.</p>
        </div>
        <button
          onClick={() => navigate('/community/board/all')}
          className="flex items-center gap-1 px-4 py-2 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-purple-600 transition-all duration-300 text-sm shadow-sm active:scale-95"
        >
          더보기
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-10 font-bold text-gray-400">인기 게시글을 분석 중입니다...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-10 font-bold text-gray-400">현재 집계된 인기 게시글이 없습니다.</div>
        ) : (
          posts.map((post, index) => (
            <div
              key={post.post_id}
              onClick={() => navigate(`/community/post/${post.post_id}`)}
              className="flex items-center gap-6 p-6 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-500 group cursor-pointer"
            >
              {/* 등수 배지 */}
              <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-purple-50 rounded-2xl text-2xl font-black text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-500">
                {index + 1}
              </div>

              {/* 유저 프로필 이미지 */}
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm group-hover:border-purple-100 transition-all duration-500">
                  <img
                    src={post.profile_image_url || DEFAULT_IMAGES.PROFILE}
                    alt={post.nickname || '익명'} // 닉네임이 없을 시 탈퇴한 사용자 '익명' 바인딩
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* 본문 제목 내용 */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-purple-600/70 group-hover:text-purple-600 transition-colors duration-500">
                    {post.nickname || '익명'} {/* 닉네임이 한 글자도 없거나 null이면 '익명' 출력 */}
                  </span>
                </div>
                <h4 className="text-lg font-bold text-gray-900 truncate group-hover:text-purple-600 transition-colors duration-500">
                  {post.title}
                </h4>
              </div>

              {/* 통계 상태 노출 */}
              <div className="flex-shrink-0 flex items-center gap-6 text-sm font-bold text-gray-400">
                <div className="flex items-center gap-1.5 transition-colors duration-500 group-hover:text-gray-600">
                  <span className="text-lg">👁️</span>
                  <span>{Number(post.view_count || 0).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-500 transition-transform duration-500 group-hover:scale-110">
                  <span className="text-lg">❤️</span>
                  <span>{Number(post.like_count || 0).toLocaleString()}</span>
                </div>
                <span className="hidden md:inline text-gray-300 font-medium ml-2">
                  {post.created_at}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default PopularPosts;