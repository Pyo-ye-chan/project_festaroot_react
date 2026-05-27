import { useState } from 'react'
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
import Home from './features/home/Home'
import FestivalDetailPage from './pages/FestivalDetailPage'
import CommunityMainPage from './features/community/pages/CommunityMainPage'
import BoardListPage from './features/community/pages/BoardListPage'
import PostDetailPage from './features/community/pages/PostDetailPage'
import PostWritePage from './features/community/pages/PostWritePage'
import MainLayout from './components/MainLayout'
import ChatListPage from './features/chat/ChatListPage'
import FloatingChat from './features/chat/FloatingChat'
import useChatStore from './store/useChatStore'

function App() {
  const { isFloating } = useChatStore();

  return (
    <>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/festival/:id" element={<FestivalDetailPage />} />
          <Route path="/test/map" element={<FestivalMapPage />} />

          {/* 커뮤니티 경로 */}
          <Route path="/community" element={<CommunityMainPage />} />
          <Route path="/community/board/:category" element={<BoardListPage />} />
          <Route path="/community/post/:id" element={<PostDetailPage />} />
          <Route path="/community/write" element={<PostWritePage />} />
          <Route path="/community/chats" element={<ChatListPage />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/preferences" element={<SignupPreferencesPage />} />
        <Route path="/find-account" element={<FindAccountPage />} />
      </Routes>
      {isFloating && <FloatingChat />}
    </>

  )
}

export default App
