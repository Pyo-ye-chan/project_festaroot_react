import { maxios } from './axiosApi';

export const login = (formData) => maxios.post('/auth/login', formData);
export const socialLogin = (socialData) => maxios.post('/auth/social', socialData);


// 회원가입 페이지에서 사용할 활성 약관 조회
export const getActiveTerms = async () => {
  const response = await maxios.get(`/api/terms`);
  return response.data;
};
