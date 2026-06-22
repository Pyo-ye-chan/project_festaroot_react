import { maxios } from './axiosApi';

// 이 파일에서 사용할 공통 서브 경로
const BASE_PATH = '/api/weather';

const WeatherApi = {

    todayWeather: async (activeRegion) => {
        try {
            const response = await maxios.get(`${BASE_PATH}`, {
                params: { region: activeRegion }
            })
            return response.data
        } catch (error) {
            console.error('Error fetching festivals:', error);
            throw error;
        }
    }


}

export default WeatherApi;


