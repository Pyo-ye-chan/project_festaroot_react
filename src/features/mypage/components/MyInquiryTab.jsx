import React from 'react';

const MyInquiryTab = () => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0">
        <h1 className="text-2xl sm:text-3xl font-black text-gray-900">문의하기</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">궁금한 점이나 불편한 사항을 남겨주시면 정성껏 답변해 드리겠습니다.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Inquiry Form */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-xl">✍️</span> 1:1 문의 작성
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">문의 유형</label>
                <select className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none">
                  <option>서비스 이용 문의</option>
                  <option>축제 정보 수정 요청</option>
                  <option>커뮤니티/게시글 신고</option>
                  <option>기타 문의</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">제목</label>
                <input 
                  type="text" 
                  placeholder="제목을 입력해주세요"
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">내용</label>
                <textarea 
                  rows="6"
                  placeholder="문의하실 내용을 상세히 적어주세요."
                  className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none resize-none"
                ></textarea>
              </div>
              <button className="w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 mt-2">
                문의 등록하기
              </button>
            </form>
          </section>
        </div>

        {/* Inquiry History */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm h-full">
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-xl">📋</span> 최근 문의 내역
            </h3>
            <div className="space-y-4">
              {[
                { id: 1, title: '축제 일정이 잘못된 것 같아요', date: '2024.05.28', status: '답변완료', statusColor: 'bg-green-50 text-green-600' },
                { id: 2, title: '계정 비밀번호를 변경하고 싶습니다', date: '2024.05.15', status: '검토중', statusColor: 'bg-blue-50 text-blue-600' },
                { id: 3, title: 'AI 플래너 장소 추가 제안', date: '2024.04.30', status: '답변완료', statusColor: 'bg-green-50 text-green-600' },
              ].map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-purple-200 transition-all">
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.statusColor}`}>
                      {item.status}
                    </span>
                    <span className="text-[10px] font-bold text-gray-400">{item.date}</span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors truncate">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-400 font-medium mb-1">고객센터 운영시간</p>
              <p className="text-xs text-gray-500 font-bold">평일 09:00 ~ 18:00 (주말/공휴일 제외)</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyInquiryTab;
