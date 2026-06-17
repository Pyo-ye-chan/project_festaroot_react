import { maxios } from "./axiosApi";

export const getAdminDashboard = (baseDate) => {
  return maxios.get('/admin/dashboard', {
    params: {
      baseDate,
    },
  });
};