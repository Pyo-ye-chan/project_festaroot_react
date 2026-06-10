import React, { useEffect } from 'react';
import Hero from '../components/Hero';
import WeatherDetail from '../components/WeatherDetail';
import ClosingSoon from '../components/ClosingSoon';
import RandomFestival from '../components/RandomFestival';
import TopFestivalsByRegion from '../components/TopFestivalsByRegion';
import FestivalList from '../components/FestivalList';
import OngoingFestivals from '../components/OngoingFestivals';
import PopularPosts from '../components/PopularPosts';
import { notifyAchievements } from '../../../api/notificationUtils.jsx';
import useAuthStore from '../../../store/useAuthStore';
import { maxios } from '../../../api/axiosApi';

const Home = () => {
  const { isLoggedIn, user } = useAuthStore();

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

  // 자동 출석 체크 로직
  useEffect(() => {
    const checkAttendance = async () => {
      // 1. 로그인 상태인지 확인
      if (!isLoggedIn || !user) return;

      const memberId = user.member_id || user.id;
      if (!memberId) return;

      // 2. 오늘 이미 출석 체크를 했는지 로컬 스토리지 확인 (중복 요청 방지)
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const lastCheck = localStorage.getItem(`attendance_${memberId}`);

      if (lastCheck === today) {
        console.log('이미 오늘 출석 체크를 완료했습니다.');
        return;
      }

      try {
        // 3. 백엔드 출석 API 호출 (엔드포인트는 설계하신 대로 /member/attendance 가정)
        // 응답에 업적이 있다면 인터셉터가 자동으로 알림을 띄워줍니다.
        await maxios.post(`/member/attendance/${memberId}`);
        
        // 4. 호출 성공 시 로컬 스토리지 업데이트
        localStorage.setItem(`attendance_${memberId}`, today);
      } catch (error) {
        // 이미 오늘 출석했다는 에러(400 등)가 올 경우에도 로컬 스토리지를 업데이트하여 재요청 방지
        if (error.response && error.response.status === 400) {
          localStorage.setItem(`attendance_${memberId}`, today);
        }
        console.error('출석 체크 중 오류 발생:', error);
      }
    };

    checkAttendance();
  }, [isLoggedIn, user]);

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