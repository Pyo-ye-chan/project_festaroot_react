import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Heart,
  MessageSquare,
  Share2,
  AlertCircle,
  ChevronLeft,
  Send,
  Trash2,
  Edit3,
  Download,
  List,
  Eye,
  Paperclip,
  MoreHorizontal,
} from 'lucide-react';

import ReportModal from '../components/ReportModal';

import {
  getPostDetail,
  deletePost,
  getComments,
  addComment,
  deleteComment,
  updateComment,
  togglePostLike,
  getPostLikeStatus,
  reportPost,
  toggleCommentLike,
  reportComment,
} from '../../../api/boardApi';
import { getMemberProfile } from '../../../api/memberApi';

import useAuthStore from '../../../store/useAuthStore';
import { DEFAULT_IMAGES } from '../../../constants/DefaultImages';

const COMMENT_MAX_LENGTH = 300;

// API가 영문 또는 한글 카테고리를 내려줘도 화면에는 한글만 표시합니다.
const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '후기',
  tip: '꿀팁',
  notice: '공지',

  전체: '전체',
  자유: '자유',
  후기: '후기',
  꿀팁: '꿀팁',
  공지: '공지',
};

// DB/API 카테고리 값이 영문, 한글, 게시판명으로 섞여도 하나의 key로 맞춥니다.
const CATEGORY_KEY_MAP = {
  all: 'all',
  free: 'free',
  review: 'review',
  tip: 'tip',
  notice: 'notice',

  전체: 'all',
  자유: 'free',
  후기: 'review',
  꿀팁: 'tip',
  공지: 'notice',

  전체게시판: 'all',
  자유게시판: 'free',
  축제후기: 'review',
  꿀팁공유: 'tip',
  공지사항: 'notice',
};

const categoryClass = {
  all: 'bg-gray-100 text-gray-600 border-gray-200',
  free: 'bg-slate-100 text-slate-600 border-slate-200',
  review: 'bg-purple-50 text-purple-600 border-purple-100',
  tip: 'bg-amber-50 text-amber-600 border-amber-100',
  notice: 'bg-blue-50 text-blue-600 border-blue-100',
};

// FREE, Free, free처럼 영문 카테고리의 대소문자가 달라도 같은 값으로 처리합니다.
const getCategoryLookupKey = (value) =>
  String(value ?? '')
    .normalize('NFKC')
    .trim()
    .toLowerCase();

const normalizeCategory = (value, fallback = 'unknown') => {
  const lookupKey = getCategoryLookupKey(value);

  if (!lookupKey) return fallback;

  return CATEGORY_KEY_MAP[lookupKey] || fallback;
};

const getCategoryLabel = (value) => {
  const rawValue = String(value ?? '').trim();
  const normalizedValue = normalizeCategory(rawValue);

  return (
    CATEGORY_LABELS[rawValue] ||
    CATEGORY_LABELS[normalizedValue] ||
    '기타'
  );
};

const getCategoryClasses = (value) => {
  const normalizedValue = normalizeCategory(value);

  return (
    categoryClass[normalizedValue] ||
    'bg-gray-100 text-gray-500 border-gray-200'
  );
};


