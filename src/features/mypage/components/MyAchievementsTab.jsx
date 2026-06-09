import React, { useState, useEffect } from 'react';
import { getMemberAchievements } from '../../../api/memberApi';
import useAuthStore from '../../../store/useAuthStore';
import LoadingSpinner from '../../../components/LoadingSpinner';

const MyAchievementsTab = () => {
  const { user, isLoggedIn } = useAuthStore();
  const [achievementData, setAchievementData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!isLoggedIn || !(user?.member_id || user?.id)) {
        setIsLoading(false);
        return;
      }

      try {
        const userId = user.member_id || user.id;
        const resp = await getMemberAchievements(userId);
        console.log('Achievements Data:', resp.data);
        setAchievementData(resp.data);
      } catch (error) {
        console.error('업적 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievements();
  }, [isLoggedIn, user?.member_id, user?.id]);

  if (isLoading) {
    return (
      <div className="py-20 flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!achievementData || !achievementData.achievements || achievementData.achievements.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="text-4xl mb-4">🏆</div>
        <h2 className="text-xl font-black text-gray-800">아직 달성할 수 있는 업적이 없습니다.</h2>
        <p className="text-gray-500 mt-2 font-medium">활동을 시작하여 첫 번째 배지를 획득해 보세요!</p>
      </div>
    );
  }

  const { userGrowth, summary, achievements } = achievementData;

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Growth Dashboard */}
      <header className="space-y-6">
        <div className="px-2 sm:px-0">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">나의 업적</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 font-medium">활동을 통해 업적을 달성하고 보상을 받으세요!</p>
        </div>

        {/* Growth Stats Card */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-[32px] p-6 sm:p-8 text-white shadow-xl shadow-purple-900/20">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30">
                  🎖️
                </div>
                <div>
                  <p className="text-purple-100 text-xs font-black uppercase tracking-widest">Current Title</p>
                  <h2 className="text-2xl font-black">{userGrowth?.TITLE_NAME || '초보 여행자'}</h2>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-purple-200 text-[10px] font-bold uppercase">Level</p>
                  <p className="text-xl font-black">LV.{userGrowth?.CURRENT_LV || 1}</p>
                </div>
                <div className="h-8 w-px bg-white/20" />
                <div>
                  <p className="text-purple-200 text-[10px] font-bold uppercase">Experience</p>
                  <p className="text-xl font-black">{userGrowth?.EXP_POINT?.toLocaleString() || 0} EXP</p>
                </div>
              </div>
            </div>

            <div className="flex-grow max-w-md space-y-3">
              <div className="flex justify-between items-end">
                <p className="text-sm font-black">전체 업적 달성률</p>
                <p className="text-2xl font-black">{summary?.progressRate || 0}%</p>
              </div>
              <div className="h-3 w-full bg-white/20 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-white transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  style={{ width: `${summary?.progressRate || 0}%` }}
                />
              </div>
              <p className="text-right text-[11px] font-bold text-purple-100">
                {summary?.achievedCount || 0} / {summary?.totalCount || 0} Completed
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Achievement List */}
      <section className="space-y-6">
        <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 px-2">
          🏆 전체 업적 목록
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {achievements.map((ach, idx) => {
            const isCompleted = ach.IS_ACHIEVED === 'Y';
            const progress = ach.CURRENT_COUNT || 0;
            const goal = ach.CONDITION_COUNT || 1;
            const percent = Math.min((progress / goal) * 100, 100);

            return (
              <div 
                key={idx} 
                className={`group relative p-6 rounded-[28px] border transition-all duration-300 ${
                  isCompleted 
                  ? 'bg-white border-purple-100 shadow-sm hover:shadow-md' 
                  : 'bg-gray-50/50 border-gray-100 opacity-80'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner ${
                    isCompleted ? 'bg-purple-100 animate-in zoom-in duration-500' : 'bg-gray-100 grayscale'
                  }`}>
                    {isCompleted ? '⭐' : '🔒'}
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-wider ${
                      isCompleted ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                    {ach.ACHIEVED_DATE && (
                      <p className="mt-2 text-[10px] font-bold text-gray-400">{ach.ACHIEVED_DATE}</p>
                    )}
                  </div>
                </div>
                
                <h3 className={`text-lg font-black mb-1 ${isCompleted ? 'text-gray-800' : 'text-gray-400'}`}>
                  {ach.ACH_TITLE}
                </h3>
                <p className={`text-sm font-medium leading-relaxed mb-6 ${isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                  {ach.ACH_DESC || '활동을 통해 이 업적을 달성하세요!'}
                </p>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-[11px] font-black">
                    <span className={isCompleted ? 'text-purple-600' : 'text-gray-400'}>Progress</span>
                    <span className={isCompleted ? 'text-gray-700' : 'text-gray-400'}>{progress} / {goal}</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${isCompleted ? 'bg-purple-600' : 'bg-gray-300'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MyAchievementsTab;
