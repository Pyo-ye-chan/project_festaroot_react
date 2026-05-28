import { maxios } from './axiosApi';

export const signup = (formData) => maxios.post('/member/signup', formData);