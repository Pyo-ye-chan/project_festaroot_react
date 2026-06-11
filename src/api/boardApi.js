import { maxios } from './axiosApi';

export const uploadImage = async (file, folder = 'board/image') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('folder', folder);

  console.log('Uploading image:', file);

  const response = await maxios.post(`storage/board/image`, formData);
  return response.data;
};

export const addPost = async (data) => maxios.post('board/post', data);

export const getPosts = async (cpage=1) => await maxios.get(`board/posts?cpage=${cpage}`);

export const getPostDetail = async (id) => await maxios.get(`board/post/${id}`);