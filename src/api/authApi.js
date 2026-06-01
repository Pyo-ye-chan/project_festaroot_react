import { maxios } from './axiosApi';

export const login = (formData) => maxios.post('/auth/login', formData);
export const socialLogin = (socialData) => maxios.post('/auth/social', socialData);
