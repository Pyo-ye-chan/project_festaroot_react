import React, { useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  ShieldAlert,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  MessageCircle,
  Eye,
  Trash2,
  X,
  Send,
  User,
  Calendar,
  Plus,
  HelpCircle,
  FileEdit,
  AlignLeft,
} from 'lucide-react';

const INQUIRY_CATEGORIES = {
  ALL: '전체 카테고리',
  ACCOUNT: '계정/인증',
  FESTIVAL: '축제 정보',
  GATHERING: '모임/커뮤니티',
  REPORT: '신고/이용제한',
  ERROR: '오류 제보',
  ETC: '기타 문의',
};

const FAQ_CATEGORIES = {
  ALL: '전체 카테고리',
  USAGE: '이용방법',
  ACCOUNT: '계정/인증',
  FESTIVAL: '축제/예약',
  COMMUNITY: '커뮤니티',
};

const dummyInquiries = [
  {
    id: 'INQ-1004',
    category: 'ERROR',
    title: '지도가 제대로 표시되지 않아요 ㅠㅠ',
    author: 'user_3942',
    createdAt: '2026.06.17 10:45',
    status: 'PENDING',
    content: '아이폰 Safari 브라우저에서 지도가 회색으로만 나옵니다. 캐시 삭제도 해봤는데 똑같아요. 확인 부탁드립니다.',
    email: 'user3942@naver.com',
  },
  {
    id: 'INQ-1003',
    category: 'GATHERING',
    title: '모임장 위임은 어떻게 하나요?',
    author: 'travel_lover',
    createdAt: '2026.06.17 09:12',
    status: 'PENDING',
    content: '제가 만든 모임의 방장을 다른 분께 넘겨드리고 싶은데 방법을 모르겠습니다.',
    email: 'travel@gmail.com',
  },
  {
    id: 'INQ-1002',
    category: 'ACCOUNT',
    title: '비밀번호 변경 메일이 안 와요',
    author: 'john_doe',
    createdAt: '2026.06.16 23:44',
    status: 'ANSWERED',
    content: '메일 주소 확인도 다 했는데 1시간째 안 오고 있어요. 스팸 메일함도 확인했습니다.',
    answer: '안녕하세요 john_doe님, 축제로 관리자입니다. 일시적인 메일 서버 부하로 인해 발송이 지연되었습니다. 현재는 정상화되었으니 다시 시도 부탁드립니다.',
    answeredAt: '2026.06.17 08:30',
    email: 'john@outlook.com',
  },
  {
    id: 'INQ-1001',
    category: 'REPORT',
    title: '부적절한 게시글 신고 결과 문의',
    author: 'safety_first',
    createdAt: '2026.06.16 15:20',
    status: 'ANSWERED',
    content: '어제 신고한 홍보성 게시글 처리가 어떻게 됐는지 궁금합니다.',
    answer: '신고하신 게시글은 내부 운영 원칙에 따라 게시중단(삭제) 처리되었습니다. 쾌적한 커뮤니티를 위해 제보해주셔서 감사합니다.',
    answeredAt: '2026.06.16 17:45',
    email: 'safety@daum.net',
  },
];

const dummyFaqs = [
  {
    id: 'FAQ-001',
    category: 'USAGE',
    question: 'AI 여행 플래너는 어떻게 사용하나요?',
    answer: '메인 페이지나 상세 페이지의 [AI 플래너] 버튼을 클릭한 후, 가고 싶은 축제와 동행 인원, 취향을 선택하면 AI가 최적의 동선을 설계해 드립니다.',
    createdAt: '2026.06.01',
  },
  {
    id: 'FAQ-002',
    category: 'ACCOUNT',
    question: '회원 탈퇴는 어디서 하나요?',
    answer: '마이페이지 > 계정 설정 하단의 [회원 탈퇴] 버튼을 통해 진행하실 수 있습니다. 탈퇴 시 모든 데이터는 복구가 불가능하니 주의해 주세요.',
    createdAt: '2026.06.05',
  },
  {
    id: 'FAQ-003',
    category: 'FESTIVAL',
    question: '축제 정보가 실제와 다른 경우는 어떻게 하나요?',
    answer: '축제 상세 페이지 하단의 [정보 수정 제안]이나 고객센터 문의를 통해 알려주시면 담당자가 확인 후 즉시 업데이트하겠습니다.',
    createdAt: '2026.06.10',
  },
];

