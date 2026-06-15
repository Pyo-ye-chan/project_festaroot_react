import React, { useEffect, useState } from 'react';
import useAuthStore from '../../../store/useAuthStore';
import { getMyPost } from '../../../api/boardApi';


const MyPostsTab = () => {

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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMyPosts = async () => {
      setIsLoading(true);
      try {
        const userId = user?.member_id || user?.id;
        if (!userId) return;
        
        const myPostResp = await getMyPost(userId);
        console.log('API 응답 전체:', myPostResp);
        setMyPost(myPostResp.data); // 데이터 배열 저장
        
      } catch (error) {
        console.error('데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMyPosts(); // 함수 실행 필수!
  }, [user]);
  // const posts = [
  //   { id: 1, category: '자유게시판', title: '이번 주말에 가기 좋은 서울 축제 추천해주세요!', date: '2024.05.20', likes: 5, comments: 12 },
  //   { id: 2, category: '축제후기', title: '진해 군항제 다녀왔습니다! 주차 꿀팁 공유해요.', date: '2024.04.15', likes: 24, comments: 8 },
  //   { id: 3, category: '모임찾기', title: '부산 불꽃축제 같이 가실 분 구합니다 (20대)', date: '2024.03.28', likes: 12, comments: 45 },
  //   { id: 4, category: '자유게시판', title: '축제 갈 때 꼭 챙겨야 할 필수 아이템 5가지', date: '2024.03.10', likes: 18, comments: 3 },
  //   { id: 5, category: '질문/답변', title: '아이와 함께 가기 좋은 체험형 축제 있을까요?', date: '2024.02.25', likes: 7, comments: 15 },
  // ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">내가 작성한 글</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">커뮤니티에 공유한 소중한 이야기들입니다.</p>
        </div>
        <span className="text-xs sm:text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          총 {myPost.length}개
        </span>
      </header>

      <div className="space-y-3 sm:space-y-4">
        {myPost.map((post) => (
          <div
            key={post.post_id}
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

      <div className="pt-4 text-center">
        <button className="text-sm font-bold text-gray-400 hover:text-purple-600 transition-all">
          이전 작성글 더보기
        </button>
      </div>
    </div>
  );
};

export default MyPostsTab;
