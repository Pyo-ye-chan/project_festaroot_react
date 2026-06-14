import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import {
  ChevronLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Info,
  Key,
  ShieldCheck
} from 'lucide-react';

import {
  findId,
  sendPasswordResetCode,
  verifyPasswordResetCode,
  resetPassword
} from '../../../api/memberApi';

const FindAccountPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('id');
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    member_id: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [foundId, setFoundId] = useState('');
  const [resetToken, setResetToken] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 입력값 변경
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = {
        ...prev,
        [name]: value
      };

      if (name === 'confirmPassword') {
        setPasswordMatch(next.newPassword === value);
      }

      if (name === 'newPassword') {
        setPasswordMatch(value === next.confirmPassword);
      }

      return next;
    });

    setMessage('');
    setErrorMessage('');
  };

  // 탭 변경
  const handleChangeTab = (tab) => {
    setActiveTab(tab);
    setStep(1);
    setMessage('');
    setErrorMessage('');
    setFoundId('');
    setResetToken('');

    setFormData({
      name: '',
      email: '',
      member_id: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // 아이디 찾기
  const handleFindId = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage('이름을 입력해주세요.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setMessage('');

      const response = await findId({
        name: formData.name,
        email: formData.email
      });

      const data = response.data;

      if (data.success) {
        setFoundId(data.member_id);
        setStep(2);
      } else {
        setErrorMessage(data.message || '일치하는 회원 정보가 없습니다.');
      }
    } catch (error) {
      console.error('아이디 찾기 실패:', error);
      setErrorMessage(
        error.response?.data?.message ||
          '일치하는 회원 정보가 없습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 찾기 인증번호 발송
  const handleSendVerification = async (e) => {
    if (e) e.preventDefault();

    if (!formData.name.trim()) {
      setErrorMessage('이름을 입력해주세요.');
      return;
    }

    if (!formData.member_id.trim()) {
      setErrorMessage('아이디를 입력해주세요.');
      return;
    }

    if (!formData.email.trim()) {
      setErrorMessage('이메일을 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setMessage('');

      const response = await sendPasswordResetCode({
        name: formData.name,
        member_id: formData.member_id,
        email: formData.email
      });

      const data = response.data;

      if (data.success) {
        setMessage('인증번호가 발송되었습니다. 5분 이내로 입력해주세요.');
        setStep(2);
      } else {
        setErrorMessage(data.message || '인증번호 발송에 실패했습니다.');
      }
    } catch (error) {
      console.error('인증번호 발송 실패:', error);
      setErrorMessage(
        error.response?.data?.message ||
          '일치하는 회원 정보가 없습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 인증번호 확인
  const handleVerifyCode = async (e) => {
    e.preventDefault();

    if (!formData.verificationCode.trim()) {
      setErrorMessage('인증번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setMessage('');

      const response = await verifyPasswordResetCode({
        email: formData.email,
        verificationCode: formData.verificationCode
      });

      const data = response.data;

      if (data.success) {
        setResetToken(data.resetToken);
        setStep(3);
      } else {
        setErrorMessage(data.message || '인증번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error('인증번호 확인 실패:', error);
      setErrorMessage(
        error.response?.data?.message ||
          '인증번호가 올바르지 않거나 만료되었습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 비밀번호 재설정
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!formData.newPassword.trim()) {
      setErrorMessage('새 비밀번호를 입력해주세요.');
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrorMessage('비밀번호는 8자 이상 입력해주세요.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordMatch(false);
      setErrorMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage('');
      setMessage('');

      const response = await resetPassword({
        member_id: formData.member_id,
        email: formData.email,
        resetToken,
        newPassword: formData.newPassword
      });

      const data = response.data;

      if (data.success) {
        alert('비밀번호가 성공적으로 재설정되었습니다.');
        navigate('/login');
      } else {
        setErrorMessage(data.message || '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('비밀번호 재설정 실패:', error);
      setErrorMessage(
        error.response?.data?.message ||
          '비밀번호 변경에 실패했습니다.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = `
    w-full h-[56px] px-5 rounded-2xl border border-[#e7e2f7] bg-white
    text-[15px] font-[500] text-[#111] placeholder:text-[#b8b2c7]
    outline-none transition-all focus:border-festival-purple focus:ring-4 focus:ring-[#f5f0ff]
  `;

  const labelClass =
    'block text-[14px] font-[700] text-[#444] mb-2 ml-1';

  const renderMessage = () => (
    <>
      {message && (
        <p className="text-sm text-green-600 font-bold text-center">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="text-sm text-red-500 font-bold text-center">
          {errorMessage}
        </p>
      )}
    </>
  );

  const renderFindId = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleFindId} className="space-y-6">
          <p className="text-sm text-gray-500 text-center mb-6">
            가입 시 등록한 이름과 이메일 주소를 입력해주세요.
          </p>

          {renderMessage()}

          <div>
            <label className={labelClass}>이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="실명 입력"
              required
            />
          </div>

          <div>
            <label className={labelClass}>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="example@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all mt-4 disabled:opacity-50"
          >
            {isLoading ? '조회 중...' : '아이디 찾기'}
          </button>
        </form>
      );
    }

    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-festival-purple">
          <ShieldCheck size={32} />
        </div>

        <h3 className="text-lg font-bold text-gray-800 mb-2">
          아이디를 찾았습니다!
        </h3>

        <p className="text-gray-500 mb-8">
          고객님의 정보와 일치하는 아이디입니다.
        </p>

        <div className="bg-[#f8f9ff] border border-[#e7e2f7] rounded-2xl p-6 mb-8">
          <span className="text-2xl font-black text-festival-purple tracking-wider">
            {foundId}
          </span>
        </div>

        <div className="flex gap-3">
          <Link
            to="/login"
            className="flex-1 h-14 bg-festival-purple text-white font-bold rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100 hover:opacity-95 transition-all"
          >
            로그인하기
          </Link>

          <button
            type="button"
            onClick={() => handleChangeTab('pw')}
            className="flex-1 h-14 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all"
          >
            비밀번호 찾기
          </button>
        </div>
      </div>
    );
  };

  const renderFindPw = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleSendVerification} className="space-y-6">
          <p className="text-sm text-gray-500 text-center mb-6">
            본인 확인을 위해 이름, 아이디, 이메일을 입력해주세요.
          </p>

          {renderMessage()}

          <div>
            <label className={labelClass}>이름</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={inputClass}
              placeholder="실명 입력"
              required
            />
          </div>

          <div>
            <label className={labelClass}>아이디</label>
            <input
              type="text"
              name="member_id"
              value={formData.member_id}
              onChange={handleChange}
              className={inputClass}
              placeholder="아이디 입력"
              required
            />
          </div>

          <div>
            <label className={labelClass}>이메일</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={inputClass}
              placeholder="example@email.com"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all mt-4 disabled:opacity-50"
          >
            {isLoading ? '발송 중...' : '인증번호 발송'}
          </button>
        </form>
      );
    }

    if (step === 2) {
      return (
        <form onSubmit={handleVerifyCode} className="space-y-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-festival-purple">
              <Key size={30} />
            </div>

            <h3 className="text-lg font-bold text-gray-800">
              인증번호 입력
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              {formData.email}로 발송된
              <br />
              6자리 인증번호를 입력해주세요.
            </p>
          </div>

          {renderMessage()}

          <div>
            <label className={labelClass}>인증번호</label>
            <input
              type="text"
              name="verificationCode"
              value={formData.verificationCode}
              onChange={handleChange}
              className={`${inputClass} text-center text-2xl tracking-[0.5em] font-black`}
              placeholder="000000"
              maxLength={6}
              required
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 h-14 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
            >
              이전으로
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all disabled:opacity-50"
            >
              {isLoading ? '확인 중...' : '인증 확인'}
            </button>
          </div>

          <button
            type="button"
            onClick={handleSendVerification}
            disabled={isLoading}
            className="w-full text-sm text-gray-400 font-bold hover:text-festival-purple underline underline-offset-4 disabled:opacity-50"
          >
            인증번호 다시 받기
          </button>
        </form>
      );
    }

    return (
      <form onSubmit={handleResetPassword} className="space-y-6">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
            <CheckCircle2 size={32} />
          </div>

          <h3 className="text-lg font-bold text-gray-800">
            본인 확인 완료
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            새로운 비밀번호를 설정해주세요.
          </p>
        </div>

        {renderMessage()}

        <div>
          <label className={labelClass}>새 비밀번호</label>

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={inputClass}
              placeholder="8자 이상 영문/숫자 혼합"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>비밀번호 확인</label>

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className={`${inputClass} ${
              !passwordMatch && formData.confirmPassword
                ? 'border-red-400 focus:ring-red-50'
                : ''
            }`}
            placeholder="비밀번호 다시 입력"
            required
          />

          {!passwordMatch && formData.confirmPassword && (
            <p className="text-xs text-red-500 mt-2 ml-2 flex items-center gap-1 font-bold">
              <Info size={13} />
              비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all mt-4 disabled:opacity-50"
        >
          {isLoading ? '변경 중...' : '비밀번호 변경 완료'}
        </button>
      </form>
    );
  };

  return (
    <AuthLayout
      title="계정 찾기"
      subtitle="가입하신 정보를 통해 계정을 확인하실 수 있습니다"
      maxWidth="max-w-[540px]"
    >
      {step === 1 && (
        <div className="flex bg-[#f8f9ff] p-1.5 rounded-2xl mb-10 border border-[#e7e2f7]">
          <button
            type="button"
            className={`flex-1 py-3.5 text-[15px] font-bold rounded-xl transition-all ${
              activeTab === 'id'
                ? 'bg-white text-festival-purple shadow-md shadow-purple-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => handleChangeTab('id')}
          >
            아이디 찾기
          </button>

          <button
            type="button"
            className={`flex-1 py-3.5 text-[15px] font-bold rounded-xl transition-all ${
              activeTab === 'pw'
                ? 'bg-white text-festival-purple shadow-md shadow-purple-50'
                : 'text-gray-400 hover:text-gray-600'
            }`}
            onClick={() => handleChangeTab('pw')}
          >
            비밀번호 찾기
          </button>
        </div>
      )}

      {activeTab === 'id' ? renderFindId() : renderFindPw()}

      {step === 1 && (
        <div className="mt-10 pt-8 border-t border-gray-50 flex justify-center items-center gap-6 text-[14px] font-bold">
          <Link
            to="/login"
            className="text-gray-400 hover:text-festival-purple transition-colors flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            로그인으로 돌아가기
          </Link>

          <span className="w-px h-3 bg-gray-200" />

          <Link
            to="/signup"
            className="text-gray-400 hover:text-festival-purple transition-colors"
          >
            회원가입
          </Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default FindAccountPage;