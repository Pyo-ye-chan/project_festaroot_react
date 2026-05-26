import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  EyeOff,
  Lock,
  User,
  Heart,
  Bell,
  ChevronRight
} from 'lucide-react';

const LoginPage = () => {
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

      // TODO: 로그인 API 연동
      console.log('Login submitted:', formData);

      alert(`${formData.id}님, 환영합니다!`);
    } catch (err) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f3ff] text-[#111111] font-['Pretendard']">
      {/* Header */}
      <header className="h-[88px] bg-white/70 backdrop-blur-md border-b border-[#ece7ff]">
        <div className="max-w-[1280px] mx-auto h-full px-6 lg:px-10 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f6b800]/15 flex items-center justify-center text-[#f6b800] text-2xl">
              ✺
            </div>

            <div>
              <div className="text-[28px] font-[800] tracking-[-0.05em] text-[#22114f]">
                축제로
              </div>

              <div className="text-xs font-[500] text-[#8b8b8b] mt-0.5">
                축제와 여행이 만나는 곳
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-10 text-[15px] font-[600] text-[#444]">
            <Link
              to="/festival"
              className="hover:text-festival-purple transition-colors"
            >
              축제 찾기
            </Link>

            <Link
              to="/region"
              className="hover:text-festival-purple transition-colors"
            >
              지역별 축제
            </Link>

            <Link
              to="/travel"
              className="hover:text-festival-purple transition-colors"
            >
              여행 정보
            </Link>

            <Link
              to="/community"
              className="hover:text-festival-purple transition-colors"
            >
              커뮤니티
            </Link>
          </nav>

          {/* Right Menu */}
          <div className="hidden sm:flex items-center gap-5 text-[#111111]">
            <Heart size={22} strokeWidth={1.8} />

            <div className="relative">
              <Bell size={22} strokeWidth={1.8} />

              <span className="absolute -top-2 -right-2 w-4 h-4 rounded-full bg-festival-purple text-white text-[10px] font-[700] flex items-center justify-center">
                3
              </span>
            </div>

            <User size={22} strokeWidth={1.8} />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="min-h-[calc(100vh-88px-120px)] flex flex-col items-center px-5 py-14 lg:py-16">
        {/* Title */}
        <section className="w-full max-w-[520px] text-center mb-8">
          <h1 className="text-[32px] font-[800] tracking-[-0.05em] text-[#111111]">
            로그인
          </h1>

          <p className="mt-3 text-[15px] leading-6 font-[500] text-[#666]">
            축제로 계정으로 다양한 정보와 서비스를 이용해보세요.
          </p>
        </section>

        {/* Login Card */}
        <section
          className="
            w-full
            max-w-[500px]
            bg-white
            rounded-[24px]
            border
            border-[#ece7ff]
            shadow-[0_12px_40px_rgba(91,33,182,0.08)]
            px-6
            sm:px-9
            py-8
          "
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* ID */}
            <div>
              <label className="block text-[14px] font-[700] text-[#222] mb-2">
                아이디
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#9ca3af]">
                  <User size={19} />
                </span>

                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleChange}
                  placeholder="아이디를 입력하세요"
                  autoComplete="username"
                  className="
                    w-full
                    h-[52px]
                    pl-11
                    pr-4
                    rounded-xl
                    border
                    border-[#e7e2f7]
                    bg-white
                    text-[15px]
                    font-[500]
                    text-[#111]
                    placeholder:text-[#b8b2c7]
                    outline-none
                    transition-all
                    focus:border-festival-purple
                    focus:ring-4
                    focus:ring-[#ede9fe]
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-[14px] font-[700] text-[#222] mb-2">
                비밀번호
              </label>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#9ca3af]">
                  <Lock size={19} />
                </span>

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="비밀번호를 입력하세요"
                  autoComplete="current-password"
                  className="
                    w-full
                    h-[52px]
                    pl-11
                    pr-12
                    rounded-xl
                    border
                    border-[#e7e2f7]
                    bg-white
                    text-[15px]
                    font-[500]
                    text-[#111]
                    placeholder:text-[#b8b2c7]
                    outline-none
                    transition-all
                    focus:border-festival-purple
                    focus:ring-4
                    focus:ring-[#ede9fe]
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#9ca3af] hover:text-[#666]"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-[14px] font-[500] text-red-500">
                {error}
              </p>
            )}

            {/* Options */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-gray-300 text-festival-purple focus:ring-festival-purple"
                />

                <span className="text-[14px] font-[500] text-[#555]">
                  로그인 유지
                </span>
              </label>

              <Link
                to="/find-account"
                className="flex items-center gap-1 text-[14px] font-[500] text-[#555] hover:text-festival-purple transition-colors"
              >
                아이디/비밀번호 찾기
                <ChevronRight size={15} />
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full
                h-[54px]
                rounded-xl
                bg-festival-purple
                text-white
                text-[15px]
                font-[700]
                tracking-[-0.02em]
                transition-all
                hover:opacity-95
                active:scale-[0.99]
                disabled:opacity-60
                disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? '로그인 중...' : '로그인'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-7">
            <div className="flex-1 h-px bg-[#ece7ff]" />

            <span className="text-xs font-[500] text-[#999]">
              또는
            </span>

            <div className="flex-1 h-px bg-[#ece7ff]" />
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            <button
              className="
                h-[48px]
                rounded-xl
                border
                border-[#e7e2f7]
                bg-white
                hover:bg-[#faf8ff]
                transition-colors
                flex
                items-center
                justify-center
                gap-2
                text-[14px]
                font-[600]
                text-[#333]
              "
            >
              <span className="text-[#03C75A] text-xl font-[800]">
                N
              </span>

              네이버
            </button>

            <button
              className="
                h-[48px]
                rounded-xl
                border
                border-[#e7e2f7]
                bg-white
                hover:bg-[#faf8ff]
                transition-colors
                flex
                items-center
                justify-center
                gap-2
                text-[14px]
                font-[600]
                text-[#333]
              "
            >
              <span className="text-lg font-[700]">
                G
              </span>

              구글
            </button>

            <button
              className="
                h-[48px]
                rounded-xl
                border
                border-[#e7e2f7]
                bg-white
                hover:bg-[#faf8ff]
                transition-colors
                flex
                items-center
                justify-center
                gap-2
                text-[14px]
                font-[600]
                text-[#333]
              "
            >
              <span className="text-xl">
                
              </span>

              Apple
            </button>
          </div>
        </section>

        {/* Signup */}
        <div className="mt-7 text-center">
          <span className="text-[14px] font-[500] text-[#666]">
            계정이 없으신가요?
          </span>

          <Link
            to="/signup"
            className="ml-2 inline-flex items-center gap-1 text-[14px] font-[700] text-festival-purple hover:underline"
          >
            회원가입하기
            <ChevronRight size={15} />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="h-[120px] bg-white border-t border-[#ece7ff]">
        <div className="max-w-[1280px] mx-auto h-full px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm font-[500] text-[#999]">
          <div>
            <div className="flex items-center gap-6 mb-3">
              <Link to="/terms" className="hover:text-[#555]">
                이용약관
              </Link>

              <Link to="/privacy" className="hover:text-[#555]">
                개인정보처리방침
              </Link>

              <Link to="/help" className="hover:text-[#555]">
                고객센터
              </Link>

              <Link to="/partnership" className="hover:text-[#555]">
                제휴문의
              </Link>
            </div>

            <p>
              © 2025 축제로. All rights reserved.
            </p>
          </div>

          <button className="px-4 h-10 rounded-xl border border-[#e7e2f7] bg-white text-[#555] font-[500]">
            한국어
          </button>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;