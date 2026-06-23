import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle, maxWidth = 'max-w-md' }) => {
  const primaryPurple = '#6B46FE';

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#111111] font-['Pretendard']">
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

      <main className={`${maxWidth} mx-auto px-6 py-12 lg:py-20`}>
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-[900] tracking-tight text-[#111] mb-3">
            {title}
          </h1>
          <p className="text-[#666] font-medium">
            {subtitle || '축제와 여행을 잇는 감성 플랫폼'}
          </p>
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