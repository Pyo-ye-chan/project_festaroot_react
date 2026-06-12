import { maxios } from './axiosApi';

/**
 * 1:1 문의 등록
 * @param {FormData} formData (member_id, category, title, content, files)
 */
export const addInquiry = async (formData) => {
  return await maxios.post('/inquiry/add', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * 회원의 문의 내역 조회
 * @param {string} memberId 
 */
export const getMyInquiries = async (memberId) => {
  return await maxios.get(`/inquiry/list/${memberId}`);
};

/**
 * 문의 상세 조회 (필요 시)
 * @param {number} inquiryId 
 */
export const getInquiryDetail = async (inquiryId) => {
  return await maxios.get(`/inquiry/detail/${inquiryId}`);
};

