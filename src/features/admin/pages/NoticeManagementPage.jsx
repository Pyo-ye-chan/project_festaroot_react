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
  RefreshCw
} from 'lucide-react';
import { getPosts, deletePost, getPostDetail } from '../../../api/boardApi';

const NoticeManagementPage = () => {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchKeyword, setSearchKeyword] = useState('');

  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchNotices();
  }, [currentPage, searchKeyword]);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      // 공지사항 카테고리만 필터링하여 조회
      const response = await getPosts(currentPage, 'notice', 'latest', 'title', searchKeyword);

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
    navigate('/community/write?category=notice');
  };

  const handleEditNotice = async (notice) => {
    try {
      setLoading(true);
      const noticeId = notice.post_id || notice.id;
      const response = await getPostDetail(noticeId);
      const postData = response.data?.dto || response.data || notice;
      const attachments = response.data?.list || postData.attachments || [];

      // 커뮤니티 수정화면으로 이동할 때 기존 글의 모든 정보를 state로 전달합니다.
      navigate(`/community/update/${noticeId}`, {
        state: {
          post: {
            ...postData,
            attachments: attachments
          }
        }
      });
    } catch (error) {
      console.error('Failed to load post detail for edit:', error);
      alert('상세 정보를 불러오는 데 실패했습니다.');
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
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
                  className={`h-8 w-8 rounded-lg text-xs font-black transition-all cursor-pointer ${currentPage === i + 1
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
