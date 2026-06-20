import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import NotificationDropdown from './notifications/NotificationDropdown';
import { getUnreadNotifications } from '../api/notificationApi';
import { DEFAULT_IMAGES } from '../constants/DefaultImages';
import { getMemberProfile } from '../api/memberApi';
import useRegionStore from '../store/useRegionStore';
import WeatherApi from '../api/weatherApi'; // 날씨 API 임포트

const Header = () => {
  const { currentRegion: region, setCurrentRegion: setRegion } = useRegionStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isLoggedIn, logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [isWeatherDropdownOpen, setIsWeatherDropdownOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  const [headerWeather, setHeaderWeather] = useState({ icon: '☀️', temp: 24 });

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);

  // 헤더 상단 미니 날씨 가져오기 Effect
  useEffect(() => {
    const fetchHeaderWeather = async () => {
      try {
        if (region) {
          const data = await WeatherApi.todayWeather(region);
          if (data) {
            setHeaderWeather({
              icon: data.icon || '☀️',
              temp: data.temp ?? 24
            });
          }
        }
      } catch (error) {
        console.error("헤더 날씨 수신 실패:", error);
      }
    };
    fetchHeaderWeather();
  }, [region]); // 전역 지역(region)이 변경될 때마다 헤더 날씨도 실시간 동기화 호출

  const formatTime = (dateString) => {
    if (!dateString) return '방금 전';
    const now = new Date();
    const past = new Date(dateString);
    const diffInMs = now - past;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMins / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMins < 1) return '방금 전';
    if (diffInMins < 60) return `${diffInMins}분 전`;
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    if (diffInDays < 7) return `${diffInDays}일 전`;
    return past.toLocaleDateString();
  };

  const fetchNotifications = async () => {
    if (!isLoggedIn) return;
    try {
      const response = await getUnreadNotifications();
      const mappedData = response.data.map(n => {
        const activityMap = {
          ACHIEVEMENT: { label: '업적 달성', icon: '🏆', color: 'bg-orange-50 text-orange-600' },
          LIKE: { label: '좋아요 알림', icon: '❤️', color: 'bg-rose-50 text-rose-600' },
          ATTENDANCE: { label: '출석 체크', icon: '📅', color: 'bg-blue-50 text-blue-600' },
          POST: { label: '게시글 작성', icon: '✍️', color: 'bg-green-50 text-green-600' },
          COMMENT: { label: '댓글 작성', icon: '💬', color: 'bg-yellow-50 text-yellow-600' },
          LEVEL_UP: { label: '레벨업 달성', icon: '⭐', color: 'bg-indigo-50 text-indigo-600' }
        };

        const info = activityMap[n.noti_type] || { label: '알림', icon: '🔔', color: 'bg-gray-50 text-gray-600' };

        let exp = null;
        const expMatch = n.content ? n.content.match(/\((\d+)\)/) : null;
        if (expMatch) exp = expMatch[1];

        return {
          id: n.noti_id,
          type: n.noti_type,
          title: `${info.label} 완료!`,
          desc: n.content,
          exp: exp,
          time: formatTime(n.created_at),
          isRead: n.is_read === 'Y',
          icon: info.icon,
          color: info.color
        };
      });
      setNotifications(mappedData);
    } catch (error) {
      console.error('알림을 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isLoggedIn]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const primaryPurple = '#6B46FE';
  const regions = [
    '서울', '경기', '인천', '강원', '충북', '충남', '대전', '세종',
    '경북', '경남', '대구', '울산', '부산', '전북', '전남', '광주', '제주'
  ];

  const navItems = [
    { name: '홈', href: '/' },
    { name: '축제 찾기', href: '/search' },
    { name: '지도', href: '/festival/map' },
    { name: '커뮤니티', href: '/community' },
    { name: 'AI 여행플래너', href: '/ai-planner' },
    { name: '마이페이지', href: '/mypage' },
  ];

  const currentUserId = user?.member_id || user?.id;

  useEffect(() => {
    const fetchHeaderProfile = async () => {
      if (isLoggedIn && currentUserId) {
        try {
          const resp = await getMemberProfile(currentUserId);
          const imgUrl = resp.data?.member?.profile_image_url || resp.data?.profile_image_url || resp.data?.data?.profile_image_url;
          setProfileImageUrl(imgUrl);
        } catch (error) {
          console.error('헤더 프로필 이미지 로드 실패:', error);
        }
      } else {
        setProfileImageUrl(null);
      }
    };
    fetchHeaderProfile();
  }, [isLoggedIn, user, currentUserId]);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      logout();
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWeatherDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105" style={{ backgroundColor: primaryPurple }}>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="text-xl sm:text-2xl font-black tracking-tight" style={{ color: primaryPurple }}>축제로</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative" ref={notificationRef}>
              <NotificationDropdown
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                notifications={notifications}
              />
            </div>

            <button
              onClick={handleLoginLogout}
              className="group flex items-center gap-0 hover:gap-2 p-1 bg-white border border-gray-200 rounded-full hover:shadow-md transition-all duration-300 overflow-hidden"
              title={isLoggedIn ? '로그아웃' : '로그인'}
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 flex items-center justify-center">
                {isLoggedIn ? (
                  <img
                    src={profileImageUrl || DEFAULT_IMAGES.PROFILE}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = DEFAULT_IMAGES.PROFILE;
                    }}
                  />
                ) : (
                  <User className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <span className="max-w-0 group-hover:max-w-[80px] opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap text-sm font-bold text-gray-700 overflow-hidden pr-0 group-hover:pr-3">
                {isLoggedIn ? '로그아웃' : '로그인'}
              </span>
            </button>

            <button
              className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      <nav className="hidden md:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
          <ul className="flex gap-10">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.href}
                  className="block py-4 text-[16px] font-bold text-gray-600 hover:text-purple-600 transition-colors border-b-2 border-transparent hover:border-purple-600"
                  style={{ '--hover-color': primaryPurple }}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 py-3 relative" ref={dropdownRef}>
            <div className="flex items-center bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100 gap-2 cursor-pointer hover:bg-blue-100 transition-colors"
              onClick={() => setIsWeatherDropdownOpen(!isWeatherDropdownOpen)}>
              <span className="text-sm font-bold text-blue-700">{region}</span>
              <svg className={`w-4 h-4 text-blue-400 transition-transform duration-300 ${isWeatherDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
              <div className="flex items-center gap-1 text-blue-500">
                <span className="text-lg">{headerWeather.icon}</span>
                <span className="text-sm font-black">{headerWeather.temp}°C</span>
              </div>
            </div>

            <div className={`absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden transition-all duration-300 origin-top-right
                            ${isWeatherDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
              <div className="grid grid-cols-3 gap-1 p-2">
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRegion(r);
                      setIsWeatherDropdownOpen(false);
                    }}
                    className={`px-2 py-2 text-xs font-bold rounded-xl transition-colors ${region === r ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl py-6 px-4 space-y-6 animate-in slide-in-from-top duration-300">
          <ul className="grid grid-cols-2 gap-3">
            {navItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className="flex items-center justify-center p-4 bg-gray-50 rounded-xl text-sm font-bold text-gray-700 active:bg-purple-50 active:text-purple-600 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-bold text-gray-500">현재 지역 날씨</span>
              <div className="flex items-center gap-3">
                <select
                  className="text-sm font-bold text-gray-700 bg-gray-100 px-3 py-2 rounded-lg border-none outline-none"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                >
                  {regions.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
                <div className="flex items-center gap-1 text-blue-500 font-black">
                  <span>{headerWeather.icon}</span>
                  <span>{headerWeather.temp}°</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;