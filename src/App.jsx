import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import './App.css'
import SidebarFilter from './features/festival-map/components/SidebarFilter'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
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
import MinimizedChatManager from './components/MinimizedChatManager'

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const { floatingChatIds, minimizedChatIds, chatRooms, restoreFloatingChat, openFloatingChat, clearChatStore } = useChatStore();
  const isLoading = useLoadingStore(state => state.isLoading);
  const { setInitialLikes } = useFestivalLikeStore();

  // 전역 로그아웃 감시 훅 기용
  // 사용자가 로그아웃 버튼을 눌러 localStorage가 비워지거나 페이지가 바뀔 때 전역 스토어를 즉시 청소합니다.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      if (floatingChatIds.length > 0 || minimizedChatIds.length > 0) {
        clearChatStore(); // 플로팅 및 접힌 창 상태 전부 초기화 (끈 효과)
      }
    }
  }, [location.pathname, floatingChatIds, minimizedChatIds, clearChatStore]);

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

      {/* 활성화 상태의 전역 플로팅 챗방 바인딩 */}
      {floatingChatIds && floatingChatIds
        .filter(id => !minimizedChatIds.includes(id))
        .map((roomId, index) => (
          <FloatingChat key={roomId} roomId={roomId} index={index} />
        ))}

      {/* 접힌 채팅 목록 영역 */}
      <MinimizedChatManager />

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