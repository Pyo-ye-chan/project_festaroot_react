import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-[#f9fafb] px-6 py-8 font-sans text-gray-500">
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-xl font-black text-gray-800">
            축제로
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[12px] font-bold text-gray-600">
            <Link to="/privacy" className="transition-colors hover:text-[#6B46FE]">
              개인정보처리방침
            </Link>
            <Link to="/terms" className="transition-colors hover:text-[#6B46FE]">
              이용약관
            </Link>
            <Link to="/location-terms" className="transition-colors hover:text-[#6B46FE]">
              위치기반서비스 이용약관
            </Link>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5 text-[11px] leading-relaxed">
          <p className="text-sm font-semibold text-gray-700">
            본 서비스는 한국정보교육원 프로젝트 과정에서 제작된 포트폴리오 서비스입니다.
          </p>
          <p className="mt-2">
            축제 정보는 공공데이터 및 외부 API를 기반으로 제공되며, 실제 운영 정보와 다를 수 있습니다.
          </p>
          <p className="mt-1">
            실제 방문 전 축제 공식 홈페이지 또는 주최 측 안내를 확인해주세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-[11px] md:flex-row md:items-center md:justify-between">
          <p className="font-medium text-gray-400">
            © {new Date().getFullYear()} FestaRoute Project Team. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
