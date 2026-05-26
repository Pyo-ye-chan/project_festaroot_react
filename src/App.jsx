import { useState } from 'react'
import Footer from './components/Footer'
import './App.css'
import SidebarFilter from './features/festival-map/components/SidebarFilter'
import { Routes,Route } from 'react-router-dom'
import FestivalMapPage from './features/festival-map/pages/FestivalMapPage'
import KakaoMapContainer from './components/map/KakaoMapContainer'
import LoginPage from './features/auth/pages/LoginPage'
import SignupPage from './features/auth/pages/SignupPage'
import FindAccountPage from './features/auth/pages/FindAccountPage'
import SignupPreferencesPage from './features/auth/pages/SignupPreferencesPage'


function App() {
  

  return (
   <>
   <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/signup/preferences" element={<SignupPreferencesPage />} />
      <Route path="/find-account" element={<FindAccountPage />} />
      <Route path="/test/map" element={<FestivalMapPage />} />
   </Routes>
   
   {/* <Footer /> */}
   </>
   
  )
}

export default App
