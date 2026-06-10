import React from 'react';

const MyAccountSettingsTab = ({ userDetails }) => {
  if (!userDetails) return null;
  const { member } = userDetails;

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <header className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">계정 설정</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">개인 정보와 계정 보안 설정을 관리하세요.</p>
      </header>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span className="text-xl">👤</span> 프로필 정보
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">닉네임</label>
              <input 
                type="text" 
                defaultValue={member.nickname}
                className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">이메일 주소</label>
              <input 
                type="email" 
                defaultValue={member.email}
                disabled
                className="w-full bg-gray-100 border-none rounded-2xl px-4 py-3.5 text-sm font-bold text-gray-400 cursor-not-allowed outline-none"
              />
              <p className="text-[10px] text-gray-400 ml-1 italic">* 이메일은 변경할 수 없습니다.</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 flex justify-end">
            <button className="px-8 py-3 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100">
              정보 저장하기
            </button>
          </div>
        </section>

        {/* Security Section */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span className="text-xl">🔒</span> 보안 설정
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
              <div>
                <p className="font-bold text-gray-800">비밀번호 변경</p>
                <p className="text-xs text-gray-500 mt-0.5">주기적인 비밀번호 변경으로 계정을 안전하게 보호하세요.</p>
              </div>
              <button className="px-5 py-2.5 bg-white text-gray-700 border border-gray-200 text-xs font-black rounded-xl hover:bg-gray-50 transition-all">
                변경하기
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 gap-4">
              <div>
                <p className="font-bold text-gray-800">2단계 인증</p>
                <p className="text-xs text-gray-500 mt-0.5">로그인 시 추가 인증을 통해 보안을 강화합니다.</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md uppercase">Disabled</span>
                <button className="px-5 py-2.5 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-gray-800 transition-all">
                  설정하기
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Account Deletion */}
        <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <span className="text-xl">👋</span> 서비스 탈퇴
            </h3>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed px-1">
            탈퇴 시 모든 활동 기록 및 저장된 플래너 데이터가 삭제되며 복구할 수 없습니다. 
            신중하게 결정해 주세요.
          </p>
          <div className="pt-2 flex justify-start">
            <button className="text-sm font-bold text-gray-400 hover:text-rose-500 hover:underline transition-all">
              계정을 삭제하시겠습니까?
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyAccountSettingsTab;
