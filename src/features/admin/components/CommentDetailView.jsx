import { useMemo, useState } from 'react';
import { ArrowLeft, ThumbsUp, ShieldAlert, CheckCircle2, CornerDownRight, Trash2, Send } from 'lucide-react';

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '리뷰',
  tip: '팁',
  notice: '공지',
};

const REPORT_RESULT_LABELS = {
  WAITING: '대기',
  ACCEPTED: '승인',
  REJECTED: '반려',
};

const REPORT_RESULT_CLASSES = {
  WAITING: 'bg-yellow-50 text-yellow-600',
  ACCEPTED: 'bg-red-50 text-red-500',
  REJECTED: 'bg-gray-100 text-gray-500',
};

const categoryClass = {
  free: 'bg-slate-100 text-slate-600',
  review: 'bg-purple-50 text-purple-600',
  tip: 'bg-amber-50 text-amber-600',
  notice: 'bg-blue-50 text-blue-600',
};

const commentTypeClass = {
  COMMENT: 'bg-purple-50 text-purple-600',
  REPLY: 'bg-blue-50 text-blue-600',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();
const getCommentCode = (comment) => `CMT-${String(comment.commentId).padStart(5, '0')}`;

const getPostCode = (comment) => `POST-${String(comment.postId).padStart(3, '0')}`;

const normalizeCategory = (category) => String(category || '').toLowerCase();

const getCommentType = (comment) => (comment.parentCommentId ? 'REPLY' : 'COMMENT');

const getCommentTypeLabel = (comment) => (comment.parentCommentId ? '대댓글' : '댓글');

const getReportCount = (comment) => Number(comment.reportItems?.length || 0);

const getPendingReportCount = (comment) =>
  Number(comment.reportItems?.filter((report) => report.status === 'WAITING').length || 0);

const CommentDetailView = ({ comment, onBack, onDelete, onProcessReport }) => {
  const reports = useMemo(() => comment.reportItems || [], [comment.reportItems]);
  const defaultReportId =
    reports.find((report) => report.status === 'WAITING')?.reportId || reports[0]?.reportId || null;
  const [selectedReportId, setSelectedReportId] = useState(defaultReportId);

  const selectedReport = useMemo(() => {
    if (!reports.length) return null;
    return reports.find((report) => report.reportId === selectedReportId) || reports[0];
  }, [reports, selectedReportId]);

  const [adminMemo, setAdminMemo] = useState(selectedReport?.adminMemo || '');

  const handleSelectReport = (report) => {
    setSelectedReportId(report.reportId);
    setAdminMemo(report.adminMemo || '');
  };

  const pendingCount = getPendingReportCount(comment);
  const commentType = getCommentType(comment);

  const handleProcess = (resultStatus) => {
    if (!selectedReport) {
      window.alert('선택한 신고 내역을 찾지 못했습니다.');
      return;
    }

    onProcessReport({
      commentId: comment.commentId,
      reportId: selectedReport.reportId,
      resultStatus,
      adminMemo,
    });
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-600 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
          >
            <ArrowLeft size={16} />
            댓글 목록으로
          </button>

          <h1 className="mt-4 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
            댓글 상세 뷰
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            댓글 내용, 신고 대상 글, 신고 내역을 확인하고, 선택한 신고를 처리할 수 있습니다.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onDelete(comment.commentId)}
          className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 text-sm font-black text-red-500 transition hover:bg-red-100"
        >
          <Trash2 size={17} />
          댓글 완전 삭제
        </button>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MiniInfoCard label="댓글 ID" value={getCommentCode(comment)} />
        <MiniInfoCard label="작성자" value={comment.memberId} />
        <MiniInfoCard
          label="총 신고"
          value={`${formatNumber(getReportCount(comment))}건`}
          highlight={getReportCount(comment) > 0}
        />
        <MiniInfoCard
          label="처리 대기"
          value={`${formatNumber(pendingCount)}건`}
          highlight={pendingCount > 0}
        />
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_0.95fr]">
        <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge className={commentTypeClass[commentType]}>
                {getCommentTypeLabel(comment)}
              </StatusBadge>
              <StatusBadge
                className={categoryClass[normalizeCategory(comment.postCategory)] || 'bg-gray-100 text-gray-500'}
              >
                {CATEGORY_LABELS[normalizeCategory(comment.postCategory)] || comment.postCategory}
              </StatusBadge>
            </div>
            <h2 className="mt-4 text-lg font-black leading-7 text-gray-900">{comment.postTitle}</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              {getPostCode(comment)} • 작성일 {comment.createdAt} • 수정일 {comment.updatedAt}
            </p>
          </div>

          <div className="p-5">
            <div className="rounded-3xl border border-gray-100 bg-gray-50/70 p-5">
              {comment.parentCommentId && (
                <p className="mb-3 flex items-center gap-1 text-xs font-black text-gray-400">
                  <CornerDownRight size={14} /> 부모 댓글 ID: CMT-{String(comment.parentCommentId).padStart(5, '0')}
                </p>
              )}
              <p className="break-keep text-base font-bold leading-8 text-gray-800">
                {comment.content}
              </p>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-black text-gray-700">
                  <ThumbsUp size={16} className="text-[#6d3df2]" />
                  좋아요 수
                </div>
                <p className="mt-2 text-2xl font-black text-gray-950">{formatNumber(comment.likeCount)}</p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <div className="flex items-center gap-2 text-sm font-black text-gray-700">
                  <ShieldAlert size={16} className="text-red-500" />
                  신고 수
                </div>
                <p className="mt-2 text-2xl font-black text-red-500">{formatNumber(getReportCount(comment))}</p>
              </div>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
          <div className="border-b border-red-50 px-5 py-5">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-gray-900">신고 목록</h2>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50 px-3 text-xs font-black text-red-500">
                {formatNumber(reports.length)}건
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              신고 목록을 선택하면 선택된 신고의 내용을 기준으로 처리 사유를 작성할 수 있습니다.
            </p>
          </div>

          <div className="max-h-[360px] space-y-2 overflow-y-auto p-5">
            {reports.length > 0 ? (
              reports.map((report) => {
                const isSelected = selectedReport?.reportId === report.reportId;

                return (
                  <button
                    key={report.reportId}
                    type="button"
                    onClick={() => handleSelectReport(report)}
                    className={`w-full rounded-2xl border p-4 text-left transition ${
                      isSelected
                        ? 'border-[#6d3df2]/40 bg-purple-50/60'
                        : 'border-gray-100 bg-white hover:border-[#6d3df2]/20 hover:bg-purple-50/30'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-black text-gray-800">
                        RPT-{String(report.reportId).padStart(5, '0')}
                      </p>
                      <StatusBadge className={REPORT_RESULT_CLASSES[report.status]}>
                        {REPORT_RESULT_LABELS[report.status] || report.status}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm font-bold text-gray-600">{report.reason}</p>
                    <p className="mt-1 text-xs font-semibold text-gray-400">
                      신고자 {report.reporterMemberId} · {report.createdAt}
                    </p>
                    {report.adminMemo && (
                      <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-gray-500">
                        관리자 메모: {report.adminMemo}
                      </p>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="rounded-3xl border border-gray-100 bg-gray-50 p-8 text-center">
                <CheckCircle2 size={26} className="mx-auto text-emerald-500" />
                <p className="mt-3 text-sm font-black text-gray-700">신고가 존재하지 않습니다.</p>
              </div>
            )}
          </div>
        </article>
      </section>

      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-5 py-5">
          <h2 className="text-lg font-black text-gray-900">신고 처리</h2>
          <p className="mt-1 text-xs font-bold text-gray-400">
            처리 결과는 REPORT_REPORT.STATUS 값으로 반영되며, 관리자 메모는 MEMBER_REPORT_HISTORY.ADMIN_MEMO에 저장됩니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-3xl border border-gray-100 bg-gray-50/70 p-5">
            <p className="text-xs font-black text-gray-400">선택 신고</p>
            {selectedReport ? (
              <>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <strong className="text-lg font-black text-gray-900">
                    RPT-{String(selectedReport.reportId).padStart(5, '0')}
                  </strong>
                  <StatusBadge className={REPORT_RESULT_CLASSES[selectedReport.status]}>
                    {REPORT_RESULT_LABELS[selectedReport.status] || selectedReport.status}
                  </StatusBadge>
                </div>
                <dl className="mt-4 space-y-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <dt className="font-black text-gray-400">신고자</dt>
                    <dd className="font-bold text-gray-700">{selectedReport.reporterMemberId}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-black text-gray-400">신고 사유</dt>
                    <dd className="font-bold text-gray-700">{selectedReport.reason}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="font-black text-gray-400">신고일시</dt>
                    <dd className="font-bold text-gray-700">{selectedReport.createdAt}</dd>
                  </div>
                  {selectedReport.processedAt && (
                    <div className="flex justify-between gap-4">
                      <dt className="font-black text-gray-400">처리일시</dt>
                      <dd className="font-bold text-gray-700">{selectedReport.processedAt}</dd>
                    </div>
                  )}
                </dl>
              </>
            ) : (
              <p className="mt-3 text-sm font-bold text-gray-500">선택한 신고 내역이 없습니다.</p>
            )}
          </div>

          <div>
            <label className="mb-2 block text-xs font-black text-gray-500">관리자 메모</label>
            <textarea
              value={adminMemo}
              onChange={(e) => setAdminMemo(e.target.value)}
              disabled={!selectedReport || selectedReport.status !== 'WAITING'}
              placeholder="승인 또는 반려 이유를 입력하고 선택 신고 처리할 수 있습니다."
              className="min-h-[150px] w-full resize-none rounded-3xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50 disabled:cursor-not-allowed disabled:text-gray-400"
            />

            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => handleProcess('REJECTED')}
                disabled={!selectedReport || selectedReport.status !== 'WAITING'}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 text-sm font-black text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:border-gray-100 disabled:text-gray-300"
              >
                <CheckCircle2 size={17} />
                신고 반려
              </button>

              <button
                type="button"
                onClick={() => handleProcess('ACCEPTED')}
                disabled={!selectedReport || selectedReport.status !== 'WAITING'}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#6d3df2] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#5b2ed8] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
              >
                <Send size={17} />
                신고 승인
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const MiniInfoCard = ({ label, value, highlight = false }) => {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black text-gray-400">{label}</p>
      <p className={`mt-2 truncate text-xl font-black ${highlight ? 'text-red-500' : 'text-gray-950'}`}>
        {value}
      </p>
    </article>
  );
};

const StatusBadge = ({ children, className }) => {
  return (
    <span
      className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
};

export default CommentDetailView;
