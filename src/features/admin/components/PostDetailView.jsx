const PostDetailView = ({
  post,
  onBack,
  onDelete,
  onProcessReports,
}) => {
  const firstWaitingReport =
    post?.reportItems?.find((report) => report.status === 'WAITING') ||
    post?.reportItems?.[0] ||
    null;

  const [selectedReportId, setSelectedReportId] = useState(
    firstWaitingReport?.reportId || null
  );

  const selectedReport =
    post?.reportItems?.find((report) => report.reportId === selectedReportId) ||
    null;

  const [adminMemo, setAdminMemo] = useState(
    selectedReport?.adminMemo || post?.adminMemo || ''
  );

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
      {/* 상단 헤더 */}
      <header className="border-b border-gray-100 bg-white px-6 py-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
              게시글 상세보기
            </h1>

            <p className="mt-2 text-sm font-semibold text-gray-400">
              게시글 원문과 신고 내역을 함께 확인하고, 선택한 신고 건을 인정 또는 반려 처리합니다.
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

      {/* 본문 */}
      <div className="space-y-6 bg-gray-50/30 px-6 py-6">
        {/* 제목 + 기본 정보 */}
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

        {/* 게시글 내용 + 신고 내역 */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-[1.25fr_0.9fr]">
          {/* 게시글 내용 */}
          <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="border-b border-gray-100 pb-4">
              <h2 className="text-lg font-black text-gray-900">게시글 내용</h2>
              <p className="mt-1 text-xs font-bold text-gray-400">
                사용자가 작성한 원문 내용입니다.
              </p>
            </div>

            <div className="mt-5 min-h-[230px] rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
              <p className="whitespace-pre-wrap break-keep text-sm font-semibold leading-7 text-gray-700">
                {post.content}
              </p>
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

          {/* 신고 내역 */}
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

        {/* 선택 신고 처리 */}
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

      {/* 하단 액션 */}
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

export default PostDetailView;