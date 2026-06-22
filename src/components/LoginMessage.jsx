import React from 'react';

const LoginMessage = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-3xl p-8 w-[420px] shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">
          로그인이 필요합니다
        </h3>

        <p className="text-gray-600 mb-8 leading-relaxed">
          해당 기능은 회원만 이용할 수 있습니다.
          <br />
          로그인 또는 회원가입 후 이용해주세요.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => (window.location.href = '/login')}
            className="flex-1 h-12 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700"
          >
            로그인하기
          </button>

          <button
            onClick={() => (window.location.href = '/signup')}
            className="flex-1 h-12 border border-gray-300 rounded-xl font-semibold hover:bg-gray-50"
          >
            회원가입하기
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
};

export default LoginMessage;
