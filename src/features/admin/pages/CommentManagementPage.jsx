import { useCallback, useEffect, useMemo, useState } from 'react';
import CommentDetailView from '../components/CommentDetailView';
import {
  Search,
  RotateCcw,
  CalendarDays,
  MessageCircle,
  ShieldAlert,
  Eye,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardCheck,
  CornerDownRight,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import {
  getAdminCommentSummary,
  getWaitingCommentReports,
  getAdminComments,
  getAdminCommentDetail,
  getAdminPostDetail,
  processAdminCommentReport,
  deleteAdminComment,
  deleteAdminComments,
} from '../../../api/adminApi';

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '리뷰',
  tip: '팁',
  notice: '공지',
};

const SEARCH_TYPE_OPTIONS = [
  { value: 'content', label: '내용 검색' },
  { value: 'author', label: '작성자' },
  { value: 'id', label: '댓글 ID' },
  { value: 'postTitle', label: '게시글 제목' },
  { value: 'postId', label: '게시글 ID' },
];

const REPORT_RESULT_LABELS = {
  WAITING: '접수',
  ACCEPTED: '인정',
  REJECTED: '반려',
};

const REPORT_RESULT_CLASSES = {
  WAITING: 'bg-yellow-50 text-yellow-600',
  ACCEPTED: 'bg-red-50 text-red-500',
  REJECTED: 'bg-gray-100 text-gray-500',
};

const COMMENT_PAGE_SIZE = 5;
const REPORT_PAGE_SIZE = 4;

const INITIAL_STATS = {
  total: 0,
  today: 0,
  reportedCommentCount: 0,
  pendingReportCount: 0,
};

const commentTypeClass = {
  COMMENT: 'bg-purple-50 text-purple-600',
  REPLY: 'bg-blue-50 text-blue-600',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const normalizeCategory = (category) => String(category || '').toLowerCase();

const getCommentType = (comment) => {
  if (comment?.commentType) return comment.commentType;
  return comment?.parentCommentId ? 'REPLY' : 'COMMENT';
};

const getCommentTypeLabel = (comment) =>
  getCommentType(comment) === 'REPLY' ? '대댓글' : '댓글';

const getCommentCode = (comment) => {
  if (comment?.commentCode) return comment.commentCode;
  return `CMT-${String(comment?.commentId || 0).padStart(5, '0')}`;
};

const getPostCode = (comment) => {
  if (comment?.postCode) return comment.postCode;
  return `POST-${String(comment?.postId || 0).padStart(3, '0')}`;
};

const getReportCode = (report) => {
  if (report?.reportCode) return report.reportCode;
  return `RPT-${String(report?.reportId || 0).padStart(5, '0')}`;
};

const getReportCount = (comment) =>
  Number(comment?.reportCount ?? comment?.reportItems?.length ?? 0);

const getPendingReportCount = (comment) =>
  Number(
    comment?.pendingReportCount ??
      comment?.reportItems?.filter((report) => report.status === 'WAITING')
        .length ??
      0
  );

const getSearchPlaceholder = (searchType) => {
  if (searchType === 'author') return '작성자 ID를 입력해 주세요.';
  if (searchType === 'id') return '댓글 ID를 입력해 주세요.';
  if (searchType === 'postTitle') return '게시글 제목을 입력해 주세요.';
  if (searchType === 'postId') return '게시글 ID를 입력해 주세요.';
  return '댓글 내용을 입력해 주세요.';
};

const getErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  return responseData?.message || responseData?.error || fallback;
};

