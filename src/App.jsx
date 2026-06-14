import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import './App.css'
import SidebarFilter from './features/festival-map/components/SidebarFilter'
import { Routes, Route, useNavigate } from 'react-router-dom'
import FestivalMapPage from './features/festival-map/pages/FestivalMapPage'
import KakaoMapContainer from './components/map/KakaoMapContainer'
import LoginPage from './features/auth/pages/LoginPage'
import SignupPage from './features/auth/pages/SignupPage'
import SignupPreferencesPage from './features/auth/pages/SignupPreferencesPage'
import FindAccountPage from './features/auth/pages/FindAccountPage'
import FestivalDetailPage from './features/detail/pages/FestivalDetailPage'
import Home from './features/home/pages/Home'
import CommunityMainPage from './features/community/pages/CommunityMainPage'
import BoardListPage from './features/community/pages/BoardListPage'
import PostDetailPage from './features/community/pages/PostDetailPage'
import PostWritePage from './features/community/pages/PostWritePage'
import PostUpdatePage from './features/community/pages/PostUpdatePage'
import MainLayout from './components/MainLayout'
import ChatListPage from './features/chat/pages/ChatListPage'
import FloatingChat from './features/chat/components/FloatingChat'
import SearchPage from './features/search/pages/SearchPage'
import MyPage from './features/mypage/pages/MyPage'
import AIPlannerPage from './features/ai-planner/pages/AIPlannerPage'
import useChatStore from './store/useChatStore'
import LoadingSpinner from './components/LoadingSpinner'
import useLoadingStore from './store/useLoadingStore'
import KakaoCallbackPage from './features/auth/pages/KakaoCallbackPage'
import SocialSignupPage from './features/auth/pages/SolcialSignupPage'
import NaverCallbackPage from './features/auth/pages/NaverCallbackPage'
import GoogleCallbackPage from './features/auth/pages/GoogleCallbackPage'
import GatheringPage from './features/gathering/pages/GatheringPage'
import GatheringDetailPage from './features/gathering/pages/GatheringDetailPage'
import useFestivalLikeStore from './store/useFestivalLikeStore'
import festivalService from './api/festivalService'
import ScrollToTop from './components/ScrollToTop'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MessageCircle } from 'lucide-react';

function App() {
  const navigate = useNavigate();
  const { floatingChatIds, minimizedChatIds, chatRooms, restoreFloatingChat, openFloatingChat } = useChatStore();
  const isLoading = useLoadingStore(state => state.isLoading);
  const { setInitialLikes } = useFestivalLikeStore();

  useEffect(() => {
    const restoreLikes = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");
      if (!token || !storedUser) return;

      try {
        const user = JSON.parse(storedUser);
        const userId = user?.userId || user?.id || user?.member_id;
        if (!userId) return;

        const response = await festivalService.getMyFestivalLikedIds(userId);
        if (response && Array.isArray(response)) {
          setInitialLikes(response);
        } else if (response && response.likedFestivalIds) {
          setInitialLikes(response.likedFestivalIds);
        }
      } catch (error) {
        console.error("새로고침 후 찜 목록 조회 실패 : ", error);
      }
    };
    restoreLikes();
  }, [setInitialLikes])

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/festival/:id" element={<FestivalDetailPage />} />
          <Route path="/festival/map" element={<FestivalMapPage />} />
          <Route path="/community" element={<CommunityMainPage />} />
          <Route path="/community/board/:category" element={<BoardListPage />} />
          <Route path="/community/post/:id" element={<PostDetailPage />} />
          <Route path="/community/update/:id" element={<PostUpdatePage />} />
          <Route path="/community/write" element={<PostWritePage />} />
          <Route path="/community/gathering" element={<GatheringPage />} />
          <Route path="/community/gathering/:id" element={<GatheringDetailPage />} />
          <Route path="/community/chat" element={<ChatListPage />} />
          <Route path="/community/chat/:roomId" element={<ChatListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/ai-planner" element={<AIPlannerPage />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage />} />
        <Route path="/oauth/naver/callback" element={<NaverCallbackPage />} />
        <Route path="/oauth/google/callback" element={<GoogleCallbackPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/social" element={<SocialSignupPage />} />
        <Route path="/signup/preferences" element={<SignupPreferencesPage />} />
        <Route path="oauth/kakao/callback" element={<KakaoCallbackPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
      </Routes>

      {/* 💡 [수정 완료] 접히지 않은(활성화 상태) 전역 플로팅 챗방들만 중복 없이 단 한번 바인딩 수행 */}
      {floatingChatIds && floatingChatIds
        .filter(id => !minimizedChatIds.includes(id))
        .map((roomId, index) => (
          <FloatingChat key={roomId} roomId={roomId} index={index} />
        ))}

      {/* 💡 [수정 완료] 접힌 플로팅 창 팝업 레이아웃을 최상단 App 레이어로 격상시켜 완벽한 전역 싱크 달성 */}
      {minimizedChatIds && minimizedChatIds.length > 0 && (
        <div className="fixed bottom-6 right-6 z-[10000] group font-['Pretendard']">
          {/* 하단 플로팅 원형 버튼 */}
          <button className="w-16 h-16 bg-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center relative hover:bg-purple-700 transition-all duration-300 transform hover:scale-105">
            <MessageCircle className="w-7 h-7" />
            <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {minimizedChatIds.length}
            </span>
          </button>

          {/* ✨ 마우스 커서 유실 방지를 위한 invisible 브릿지 래퍼 추가 
            bottom-16(버튼 바로 윗부분)부터 시작하며 pt-3(상단 패딩)으로 시각적인 대화창 간격을 유지합니다.
          */}
          <div className="absolute bottom-16 pt-3 right-0 hidden group-hover:block z-[10001]">
            {/* 실제 UI가 표현되는 팝업창 바디 */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-2xl w-64 p-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <p className="text-xs font-black text-gray-400 p-2 border-b border-gray-100">접힌 채팅방 목록</p>

              {/* 팝업/드롭다운 내부 목록 영역 */}
              <div className="p-2 max-h-60 overflow-y-auto custom-scrollbar flex flex-col gap-1">

                {/* 1. 최상단: 전체 채팅 페이지 이동 버튼 */}
                <button
                  onClick={() => {
                    navigate('/community/chat');
                  }}
                  className="w-full text-center py-2 mb-1 text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  💬 전체 채팅 페이지로 이동
                </button>

                <hr className="border-gray-100 my-1" />

                {/* 2. 기존 접힌 채팅방 목록 루프 */}
                {minimizedChatIds.map((id) => {
                  const room = chatRooms.find((r) => r.id === id);

                  return (
                    <button
                      key={id}
                      onClick={() => restoreFloatingChat(id)}
                      className="w-full text-left px-3 py-2 text-xs font-bold text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-xl transition-all flex items-center gap-2.5 group/item justify-between"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-grow">
                        <div className="w-6 h-6 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                          <img
                            src={room?.room_image || 'https://picsum.photos/seed/gathering/100/100'}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </div>

                        <span className="truncate flex-grow">
                          {room?.title || `채팅방 ${id}`}
                        </span>
                      </div>

                      <span className="text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity">
                        열기
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App