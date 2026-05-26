import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Global Header */}
      <Header />

      {/* Dynamic Content Area */}
      <main className="flex-grow">
        {/* 이 Outlet 자리에 Home 같은 페이지 컴포넌트들이 번갈아가며 나타납니다! */}
        <Outlet />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;
