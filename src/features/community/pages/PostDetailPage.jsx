import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Share2,
  AlertCircle,
  MoreVertical,
  ChevronLeft,
  Send,
  Trash2,
  Edit3,
  Download,
} from 'lucide-react';

import ReportModal from '../components/ReportModal';

import {
  getPostDetail,
  deletePost,
  getComments,
  addComment,
  deleteComment,
  updateComment,
} from '../../../api/boardApi';

import useAuthStore from '../../../store/useAuthStore';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // =============================
  // 게시글 관련 상태
  // =============================
  const [post, setPost] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  // =============================
  // 댓글 관련 상태
  // =============================
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // =============================
  // 대댓글 관련 상태
  // =============================
  const [replyText, setReplyText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);

  // =============================
  // 댓글 수정 관련 상태
  // =============================
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  // =============================
  // 신고 모달 관련 상태
  // =============================
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetType, setReportTargetType] = useState('');
  const [reportTargetId, setReportTargetId] = useState(null);

  // =============================
  // 댓글 좋아요 상태
  // key: comment_id
  // value: true / false
  // =============================
  const [commentLikes, setCommentLikes] = useState({});

  // 현재 로그인한 사용자 id
  const currentUserId = useAuthStore((state) => state.user?.member_id);

  // =============================
  // 게시글 상세 조회
  // =============================
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const postDetail = await getPostDetail(id);

        setPost(postDetail.data.dto);
        setAttachments(postDetail.data.list || []);
      } catch (error) {
        console.error('게시글 상세 조회 실패:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  // =============================
  // 댓글 목록 조회
  // =============================
  const fetchComments = async () => {
    try {
      const response = await getComments(id);

      setComments(response.data || []);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  };

  // 게시글 번호가 바뀔 때마다 댓글 다시 조회
  useEffect(() => {
    fetchComments();
  }, [id]);

  // =============================
  // 댓글 총 개수 계산
  // 부모 댓글 + 대댓글 children 개수 포함
  // =============================
  const totalCommentCount = comments.reduce(
    (count, comment) => count + 1 + (comment.children?.length || 0),
    0
  );

  // =============================
  // 게시글 삭제
  // =============================
  const handleDeletePost = async () => {
    if (!window.confirm('정말로 게시글을 삭제하시겠습니까?')) return;

    try {
      await deletePost(id);
      alert('게시글이 성공적으로 삭제되었습니다.');
      navigate('/community/board/all');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // =============================
  // 댓글 작성
  // =============================
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment(id, commentText);

      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // =============================
  // 대댓글 작성
  // parentCommentId가 parent_comment_id 역할
  // =============================
  const handleAddReply = async (parentCommentId) => {
    if (!replyText.trim()) return;

    try {
      await addComment(id, replyText, parentCommentId);

      setReplyText('');
      setReplyTargetId(null);
      fetchComments();
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
      alert('대댓글 작성에 실패했습니다.');
    }
  };

  // =============================
  // 댓글 / 대댓글 삭제
  // =============================
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // =============================
  // 댓글 수정 시작
  // =============================
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditedCommentText(comment.content);
  };

  // =============================
  // 댓글 수정 취소
  // =============================
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  // =============================
  // 댓글 수정 저장
  // =============================
  const handleSaveEditedComment = async (commentId) => {
    if (!editedCommentText.trim()) {
      alert('수정할 내용을 입력해 주세요.');
      return;
    }

    try {
      await updateComment(commentId, editedCommentText);

      setEditingCommentId(null);
      setEditedCommentText('');
      fetchComments();
    } catch (error) {
      console.error('댓글 수정 실패:', error);
      alert('댓글 수정에 실패했습니다.');
    }
  };

  // =============================
  // 댓글 / 대댓글 좋아요 토글
  // 현재는 프론트 임시 처리
  // 나중에 API 연결하면 이 함수 안에서 API 호출하면 됨
  // =============================
  const handleToggleCommentLike = async (commentId, currentLikes) => {
    try {
      const isCurrentlyLiked = commentLikes[commentId];

      const newLikeCount = isCurrentlyLiked
        ? Math.max(0, currentLikes - 1)
        : currentLikes + 1;

      // 좋아요 상태 변경
      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: !isCurrentlyLiked,
      }));

      // 댓글 목록 안의 좋아요 수 변경
      // 부모 댓글이면 부모 댓글 업데이트
      // 대댓글이면 children 안에서 업데이트
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? {
                ...comment,
                like_count: newLikeCount,
              }
            : {
                ...comment,
                children: comment.children?.map((reply) =>
                  reply.comment_id === commentId
                    ? {
                        ...reply,
                        like_count: newLikeCount,
                      }
                    : reply
                ),
              }
        )
      );
    } catch (error) {
      console.error('댓글 좋아요/취소 실패:', error);
      alert('댓글 좋아요/취소에 실패했습니다.');
    }
  };

  // =============================
  // 신고 제출
  // =============================
  const handleReportSubmit = ({
    targetType,
    targetId,
    reason,
    customReason,
  }) => {
    console.log('Report submitted:', {
      targetType,
      targetId,
      reason,
      customReason,
    });

    alert(
      `신고가 접수되었습니다!\n대상: ${targetType} ID: ${targetId}\n사유: ${reason}${
        customReason ? ` (${customReason})` : ''
      }`
    );

    setIsReportModalOpen(false);
  };

  // =============================
  // 카테고리별 스타일
  // =============================
  const getCategoryClasses = (postCategory) => {
    switch (postCategory) {
      case '후기':
        return 'bg-[var(--festival-yellow)] text-gray-800';
      case '팁':
        return 'bg-[var(--festival-purple-soft)] text-white';
      case '정보':
        return 'bg-gray-300 text-gray-800';
      case '자유':
        return 'bg-gray-500 text-white';
      case '꿀팁':
        return 'bg-blue-400 text-white';
      case '공지사항':
        return 'bg-red-500 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  // =============================
  // 날짜 표시
  // =============================
  const formatDate = (dateValue) => {
    if (!dateValue) return '';

    return String(dateValue).replace('T', ' ');
  };

  // 게시글 로딩 처리
  if (!post) {
    return <div>게시글을 불러오는 중입니다.</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--warm-white)] font-['Pretendard'] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-[var(--festival-purple)] font-bold mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          목록으로 돌아가기
        </button>

        {/* =============================
            게시글 영역
        ============================= */}
        <article className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden mb-8">
          {/* 게시글 헤더 */}
          <div className="p-8 md:p-12 border-b border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`px-3 py-1 rounded-lg text-[10px] font-black ${getCategoryClasses(
                  post.category
                )}`}
              >
                {post.category}
              </span>

              <span className="text-xs font-bold text-gray-400">
                {formatDate(post.created_at)}
              </span>
            </div>

            <div className="flex justify-between items-start gap-4 mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                {post.title}
              </h1>

              <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-full transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-[var(--festival-purple-soft)]">
                  <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${post.nickname}`}
                    alt={post.nickname}
                  />
                </div>

                <div>
                  <p className="font-black text-gray-900">{post.nickname}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-400 text-sm font-bold">
                <span>조회 {post.view_count}</span>
                <span className="text-rose-500">
                  좋아요 {post.like_count}
                </span>
              </div>
            </div>
          </div>

          {/* 게시글 본문 */}
          <div className="p-8 md:p-12">
            <div
              className="
                prose
                prose-lg
                max-w-none
                prose-img:rounded-3xl
                prose-img:max-w-3xl
                prose-img:mx-auto
                prose-img:border
                prose-img:border-gray-100
              "
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />

            {/* 첨부파일 목록 */}
            {attachments.length > 0 && (
              <div className="mt-8 bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm">
                <h3 className="text-lg font-black text-gray-900 mb-4">
                  첨부파일
                </h3>

                <div className="space-y-2">
                  {attachments.map((file) => (
                    <button
                      key={file.attach_id || file.file_path}
                      type="button"
                      onClick={() => {
                        window.location.href = `http://localhost/storage/download/${file.attach_id}`;
                      }}
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        bg-gray-50
                        px-4
                        py-3
                        hover:bg-purple-50
                        transition-all
                      "
                    >
                      <span className="text-sm font-bold text-gray-700 truncate">
                        {file.file_name}
                      </span>

                      <span className="flex items-center gap-1 text-xs font-black text-[var(--festival-purple)]">
                        <Download className="w-4 h-4" />
                        다운로드
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 게시글 하단 버튼 */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black transition-all active:scale-95 ${
                    isLiked
                      ? 'bg-rose-500 text-white shadow-lg shadow-rose-200'
                      : 'bg-gray-50 text-gray-600 hover:bg-rose-50 hover:text-rose-500'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`}
                  />
                  {post.like_count + (isLiked ? 1 : 0)}
                </button>

                <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 text-gray-600 hover:bg-gray-100 rounded-2xl font-black transition-all active:scale-95">
                  <Share2 className="w-5 h-5" />
                  공유
                </button>
              </div>

              <div className="flex items-center gap-2">
                {/* 작성자만 수정/삭제 표시 */}
                {currentUserId === post.member_id && (
                  <>
                    <button
                      onClick={() =>
                        navigate(`/community/update/${post.post_id}`, {
                          state: { post },
                        })
                      }
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-[var(--festival-purple)] font-bold text-sm transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                      수정
                    </button>

                    <button
                      onClick={handleDeletePost}
                      className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-rose-500 font-bold text-sm transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      삭제
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    setReportTargetType('post');
                    setReportTargetId(post.post_id);
                    setIsReportModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 font-bold text-sm transition-colors"
                >
                  <AlertCircle className="w-4 h-4" />
                  신고
                </button>
              </div>
            </div>
          </div>
        </article>

        {/* =============================
            댓글 영역
        ============================= */}
        <section className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-[var(--festival-purple)]" />

            <h3 className="text-xl font-black text-gray-900">
              댓글 {totalCommentCount}
            </h3>
          </div>

          <div className="p-8">
            {/* 댓글 입력창 */}
            <div className="flex gap-4 mb-10">
              <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    currentUserId || 'currentUser'
                  }`}
                  alt=""
                />
              </div>

              <div className="flex-grow relative">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="따뜻한 댓글을 남겨주세요."
                  className="w-full bg-gray-50 border-none rounded-2xl p-4 text-sm min-h-[100px] focus:ring-2 focus:ring-[var(--festival-purple)]/20 outline-none resize-none"
                />

                <button
                  type="button"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                  className="absolute bottom-4 right-4 bg-[var(--festival-purple)] text-white p-2.5 rounded-xl hover:bg-[var(--festival-purple-soft)] transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment.comment_id} className="space-y-5">
                  {/* 부모 댓글 */}
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                      <img
                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.nickname}`}
                        alt=""
                      />
                    </div>

                    <div className="flex-grow">
                      {/* 댓글 상단: 작성자 정보 + 액션 버튼 */}
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-gray-900">
                            {comment.nickname}
                          </span>

                          <span className="text-[10px] font-bold text-gray-400">
                            {formatDate(comment.created_at)}
                          </span>
                        </div>

                        {/* 
                          부모 댓글 액션 영역
                          좋아요 버튼을 수정/삭제/신고 버튼 옆에 배치
                        */}
                        <div className="flex items-center gap-3">
                          {/* 부모 댓글 좋아요 버튼 */}
                          <button
                            type="button"
                            onClick={() =>
                              handleToggleCommentLike(
                                comment.comment_id,
                                comment.like_count || 0
                              )
                            }
                            className={`flex items-center gap-1 text-xs font-bold transition-colors ${
                              commentLikes[comment.comment_id]
                                ? 'text-rose-500'
                                : 'text-gray-400 hover:text-rose-500'
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                commentLikes[comment.comment_id]
                                  ? 'fill-current'
                                  : ''
                              }`}
                            />
                            {comment.like_count || 0}
                          </button>

                          {/* 작성자 본인 댓글이면 수정/삭제 */}
                          {currentUserId === comment.member_id ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleEditComment(comment)}
                                className="text-gray-300 hover:text-[var(--festival-purple)]"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteComment(comment.comment_id)
                                }
                                className="text-gray-300 hover:text-rose-500"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            // 다른 사람 댓글이면 신고
                            <button
                              type="button"
                              onClick={() => {
                                setReportTargetType('comment');
                                setReportTargetId(comment.comment_id);
                                setIsReportModalOpen(true);
                              }}
                              className="text-gray-300 hover:text-red-500"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* 댓글 수정 중이면 textarea 표시 */}
                      {editingCommentId === comment.comment_id ? (
                        <div className="flex flex-col gap-2">
                          <textarea
                            value={editedCommentText}
                            onChange={(e) =>
                              setEditedCommentText(e.target.value)
                            }
                            className="w-full bg-gray-50 border-none rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--festival-purple)]/20 outline-none resize-none"
                            rows="3"
                          />

                          <div className="flex gap-2 justify-end">
                            <button
                              type="button"
                              onClick={handleCancelEdit}
                              className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold"
                            >
                              취소
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleSaveEditedComment(comment.comment_id)
                              }
                              disabled={!editedCommentText.trim()}
                              className="px-4 py-2 rounded-xl bg-[var(--festival-purple)] text-white text-sm font-bold disabled:opacity-50"
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      ) : (
                        // 댓글 일반 표시
                        <p className="text-sm text-gray-600 mb-3 font-medium">
                          {comment.content}
                        </p>
                      )}

                      {/* 대댓글 입력창 열기 버튼 */}
                      <button
                        type="button"
                        onClick={() => {
                          setReplyTargetId(comment.comment_id);
                          setReplyText('');
                        }}
                        className="text-[11px] font-black text-gray-400 hover:text-[var(--festival-purple)] transition-colors"
                      >
                        답글
                      </button>

                      {/* 선택된 댓글에만 대댓글 입력창 표시 */}
                      {replyTargetId === comment.comment_id && (
                        <div className="mt-4 flex gap-2">
                          <input
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="답글을 입력하세요."
                            className="flex-grow bg-gray-50 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--festival-purple)]/20"
                          />

                          <button
                            type="button"
                            onClick={() => handleAddReply(comment.comment_id)}
                            disabled={!replyText.trim()}
                            className="px-4 py-2 rounded-xl bg-[var(--festival-purple)] text-white text-sm font-bold disabled:opacity-50"
                          >
                            등록
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setReplyTargetId(null);
                              setReplyText('');
                            }}
                            className="px-4 py-2 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold"
                          >
                            취소
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* =============================
                      대댓글 목록
                  ============================= */}
                  {comment.children && comment.children.length > 0 && (
                    <div className="ml-14 space-y-5 border-l-2 border-gray-50 pl-6">
                      {comment.children.map((reply) => (
                        <div key={reply.comment_id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                            <img
                              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.nickname}`}
                              alt=""
                            />
                          </div>

                          <div className="flex-grow">
                            {/* 대댓글 상단: 작성자 정보 + 액션 버튼 */}
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs text-gray-900">
                                  {reply.nickname}
                                </span>

                                <span className="text-[9px] font-bold text-gray-400">
                                  {formatDate(reply.created_at)}
                                </span>
                              </div>

                              {/* 
                                대댓글 액션 영역
                                여기서는 반드시 reply.comment_id 사용
                                comment.comment_id 쓰면 부모 댓글 좋아요가 눌림
                              */}
                              <div className="flex items-center gap-3">
                                {/* 대댓글 좋아요 버튼 */}
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleToggleCommentLike(
                                      reply.comment_id,
                                      reply.like_count || 0
                                    )
                                  }
                                  className={`flex items-center gap-1 text-[11px] font-bold transition-colors ${
                                    commentLikes[reply.comment_id]
                                      ? 'text-rose-500'
                                      : 'text-gray-400 hover:text-rose-500'
                                  }`}
                                >
                                  <Heart
                                    className={`w-3.5 h-3.5 ${
                                      commentLikes[reply.comment_id]
                                        ? 'fill-current'
                                        : ''
                                    }`}
                                  />
                                  {reply.like_count || 0}
                                </button>

                                {/* 작성자 본인 대댓글이면 수정/삭제 */}
                                {currentUserId === reply.member_id ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleEditComment(reply)}
                                      className="text-gray-300 hover:text-[var(--festival-purple)]"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleDeleteComment(reply.comment_id)
                                      }
                                      className="text-gray-300 hover:text-rose-500"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  // 다른 사람 대댓글이면 신고
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReportTargetType('reply');
                                      setReportTargetId(reply.comment_id);
                                      setIsReportModalOpen(true);
                                    }}
                                    className="text-gray-300 hover:text-red-500"
                                  >
                                    <AlertCircle className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* 대댓글 수정 중이면 textarea 표시 */}
                            {editingCommentId === reply.comment_id ? (
                              <div className="flex flex-col gap-2">
                                <textarea
                                  value={editedCommentText}
                                  onChange={(e) =>
                                    setEditedCommentText(e.target.value)
                                  }
                                  className="w-full bg-gray-50 border-none rounded-xl p-2 text-xs focus:ring-2 focus:ring-[var(--festival-purple)]/20 outline-none resize-none"
                                  rows="2"
                                />

                                <div className="flex gap-2 justify-end">
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="px-3 py-1 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold"
                                  >
                                    취소
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSaveEditedComment(reply.comment_id)
                                    }
                                    disabled={!editedCommentText.trim()}
                                    className="px-3 py-1 rounded-lg bg-[var(--festival-purple)] text-white text-xs font-bold disabled:opacity-50"
                                  >
                                    저장
                                  </button>
                                </div>
                              </div>
                            ) : (
                              // 대댓글 일반 표시
                              <p className="text-xs text-gray-600 font-medium">
                                {reply.content}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* 댓글이 없을 때 */}
              {comments.length === 0 && (
                <div className="text-center text-sm text-gray-400 font-bold py-10">
                  아직 댓글이 없습니다. 첫 댓글을 남겨보세요.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 신고 모달 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onSubmit={handleReportSubmit}
        targetType={reportTargetType}
        targetId={reportTargetId}
      />
    </div>
  );
};

export default PostDetailPage;