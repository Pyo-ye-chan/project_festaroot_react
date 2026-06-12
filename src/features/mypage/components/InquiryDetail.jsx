import React from 'react';
import { ChevronLeft, Paperclip, MessageSquare, User, Clock, Edit3, Trash2 } from 'lucide-react';

const InquiryDetail = ({ inquiry, onBack, onEdit, onDelete, getStatusStyle, getStatusLabel, categoryMap }) => {
  if (!inquiry) return null;

  const isPending = inquiry.status === 'PENDING' || inquiry.status === '검토중';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Top Navigation */}
      <header className="flex items-center justify-between">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-black text-purple-600 hover:text-purple-700 transition-colors px-4 py-2 bg-purple-50 rounded-xl group"
        >
          <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          목록으로 돌아가기
        </button>

        {isPending && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit(inquiry)}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all px-3 py-2 rounded-xl border border-transparent hover:border-purple-100"
            >
              <Edit3 className="w-3.5 h-3.5" />
              수정
            </button>
            <button 
              onClick={() => onDelete(inquiry.inquiry_id)}
              className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all px-3 py-2 rounded-xl border border-transparent hover:border-red-100"
            >
              <Trash2 className="w-3.5 h-3.5" />
              삭제
            </button>
          </div>
        )}
      </header>

      {/* Main Content Card */}
      <section className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {/* Inquiry Header */}
        <div className="p-6 sm:p-8 border-b border-gray-50 bg-slate-50/30">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-[10px] font-black px-2.5 py-1 rounded-md ${getStatusStyle(inquiry.status)}`}>
              {getStatusLabel(inquiry.status)}
            </span>
            <span className="text-xs font-bold text-gray-400">
              {categoryMap[inquiry.category] || inquiry.category}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-2">{inquiry.title}</h2>
          <div className="flex items-center gap-3 text-[11px] font-bold text-gray-400">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> {inquiry.member_name || '작성자'}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> {inquiry.created_at}
            </span>
          </div>
        </div>

        {/* Inquiry Body */}
        <div className="p-6 sm:p-8 min-h-[200px]">
          <div 
            className="prose prose-sm max-w-none text-gray-700 font-medium leading-relaxed inquiry-content"
            dangerouslySetInnerHTML={{ __html: inquiry.content }}
          />
          
          {inquiry.attachments && inquiry.attachments.length > 0 && (
            <div className="mt-8 pt-8 border-t border-gray-50">
              <h4 className="text-xs font-black text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                <Paperclip className="w-3.5 h-3.5" /> 첨부파일 ({inquiry.attachments.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {inquiry.attachments.map((file, idx) => (
                  <a 
                    key={idx}
                    href={file.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-100 rounded-xl text-[11px] font-bold text-gray-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-100 transition-all"
                  >
                    <Paperclip className="w-3 h-3" />
                    {file.file_name || `첨부파일 ${idx + 1}`}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Answer Section (Comment Style) */}
        <div className="bg-slate-50/50 p-6 sm:p-8 border-t border-gray-100">
          <h3 className="text-sm font-black text-gray-800 mb-6 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-purple-600" /> 
            답변 내역
          </h3>

          {inquiry.answer_content ? (
            <div className="space-y-6">
              <div className="flex gap-4 group">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                    <User className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-gray-900">운영자</span>
                      <span className="px-1.5 py-0.5 bg-purple-100 text-[10px] font-black text-purple-600 rounded">관리자</span>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{inquiry.answered_at}</span>
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-purple-100/50 shadow-sm relative">
                    {/* Speech bubble tail */}
                    <div className="absolute -left-2 top-0 w-2 h-2 bg-white border-l border-t border-purple-100/50 rotate-[-45deg] hidden sm:block"></div>
                    
                    <div 
                      className="text-sm text-gray-700 font-medium leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: inquiry.answer_content }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center bg-white/50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-sm text-gray-400 font-bold">담당자가 문의 내용을 확인하고 있습니다.</p>
              <p className="text-[11px] text-gray-300 mt-1 font-medium">조금만 기다려주시면 정성껏 답변해 드릴게요!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer Info */}
      <div className="px-4 py-6 bg-purple-50/50 rounded-2xl border border-purple-100/30 flex items-start gap-3">
        <div className="p-2 bg-white rounded-lg text-purple-600">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-black text-gray-700 mb-1">문의 답변 안내</p>
          <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
            문의하신 내용은 담당 부서 확인 후 순차적으로 답변드리고 있습니다.<br />
            보통 영업일 기준 1~3일 정도 소요될 수 있는 점 양해 부탁드립니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetail;
