import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#f9fafb] text-gray-500 border-t border-gray-200 py-8 px-6 font-sans">
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Top: Logo & Legal Links */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-xl font-black text-gray-300">
            축제로
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-bold text-gray-600">
            <a href="#" className="hover:text-gray-900 transition-colors">개인정보처리방침</a>
            <a href="#" className="hover:text-gray-900 transition-colors">이용약관</a>
            <a href="#" className="hover:text-gray-900 transition-colors">위치기반서비스 이용약관</a>
          </div>
        </div>

        {/* Middle: Company Info (Condensed) */}
        <div className="text-[11px] leading-relaxed border-t border-gray-100 pt-5">
          <div className="flex flex-wrap gap-x-3 gap-y-1 items-center">
            <span className="font-bold text-gray-600">(주)축제로</span>
            <span className="w-[1px] h-2 bg-gray-200" />
            <span>대표이사: 홍길동</span>
            <span className="w-[1px] h-2 bg-gray-200" />
            <span>사업자등록번호: 000-00-00000</span>
            <span className="w-[1px] h-2 bg-gray-200" />
            <span>통신판매업신고: 제2026-서울강남-0000호</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1">
            <span>주소: 서울특별시 강남구 테헤란로 000 축제로 타워 10층</span>
            <span className="w-[1px] h-2 bg-gray-200 hidden md:inline" />
            <span>TEL: 02-000-0000</span>
            <span className="w-[1px] h-2 bg-gray-200" />
            <span>고객센터: 1588-0000 (평일 09-18시)</span>
          </div>
          <p className="mt-3 text-gray-400">
            축제로는 통신판매중개자로서 상품 정보 및 거래에 대해 책임을 지지 않습니다.
          </p>
        </div>

        {/* Bottom: Copyright & Social */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[11px]">
          <p className="text-gray-400 font-medium">
            © {new Date().getFullYear()} CHUKJERO Corp. All rights reserved.
          </p>
          {/* <div className="flex gap-5">
            {['Instagram', 'Facebook', 'Blog'].map((sns) => (
              <a key={sns} href="#" className="font-semibold hover:text-[#6B46FE] transition-colors">{sns}</a>
            ))}
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
