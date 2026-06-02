import axios from 'axios';

export const maxios = axios.create({
  // env 파일에 있는 주소를 쓰고, 만약 없으면(초기값) localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost'
});