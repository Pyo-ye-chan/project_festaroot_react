import { maxios } from './axiosApi';

export const login = (formData) => maxios.post('/auth/login', formData);
