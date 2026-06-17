import React from 'react';

const UserContextAnalysis = ({ userContext, isLoadingContext, isRegionsOpen, setIsRegionsOpen, isThemesOpen, setIsThemesOpen, isLikesOpen, setIsLikesOpen }) => {
  return (
    <aside className="lg:col-span-1 space-y-6">
      <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 sticky top-24">
        <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">🧠</span> 분석 데이터 소스
        </h3>

        <div className="space-y-6">
          <div>
            <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3">
              사용자 프로필
            </p>
            <div className="flex gap-2">
              <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                {userContext.profile.age} {userContext.profile.gender}
              </span>
            </div>
          </div>

          <div>
            <button
              onClick={() => setIsRegionsOpen(!isRegionsOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-purple-600 uppercase tracking-wider mb-3 group"
            >
              <span>📍 관심 지역</span>
              <span className={`transition-transform duration-300 ${isRegionsOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isRegionsOpen && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {userContext.interests.regions.length > 0 ? (
                  userContext.interests.regions.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">
                    설정된 관심 지역이 없습니다.
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsThemesOpen(!isThemesOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-purple-600 uppercase tracking-wider mb-3 group"
            >
              <span>🎨 관심 테마</span>
              <span className={`transition-transform duration-300 ${isThemesOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isThemesOpen && (
              <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {userContext.interests.themes.length > 0 ? (
                  userContext.interests.themes.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100"
                    >
                      #{tag}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">
                    설정된 관심 테마가 없습니다.
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              onClick={() => setIsLikesOpen(!isLikesOpen)}
              className="w-full flex items-center justify-between text-xs font-black text-purple-600 uppercase tracking-wider mb-3 group"
            >
              <span>❤️ 찜한 축제</span>
              <span className={`transition-transform duration-300 ${isLikesOpen ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {isLikesOpen && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                {userContext.likedFestivals.length > 0 ? (
                  userContext.likedFestivals.map((festival) => (
                    <div
                      key={festival.CONTENT_ID}
                      className="p-2.5 bg-pink-50/50 text-pink-700 text-[11px] font-bold rounded-xl border border-pink-100 flex items-center gap-2 transition-colors hover:bg-pink-50"
                    >
                      <span className="shrink-0">🎡</span>
                      <span className="truncate">{festival.TITLE}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-[11px] text-gray-400 font-medium">
                    찜한 축제가 없습니다.
                  </span>
                )}
              </div>
            )}
          </div>

          {userContext.recentHistory.length > 0 && (
            <div>
              <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3">
                최근 활동 내역
              </p>

              <div className="space-y-2">
                {userContext.recentHistory.slice(0, 3).map((history, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-gray-100"
                  >
                    <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">
                      {history.title}
                    </span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${history.type === '조회'
                        ? 'bg-blue-100 text-blue-600'
                        : history.type === '검색'
                          ? 'bg-amber-100 text-amber-600'
                          : history.type === '지도'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                    >
                      {history.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-6 border-t border-gray-50">
            <p className="text-sm text-gray-400 font-medium leading-relaxed">
              {isLoadingContext
                ? '사용자 데이터를 분석하고 있습니다...'
                : '사용자의 최근 활동 로그 및 프로필을 기반으로 맞춤 축제와 코스를 추천합니다.'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserContextAnalysis;