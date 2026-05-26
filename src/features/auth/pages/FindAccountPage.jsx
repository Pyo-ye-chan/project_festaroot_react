import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { Mail, Smartphone, User } from 'lucide-react';

const FindAccountPage = () => {
  const [activeTab, setActiveTab] = useState('id'); // 'id' or 'pw'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    id: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'id') {
      alert(`${formData.name}님의 아이디는 'festa_user'입니다.`);
    } else {
      alert(`${formData.id}님의 이메일(${formData.email})로 재설정 링크를 보냈습니다.`);
    }
  };

  return (
    <AuthLayout title={activeTab === 'id' ? '아이디 찾기' : '비밀번호 찾기'}>
      <div className="flex border-b border-gray-100 mb-8">
        <button
          className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'id' ? 'text-festival-purple border-b-2 border-festival-purple' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => setActiveTab('id')}
        >
          아이디 찾기
        </button>
        <button
          className={`flex-1 py-3 text-sm font-bold transition-all ${activeTab === 'pw' ? 'text-festival-purple border-b-2 border-festival-purple' : 'text-gray-400 hover:text-gray-600'}`}
          onClick={() => setActiveTab('pw')}
        >
          비밀번호 재설정
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {activeTab === 'id' ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center mb-4">
              가입 시 등록한 이메일 주소로 아이디를 확인합니다.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-festival-purple outline-none transition-all"
                placeholder="이름을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-festival-purple outline-none transition-all"
                  placeholder="example@email.com"
                  required
                />
                <button 
                  type="button"
                  className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-black transition-colors whitespace-nowrap"
                  onClick={() => alert('인증 메일이 발송되었습니다.')}
                >
                  인증요청
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-festival-purple text-white font-bold py-3 rounded-xl shadow-lg shadow-festival-purple/20 transition-all transform active:scale-[0.98] mt-4">
              아이디 확인
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 text-center mb-4 leading-relaxed">
              가입하신 아이디와 이메일을 입력하시면<br />비밀번호 재설정 링크를 보내드립니다.
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">아이디</label>
              <input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-festival-purple outline-none transition-all"
                placeholder="아이디를 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <div className="flex gap-2">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-festival-purple outline-none transition-all"
                  placeholder="example@email.com"
                  required
                />
                <button 
                  type="button"
                  className="px-4 py-2 bg-gray-800 text-white rounded-xl text-sm font-medium hover:bg-black transition-colors whitespace-nowrap"
                  onClick={() => alert('인증 메일이 발송되었습니다.')}
                >
                  인증요청
                </button>
              </div>
            </div>
            <button type="submit" className="w-full bg-festival-purple text-white font-bold py-3 rounded-xl shadow-lg shadow-festival-purple/20 transition-all transform active:scale-[0.98] mt-4">
              비밀번호 재설정 링크 발송
            </button>
          </div>
        )}
      </form>

      <div className="mt-8 pt-6 border-t border-gray-50 flex justify-center gap-6 text-sm">
        <Link to="/login" className="text-gray-500 hover:text-festival-purple">로그인으로 돌아가기</Link>
        <span className="text-gray-200">|</span>
        <Link to="/signup" className="text-gray-500 hover:text-festival-purple">회원가입</Link>
      </div>
    </AuthLayout>
  );
};

export default FindAccountPage;
