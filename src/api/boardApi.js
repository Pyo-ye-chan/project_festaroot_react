import { maxios } from './axiosApi';

const cloneFormDataWithJsonKey = (sourceFormData, jsonKey, asJsonBlob = false) => {
  const nextFormData = new FormData();
  const jsonValue = sourceFormData.get('post') ?? sourceFormData.get('dto') ?? sourceFormData.get('postData');

  if (jsonValue != null) {
    if (asJsonBlob) {
      nextFormData.append(
        jsonKey,
        new Blob([String(jsonValue)], {
          type: 'application/json',
        })
      );
    } else {
      nextFormData.append(jsonKey, jsonValue);
    }
  }

  for (const [key, value] of sourceFormData.entries()) {
    if (key === 'post' || key === 'dto' || key === 'postData') {
      continue;
    }

    nextFormData.append(key, value);
  }

  return nextFormData;
};

export const uploadImage = async (file, folder = '/board/image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  console.log('Uploading image:', file);

  const response = await maxios.post(`/storage/board/image`, formData);
  return response.data;
};

export const addPost = async (data) => maxios.post('/board/post', data);

export const getPosts = async (cpage = 1, category = 'all', sortBy = 'latest', searchType = 'title', keyword = '') => {
  return await maxios.get(`/board/posts`, {
    params: {
      cpage,
      category,
      sortBy,
      searchType,
      keyword,
    },
  });
};

export const getPostDetail = async (id) => await maxios.get(`/board/post/${id}`);

export const updatePost = async (id, data) => {
  console.log('updatePost request:', id, data);

  const requestUrl = `/board/post/${id}`;

  try {
    return await maxios.put(requestUrl, data);
  } catch (error) {
    console.error('updatePost primary error response:', error.response?.data);

    if (!(data instanceof FormData) || error.response?.status !== 400) {
      throw error;
    }

    const fallbackStrategies = [
      { key: 'dto', asJsonBlob: false },
      { key: 'postData', asJsonBlob: false },
      { key: 'post', asJsonBlob: true },
      { key: 'dto', asJsonBlob: true },
      { key: 'postData', asJsonBlob: true },
    ];

    for (const { key, asJsonBlob } of fallbackStrategies) {
      const fallbackFormData = cloneFormDataWithJsonKey(data, key, asJsonBlob);

      for (const [key, value] of fallbackFormData.entries()) {
        console.log(
          `updatePost fallback(${asJsonBlob ? 'blob' : 'text'}:${key}) formData:`,
          key,
          value
        );
      }

      try {
        return await maxios.put(requestUrl, fallbackFormData);
      } catch (fallbackError) {
        console.error(
          `updatePost fallback(${asJsonBlob ? 'blob' : 'text'}:${key}) error response:`,
          fallbackError.response?.data
        );

        const isLastFallback =
          key === 'postData' && asJsonBlob;

        if (fallbackError.response?.status !== 400 || isLastFallback) {
          throw fallbackError;
        }
      }
    }

    throw error;
  }
};

export const deletePost = async (id) => await maxios.delete(`/board/post/${id}`);

export const getMyPost = async (id) => await maxios.get(`/board/mypost/${id}`);

// 댓글 목록 조회
export const getComments = async (postId) =>
  await maxios.get(`/board/posts/${postId}/comments`);

// 댓글 작성
export const addComment = async (postId, content, parentCommentId = null) =>
  await maxios.post(`/board/posts/${postId}/comments`, {
    content,
    parent_comment_id: parentCommentId,
  });

// 댓글 수정
export const updateComment = async (commentId, content) =>
  await maxios.put(`/board/comments/${commentId}`, {
    content,
  });

// 댓글 삭제
export const deleteComment = async (commentId) =>
  await maxios.delete(`/board/comments/${commentId}`);

// 게시글 좋아요 토글
export const togglePostLike = async (postId) =>
  await maxios.post(`/board/posts/${postId}/like`);

// 게시글 좋아요 상태 조회
export const getPostLikeStatus = async (postId) =>
  await maxios.get(`/board/posts/${postId}/like`);

// 게시글 신고
export const reportPost = async (postId, reason) =>
  await maxios.post(`/board/posts/${postId}/report`, {
    reason,
  });

// 댓글 / 대댓글 좋아요 토글
export const toggleCommentLike = async (commentId) =>
  await maxios.post(`/board/comments/${commentId}/like`);

// 댓글 / 대댓글 신고
export const reportComment = async (commentId, reason) =>
  await maxios.post(`/board/comments/${commentId}/report`, {
    reason,
  });


// 홈 > 인기 게시글 top5
export const getPopularPosts = async () => await maxios.get('/board/posts/popular');