const InquiryManagementPage = () => {
  const [activeTab, setActiveTab] = useState('INQUIRY'); // INQUIRY | FAQ
  
  // Inquiry States
  const [inquiries, setInquiries] = useState(dummyInquiries);
  const [inquiryKeyword, setInquiryKeyword] = useState('');
  const [inquiryCategory, setInquiryCategory] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [answerText, setAnswerText] = useState('');

  // FAQ States
  const [faqs, setFaqs] = useState(dummyFaqs);
  const [faqKeyword, setFaqKeyword] = useState('');
  const [faqCategory, setFaqCategory] = useState('ALL');
  const [selectedFaq, setSelectedInquiryFaq] = useState(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({ category: 'USAGE', question: '', answer: '' });

  // Inquiry Filter
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((item) => {
      const lowerKeyword = inquiryKeyword.trim().toLowerCase();
      const keywordMatch = !lowerKeyword || 
        item.title.toLowerCase().includes(lowerKeyword) ||
        item.author.toLowerCase().includes(lowerKeyword) ||
        item.id.toLowerCase().includes(lowerKeyword);
      const categoryMatch = inquiryCategory === 'ALL' || item.category === inquiryCategory;
      const statusMatch = statusFilter === 'ALL' || item.status === statusFilter;
      return keywordMatch && categoryMatch && statusMatch;
    });
  }, [inquiries, inquiryKeyword, inquiryCategory, statusFilter]);

  // FAQ Filter
  const filteredFaqs = useMemo(() => {
    return faqs.filter((item) => {
      const lowerKeyword = faqKeyword.trim().toLowerCase();
      const keywordMatch = !lowerKeyword || 
        item.question.toLowerCase().includes(lowerKeyword) ||
        item.answer.toLowerCase().includes(lowerKeyword);
      const categoryMatch = faqCategory === 'ALL' || item.category === faqCategory;
      return keywordMatch && categoryMatch;
    });
  }, [faqs, faqKeyword, faqCategory]);

  // Handlers
  const handleOpenInquiryDetail = (inquiry) => {
    setSelectedInquiry(inquiry);
    setAnswerText(inquiry.answer || '');
  };

  const handleSubmitInquiryAnswer = () => {
    if (!answerText.trim()) return;
    setInquiries(prev => prev.map(item => 
      item.id === selectedInquiry.id ? { ...item, status: 'ANSWERED', answer: answerText, answeredAt: new Date().toLocaleString() } : item
    ));
    alert('답변이 등록되었습니다.');
    setSelectedInquiry(null);
  };

  const handleOpenFaqModal = (faq = null) => {
    if (faq) {
      setFaqForm({ category: faq.category, question: faq.question, answer: faq.answer });
      setSelectedInquiryFaq(faq);
    } else {
      setFaqForm({ category: 'USAGE', question: '', answer: '' });
      setSelectedInquiryFaq(null);
    }
    setIsFaqModalOpen(true);
  };

  const handleSubmitFaq = () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;
    
    if (selectedFaq) {
      setFaqs(prev => prev.map(f => f.id === selectedFaq.id ? { ...f, ...faqForm } : f));
      alert('FAQ가 수정되었습니다.');
    } else {
      const newFaq = {
        id: `FAQ-${Date.now()}`,
        ...faqForm,
        createdAt: new Date().toLocaleDateString(),
      };
      setFaqs(prev => [newFaq, ...prev]);
      alert('새 FAQ가 등록되었습니다.');
    }
    setIsFaqModalOpen(false);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      setFaqs(prev => prev.filter(f => f.id !== id));
    }
  };

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
        <>
          {/* Inquiry Stats */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { label: '전체 문의', value: inquiries.length, color: 'text-gray-900', icon: MessageCircle, bg: 'bg-white' },
              { label: '대기 중', value: inquiries.filter(i => i.status === 'PENDING').length, color: 'text-orange-500', icon: Clock, bg: 'bg-orange-50/50' },
              { label: '답변 완료', value: inquiries.filter(i => i.status === 'ANSWERED').length, color: 'text-[#6d3df2]', icon: CheckCircle2, bg: 'bg-purple-50/50' },
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
                  {filteredInquiries.map((item) => (
                    <tr key={item.id} className="group transition hover:bg-gray-50/50">
                      <td className="px-7 py-5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-black ${
                          item.status === 'ANSWERED' ? 'bg-purple-50 text-[#6d3df2]' : 'bg-orange-50 text-orange-500'
                        }`}>
                          {item.status === 'ANSWERED' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                          {item.status === 'ANSWERED' ? '완료' : '대기'}
                        </span>
                      </td>
                      <td className="px-7 py-5">
                        <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                          {INQUIRY_CATEGORIES[item.category]}
                        </span>
                      </td>
                      <td className="px-7 py-5">
                        <button onClick={() => handleOpenInquiryDetail(item)} className="text-sm font-bold text-gray-800 hover:text-[#6d3df2] hover:underline transition">
                          {item.title}
                        </button>
                      </td>
                      <td className="px-7 py-5 text-sm font-bold text-gray-600">{item.author}</td>
                      <td className="px-7 py-5 text-center">
                        <button onClick={() => handleOpenInquiryDetail(item)} className="h-9 w-9 inline-flex items-center justify-center rounded-xl bg-white border border-gray-200 text-gray-400 transition hover:border-[#6d3df2] hover:text-[#6d3df2] hover:shadow-sm">
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* FAQ Filter & Action */}
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-wrap items-center gap-3">
              <select
                value={faqCategory}
                onChange={(e) => setFaqCategory(e.target.value)}
                className="h-12 w-[160px] appearance-none rounded-2xl border border-gray-200 bg-white pl-5 pr-10 text-sm font-bold text-gray-600 outline-none transition focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
              >
                {Object.entries(FAQ_CATEGORIES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
              <div className="relative w-full lg:w-[320px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder="질문 또는 답변 검색"
                  value={faqKeyword}
                  onChange={(e) => setFaqKeyword(e.target.value)}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-white pl-12 pr-4 text-sm font-bold outline-none focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
                />
              </div>
            </div>
            <button
              onClick={() => handleOpenFaqModal()}
              className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] px-6 text-sm font-black text-white shadow-lg shadow-purple-100 transition hover:brightness-110"
            >
              <Plus size={18} />
              신규 FAQ 등록
            </button>
          </div>

          {/* FAQ List */}
          <div className="grid grid-cols-1 gap-4">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="group rounded-[32px] border border-gray-100 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-[#6d3df2]/20">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-[#6d3df2] bg-purple-50 px-2.5 py-1 rounded-full uppercase">
                        {FAQ_CATEGORIES[faq.category]}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">등록일: {faq.createdAt}</span>
                    </div>
                    <div>
                      <h4 className="text-base font-black text-gray-900 group-hover:text-[#6d3df2] transition-colors">
                        Q. {faq.question}
                      </h4>
                      <p className="mt-3 text-sm font-bold text-gray-500 leading-relaxed line-clamp-2">
                        A. {faq.answer}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenFaqModal(faq)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <FileEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteFaq(faq.id)}
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredFaqs.length === 0 && (
              <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
                <p className="text-gray-400 font-bold">등록된 FAQ가 없습니다.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Inquiry Detail Modal (Moved to top level) */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-[40px] bg-white shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm text-[#6d3df2]"><ShieldAlert size={20} /></div>
                <div><h3 className="text-lg font-black text-gray-900">문의 상세보기</h3><p className="text-xs font-bold text-gray-400">ID: {selectedInquiry.id}</p></div>
              </div>
              <button onClick={() => setSelectedInquiry(null)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm"><X size={20} /></button>
            </div>
            <div className="max-h-[70vh] overflow-y-auto px-8 py-8 space-y-8">
              <div className="flex flex-wrap gap-4 rounded-3xl bg-gray-50 p-5">
                <div className="flex items-center gap-3 min-w-[140px]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400"><User size={18} /></div><div><p className="text-[10px] font-black text-gray-400">작성자</p><p className="text-sm font-bold text-gray-900">{selectedInquiry.author}</p></div></div>
                <div className="flex items-center gap-3 min-w-[140px]"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-gray-400"><Calendar size={18} /></div><div><p className="text-[10px] font-black text-gray-400">작성일</p><p className="text-sm font-bold text-gray-900">{selectedInquiry.createdAt}</p></div></div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#6d3df2]"></span><h4 className="text-sm font-black text-gray-900">문의 내용</h4></div>
                <div className="rounded-3xl border border-gray-100 p-6 bg-white shadow-sm"><p className="mb-3 text-lg font-black text-gray-900">{selectedInquiry.title}</p><p className="text-sm font-bold leading-7 text-gray-600 whitespace-pre-wrap">{selectedInquiry.content}</p></div>
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

      {/* FAQ Register/Edit Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-2xl overflow-hidden rounded-[40px] bg-white shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm text-[#6d3df2]">
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">{selectedFaq ? 'FAQ 수정' : '신규 FAQ 등록'}</h3>
                  <p className="text-xs font-bold text-gray-400">사용자들이 자주 묻는 질문을 {selectedFaq ? '수정합니다' : '추가합니다'}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsFaqModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm transition hover:text-gray-900"
              >
                <X size={20} />
              </button>
            </div>

            <div className="px-8 py-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">카테고리</label>
                <select
                  value={faqForm.category}
                  onChange={(e) => setFaqForm({ ...faqForm, category: e.target.value })}
                  className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 text-sm font-bold text-gray-700 outline-none transition focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
                >
                  {Object.entries(FAQ_CATEGORIES).filter(([k]) => k !== 'ALL').map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">질문 (Question)</label>
                <div className="relative">
                  <AlignLeft className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input
                    type="text"
                    placeholder="질문 내용을 입력하세요"
                    value={faqForm.question}
                    onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })}
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-5 text-sm font-bold outline-none transition focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase ml-1">답변 (Answer)</label>
                <textarea
                  placeholder="상세한 답변 내용을 입력하세요"
                  value={faqForm.answer}
                  onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })}
                  className="min-h-[180px] w-full resize-none rounded-[32px] border border-gray-200 bg-white p-6 text-sm font-bold leading-relaxed outline-none transition focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 border-t border-gray-100 bg-gray-50/50 px-8 py-6">
              <button 
                onClick={() => setIsFaqModalOpen(false)}
                className="flex-1 py-4 text-sm font-black text-gray-500 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 transition"
              >
                취소
              </button>
              <button 
                onClick={handleSubmitFaq}
                className="flex-[2] py-4 text-sm font-black text-white bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] rounded-2xl shadow-lg shadow-purple-100 hover:brightness-110 transition flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={18} />
                {selectedFaq ? 'FAQ 수정 완료' : 'FAQ 등록 완료'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InquiryManagementPage;