import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  X,
  Image as ImageIcon,
  Paperclip,
  ChevronRight,
  XCircle,
} from 'lucide-react';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import MenuBar from '../components/MenuBar';
import Image from '@tiptap/extension-image';

import { uploadImage } from '../../../api/boardApi';
import { addPost } from '../../../api/boardApi';

const PostWritePage = () => {
  const navigate = useNavigate();

  const [uploading, setUploading] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);

  const [formData, setFormData] = useState({
    category: 'free',
    title: '',
    content: '',
  });

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
        class:
          'min-h-[400px] outline-none text-base font-medium leading-relaxed text-gray-700',
      },
    },
  });

  const formatFileSize = (size) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  };

  const addFilesWithoutDuplicate = (files) => {
    setAttachedFiles((prev) => {
      const newFiles = files.filter(
        (file) =>
          !prev.some(
            (saved) => saved.name === file.name && saved.size === file.size
          )
      );

      return [...prev, ...newFiles];
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
        const imageUrl = await uploadImage(file, 'board/image');

        editor
          .chain()
          .focus()
          .insertContent(`
            <img
              src="${imageUrl}"
              style="max-width:100%; height:auto; display:block; margin:16px auto; border-radius:0; object-fit:contain;"
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

    addFilesWithoutDuplicate(files);

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

    if (!formData.content || formData.content === '<p></p>') {
      alert('내용을 입력해 주세요.');
      return;
    }

    try {
      const data = new FormData();

      const post = {
        category: formData.category,
        title: formData.title,
        content: formData.content,
      };

      data.append(
        'post',
        new Blob([JSON.stringify(post)], {
          type: 'application/json',
        })
      );

      if(attachedFiles.length > 0) {
        attachedFiles.forEach((file) => {
          data.append('files', file);
        });
      }

      await addPost(data);

      console.log('Post added successfully');
      alert('등록 완료');

      navigate('/community/board/'+formData.category);
    } catch (error) {
      console.error(error);
      alert('등록 실패');
    }
  };



  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-10 px-2">
          <div>
            <div className="flex items-center gap-2 text-[var(--festival-purple)] font-bold text-sm mb-2">
              <Link to="/community" className="hover:underline">
                커뮤니티
              </Link>
              <ChevronRight className="w-3 h-3" />
              <span>글쓰기</span>
            </div>

            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              게시글 작성
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="p-3 bg-white text-gray-400 hover:text-gray-600 rounded-full border border-gray-100 transition-all hover:shadow-md"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <div className="mb-8">
              <label className="block text-sm font-black text-gray-900 mb-3 ml-1 uppercase tracking-widest">
                게시판 선택
              </label>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'free', label: '자유게시판' },
                  { id: 'review', label: '축제후기' },
                  { id: 'tip', label: '꿀팁공유' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        category: cat.id,
                      }))
                    }
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

            <div className="mb-8">
              <label className="block text-sm font-black text-gray-900 mb-3 ml-1 uppercase tracking-widest">
                제목
              </label>

              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="제목을 입력해 주세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-900 focus:ring-2 focus:ring-[var(--festival-purple)]/20 focus:border-[var(--festival-purple)]/30 outline-none transition-all placeholder:text-gray-300"
                required
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-black text-gray-900 mb-3 ml-1 uppercase tracking-widest">
                내용
              </label>

              <div className="overflow-hidden bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-[var(--festival-purple)]/20 focus-within:border-[var(--festival-purple)]/30 transition-all">
                <MenuBar editor={editor} />

                <div className="min-h-[450px] p-5">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-gray-900 mb-3 ml-1 uppercase tracking-widest">
                첨부파일
              </label>

              <div className="flex flex-wrap gap-4">
                <label
                  className={`flex items-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm transition-all border border-dashed border-gray-200 cursor-pointer ${uploading
                    ? 'opacity-50 pointer-events-none'
                    : 'hover:bg-[var(--festival-purple-soft)]/20 hover:text-[var(--festival-purple)]'
                    }`}
                >
                  <ImageIcon className="w-5 h-5" />
                  {uploading ? '업로드 중...' : '이미지 첨부'}

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>

                <label className="flex items-center gap-2 px-6 py-4 bg-gray-50 text-gray-500 rounded-2xl font-bold text-sm hover:bg-[var(--festival-purple-soft)]/20 hover:text-[var(--festival-purple)] transition-all border border-dashed border-gray-200 cursor-pointer">
                  <Paperclip className="w-5 h-5" />
                  파일 첨부

                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>
              </div>

              {attachedFiles.length > 0 && (
                <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">
                  {attachedFiles.map((file) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="flex items-center justify-between gap-4 rounded-xl bg-white border border-gray-100 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-700 truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file)}
                        className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

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