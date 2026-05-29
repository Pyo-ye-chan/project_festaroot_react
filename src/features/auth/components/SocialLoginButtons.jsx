import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socialLogin } from '../../../api/authApi';
import useMemberStore from '../../../store/useMemberStore';
import useAuthStore from '../../../store/useAuthStore'; // Assuming you have an auth store

const SocialLoginButtons = () => {
  const navigate = useNavigate();
  const { setSignupData } = useMemberStore();
  const authLogin = useAuthStore((state) => state.login);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleKakaoLogin = async () => {
    setIsSubmitting(true);
    if (!window.Kakao) {
      console.warn('Kakao SDK not loaded.');
      alert('카카오 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Check if Kakao is initialized
      if (!window.Kakao.isInitialized()) {
        console.warn('Kakao SDK is not initialized. Attempting to re-initialize.');
        // This might happen if the App component hasn't fully rendered yet,
        // or if the VITE_KAKAO_LOGIN_KEY was missing.
        // Re-initializing here is a fallback.
        window.Kakao.init(import.meta.env.VITE_KAKAO_LOGIN_KEY);
      }

      const authResponse = await new Promise((resolve, reject) => {
        window.Kakao.Auth.login({
          scope: 'profile_nickname,profile_image,account_email',
          success: resolve,
          fail: reject,
        });
      });

      const userInfoResponse = await new Promise((resolve, reject) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: resolve,
          fail: reject,
        });
      });

      const { id, properties, kakao_account } = userInfoResponse;
      const socialLoginInfo = {
        social_id: id,
        social_provider: 'KAKAO',
        nickname: properties.nickname,
        profile_image_url: properties.profile_image,
        email: kakao_account.has_email ? kakao_account.email : null,
        gender: kakao_account.has_gender ? kakao_account.gender : null, // Add gender
        birthdate: kakao_account.has_birthday ? kakao_account.birthday : null, // Add birthdate
      };

      console.log('Kakao Login Info:', socialLoginInfo);

      const response = await socialLogin(socialLoginInfo);
      const { data } = response;
      console.log('Social Login API Response:', data);

      if (data.status === 'SUCCESS' && data.memberInfo) {
        // User fully logged in
        authLogin(data.token, data.memberInfo); // Assuming response contains token and user info
        navigate('/');
      } else if (data.status === 'NEEDS_ADDITIONAL_INFO' && data.memberInfo) {
        // User needs to complete signup (preferences)
        setSignupData({
          email: socialLoginInfo.email,
          nickname: socialLoginInfo.nickname,
          profile_image_url: socialLoginInfo.profile_image_url,
          social_provider: socialLoginInfo.social_provider,
          // Pre-fill gender and birthdate if Kakao provided them
          gender: socialLoginInfo.gender,
          birthdate: socialLoginInfo.birthdate,
          // Other fields will be filled on the preferences page
        });
        navigate('/signup/preferences');
      } else {
        alert(data.message || '소셜 로그인에 실패했습니다.');
        console.error('Social login failed:', data);
      }

    } catch (error) {
      console.error('Kakao login error:', error);
      alert('카카오 로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 mt-6">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">또는 간편 로그인</span>
        </div>
      </div>

      <button 
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-[#FEE500] text-[#3c1e1e] font-medium"
        onClick={handleKakaoLogin}
        disabled={isSubmitting}
      >
        <img src="https://developers.kakao.com/assets/img/lib/logos/kakaotalksharing/kakaotalk_sharing_btn_medium.png" alt="Kakao" className="w-5 h-5" />
        {isSubmitting ? '로그인 중...' : '카카오로 시작하기'}
      </button>

      <button 
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-[#1877F2] text-white font-medium"
        onClick={() => console.log('Facebook login')}
        disabled={isSubmitting}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
        페이스북으로 시작하기
      </button>

      <button 
        className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors bg-white text-gray-700 font-medium"
        style={{
          background: 'linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)',
          color: 'white'
        }}
        onClick={() => console.log('Instagram login')}
        disabled={isSubmitting}
      >
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.791-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.209-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
        인스타그램으로 시작하기
      </button>
    </div>
  );
};

export default SocialLoginButtons;
