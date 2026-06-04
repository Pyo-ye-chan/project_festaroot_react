import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  X, 
  Image as ImageIcon, 
  Paperclip, 
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle
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

  const categoryOptions = [
    { id: 'free', label: '자유게시판', icon: '💬', color: 'bg-blue-50 text-blue-600' },
    { id: 'review', label: '축제후기', icon: '📸', color: 'bg-rose-50 text-rose-600' },
    { id: 'tip', label: '꿀팁공유', icon: '💡', color: 'bg-amber-50 text-amber-600' },
    { id: 'notice', label: '공지사항', icon: '📢', color: 'bg-slate-100 text-slate-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50/30 font-['Pretendard'] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12 px-2">
          <div>
             <div className="flex items-center gap-2 text-purple-600 font-bold text-sm mb-2">
              <Link to="/community" className="hover:text-purple-700 transition-colors">커뮤니티</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-400">새 글 작성</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">당신의 이야기를 들려주세요</h2>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="group p-4 bg-white text-gray-400 hover:text-gray-900 rounded-[1.5rem] border border-gray-100 transition-all hover:shadow-xl hover:rotate-90"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main Form Area */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Card: Category & Title */}
          <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100">
            
            {/* Category Selection */}
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6 ml-1">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <label className="text-sm font-black text-gray-900 uppercase tracking-widest">게시판 선택</label>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categoryOptions.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.id })}
                    className={`relative py-6 px-4 rounded-[2rem] font-black text-sm transition-all border-2 flex flex-col items-center gap-3 overflow-hidden ${
                      formData.category === cat.id 
                      ? 'bg-white border-purple-600 text-purple-600 shadow-xl shadow-purple-50 translate-y-[-4px]' 
                      : 'bg-gray-50 border-transparent text-gray-400 hover:bg-white hover:border-gray-100 hover:text-gray-600'
                    }`}
                  >
                    <span className="text-2xl">{cat.icon}</span>
                    {cat.label}
                    {formData.category === cat.id && (
                      <CheckCircle2 className="absolute top-3 right-3 w-4 h-4 text-purple-600" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4 ml-1">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <label className="text-sm font-black text-gray-900 uppercase tracking-widest">제목</label>
              </div>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력해 주세요"
                className="w-full bg-gray-50/50 border-2 border-transparent rounded-[2rem] p-6 text-xl font-black focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 outline-none transition-all placeholder:text-gray-300"
                required
              />
            </div>

            {/* Content Input */}
            <div>
              <div className="flex items-center gap-2 mb-4 ml-1">
                <span className="w-1.5 h-1.5 bg-purple-600 rounded-full"></span>
                <label className="text-sm font-black text-gray-900 uppercase tracking-widest">본문 내용</label>
              </div>
              <textarea 
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="어떤 즐거운 축제 소식을 전해주실 건가요?"
                className="w-full bg-gray-50/50 border-2 border-transparent rounded-[2.5rem] p-8 text-lg min-h-[450px] focus:ring-4 focus:ring-purple-600/5 focus:bg-white focus:border-purple-600/10 outline-none transition-all resize-none font-medium leading-relaxed placeholder:text-gray-300"
                required
              />
            </div>
          </div>

          {/* Card: Attachments */}
          <div className="bg-white rounded-[3rem] p-8 md:px-12 py-10 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-wrap gap-4">
              <button type="button" className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-sm hover:bg-purple-50 hover:text-purple-600 transition-all border-2 border-dashed border-gray-200 hover:border-purple-200 group">
                <ImageIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                이미지 추가
              </button>
              <button type="button" className="flex items-center gap-3 px-8 py-4 bg-gray-50 text-gray-500 rounded-2xl font-black text-sm hover:bg-purple-50 hover:text-purple-600 transition-all border-2 border-dashed border-gray-200 hover:border-purple-200 group">
                <Paperclip className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                파일 첨부
              </button>
            </div>
            
            <div className="flex items-center gap-3 text-gray-400 font-bold text-sm bg-gray-50 px-6 py-4 rounded-2xl border border-gray-100">
              <AlertCircle className="w-4 h-4" />
              최대 20MB까지 첨부 가능합니다.
            </div>
          </div>

          {/* Guide / Safe Space */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-[2.5rem] p-8 flex gap-6 border border-purple-100/50">
            <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-purple-600 shadow-sm border border-purple-100">
              <Info className="w-6 h-6" />
            </div>
            <div className="text-base text-purple-900/70 font-medium leading-relaxed">
              <p className="font-black text-purple-900 text-lg mb-1">매너 있는 커뮤니티 활동</p>
              함께 즐기는 축제처럼 즐거운 커뮤니티가 될 수 있도록 <br />
              타인을 배려하는 소중한 게시글 작성을 부탁드립니다.
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="flex gap-6 pt-6">
            <button 
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-6 bg-white text-gray-400 font-black rounded-[2.5rem] border-2 border-gray-100 hover:bg-gray-50 hover:text-gray-600 transition-all active:scale-95 shadow-sm"
            >
              다음에 쓸게요
            </button>
            <button 
              type="submit"
              className="flex-[2] py-6 bg-purple-600 text-white font-black rounded-[2.5rem] hover:bg-purple-700 transition-all active:scale-95 shadow-2xl shadow-purple-200 flex items-center justify-center gap-3 text-lg"
            >
              게시글 등록하기
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostWritePage;
