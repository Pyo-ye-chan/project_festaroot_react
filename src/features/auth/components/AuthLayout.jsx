import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, maxWidth = 'max-w-md' }) => {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#111111] font-['Pretendard']">


      <main className={`${maxWidth} mx-auto px-6 py-12 lg:py-20`}>
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-[900] tracking-tight text-[#111] mb-3">{title}</h1>
          <p className="text-[#666] font-medium">{subtitle || '축제와 여행을 잇는 감성 플랫폼'}</p>
        </div>
        
        <div className="bg-white rounded-[32px] border border-[#eee] shadow-[0_20px_50px_rgba(0,0,0,0.03)] p-8 sm:p-10">
          {children}
        </div>
        

      </main>
    </div>
  );
};

export default AuthLayout;
