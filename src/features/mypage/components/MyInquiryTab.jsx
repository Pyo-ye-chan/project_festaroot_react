import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import MenuBar from '../../community/components/MenuBar';
import { uploadImage } from '../../../api/boardApi';
import { addInquiry, getMyInquiries, getInquiryDetail, deleteInquiry, updateInquiry } from '../../../api/inquiryApi';
import useAuthStore from '../../../store/useAuthStore';
import { Image as ImageIcon, Paperclip, XCircle } from 'lucide-react';
import InquiryDetail from './InquiryDetail';

const MyInquiryTab = () => {
  const { user } = useAuthStore();
  const [openFaq, setOpenFaq] = useState(null);
  const [formData, setFormData] = useState({
    category: 'SERVICE',
    title: '',
    content: ''
  });
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [inquiryHistory, setInquiryHistory] = useState([]);
  const [showAllInquiries, setShowAllInquiries] = useState(false);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categoryMap = {
    'SERVICE': '서비스 이용 문의',
    'UPDATE': '축제 정보 수정 요청',
    'REPORT': '커뮤니티/게시글 신고',
    'ETC': '기타 문의'
  };

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
    editorProps: {
      attributes: {
        class: 'min-h-[300px] outline-none text-sm font-medium leading-relaxed text-gray-700 p-4',
      },
    },
  });

  const fetchInquiryHistory = async () => {
    if (!user?.member_id && !user?.id) return;
    setIsLoadingHistory(true);
    try {
      const memberId = user.member_id || user.id;
      const resp = await getMyInquiries(memberId);
      setInquiryHistory(resp.data);
    } catch (error) {
      console.error('문의 내역 로드 실패:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleInquiryClick = async (inquiryId) => {
    setIsLoadingDetail(true);
    try {
      const resp = await getInquiryDetail(inquiryId);
      setSelectedInquiry(resp.data);
      setIsWriting(false);
    } catch (error) {
      console.error('문의 상세 로드 실패:', error);
      alert('상세 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoadingDetail(false);
    }
  };

  const handleWriteClick = () => {
    setIsWriting(true);
    setSelectedInquiry(null);
  };

  const handleCancelWrite = () => {
    setIsWriting(false);
    setEditingId(null);
    setFormData({
      category: 'SERVICE',
      title: '',
      content: ''
    });
    setAttachedFiles([]);
    if (editor) editor.commands.setContent('');
  };

  const handleDelete = async (inquiryId) => {
    if (!window.confirm('정말로 이 문의를 삭제하시겠습니까?')) return;
    try {
      const memberId = user.member_id || user.id;
      await deleteInquiry(inquiryId, memberId);
      alert('문의가 삭제되었습니다.');
      setSelectedInquiry(null);
      fetchInquiryHistory();
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  const handleEdit = (inquiry) => {
    setEditingId(inquiry.inquiry_id);
    setFormData({
      category: inquiry.category,
      title: inquiry.title,
      content: inquiry.content
    });
    if (editor) editor.commands.setContent(inquiry.content);
    setIsWriting(true);
    setSelectedInquiry(null);
  };

  useEffect(() => {
    fetchInquiryHistory();
  }, [user]);

  const faqs = [
    {
      id: 1,
      question: "축제 정보는 얼마나 자주 업데이트되나요?",
      answer: "우리는 한국관광공사의 공공 API와 연동하여 실시간으로 최신 축제 정보를 불러오고 있습니다. 또한 사용자 제보를 통해 정보 오류가 확인되는 즉시 수동으로도 업데이트를 진행하고 있습니다."
    },
    {
      id: 2,
      question: "AI 플래너는 어떻게 사용하나요?",
      answer: "AI 플래너는 사용자의 취향과 일정에 맞춰 최적의 축제 여행 코스를 제안합니다. 'AI 플래너' 메뉴에서 여행하고 싶은 지역과 날짜, 선호하는 테마를 선택하면 단 몇 초 만에 맞춤형 일정이 생성됩니다."
    },
    {
      id: 3,
      question: "작성한 게시글이나 댓글을 삭제하고 싶어요.",
      answer: "마이페이지의 '내가 쓴 게시글' 탭에서 작성하신 모든 게시글과 댓글을 확인하고 삭제하실 수 있습니다. 게시글 상세 페이지에서도 직접 삭제가 가능합니다."
    },
    {
      id: 4,
      question: "축제 알림 설정은 어디서 하나요?",
      answer: "관심 있는 축제의 상세 페이지에서 '좋아요(하트)'를 누르시면 해당 축제의 일정 변경이나 새로운 소식이 있을 때 앱 내 알림을 통해 알려드립니다."
    }
  ];

  const formatFileSize = (size) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  };

  const toggleFaq = (id) => {
    setOpenFaq(openFaq === id ? null : id);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0 || !editor) return;

    const invalidFile = files.find((file) => !file.type.startsWith('image/'));
    if (invalidFile) {
      alert('이미지 파일만 업로드 가능합니다.');
      e.target.value = '';
      return;
    }

    try {
      setUploading(true);
      for (const file of files) {
        const imageUrl = await uploadImage(file, 'inquiry/image');
        editor
          .chain()
          .focus()
          .insertContent(`
            <img
              src="${imageUrl}"
              style="max-width:100%; height:auto; display:block; margin:16px auto; border-radius:12px; object-fit:contain;"
            />
          `)
          .run();
      }
      e.target.value = '';
    } catch (error) {
      console.error(error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setAttachedFiles((prev) => {
      const newFiles = files.filter(
        (file) =>
          !prev.some(
            (saved) => saved.name === file.name && saved.size === file.size
          )
      );
      return [...prev, ...newFiles];
    });
    e.target.value = '';
  };

  const handleRemoveFile = (targetFile) => {
    setAttachedFiles((prev) =>
      prev.filter(
        (file) =>
          !(file.name === targetFile.name && file.size === targetFile.size)
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim() || formData.content === '<p></p>') {
      alert('제목과 내용을 모두 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const data = new FormData();
      const memberId = user.member_id || user.id;
      
      data.append('member_id', memberId);
      data.append('category', formData.category);
      data.append('title', formData.title);
      data.append('content', formData.content);
      data.append('status', 'PENDING');

      if (attachedFiles.length > 0) {
        attachedFiles.forEach((file) => {
          data.append('files', file);
        });
      }

      if (editingId) {
        await updateInquiry(editingId, data);
        alert('문의가 수정되었습니다.');
      } else {
        await addInquiry(data);
        alert('문의가 정상적으로 등록되었습니다.');
      }
      
      // 초기화
      handleCancelWrite();
      
      // 내역 새로고침
      fetchInquiryHistory();
    } catch (error) {
      console.error('문의 저장 실패:', error);
      alert('처리에 실패했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'ANSWERED':
      case '답변완료':
        return 'bg-green-50 text-green-600';
      case 'PENDING':
      case '검토중':
        return 'bg-blue-50 text-blue-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'ANSWERED': return '답변완료';
      case 'PENDING': return '검토중';
      default: return status;
    }
  };

  if (selectedInquiry) {
    return (
      <InquiryDetail 
        inquiry={selectedInquiry}
        onBack={() => setSelectedInquiry(null)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        getStatusStyle={getStatusStyle}
        getStatusLabel={getStatusLabel}
        categoryMap={categoryMap}
      />
    );
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <header className="px-2 sm:px-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">문의하기</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">궁금한 점이나 불편한 사항을 남겨주시면 정성껏 답변해 드리겠습니다.</p>
        </div>
        {!isWriting && (
          <button 
            onClick={handleWriteClick}
            className="px-6 py-3 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 flex items-center justify-center gap-2 text-sm"
          >
            <span>✍️</span> 1:1 문의하기
          </button>
        )}
      </header>

      {!isWriting && (
        <>
          {/* FAQ Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <span className="text-xl">💡</span> 자주 묻는 질문
              </h3>
              <button className="text-xs font-bold text-purple-600 hover:underline">전체보기</button>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              {faqs.map((faq) => (

                <div 
                  key={faq.id} 
                  className={`bg-white rounded-[24px] border transition-all duration-300 overflow-hidden ${
                    openFaq === faq.id ? 'border-purple-200 shadow-md' : 'border-gray-100 shadow-sm'
                  }`}
                >
                  <button 
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4"
                  >
                    <span className={`text-sm font-bold transition-colors ${openFaq === faq.id ? 'text-purple-600' : 'text-gray-700'}`}>
                      {faq.question}
                    </span>
                    <span className={`text-gray-400 transition-transform duration-300 ${openFaq === faq.id ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </button>
                  {openFaq === faq.id && (
                    <div className="px-6 pb-5">
                      <div className="pt-4 border-t border-gray-50">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Inquiry History */}
          <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <span className="text-xl">📋</span> 최근 문의 내역
              </h3>
              {isLoadingHistory && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inquiryHistory.length > 0 ? (
                (showAllInquiries ? inquiryHistory : inquiryHistory.slice(0, 3)).map((item) => (
                  <div 
                    key={item.inquiry_id} 
                    onClick={() => handleInquiryClick(item.inquiry_id)}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-100 group cursor-pointer hover:border-purple-200 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${getStatusStyle(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">{item.created_at}</span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-700 group-hover:text-purple-600 transition-colors truncate">
                      [{categoryMap[item.category] || item.category}] {item.title}
                    </h4>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p className="text-sm text-gray-400 font-bold">문의 내역이 없습니다.</p>
                </div>
              )}
            </div>

            {!showAllInquiries && inquiryHistory.length > 3 && (
              <div className="mt-8 text-center">
                <button 
                  onClick={() => setShowAllInquiries(true)}
                  className="px-6 py-2.5 bg-gray-50 text-gray-500 font-black rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all border border-gray-100 text-xs"
                >
                  문의 내역 더보기 ({inquiryHistory.length - 3}+)
                </button>
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-400 font-medium mb-1">고객센터 운영시간</p>
              <p className="text-xs text-gray-500 font-bold">평일 09:00 ~ 18:00 (주말/공휴일 제외)</p>
            </div>
          </section>
        </>
      )}

      {isWriting && (
        /* Inquiry Form Area */
        <div className="animate-in fade-in slide-in-from-right-4 duration-500">
          <header className="flex items-center justify-between mb-8">
            <button 
              onClick={handleCancelWrite}
              className="flex items-center gap-2 text-sm font-black text-gray-500 hover:text-gray-700 transition-colors px-4 py-2 bg-gray-100 rounded-xl"
            >
              <XCircle className="w-4 h-4" />
              작성 취소
            </button>
          </header>

          <section className="bg-white p-6 sm:p-8 rounded-[32px] border border-gray-100 shadow-sm">
            <h3 className="text-lg font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-xl">✍️</span> 1:1 문의 작성
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">문의 유형</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                  >
                    <option value="SERVICE">서비스 이용 문의</option>
                    <option value="UPDATE">축제 정보 수정 요청</option>
                    <option value="REPORT">커뮤니티/게시글 신고</option>
                    <option value="ETC">기타 문의</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">제목</label>
                  <input 
                    type="text" 
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="제목을 입력해주세요"
                    className="w-full bg-gray-50 border-none rounded-2xl px-4 py-3 text-sm font-bold text-gray-700 focus:ring-2 focus:ring-purple-500 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-gray-400 uppercase tracking-wider mb-2 ml-1">내용</label>
                <div className="overflow-hidden bg-gray-50 border border-gray-100 rounded-2xl focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-500/30 transition-all">
                  <MenuBar editor={editor} />
                  <div className="min-h-[350px]">
                    <EditorContent editor={editor} />
                  </div>
                  <div className="p-3 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3">
                    <label className={`flex items-center gap-2 px-4 py-2 bg-white text-gray-500 rounded-xl font-bold text-xs transition-all border border-gray-100 cursor-pointer hover:bg-purple-50 hover:text-purple-600 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <ImageIcon className="w-4 h-4" />
                      {uploading ? '업로드 중...' : '이미지 추가'}
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    <label className="flex items-center gap-2 px-4 py-2 bg-white text-gray-500 rounded-xl font-bold text-xs transition-all border border-gray-100 cursor-pointer hover:bg-purple-50 hover:text-purple-600">
                      <Paperclip className="w-4 h-4" />
                      파일 첨부
                      <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </label>
                  </div>
                </div>

                {attachedFiles.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {attachedFiles.map((file) => (
                      <div
                        key={`${file.name}-${file.size}`}
                        className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-700 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveFile(file)}
                          className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 mt-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? '등록 중...' : '문의 등록하기'}
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default MyInquiryTab;





