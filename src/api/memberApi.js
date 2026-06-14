import { maxios } from './axiosApi';

export const signup = (formData) => maxios.post('/member/signup', formData);

export const sendVerificationCode = async (email) => {
    const response = await maxios.post('/email/send', { email });
    return response.data;
};

export const verifyEmailCode = async (email, code) => {
    const response = await maxios.post('/email/verify', {
        email,
        code
    });
    return response.data;
};

export const checkIdDuplicate = async (member_id) => {
    const response = await maxios.get('/member/check-id', {
        params: { member_id }
    });
    return response.data;
};

export const checkNicknameDuplicate = async (nickname) => {
    const response = await maxios.get('/member/check-nickname', {
        params: { nickname }
    });
    return response.data;
};

export const checkEmailDuplicate = (email) => {
  return maxios.get(`/member/check-email`, {
    params: { email }
  });
};


// 아이디 찾기
export const findId = (data) => {
  return maxios.post(`/member/find-id`, data);
};

// 비밀번호 찾기 - 인증번호 발송
export const sendPasswordResetCode = (data) => {
  return maxios.post(`/member/password/send-code`, data);
};

// 인증번호 확인
export const verifyPasswordResetCode = (data) => {
  return maxios.post(`/member/password/verify-code`, data);
};

// 비밀번호 재설정
export const resetPassword = (data) => {
  return maxios.post(`/member/password/reset`, data);
};


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

/**
 * 유저의 업적 정보 조회
 * @param {string} userId
 */
export const getMemberAchievements = (userId) => maxios.get(`/member/achievements/${userId}`, { skipAchievementNotification: true });