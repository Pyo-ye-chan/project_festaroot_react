import { maxios } from "./axiosApi";

export const getSidoList = () => maxios.get('/region/sido');
export const getSigunguList = (regionCode) => maxios.get('/region/sigungu', {params: {regionCode}});