import React from 'react';
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
} from 'lucide-react';

const MainAdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 현재 라우터에 실제로 등록된 관리자 페이지 기준 메뉴
  const menus = [
    { name: '대시보드', path: '/admin', icon: Home },
    { name: '회원 관리', path: '/admin/members', icon: Users },
    { name: '축제 관리', path: '/admin/festivals', icon: CalendarDays },
    { name: '게시글 관리', path: '/admin/posts', icon: Newspaper },
    { name: '댓글 관리', path: '/admin/comments', icon: MessageSquare },
    { name: '모임 관리', path: '/admin/gatherings', icon: UsersRound },
    { name: '공지 및 알림', path: '/admin/notices', icon: Megaphone },
    { name: '신고 및 문의', path: '/admin/inquiries', icon: ShieldAlert, badge: '12' },
  ];

  // 현재 경로에 맞는 메뉴명 찾기
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
        {/* 로고 영역 */}
        <div className="flex h-[78px] items-center gap-3 border-b border-gray-100 px-7">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d3df2] to-[#4f46e5] text-white shadow-lg shadow-purple-200">
            <LayoutGrid size={22} />
          </div>

          <p className="text-xl font-black tracking-tight">
            <span className="text-[#6d3df2]">축제로</span> 관리자
          </p>
        </div>

        {/* 메뉴 영역 */}
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
                    className={`group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] text-white shadow-lg shadow-purple-100'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#6d3df2]'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? 'text-white'
                          : 'text-gray-500 group-hover:text-[#6d3df2]'
                      }
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

        {/* 하단 가이드 카드 */}
        <div className="m-5 rounded-3xl border border-purple-100 bg-gradient-to-br from-purple-50 to-white p-5">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white text-2xl shadow-sm">
              🎉
            </div>
          </div>

          <p className="text-center text-sm font-black text-[#6d3df2]">
            축제로 관리자 가이드
          </p>

          <p className="mt-2 text-center text-xs leading-relaxed text-gray-500">
            서비스 운영에 필요한
            <br />
            가이드를 확인하세요.
          </p>

          <button
            type="button"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-black text-gray-700 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
          >
            가이드 보기
            <span className="text-gray-400">↗</span>
          </button>
        </div>
      </aside>

      {/* 모바일 헤더 */}
      <header className="sticky top-0 z-20 flex h-[70px] items-center justify-between border-b border-gray-100 bg-white/90 px-5 backdrop-blur lg:hidden">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#6d3df2] to-[#4f46e5] text-white">
            <LayoutGrid size={20} />
          </div>

          <p className="text-lg font-black">
            <span className="text-[#6d3df2]">축제로</span> 관리자
          </p>
        </div>

        <div className="relative">
          <Bell size={22} className="text-gray-500" />
          <span className="absolute -right-1 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-400 text-[10px] font-black text-yellow-900">
            8
          </span>
        </div>
      </header>

      {/* 오른쪽 메인 영역 */}
      <div className="lg:pl-[260px]">
        {/* 데스크톱 상단 헤더 */}
        <header className="sticky top-0 z-10 hidden h-[78px] items-center justify-between border-b border-gray-100 bg-white/90 px-10 backdrop-blur lg:flex">
          {/* 현재 위치 */}
          <div className="text-sm font-bold text-gray-400">
            관리자 홈
            <span className="mx-2 text-gray-300">›</span>
            <span className="text-gray-800">{currentMenuName}</span>
          </div>

          {/* 검색창 */}
          <div className="relative w-[430px]">
            <Search
              size={19}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="검색어를 입력하세요 (축제, 회원, 게시글)"
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-16 text-sm font-medium outline-none transition focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg bg-gray-100 px-2 py-1 text-xs font-black text-gray-400">
              ⌘K
            </span>
          </div>

          {/* 알림 + 관리자 프로필 */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              className="relative rounded-2xl p-2 transition hover:bg-gray-50"
            >
              <Bell size={22} className="text-gray-500" />
              <span className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400 text-[11px] font-black text-yellow-900">
                8
              </span>
            </button>

            <div className="h-8 w-px bg-gray-100" />

            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl p-1.5 transition hover:bg-gray-50"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-100 text-[#6d3df2]">
                <CircleUser size={24} />
              </div>

              <div className="text-left">
                <p className="text-sm font-black text-gray-800">관리자</p>
                <p className="text-xs font-bold text-gray-400">최고 관리자</p>
              </div>

              <ChevronDown size={17} className="text-gray-400" />
            </button>
          </div>
        </header>

        {/* 하위 라우트 페이지가 렌더링되는 위치 */}
        <main className="min-h-[calc(100vh-78px)] px-5 py-6 sm:px-7 lg:px-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainAdminLayout;