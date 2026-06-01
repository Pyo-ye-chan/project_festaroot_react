import React from 'react';

const MyAchievementsTab = () => {
  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">나의 업적</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">활동을 통해 업적을 달성하고 보상을 받으세요!</p>
      </header>

      <div className="grid grid-cols-1 gap-8 sm:gap-10">
        {[
          {
            category: '🤝 모임 & 소통',
            achievements: [
              { id: 101, title: '혼자가 아니야', desc: '새로운 여행 모임에 1번 가입하세요.', reward: 30, progress: 1, condition: 1, completed: true },
              { id: 102, title: '인맥왕의 서막', desc: '여행 모임에 총 5번 가입하세요.', reward: 100, progress: 2, condition: 5, completed: false },
              { id: 301, title: '따뜻한 한마디', desc: '게시글에 첫 댓글을 달아보세요.', reward: 20, progress: 1, condition: 1, completed: true },
              { id: 302, title: '친절한 이웃', desc: '게시글에 댓글을 50개 달아보세요.', reward: 150, progress: 12, condition: 50, completed: false },
              { id: 303, title: '소통의 마스터', desc: '게시글에 댓글을 100개 달아보세요.', reward: 300, progress: 12, condition: 100, completed: false },
            ]
          },
          {
            category: '✍️ 콘텐츠 & 후기',
            achievements: [
              { id: 201, title: '소중한 기록', desc: '커뮤니티에 게시글을 1개 작성하세요.', reward: 30, progress: 1, condition: 1, completed: true },
              { id: 202, title: '이야기 보따리', desc: '커뮤니티에 게시글을 50개 작성하세요.', reward: 250, progress: 5, condition: 50, completed: false },
              { id: 203, title: '커뮤니티 네임드', desc: '커뮤니티에 게시글을 100개 작성하세요.', reward: 400, progress: 5, condition: 100, completed: false },
              { id: 901, title: '솔직 담백 리뷰어', desc: '축제 후기 글을 1개 작성하세요.', reward: 40, progress: 1, condition: 1, completed: true },
              { id: 902, title: '신뢰받는 발자국', desc: '축제 후기 글을 총 50개 작성하세요.', reward: 300, progress: 0, condition: 50, completed: false },
              { id: 903, title: '베테랑 트래블 가이드', desc: '축제 후기 글을 총 100개 작성하세요.', reward: 500, progress: 0, condition: 100, completed: false },
              { id: 501, title: '오 대단한데?', desc: '좋아요를 총 10번 받으세요.', reward: 50, progress: 8, condition: 10, completed: false },
              { id: 502, title: '슈퍼 스타', desc: '좋아요를 총 100번 받으세요.', reward: 350, progress: 8, condition: 100, completed: false },
            ]
          },
          {
            category: '🤖 AI & 스마트 기능',
            achievements: [
              { id: 401, title: '스마트한 여행자', desc: 'AI 코스를 1번 생성하세요.', reward: 50, progress: 1, condition: 1, completed: true },
              { id: 402, title: 'AI의 조수', desc: 'AI 코스를 총 10번 생성하세요.', reward: 200, progress: 3, condition: 10, completed: false },
              { id: 403, title: '내 마음속에 저장', desc: 'AI 일정을 1번 저장하세요.', reward: 30, progress: 0, condition: 1, completed: false },
              { id: 801, title: '어디로 갈까?', desc: '랜덤 뽑기를 1번 이용하세요.', reward: 20, progress: 1, condition: 1, completed: true },
              { id: 802, title: '운명에 맡긴 여행', desc: '랜덤 뽑기를 총 10번 이용하세요.', reward: 80, progress: 4, condition: 10, completed: false },
            ]
          },
          {
            category: '🎁 프로필 & 수집',
            achievements: [
              { id: 601, title: '새 옷 입기', desc: '프로필 사진을 등록하세요.', reward: 30, progress: 1, condition: 1, completed: true },
              { id: 701, title: '가보고 싶다', desc: '축제를 1번 찜해보세요.', reward: 20, progress: 1, condition: 1, completed: true },
              { id: 702, title: '축제 콜렉터', desc: '축제를 총 30번 찜해보세요.', reward: 100, progress: 15, condition: 30, completed: false },
            ]
          },
          {
            category: '👑 마스터 업적',
            achievements: [
              { id: 999, title: '전설의 인디아나 존스', desc: '모든 업적을 클리어하세요.', reward: 500, progress: 8, condition: 19, completed: false },
            ]
          }
        ].map((group) => (
          <section key={group.category} className="space-y-4 sm:space-y-6">
            <h2 className="text-lg sm:text-xl font-black text-gray-800 flex items-center gap-2 px-2">
              {group.category}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
              {group.achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`group relative p-4 sm:p-6 rounded-[20px] sm:rounded-[24px] border transition-all duration-300 ${
                    ach.completed 
                    ? 'bg-white border-purple-100 shadow-sm hover:shadow-md' 
                    : 'bg-gray-50/50 border-gray-100 opacity-80'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3 sm:mb-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shadow-inner ${
                      ach.completed ? 'bg-purple-100' : 'bg-gray-100 grayscale'
                    }`}>
                      {ach.completed ? '⭐' : '🔒'}
                    </div>
                    <div className="text-right">
                      <span className={`text-[8px] sm:text-[10px] font-black px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full uppercase tracking-wider ${
                        ach.completed ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {ach.completed ? 'Done' : 'Ing'}
                      </span>
                      <p className="mt-1 sm:mt-2 text-[10px] sm:text-xs font-bold text-purple-600">+{ach.reward} EXP</p>
                    </div>
                  </div>
                  
                  <h3 className={`text-base sm:text-lg font-black mb-0.5 sm:mb-1 ${ach.completed ? 'text-gray-800' : 'text-gray-400'}`}>
                    {ach.title}
                  </h3>
                  <p className={`text-xs sm:text-sm font-medium leading-relaxed mb-4 sm:mb-6 ${ach.completed ? 'text-gray-500' : 'text-gray-400'}`}>
                    {ach.desc}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 sm:space-y-2">
                    <div className="flex justify-between text-[10px] sm:text-[11px] font-black">
                      <span className={ach.completed ? 'text-purple-600' : 'text-gray-400'}>Progress</span>
                      <span className={ach.completed ? 'text-gray-700' : 'text-gray-400'}>{ach.progress} / {ach.condition}</span>
                    </div>
                    <div className="h-1.5 sm:h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-1000 ${ach.completed ? 'bg-purple-600' : 'bg-gray-300'}`}
                        style={{ width: `${(ach.progress / ach.condition) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default MyAchievementsTab;
