import React from 'react';
import Hero from '../components/Hero';
import WeatherDetail from '../components/WeatherDetail';
import ClosingSoon from '../components/ClosingSoon';
import RandomFestival from '../components/RandomFestival';
import TopFestivalsByRegion from '../components/TopFestivalsByRegion';
import FestivalList from '../components/FestivalList';
import OngoingFestivals from '../components/OngoingFestivals';
import PopularPosts from '../components/PopularPosts';
import { notifyAchievements } from '../../../api/notificationUtils.jsx';

const Home = () => {
  // 테스트용 알림 호출 함수
  const handleTestNotification = () => {
    notifyAchievements([
      {
        ach_title: "새 옷 입기",
        ach_desc: "마이페이지에서 프로필 사진을 등록하세요.",
        exp_reward: 30,
        leveled_up: true
      }
    ]);
  };

  return (
    <div className="space-y-12 pb-20 bg-gray-50/30 relative">
      {/* 개발용 테스트 버튼 */}
      <button 
        onClick={handleTestNotification}
        className="fixed bottom-24 right-8 z-50 bg-white border-2 border-purple-500 text-purple-600 px-4 py-2 rounded-full font-black text-xs shadow-xl hover:bg-purple-500 hover:text-white transition-all transform hover:scale-110 flex items-center gap-2 group"
      >
        <span className="group-hover:animate-spin">⚙️</span>
        Test Alert
      </button>

      <Hero />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeatherDetail />
          <ClosingSoon />
          <RandomFestival />
        </div>
      </section>
      <section className="bg-white py-12 border-y border-gray-100 transition-colors duration-500 hover:bg-gray-50/30">
        <TopFestivalsByRegion />
      </section>
      <section>
        <FestivalList />
      </section>
      <section>
        <OngoingFestivals />
      </section>
      <section>
        <PopularPosts />
      </section>
    </div>
  );
};

export default Home;