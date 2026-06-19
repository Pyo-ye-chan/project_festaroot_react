import { maxios } from "./axiosApi";

export const getAdminDashboard = (baseDate) => {
  return maxios.get('/admin/dashboard', {
    params: {
      baseDate,
    },
  });
};


const ADMIN_POST_URL = '/admin/posts';

/**
 * 게시판 관리자 상단 통계
 *
 * 응답 예시:
 * {
 *   total: 20,
 *   today: 3,
 *   reportedPostCount: 5,
 *   pendingReportCount: 7
 * }
 */
export const getAdminPostSummary = () => {
  return maxios.get(`${ADMIN_POST_URL}/summary`);
};

/**
 * 처리 대기 신고 목록
 *
 * GET /admin/posts/waiting-reports?page=1&size=4
 */
export const getWaitingPostReports = ({
  page = 1,
  size = 4,
} = {}) => {
  return maxios.get(`${ADMIN_POST_URL}/waiting-reports`, {
    params: {
      page,
      size,
    },
  });
};

/**
 * 전체 게시글 목록
 *
 * GET /admin/posts
 * ?page=1
 * &size=5
 * &category=all
 * &searchType=title
 * &keyword=축제
 */
export const getAdminPosts = ({
  page = 1,
  size = 5,
  category = 'all',
  searchType = 'title',
  keyword = '',
} = {}) => {
  return maxios.get(ADMIN_POST_URL, {
    params: {
      page,
      size,
      category,
      searchType,
      keyword,
    },
  });
};

/**
 * 게시글 상세
 *
 * GET /admin/posts/{postId}
 */
export const getAdminPostDetail = (postId) => {
  return maxios.get(`${ADMIN_POST_URL}/${postId}`);
};

/**
 * 신고 한 건 인정 또는 반려
 *
 * PATCH /admin/posts/{postId}/reports/{reportId}
 *
 * resultStatus:
 * - ACCEPTED
 * - REJECTED
 */
export const processAdminPostReport = ({
  postId,
  reportId,
  resultStatus,
  adminMemo = '',
}) => {
  return maxios.patch(
    `${ADMIN_POST_URL}/${postId}/reports/${reportId}`,
    {
      resultStatus,
      adminMemo,
    }
  );
};

/**
 * 게시글 한 건 완전 삭제
 *
 * DELETE /admin/posts/{postId}
 */
export const deleteAdminPost = (postId) => {
  return maxios.delete(`${ADMIN_POST_URL}/${postId}`);
};

/**
 * 게시글 여러 건 완전 삭제
 *
 * DELETE /admin/posts/bulk
 *
 * 요청 body:
 * [1, 3, 5]
 */
export const deleteAdminPosts = (postIds) => {
  return maxios.delete(`${ADMIN_POST_URL}/bulk`, {
    data: postIds,
  });
}

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

