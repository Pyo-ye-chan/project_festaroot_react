import React from 'react';

const MyProfileTab = ({ user }) => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">내 프로필</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">활동 내역과 프로필 정보를 확인하세요.</p>
      </header>

      {/* Profile Card */}
      <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-6 sm:gap-10">
        <div className="relative">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-purple-100 overflow-hidden border-4 border-white shadow-lg">
            <img src={user.profileImg} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 bg-purple-600 text-white w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black border-4 border-white shadow-md text-xs sm:text-sm">
            {user.level}
          </div>
        </div>
        
        <div className="flex-grow text-center md:text-left space-y-4 w-full">
          <div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3 mb-1 sm:mb-2">
              <h2 className="text-xl sm:text-2xl font-black text-gray-800">
                {user.nickname}
              </h2>
              <span className="inline-flex items-center px-2.5 py-0.5 sm:px-3 sm:py-1 bg-yellow-100 text-yellow-700 text-[10px] sm:text-xs font-bold rounded-full border border-yellow-200">
                ✨ {user.rank}
              </span>
            </div>
            <p className="text-sm sm:text-base text-gray-500 font-medium">{user.email}</p>
          </div>

          {/* EXP Bar */}
          <div className="w-full max-w-md mx-auto md:mx-0 space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-[10px] sm:text-[11px] font-black uppercase tracking-wider">
              <span className="text-purple-600">Experience</span>
              <span className="text-gray-400">{user.currentExp} / {user.nextLevelExp}</span>
            </div>
            <div className="h-2 sm:h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-50 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-purple-700 transition-all duration-1000 ease-out"
                style={{ width: `${(user.currentExp / user.nextLevelExp) * 100}%` }}
              />
            </div>
            <p className="text-[9px] sm:text-[10px] text-gray-400 font-bold">다음 레벨까지 {user.nextLevelExp - user.currentExp} EXP 남았습니다.</p>
          </div>

          <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-4 pt-2">
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 font-bold bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
              <span>📅</span>
              가입일: {user.joinDate}
            </div>
            </div>

            {/* Interests Section */}
            <div className="pt-2 space-y-3">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-md uppercase tracking-wider">나의 관심지역</span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.regions.map(region => (
                  <span key={region} className="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-sm hover:border-purple-300 transition-colors">
                    📍 {region}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md uppercase tracking-wider">나의 관심테마</span>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.themes.map(theme => (
                  <span key={theme} className="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-sm hover:border-indigo-300 transition-colors">
                    ✨ {theme}
                  </span>
                ))}
              </div>
            </div>
            </div>
            </div>

            <button className="w-full md:w-auto px-6 py-3 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200">
          프로필 수정
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {[
          { label: '작성글', value: user.stats.posts, color: 'text-blue-600', bg: 'bg-blue-50', icon: '📝' },
          { label: '댓글', value: user.stats.comments, color: 'text-purple-600', bg: 'bg-purple-50', icon: '💬' },
          { label: '찜한 축제', value: user.stats.likes, color: 'text-rose-600', bg: 'bg-rose-50', icon: '❤️' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex sm:flex-col items-center sm:items-start gap-4 sm:gap-0">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-xl flex items-center justify-center text-xl sm:text-2xl sm:mb-4 shrink-0`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-gray-400 sm:mb-1">{stat.label}</p>
              <p className={`text-2xl sm:text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <section className="bg-white p-6 sm:p-8 md:p-10 rounded-[24px] border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            최근 활동 내역
          </h3>
          <button className="text-xs sm:text-sm font-bold text-purple-600 hover:underline transition-all">전체보기</button>
        </div>
        
        <div className="space-y-4 text-center py-12 sm:py-16">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl sm:text-3xl opacity-20">📂</span>
          </div>
          <p className="text-gray-400 font-bold text-base sm:text-lg">아직 활동 내역이 없습니다.</p>
          <p className="text-gray-400 text-xs sm:text-sm">축제를 탐색하고 소통을 시작해보세요!</p>
          <button className="mt-6 px-6 sm:px-8 py-2.5 sm:py-3 bg-purple-600 text-white text-sm sm:text-base font-bold rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100">
            축제 보러가기
          </button>
        </div>
      </section>
    </div>
  );
};

export default MyProfileTab;
