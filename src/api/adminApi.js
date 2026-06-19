import { maxios } from "./axiosApi";

export const getAdminDashboard = (baseDate) => {
  return maxios.get('/admin/dashboard', {
    params: {
      baseDate,
    },
  });
};

/**
 * [관리자] 축제 목록 조회
 */
export const getAdminFestivalList = () => {
  return maxios.get('/admin/festivals/list');
};

/**
 * [관리자] 축제 노출 여부 토글
 */
export const updateFestivalVisibility = (contentId, isVisible) => {
  const visibilityParam = isVisible ? 'Y' : 'N';
  return maxios.patch(`/admin/festivals/${contentId}/visibility`, { isVisible: visibilityParam });
};

/**
 * [관리자] 후기 목록 조회
 */
export const getAdminReviews = (params) => {
  return maxios.get('/admin/reviews/list', { params });
};

/**
 * [관리자] 후기 차단 상태 변경 (블라인드)
 */
export const updateReviewStatus = (reviewId, isDeleted) => {
  return maxios.patch(`/admin/reviews/${reviewId}/status`, { is_deleted: isDeleted });
};

/**
 * [관리자] 후기 신고 무시 (신고 수 초기화)
 */
export const dismissReviewReports = (reviewId) => {
  return maxios.post(`/admin/reviews/${reviewId}/reports/dismiss`);
};

/**
 * [관리자] 후기 영구 삭제
 */
export const deleteReview = (reviewId) => {
  return maxios.delete(`/admin/reviews/${reviewId}`);
};