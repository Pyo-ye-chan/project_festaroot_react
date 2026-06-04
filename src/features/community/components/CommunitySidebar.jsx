import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  Users, 
  MessageCircle,
  ChevronRight
} from 'lucide-react';

const CommunitySidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: '커뮤니티 홈', path: '/community', icon: LayoutDashboard },
    { name: '게시판', path: '/community/board/all', icon: ClipboardList },
    { name: '모임', path: '/community/gathering', icon: Users },
    { name: '채팅', path: '/chats', icon: MessageCircle },
  ];

  const isActive = (path) => {
    if (path === '/community' && location.pathname === '/community') return true;
    if (path !== '/community' && location.pathname.startsWith(path.split('/all')[0])) return true;
    return false;
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 sticky top-24">
      <h5 className="text-xs font-black text-gray-400 mb-6 px-4 uppercase tracking-widest flex items-center gap-2">
        Menu Navigation
      </h5>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const ActiveIcon = item.icon;
          const active = isActive(item.path);
          
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={`flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
                active 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-100' 
                : 'text-gray-500 hover:bg-purple-50 hover:text-purple-600'
              }`}
            >
              <div className="flex items-center gap-4">
                <ActiveIcon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400 group-hover:text-purple-600'}`} />
                <span className="font-black text-sm">{item.name}</span>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${active ? 'opacity-100 translate-x-1' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>
          );
        })}
      </nav>

      {/* Quick Banner in Sidebar */}
      <div className="mt-8 p-6 bg-gray-50 rounded-[1.5rem] border border-gray-100 relative overflow-hidden group cursor-pointer">
        <p className="text-[10px] font-black text-purple-600 mb-1 uppercase tracking-tighter">New Update</p>
        <p className="text-xs font-bold text-gray-700 leading-snug">
          이제 모임 기능에서 <br/>
          채팅방을 바로 <br/>
          개설할 수 있어요!
        </p>
        <div className="mt-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:translate-x-1 transition-transform">
          <ChevronRight className="w-4 h-4 text-purple-600" />
        </div>
      </div>
    </div>
  );
};

export default CommunitySidebar;
