import axios from 'axios';

export const maxios = axios.create({
  // env 파일에 있는 주소를 쓰고, 만약 없으면(초기값) localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost'
});


// 모든 요청이 서버로 출발하기 직전에 작동하는 인터셉터
maxios.interceptors.request.use(
  (config) => {
    // 로컬 스토리지의 Key accessToken
    const token = localStorage.getItem('accessToken');

    // 토큰이 존재한다면 헤더에 실어줍니다.
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // 요청 에러가 발생했을 때 처리
    return Promise.reject(error);
  }
);