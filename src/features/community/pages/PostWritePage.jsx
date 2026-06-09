import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Image as ImageIcon,
  Paperclip,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

const PostWritePage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: 'free',
    title: '',
    content: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Post submitted:', formData);
    // Mock redirect
    navigate('/community/board/' + formData.category);
  };

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div>
            <div className="flex items-center gap-2 text-[var(--festival-purple)] font-bold text-sm mb-2">
              <Link to="/community" className="hover:underline">커뮤니티</Link>
              <ChevronRight className="w-3 h-3" />
              <span>글쓰기</span>
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tight">게시글 작성</h2>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="p-3 bg-white text-gray-400 hover:text-gray-600 rounded-full border border-gray-100 transition-all hover:shadow-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">

            {/* Board Selection */}
            <div className="mb-8">
              <label className="block text-sm font-black text-gray-900 mb-3 ml-1 uppercase tracking-widest">게시판 선택</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'free', label: '자유게시판' },
                  { id: 'review', label: '축제후기' },
                  { id: 'tip', label: '꿀팁공유' },
                  { id: 'notice', label: '공지사항' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`py-4 px-4 rounded-2xl font-bold text-sm transition-all border ${formData.category === cat.id
                      ? 'bg-[var(--festival-yellow)] text-black border-[var(--festival-yellow)] shadow-lg shadow-[var(--festival-purple)]/20'
                      : 'bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-8">
              <label className="block text-sm font-black text-gray-900 mb-3 ml-1 uppercase tracking-widest">제목</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력해 주세요"
                className="w-full bg-gray-50 border-none rounded-2xl p-5 text-lg font-bold focus:ring-2 focus:ring-[var(--festival-purple)]/20 outline-none transition-all placeholder:text-gray-300"
                required
              />
            </div>

            {/* Content Input */}
            <div className="mb-8">
              <label className="block text-sm font-black text-gray-900 mb-3 ml-1 uppercase tracking-widest">내용</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="여러분의 축제 이야기를 들려주세요!"
                className="w-full bg-gray-50 border-none rounded-3xl p-6 text-base min-h-[400px] focus:ring-2 focus:ring-[var(--festival-purple)]/20 outline-none transition-all resize-none font-medium leading-relaxed placeholder:text-gray-300"
                required
              />
            </div>

            {/* Attachments Placeholder */}
            <div className="flex flex-wrap gap-4">
              <button type="button" className="flex items-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-[var(--festival-purple-soft)]/20 hover:text-[var(--festival-purple)] transition-all border border-dashed border-gray-200 hover:border-[var(--festival-purple-soft)]">
                <ImageIcon className="w-5 h-5" />
                이미지 첨부
              </button>
              <button type="button" className="flex items-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-[var(--festival-purple-soft)]/20 hover:text-[var(--festival-purple)] transition-all border border-dashed border-gray-200 hover:border-[var(--festival-purple-soft)]">
                <Paperclip className="w-5 h-5" />
                파일 첨부
              </button>
            </div>
          </div>
          {/* 작성 안내 */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">

              <div className="bg-gray-50 rounded-[1.5rem] p-6">
                <h4 className="text-sm font-black text-gray-700 mb-4">
                  작성 안내
                </h4>

                <ul className="space-y-2 text-sm text-gray-500">
                  <li>• 타인을 비방하거나 불쾌감을 주는 게시글은 삭제될 수 있습니다.</li>
                  <li>• 광고 및 홍보성 게시물은 운영 정책에 따라 제한될 수 있습니다.</li>
                  <li>• 개인정보가 포함된 내용은 작성하지 않도록 주의해 주세요.</li>
                </ul>
              </div>
            </div>


          {/* Bottom Actions */}
          <div className="flex gap-4 pt-4 px-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-5 bg-white text-gray-400 font-black rounded-[2rem] border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              취소하기
            </button>
            <button
              type="submit"
              className="flex-[2] py-5 bg-[var(--festival-purple)] text-white font-black rounded-[2rem] hover:bg-[var(--festival-purple-soft)] transition-all active:scale-95 shadow-lg shadow-[var(--festival-purple)]/30 flex items-center justify-center gap-2"
            >
              게시글 등록하기
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostWritePage;
