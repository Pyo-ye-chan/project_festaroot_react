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
};