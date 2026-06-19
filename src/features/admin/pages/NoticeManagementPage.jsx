import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Megaphone, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Calendar, 
  Eye,
  RefreshCw,
  X,
  Paperclip,
  Image as ImageIcon,
  ChevronLeft,
  XCircle,
  Download
} from 'lucide-react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import MenuBar from '../../community/components/MenuBar';
import { getPosts, deletePost, getPostDetail, addPost, updatePost, uploadImage } from '../../../api/boardApi';

const NoticeManagementPage = () => {
  const navigate = useNavigate();
  const [view, setView] = useState('LIST'); // 'LIST' | 'WRITE' | 'EDIT'
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  // 글쓰기 / 수정 폼 상태
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [deleteFileIds, setDeleteFileIds] = useState([]);
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '' });

  // Tiptap 에디터 설정
  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: '',
    onUpdate: ({ editor }) => {
      setNoticeForm((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
    editorProps: {
      attributes: {
        class: 'min-h-[400px] outline-none text-base font-medium leading-relaxed text-gray-700 p-6 border border-gray-100 rounded-3xl bg-gray-50 focus:bg-white transition-all',
      },
    },
  });

  // 에디터 내용 동적 로드 (수정 진입 시 에디터 내용 세팅 및 작성 모드 시 초기화)
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      if (view === 'EDIT' && selectedNotice) {
        // 기존 작성 글 내용이 현재 에디터 내용과 다를 때만 최초 세팅하여 타이핑 중 리셋되는 현상 방지
        if (editor.getHTML() !== selectedNotice.content) {
          editor.commands.setContent(selectedNotice.content || '');
        }
      } else if (view === 'WRITE') {
        editor.commands.setContent('');
      }
    }
  }, [editor, view, selectedNotice?.post_id, selectedNotice?.id, selectedNotice?.content]);

  useEffect(() => {
    if (view === 'LIST') {
      fetchNotices();
    }
  }, [currentPage, searchKeyword, view]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await getPosts(currentPage, 'NOTICE', 'latest', 'title', searchKeyword);
      const list = response.data?.list || [];
      const total = response.data?.totalPostCount || 0;
      
      setNotices(list);
      setTotalItems(total);
      setTotalPages(Math.ceil(total / itemsPerPage) || 1);
    } catch (error) {
      console.error('Failed to fetch notices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNotice = () => {
    setSelectedNotice(null);
    setNoticeForm({ title: '', content: '' });
    setAttachedFiles([]);
    setExistingFiles([]);
    setDeleteFileIds([]);
    setView('WRITE');
  };

  const handleEditNotice = async (notice) => {
    try {
      setLoading(true);
      const noticeId = notice.post_id || notice.id;
      const response = await getPostDetail(noticeId);
      
      // getPostDetail API의 반환 형태에 맞추어 dto와 list(첨부파일)를 추출합니다.
      const postData = response.data?.dto || response.data || notice;
      const attachments = response.data?.list || postData.attachments || [];
      
      setSelectedNotice(postData);
      setNoticeForm({
        title: postData.title || '',
        content: postData.content || ''
      });
      setExistingFiles(attachments);
      setAttachedFiles([]);
      setDeleteFileIds([]);
      setView('EDIT');
    } catch (error) {
      console.error('Failed to load notice details:', error);
      alert('공지 상세 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noticeId) => {
    if (window.confirm('정말 이 공지사항을 삭제하시겠습니까?')) {
      try {
        await deletePost(noticeId);
        alert('공지사항이 삭제되었습니다.');
        fetchNotices();
      } catch (error) {
        console.error('Failed to delete notice:', error);
        alert('공지사항 삭제에 실패했습니다.');
      }
    }
  };

  const formatFileSize = (size) => {
    if (size < 1024) return `${size}B`;
    if (size < 1024 * 1024) return `${Math.round(size / 1024)}KB`;
    return `${(size / 1024 / 1024).toFixed(1)}MB`;
  };

  const addFilesWithoutDuplicate = (files) => {
    setAttachedFiles((prev) => {
      const newFiles = files.filter(
        (file) => !prev.some((saved) => saved.name === file.name && saved.size === file.size)
      );
      return [...prev, ...newFiles];
    });
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
      prev.filter((file) => !(file.name === targetFile.name && file.size === targetFile.size))
    );
  };

  const handleRemoveExistingFile = (file) => {
    setExistingFiles((prev) => prev.filter((item) => item.attach_id !== file.attach_id));
    setDeleteFileIds((prev) => [...prev, file.attach_id]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!noticeForm.title.trim()) {
      alert('제목을 입력해 주세요.');
      return;
    }
    if (!noticeForm.content || noticeForm.content === '<p></p>') {
      alert('내용을 입력해 주세요.');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      const post = {
        category: 'NOTICE',
        title: noticeForm.title,
        content: noticeForm.content,
        deleteFileIds: view === 'EDIT' ? deleteFileIds : [],
      };

      data.append(
        'post',
        new Blob([JSON.stringify(post)], {
          type: 'application/json',
        })
      );

      if (attachedFiles.length > 0) {
        attachedFiles.forEach((file) => {
          data.append('files', file);
        });
      }

      if (view === 'EDIT') {
        await updatePost(selectedNotice.post_id || selectedNotice.id, data);
        alert('공지사항이 수정되었습니다.');
      } else {
        await addPost(data);
        alert('새로운 공지사항이 등록되었습니다.');
      }

      setView('LIST');
    } catch (error) {
      console.error('Failed to save notice:', error);
      alert('공지사항 저장 도중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  if (view === 'WRITE' || view === 'EDIT') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 font-['Pretendard']">
        {/* Editor Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setView('LIST')}
              className="p-3 bg-white text-gray-500 hover:text-gray-900 rounded-2xl border border-gray-100 shadow-sm transition cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-gray-950">
                {view === 'WRITE' ? '공지사항 작성' : '공지사항 수정'}
              </h1>
              <p className="text-xs font-bold text-gray-400 mt-0.5">
                {view === 'WRITE' ? '새로운 공지글을 게시판에 등록합니다.' : '기존 공지글을 수정합니다.'}
              </p>
            </div>
          </div>
        </div>

        {/* Editor Body */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100 space-y-8">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">공지 제목</label>
              <input
                type="text"
                value={noticeForm.title}
                onChange={(e) => setNoticeForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="제목을 입력해 주세요"
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-5 text-gray-900 font-bold focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all placeholder:text-gray-300"
                required
              />
            </div>

            {/* Tiptap Editor & MenuBar */}
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">공지 본문</label>
              <div className="border border-gray-200 rounded-[28px] overflow-hidden bg-white shadow-inner">
                {editor && <MenuBar editor={editor} />}
                <EditorContent editor={editor} />
              </div>
            </div>

            {/* Inline Image Upload & File Attachments */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-50">
              {/* 이미지 삽입 */}
              <div className="space-y-3">
                <span className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">본문 이미지 삽입</span>
                <label className="flex flex-col items-center justify-center h-28 border border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100/50 hover:border-purple-200 transition">
                  <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs font-bold text-gray-500">이미지 추가 (본문 마우스 커서 위치에 삽입)</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>

              {/* 일반 파일 첨부 */}
              <div className="space-y-3">
                <span className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">일반 첨부파일</span>
                <label className="flex flex-col items-center justify-center h-28 border border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100/50 hover:border-purple-200 transition">
                  <Paperclip className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs font-bold text-gray-500">첨부파일 추가 (최대 10MB)</span>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* 첨부파일 리스트 뷰 */}
            {((view === 'EDIT' && existingFiles.length > 0) || attachedFiles.length > 0) && (
              <div className="space-y-3 pt-4 border-t border-gray-50">
                <span className="block text-xs font-black text-gray-400 uppercase tracking-widest ml-1">첨부파일 리스트</span>
                <div className="space-y-2">
                  {/* 기존 파일 목록 */}
                  {view === 'EDIT' && existingFiles.map((file) => (
                    <div key={file.attach_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="text-xs font-bold text-gray-700 line-clamp-1">{file.original_name || file.origin_filename || file.originFilename}</span>
                        <span className="text-[10px] text-gray-400 font-bold shrink-0">({formatFileSize(file.file_size || file.fileSize || file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingFile(file)}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {/* 신규 추가 파일 목록 */}
                  {attachedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-purple-50/30 rounded-xl border border-purple-100">
                      <div className="flex items-center gap-2">
                        <Paperclip className="w-4 h-4 text-purple-600 shrink-0" />
                        <span className="text-xs font-bold text-purple-900 line-clamp-1">{file.name}</span>
                        <span className="text-[10px] text-purple-400 font-bold shrink-0">({formatFileSize(file.size)})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(file)}
                        className="text-gray-400 hover:text-red-500 transition cursor-pointer"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setView('LIST')}
              className="h-12 px-6 rounded-2xl bg-white border border-gray-200 text-sm font-black text-gray-500 hover:bg-gray-50 transition cursor-pointer"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] text-sm font-black text-white shadow-lg shadow-purple-100 transition hover:brightness-110 cursor-pointer disabled:opacity-50"
            >
              {view === 'WRITE' ? '공지 등록 완료' : '수정 완료'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 font-['Pretendard']">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[32px] font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Megaphone className="text-[#6d3df2]" size={32} />
            공지사항 관리
          </h1>
          <p className="text-gray-500 font-bold mt-1">사이트 전체 사용자 대상 공지사항을 등록 및 수정합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchNotices}
            className="flex h-12 items-center gap-2 rounded-2xl bg-white border border-gray-200 px-6 text-sm font-black text-gray-600 shadow-sm transition hover:bg-gray-50 cursor-pointer"
          >
            <RefreshCw size={18} className="text-gray-400" />
            새로고침
          </button>
          <button 
            onClick={handleCreateNotice}
            className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] px-6 text-sm font-black text-white shadow-lg shadow-purple-100 transition hover:brightness-110 cursor-pointer"
          >
            <Plus size={18} />
            공지 등록
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="text-xs font-bold text-gray-400">
          등록된 총 공지사항: <span className="text-[#6d3df2] font-black">{totalItems}</span>개
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="공지사항 제목 검색"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-100 transition-all"
          />
        </div>
      </div>

      {/* Notice List Table */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider w-20 text-center whitespace-nowrap">번호</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider">제목</th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center w-40 whitespace-nowrap">등록일</th>
                <th className="px-4 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center w-24 whitespace-nowrap">조회수</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right w-24 whitespace-nowrap">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-6 text-center whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </td>
                    <td className="px-4 py-6 text-center whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>
                    </td>
                    <td className="px-4 py-6 text-center whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-10 mx-auto"></div>
                    </td>
                    <td className="px-4 py-6 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-2">
                        <div className="h-9 w-9 bg-gray-100 rounded-xl"></div>
                        <div className="h-9 w-9 bg-gray-100 rounded-xl"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : notices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-16 text-gray-400 font-bold">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                notices.map((notice, index) => {
                  const id = notice.post_id || notice.id;
                  const noticeNumber = totalItems - (currentPage - 1) * itemsPerPage - index;

                  return (
                    <tr key={id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-6 text-center text-xs font-bold text-gray-400 whitespace-nowrap">
                        {noticeNumber}
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-sm font-black text-gray-900 group-hover:text-[#6d3df2] transition-colors line-clamp-1">
                          {notice.title}
                        </span>
                      </td>
                      <td className="px-4 py-6 text-center text-xs font-bold text-gray-500 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <Calendar size={12} className="text-gray-300" />
                          {formatDate(notice.created_at || notice.createdAt)}
                        </div>
                      </td>
                      <td className="px-4 py-6 text-center text-xs font-bold text-gray-500 whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <Eye size={12} className="text-gray-300" />
                          {(notice.view_count || notice.viewCount || 0).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEditNotice(notice)}
                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition shadow-sm cursor-pointer"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(id)}
                            className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition shadow-sm cursor-pointer"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-8 py-5 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
          <p className="text-xs font-bold text-gray-400">
            전체 {totalItems}개 중 {totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 표시
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer"
              >
                이전
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`h-8 w-8 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? 'bg-[#6d3df2] text-white shadow-md shadow-purple-100'
                      : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="h-8 px-3 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoticeManagementPage;
