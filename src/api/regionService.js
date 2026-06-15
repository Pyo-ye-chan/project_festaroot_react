import { maxios } from "./axiosApi";

const RegionService = {

    //
    regionList: async () => {
        const region = await maxios.get(`/api/festivals/sido`);
        return region.data;
    },

    sigunguList: async (region_code) => {
        const sigungu = await maxios.get(`/api/festivals/sigungu`, { params: { region_code } });
        return sigungu.data;
    }

}

export default RegionService;