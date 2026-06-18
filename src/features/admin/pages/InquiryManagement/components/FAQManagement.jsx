import React, { useMemo, useState, useEffect } from 'react';
import {
  Search,
  CheckCircle2,
  Trash2,
  X,
  Plus,
  HelpCircle,
  FileEdit,
  AlignLeft,
  RotateCcw,
} from 'lucide-react';
import {
  getFaqList,
  addFaq,
  updateFaq,
  deleteFaq
} from '../../../../../api/faqApi';
import LoadingSpinner from '../../../../../components/LoadingSpinner';

const FAQ_CATEGORIES = {
  ALL: '전체 카테고리',
  USAGE: '이용방법',
  ACCOUNT: '계정/인증',
  FESTIVAL: '축제/예약',
  COMMUNITY: '커뮤니티',
};

const FAQManagement = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [faqKeyword, setFaqKeyword] = useState('');
  const [faqCategory, setFaqCategory] = useState('ALL');
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({ category: 'USAGE', question: '', answer: '', display_order: 1 });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const response = await getFaqList();
      const result = response.data;
      let data = [];
      if (result && Array.isArray(result)) {
        data = result;
      } else if (result && result.success && Array.isArray(result.data)) {
        data = result.data;
      }
      
      // display_order 기준 정렬
      const sortedData = [...data].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
      setFaqs(sortedData);
    } catch (error) {
      console.error('Failed to fetch FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

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
      setFaqForm({ 
        category: faq.category, 
        question: faq.question, 
        answer: faq.answer,
        display_order: faq.display_order || 1
      });
      setSelectedFaq(faq);
    } else {
      setFaqForm({ category: 'USAGE', question: '', answer: '', display_order: faqs.length + 1 });
      setSelectedFaq(null);
    }
    setIsFaqModalOpen(true);
  };

  const handleSubmitFaq = async () => {
    if (!faqForm.question.trim() || !faqForm.answer.trim()) return;
    
    // 순서 유효성 검사 추가 (총 개수를 넘지 못하도록)
    const totalCount = faqs.length;
    const maxOrder = selectedFaq ? totalCount : totalCount + 1;
    
    if (faqForm.display_order > maxOrder) {
      alert(`노출 순서는 총 개수(${maxOrder}개)를 초과할 수 없습니다.`);
      return;
    }

    if (faqForm.display_order < 1) {
      alert('노출 순서는 1 이상의 숫자여야 합니다.');
      return;
    }
    
    try {
      if (selectedFaq) {
        const faqId = selectedFaq.faq_id || selectedFaq.id;
        const response = await updateFaq(faqId, faqForm);
        if (response.data?.success) {
          alert('FAQ가 수정되었습니다.');
          fetchFaqs();
        } else {
          alert(response.data?.message || '수정에 실패했습니다.');
        }
      } else {
        const response = await addFaq(faqForm);
        if (response.data?.success) {
          alert('새 FAQ가 등록되었습니다.');
          fetchFaqs();
        } else {
          alert(response.data?.message || '등록에 실패했습니다.');
        }
      }
      setIsFaqModalOpen(false);
    } catch (error) {
      console.error('Failed to submit FAQ:', error);
      alert('오류가 발생했습니다.');
    }
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        const response = await deleteFaq(id);
        if (response.data?.success) {
          alert('FAQ가 삭제되었습니다.');
          fetchFaqs();
        } else {
          alert(response.data?.message || '삭제에 실패했습니다.');
        }
      } catch (error) {
        console.error('Failed to delete FAQ:', error);
        alert('오류가 발생했습니다.');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

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
          <button onClick={fetchFaqs} className="h-11 w-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-[#6d3df2] transition shadow-sm">
            <RotateCcw size={18} />
          </button>
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
          <div key={faq.faq_id || faq.id} className="group rounded-[32px] border border-gray-100 bg-white p-7 shadow-sm transition-all hover:shadow-md hover:border-[#6d3df2]/20">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-[#6d3df2] bg-purple-50 px-2.5 py-1 rounded-full uppercase">
                    {FAQ_CATEGORIES[faq.category] || faq.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">등록일: {faq.created_at || faq.createdAt}</span>
                </div>
                <div>
                  <h4 className="text-base font-black text-gray-900 group-hover:text-[#6d3df2] transition-colors">
                    Q. {faq.question}
                  </h4>
                  <p className="mt-3 text-sm font-bold text-gray-500 leading-relaxed whitespace-pre-wrap">
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
                  onClick={() => handleDeleteFaq(faq.faq_id || faq.id)}
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
              <div className="grid grid-cols-2 gap-4">
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
                  <label className="text-xs font-black text-gray-400 uppercase ml-1">노출 순서 (Display Order)</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedFaq ? faqs.length : faqs.length + 1}
                    placeholder="순서"
                    value={faqForm.display_order}
                    onChange={(e) => setFaqForm({ ...faqForm, display_order: parseInt(e.target.value) || 1 })}
                    className="h-14 w-full rounded-2xl border border-gray-200 bg-white px-5 text-sm font-bold outline-none transition focus:border-[#6d3df2] focus:ring-4 focus:ring-purple-100"
                  />
                </div>
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