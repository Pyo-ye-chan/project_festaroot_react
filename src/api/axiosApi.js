import axios from 'axios';

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