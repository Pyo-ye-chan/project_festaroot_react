import { maxios } from './axiosApi';

/**
 * FAQ 목록 조회
 */
export const getFaqList = async () => {
  return await maxios.get('/faq/list');
};

/**
 * [관리자] FAQ 등록
 * @param {object} faqData { category, question, answer }
 */
export const addFaq = async (faqData) => {
  return await maxios.post('/admin/faq/add', faqData);
};

/**
 * [관리자] FAQ 수정
 * @param {number} faqId 
 * @param {object} faqData { category, question, answer }
 */
export const updateFaq = async (faqId, faqData) => {
  return await maxios.put(`/admin/faq/update/${faqId}`, faqData);
};

/**
 * [관리자] FAQ 삭제
 * @param {number} faqId 
 */
export const deleteFaq = async (faqId) => {
  return await maxios.delete(`/admin/faq/delete/${faqId}`);
};
