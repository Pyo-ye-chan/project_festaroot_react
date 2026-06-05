import { maxios } from './axiosApi';

export const signup = (formData) => maxios.post('/member/signup', formData);

/**
 * 유저 프로필 정보 조회 (관심 지역, 테마, 활동 로그 포함)
 * @param {string} userId 
 */
export const getMemberProfile = (userId) => maxios.get(`/member/profile/${userId}`);

/**
 * 유저 프로필 정보 업데이트
 * @param {string} userId 
 * @param {Object} profileData 
 */
export const updateMemberProfile = (userId, profileData) => maxios.put(`/member/profile/${userId}`, profileData);