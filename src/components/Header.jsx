import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [region, setRegion] = useState('서울');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Simulated login state

  // Colors aligned with Footer
  const primaryPurple = '#6B46FE';
  const regions = [
    '서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종', 
    '경북', '경남', '대구', '울산', '부산', '전북', '전남', '광주', '제주'
  ];

  const navItems = [
    { name: '홈', href: '/' },
    { name: '축제 찾기', href: '#festivals' },
    { name: '지도', href: '#map' },
    { name: '커뮤니티', href: '#community' },
    { name: 'AI 여행플래너', href: '#ai-planner' },
    { name: '마이페이지', href: '#mypage' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 font-sans">
      {/* Top Row: Logo, Notification, Profile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: primaryPurple }}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: primaryPurple }}>축제로</span>
          </Link>

          {/* User Section (Right) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification */}
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all relative">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full border-2 border-white bg-rose-500"></span>
            </button>

            {/* Profile/Login Button with Hover Effect */}
            <button 
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="group flex items-center gap-0 hover:gap-2 p-1 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all duration-300 overflow-hidden"
              title={isLoggedIn ? '로그아웃' : '로그인'}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                <img 
                  src={isLoggedIn ? "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" : "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest"} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="max-w-0 group-hover:max-w-[80px] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-bold text-gray-700 overflow-hidden pr-0 group-hover:pr-3">
                {isLoggedIn ? '로그아웃' : '로그인'}
              </span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Navigation & Weather (Desktop) */}
      <nav className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <ul className="flex gap-10">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href}
                  className="block py-4 text-[16px] font-bold text-gray-600 hover:text-purple-600 transition-colors border-b-2 border-transparent hover:border-purple-600"
                  style={{ '--hover-color': primaryPurple }}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-3 py-3">
            <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 gap-2">
              <select 
                className="text-sm font-bold text-blue-700 bg-transparent border-none focus:ring-0 cursor-pointer outline-none" 
                value={region} 
                onChange={(e) => setRegion(e.target.value)}
              >
                {regions.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 text-blue-500">
                <span className="text-lg">☀️</span>
                <span className="text-sm font-black">24°C</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu (Drawer style) */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl py-6 px-4 space-y-6 animate-in slide-in-from-top duration-300">
          <ul className="grid grid-cols-2 gap-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <a 
                  href={item.href}
                  className="flex items-center justify-center p-4 bg-gray-50 rounded-xl text-sm font-bold text-gray-700 active:bg-purple-50 active:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
          
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-bold text-gray-500">현재 지역 날씨</span>
              <div className="flex items-center gap-3">
                <select 
                  className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg border-none outline-none" 
                  value={region} 
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1 text-blue-500 font-black">
                  <span>☀️</span>
                  <span>24°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