const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 게시글 상태
  const [post, setPost] = useState(null);
  const [attachments, setAttachments] = useState([]);

  // 좋아요 상태
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // 대댓글 상태
  const [replyText, setReplyText] = useState('');
  const [replyTargetId, setReplyTargetId] = useState(null);

  // 댓글 수정 상태
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentText, setEditedCommentText] = useState('');

  // 신고 모달 상태
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportTargetType, setReportTargetType] = useState('');
  const [reportTargetId, setReportTargetId] = useState(null);

  // 공유 모달 상태
  const [showShareModal, setShowShareModal] = useState(false);

  // 댓글 좋아요 상태
  const [commentLikes, setCommentLikes] = useState({});

  // 현재 로그인 사용자 프로필 이미지 상태
  const [profileImageUrl, setProfileImageUrl] = useState(null);

  // 현재 로그인 사용자
  const { user, isLoggedIn } = useAuthStore();

  const currentUserId =
    user?.member_id ||
    user?.id ||
    user?.userId;

  // 비회원 화면 제어 기준: 로그인했고 사용자 ID가 있을 때만 댓글 기능을 보여줍니다.
  const isMemberLoggedIn = Boolean(isLoggedIn && currentUserId);

  // 현재 로그인 사용자 프로필 이미지 로드 (헤더와 동일한 방식)
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isMemberLoggedIn) {
        try {
          const resp = await getMemberProfile(currentUserId);
          const imgUrl = resp.data?.member?.profile_image_url ||
            resp.data?.profile_image_url ||
            resp.data?.data?.profile_image_url;
          setProfileImageUrl(imgUrl);
        } catch (error) {
          console.error('사용자 프로필 이미지 로드 실패:', error);
        }
      }
    };
    fetchUserProfile();
  }, [isMemberLoggedIn, currentUserId]);

  // 게시글 상세 조회
  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const postDetail = await getPostDetail(id);
        const postData = postDetail.data.dto;

        setPost(postData);
        setAttachments(postDetail.data.list || []);
        setLikeCount(postData.like_count || 0);
      } catch (error) {
        console.error('게시글 상세 조회 실패:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  // 게시글 좋아요 상태 조회
  // 비회원은 좋아요 상태 API를 호출하지 않습니다.
  useEffect(() => {
    if (!isMemberLoggedIn) {
      setIsLiked(false);
      return;
    }

    const fetchLikeStatus = async () => {
      try {
        const response = await getPostLikeStatus(id);

        setIsLiked(response.data.liked);
        setLikeCount(response.data.likeCount);
      } catch (error) {
        console.error('좋아요 상태 조회 실패:', error);
      }
    };

    fetchLikeStatus();
  }, [id, isMemberLoggedIn]);

  // 댓글 목록 조회
  const fetchComments = async () => {
    try {
      const response = await getComments(id);
      setComments(response.data || []);
    } catch (error) {
      console.error('댓글 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [id]);

  // 댓글 총 개수 계산
  const totalCommentCount = comments.reduce(
    (count, comment) => count + 1 + (comment.children?.length || 0),
    0
  );

  // 날짜 표시
  const formatDate = (dateValue) => {
    if (!dateValue) return '';
    return String(dateValue).replace('T', ' ').slice(0, 16);
  };

  // 프로필 이미지 로딩 실패 시 기본 이미지로 대체합니다.
  const handleProfileImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = DEFAULT_IMAGES.PROFILE;
  };

  // 게시글 삭제
  const handleDeletePost = async () => {
    if (!window.confirm('정말로 게시글을 삭제하시겠습니까?')) return;

    try {
      await deletePost(id);

      alert('게시글이 삭제되었습니다.');
      navigate('/community/board/all');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  // 게시글 좋아요
  // 비회원은 좋아요 요청을 보내지 않습니다.
  const handleTogglePostLike = async () => {
    if (!isMemberLoggedIn) return;

    try {
      const response = await togglePostLike(id);

      setIsLiked(response.data.liked);
      setLikeCount(response.data.likeCount);
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      alert('좋아요 처리에 실패했습니다.');
    }
  };



  // 공유 URL 생성
  const getShareUrl = () => {
    const postId = post?.post_id || post?.postId || id;

    return `${window.location.origin}/community/post/${postId}`;
  };

  // 카카오톡 공유
  // 카카오톡 공유
  const handleKakaoShare = () => {
    try {
      if (!window.Kakao) {
        alert('카카오 공유 기능을 불러오지 못했습니다.');
        return;
      }

      const kakaoKey = import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY;

      if (!kakaoKey) {
        alert('카카오 JavaScript 키가 설정되지 않았습니다.');
        return;
      }

      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
      }

      const shareUrl = getShareUrl();

      const plainContent =
        post?.content
          ?.replace(/<[^>]+>/g, '')
          ?.slice(0, 80) || '축제로 커뮤니티 게시글을 확인해보세요.';

      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: post?.title || '게시글 공유',
          description: `${shareUrl}\n\n${plainContent}`,
          imageUrl: 'https://festaroute.site/logo.png',
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: '게시글 보러가기',
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
      });

      setShowShareModal(false);
    } catch (error) {
      console.error('카카오 공유 실패:', error);
      alert('카카오 공유에 실패했습니다. 콘솔을 확인해주세요.');
    }
  };

  // 링크 복사
  const handleCopyLink = async () => {
    const shareUrl = getShareUrl();

    try {
      await navigator.clipboard.writeText(shareUrl);
      alert('링크가 복사되었습니다.');
      setShowShareModal(false);
    } catch (error) {
      console.error('링크 복사 실패:', error);

      // clipboard API가 막히는 환경 대비
      const textarea = document.createElement('textarea');
      textarea.value = shareUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      alert('링크가 복사되었습니다.');
      setShowShareModal(false);
    }
  };
  // 댓글 작성
  const handleAddComment = async () => {
    // 비회원은 댓글 입력창이 보이지 않지만, 혹시 직접 호출되는 경우도 한 번 더 막습니다.
    if (!isMemberLoggedIn) {
      alert('로그인 후 댓글을 작성할 수 있습니다.');
      return;
    }

    if (!commentText.trim()) return;

    if (commentText.trim().length > COMMENT_MAX_LENGTH) {
      alert(`댓글은 ${COMMENT_MAX_LENGTH}자까지 입력할 수 있습니다.`);
      return;
    }

    try {
      await addComment(id, commentText);
      setCommentText('');
      fetchComments();
    } catch (error) {
      console.error('댓글 작성 실패:', error);
      alert('댓글 작성에 실패했습니다.');
    }
  };

  // 대댓글 작성
  const handleAddReply = async (parentCommentId) => {
    // 비회원은 답글 입력창이 보이지 않지만, 혹시 직접 호출되는 경우도 한 번 더 막습니다.
    if (!isMemberLoggedIn) {
      alert('로그인 후 답글을 작성할 수 있습니다.');
      return;
    }

    if (!replyText.trim()) return;

    if (replyText.trim().length > COMMENT_MAX_LENGTH) {
      alert(`댓글은 ${COMMENT_MAX_LENGTH}자까지 입력할 수 있습니다.`);
      return;
    }

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

  // 댓글 삭제
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

  // 댓글 수정 시작
  const handleEditComment = (comment) => {
    setEditingCommentId(comment.comment_id);
    setEditedCommentText(comment.content);
  };

  // 댓글 수정 취소
  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditedCommentText('');
  };

  // 댓글 수정 저장
  const handleSaveEditedComment = async (commentId) => {
    if (!editedCommentText.trim()) {
      alert('수정할 내용을 입력해 주세요.');
      return;
    }

    if (editedCommentText.trim().length > COMMENT_MAX_LENGTH) {
      alert(`댓글은 ${COMMENT_MAX_LENGTH}자까지 입력할 수 있습니다.`);
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

  // 댓글 좋아요
  const handleToggleCommentLike = async (commentId) => {
    // 비회원은 댓글 좋아요 버튼이 보이지 않지만, 혹시 직접 호출되는 경우도 한 번 더 막습니다.
    if (!isMemberLoggedIn) {
      alert('로그인 후 이용할 수 있습니다.');
      return;
    }

    try {
      const response = await toggleCommentLike(commentId);
      const { liked, likeCount } = response.data;

      setCommentLikes((prev) => ({
        ...prev,
        [commentId]: liked,
      }));

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.comment_id === commentId
            ? { ...comment, like_count: likeCount }
            : {
              ...comment,
              children: comment.children?.map((reply) =>
                reply.comment_id === commentId
                  ? { ...reply, like_count: likeCount }
                  : reply
              ),
            }
        )
      );
    } catch (error) {
      console.error('댓글 좋아요 실패:', error);
      alert('댓글 좋아요 처리에 실패했습니다.');
    }
  };

  // 신고 제출
  const handleReportSubmit = async ({
    targetType,
    targetId,
    reason,
    customReason,
  }) => {
    // 비회원은 신고 버튼이 보이지 않지만, 혹시 직접 호출되는 경우도 한 번 더 막습니다.
    if (!isMemberLoggedIn) {
      alert('로그인 후 신고할 수 있습니다.');
      return;
    }

    try {
      const finalReason = reason === '기타' ? customReason : reason;

      if (!finalReason?.trim()) {
        alert('신고 사유를 입력해 주세요.');
        return;
      }

      if (targetType === 'post') {
        await reportPost(targetId, finalReason);
        alert('게시글 신고가 접수되었습니다.');
      }

      if (targetType === 'comment' || targetType === 'reply') {
        await reportComment(targetId, finalReason);
        alert('댓글 신고가 접수되었습니다.');
        fetchComments();
      }

      setIsReportModalOpen(false);
      setReportTargetType('');
      setReportTargetId(null);
    } catch (error) {
      console.error('신고 실패:', error);

      if (error.response?.data === 'already_reported') {
        alert('이미 신고한 대상입니다.');
      } else {
        alert('신고 처리에 실패했습니다.');
      }
    }
  };

  if (!post) {
    return (
      <div className="min-h-screen bg-[#f7f7f8] flex items-center justify-center font-['Pretendard']">
        <p className="text-sm font-semibold text-gray-400">
          게시글을 불러오는 중입니다.
        </p>
      </div>
    );
  }

  const writerName =
    post.nickname ||
    post.member_nickname ||
    post.member_id ||
    '알 수 없는 사용자';

  const isPostOwner = currentUserId === post.member_id;

  return (
    <div className="min-h-screen bg-[#f7f7f8] font-['Pretendard'] text-gray-900 pb-24">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* 상단 이동 영역 */}
        <div className="mb-5 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/community/board/all')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            게시판으로 돌아가기
          </button>
        </div>

        {/* 게시글 카드 */}
        <article className="bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
          {/* 게시글 헤더 */}
          <header className="px-6 sm:px-10 pt-9 pb-7 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-5">
              <span
                className={`inline-flex items-center h-7 px-3 rounded-full border text-xs font-extrabold ${getCategoryClasses(
                  post.category
                )}`}
              >
                {getCategoryLabel(post.category)}
              </span>

              <span className="text-xs font-semibold text-gray-400">
                {formatDate(post.created_at)}
              </span>
            </div>

            <h1 className="text-[28px] sm:text-4xl font-black text-gray-950 leading-tight tracking-[-0.03em] mb-7">
              {post.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  <img
                    src={post.profile_image_url || DEFAULT_IMAGES.PROFILE}
                    alt=""
                    onError={handleProfileImageError}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <p className="text-sm font-extrabold text-gray-900">
                    {writerName}
                  </p>
                  <p className="text-xs font-semibold text-gray-400">
                    작성자
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs sm:text-sm font-bold text-gray-400">
                <span className="inline-flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {post.view_count || 0}
                </span>

                {normalizeCategory(post.category) !== 'notice' && (
                  <>
                    <span className="inline-flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {likeCount}
                    </span>

                    <span className="inline-flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      {totalCommentCount}
                    </span>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* 게시글 본문 */}
          <div className="px-6 sm:px-10 py-10">
            <div
              className="
                prose prose-lg max-w-none
                prose-p:text-gray-700
                prose-p:leading-8
                prose-headings:text-gray-950
                prose-headings:font-black
                prose-strong:text-gray-950
                prose-a:text-purple-600
                prose-img:rounded-2xl
                prose-img:border
                prose-img:border-gray-100
                prose-img:mx-auto
              "
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />

            {/* 첨부파일 */}
            {attachments.length > 0 && (
              <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Paperclip className="w-5 h-5 text-gray-500" />
                  <h3 className="text-sm font-black text-gray-800">
                    첨부파일
                  </h3>
                  <span className="text-xs font-bold text-gray-400">
                    {attachments.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {attachments.map((file) => (
                    <button
                      key={file.attach_id || file.file_path}
                      type="button"
                      onClick={() => {
                        window.location.href = `http://localhost/storage/download/${file.attach_id}`;
                      }}
                      className="w-full flex items-center justify-between gap-4 rounded-xl bg-white border border-gray-200 px-4 py-3 hover:border-purple-200 hover:bg-purple-50/40 transition-colors"
                    >
                      <span className="text-sm font-semibold text-gray-700 truncate">
                        {file.file_name}
                      </span>

                      <span className="flex items-center gap-1 text-xs font-black text-purple-600 shrink-0">
                        <Download className="w-4 h-4" />
                        다운로드
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 게시글 액션 */}
            <div className="mt-12 pt-7 border-t border-gray-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {isMemberLoggedIn && !isPostOwner && normalizeCategory(post.category) !== 'notice' && (
                    <button
                      type="button"
                      onClick={handleTogglePostLike}
                      className={`
                        inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-black transition-all active:scale-95
                        ${isLiked
                          ? 'bg-rose-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-rose-50 hover:text-rose-500'
                        }
                      `}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                      좋아요 {likeCount}
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowShareModal(true)}
                    className="inline-flex items-center gap-2 h-11 px-5 rounded-full bg-gray-100 text-gray-700 text-sm font-black hover:bg-gray-200 transition-colors active:scale-95"
                  >
                    <Share2 className="w-4 h-4" />
                    공유
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  {isPostOwner ? (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(`/community/update/${post.post_id}`, {
                            state: { post },
                          })
                        }
                        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                        수정
                      </button>

                      <button
                        type="button"
                        onClick={handleDeletePost}
                        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        삭제
                      </button>
                    </>
                  ) : (
                    isMemberLoggedIn && !isPostOwner && normalizeCategory(post.category) !== 'notice' && (
                      <button
                        type="button"
                        onClick={() => {
                          setReportTargetType('post');
                          setReportTargetId(post.post_id);
                          setIsReportModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 h-10 px-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <AlertCircle className="w-4 h-4" />
                        신고
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* 댓글 섹션 */}
        {normalizeCategory(post.category) !== 'notice' && (
          <section className="mt-6 bg-white rounded-3xl border border-gray-200/70 shadow-sm overflow-hidden">
            <div className="px-6 sm:px-10 py-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                <h2 className="text-xl font-black text-gray-950">
                  댓글
                </h2>
                <span className="text-sm font-black text-purple-600">
                  {totalCommentCount}
                </span>
              </div>
            </div>

            <div className="px-6 sm:px-10 py-7">
              {/* 댓글 입력: 비회원에게는 댓글 입력창을 숨깁니다. */}
              {isMemberLoggedIn && (
                <div className="mb-8">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                      <img
                        src={profileImageUrl || DEFAULT_IMAGES.PROFILE}
                        alt=""
                        onError={handleProfileImageError}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                        placeholder="댓글을 남겨보세요."
                        maxLength={COMMENT_MAX_LENGTH}
                        className="w-full min-h-[96px] rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm resize-none outline-none focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                      />

                      <div className="flex items-center justify-between mt-3 gap-3">
                        <span className="text-xs font-bold text-gray-400">
                          {commentText.length} / {COMMENT_MAX_LENGTH}
                        </span>
                        <button
                          type="button"
                          onClick={handleAddComment}
                          disabled={!commentText.trim()}
                          className="inline-flex items-center gap-2 h-10 px-4 rounded-xl bg-purple-600 text-white text-sm font-black hover:bg-purple-700 disabled:opacity-40 transition-colors"
                        >
                          <Send className="w-4 h-4" />
                          등록
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 댓글 목록 */}
              {comments.length === 0 ? (
                <div className="py-12 text-center">
                  <p className="text-sm font-bold text-gray-400">
                    {isMemberLoggedIn ? '아직 댓글이 없습니다. 첫 댓글을 남겨보세요.' : '아직 댓글이 없습니다.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {comments.map((comment) => {
                    const isMyComment = currentUserId === comment.member_id;

                    return (
                      <div key={comment.comment_id} className="py-6">
                        {/* 부모 댓글 */}
                        <div className="flex gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                            <img
                              src={comment.profile_image_url || DEFAULT_IMAGES.PROFILE}
                              alt=""
                              onError={handleProfileImageError}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-black text-gray-900">
                                    {comment.nickname || comment.member_id || '알 수 없는 사용자'}
                                  </span>

                                  {comment.member_id === post.member_id && (
                                    <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-[10px] font-bold text-purple-600">
                                      작성자
                                    </span>
                                  )}
                                </div>

                                <p className="mt-0.5 text-xs font-medium text-gray-400">
                                  {formatDate(comment.created_at)}
                                </p>
                              </div>

                              <div className="flex items-center gap-1">
                                {isMyComment ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleEditComment(comment)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                                      title="수정"
                                    >
                                      <Edit3 className="w-4 h-4" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteComment(comment.comment_id)}
                                      className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                      title="삭제"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : isMemberLoggedIn ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handleToggleCommentLike(comment.comment_id)}
                                      className={`
                                      inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold transition-colors
                                      ${commentLikes[comment.comment_id]
                                          ? 'text-rose-500 bg-rose-50'
                                          : 'text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                                        }
                                    `}
                                    >
                                      <Heart
                                        className={`w-3.5 h-3.5 ${commentLikes[comment.comment_id] ? 'fill-current' : ''
                                          }`}
                                      />
                                      {comment.like_count || 0}
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => {
                                        setReportTargetType('comment');
                                        setReportTargetId(comment.comment_id);
                                        setIsReportModalOpen(true);
                                      }}
                                      className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                      title="신고"
                                    >
                                      <AlertCircle className="w-4 h-4" />
                                    </button>
                                  </>
                                ) : null}
                              </div>
                            </div>

                            {editingCommentId === comment.comment_id ? (
                              <div className="mt-3">
                                <textarea
                                  value={editedCommentText}
                                  onChange={(e) => setEditedCommentText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm resize-none outline-none focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                                  maxLength={COMMENT_MAX_LENGTH}
                                  rows="3"
                                />

                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    className="h-9 px-3 rounded-lg bg-gray-100 text-gray-500 text-sm font-bold hover:bg-gray-200 transition-colors"
                                  >
                                    취소
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleSaveEditedComment(comment.comment_id)}
                                    disabled={!editedCommentText.trim()}
                                    className="h-9 px-3 rounded-lg bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 disabled:opacity-40 transition-colors"
                                  >
                                    저장
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="mt-3 text-[15px] text-gray-700 leading-7 whitespace-pre-wrap">
                                {comment.content}
                              </p>
                            )}

                            {/* 답글 버튼: 비회원에게는 대댓글 입력 버튼을 숨깁니다. */}
                            {isMemberLoggedIn && editingCommentId !== comment.comment_id && (
                              <button
                                type="button"
                                onClick={() => {
                                  setReplyTargetId(comment.comment_id);
                                  setReplyText('');
                                }}
                                className="mt-3 text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors"
                              >
                                답글
                              </button>
                            )}

                            {/* 대댓글 입력 */}
                            {isMemberLoggedIn && replyTargetId === comment.comment_id && (
                              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                <input
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                                  placeholder="답글을 입력하세요."
                                  maxLength={COMMENT_MAX_LENGTH}
                                  className="flex-1 h-10 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm outline-none focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                                />

                                <div className="flex gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleAddReply(comment.comment_id)}
                                    disabled={!replyText.trim()}
                                    className="h-10 px-4 rounded-xl bg-purple-600 text-white text-sm font-bold hover:bg-purple-700 disabled:opacity-40 transition-colors"
                                  >
                                    등록
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReplyTargetId(null);
                                      setReplyText('');
                                    }}
                                    className="h-10 px-4 rounded-xl bg-gray-100 text-gray-500 text-sm font-bold hover:bg-gray-200 transition-colors"
                                  >
                                    취소
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* 대댓글 목록 */}
                            {comment.children && comment.children.length > 0 && (
                              <div className="mt-5 space-y-5 border-l-2 border-gray-100 pl-5">
                                {comment.children.map((reply) => {
                                  const isMyReply = currentUserId === reply.member_id;

                                  return (
                                    <div key={reply.comment_id} className="flex gap-3">
                                      <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                        <img
                                          src={reply.profile_image_url || DEFAULT_IMAGES.PROFILE}
                                          alt=""
                                          onError={handleProfileImageError}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>

                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-3">
                                          <div>
                                            <div className="flex items-center gap-2">
                                              <span className="text-xs font-black text-gray-900">
                                                {reply.nickname || reply.member_id || '알 수 없는 사용자'}
                                              </span>

                                              {reply.member_id === post.member_id && (
                                                <span className="px-1.5 py-0.5 rounded-md bg-purple-50 text-[10px] font-bold text-purple-600">
                                                  작성자
                                                </span>
                                              )}
                                            </div>

                                            <p className="mt-0.5 text-[11px] font-medium text-gray-400">
                                              {formatDate(reply.created_at)}
                                            </p>
                                          </div>

                                          <div className="flex items-center gap-1">
                                            {isMyReply ? (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={() => handleEditComment(reply)}
                                                  className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-purple-600 transition-colors"
                                                  title="수정"
                                                >
                                                  <Edit3 className="w-3.5 h-3.5" />
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() => handleDeleteComment(reply.comment_id)}
                                                  className="p-1.5 rounded-lg text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition-colors"
                                                  title="삭제"
                                                >
                                                  <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                              </>
                                            ) : isMemberLoggedIn ? (
                                              <>
                                                <button
                                                  type="button"
                                                  onClick={() => handleToggleCommentLike(reply.comment_id)}
                                                  className={`
                                                  inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-bold transition-colors
                                                  ${commentLikes[reply.comment_id]
                                                      ? 'text-rose-500 bg-rose-50'
                                                      : 'text-gray-400 hover:bg-rose-50 hover:text-rose-500'
                                                    }
                                                `}
                                                >
                                                  <Heart
                                                    className={`w-3.5 h-3.5 ${commentLikes[reply.comment_id]
                                                      ? 'fill-current'
                                                      : ''
                                                      }`}
                                                  />
                                                  {reply.like_count || 0}
                                                </button>

                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setReportTargetType('reply');
                                                    setReportTargetId(reply.comment_id);
                                                    setIsReportModalOpen(true);
                                                  }}
                                                  className="p-1.5 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                                  title="신고"
                                                >
                                                  <AlertCircle className="w-3.5 h-3.5" />
                                                </button>
                                              </>
                                            ) : null}
                                          </div>
                                        </div>

                                        {editingCommentId === reply.comment_id ? (
                                          <div className="mt-3">
                                            <textarea
                                              value={editedCommentText}
                                              onChange={(e) => setEditedCommentText(e.target.value.slice(0, COMMENT_MAX_LENGTH))}
                                              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm resize-none outline-none focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-100"
                                              maxLength={COMMENT_MAX_LENGTH}
                                              rows="2"
                                            />

                                            <div className="flex justify-end gap-2 mt-2">
                                              <button
                                                type="button"
                                                onClick={handleCancelEdit}
                                                className="h-8 px-3 rounded-lg bg-gray-100 text-gray-500 text-xs font-bold hover:bg-gray-200 transition-colors"
                                              >
                                                취소
                                              </button>

                                              <button
                                                type="button"
                                                onClick={() => handleSaveEditedComment(reply.comment_id)}
                                                disabled={!editedCommentText.trim()}
                                                className="h-8 px-3 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 disabled:opacity-40 transition-colors"
                                              >
                                                저장
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <p className="mt-2 text-sm text-gray-700 leading-6 whitespace-pre-wrap">
                                            {reply.content}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 하단 목록 버튼 */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            onClick={() => navigate('/community/board/all')}
            className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white border border-gray-200 text-gray-700 text-sm font-black shadow-sm hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all active:scale-95"
          >
            <List className="w-4 h-4" />
            게시글 목록으로 가기
          </button>
        </div>
      </main>

      {/* 공유 모달 */}
      {showShareModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-[2px] px-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <h3 className="text-xl font-black text-gray-950">
                  게시글 공유하기
                </h3>

                <p className="mt-1 text-sm text-gray-500 font-medium">
                  친구에게 이 게시글을 공유해보세요.
                </p>
              </div>

            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleKakaoShare}
                className="w-full h-12 rounded-2xl bg-[#FEE500] text-[#181600] font-black hover:brightness-95 transition-all"
              >
                카카오톡으로 공유하기
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full h-12 rounded-2xl bg-gray-100 text-gray-700 font-black hover:bg-gray-200 transition-all"
              >
                링크 복사하기
              </button>

              <button
                type="button"
                onClick={() => setShowShareModal(false)}
                className="w-full h-10 text-sm text-gray-400 font-bold hover:text-gray-600"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

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
