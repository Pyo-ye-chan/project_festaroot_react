import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  ChevronRight
} from 'lucide-react';

import { login } from '../../../api/authApi';
import useAuthStore from '../../../store/useAuthStore';
import useMemberStore from '../../../store/useMemberStore';
import useFestivalLikeStore from '../../../store/useFestivalLikeStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const { setSignupData } = useMemberStore();
  const { login: setAuthLogin } = useAuthStore();
  const { setInitialLikes } = useFestivalLikeStore(); // 축제 찜 목록
  const primaryPurple = '#5b21b6';
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    rememberMe: true
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleSocialMessage = (event) => {
      if (event.origin !== window.location.origin) return;

      const { type, data, message } = event.data;

      if (type === 'KAKAO_LOGIN_FAIL' || type === 'NAVER_LOGIN_FAIL' || type === 'GOOGLE_LOGIN_FAIL') {
        alert(message || '소셜 로그인에 실패했습니다.');
        return;
      }

      if (type !== 'KAKAO_LOGIN_SUCCESS' && type !== 'NAVER_LOGIN_SUCCESS' && type !== 'GOOGLE_LOGIN_SUCCESS') {
        return;
      }

      const provider =
        type === 'KAKAO_LOGIN_SUCCESS'
          ? 'KAKAO'
          : type === 'NAVER_LOGIN_SUCCESS'
            ? 'NAVER'
            : 'GOOGLE';

      console.log(`${provider} 로그인 응답:`, data);

      // 소셜 로그인 유저가 정지 또는 블랙리스트 상태일 경우 메시지 처리
      if (data && data.success === false) {
        setError(data.message);
        alert(data.message);
        return;
      }

      if (data.isNewUser === true) {
        setSignupData({
          member_id: data.member_id,
          social_provider: data.social_provider || provider,
          social_id: data.social_id,
          email: data.email || '',
          nickname: data.nickname || '',
          name: data.name || '',
          profile_image_url: data.profile_image_url || ''
        });

        navigate('/signup/social');
        return;
      }

      if (data.token) {
        // 소셜 로그인 성공 시에도 백엔드가 축제 찜 목록
        if (data.likedFestivalIds) {
          setInitialLikes(data.likedFestivalIds);
        }

        setAuthLogin(data.token, {
          member_id: data.member_id,
          nickname: data.nickname,
          email: data.email,
          social_provider: data.social_provider || provider
        }, true);

        navigate('/');
        return;
      }

      alert(`${provider} 로그인 응답에 토큰이 없습니다.`);
    };

    window.addEventListener('message', handleSocialMessage);

    return () => {
      window.removeEventListener('message', handleSocialMessage);
    };
  }, [navigate, setSignupData, setAuthLogin]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.id.trim()) {
      setError('아이디를 입력해주세요.');
      return;
    }

    if (!formData.password.trim()) {
      setError('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const response = await login({
        member_id: formData.id,
        password: formData.password,
      });

      const data = response.data;

      if (!data.success) {
        setError(data.message || '아이디 또는 비밀번호가 올바르지 않습니다.');
        return;
      }

      const token = data.token;

      const loginUser = {
        member_id: formData.id,
        id: formData.id,
        role: data.role,
        nickname: data.nickname,
        name: data.name,
      };

      setAuthLogin(token, loginUser, formData.rememberMe);

      const userLikedIds = data.likedFestivalIds;
      if (userLikedIds) {
        setInitialLikes(userLikedIds);
      }

      alert(data.message || '로그인되었습니다.');

      if (data.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      console.error('Login error:', err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKakaoLogin = () => {
    const width = 500;
    const height = 700;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;

    const kakaoURL =
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${import.meta.env.VITE_KAKAO_REST_API_KEY}` +
      `&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}` +
      `&response_type=code`;

    window.open(
      kakaoURL,
      'kakaoLogin',
      `
      width=${width},
      height=${height},
      left=${left},
      top=${top},
      resizable=no,
      scrollbars=no,
      status=no
    `
    );
  };

  const handleNaverLogin = () => {
    const naverURL =
      `https://nid.naver.com/oauth2.0/authorize` +
      `?response_type=code` +
      `&client_id=${import.meta.env.VITE_NAVER_CLIENT_ID}` +
      `&redirect_uri=${import.meta.env.VITE_NAVER_REDIRECT_URI}` +
      `&state=${crypto.randomUUID()}`;

    window.open(
      naverURL,
      'naverLogin',
      'width=500,height=700'
    );
  };

  const handleGoogleLogin = () => {
    const redirectUri = import.meta.env.VITE_GOOGLE_REDIRECT_URI;

    const googleURL =
      `https://accounts.google.com/o/oauth2/v2/auth` +
      `?client_id=${import.meta.env.VITE_GOOGLE_CLIENT_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=${encodeURIComponent('openid email profile')}` +
      `&prompt=select_account`;

    window.open(
      googleURL,
      'googleLogin',
      'width=500,height=700'
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#111111] font-['Pretendard'] flex flex-col">
    {/* Header */}
    <header className="w-full bg-white border-b border-gray-200 shrink-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 sm:h-20">
          <Link to="/" className="flex items-center gap-2 cursor-pointer group">
            <svg
              className="w-9 h-9 sm:w-10 sm:h-10 transition-transform group-hover:scale-105 select-none"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="16" cy="16" r="16" fill="#f3eeff" />
              <path
                d="M16,3 C11,3 7,7 7,12 C7,18 16,29 16,29 C16,29 25,18 25,12 C25,7 21,3 16,3 Z"
                fill="#6d3df2"
              />
              <path
                d="M16,7 L17.5,10.5 L21,12 L17.5,13.5 L16,17 L14.5,13.5 L11,12 L14.5,10.5 Z"
                fill="#ffd000"
              />
              <circle cx="16" cy="12" r="1.5" fill="#ffffff" />
            </svg>

            <span
              className="text-xl sm:text-2xl font-black tracking-tight"
              style={{ color: primaryPurple }}
            >
              축제로
            </span>
          </Link>
        </div>
      </div>
    </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-5 py-6 sm:py-7 lg:py-6">
        {/* Title */}
        <section className="w-full max-w-[480px] text-center mb-5 sm:mb-6">
          <h1 className="text-[26px] sm:text-[30px] lg:text-[32px] font-[800] tracking-[-0.05em]">
            로그인
          </h1>
          <p className="mt-2 sm:mt-3 text-[13px] sm:text-[15px] leading-6 font-[500] text-[#666]">
            축제로 계정으로 다양한 정보와 서비스를 이용해보세요.
          </p>
        </section>

        {/* Login Card */}
        <section className="w-full max-w-[440px] sm:max-w-[460px] bg-white rounded-[22px] sm:rounded-[24px] border border-[#ece7ff] shadow-[0_12px_36px_rgba(91,33,182,0.08)] px-5 sm:px-8 py-6 sm:py-7">
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* ID */}
            <div>
              <label className="block text-[13px] sm:text-[14px] font-[700] text-[#222] mb-2">
                아이디
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#9ca3af]">
                  <User size={18} />
                </span>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  className="w-full h-[48px] sm:h-[50px] pl-11 pr-4 rounded-xl border border-[#e7e2f7] bg-white text-[14px] sm:text-[15px] font-[500] text-[#111] placeholder:text-[#b8b2c7] outline-none transition-all focus:border-[#7c3aed] focus:ring-4 focus:ring-[#ede9fe]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[13px] sm:text-[14px] font-[700] text-[#222] mb-2">
                비밀번호
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#9ca3af]">
                  <Lock size={18} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  className="w-full h-[48px] sm:h-[50px] pl-11 pr-12 rounded-xl border border-[#e7e2f7] bg-white text-[14px] sm:text-[15px] font-[500] text-[#111] placeholder:text-[#b8b2c7] outline-none transition-all focus:border-[#7c3aed] focus:ring-4 focus:ring-[#ede9fe]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9ca3af] hover:text-[#666]"
                  aria-label="비밀번호 보기"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2">
                <p className="text-[13px] sm:text-[14px] font-[500] text-red-500 whitespace-pre-line">
                  {error}
                </p>
              </div>
            )}

            {/* Options */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 accent-[#7c3aed]"
                />
                <span className="text-[13px] sm:text-[14px] font-[500] text-[#555]">
                  로그인 유지
                </span>
              </label>
              <Link
                to="/find-account"
                className="flex items-center gap-1 text-[13px] sm:text-[14px] font-[500] text-[#555] hover:text-[#7c3aed] transition-colors"
              >
                아이디/비밀번호 찾기
                <ChevronRight size={14} />
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-[50px] sm:h-[52px] rounded-xl bg-[#7c3aed] text-white text-[15px] font-[700] tracking-[-0.02em] transition-all hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-5">
            <div className="flex-1 h-px bg-[#ece7ff]" />
            <span className="text-[11px] sm:text-xs font-[500] text-[#999]">
              또는
            </span>
            <div className="flex-1 h-px bg-[#ece7ff]" />
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <button
              type="button"
              onClick={handleKakaoLogin}
              className="h-[44px] sm:h-[46px] rounded-xl bg-[#FEE500] hover:brightness-95 transition-all flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[700] text-[#191919]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5"
                fill="currentColor"
              >
                <path d="M12 3C6.477 3 2 6.438 2 10.667c0 2.694 1.82 5.06 4.563 6.42l-1.152 4.21a.5.5 0 0 0 .74.553l4.87-3.19c.32.03.646.046.979.046 5.523 0 10-3.438 10-7.667S17.523 3 12 3z" />
              </svg>
              카카오
            </button>

            <button
              type="button"
              onClick={handleNaverLogin}
              className="h-[44px] sm:h-[46px] rounded-xl bg-[#03C75A] hover:brightness-95 transition-all flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[700] text-white"
            >
              <span className="text-[20px] font-black leading-none">N</span>
              네이버
            </button>

            {/* <button
              type="button"
              onClick={handleGoogleLogin}
              className="h-[44px] sm:h-[46px] rounded-xl bg-white border border-gray-200 hover:brightness-95 transition-all flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[700] text-gray-700"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              구글
            </button> */}
          </div>
        </section>

        {/* Signup Link */}
        <div className="mt-5 text-center">
          <span className="text-[13px] sm:text-[14px] font-[500] text-[#666]">
            계정이 없으신가요?
          </span>
          <Link
            to="/signup"
            className="ml-2 inline-flex items-center gap-1 text-[13px] sm:text-[14px] font-[700] text-[#7c3aed] hover:underline"
          >
            회원가입하기
            <ChevronRight size={14} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 sm:py-5 shrink-0">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-[13px] sm:sm font-semibold text-[#5b21b6]">
            축제로
          </p>
          <p className="mt-1.5 text-[11px] sm:text-xs text-gray-500">
            전국 축제 정보와 여행 경험을 연결하는 축제 플랫폼
          </p>
          <p className="mt-2.5 text-[11px] sm:text-xs text-gray-400">
            © 2026 FestaRoute. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;
