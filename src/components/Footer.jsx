import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-50 text-gray-800 border-t border-gray-200 pt-16 pb-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="text-2xl font-bold text-[#6B46FE] flex items-center gap-2">
            축제로
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            전국의 다양한 축제와 여행 정보를 한눈에!<br />
            축제로와 함께 특별한 하루를 만들어보세요.
          </p>
          <div className="flex gap-2 pt-2">
            <span className="bg-[#FFB800] px-3 py-1 rounded-full text-[10px] text-white font-semibold">
              #대한민국축제
            </span>
            <span className="bg-[#6B46FE] px-3 py-1 rounded-full text-[10px] text-white font-semibold">
              #축제정보
            </span>
          </div>
        </div>

        {/* Menu Columns */}
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">서비스</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">축제 찾기</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">지역별 축제</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">테마별 추천</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">여행 정보</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">커뮤니티</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">축제 후기</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">자유게시판</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">이벤트</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">뉴스레터</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">고객센터</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">공지사항</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">자주 묻는 질문</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">1:1 문의</a></li>
            <li><a href="#" className="hover:text-[#6B46FE] transition-colors">제휴 문의</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-center md:text-left">
          <p className="text-xs text-gray-400 italic">© {new Date().getFullYear()} 축제로 (Chukjero). All rights reserved.</p>
          <div className="mt-2 flex gap-4 text-xs">
            <a href="#" className="font-semibold text-gray-700 hover:text-[#6B46FE]">개인정보처리방침</a>
            <a href="#" className="text-gray-400 hover:text-[#6B46FE]">이용약관</a>
          </div>
        </div>
        
        <div className="flex gap-3">
          {['📸', '📘', '📝', '🎬'].map((icon, idx) => (
            <div key={idx} className="w-9 h-9 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer hover:border-[#6B46FE] hover:shadow-sm transition-all grayscale hover:grayscale-0">
              <span className="text-lg">{icon}</span>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
