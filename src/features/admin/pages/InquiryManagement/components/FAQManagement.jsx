import React, { useMemo, useState } from 'react';
import {
  Search,
  CheckCircle2,
  Trash2,
  X,
  Plus,
  HelpCircle,
  FileEdit,
  AlignLeft,
} from 'lucide-react';

const FAQ_CATEGORIES = {
  ALL: '전체 카테고리',
  USAGE: '이용방법',
  ACCOUNT: '계정/인증',
  FESTIVAL: '축제/예약',
  COMMUNITY: '커뮤니티',
};

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

const FAQManagement = () => {
  const [faqs, setFaqs] = useState(dummyFaqs);
  const [faqKeyword, setFaqKeyword] = useState('');
  const [faqCategory, setFaqCategory] = useState('ALL');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({ category: 'USAGE', question: '', answer: '' });

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

  const handleOpenFaqModal = (faq = null) => {
    if (faq) {
      setFaqForm({ category: faq.category, question: faq.question, answer: faq.answer });
      setSelectedFaq(faq);
    } else {
      setFaqForm({ category: 'USAGE', question: '', answer: '' });
      setSelectedFaq(null);
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
    <div className="space-y-6">
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

export default FAQManagement;