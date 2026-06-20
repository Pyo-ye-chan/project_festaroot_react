import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { getPosts } from '../../../api/boardApi';

const Home = () => {
  const { isLoggedIn, user } = useAuthStore();
  const [latestNotice, setLatestNotice] = useState(null);
  const [activeRegion, setActiveRegion] = useState('서울');

  // 최신 공지사항 조회
  useEffect(() => {
    const fetchLatestNotice = async () => {
      try {
        const response = await getPosts(1, 'notice', 'latest', 'title', '');
        const list = response.data?.list || [];
        if (list.length > 0) {
          setLatestNotice(list[0]);
        }
      } catch (error) {
        console.error('Failed to fetch latest notice:', error);
      }
    };
    fetchLatestNotice();
  }, []);

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
      {/* <button 
        onClick={handleTestNotification}
        className="fixed bottom-24 right-8 z-50 bg-white border-2 border-purple-500 text-purple-600 px-4 py-2 rounded-full font-black text-xs shadow-xl hover:bg-purple-500 hover:text-white transition-all transform hover:scale-110 flex items-center gap-2 group"
      >
        <span className="group-hover:animate-spin">⚙️</span>
        Test Alert
      </button> */}

      <Hero />

      {latestNotice && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
          <Link
            to={`/community/post/${latestNotice.post_id || latestNotice.id}`}
            className="flex items-center justify-between bg-white border border-purple-100 rounded-3xl px-6 py-4 shadow-sm hover:shadow-md hover:border-purple-200 transition-all duration-300 group cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex items-center justify-center h-8 w-8 rounded-2xl bg-purple-50 text-purple-600 shrink-0 font-bold text-sm">
                📢
              </span>
              <span className="text-xs font-black text-purple-600 bg-purple-50 px-2.5 py-1 rounded-xl shrink-0">
                공지사항
              </span>
              <span className="text-sm font-bold text-gray-800 truncate group-hover:text-purple-600 transition-colors">
                {latestNotice.title}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-black text-purple-500/70 group-hover:text-purple-600 transition-colors shrink-0">
              <span>자세히 보기</span>
              <span>&rarr;</span>
            </div>
          </Link>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WeatherDetail activeRegion={activeRegion} />
          <ClosingSoon />
          <RandomFestival />
        </div>
      </section>
      <section className="bg-white py-12 border-y border-gray-100 transition-colors duration-500 hover:bg-gray-50/30">
        <TopFestivalsByRegion activeRegion={activeRegion} setActiveRegion={setActiveRegion} />
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