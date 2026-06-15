import { maxios } from './axiosApi';

/**
 * 읽지 않은 알림 목록 조회
 */
export const getUnreadNotifications = () => {
  return maxios.get('/notifications/unread');
};

/**
 * 알림 읽음 처리 (필요시 구현)
 */
export const markAsRead = (notificationId) => {
  return maxios.post(`/notifications/${notificationId}/read`);
};

/**
 * 모든 알림 읽음 처리 (필요시 구현)
 */
export const markAllAsRead = () => {
  return maxios.post('/notifications/read-all');
};
