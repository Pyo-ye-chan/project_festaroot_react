import { maxios } from "./axiosApi";

export const getFestivalDetail = async (contentId) => { 
    const resonse =  await maxios.get(`/api/festivals/detail/${contentId}`); // 축제 상세 정보 API 호출 
    return resonse.data;
};