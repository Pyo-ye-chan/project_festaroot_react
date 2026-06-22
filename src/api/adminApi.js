import { maxios } from "./axiosApi";

export const getAdminDashboard = (baseDate) => {
  return maxios.get('/admin/dashboard', {
    params: {
      baseDate,
    },
  });
};


const ADMIN_POST_URL = '/admin/posts';

export const getAdminPostSummary = () => {
  return maxios.get(`${ADMIN_POST_URL}/summary`);
};

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

export const getAdminPosts = ({
  page = 1,
  size = 5,
  category = 'all',
  searchType = 'title',
  keyword = '',
  visibleStatus = 'all',
} = {}) => {
  return maxios.get(ADMIN_POST_URL, {
    params: {
      page,
      size,
      category,
      searchType,
      keyword,
      visibleStatus: visibleStatus === 'all' ? '' : visibleStatus,
    },
  });
};

export const getAdminPostDetail = (postId) => {
  return maxios.get(`${ADMIN_POST_URL}/${postId}`);
};

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

export const deleteAdminPost = (postId) => {
  return maxios.delete(`${ADMIN_POST_URL}/${postId}`);
};

export const deleteAdminPosts = (postIds) => {
  return maxios.delete(`${ADMIN_POST_URL}/bulk`, {
    data: postIds,
  });
};

export const getAdminFestivalList = () => {
  return maxios.get('/admin/festivals/list');
};

export const startAdminFestivalSync = () => {
  return maxios.post('/admin/festivals/sync/start');
};

export const getAdminFestivalSyncStatus = () => {
  return maxios.get('/admin/festivals/sync/status');
};

export const updateFestivalVisibility = (contentId, isVisible) => {
  const visibilityParam = isVisible ? 'Y' : 'N';
  return maxios.patch(`/admin/festivals/${contentId}/visibility`, { isVisible: visibilityParam });
};

export const getAdminFestivalDetail = (contentId) => {
  return maxios.get(`/admin/festivals/${contentId}`);
};

export const getAdminReviews = (params) => {
  return maxios.get('/admin/reviews/list', { params });
};

export const updateReviewStatus = (reviewId, isDeleted) => {
  return maxios.patch(`/admin/reviews/${reviewId}/status`, { is_deleted: isDeleted });
};

export const dismissReviewReports = (reviewId) => {
  return maxios.post(`/admin/reviews/${reviewId}/reports/dismiss`);
};

export const deleteReview = (reviewId) => {
  return maxios.delete(`/admin/reviews/${reviewId}`);

};

const ADMIN_COMMENT_URL = '/admin/comments';

export const getAdminCommentSummary = () => {
  return maxios.get(`${ADMIN_COMMENT_URL}/summary`);
};

export const getWaitingCommentReports = ({
  page = 1,
  size = 4,
} = {}) => {
  return maxios.get(`${ADMIN_COMMENT_URL}/waiting-reports`, {
    params: {
      page,
      size,
    },
  });
};

export const getAdminComments = ({
  page = 1,
  size = 5,
  category = 'all',
  commentType = 'all',
  searchType = 'content',
  keyword = '',
  visibleStatus = 'all'
} = {}) => {
  return maxios.get(ADMIN_COMMENT_URL, {
    params: {
      page,
      size,
      category,
      commentType,
      searchType,
      keyword,
      visibleStatus,
    },
  });
};

export const getAdminCommentDetail = (commentId) => {
  return maxios.get(`${ADMIN_COMMENT_URL}/${commentId}`);
};

export const processAdminCommentReport = ({
  commentId,
  reportId,
  resultStatus,
  adminMemo = '',
}) => {
  return maxios.patch(
    `${ADMIN_COMMENT_URL}/${commentId}/reports/${reportId}`,
    {
      resultStatus,
      adminMemo,
    }
  );
};

export const deleteAdminComment = (commentId) => {
  return maxios.delete(`${ADMIN_COMMENT_URL}/${commentId}`);
};

export const deleteAdminComments = (commentIds) => {
  return maxios.delete(`${ADMIN_COMMENT_URL}/bulk`, {
    data: commentIds,
  });
};