const CommentManagementPage = () => {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [waitingReportRows, setWaitingReportRows] = useState([]);
  const [comments, setComments] = useState([]);

  const [keywordInput, setKeywordInput] = useState('');
  const [searchType, setSearchType] = useState('content');
  const [searchCondition, setSearchCondition] = useState({
    searchType: 'content',
    keyword: '',
  });
  const [category, setCategory] = useState('all');
  const [commentType, setCommentType] = useState('all');

  const [selectedCommentIds, setSelectedCommentIds] = useState([]);
  const [selectedComment, setSelectedComment] = useState(null);
  const [sourcePost, setSourcePost] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [reportPage, setReportPage] = useState(1);
  const [reportTotalPages, setReportTotalPages] = useState(1);
  const [reportTotalCount, setReportTotalCount] = useState(0);

  const [commentPage, setCommentPage] = useState(1);
  const [commentTotalPages, setCommentTotalPages] = useState(1);
  const [commentTotalCount, setCommentTotalCount] = useState(0);

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [openingCommentId, setOpeningCommentId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const response = await getAdminCommentSummary();
      const data = response.data || {};

      setStats({
        total: Number(data.total || 0),
        today: Number(data.today || 0),
        reportedCommentCount: Number(data.reportedCommentCount || 0),
        pendingReportCount: Number(data.pendingReportCount || 0),
      });
    } catch (error) {
      console.error('댓글 관리자 통계 조회 실패:', error);
      setLoadError(
        getErrorMessage(error, '댓글 관리자 통계를 불러오지 못했습니다.')
      );
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadWaitingReports = useCallback(async (targetPage) => {
    setReportsLoading(true);

    try {
      const response = await getWaitingCommentReports({
        page: targetPage,
        size: REPORT_PAGE_SIZE,
      });
      const data = response.data || {};
      const totalCount = Math.max(Number(data.totalCount || 0), 0);
      const calculatedTotalPages = Math.max(
        1,
        Math.ceil(totalCount / REPORT_PAGE_SIZE)
      );
      const totalPages = Math.max(
        Number(data.totalPages || calculatedTotalPages),
        1
      );
      const safeTargetPage = Math.min(Math.max(targetPage, 1), totalPages);

      setReportTotalPages(totalPages);
      setReportTotalCount(totalCount);

      if (safeTargetPage !== targetPage) {
        setReportPage(safeTargetPage);
        return;
      }

      setWaitingReportRows(Array.isArray(data.list) ? data.list : []);
    } catch (error) {
      console.error('처리 대기 댓글 신고 조회 실패:', error);
      setWaitingReportRows([]);
      setLoadError(
        getErrorMessage(
          error,
          '처리 대기 댓글 신고 목록을 불러오지 못했습니다.'
        )
      );
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const loadComments = useCallback(
    async (targetPage) => {
      setCommentsLoading(true);

      try {
        const response = await getAdminComments({
          page: targetPage,
          size: COMMENT_PAGE_SIZE,
          category,
          commentType,
          searchType: searchCondition.searchType,
          keyword: searchCondition.keyword,
        });
        const data = response.data || {};
        const totalCount = Math.max(Number(data.totalCount || 0), 0);
        const calculatedTotalPages = Math.max(
          1,
          Math.ceil(totalCount / COMMENT_PAGE_SIZE)
        );
        const totalPages = Math.max(
          Number(data.totalPages || calculatedTotalPages),
          1
        );
        const safeTargetPage = Math.min(Math.max(targetPage, 1), totalPages);

        setCommentTotalPages(totalPages);
        setCommentTotalCount(totalCount);

        if (safeTargetPage !== targetPage) {
          setCommentPage(safeTargetPage);
          return;
        }

        setComments(Array.isArray(data.list) ? data.list : []);
      } catch (error) {
        console.error('전체 댓글 조회 실패:', error);
        setComments([]);
        setLoadError(
          getErrorMessage(error, '전체 댓글 목록을 불러오지 못했습니다.')
        );
      } finally {
        setCommentsLoading(false);
      }
    },
    [category, commentType, searchCondition]
  );

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadWaitingReports(reportPage);
  }, [loadWaitingReports, reportPage]);

  useEffect(() => {
    loadComments(commentPage);
  }, [loadComments, commentPage]);

  const handleReportPageChange = (nextPage) => {
    if (reportsLoading) return;

    const safeNextPage = Math.min(
      Math.max(Number(nextPage) || 1, 1),
      Math.max(reportTotalPages, 1)
    );

    if (safeNextPage === reportPage) return;

    setLoadError('');
    setReportPage(safeNextPage);
  };

  const handleCommentPageChange = (nextPage) => {
    if (commentsLoading) return;

    const safeNextPage = Math.min(
      Math.max(Number(nextPage) || 1, 1),
      Math.max(commentTotalPages, 1)
    );

    if (safeNextPage === commentPage) return;

    setLoadError('');
    setSelectedCommentIds([]);
    setCommentPage(safeNextPage);
  };

  const isAllChecked = useMemo(() => {
    return (
      comments.length > 0 &&
      comments.every((comment) =>
        selectedCommentIds.includes(comment.commentId)
      )
    );
  }, [comments, selectedCommentIds]);

  const refreshOverview = async () => {
    await Promise.allSettled([
      loadSummary(),
      loadWaitingReports(reportPage),
      loadComments(commentPage),
    ]);
  };

  const handleRetry = async () => {
    setLoadError('');
    await refreshOverview();
  };

  const handleSearch = () => {
    setSearchCondition({
      searchType,
      keyword: keywordInput.trim(),
    });
    setSelectedCommentIds([]);
    setCommentPage(1);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setKeywordInput('');
    setSearchType('content');
    setSearchCondition({
      searchType: 'content',
      keyword: '',
    });
    setCategory('all');
    setCommentType('all');
    setSelectedCommentIds([]);
    setCommentPage(1);
  };

  const handleChangeCategory = (nextCategory) => {
    setCategory(nextCategory);
    setSelectedCommentIds([]);
    setCommentPage(1);
  };

  const handleChangeCommentType = (nextType) => {
    setCommentType(nextType);
    setSelectedCommentIds([]);
    setCommentPage(1);
  };

  const handleChangeSearchType = (nextSearchType) => {
    setSearchType(nextSearchType);
  };

  const handleOpenDetail = async (commentId, reportId = null) => {
    if (openingCommentId !== null) return;

    setOpeningCommentId(commentId);
    setSelectedReportId(reportId);
    setSourcePost(null);

    try {
      const commentResponse = await getAdminCommentDetail(commentId);
      const commentData = commentResponse.data || null;

      if (!commentData) {
        throw new Error('댓글 상세 응답이 비어 있습니다.');
      }

      let postData = null;

      if (commentData.postId) {
        try {
          const postResponse = await getAdminPostDetail(commentData.postId);
          postData = postResponse.data || null;
        } catch (postError) {
          // 원 게시글 조회 실패가 댓글 상세 진입 자체를 막지는 않도록 합니다.
          console.error('원 게시글 상세 조회 실패:', postError);
        }
      }

      setSourcePost(postData);
      setSelectedComment(commentData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('댓글 상세 조회 실패:', error);
      window.alert(
        getErrorMessage(error, '댓글 상세 정보를 불러오지 못했습니다.')
      );
    } finally {
      setOpeningCommentId(null);
    }
  };

  const handleBackToList = () => {
    setSelectedComment(null);
    setSourcePost(null);
    setSelectedReportId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAll = () => {
    const currentPageIds = comments.map((comment) => comment.commentId);

    if (isAllChecked) {
      setSelectedCommentIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
      return;
    }

    setSelectedCommentIds((prev) =>
      Array.from(new Set([...prev, ...currentPageIds]))
    );
  };

  const handleToggleComment = (commentId) => {
    setSelectedCommentIds((prev) => {
      if (prev.includes(commentId)) {
        return prev.filter((id) => id !== commentId);
      }

      return [...prev, commentId];
    });
  };

  const handleDeleteComment = async (commentId) => {
    if (actionLoading) return;

    const target =
      selectedComment?.commentId === commentId
        ? selectedComment
        : comments.find((comment) => comment.commentId === commentId);

    const contentText = target?.content
      ? `\n내용: ${target.content}`
      : '';
    const isConfirmed = window.confirm(
      `댓글과 연결된 좋아요 및 신고 데이터가 함께 삭제됩니다. 부모 댓글인 경우 대댓글도 함께 삭제됩니다.\n\n댓글 ID: ${getCommentCode(
        target || { commentId }
      )}${contentText}\n\n정말 완전 삭제할까요?`
    );

    if (!isConfirmed) return;

    setActionLoading(true);

    try {
      await deleteAdminComment(commentId);

      setSelectedCommentIds((prev) =>
        prev.filter((id) => id !== commentId)
      );

      if (selectedComment?.commentId === commentId) {
        setSelectedComment(null);
        setSourcePost(null);
        setSelectedReportId(null);
      }

      await refreshOverview();
      window.alert('댓글이 완전 삭제되었습니다.');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      window.alert(getErrorMessage(error, '댓글 삭제 중 오류가 발생했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelectedComments = async () => {
    if (actionLoading) return;

    if (selectedCommentIds.length === 0) {
      window.alert('삭제할 댓글을 선택해주세요.');
      return;
    }

    const isConfirmed = window.confirm(
      `선택한 댓글 ${selectedCommentIds.length}건을 완전 삭제할까요?\n\n댓글과 연결된 좋아요 및 신고 데이터가 함께 삭제되며, 부모 댓글인 경우 대댓글도 함께 삭제됩니다.`
    );

    if (!isConfirmed) return;

    setActionLoading(true);

    try {
      await deleteAdminComments(selectedCommentIds);
      setSelectedCommentIds([]);
      await refreshOverview();
      window.alert('선택한 댓글이 완전 삭제되었습니다.');
    } catch (error) {
      console.error('선택 댓글 삭제 실패:', error);
      window.alert(
        getErrorMessage(error, '선택 댓글 삭제 중 오류가 발생했습니다.')
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessReport = async ({
    commentId,
    reportId,
    resultStatus,
    adminMemo,
  }) => {
    if (actionLoading) return;

    const resultLabel = REPORT_RESULT_LABELS[resultStatus] || resultStatus;
    const isConfirmed = window.confirm(
      `신고 ${getReportCode({ reportId })}을(를) '${resultLabel}' 처리할까요?\n\n선택한 댓글 신고 내역 한 건만 처리됩니다.`
    );

    if (!isConfirmed) return;

    setActionLoading(true);

    try {
      await processAdminCommentReport({
        commentId,
        reportId,
        resultStatus,
        adminMemo,
      });

      const detailResponse = await getAdminCommentDetail(commentId);
      setSelectedComment(detailResponse.data);
      setSelectedReportId(reportId);

      await refreshOverview();

      window.alert(
        resultStatus === 'ACCEPTED'
          ? '댓글 신고를 인정 처리했습니다.'
          : '댓글 신고를 반려 처리했습니다.'
      );
    } catch (error) {
      console.error('댓글 신고 처리 실패:', error);
      window.alert(
        getErrorMessage(error, '댓글 신고 처리 중 오류가 발생했습니다.')
      );
    } finally {
      setActionLoading(false);
    }
  };

  if (selectedComment) {
    return (
      <CommentDetailView
        comment={selectedComment}
        post={sourcePost}
        initialReportId={selectedReportId}
        onBack={handleBackToList}
        onDelete={handleDeleteComment}
        onProcessReport={handleProcessReport}
        actionLoading={actionLoading}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
          댓글 관리
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          댓글 원문과 연결 게시글을 확인하고, 접수된 댓글 신고는 관리자 메모와 함께 인정 또는 반려 처리합니다.
        </p>
      </section>

      {loadError && (
        <section className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle
              size={20}
              className="mt-0.5 shrink-0 text-red-500"
            />
            <p className="text-sm font-bold text-red-600">{loadError}</p>
          </div>

          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-4 text-xs font-black text-red-500 transition hover:bg-red-100"
          >
            <RotateCcw size={14} />
            다시 불러오기
          </button>
        </section>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={MessageCircle}
          title="총 댓글"
          value={stats.total}
          unit="개"
          description="게시판 전체 댓글과 대댓글"
          iconClass="bg-purple-50 text-[#6d3df2]"
          loading={summaryLoading}
        />
        <SummaryCard
          icon={CalendarDays}
          title="오늘 등록"
          value={stats.today}
          unit="개"
          description="오늘 새로 등록된 댓글"
          iconClass="bg-blue-50 text-blue-600"
          loading={summaryLoading}
        />
        <SummaryCard
          icon={ShieldAlert}
          title="신고 댓글"
          value={stats.reportedCommentCount}
          unit="개"
          description="신고가 1회 이상 접수된 댓글"
          iconClass="bg-red-50 text-red-500"
          loading={summaryLoading}
        />
        <SummaryCard
          icon={ClipboardCheck}
          title="처리 대기 신고"
          value={stats.pendingReportCount}
          unit="개"
          description="인정 또는 반려 처리 대기"
          iconClass="bg-yellow-50 text-yellow-600"
          loading={summaryLoading}
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-red-50 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-gray-900">
                신고 접수 댓글
              </h2>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50 px-3 text-xs font-black text-red-500">
                {formatNumber(reportTotalCount)}건
              </span>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50/70 px-3 text-xs font-black text-red-500">
                우선 확인
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              처리 대기 중인 댓글 신고 단위로 상세 화면으로 이동합니다.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] table-fixed text-left">
            <colgroup>
              <col className="w-[120px]" />
              <col className="w-[145px]" />
              <col className="w-[145px]" />
              <col className="w-[330px]" />
              <col className="w-[130px]" />
              <col className="w-[130px]" />
              <col className="w-[95px]" />
              <col className="w-[95px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-center text-xs font-black text-gray-500">
                <th className="px-4 py-4">접수 번호</th>
                <th className="px-4 py-4">접수 일자</th>
                <th className="px-4 py-4">신고 사유</th>
                <th className="px-4 py-4">댓글 내용</th>
                <th className="px-4 py-4">신고자</th>
                <th className="px-4 py-4">작성자</th>
                <th className="px-4 py-4">상태</th>
                <th className="px-4 py-4">관리</th>
              </tr>
            </thead>

            <tbody>
              {reportsLoading ? (
                <LoadingTableRow
                  colSpan={8}
                  text="처리 대기 댓글 신고를 불러오는 중입니다."
                />
              ) : waitingReportRows.length > 0 ? (
                waitingReportRows.map((row) => {
                  const comment = row.comment || {};
                  const report = row.report || {};
                  const isOpening = openingCommentId === comment.commentId;

                  return (
                    <tr
                      key={report.reportId}
                      className="border-b border-gray-50 text-sm transition hover:bg-red-50/30"
                    >
                      <td className="px-4 py-4 text-center align-middle font-black text-gray-700">
                        {getReportCode(report)}
                      </td>
                      <td className="px-4 py-4 text-center align-middle text-xs font-bold leading-5 text-gray-500">
                        {report.createdAt || '-'}
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <span className="inline-flex max-w-full items-center justify-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-500">
                          <span className="truncate">{report.reason || '-'}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <button
                          type="button"
                          disabled={isOpening}
                          onClick={() =>
                            handleOpenDetail(
                              comment.commentId,
                              report.reportId
                            )
                          }
                          className="block w-full text-left disabled:cursor-wait"
                        >
                          <p className="line-clamp-1 break-keep text-sm font-black text-gray-800">
                            {comment.content || '-'}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold text-gray-400">
                            {getCommentCode(comment)} · {getPostCode(comment)} ·{' '}
                            {comment.postTitle || '-'}
                          </p>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center align-middle font-bold text-gray-600">
                        {report.reporterMemberId || '-'}
                      </td>
                      <td className="px-4 py-4 text-center align-middle font-bold text-gray-600">
                        {comment.memberId || '-'}
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <StatusBadge
                          className={
                            REPORT_RESULT_CLASSES[report.status] ||
                            'bg-gray-100 text-gray-500'
                          }
                        >
                          {REPORT_RESULT_LABELS[report.status] ||
                            report.status ||
                            '-'}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <button
                          type="button"
                          disabled={isOpening}
                          onClick={() =>
                            handleOpenDetail(
                              comment.commentId,
                              report.reportId
                            )
                          }
                          className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-black text-[#6d3df2] transition hover:border-[#6d3df2]/30 hover:bg-purple-50 disabled:cursor-wait disabled:text-gray-300"
                        >
                          {isOpening ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Eye size={14} />
                          )}
                          확인
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <CheckCircle2
                      size={28}
                      className="mx-auto text-emerald-500"
                    />
                    <p className="mt-3 text-sm font-black text-gray-700">
                      처리 대기 중인 댓글 신고가 없습니다.
                    </p>
                    <p className="mt-1 text-xs font-bold text-gray-400">
                      신규 신고가 접수되면 이 영역에 표시됩니다.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <Pagination
            page={reportPage}
            totalPages={reportTotalPages}
            onChange={handleReportPageChange}
            disabled={reportsLoading}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">전체 댓글 조회</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              게시글 카테고리와 댓글 유형을 선택한 뒤 댓글 내용, 작성자, ID를 검색합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-600 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
          >
            <RotateCcw size={17} />
            초기화
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[0.9fr_0.9fr_0.9fr_2.1fr]">
          <FilterSelect
            label="게시글 카테고리"
            value={category}
            onChange={handleChangeCategory}
            options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />

          <FilterSelect
            label="댓글 유형"
            value={commentType}
            onChange={handleChangeCommentType}
            options={[
              { value: 'all', label: '전체' },
              { value: 'COMMENT', label: '댓글' },
              { value: 'REPLY', label: '대댓글' },
            ]}
          />

          <FilterSelect
            label="검색 기준"
            value={searchType}
            onChange={handleChangeSearchType}
            options={SEARCH_TYPE_OPTIONS}
          />

          <div>
            <label className="mb-2 block text-xs font-black text-gray-500">
              검색어
            </label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  value={keywordInput}
                  onChange={(event) => setKeywordInput(event.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={getSearchPlaceholder(searchType)}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                disabled={commentsLoading}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#6d3df2] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#5b2ed8] disabled:cursor-wait disabled:bg-purple-300"
              >
                {commentsLoading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Search size={17} />
                )}
                검색
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-gray-900">댓글 목록</h2>
              <span className="inline-flex h-7 items-center rounded-full bg-purple-50 px-3 text-xs font-black text-[#6d3df2]">
                {formatNumber(commentTotalCount)}개
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              검색 조건에 맞는 댓글과 대댓글을 페이지 단위로 확인합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteSelectedComments}
            disabled={selectedCommentIds.length === 0 || actionLoading}
            className={`inline-flex h-10 w-fit items-center gap-2 rounded-xl px-4 text-sm font-black transition ${
              selectedCommentIds.length === 0 || actionLoading
                ? 'cursor-not-allowed border border-gray-100 bg-gray-50 text-gray-300'
                : 'border border-red-100 bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            {actionLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Trash2 size={16} />
            )}
            선택 삭제
            {selectedCommentIds.length > 0 && ` ${selectedCommentIds.length}`}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] table-fixed text-left">
            <colgroup>
              <col className="w-[52px]" />
              <col className="w-[120px]" />
              <col className="w-[345px]" />
              <col className="w-[265px]" />
              <col className="w-[95px]" />
              <col className="w-[125px]" />
              <col className="w-[145px]" />
              <col className="w-[75px]" />
              <col className="w-[85px]" />
              <col className="w-[118px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-black text-gray-500">
                <th className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleToggleAll}
                    disabled={commentsLoading || comments.length === 0}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-4 text-center">댓글 ID</th>
                <th className="px-4 py-4">댓글 내용</th>
                <th className="px-4 py-4">게시글 제목</th>
                <th className="px-4 py-4 text-center">유형</th>
                <th className="px-4 py-4 text-center">작성자</th>
                <th className="px-4 py-4 text-center">작성일</th>
                <th className="px-4 py-4 text-right">추천</th>
                <th className="px-4 py-4 text-right">신고</th>
                <th className="px-4 py-4 text-center">관리</th>
              </tr>
            </thead>

            <tbody>
              {commentsLoading ? (
                <LoadingTableRow
                  colSpan={10}
                  text="댓글 목록을 불러오는 중입니다."
                />
              ) : comments.length > 0 ? (
                comments.map((comment) => {
                  const currentType = getCommentType(comment);
                  const reportCount = getReportCount(comment);
                  const pendingCount = getPendingReportCount(comment);
                  const isChecked = selectedCommentIds.includes(
                    comment.commentId
                  );
                  const isOpening = openingCommentId === comment.commentId;

                  return (
                    <tr
                      key={comment.commentId}
                      onClick={() => handleOpenDetail(comment.commentId)}
                      className="cursor-pointer border-b border-gray-50 text-sm transition hover:bg-purple-50/40"
                    >
                      <td className="px-4 py-4 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() =>
                            handleToggleComment(comment.commentId)
                          }
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>

                      <td className="px-4 py-4 text-center align-middle text-xs font-black text-gray-500">
                        {getCommentCode(comment)}
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className={comment.parentCommentId ? 'pl-4' : ''}>
                          {comment.parentCommentId && (
                            <span className="mb-1 flex items-center gap-1 text-xs font-black text-gray-300">
                              <CornerDownRight size={13} /> 대댓글
                            </span>
                          )}
                          <p className="line-clamp-2 break-keep text-sm font-black leading-5 text-gray-800">
                            {comment.content}
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <p className="line-clamp-1 break-keep text-sm font-bold text-gray-700">
                          {comment.postTitle || '-'}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-gray-400">
                          {getPostCode(comment)} ·{' '}
                          {CATEGORY_LABELS[
                            normalizeCategory(comment.postCategory)
                          ] ||
                            comment.postCategory ||
                            '-'}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <StatusBadge
                          className={
                            commentTypeClass[currentType] ||
                            'bg-gray-100 text-gray-500'
                          }
                        >
                          {getCommentTypeLabel(comment)}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="truncate font-black text-gray-700">
                          {comment.memberId || '-'}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="text-xs font-bold leading-5 text-gray-600">
                          {comment.createdAt || '-'}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-right align-middle font-bold text-gray-600">
                        {formatNumber(comment.likeCount)}
                      </td>

                      <td className="px-4 py-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <span
                            className={
                              reportCount > 0
                                ? 'font-black text-red-500'
                                : 'font-bold text-gray-300'
                            }
                          >
                            {formatNumber(reportCount)}
                          </span>
                          {pendingCount > 0 && (
                            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-50 px-1.5 text-[10px] font-black text-red-500">
                              {pendingCount}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title="댓글 보기"
                            disabled={isOpening}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenDetail(comment.commentId);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6d3df2] transition hover:bg-purple-50 disabled:cursor-wait disabled:text-gray-300"
                          >
                            {isOpening ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>

                          <button
                            type="button"
                            title="완전 삭제"
                            disabled={actionLoading}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleDeleteComment(comment.commentId);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-300"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                      <MessageCircle size={24} />
                    </div>
                    <p className="mt-4 text-sm font-black text-gray-700">
                      조회된 댓글이 없습니다.
                    </p>
                    <p className="mt-1 text-sm font-semibold text-gray-400">
                      검색어나 필터 조건을 다시 확인해주세요.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4">
          <Pagination
            page={commentPage}
            totalPages={commentTotalPages}
            onChange={handleCommentPageChange}
            disabled={commentsLoading}
          />
        </div>
      </section>
    </div>
  );
};

const Pagination = ({ page, totalPages, onChange, disabled = false }) => {
  const visiblePages = useMemo(() => {
    const pageCount = Math.max(Number(totalPages || 1), 1);
    const currentPage = Math.min(Math.max(Number(page || 1), 1), pageCount);
    const maxVisible = 5;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisible / 2)
    );
    let endPage = Math.min(
      pageCount,
      startPage + maxVisible - 1
    );

    startPage = Math.max(1, endPage - maxVisible + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }, [page, totalPages]);

  const safeTotalPages = Math.max(Number(totalPages || 1), 1);
  const safePage = Math.min(
    Math.max(Number(page || 1), 1),
    safeTotalPages
  );

  const handlePrev = () => {
    if (disabled || safePage <= 1) return;
    onChange(safePage - 1);
  };

  const handleNext = () => {
    if (disabled || safePage >= safeTotalPages) return;
    onChange(safePage + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={disabled || safePage <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          disabled || safePage <= 1
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
            : 'border-gray-200 bg-white text-gray-500 hover:border-[#6d3df2]/30 hover:text-[#6d3df2]'
        }`}
      >
        <ChevronLeft size={17} />
      </button>

      {visiblePages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          disabled={disabled}
          onClick={() => onChange(pageNumber)}
          className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-black transition ${
            pageNumber === safePage
              ? 'bg-[#6d3df2] text-white shadow-sm'
              : disabled
                ? 'cursor-not-allowed border border-gray-100 bg-gray-50 text-gray-300'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-[#6d3df2]/30 hover:text-[#6d3df2]'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={handleNext}
        disabled={disabled || safePage >= safeTotalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          disabled || safePage >= safeTotalPages
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
            : 'border-gray-200 bg-white text-gray-500 hover:border-[#6d3df2]/30 hover:text-[#6d3df2]'
        }`}
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
};

const SummaryCard = ({
  icon: Icon,
  title,
  value,
  unit,
  description,
  iconClass,
  loading = false,
}) => {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
      >
        {loading ? <Loader2 size={24} className="animate-spin" /> : <Icon size={24} />}
      </div>
      <div className="mt-5">
        <p className="text-sm font-black text-gray-500">{title}</p>
        <div className="mt-2 flex items-end gap-1">
          <strong className="text-2xl font-black tracking-tight text-gray-950">
            {loading ? '-' : formatNumber(value)}
          </strong>
          <span className="pb-0.5 text-sm font-black text-gray-700">{unit}</span>
        </div>
        <p className="mt-2 truncate text-xs font-bold text-gray-400">
          {description}
        </p>
      </div>
    </article>
  );
};

const FilterSelect = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-gray-500">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-[#6d3df2]/40 focus:ring-4 focus:ring-purple-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={17}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
    </div>
  );
};

const StatusBadge = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
};

const LoadingTableRow = ({ colSpan, text }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center">
        <Loader2 size={26} className="mx-auto animate-spin text-[#6d3df2]" />
        <p className="mt-3 text-sm font-black text-gray-500">{text}</p>
      </td>
    </tr>
  );
};

export default CommentManagementPage;
