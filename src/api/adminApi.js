import { maxios } from "./axiosApi";

export const getAdminDashboard = () => maxios.get(`/admin/dashboard`)