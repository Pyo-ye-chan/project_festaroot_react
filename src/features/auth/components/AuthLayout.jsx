import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, maxWidth = 'max-w-md' }) => {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#111111] font-['Pretendard']">
      {/* Header consistent with the app's branding */}
      <header className="h-[80px] bg-white/80 backdrop-blur-xl border-b border-[#eee] sticky top-0 z-50">
        <div className="max-w-[1200px] mx-auto h-full px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-festival-purple flex items-center justify-center text-white shadow-lg shadow-purple-100">
              <Sparkles size={20} fill="currentColor" />
            </div>
            <span className="text-[22px] font-[900] tracking-tight text-[#22114f]">축제로</span>
          </Link>
          <div className="flex items-center gap-6 text-[15px] font-bold text-gray-500">
            <Link to="/login" className="hover:text-festival-purple transition-colors">로그인</Link>
            <Link to="/signup" className="text-festival-purple hover:text-festival-purple/80 transition-colors">회원가입</Link>
          </div>
        </div>
      </header>

      <main className={`${maxWidth} mx-auto px-6 py-12 lg:py-20`}>
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-[900] tracking-tight text-[#111] mb-3">{title}</h1>
          <p className="text-[#666] font-medium">{subtitle || '축제와 여행을 잇는 감성 플랫폼'}</p>
        </div>
        
        <div className="bg-white rounded-[32px] border border-[#eee] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 sm:p-10">
          {children}
        </div>
        
        <div className="mt-12 text-center text-sm text-gray-400 font-bold">
          &copy; {new Date().getFullYear()} FestaRoute. All rights reserved.
        </div>
      </main>
    </div>
  );
};

export default AuthLayout;
