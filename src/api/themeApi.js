import { maxios } from "./axiosApi";

export const getThemeList = () => maxios.get('/theme/theme');