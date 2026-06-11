import { maxios } from './axiosApi';

const BASE_PATH = '/api/gathering';

const gatheringApi = {

    // 모임 생성
    createGathering: async (gatheringData) => {
        const response = await maxios.post(BASE_PATH, gatheringData)
        return response.data;
    },
    
}

export default gatheringApi;