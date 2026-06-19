import { useMemo, useState } from 'react';
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
} from 'lucide-react';

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

const commentTypeClass = {
  COMMENT: 'bg-purple-50 text-purple-600',
  REPLY: 'bg-blue-50 text-blue-600',
};

const dummyComments = [
  {
    commentId: 1,
    postId: 11,
    postTitle: '첫번째 게시글',
    postCategory: 'review',
    memberId: 'festival_love',
    parentCommentId: null,
    content: '첫 번째 댓글 예시입니다.',
    createdAt: '2026.06.17 14:32',
    updatedAt: '2026.06.17 14:32',
    likeCount: 12,
    reportItems: [
      {
        reportId: 301,
        reporterMemberId: 'user_1201',
        reason: '욕설',
        createdAt: '2026.06.17 15:02',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
      {
        reportId: 302,
        reporterMemberId: 'user_7744',
        reason: '도배',
        createdAt: '2026.06.17 15:15',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
    ],
  },
  {
    commentId: 2,
    postId: 11,
    postTitle: '두번째 게시글',
    postCategory: 'review',
    memberId: 'sunny_day',
    parentCommentId: 1,
    content: '대댓글 예시입니다.',
    createdAt: '2026.06.17 14:45',
    updatedAt: '2026.06.17 14:45',
    likeCount: 4,
    reportItems: [
      {
        reportId: 303,
        reporterMemberId: 'user_4031',
        reason: '불쾌한 표현',
        createdAt: '2026.06.17 15:20',
        status: 'REJECTED',
        adminMemo: '무효 처리',
        processedAt: '2026.06.17 16:02',
      },
    ],
  },
  {
    commentId: 3,
    postId: 12,
    postTitle: '세번째 게시글',
    postCategory: 'free',
    memberId: 'angry_user',
    parentCommentId: null,
    content: '자유글 댓글 예시입니다.',
    createdAt: '2026.06.17 13:12',
    updatedAt: '2026.06.17 13:12',
    likeCount: 2,
    reportItems: [
      {
        reportId: 304,
        reporterMemberId: 'user_8812',
        reason: '욕설',
        createdAt: '2026.06.17 13:20',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
    ],
  },
];
const formatNumber = (value) => Number(value || 0).toLocaleString();

const getTodayKey = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const date = String(today.getDate()).padStart(2, '0');

  return `${year}.${month}.${date}`;
};

const getNowText = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const date = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  return `${year}.${month}.${date} ${hour}:${minute}`;
};

const getCommentCode = (comment) => `CMT-${String(comment.commentId).padStart(5, '0')}`;

const getPostCode = (comment) => `POST-${String(comment.postId).padStart(3, '0')}`;

const normalizeCategory = (category) => String(category || '').toLowerCase();

const getCommentType = (comment) => (comment.parentCommentId ? 'REPLY' : 'COMMENT');

const getCommentTypeLabel = (comment) => (comment.parentCommentId ? '대댓글' : '댓글');

const getReportCount = (comment) => Number(comment.reportItems?.length || 0);

const getPendingReportCount = (comment) =>
  Number(comment.reportItems?.filter((report) => report.status === 'WAITING').length || 0);

const getSearchPlaceholder = (searchType) => {
  if (searchType === 'author') return '작성자 ID를 입력해 주세요.';
  if (searchType === 'id') return '댓글 ID를 입력해 주세요.';
  if (searchType === 'postTitle') return '게시글 제목을 입력해 주세요.';
  if (searchType === 'postId') return '게시글 ID를 입력해 주세요.';
  return '내용을 입력해 주세요.';
};

const CommentManagementPage = () => {
  const [comments, setComments] = useState(dummyComments);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('content');
  const [category, setCategory] = useState('all');
  const [commentType, setCommentType] = useState('all');
  const [selectedCommentIds, setSelectedCommentIds] = useState([]);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [reportPage, setReportPage] = useState(1);
  const [commentPage, setCommentPage] = useState(1);

  const selectedComment = useMemo(() => {
    if (!selectedCommentId) return null;
    return comments.find((comment) => comment.commentId === selectedCommentId) || null;
  }, [comments, selectedCommentId]);

  const filteredComments = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    return comments.filter((comment) => {
      const currentCategory = normalizeCategory(comment.postCategory);
      const currentType = getCommentType(comment);
      const keywordTarget = {
        content: comment.content,
        author: comment.memberId,
        id: getCommentCode(comment),
        postTitle: comment.postTitle,
        postId: getPostCode(comment),
      }[searchType];

      const keywordMatch =
        !lowerKeyword || String(keywordTarget || '').toLowerCase().includes(lowerKeyword);
      const categoryMatch = category === 'all' || currentCategory === category;
      const typeMatch = commentType === 'all' || currentType === commentType;

      return keywordMatch && categoryMatch && typeMatch;
    });
  }, [comments, keyword, searchType, category, commentType]);

  const waitingReportRows = useMemo(() => {
    return comments
      .flatMap((comment) =>
        (comment.reportItems || [])
          .filter((report) => report.status === 'WAITING')
          .map((report) => ({ comment, report }))
      )
      .sort((a, b) => Number(b.report.reportId || 0) - Number(a.report.reportId || 0));
  }, [comments]);

  const reportTotalPages = Math.max(1, Math.ceil(waitingReportRows.length / REPORT_PAGE_SIZE));
  const safeReportPage = Math.min(reportPage, reportTotalPages);

  const pagedWaitingReportRows = useMemo(() => {
    const startIndex = (safeReportPage - 1) * REPORT_PAGE_SIZE;
    return waitingReportRows.slice(startIndex, startIndex + REPORT_PAGE_SIZE);
  }, [waitingReportRows, safeReportPage]);

  const commentTotalPages = Math.max(1, Math.ceil(filteredComments.length / COMMENT_PAGE_SIZE));
  const safeCommentPage = Math.min(commentPage, commentTotalPages);

  const pagedComments = useMemo(() => {
    const startIndex = (safeCommentPage - 1) * COMMENT_PAGE_SIZE;
    return filteredComments.slice(startIndex, startIndex + COMMENT_PAGE_SIZE);
  }, [filteredComments, safeCommentPage]);

  const stats = useMemo(() => {
    const todayKey = getTodayKey();
    const reportedCommentCount = comments.filter((comment) => getReportCount(comment) > 0).length;
    const pendingReportCount = comments.reduce(
      (total, comment) => total + getPendingReportCount(comment),
      0
    );
    const replyCount = comments.filter((comment) => comment.parentCommentId).length;

    return {
      total: comments.length,
      today: comments.filter((comment) => comment.createdAt.startsWith(todayKey)).length,
      reportedCommentCount,
      pendingReportCount,
      replyCount,
    };
  }, [comments]);

  const isAllChecked =
    pagedComments.length > 0 &&
    pagedComments.every((comment) => selectedCommentIds.includes(comment.commentId));

  const handleSearch = () => {
    setKeyword(keywordInput.trim());
    setSelectedCommentIds([]);
    setCommentPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleReset = () => {
    setKeywordInput('');
    setKeyword('');
    setSearchType('content');
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
    setCommentPage(1);
  };

  const handleOpenDetail = (commentId) => {
    setSelectedCommentId(commentId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedCommentId(null);
  };

  const handleToggleAll = () => {
    const currentPageIds = pagedComments.map((comment) => comment.commentId);

    if (isAllChecked) {
      setSelectedCommentIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      return;
    }

    setSelectedCommentIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  const handleToggleComment = (commentId) => {
    setSelectedCommentIds((prev) => {
      if (prev.includes(commentId)) return prev.filter((id) => id !== commentId);
      return [...prev, commentId];
    });
  };

  const handleDeleteComment = (commentId) => {
    const target = comments.find((comment) => comment.commentId === commentId);
    if (!target) return;

    const isConfirmed = window.confirm(
      `댓글과 연결된 신고 기록을 함께 삭제합니다.\n\n댓글 ID: ${getCommentCode(target)}\n내용: ${target.content}\n\n정말 완전 삭제할까요?`
    );

    if (!isConfirmed) return;

    setComments((prev) => prev.filter((comment) => comment.commentId !== commentId));
    setSelectedCommentIds((prev) => prev.filter((id) => id !== commentId));

    if (selectedCommentId === commentId) setSelectedCommentId(null);
  };

  const handleDeleteSelectedComments = () => {
    if (selectedCommentIds.length === 0) return;

    const isConfirmed = window.confirm(
      `선택한 댓글 ${selectedCommentIds.length}건을 완전 삭제할까요?\n\nPOST_COMMENT와 COMMENT_REPORT 연결 데이터가 함께 정리되어야 합니다.`
    );

    if (!isConfirmed) return;

    setComments((prev) => prev.filter((comment) => !selectedCommentIds.includes(comment.commentId)));
    setSelectedCommentIds([]);
  };

  const handleProcessReport = ({ commentId, reportId, resultStatus, adminMemo }) => {
    const targetComment = comments.find((comment) => comment.commentId === commentId);
    const targetReport = targetComment?.reportItems?.find((report) => report.reportId === reportId);

    if (!targetComment || !targetReport) {
      window.alert('처리할 신고 내역을 찾을 수 없습니다.');
      return;
    }

    if (targetReport.status !== 'WAITING') {
      window.alert('이미 처리된 신고 내역입니다.');
      return;
    }

    const resultLabel = REPORT_RESULT_LABELS[resultStatus] || resultStatus;
    const isConfirmed = window.confirm(
      `신고 ${`RPT-${String(reportId).padStart(5, '0')}`}건을 '${resultLabel}' 처리할까요?\n\n댓글 자체 상태가 아니라 COMMENT_REPORT.STATUS와 MEMBER_REPORT_HISTORY 처리 이력이 변경됩니다.`
    );

    if (!isConfirmed) return;

    const processedAt = getNowText();

    setComments((prev) =>
      prev.map((comment) => {
        if (comment.commentId !== commentId) return comment;

        return {
          ...comment,
          reportItems: (comment.reportItems || []).map((report) => {
            if (report.reportId !== reportId) return report;

            return {
              ...report,
              status: resultStatus,
              adminMemo,
              processedAt,
            };
          }),
        };
      })
    );
  };

  if (selectedComment) {
    return (
      <CommentDetailView
        key={selectedComment.commentId}
        comment={selectedComment}
        onBack={handleBackToList}
        onDelete={handleDeleteComment}
        onProcessReport={handleProcessReport}
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={MessageCircle}
          title="총 댓글"
          value={stats.total}
          unit="개"
          description="게시글 댓글 수"
          iconClass="bg-purple-50 text-[#6d3df2]"
        />
        <SummaryCard
          icon={CalendarDays}
          title="오늘 등록"
          value={stats.today}
          unit="개"
          description="오늘 기준 신규 댓글"
          iconClass="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          icon={ShieldAlert}
          title="신고 댓글"
          value={stats.reportedCommentCount}
          unit="개"
          description="신고된 댓글 수"
          iconClass="bg-red-50 text-red-500"
        />
        <SummaryCard
          icon={ClipboardCheck}
          title="처리 대기"
          value={stats.pendingReportCount}
          unit="개"
          description="상태가 WAITING인 항목"
          iconClass="bg-yellow-50 text-yellow-600"
        />
      </section>
      <section className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-red-50 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-gray-900">신고 접수 댓글</h2>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50 px-3 text-xs font-black text-red-500">
                {formatNumber(waitingReportRows.length)}건
              </span>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50/70 px-3 text-xs font-black text-red-500">
                우선 확인
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              접수된 COMMENT_REPORT 단위로 댓글 원문 확인과 처리 화면으로 이동합니다.
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
              {pagedWaitingReportRows.length > 0 ? (
                pagedWaitingReportRows.map(({ comment, report }) => (
                  <tr
                    key={report.reportId}
                    className="border-b border-gray-50 text-sm transition hover:bg-red-50/30"
                  >
                    <td className="px-4 py-4 text-center align-middle font-black text-gray-700">
                      RPT-{String(report.reportId).padStart(5, '0')}
                    </td>
                    <td className="px-4 py-4 text-center align-middle text-xs font-bold leading-5 text-gray-500">
                      {report.createdAt}
                    </td>
                    <td className="px-4 py-4 text-center align-middle">
                      <span className="inline-flex max-w-full items-center justify-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-black text-red-500">
                        <span className="truncate">{report.reason}</span>
                      </span>
                    </td>
                    <td className="px-4 py-4 align-middle">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(comment.commentId)}
                        className="block w-full text-left"
                      >
                        <p className="line-clamp-1 break-keep text-sm font-black text-gray-800">
                          {comment.content}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-gray-400">
                          {getCommentCode(comment)} · {getPostCode(comment)} · {comment.postTitle}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center align-middle font-bold text-gray-600">
                      {report.reporterMemberId}
                    </td>
                    <td className="px-4 py-4 text-center align-middle font-bold text-gray-600">
                      {comment.memberId}
                    </td>
                    <td className="px-4 py-4 text-center align-middle">
                      <StatusBadge className={REPORT_RESULT_CLASSES[report.status]}>
                        {REPORT_RESULT_LABELS[report.status] || report.status}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(comment.commentId)}
                        className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-xs font-black text-[#6d3df2] transition hover:border-[#6d3df2]/30 hover:bg-purple-50"
                      >
                        <Eye size={14} />
                        확인
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center">
                    <CheckCircle2 size={28} className="mx-auto text-emerald-500" />
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
          <Pagination page={safeReportPage} totalPages={reportTotalPages} onChange={setReportPage} />
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">전체 댓글 조회</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              게시글 카테고리와 댓글 유형을 먼저 좁힌 뒤 댓글 내용, 작성자, 댓글 ID 기준으로 검색합니다.
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
            options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({ value, label }))}
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
            <label className="mb-2 block text-xs font-black text-gray-500">검색어</label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={getSearchPlaceholder(searchType)}
                  className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50"
                />
              </div>

              <button
                type="button"
                onClick={handleSearch}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#6d3df2] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#5b2ed8]"
              >
                <Search size={17} />
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
                {formatNumber(filteredComments.length)}개
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              검색 조건에 맞는 댓글과 대댓글을 페이지 단위로 확인합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteSelectedComments}
            disabled={selectedCommentIds.length === 0}
            className={`inline-flex h-10 w-fit items-center gap-2 rounded-xl px-4 text-sm font-black transition ${
              selectedCommentIds.length === 0
                ? 'cursor-not-allowed border border-gray-100 bg-gray-50 text-gray-300'
                : 'border border-red-100 bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            <Trash2 size={16} />
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
              {pagedComments.length > 0 ? (
                pagedComments.map((comment) => {
                  const currentType = getCommentType(comment);
                  const reportCount = getReportCount(comment);
                  const pendingCount = getPendingReportCount(comment);
                  const isChecked = selectedCommentIds.includes(comment.commentId);

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
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleToggleComment(comment.commentId)}
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
                          {comment.postTitle}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-gray-400">
                          {getPostCode(comment)} · {CATEGORY_LABELS[normalizeCategory(comment.postCategory)] || comment.postCategory}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <StatusBadge className={commentTypeClass[currentType]}>
                          {getCommentTypeLabel(comment)}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="truncate font-black text-gray-700">{comment.memberId}</p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="text-xs font-bold leading-5 text-gray-600">{comment.createdAt}</p>
                      </td>

                      <td className="px-4 py-4 text-right align-middle font-bold text-gray-600">
                        {formatNumber(comment.likeCount)}
                      </td>

                      <td className="px-4 py-4 text-right align-middle">
                        <div className="flex items-center justify-end gap-1.5">
                          <span className={reportCount > 0 ? 'font-black text-red-500' : 'font-bold text-gray-300'}>
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
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(comment.commentId);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6d3df2] transition hover:bg-purple-50"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            title="완전 삭제"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteComment(comment.commentId);
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
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
          <Pagination page={safeCommentPage} totalPages={commentTotalPages} onChange={setCommentPage} />
        </div>
      </section>
    </div>
  );
};


const Pagination = ({ page, totalPages, onChange }) => {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const handlePrev = () => {
    if (page <= 1) return;
    onChange(page - 1);
  };

  const handleNext = () => {
    if (page >= totalPages) return;
    onChange(page + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={page <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          page <= 1
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
            : 'border-gray-200 bg-white text-gray-500 hover:border-[#6d3df2]/30 hover:text-[#6d3df2]'
        }`}
      >
        <ChevronLeft size={17} />
      </button>

      {pages.map((pageNumber) => (
        <button
          key={pageNumber}
          type="button"
          onClick={() => onChange(pageNumber)}
          className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-black transition ${
            pageNumber === page
              ? 'bg-[#6d3df2] text-white shadow-sm'
              : 'border border-gray-200 bg-white text-gray-500 hover:border-[#6d3df2]/30 hover:text-[#6d3df2]'
          }`}
        >
          {pageNumber}
        </button>
      ))}

      <button
        type="button"
        onClick={handleNext}
        disabled={page >= totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          page >= totalPages
            ? 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
            : 'border-gray-200 bg-white text-gray-500 hover:border-[#6d3df2]/30 hover:text-[#6d3df2]'
        }`}
      >
        <ChevronRight size={17} />
      </button>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, title, value, unit, description, iconClass }) => {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
        <Icon size={24} />
      </div>
      <div className="mt-5">
        <p className="text-sm font-black text-gray-500">{title}</p>
        <div className="mt-2 flex items-end gap-1">
          <strong className="text-2xl font-black tracking-tight text-gray-950">
            {formatNumber(value)}
          </strong>
          <span className="pb-0.5 text-sm font-black text-gray-700">{unit}</span>
        </div>
        <p className="mt-2 truncate text-xs font-bold text-gray-400">{description}</p>
      </div>
    </article>
  );
};

const FilterSelect = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="mb-2 block text-xs font-black text-gray-500">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 pr-10 text-sm font-bold text-gray-700 outline-none transition focus:border-[#6d3df2]/40 focus:ring-4 focus:ring-purple-50"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown size={17} className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  );
};

const StatusBadge = ({ children, className }) => {
  return (
    <span className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ${className}`}>
      <span className="truncate">{children}</span>
    </span>
  );
};

export default CommentManagementPage;

