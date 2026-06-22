import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Users,
  CalendarDays,
  Newspaper,
  MessageSquare,
  ShieldAlert,
  Megaphone,
  LayoutGrid,
  Search,
  Bell,
  ChevronDown,
  CircleUser,
  UsersRound, 
  LogOut,
} from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const MainAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    if (window.confirm('로그아웃 하시겠습니까?')) {
      logout();
      navigate('/login');
    }
  };

  const menus = [
    { name: '대시보드', path: '/admin', icon: Home },
    { name: '회원 관리', path: '/admin/members', icon: Users },
    { name: '축제 관리', path: '/admin/festivals', icon: CalendarDays },
    { name: '게시글 관리', path: '/admin/posts', icon: Newspaper },
    { name: '댓글 관리', path: '/admin/comments', icon: MessageSquare },
     // { name: '모임 관리', path: '/admin/gatherings', icon: UsersRound }, // 추후 기능 추가 가능성 대비 주석함
    { name: '공지사항 관리', path: '/admin/notices', icon: Megaphone },
    { name: '문의 관리', path: '/admin/inquiries', icon: ShieldAlert },
  ];

  const getCurrentMenuName = () => {
    if (location.pathname === '/admin' || location.pathname === '/admin/dashboard') {
      return '대시보드';
    }

    const current = menus.find(
      (menu) => menu.path !== '/admin' && location.pathname.startsWith(menu.path)
    );

    return current?.name || '대시보드';
  };

  const currentMenuName = getCurrentMenuName();

  return (
    <div className="min-h-screen bg-[#fcfcfc] text-gray-900">
      {/* 왼쪽 사이드바 */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[260px] flex-col border-r border-gray-100 bg-white shadow-[4px_0_24px_rgba(15,23,42,0.04)] lg:flex">
        <div className="flex h-[78px] items-center gap-3 border-b border-gray-100 px-7 flex-shrink-0">
          <svg className="w-10 h-10 select-none flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#f3eeff"/>
            <path d="M16,3 C11,3 7,7 7,12 C7,18 16,29 16,29 C16,29 25,18 25,12 C25,7 21,3 16,3 Z" fill="#6d3df2"/>
            {/* 관리자 그리드 코어 심볼 (골드) */}
            <rect x="13" y="9" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
            <rect x="16.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
            <rect x="13" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
            <rect x="16.5" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
          </svg>

          <p className="text-xl font-black tracking-tight">
            <span className="text-[#6d3df2]">축제로</span> 관리자
          </p>
        </div>

        {/* 2. 메뉴 영역 */}
        <nav className="flex-1 overflow-y-auto px-5 py-5">
          <ul className="space-y-1.5">
            {menus.map((menu) => {
              const Icon = menu.icon;

              const isActive =
                menu.path === '/admin'
                  ? location.pathname === '/admin' || location.pathname === '/admin/dashboard'
                  : location.pathname.startsWith(menu.path);

              return (
                <li key={menu.name}>
                  <button
                    type="button"
                    onClick={() => navigate(menu.path)}
                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${isActive
                      ? 'bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] text-white shadow-lg shadow-purple-100'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#6d3df2]'
                      }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-[#6d3df2]'}
                    />

                    <span className="flex-1 text-left">{menu.name}</span>

                    {menu.badge && (
                      <span className="rounded-full bg-yellow-300 px-2 py-0.5 text-xs font-black text-yellow-900">
                        {menu.badge}
                      </span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* 3. 하단 고정 로그아웃 영역 */}
        <div className="p-5 border-t border-gray-100 bg-white flex-shrink-0">
          <button
            type="button"
            onClick={handleLogout}
            className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-gray-500 transition-all hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} className="text-gray-400 group-hover:text-red-600" />
            <span className="flex-1 text-left">로그아웃</span>
          </button>
        </div>
      </aside>

      {/* 모바일 헤더 */}
      <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-gray-100 bg-white/90 px-5 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <svg className="w-10 h-10 select-none flex-shrink-0" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="16" cy="16" r="16" fill="#f3eeff"/>
            <path d="M16,3 C11,3 7,7 7,12 C7,18 16,29 16,29 C16,29 25,18 25,12 C25,7 21,3 16,3 Z" fill="#6d3df2"/>
            <rect x="13" y="9" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
            <rect x="16.5" y="9" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
            <rect x="13" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
            <rect x="16.5" y="12.5" width="2.5" height="2.5" rx="0.5" fill="#ffd000"/>
          </svg>

          <p className="text-lg font-black">
            <span className="text-[#6d3df2]">축제로</span> 관리자
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell size={22} className="text-gray-500" />
            <span className="absolute -right-1 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-yellow-900">
              8
            </span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="text-gray-500 transition hover:text-red-600"
          >
            <LogOut size={22} />
          </button>
        </div>
      </header>

      {/* 오른쪽 메인 영역 */}
      <div className="lg:pl-[260px]">
        {/* 데스크톱 상단 헤더 */}
        <header className="sticky top-0 z-10 hidden h-[78px] items-center justify-between border-b border-gray-100 bg-white/90 px-10 backdrop-blur lg:flex">
          <div className="text-sm font-bold text-gray-400">
            관리자 홈
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-800">{currentMenuName}</span>
          </div>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-11 w-11 items-center justify-center rounded-2xl text-gray-400 transition hover:bg-red-50 hover:text-red-600"
              title="로그아웃"
            >
              <LogOut size={22} />
            </button>
          </div>
        </header>

        {/* 하위 라우트 페이지 렌더링 위치 */}
        <main className="min-h-[calc(100vh-78px)] px-5 py-6 sm:px-7 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainAdminLayout;