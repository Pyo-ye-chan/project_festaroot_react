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

/**
 * 문의 삭제
 * @param {number} inquiryId 
 * @param {string} memberId
 */
export const deleteInquiry = async (inquiryId, memberId) => {
  return await maxios.delete(`/inquiry/delete/${inquiryId}`, {
    params: { memberId }
  });
};
/**
 * 문의 수정
 * @param {number} inquiryId 
 * @param {FormData} formData 
 */
export const updateInquiry = async (inquiryId, formData) => {
  return await maxios.put(`/inquiry/update/${inquiryId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

/**
 * [관리자] 문의 내역 전체 조회
 */
export const getAdminInquiryList = async () => {
  return await maxios.get('/admin/inquiry/list');
};

/**
 * [관리자] 문의 답변 등록/수정
 * @param {number} inquiryId 
 * @param {object} answerData { answer: string }
 */
export const saveInquiryAnswer = async (inquiryId, answerData) => {
  return await maxios.post(`/admin/inquiry/answer/${inquiryId}`, answerData);
};

/**
 * [관리자] 문의 삭제
 * @param {number} inquiryId 
 */
export const deleteInquiryByAdmin = async (inquiryId) => {
  return await maxios.delete(`/admin/inquiry/delete/${inquiryId}`);
};

