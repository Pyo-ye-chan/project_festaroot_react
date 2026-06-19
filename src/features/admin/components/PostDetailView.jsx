import React, { useEffect, useMemo, useState } from 'react';
import DOMPurify from 'dompurify';
import {
  ArrowLeft,
  UserRound,
  Clock,
  Eye,
  Trash2,
  ShieldAlert,
  AlertTriangle,
  Image as ImageIcon,
  Paperclip,
  ShieldCheck,
  XCircle,
  CheckCircle2,
  FileText,
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

const formatNumber = (value) => Number(value || 0).toLocaleString();

const getPostCode = (post) =>
  `POST-${String(post?.postId || 0).padStart(3, '0')}`;

const normalizeCategory = (category) => String(category || '').toLowerCase();

const getReportCount = (post) => Number(post?.reportItems?.length || 0);

const getPendingReportCount = (post) =>
  Number(
    post?.reportItems?.filter((report) => report.status === 'WAITING').length ||
      0
  );

const PostDetailView = ({
  post,
  initialReportId,
  onBack,
  onDelete,
  onProcessReports,
}) => {
  const getInitialReportId = () => {
    if (!post?.reportItems?.length) return null;

    if (
      initialReportId &&
      post.reportItems.some((report) => report.reportId === initialReportId)
    ) {
      return initialReportId;
    }

    return (
      post.reportItems.find((report) => report.status === 'WAITING')?.reportId ||
      post.reportItems[0]?.reportId ||
      null
    );
  };

  const [selectedReportId, setSelectedReportId] = useState(getInitialReportId);
  const selectedReport =
    post?.reportItems?.find((report) => report.reportId === selectedReportId) ||
    null;

  const [adminMemo, setAdminMemo] = useState(selectedReport?.adminMemo || '');

  useEffect(() => {
    setSelectedReportId(getInitialReportId());
  }, [post?.postId, initialReportId]);

  useEffect(() => {
    setAdminMemo(selectedReport?.adminMemo || '');
  }, [selectedReport?.reportId]);

  if (!post) {
    return (
      <section className="rounded-[28px] border border-gray-200 bg-white p-10 text-center shadow-sm">
        <FileText size={32} className="mx-auto text-gray-300" />
        <p className="mt-3 text-sm font-black text-gray-700">
          게시글 정보를 찾을 수 없습니다.
        </p>

        <button
          type="button"
          onClick={onBack}
          className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-600 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
        >
          <ArrowLeft size={17} />
          게시글 목록으로
        </button>
      </section>
    );
  }

  const imageAttachments =
    post.attachments?.filter((file) => file.type === 'image') || [];
  const fileAttachments =
    post.attachments?.filter((file) => file.type === 'file') || [];

  const reportCount = getReportCount(post);
  const pendingReportCount = getPendingReportCount(post);
  const postCategory = normalizeCategory(post.category);

  const handleSelectReport = (report) => {
    setSelectedReportId(report.reportId);
    setAdminMemo(report.adminMemo || '');
  };

  const handleAccept = () => {
    if (!selectedReport) return;

    onProcessReports({
      postId: post.postId,
      reportId: selectedReport.reportId,
      resultStatus: 'ACCEPTED',
      adminMemo: adminMemo.trim(),
    });
  };

  const handleReject = () => {
    if (!selectedReport) return;

    onProcessReports({
      postId: post.postId,
      reportId: selectedReport.reportId,
      resultStatus: 'REJECTED',
      adminMemo: adminMemo.trim(),
    });
  };

  return (
    <section className="overflow-hidden rounded-[28px] border border-gray-200 bg-white shadow-sm">
      <header className="border-b border-gray-100 bg-white px-6 py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
              게시글 상세보기
            </h1>

            <p className="mt-2 text-sm font-semibold text-gray-400">
              게시글 원문과 신고 내역을 확인하고, 선택한 신고 건을 인정 또는 반려 처리합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge
              className={
                categoryClass[postCategory] ||
                'bg-gray-100 text-gray-500 ring-gray-200'
              }
            >
              {CATEGORY_LABELS[postCategory] || post.category}
            </StatusBadge>

            <span className="inline-flex h-8 items-center rounded-full bg-gray-50 px-3 text-xs font-black text-gray-500 ring-1 ring-gray-100">
              {getPostCode(post)}
            </span>
          </div>
        </div>
      </header>

      <div className="space-y-6 bg-gray-50/30 px-6 py-6">
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-xs font-black text-gray-400">게시글 제목</p>

          <h2 className="mt-2 break-keep text-2xl font-black leading-9 text-gray-950">
            {post.title}
          </h2>

          <div className="mt-6 grid grid-cols-1 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 sm:grid-cols-2 xl:grid-cols-4">
            <InfoItem icon={UserRound} label="작성자" value={post.author} />
            <InfoItem icon={Clock} label="작성일" value={post.createdAt} />
            <InfoItem
              icon={Eye}
              label="조회수"
              value={`${formatNumber(post.views)}회`}
            />
            <InfoItem
              icon={ShieldAlert}
              label="신고"
              value={`${formatNumber(reportCount)}건`}
              danger={reportCount > 0}
            />
          </div>
        </article>

        {reportCount > 0 && (
          <section className="rounded-3xl border border-red-100 bg-red-50/50 p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-red-500 shadow-sm">
                <AlertTriangle size={22} />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-black text-red-600">
                    신고가 접수된 게시글입니다.
                  </h2>

                  <span className="inline-flex h-7 items-center rounded-full bg-white px-3 text-xs font-black text-red-500">
                    처리 대기 {formatNumber(pendingReportCount)}건
                  </span>
                </div>

                <p className="mt-1 text-sm font-semibold leading-6 text-red-400">
                  신고 인정/반려는 게시글이 아니라 선택한 신고 내역에 대해 처리됩니다.
                </p>
              </div>
            </div>
          </section>
        )}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.9fr]">
          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-gray-900">게시글 내용</h2>
              <p className="mt-1 text-xs font-bold text-gray-400">
                사용자가 작성한 원문 내용입니다.
              </p>
            </div>

            <div className="mt-5 min-h-[230px] rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <RichTextContent html={post.content} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
              <AttachmentBox
                title="첨부 이미지"
                emptyText="첨부 이미지가 없습니다."
                files={imageAttachments}
                type="image"
              />

              <AttachmentBox
                title="첨부 파일"
                emptyText="첨부 파일이 없습니다."
                files={fileAttachments}
                type="file"
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

            <div className="mt-5 space-y-3">
              {post.reportItems?.length > 0 ? (
                post.reportItems.map((report) => {
                  const isSelected = selectedReport?.reportId === report.reportId;

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
                            RPT-{String(report.reportId).padStart(5, '0')}
                          </p>

                          <p className="mt-2 line-clamp-1 text-sm font-black text-gray-800">
                            {report.reason}
                          </p>

                          <p className="mt-1 text-xs font-bold text-gray-400">
                            신고자 {report.reporterMemberId}
                          </p>
                        </div>

                        <StatusBadge
                          className={
                            REPORT_RESULT_CLASS[report.status] ||
                            'bg-gray-100 text-gray-500 ring-gray-200'
                          }
                        >
                          {REPORT_RESULT_LABELS[report.status] || report.status}
                        </StatusBadge>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-bold text-gray-400">
                        <span>접수 {report.createdAt}</span>
                        <span>·</span>
                        <span>처리 {report.processedAt || '-'}</span>
                      </div>
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
                현재 {REPORT_RESULT_LABELS[selectedReport.status] || selectedReport.status}
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
                  RPT-{String(selectedReport.reportId).padStart(5, '0')}
                </p>

                <p className="mt-4 text-sm font-black text-gray-800">
                  {selectedReport.reason}
                </p>

                <p className="mt-2 text-sm font-semibold leading-6 text-gray-500">
                  신고자 {selectedReport.reporterMemberId}
                </p>

                <p className="mt-1 text-xs font-bold text-gray-400">
                  접수일자 {selectedReport.createdAt}
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
                  onChange={(e) => setAdminMemo(e.target.value)}
                  placeholder="신고 인정/반려 사유를 입력하세요."
                  className="mt-2 min-h-[150px] w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-semibold leading-6 text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50"
                />

                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={handleReject}
                    disabled={selectedReport.status !== 'WAITING'}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black transition ${
                      selectedReport.status !== 'WAITING'
                        ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                        : 'border border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <XCircle size={16} />
                    신고 반려
                  </button>

                  <button
                    type="button"
                    onClick={handleAccept}
                    disabled={selectedReport.status !== 'WAITING'}
                    className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-black transition ${
                      selectedReport.status !== 'WAITING'
                        ? 'cursor-not-allowed bg-gray-50 text-gray-300'
                        : 'bg-[#6d3df2] text-white shadow-sm hover:bg-[#5b2ed8]'
                    }`}
                  >
                    <ShieldCheck size={17} />
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

      <footer className="border-t border-gray-100 bg-white px-6 py-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-6 text-sm font-black text-gray-700 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2] sm:w-[190px]"
          >
            <ArrowLeft size={17} />
            게시글 목록으로
          </button>

          <button
            type="button"
            onClick={() => onDelete(post.postId)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-6 text-sm font-black text-red-500 transition hover:bg-red-100 sm:w-[170px]"
          >
            <Trash2 size={17} />
            완전 삭제
          </button>
        </div>
      </footer>
    </section>
  );
};

const normalizeStoredHtml = (value) => {
  const html = String(value || '');

  // 일반적인 Tiptap HTML이면 그대로 사용합니다.
  if (/<\/?[a-z][\s\S]*?>/i.test(html)) return html;

  // 백엔드에서 &lt;p&gt;처럼 한 번 더 이스케이프된 경우만 복원합니다.
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
    const normalizedHtml = normalizeStoredHtml(html);

    return DOMPurify.sanitize(normalizedHtml, {
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
      className="break-words text-sm font-semibold leading-7 text-gray-700
        [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0
        [&_h1]:my-5 [&_h1]:text-3xl [&_h1]:font-black [&_h1]:leading-tight [&_h1]:text-gray-950
        [&_h2]:my-4 [&_h2]:text-2xl [&_h2]:font-black [&_h2]:leading-tight [&_h2]:text-gray-950
        [&_h3]:my-4 [&_h3]:text-xl [&_h3]:font-black [&_h3]:text-gray-900
        [&_h4]:my-3 [&_h4]:text-lg [&_h4]:font-black [&_h4]:text-gray-900
        [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6
        [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6
        [&_li]:my-1
        [&_blockquote]:my-4 [&_blockquote]:border-l-4 [&_blockquote]:border-purple-200
        [&_blockquote]:bg-purple-50/60 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:text-gray-600
        [&_a]:font-bold [&_a]:text-[#6d3df2] [&_a]:underline [&_a]:underline-offset-2
        [&_strong]:font-black [&_strong]:text-gray-900
        [&_em]:italic
        [&_s]:text-gray-400
        [&_hr]:my-6 [&_hr]:border-gray-200
        [&_code]:rounded-md [&_code]:bg-gray-200/70 [&_code]:px-1.5 [&_code]:py-0.5
        [&_code]:font-mono [&_code]:text-[0.9em] [&_code]:font-semibold
        [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-gray-900
        [&_pre]:p-4 [&_pre]:text-gray-100
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit
        [&_img]:my-4 [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-2xl
        [&_img]:border [&_img]:border-gray-100 [&_img]:object-contain
        [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse
        [&_th]:border [&_th]:border-gray-200 [&_th]:bg-gray-100 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left
        [&_td]:border [&_td]:border-gray-200 [&_td]:px-3 [&_td]:py-2"
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

const AttachmentBox = ({ title, emptyText, files, type }) => {
  const Icon = type === 'image' ? ImageIcon : Paperclip;

  const colorClass =
    type === 'image'
      ? 'border-purple-100 bg-purple-50 text-[#6d3df2]'
      : 'border-yellow-100 bg-yellow-50 text-yellow-700';

  return (
    <div>
      <p className="text-xs font-black text-gray-400">{title}</p>

      {files.length > 0 ? (
        <div className="mt-2 space-y-2">
          {files.map((file) => (
            <div
              key={file.name}
              className={`flex min-h-12 items-center gap-2 rounded-2xl border px-4 py-3 ${colorClass}`}
            >
              <Icon size={17} className="shrink-0" />
              <p className="truncate text-sm font-black">{file.name}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-4 text-sm font-bold text-gray-300">
          {emptyText}
        </p>
      )}
    </div>
  );
};

const StatusBadge = ({ children, className }) => {
  return (
    <span
      className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ring-1 ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
};

export default PostDetailView;