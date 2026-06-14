import { useState, useEffect } from 'react'
import Footer from './components/Footer'
import './App.css'
import SidebarFilter from './features/festival-map/components/SidebarFilter'
import { Routes, Route } from 'react-router-dom'
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
import PostUpdatePage from './features/community/pages/PostUpdatePage' // New import
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


function App() {
  const { isFloating } = useChatStore(); // 채팅방 띄우기
  const isLoading = useLoadingStore(state => state.isLoading); // 로딩 상태 확인

  // 축제 찜 목록 관련 zustand 코드
  const { setInitialLikes } = useFestivalLikeStore();

  useEffect(() => {
    const restoreLikes = async () => {
      const token = localStorage.getItem("accessToken");
      const storedUser = localStorage.getItem("user");

      if (!token || !storedUser) return;

      try {
        const user = JSON.parse(storedUser);
        const userId = user?.userId || user?.id || user?.member_id;

        if (!userId) {
          console.log("비로그인 상태이므로, 찜 목록을 가져오지 않습니다.");
          return;
        }

        // 백엔드로 요청 전송 (maxios가 인터셉터로 토큰을 헤더에 알아서 실어 보냄)
        const response = await festivalService.getMyFestivalLikedIds(userId);

        // 💡 백엔드가 객체가 아닌 순수 리스트 [123, 456] 자체를 주므로 Array.isArray로 체크하고 바로 저장!
        if (response && Array.isArray(response)) {
          setInitialLikes(response);
        } else if (response && response.likedFestivalIds) {
          // 혹시 몰라 기존 객체 형태 대응용 예외 처리 유지
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

          {/* 커뮤니티 경로 */}
          <Route path="/community" element={<CommunityMainPage />} />
          <Route path="/community/board/:category" element={<BoardListPage />} />
          <Route path="/community/post/:id" element={<PostDetailPage />} />
          <Route path="/community/update/:id" element={<PostUpdatePage />} /> // New Route
          <Route path="/community/write" element={<PostWritePage />} />
          <Route path="/community/gathering" element={<GatheringPage />} />
          <Route path="/community/gathering/:id" element={<GatheringDetailPage />} />

          <Route path="/community/chat" element={<ChatListPage />} />
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

      {/* Routes 바깥 영역에 조건부 렌더링으로 배치 / 주소창 영향X */}
      {isLoading && <LoadingSpinner />}
      {isFloating && <FloatingChat />}

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
