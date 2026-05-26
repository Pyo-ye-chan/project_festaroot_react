import React from 'react';

const AuthLayout = ({ children, title, subtitle, maxWidth = 'max-w-md' }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-white p-4 py-12">
      <div className={`w-full ${maxWidth}`}>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-festival-purple mb-2">축제로</h1>
          <p className="text-gray-500">{subtitle || '축제와 여행을 잇는 감성 플랫폼'}</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {title && (
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{title}</h2>
          )}
          {children}
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} FestaRoute. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
