import axios from 'axios';
import { notifyAchievements } from './notificationUtils.jsx';

export const maxios = axios.create({
  // env 파일에 있는 주소를 쓰고, 만약 없으면(초기값) localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost'
});

// 요청 인터셉터 추가
maxios.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 토큰을 가져옵니다.
    const token = localStorage.getItem('accessToken');

    // 토큰이 존재한다면 헤더에 담습니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
maxios.interceptors.response.use(
  (response) => {
    // 요청 설정에 skipAchievementNotification 플래그가 있으면 알림을 띄우지 않음
    if (response.config && response.config.skipAchievementNotification) {
      return response;
    }

    // 백엔드 응답 데이터 구조에 따라 업적 정보가 있는지 확인
    if (response.data && response.data.achievements && Array.isArray(response.data.achievements)) {
      notifyAchievements(response.data.achievements);
    }
    return response;


  },
  (error) => {
    // // 응답에서 토큰 만료 처리
    // const status = error.response?.status;

    // if (status === 401) {
    //   localStorage.removeItem("accessToken");
    //   localStorage.removeItem("user");

    //   alert("로그인이 만료되었습니다. 다시 로그인해주세요.");

    //   window.location.href = "/login";
    // }
    return Promise.reject(error);
  }
);

