import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const MOCK_REPORTS = [
  {
    id: 1,
    festivalTitle: "진해군항제",
    author: "홍길동",
    content: "축제장 음식이 너무 비싸고 위생이 불량합니다.",
    reporter: "이영희",
    reason: "욕설 및 비방",
    createdAt: "2026-04-01",
    status: "PENDING"
  },
  {
    id: 2,
    festivalTitle: "보령머드축제",
    author: "김철수",
    content: "이 축제 정말 재미없어요. 절대 가지 마세요.",
    reporter: "박민수",
    reason: "부적절한 홍보/스팸",
    createdAt: "2026-07-18",
    status: "RESOLVED"
  }
];

const FestivalReportSection = () => {
  const getReportStatusBadge = (status) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2 py-1 rounded-md bg-amber-50 text-amber-600 text-[10px] font-black border border-amber-100">
            처리대기
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="px-2 py-1 rounded-md bg-green-50 text-green-600 text-[10px] font-black border border-green-100">
            처리완료
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {MOCK_REPORTS.map((report) => (
        <div key={report.id} className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm hover:shadow-md transition-all">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-3">
                {getReportStatusBadge(report.status)}
                <span className="text-sm font-black text-[#6d3df2]">{report.festivalTitle}</span>
                <span className="text-[11px] font-bold text-gray-300">|</span>
                <span className="text-[11px] font-bold text-gray-400">신고일: {report.createdAt}</span>
              </div>
              
              <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 relative">
                <p className="text-sm font-bold text-gray-700 leading-relaxed italic">
                  "{report.content}"
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-purple-100 flex items-center justify-center text-[10px] font-black text-[#6d3df2]">
                    {report.author[0]}
                  </div>
                  <span className="text-xs font-bold text-gray-500">작성자: {report.author}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">신고자</span>
                  <span className="text-xs font-bold text-gray-700">{report.reporter}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">신고 사유</span>
                  <span className="text-xs font-bold text-red-500">{report.reason}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-col gap-2 shrink-0">
              <button className="flex-1 md:w-32 py-3 rounded-xl bg-white border border-gray-200 text-xs font-black text-gray-600 hover:bg-gray-50 transition shadow-sm">
                상세 보기
              </button>
              <button className="flex-1 md:w-32 py-3 rounded-xl bg-red-50 text-xs font-black text-red-600 hover:bg-red-100 transition border border-red-100 shadow-sm shadow-red-50">
                후기 삭제
              </button>
              <button className="flex-1 md:w-32 py-3 rounded-xl bg-gray-900 text-xs font-black text-white hover:bg-gray-800 transition shadow-lg shadow-gray-200">
                무시 처리
              </button>
            </div>
          </div>
        </div>
      ))}
      {MOCK_REPORTS.length === 0 && (
        <div className="py-32 text-center bg-white rounded-[40px] border border-dashed border-gray-200">
          <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-gray-300" size={32} />
          </div>
          <p className="text-gray-400 font-bold">새로운 신고 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default FestivalReportSection;
