import React, { useState } from 'react';
import {
  MessageCircle,
  HelpCircle,
} from 'lucide-react';
import InquiryManagement from '../components/InquiryManagement';
import FAQManagement from '../components/FAQManagement';

const InquiryManagementPage = () => {
  const [activeTab, setActiveTab] = useState('INQUIRY'); // INQUIRY | FAQ

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 상단 헤더 */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">고객 지원 관리</h1>
          <p className="mt-1 text-sm font-bold text-gray-400">
            사용자 문의 응대 및 자주 묻는 질문을 관리합니다.
          </p>
        </div>

        <div className="flex h-12 items-center rounded-2xl border border-gray-100 bg-gray-50/50 p-1">
          <button
            onClick={() => setActiveTab('INQUIRY')}
            className={`flex h-full items-center gap-2 px-6 text-sm font-black transition-all rounded-xl ${
              activeTab === 'INQUIRY' ? 'bg-white text-[#6d3df2] shadow-md' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <MessageCircle size={16} />
            문의 관리
          </button>
          <button
            onClick={() => setActiveTab('FAQ')}
            className={`flex h-full items-center gap-2 px-6 text-sm font-black transition-all rounded-xl ${
              activeTab === 'FAQ' ? 'bg-white text-[#6d3df2] shadow-md' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <HelpCircle size={16} />
            FAQ 관리
          </button>
        </div>
      </div>

      {activeTab === 'INQUIRY' ? (
        <InquiryManagement />
      ) : (
        <FAQManagement />
      )}
    </div>
  );
};

export default InquiryManagementPage;