import { useState } from 'react'
import Footer from './components/Footer'
import './App.css'
import SidebarFilter from './features/festival-map/components/SidebarFilter'
import { Routes,Route } from 'react-router-dom'
import FestivalMapPage from './features/festival-map/pages/FestivalMapPage'
import KakaoMapContainer from './components/map/KakaoMapContainer'


function App() {
  

  return (
   <>
   <Routes>
      <Route path="/test/map" element={<FestivalMapPage />} />
      
   </Routes>
   
   {/* <Footer /> */}
   </>
   
  )
}

export default App
