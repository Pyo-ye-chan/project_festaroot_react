import { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  ArrowLeft,
  UserRound,
  Clock,
  ThumbsUp,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  CornerDownRight,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  MessageCircle,
  Eye,
  Paperclip,
  Loader2,
} from 'lucide-react';

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '후기',
  tip: '꿀팁',
  notice: '공지',
};

const REPORT_RESULT_LABELS = {
  WAITING: '접수',
  ACCEPTED: '인정',
  REJECTED: '반려',
};

const REPORT_RESULT_CLASS = {
  WAITING: 'bg-red-50 text-red-500 ring-red-100',
  ACCEPTED: 'bg-purple-50 text-[#6d3df2] ring-purple-100',
  REJECTED: 'bg-gray-100 text-gray-500 ring-gray-200',
};

const categoryClass = {
  free: 'bg-slate-100 text-slate-600 ring-slate-200',
  review: 'bg-purple-50 text-purple-600 ring-purple-100',
  tip: 'bg-amber-50 text-amber-600 ring-amber-100',
  notice: 'bg-blue-50 text-blue-600 ring-blue-100',
};

const commentTypeClass = {
  COMMENT: 'bg-purple-50 text-purple-600 ring-purple-100',
  REPLY: 'bg-blue-50 text-blue-600 ring-blue-100',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const formatMetric = (value, suffix = '') => {
  if (value === null || value === undefined || value === '') return '-';
  return `${formatNumber(value)}${suffix}`;
};

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

const normalizeCategory = (category) => String(category || '').toLowerCase();

const getCommentType = (comment) => {
  if (comment?.commentType) return comment.commentType;
  return comment?.parentCommentId ? 'REPLY' : 'COMMENT';
};

const getCommentTypeLabel = (comment) =>
  getCommentType(comment) === 'REPLY' ? '대댓글' : '댓글';

const getReportCount = (comment) =>
  Number(comment?.reportCount ?? comment?.reportItems?.length ?? 0);

const getPendingReportCount = (comment) =>
  Number(
    comment?.pendingReportCount ??
      comment?.reportItems?.filter((report) => report.status === 'WAITING')
        .length ??
      0
  );

const resolveSelectedReportId = (reports, initialReportId) => {
  if (!reports.length) return null;

  if (
    initialReportId !== null &&
    initialReportId !== undefined &&
    reports.some((report) => report.reportId === initialReportId)
  ) {
    return initialReportId;
  }

  return (
    reports.find((report) => report.status === 'WAITING')?.reportId ||
    reports[0]?.reportId ||
    null
  );
};

const CommentDetailView = ({
  comment,
  post = null,
  initialReportId = null,
  onBack,
  onDelete,
  onProcessReport,
  actionLoading = false,
}) => {
  const reports = useMemo(
    () => (Array.isArray(comment?.reportItems) ? comment.reportItems : []),
    [comment?.reportItems]
  );

  const sourcePost = useMemo(() => {
    if (post) return post;

    return {
      postId: comment?.postId,
      postCode: comment?.postCode,
      title: comment?.postTitle,
      category: comment?.postCategory,
      content: comment?.postContent,
      author: comment?.postAuthor,
      createdAt: comment?.postCreatedAt,
      views: comment?.postViews,
      comments: comment?.postCommentCount,
      attachments: comment?.postAttachments,
    };
  }, [post, comment]);

  const [selectedReportId, setSelectedReportId] = useState(() =>
    resolveSelectedReportId(reports, initialReportId)
  );

  const selectedReport = useMemo(() => {
    if (!reports.length || selectedReportId === null) return null;

    return (
      reports.find((report) => report.reportId === selectedReportId) || null
    );
  }, [reports, selectedReportId]);

  const [adminMemo, setAdminMemo] = useState(
    selectedReport?.adminMemo || ''
  );

  useEffect(() => {
    setSelectedReportId(resolveSelectedReportId(reports, initialReportId));
  }, [comment?.commentId, initialReportId, reports]);

  useEffect(() => {
    setAdminMemo(selectedReport?.adminMemo || '');
  }, [selectedReport?.reportId, selectedReport?.adminMemo]);

  if (!comment) {
    return (
      <section className="rounded-[28px] border border-gray-200 bg-white p-10 text-center shadow-sm">
        <MessageCircle size={32} className="mx-auto text-gray-300" />
        <p className="mt-3 text-sm font-black text-gray-700">
          댓글 정보를 찾을 수 없습니다.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-600 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
        >
          <ArrowLeft size={17} />
          댓글 목록으로
        </button>
      </section>
    );
  }

  const reportCount = getReportCount(comment);
  const pendingReportCount = getPendingReportCount(comment);
  const commentCategory = normalizeCategory(
    sourcePost?.category || comment.postCategory
  );
  const commentType = getCommentType(comment);
  const sourceAttachments = Array.isArray(sourcePost?.attachments)
    ? sourcePost.attachments
    : [];
  const sourcePostContent = sourcePost?.content || comment.postContent || '';
  const canProcess = selectedReport?.status === 'WAITING' && !actionLoading;

  const handleSelectReport = (report) => {
    setSelectedReportId(report.reportId);
    setAdminMemo(report.adminMemo || '');
  };

  const handleProcess = (resultStatus) => {
    if (!selectedReport) {
      window.alert('처리할 신고 내역을 선택해주세요.');
      return;
    }

    onProcessReport({
      commentId: comment.commentId,
      reportId: selectedReport.reportId,
      resultStatus,
      adminMemo: adminMemo.trim(),
    });
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
      {/* 상단 헤더 */}
      <header className="border-b border-gray-100 bg-white px-6 py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
              댓글 상세보기
            </h1>

            <p className="mt-2 text-sm font-semibold text-gray-400">
              댓글 원문과 신고 내역을 확인하고, 선택한 신고 건을 인정 또는 반려 처리합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              className={
                commentTypeClass[commentType] ||
                'bg-gray-100 text-gray-500 ring-gray-200'
              }
            >
              {getCommentTypeLabel(comment)}
            </StatusBadge>

            <StatusBadge
              className={
                categoryClass[commentCategory] ||
                'bg-gray-100 text-gray-500 ring-gray-200'
              }
            >
              {CATEGORY_LABELS[commentCategory] ||
                comment.postCategory ||
                '미분류'}
            </StatusBadge>

            <span className="inline-flex h-8 items-center rounded-full bg-gray-50 px-3 text-xs font-black text-gray-500 ring-1 ring-gray-100">
              {getCommentCode(comment)}
            </span>
          </div>
        </div>
      </header>

      {/* 본문 */}
      <div className="space-y-6 bg-gray-50/30 px-6 py-6">
        {/* 원 게시글 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="border-b border-gray-100 pb-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    className={
                      categoryClass[commentCategory] ||
                      'bg-gray-100 text-gray-500 ring-gray-200'
                    }
                  >
                    {CATEGORY_LABELS[commentCategory] ||
                      sourcePost?.category ||
                      comment.postCategory ||
                      '미분류'}
                  </StatusBadge>

                  <span className="inline-flex h-7 items-center rounded-full bg-gray-50 px-3 text-xs font-black text-gray-500 ring-1 ring-gray-100">
                    {getPostCode(sourcePost || comment)}
                  </span>
                </div>

                <p className="mt-4 text-xs font-black text-gray-400">
                  원 게시글 제목
                </p>

                <h2 className="mt-2 break-keep text-2xl font-black leading-9 text-gray-950">
                  {sourcePost?.title ||
                    comment.postTitle ||
                    '원 게시글 정보를 찾을 수 없습니다.'}
                </h2>
              </div>

              {sourceAttachments.length > 0 && (
                <span className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full bg-yellow-50 px-3 text-xs font-black text-yellow-700 ring-1 ring-yellow-100">
                  <Paperclip size={14} />
                  첨부 {formatNumber(sourceAttachments.length)}개
                </span>
              )}
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:grid-cols-2 xl:grid-cols-4">
            <InfoItem
              icon={UserRound}
              label="게시글 작성자"
              value={sourcePost?.author || comment.postAuthor || '-'}
            />
            <InfoItem
              icon={Clock}
              label="게시글 작성일"
              value={sourcePost?.createdAt || comment.postCreatedAt || '-'}
            />
            <InfoItem
              icon={Eye}
              label="조회수"
              value={formatMetric(sourcePost?.views, '회')}
            />
            <InfoItem
              icon={MessageCircle}
              label="댓글"
              value={formatMetric(sourcePost?.comments, '개')}
            />
          </div>

          <div className="mt-6">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-gray-900">
                  원 게시글 내용
                </h3>
                <p className="mt-1 text-xs font-bold text-gray-400">
                  댓글이 작성된 게시글의 원문입니다.
                </p>
              </div>
            </div>

            <div className="mt-4 min-h-[180px] rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              {sourcePostContent ? (
                <RichTextContent html={sourcePostContent} />
              ) : (
                <div className="flex min-h-[140px] flex-col items-center justify-center text-center">
                  <MessageCircle size={26} className="text-gray-300" />
                  <p className="mt-3 text-sm font-black text-gray-600">
                    원 게시글 본문을 불러오지 못했습니다.
                  </p>
                  <p className="mt-1 text-xs font-bold text-gray-400">
                    게시글 제목과 ID 정보만 표시하고 있습니다.
                  </p>
                </div>
              )}
            </div>

            {sourceAttachments.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-black text-gray-400">첨부 자료</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {sourceAttachments.map((file, index) => (
                    <span
                      key={
                        file.attachId ||
                        file.attach_id ||
                        file.path ||
                        file.file_path ||
                        `${file.name || file.file_name}-${index}`
                      }
                      className="inline-flex h-9 max-w-full items-center gap-2 rounded-xl border border-yellow-100 bg-yellow-50 px-3 text-xs font-black text-yellow-700"
                    >
                      <Paperclip size={14} className="shrink-0" />
                      <span className="max-w-[240px] truncate">
                        {file.name || file.file_name || '첨부파일'}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </article>

        {/* 댓글 기본 정보 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-black text-gray-400">댓글 정보</p>
              <h2 className="mt-2 text-xl font-black text-gray-950">
                {getCommentCode(comment)}
              </h2>
            </div>

            {comment.parentCommentId && (
              <span className="inline-flex h-8 w-fit items-center gap-1 rounded-full bg-blue-50 px-3 text-xs font-black text-blue-600 ring-1 ring-blue-100">
                <CornerDownRight size={13} />
                부모 댓글 CMT-
                {String(comment.parentCommentId).padStart(5, '0')}
              </span>
            )}
          </div>

          <div className="mt-5 grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:grid-cols-2 xl:grid-cols-4">
            <InfoItem
              icon={UserRound}
              label="댓글 작성자"
              value={comment.memberId || '-'}
            />
            <InfoItem
              icon={Clock}
              label="댓글 작성일"
              value={comment.createdAt || '-'}
            />
            <InfoItem
              icon={ThumbsUp}
              label="좋아요"
              value={`${formatNumber(comment.likeCount)}개`}
            />
            <InfoItem
              icon={ShieldAlert}
              label="신고"
              value={`${formatNumber(reportCount)}건`}
              danger={reportCount > 0}
            />
          </div>
        </article>

        {/* 신고 안내 */}
        {reportCount > 0 && (
          <section className="rounded-3xl border border-red-100 bg-red-50/50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
                <AlertTriangle size={22} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-black text-red-600">
                    신고가 접수된 댓글입니다.
                  </h2>

                  <span className="inline-flex h-7 items-center rounded-full bg-white px-3 text-xs font-black text-red-500">
                    처리 대기 {formatNumber(pendingReportCount)}건
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold leading-6 text-red-400">
                  신고 인정/반려는 댓글 자체가 아니라 선택한 신고 내역에 대해 처리됩니다.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* 댓글 내용 + 신고 내역 */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.9fr]">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-gray-900">댓글 내용</h2>
              <p className="mt-1 text-xs font-bold text-gray-400">
                사용자가 작성한 댓글 원문입니다.
              </p>
            </div>

            <div className="mt-5 min-h-[230px] rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              {comment.parentCommentId && (
                <p className="mb-4 flex items-center gap-1 text-xs font-black text-gray-400">
                  <CornerDownRight size={14} />
                  부모 댓글에 작성된 대댓글입니다.
                </p>
              )}

              <p className="whitespace-pre-wrap break-keep text-sm font-semibold leading-7 text-gray-700">
                {comment.content || '작성된 내용이 없습니다.'}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <RelationItem label="댓글 유형" value={getCommentTypeLabel(comment)} />
              <RelationItem label="게시글 ID" value={getPostCode(comment)} />
              <RelationItem
                label="수정일"
                value={comment.updatedAt || comment.createdAt || '-'}
              />
            </div>
          </article>

          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <h2 className="text-lg font-black text-gray-900">신고 내역</h2>
                <p className="mt-1 text-xs font-bold text-gray-400">
                  처리할 신고 내역을 선택하세요.
                </p>
              </div>

              <span className="inline-flex h-8 shrink-0 items-center rounded-full bg-gray-50 px-3 text-xs font-black text-gray-500 ring-1 ring-gray-100">
                {formatNumber(reportCount)}건
              </span>
            </div>

            <div className="mt-5 max-h-[520px] space-y-3 overflow-y-auto pr-1">
              {reports.length > 0 ? (
                reports.map((report) => {
                  const isSelected =
                    selectedReport?.reportId === report.reportId;

                  return (
                    <button
                      type="button"
                      key={report.reportId}
                      onClick={() => handleSelectReport(report)}
                      className={`w-full rounded-2xl border p-4 text-left transition ${
                        isSelected
                          ? 'border-[#6d3df2]/30 bg-purple-50/70 ring-2 ring-purple-100'
                          : 'border-gray-100 bg-gray-50/70 hover:border-purple-100 hover:bg-purple-50/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-black text-gray-400">
                            {getReportCode(report)}
                          </p>

                          <p className="mt-2 line-clamp-1 text-sm font-black text-gray-800">
                            {report.reason || '신고 사유 없음'}
                          </p>

                          <p className="mt-1 text-xs font-bold text-gray-400">
                            신고자 {report.reporterMemberId || '-'}
                          </p>
                        </div>

                        <StatusBadge
                          className={
                            REPORT_RESULT_CLASS[report.status] ||
                            'bg-gray-100 text-gray-500 ring-gray-200'
                          }
                        >
                          {REPORT_RESULT_LABELS[report.status] ||
                            report.status ||
                            '-'}
                        </StatusBadge>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400">
                        <span>접수 {report.createdAt || '-'}</span>
                        <span>·</span>
                        <span>처리 {report.processedAt || '-'}</span>
                      </div>

                      {report.adminMemo && (
                        <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-gray-500">
                          관리자 메모: {report.adminMemo}
                        </p>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-gray-100 bg-gray-50 px-5 py-12 text-center">
                  <CheckCircle2 size={28} className="mx-auto text-emerald-500" />

                  <p className="mt-3 text-sm font-black text-gray-700">
                    접수된 신고가 없습니다.
                  </p>
                </div>
              )}
            </div>
          </article>
        </section>

        {/* 신고 처리 */}
        <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-black text-gray-900">신고 처리</h2>
              <p className="mt-1 text-xs font-bold text-gray-400">
                선택한 신고 내역에 대해 관리자 메모를 남기고 인정 또는 반려 처리합니다.
              </p>
            </div>

            {selectedReport ? (
              <StatusBadge
                className={
                  REPORT_RESULT_CLASS[selectedReport.status] ||
                  'bg-gray-100 text-gray-500 ring-gray-200'
                }
              >
                현재{' '}
                {REPORT_RESULT_LABELS[selectedReport.status] ||
                  selectedReport.status}
              </StatusBadge>
            ) : (
              <span className="inline-flex h-8 items-center rounded-full bg-gray-50 px-3 text-xs font-black text-gray-400 ring-1 ring-gray-100">
                신고 미선택
              </span>
            )}
          </div>

          {selectedReport ? (
            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
                <p className="text-xs font-black text-gray-400">선택한 신고</p>

                <p className="mt-2 text-sm font-black text-gray-900">
                  {getReportCode(selectedReport)}
                </p>

                <p className="mt-4 text-sm font-black text-gray-800">
                  {selectedReport.reason || '신고 사유 없음'}
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
                  신고자 {selectedReport.reporterMemberId || '-'}
                </p>

                <p className="mt-1 text-xs font-bold text-gray-400">
                  접수일자 {selectedReport.createdAt || '-'}
                </p>

                {selectedReport.processedAt && (
                  <p className="mt-1 text-xs font-bold text-gray-400">
                    처리일자 {selectedReport.processedAt}
                  </p>
                )}
              </div>

              <div>
                <label className="text-xs font-black text-gray-500">
                  관리자 메모
                </label>

                <textarea
                  value={adminMemo}
                  onChange={(event) => setAdminMemo(event.target.value)}
                  disabled={!canProcess}
                  placeholder="신고 인정/반려 사유를 입력하세요."
                  className="mt-2 min-h-[150px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50 disabled:cursor-not-allowed disabled:text-gray-400"
                />

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => handleProcess('REJECTED')}
                    disabled={!canProcess}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black transition ${
                      !canProcess
                        ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {actionLoading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <XCircle size={16} />
                    )}
                    신고 반려
                  </button>

                  <button
                    type="button"
                    onClick={() => handleProcess('ACCEPTED')}
                    disabled={!canProcess}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black transition ${
                      !canProcess
                        ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                        : 'bg-[#6d3df2] text-white shadow-sm hover:bg-[#5b2ed8]'
                    }`}
                  >
                    {actionLoading ? (
                      <Loader2 size={17} className="animate-spin" />
                    ) : (
                      <ShieldCheck size={17} />
                    )}
                    신고 인정
                  </button>
                </div>

                {selectedReport.status !== 'WAITING' && (
                  <p className="mt-3 text-right text-xs font-bold text-gray-400">
                    이미 처리된 신고 내역입니다.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-gray-100 bg-gray-50 px-5 py-10 text-center">
              <ShieldAlert size={28} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm font-black text-gray-700">
                처리할 신고 내역을 선택하세요.
              </p>
            </div>
          )}
        </section>
      </div>

      {/* 하단 액션 */}
      <footer className="border-t border-gray-100 bg-white px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            disabled={actionLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2] disabled:cursor-not-allowed disabled:text-gray-300 sm:w-[190px]"
          >
            <ArrowLeft size={17} />
            댓글 목록으로
          </button>

          <button
            type="button"
            onClick={() => onDelete(comment.commentId)}
            disabled={actionLoading}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-6 text-sm font-black text-red-500 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:text-gray-300 sm:w-[170px]"
          >
            {actionLoading ? (
              <Loader2 size={17} className="animate-spin" />
            ) : (
              <Trash2 size={17} />
            )}
            삭제
          </button>
        </div>
      </footer>
    </section>
  );
};

const normalizeStoredHtml = (value) => {
  const html = String(value || '');

  if (/<\/?[a-z][\s\S]*?>/i.test(html)) return html;

  if (
    typeof document !== 'undefined' &&
    /&(?:lt|gt|#0*60|#0*62);/i.test(html)
  ) {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }

  return html;
};

const RichTextContent = ({ html }) => {
  const sanitizedHtml = useMemo(() => {
    return DOMPurify.sanitize(normalizeStoredHtml(html), {
      USE_PROFILES: { html: true },
      FORBID_TAGS: ['script', 'style', 'iframe', 'object', 'embed'],
    });
  }, [html]);

  if (!sanitizedHtml.trim()) {
    return (
      <p className="text-sm font-semibold text-gray-400">
        작성된 내용이 없습니다.
      </p>
    );
  }

  return (
    <div
      className="whitespace-pre-wrap break-words text-sm font-semibold leading-7 text-gray-700
        [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0
        [&_h1]:my-5 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:text-gray-950
        [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:text-gray-950
        [&_h3]:my-4 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-gray-900
        [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6
        [&_li]:my-1
        [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-200
        [&_blockquote]:bg-purple-50/60 [&_blockquote]:px-4 [&_blockquote]:py-2
        [&_a]:font-bold [&_a]:text-[#6d3df2] [&_a]:underline
        [&_strong]:font-black [&_strong]:text-gray-900
        [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl
        [&_img]:border [&_img]:border-gray-100 [&_img]:object-contain"
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

const InfoItem = ({ icon: Icon, label, value, danger = false }) => {
  return (
    <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4 last:border-b-0 sm:border-r sm:last:border-r-0 xl:border-b-0">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${
          danger ? 'bg-red-50 text-red-500' : 'bg-purple-50 text-[#6d3df2]'
        }`}
      >
        <Icon size={19} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-black text-gray-400">{label}</p>
        <p
          className={`mt-1 truncate text-sm font-black ${
            danger ? 'text-red-500' : 'text-gray-900'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

const RelationItem = ({ label, value }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white px-4 py-3">
      <p className="text-xs font-black text-gray-400">{label}</p>
      <p className="mt-1 truncate text-sm font-black text-gray-700">{value}</p>
    </div>
  );
};

const StatusBadge = ({ children, className = '' }) => {
  return (
    <span
      className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ring-1 ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
};

export default CommentDetailView;
