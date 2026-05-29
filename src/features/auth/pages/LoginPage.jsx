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

const LoginPage = () => {

  useEffect(() => {

    const receiveMessage = (event) => {

      if (event.data.type === 'KAKAO_LOGIN_SUCCESS') {

        const { token, user } = event.data;

        setAuthLogin(token, user);

        navigate('/');

      }

    };

    window.addEventListener('message', receiveMessage);

    return () => {
      window.removeEventListener('message', receiveMessage);
    };

  }, []);

  const navigate = useNavigate();

  const { login: setAuthLogin } = useAuthStore();

  const primaryPurple = '#5b21b6';

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    password: '',
    rememberMe: true
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);


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

      const response = await login({
        member_id: formData.id,
        password: formData.password
      });

      const data = response.data;

      if (data.success) {

        const token = data.token;

        setAuthLogin(token, {
          id: formData.id
        });

        alert(data.message);

        navigate('/');

      } else {

        setError(data.message);

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

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#111111] font-['Pretendard'] flex flex-col">

      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[60px] sm:h-[68px] lg:h-[72px]">

            <Link to="/" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ backgroundColor: primaryPurple }}
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>

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

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2">
                <p className="text-[13px] sm:text-[14px] font-[500] text-red-500">
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

          {/* Social Login */}
          <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-3">

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
              className="h-[44px] sm:h-[46px] rounded-xl border border-[#e7e2f7] bg-white hover:bg-[#faf8ff] transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[600] text-[#333]"
            >
              <span className="text-[#03C75A] text-lg sm:text-xl font-[800]">
                N
              </span>
              네이버
            </button>

            <button
              type="button"
              className="h-[44px] sm:h-[46px] rounded-xl border border-[#e7e2f7] bg-white hover:bg-[#faf8ff] transition-colors flex items-center justify-center gap-2 text-[13px] sm:text-[14px] font-[600] text-[#333]"
            >
              <span className="text-base sm:text-lg font-[700]">
                G
              </span>
              구글
            </button>


          </div>
        </section>

        {/* Signup */}
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
          <p className="text-[13px] sm:text-sm font-semibold text-[#5b21b6]">
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