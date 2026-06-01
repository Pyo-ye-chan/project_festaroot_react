import React from 'react';

const MyPageSidebar = ({ activeTab, setActiveTab }) => {
  const menuGroups = [
    {
      title: '나의 활동',
      items: [
        { id: 'profile', label: '프로필', icon: '👤' },
        { id: 'achievements', label: '나의 업적', icon: '🏆' },
        { id: 'posts', label: '내가 작성한 글', icon: '📝' },
        { id: 'saved-plans', label: '저장된 플래너', icon: '📂' },
        { id: 'likes', label: '찜한 축제', icon: '❤️' },
      ]
    },
    {
      title: '설정 및 지원',
      items: [
        { id: 'inquiry', label: '문의하기', icon: '🙋' },
        { id: 'account', label: '계정 설정', icon: '⚙️' },
        { id: 'notifications', label: '알림 설정', icon: '🔔' },
      ]
    }
  ];

  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white border-b md:border-b-0 md:border-r border-gray-100 flex flex-col">
      {/* Desktop Header */}
      <div className="hidden md:block p-6">
        <h2 className="text-xl font-black text-gray-900 mb-8 px-2">마이페이지</h2>
      </div>
      
      {/* Mobile & Desktop Menu Container */}
      <div className="flex-grow overflow-x-auto md:overflow-x-visible no-scrollbar">
        <div className="flex md:flex-col p-4 md:p-6 md:space-y-8 min-w-max md:min-w-0">
          {menuGroups.map((group) => (
            <div key={group.title} className="flex md:flex-col items-center md:items-start mr-6 md:mr-0">
              <h3 className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-4">
                {group.title}
              </h3>
              <nav className="flex md:flex-col gap-1 md:gap-1">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 md:gap-3 px-4 py-2.5 md:py-3 rounded-xl text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                      activeTab === item.id
                        ? 'bg-purple-50 text-purple-600'
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-base md:text-lg ${activeTab === item.id ? 'opacity-100' : 'opacity-50'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </button>
                ))}
              </nav>
              {/* Divider for mobile between groups */}
              <div className="md:hidden h-8 w-[1px] bg-gray-100 mx-4 last:hidden" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Logout button - hidden on mobile sidebar, usually placed elsewhere or at end of scroll */}
      <div className="hidden md:block p-6 border-t border-gray-50">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all group">
          <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">🚪</span>
          로그아웃
        </button>
      </div>
    </aside>
  );
};

export default MyPageSidebar;
