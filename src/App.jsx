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
import useChatStore from './store/useChatStore'
import KakaoCallbackPage from './features/auth/pages/KakaoCallbackPage'
import SocialSignupPage from './features/auth/pages/SolcialSignupPage'

function App() {


  const { isFloating } = useChatStore();

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
          
          <Route path="/chats" element={<ChatListPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/oauth/kakao/callback" element={<KakaoCallbackPage/>} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/social" element={<SocialSignupPage />} />
        <Route path="/signup/preferences" element={<SignupPreferencesPage />} />
        <Route path="oauth/kakao/callback" element={<KakaoCallbackPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
      </Routes>
      {isFloating && <FloatingChat />}
    </>

  )
}

export default App
