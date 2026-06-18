import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  RotateCcw,
  ShieldAlert,
  CheckCircle2,
  Clock,
  MessageCircle,
  Eye,
  X,
  User,
  Calendar,
  Paperclip,
} from 'lucide-react';
import { 
  getAdminInquiryList, 
  saveInquiryAnswer 
} from '../../../../../api/inquiryApi';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

const INQUIRY_CATEGORIES = {
  ALL: '전체 카테고리',
  ACCOUNT: '계정/인증',
  FESTIVAL: '축제 정보',
  GATHERING: '모임/커뮤니티',
  REPORT: '신고/이용제한',
  ERROR: '오류 제보',
  ETC: '기타 문의',
};

const InquiryManagement = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inquiryKeyword, setInquiryKeyword] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answerText, setAnswerText] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      setLoading(true);
      const response = await getAdminInquiryList();
      const result = response.data;
      
      if (result && Array.isArray(result)) {
        setInquiries(result);
      } else if (result && Array.isArray(result.list)) {
        setInquiries(result.list);
      } else if (result && result.success && Array.isArray(result.data)) {
        setInquiries(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const lowerKeyword = inquiryKeyword.trim().toLowerCase();
      const title = item.title || '';
      const author = item.member_id || item.author || '';
      const id = String(item.inquiry_id || item.id || '');

      const keywordMatch = !lowerKeyword || 
        title.toLowerCase().includes(lowerKeyword) ||
        author.toLowerCase().includes(lowerKeyword) ||
        id.toLowerCase().includes(lowerKeyword);
      
      const categoryMatch = inquiryCategory === 'ALL' || item.category === inquiryCategory;
      
      const isAnswered = item.status === 1 || item.status === 'ANSWERED' || !!item.answer;
      const currentStatus = isAnswered ? 'ANSWERED' : 'PENDING';
      const statusMatch = statusFilter === 'ALL' || currentStatus === statusFilter;
      
      return keywordMatch && categoryMatch && statusMatch;
    });
  }, [inquiries, inquiryKeyword, inquiryCategory, statusFilter]);

  const handleOpenInquiryDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAnswerText(inquiry.answer || '');
  };

  const handleSubmitInquiryAnswer = async () => {
    if (!answerText.trim()) return;
    const inquiryId = selectedInquiry.inquiry_id || selectedInquiry.id;
    
    try {
      const response = await saveInquiryAnswer(inquiryId, { content : answerText });
      const result = response.data;
      if (result && result.success) {
        alert('답변이 등록되었습니다.');
        fetchInquiries();
        setSelectedInquiry(null);
      } else {
        alert(result?.message || '답변 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('Failed to save answer:', error);
      alert('오류가 발생했습니다.');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Inquiry Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[
          { label: '전체 문의', value: inquiries.length, color: 'text-gray-900', icon: MessageCircle, bg: 'bg-white' },
          { label: '대기 중', value: inquiries.filter(i => (i.status === 0 || i.status === 'PENDING') && !i.answer).length, color: 'text-orange-500', icon: Clock, bg: 'bg-orange-50/50' },
          { label: '답변 완료', value: inquiries.filter(i => (i.status === 1 || i.status === 'ANSWERED' || !!i.answer)).length, color: 'text-[#6d3df2]', icon: CheckCircle2, bg: 'bg-purple-50/50' },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-[32px] border border-gray-100 p-6 shadow-sm ${stat.bg}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className={`mt-2 text-3xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ${stat.color}`}>
                <stat.icon size={28} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Inquiry Filter & Table */}
      <div className="rounded-[32px] border border-gray-100 bg-white p-6 shadow-sm space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <select
              value={inquiryCategory}
              onChange={(e) => setInquiryCategory(e.target.value)}
              className="h-12 w-[160px] appearance-none rounded-2xl border border-gray-200 bg-white pl-5 pr-10 text-sm font-bold text-gray-600 outline-none transition focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
            >
              {Object.entries(INQUIRY_CATEGORIES).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <div className="flex rounded-2xl border border-gray-100 bg-gray-50/50 p-1">
              {['ALL', 'PENDING', 'ANSWERED'].map((f) => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`px-5 py-2 text-xs font-black transition-all rounded-xl ${
                    statusFilter === f ? 'bg-white text-[#6d3df2] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {f === 'ALL' ? '전체' : f === 'PENDING' ? '대기' : '완료'}
                </button>
              ))}
            </div>
            <button onClick={fetchInquiries} className="h-11 w-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-[#6d3df2] transition shadow-sm">
              <RotateCcw size={18} />
            </button>
          </div>
          <div className="relative w-full lg:w-[320px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="제목, 작성자, ID 검색"
              value={inquiryKeyword}
              onChange={(e) => setInquiryKeyword(e.target.value)}
              className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm font-bold outline-none focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/30">
                <th className="px-7 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">상태</th>
                <th className="px-7 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">카테고리</th>
                <th className="px-7 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">제목</th>
                <th className="px-7 py-5 text-xs font-black text-gray-400 uppercase tracking-wider">작성자</th>
                <th className="px-7 py-5 text-xs font-black text-gray-400 uppercase tracking-wider text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredInquiries.map((item) => {
                const isAnswered = item.status === 1 || item.status === 'ANSWERED' || !!item.answer;
                return (
                  <tr key={item.inquiry_id || item.id} className="group transition hover:bg-gray-50/50">
                    <td className="px-7 py-5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black ${
                        isAnswered ? 'bg-purple-50 text-[#6d3df2]' : 'bg-orange-50 text-orange-500'
                      }`}>
                        {isAnswered ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {isAnswered ? '완료' : '대기'}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        {INQUIRY_CATEGORIES[item.category] || item.category}
                      </span>
                    </td>
                    <td className="px-7 py-5">
                      <button onClick={() => handleOpenInquiryDetail(item)} className="text-sm font-bold text-gray-800 hover:text-[#6d3df2] hover:underline transition text-left line-clamp-1">
                        {item.title}
                      </button>
                    </td>
                    <td className="px-7 py-5 text-sm font-bold text-gray-600">{item.member_id || item.author}</td>
                    <td className="px-7 py-5 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => handleOpenInquiryDetail(item)} className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 transition hover:border-[#6d3df2] hover:text-[#6d3df2] hover:shadow-sm">
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredInquiries.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-7 py-20 text-center">
                    <p className="text-gray-400 font-bold text-sm">문의 내역이 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[40px] bg-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm text-[#6d3df2]"><ShieldAlert size={20} /></div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">문의 상세보기</h3>
                  <p className="text-xs font-bold text-gray-400">ID: {selectedInquiry.inquiry_id || selectedInquiry.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm"><X size={20} /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-8 py-8 space-y-8">
              <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-50 p-5">
                <div className="flex items-center gap-3 min-w-[140px]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400"><User size={18} /></div><div><p className="text-[10px] font-black text-gray-400">작성자</p><p className="text-sm font-bold text-gray-900">{selectedInquiry.member_id || selectedInquiry.author}</p></div></div>
                <div className="flex items-center gap-3 min-w-[140px]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400"><Calendar size={18} /></div><div><p className="text-[10px] font-black text-gray-400">작성일</p><p className="text-sm font-bold text-gray-900">{selectedInquiry.created_at || selectedInquiry.createdAt}</p></div></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#6d3df2]"></span><h4 className="text-sm font-black text-gray-900">문의 내용</h4></div>
                <div className="rounded-3xl border border-gray-100 p-6 bg-white shadow-sm">
                  <p className="mb-4 text-lg font-black text-gray-900">{selectedInquiry.title}</p>
                  <div 
                    className="text-sm font-bold leading-7 text-gray-600 inquiry-content"
                    dangerouslySetInnerHTML={{ __html: selectedInquiry.content }}
                  />

                  {selectedInquiry.attachments && selectedInquiry.attachments.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-gray-50">
                      <h4 className="text-xs font-black text-gray-400 mb-4 flex items-center gap-2 uppercase tracking-wider">
                        <Paperclip className="w-3.5 h-3.5" /> 첨부파일 ({selectedInquiry.attachments.length})
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedInquiry.attachments.map((file, idx) => (
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
              </div>
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-400"></span><h4 className="text-sm font-black text-gray-900">관리자 답변</h4></div></div>
                <textarea placeholder="문의에 대한 답변을 입력해주세요..." value={answerText} onChange={(e) => setAnswerText(e.target.value)} className="min-h-[160px] w-full resize-none rounded-3xl border border-gray-200 bg-white p-6 text-sm font-bold outline-none focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100" />
              </div>
            </div>
            <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-6">
              <button onClick={() => setSelectedInquiry(null)} className="flex-1 py-4 text-sm font-black text-gray-500 bg-white border border-gray-200 rounded-2xl">닫기</button>
              <button onClick={handleSubmitInquiryAnswer} className="flex-[2] py-4 text-sm font-black text-white bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] rounded-2xl shadow-lg shadow-purple-100">답변 등록하기</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManagement;