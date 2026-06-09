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
import Home from './features/home/Home'
import CommunityMainPage from './features/community/pages/CommunityMainPage'
import BoardListPage from './features/community/pages/BoardListPage'
import PostDetailPage from './features/community/pages/PostDetailPage'
import PostWritePage from './features/community/pages/PostWritePage'
import MainLayout from './components/MainLayout'
import ChatListPage from './features/chat/ChatListPage'
import FloatingChat from './features/chat/FloatingChat'
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
import GatheringPage from './features/community/pages/GatheringPage'
import GatheringDetailPage from './features/community/pages/GatheringDetailPage'

function App() {
  const { isFloating } = useChatStore(); // 채팅방 띄우기
  const isLoading = useLoadingStore(state => state.isLoading); // 로딩 상태 확인

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/festival/:id" element={<FestivalDetailPage />} />
          <Route path="/festival/map" element={<FestivalMapPage />} />

          {/* 커뮤니티 경로 */}
          <Route path="/community" element={<CommunityMainPage />} />
          <Route path="/community/board/:category" element={<BoardListPage />} />
          <Route path="/community/post/:id" element={<PostDetailPage />} />
          <Route path="/community/write" element={<PostWritePage />} />
          <Route path="/community/gathering" element={<GatheringPage />} />
          <Route path="/community/gathering/:id" element={<GatheringDetailPage />} />

          <Route path="/chats" element={<ChatListPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/ai-planner" element={<AIPlannerPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage/>} />
        <Route path="/oauth/naver/callback" element={<NaverCallbackPage/>} />
        <Route path="/oauth/google/callback" element={<GoogleCallbackPage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/social" element={<SocialSignupPage />} />
        <Route path="/signup/preferences" element={<SignupPreferencesPage />} />
        <Route path="oauth/kakao/callback" element={<KakaoCallbackPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
      </Routes>

      {/* Routes 바깥 영역에 조건부 렌더링으로 배치 / 주소창 영향X */}
      {isLoading && <LoadingSpinner />}
      {isFloating && <FloatingChat />}
    </>

  )
}

export default App
