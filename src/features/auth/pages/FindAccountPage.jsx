import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Mail, Smartphone, User, ChevronLeft, CheckCircle2, Lock, Eye, EyeOff, Info, Key, ShieldCheck } from 'lucide-react';

const FindAccountPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('id'); // 'id' or 'pw'
  const [step, setStep] = useState(1); // 1: input, 2: result/verify, 3: reset (for pw)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [foundId, setFoundId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'confirmPassword') setPasswordMatch(formData.newPassword === value);
    if (name === 'newPassword') setPasswordMatch(value === formData.confirmPassword);
  };

  const handleSendVerification = () => {
    if (!formData.email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    alert('인증번호가 발송되었습니다. (테스트 번호: 1234)');
    if (activeTab === 'pw') setStep(2);
  };

  const handleFindId = (e) => {
    e.preventDefault();
    // Simulate finding ID
    const mockId = 'festa_route_user';
    const masked = mockId.slice(0, 4) + '*'.repeat(mockId.length - 4);
    setFoundId(masked);
    setStep(2);
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (formData.verificationCode === '1234') {
      setStep(3);
    } else {
      alert('인증번호가 올바르지 않습니다.');
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setPasswordMatch(false);
      return;
    }
    alert('비밀번호가 성공적으로 재설정되었습니다.');
    navigate('/login');
  };

  const inputClass = `
    w-full h-[56px] px-5 rounded-2xl border border-[#e7e2f7] bg-white
    text-[15px] font-[500] text-[#111] placeholder:text-[#b8b2c7]
    outline-none transition-all focus:border-festival-purple focus:ring-4 focus:ring-[#f5f0ff]
  `;

  const labelClass = "block text-[14px] font-[700] text-[#444] mb-2 ml-1";

  const renderFindId = () => {
    if (step === 1) {
      return (
        <form onSubmit={handleFindId} className="space-y-6">
          <p className="text-sm text-gray-500 text-center mb-6">
            가입 시 등록한 이름과 이메일 주소를 입력해주세요.
          </p>
          <div>
            <label className={labelClass}>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="실명 입력" required />
          </div>
          <div>
            <label className={labelClass}>이메일</label>
            <div className="flex gap-2">
              <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="example@email.com" required />
            </div>
          </div>
          <button type="submit" className="w-full h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all mt-4">
            아이디 찾기
          </button>
        </form>
      );
    }
    return (
      <div className="text-center py-4">
        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6 text-festival-purple">
          <ShieldCheck size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">아이디를 찾았습니다!</h3>
        <p className="text-gray-500 mb-8">고객님의 정보와 일치하는 아이디입니다.</p>
        
        <div className="bg-[#f8f9ff] border border-[#e7e2f7] rounded-2xl p-6 mb-8">
          <span className="text-2xl font-black text-festival-purple tracking-wider">{foundId}</span>
        </div>

        <div className="flex gap-3">
          <Link to="/login" className="flex-1 h-14 bg-festival-purple text-white font-bold rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100 hover:opacity-95 transition-all">
            로그인하기
          </Link>
          <button onClick={() => { setStep(1); setActiveTab('pw'); }} className="flex-1 h-14 border border-gray-200 text-gray-600 font-bold rounded-2xl hover:bg-gray-50 transition-all">
            비밀번호 찾기
          </button>
        </div>
      </div>
    );
  };

  const renderFindPw = () => {
    if (step === 1) {
      return (
        <form onSubmit={(e) => { e.preventDefault(); handleSendVerification(); }} className="space-y-6">
          <p className="text-sm text-gray-500 text-center mb-6">
            본인 확인을 위해 이름, 아이디, 이메일을 입력해주세요.
          </p>
          <div>
            <label className={labelClass}>이름</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} placeholder="실명 입력" required />
          </div>
          <div>
            <label className={labelClass}>아이디</label>
            <input type="text" name="id" value={formData.id} onChange={handleChange} className={inputClass} placeholder="아이디 입력" required />
          </div>
          <div>
            <label className={labelClass}>이메일</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="example@email.com" required />
          </div>
          <button type="submit" className="w-full h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all mt-4">
            인증번호 발송
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
            <h3 className="text-lg font-bold text-gray-800">인증번호 입력</h3>
            <p className="text-sm text-gray-500 mt-1">{formData.email}로 발송된<br/>6자리 인증번호를 입력해주세요.</p>
          </div>
          
          <div>
            <label className={labelClass}>인증번호</label>
            <input type="text" name="verificationCode" value={formData.verificationCode} onChange={handleChange} className={`${inputClass} text-center text-2xl tracking-[0.5em] font-black`} placeholder="0000" maxLength={4} required />
          </div>
          
          <div className="flex gap-3 mt-4">
            <button type="button" onClick={() => setStep(1)} className="flex-1 h-14 border border-gray-200 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all">
              이전으로
            </button>
            <button type="submit" className="flex-[2] h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all">
              인증 확인
            </button>
          </div>
          <button type="button" onClick={handleSendVerification} className="w-full text-sm text-gray-400 font-bold hover:text-festival-purple underline underline-offset-4">
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
          <h3 className="text-lg font-bold text-gray-800">본인 확인 완료</h3>
          <p className="text-sm text-gray-500 mt-1">새로운 비밀번호를 설정해주세요.</p>
        </div>

        <div>
          <label className={labelClass}>새 비밀번호</label>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} name="newPassword" value={formData.newPassword} onChange={handleChange} className={inputClass} placeholder="8자 이상 영문/숫자 혼합" required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className={labelClass}>비밀번호 확인</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={`${inputClass} ${!passwordMatch && formData.confirmPassword ? 'border-red-400 focus:ring-red-50' : ''}`} placeholder="비밀번호 다시 입력" required />
          {!passwordMatch && formData.confirmPassword && (
            <p className="text-xs text-red-500 mt-2 ml-2 flex items-center gap-1 font-bold">
              <Info size={13}/> 비밀번호가 일치하지 않습니다.
            </p>
          )}
        </div>

        <button type="submit" className="w-full h-14 bg-festival-purple text-white font-bold rounded-2xl shadow-lg shadow-purple-100 hover:opacity-95 transition-all mt-4">
          비밀번호 변경 완료
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
            className={`flex-1 py-3.5 text-[15px] font-bold rounded-xl transition-all ${activeTab === 'id' ? 'bg-white text-festival-purple shadow-md shadow-purple-50' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => { setActiveTab('id'); setStep(1); }}
          >
            아이디 찾기
          </button>
          <button
            className={`flex-1 py-3.5 text-[15px] font-bold rounded-xl transition-all ${activeTab === 'pw' ? 'bg-white text-festival-purple shadow-md shadow-purple-50' : 'text-gray-400 hover:text-gray-600'}`}
            onClick={() => { setActiveTab('pw'); setStep(1); }}
          >
            비밀번호 찾기
          </button>
        </div>
      )}

      {activeTab === 'id' ? renderFindId() : renderFindPw()}

      {step === 1 && (
        <div className="mt-10 pt-8 border-t border-gray-50 flex justify-center items-center gap-6 text-[14px] font-bold">
          <Link to="/login" className="text-gray-400 hover:text-festival-purple transition-colors flex items-center gap-1">
            <ChevronLeft size={16} />
            로그인으로 돌아가기
          </Link>
          <span className="w-px h-3 bg-gray-200" />
          <Link to="/signup" className="text-gray-400 hover:text-festival-purple transition-colors">회원가입</Link>
        </div>
      )}
    </AuthLayout>
  );
};

export default FindAccountPage;
