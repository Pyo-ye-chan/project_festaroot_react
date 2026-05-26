<<<<<<< HEAD
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import Home from './pages/Home';
import './App.css';
import SidebarFilter from './features/festival-map/components/SidebarFilter'
import FestivalMapPage from './features/festival-map/pages/FestivalMapPage'
import KakaoMapContainer from './components/map/KakaoMapContainer'


function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/test/map" element={<FestivalMapPage />} />
      </Route>
    </Routes>
  );
}

export default App;
