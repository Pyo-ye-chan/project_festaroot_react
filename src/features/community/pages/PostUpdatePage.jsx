import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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

import { uploadImage, updatePost } from '../../../api/boardApi';

const PostUpdatePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { post: initialPost } = location.state || {}; // Get initial post data from navigation state

  const [uploading, setUploading] = useState(false);

  const [existingFiles, setExistingFiles] = useState(initialPost?.attachments || []); // 기존 첨부파일
  const [attachedFiles, setAttachedFiles] = useState([]); // 새로 추가하는 첨부파일
  const [deleteFileIds, setDeleteFileIds] = useState([]); // 삭제할 기존 첨부파일 ID 목록

  const [formData, setFormData] = useState({
    category: initialPost?.category || 'FREE',
    title: initialPost?.title || '',
    content: initialPost?.content || '',
  });

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: formData.content, // Initialize editor with existing content
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

  // Effect to ensure editor content updates if initialPost changes (e.g., if navigating to edit different post)
  useEffect(() => {
    if (editor && initialPost?.content && editor.getHTML() !== initialPost.content) {
      editor.commands.setContent(initialPost.content);
    }
    // Handle existing attachments here if initialPost has them.
    // For now, assuming attachments are handled separately or re-uploaded.
  }, [editor, initialPost]);

  const formatFileSize = (size) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  };

  const addFilesWithoutDuplicate = (files) => { // 중복되지 않는 파일만 추가
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

  const handleRemoveExistingFile = (file) => { // 기존 첨부파일 제거
    setExistingFiles((prev) =>
      prev.filter((item) => item.attach_id !== file.attach_id)
    );

    setDeleteFileIds((prev) => [...prev, file.attach_id]);
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

    if (!initialPost?.post_id) {
      alert('수정할 게시글 정보를 찾을 수 없습니다.');
      return;
    }

    try {
      const data = new FormData();

      const post = {
        category: formData.category,
        title: formData.title,
        content: formData.content,
        deleteFileIds, // 삭제할 기존 첨부파일 ID 목록  
      };

      data.append(
        'post',
        new Blob([JSON.stringify(post)], {
          type: 'application/json',
        })
      );

      // Existing attachments would need to be handled here too (e.g., send IDs of unremoved ones)
      // For now, assuming new files are sent and old ones are implicitly replaced or handled by backend.
      if (attachedFiles.length > 0) {
        attachedFiles.forEach((file) => {
          data.append('files', file);
        });
      }
      console.log(data);

      await updatePost(initialPost.post_id, data); // Call updatePost with ID and data

      console.log('Post updated successfully');
      alert('수정 완료');

      navigate(`/community/post/${initialPost.post_id}`); // Navigate back to the detail page
    } catch (error) {
      console.error(error);
      alert('수정 실패');
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
              <span>게시글 수정</span>
            </div>

            <h2 className="text-4xl font-black text-gray-900 tracking-tight">
              게시글 수정
            </h2>
          </div>

          <button
            type="button"
            onClick={() => navigate(`/community/post/${initialPost?.post_id}`)} // Navigate back to detail page
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

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'FREE', label: '자유게시판' },
                  { id: 'REVIEW', label: '축제후기' },
                  { id: 'TIP', label: '꿀팁공유' },
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

              <div className="overflow-hidden bg-gray-50 border border-gray-200 rounded-2xl focus-within:ring-2 focus-within:ring-[var(--festival-purple)]/20 focus-within:border-[var(--festival-purple)]/30 outline-none transition-all">
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

              {(existingFiles.length > 0 || attachedFiles.length > 0) && (
                <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 p-4 space-y-2">

                  {existingFiles.map((file) => (
                    <div
                      key={file.attach_id}
                      className="flex items-center justify-between gap-4 rounded-xl bg-white border border-gray-100 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-gray-700 truncate">
                          {file.original_name}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          기존 첨부파일
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveExistingFile(file)}
                        className="shrink-0 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ))}

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
                          새 첨부파일 · {formatFileSize(file.size)}
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
              onClick={() => navigate(`/community/post/${initialPost?.post_id}`)} // Navigate back to detail page
              className="flex-1 py-5 bg-white text-gray-400 font-black rounded-[2rem] border border-gray-100 hover:bg-gray-50 transition-all active:scale-95 shadow-sm"
            >
              취소하기
            </button>

            <button
              type="submit"
              className="flex-[2] py-5 bg-[var(--festival-purple)] text-white font-black rounded-[2rem] hover:bg-[var(--festival-purple-soft)] transition-all active:scale-95 shadow-lg shadow-[var(--festival-purple)]/30 flex items-center justify-center gap-2"
            >
              수정 완료
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostUpdatePage;