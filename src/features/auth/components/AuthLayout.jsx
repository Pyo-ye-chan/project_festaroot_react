import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const AuthLayout = ({ children, title, subtitle, maxWidth = 'max-w-md' }) => {

  const primaryPurple = '#5b21b6';
  
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#111111] font-['Pretendard']">
      {/* Header consistent with the app's branding */}
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
