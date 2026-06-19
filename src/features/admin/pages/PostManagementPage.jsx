import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  CalendarDays,
  FileText,
  Image as ImageIcon,
  Paperclip,
  ShieldAlert,
  Eye,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import PostDetailView from '../components/PostDetailView';
import {
  getAdminPostSummary,
  getWaitingPostReports,
  getAdminPosts,
  getAdminPostDetail,
  processAdminPostReport,
  deleteAdminPost,
  deleteAdminPosts,
} from '../../../api/adminApi';

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '후기',
  tip: '꿀팁',
};

const SEARCH_TYPE_OPTIONS = [
  { value: 'title', label: '제목' },
  { value: 'author', label: '작성자' },
  { value: 'id', label: '게시글 ID' },
];

const REPORT_RESULT_LABELS = {
  WAITING: '접수',
  ACCEPTED: '인정',
  REJECTED: '반려',
};

const REPORT_PAGE_SIZE = 4;
const POST_PAGE_SIZE = 5;

const categoryClass = {
  free: 'bg-slate-100 text-slate-600',
  review: 'bg-purple-50 text-purple-600',
  tip: 'bg-amber-50 text-amber-600',
  notice: 'bg-blue-50 text-blue-600',
};

const INITIAL_STATS = {
  total: 0,
  today: 0,
  reportedPostCount: 0,
  pendingReportCount: 0,
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const normalizeCategory = (category) => String(category || '').toLowerCase();

const getPostCode = (post) => {
  if (post?.postCode) return post.postCode;
  return `POST-${String(post?.postId || 0).padStart(3, '0')}`;
};

const getReportCode = (report) => {
  if (report?.reportCode) return report.reportCode;
  return `RPT-${String(report?.reportId || 0).padStart(5, '0')}`;
};

const getSearchPlaceholder = (searchType) => {
  if (searchType === 'author') return '작성자 ID를 입력하세요';
  if (searchType === 'id') return '게시글 ID를 입력하세요';
  return '게시글 제목을 입력하세요';
};

const getErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;

  if (typeof responseData === 'string' && responseData.trim()) {
    return responseData;
  }

  return responseData?.message || responseData?.error || fallback;
};

const PostManagementPage = () => {
  const [stats, setStats] = useState(INITIAL_STATS);
  const [waitingReportRows, setWaitingReportRows] = useState([]);
  const [posts, setPosts] = useState([]);

  const [keywordInput, setKeywordInput] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [searchCondition, setSearchCondition] = useState({
    searchType: 'title',
    keyword: '',
  });
  const [category, setCategory] = useState('all');

  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);

  const [reportPage, setReportPage] = useState(1);
  const [reportTotalPages, setReportTotalPages] = useState(1);
  const [reportTotalCount, setReportTotalCount] = useState(0);

  const [postPage, setPostPage] = useState(1);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [postTotalCount, setPostTotalCount] = useState(0);

  const [summaryLoading, setSummaryLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);
  const [openingPostId, setOpeningPostId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [loadError, setLoadError] = useState('');

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const response = await getAdminPostSummary();
      const data = response.data || {};

      setStats({
        total: Number(data.total || 0),
        today: Number(data.today || 0),
        reportedPostCount: Number(data.reportedPostCount || 0),
        pendingReportCount: Number(data.pendingReportCount || 0),
      });
    } catch (error) {
      console.error('게시판 관리자 통계 조회 실패:', error);
      setLoadError(
        getErrorMessage(error, '게시판 관리자 통계를 불러오지 못했습니다.')
      );
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadWaitingReports = useCallback(async (targetPage) => {
    setReportsLoading(true);

    try {
      const response = await getWaitingPostReports({
        page: targetPage,
        size: REPORT_PAGE_SIZE,
      });
      const data = response.data || {};
      const totalPages = Math.max(Number(data.totalPages || 1), 1);

      setReportTotalPages(totalPages);
      setReportTotalCount(Number(data.totalCount || 0));

      if (targetPage > totalPages) {
        setWaitingReportRows([]);
        setReportPage(totalPages);
        return;
      }

      setWaitingReportRows(Array.isArray(data.list) ? data.list : []);
    } catch (error) {
      console.error('처리 대기 신고 조회 실패:', error);
      setWaitingReportRows([]);
      setLoadError(
        getErrorMessage(error, '처리 대기 신고 목록을 불러오지 못했습니다.')
      );
    } finally {
      setReportsLoading(false);
    }
  }, []);

  const loadPosts = useCallback(
    async (targetPage) => {
      setPostsLoading(true);

      try {
        const response = await getAdminPosts({
          page: targetPage,
          size: POST_PAGE_SIZE,
          category,
          searchType: searchCondition.searchType,
          keyword: searchCondition.keyword,
        });
        const data = response.data || {};
        const totalPages = Math.max(Number(data.totalPages || 1), 1);

        setPostTotalPages(totalPages);
        setPostTotalCount(Number(data.totalCount || 0));

        if (targetPage > totalPages) {
          setPosts([]);
          setPostPage(totalPages);
          return;
        }

        setPosts(Array.isArray(data.list) ? data.list : []);
      } catch (error) {
        console.error('전체 게시글 조회 실패:', error);
        setPosts([]);
        setLoadError(
          getErrorMessage(error, '전체 게시글 목록을 불러오지 못했습니다.')
        );
      } finally {
        setPostsLoading(false);
      }
    },
    [category, searchCondition]
  );

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    loadWaitingReports(reportPage);
  }, [loadWaitingReports, reportPage]);

  useEffect(() => {
    loadPosts(postPage);
  }, [loadPosts, postPage]);

  const isAllChecked = useMemo(() => {
    return (
      posts.length > 0 &&
      posts.every((post) => selectedPostIds.includes(post.postId))
    );
  }, [posts, selectedPostIds]);

  const refreshOverview = async () => {
    await Promise.allSettled([
      loadSummary(),
      loadWaitingReports(reportPage),
      loadPosts(postPage),
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
    setSelectedPostIds([]);
    setPostPage(1);
  };

  const handleSearchKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setKeywordInput('');
    setSearchType('title');
    setSearchCondition({
      searchType: 'title',
      keyword: '',
    });
    setCategory('all');
    setSelectedPostIds([]);
    setPostPage(1);
  };

  const handleChangeCategory = (nextCategory) => {
    setCategory(nextCategory);
    setSelectedPostIds([]);
    setPostPage(1);
  };

  const handleChangeSearchType = (nextSearchType) => {
    setSearchType(nextSearchType);
  };

  const handleOpenDetail = async (postId, reportId = null) => {
    if (openingPostId !== null) return;

    setOpeningPostId(postId);
    setSelectedReportId(reportId);

    try {
      const response = await getAdminPostDetail(postId);
      setSelectedPost(response.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
      window.alert(
        getErrorMessage(error, '게시글 상세 정보를 불러오지 못했습니다.')
      );
    } finally {
      setOpeningPostId(null);
    }
  };

  const handleBackToList = () => {
    setSelectedPost(null);
    setSelectedReportId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleAll = () => {
    const currentPageIds = posts.map((post) => post.postId);

    if (isAllChecked) {
      setSelectedPostIds((prev) =>
        prev.filter((id) => !currentPageIds.includes(id))
      );
      return;
    }

    setSelectedPostIds((prev) =>
      Array.from(new Set([...prev, ...currentPageIds]))
    );
  };

  const handleTogglePost = (postId) => {
    setSelectedPostIds((prev) => {
      if (prev.includes(postId)) {
        return prev.filter((id) => id !== postId);
      }

      return [...prev, postId];
    });
  };

  const handleDeletePost = async (postId) => {
    if (actionLoading) return;

    const target =
      selectedPost?.postId === postId
        ? selectedPost
        : posts.find((post) => post.postId === postId);

    const titleText = target?.title ? `\n\n제목: ${target.title}` : '';
    const isConfirmed = window.confirm(
      `게시글과 댓글, 좋아요, 신고 기록, 첨부 이미지/파일이 함께 삭제됩니다.${titleText}\n\n정말 완전 삭제할까요?`
    );

    if (!isConfirmed) return;

    setActionLoading(true);

    try {
      await deleteAdminPost(postId);

      setSelectedPostIds((prev) => prev.filter((id) => id !== postId));

      if (selectedPost?.postId === postId) {
        setSelectedPost(null);
        setSelectedReportId(null);
      }

      await refreshOverview();
      window.alert('게시글이 완전 삭제되었습니다.');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      window.alert(getErrorMessage(error, '게시글 삭제 중 오류가 발생했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSelectedPosts = async () => {
    if (actionLoading) return;

    if (selectedPostIds.length === 0) {
      window.alert('삭제할 게시글을 선택해주세요.');
      return;
    }

    const isConfirmed = window.confirm(
      `선택한 게시글 ${selectedPostIds.length}건을 완전 삭제할까요?\n\n게시글, 댓글, 좋아요, 신고 기록, 첨부 이미지/파일이 함께 삭제됩니다.`
    );

    if (!isConfirmed) return;

    setActionLoading(true);

    try {
      await deleteAdminPosts(selectedPostIds);
      setSelectedPostIds([]);
      await refreshOverview();
      window.alert('선택한 게시글이 완전 삭제되었습니다.');
    } catch (error) {
      console.error('선택 게시글 삭제 실패:', error);
      window.alert(
        getErrorMessage(error, '선택 게시글 삭제 중 오류가 발생했습니다.')
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleProcessReports = async ({
    postId,
    reportId,
    resultStatus,
    adminMemo,
  }) => {
    if (actionLoading) return;

    const resultLabel = REPORT_RESULT_LABELS[resultStatus] || resultStatus;
    const isConfirmed = window.confirm(
      `신고 ${getReportCode({ reportId })}을(를) '${resultLabel}' 처리할까요?\n\n선택한 신고 내역만 처리됩니다.`
    );

    if (!isConfirmed) return;

    setActionLoading(true);

    try {
      await processAdminPostReport({
        postId,
        reportId,
        resultStatus,
        adminMemo,
      });

      const detailResponse = await getAdminPostDetail(postId);
      setSelectedPost(detailResponse.data);
      setSelectedReportId(reportId);

      await refreshOverview();

      window.alert(
        resultStatus === 'ACCEPTED'
          ? '신고를 인정 처리했습니다.'
          : '신고를 반려 처리했습니다.'
      );
    } catch (error) {
      console.error('신고 처리 실패:', error);
      window.alert(getErrorMessage(error, '신고 처리 중 오류가 발생했습니다.'));
    } finally {
      setActionLoading(false);
    }
  };

  if (selectedPost) {
    return (
      <PostDetailView
        post={selectedPost}
        initialReportId={selectedReportId}
        onBack={handleBackToList}
        onDelete={handleDeletePost}
        onProcessReports={handleProcessReports}
      />
    );
  }

  return (
    <div className="space-y-6">
      <section>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
          게시글 관리
        </h1>

        <p className="mt-2 text-sm font-medium text-gray-500">
          게시글 원문과 첨부 자료를 확인하고, 접수된 신고는 신고 내역 단위로 인정 또는 반려 처리합니다.
        </p>
      </section>

      {loadError && (
        <section className="flex flex-col gap-3 rounded-2xl border border-red-100 bg-red-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="mt-0.5 shrink-0 text-red-500" />
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
          icon={FileText}
          title="전체 게시글"
          value={stats.total}
          unit="건"
          description="커뮤니티 전체 게시글"
          iconClass="bg-purple-50 text-[#6d3df2]"
          loading={summaryLoading}
        />

        <SummaryCard
          icon={CalendarDays}
          title="오늘 작성"
          value={stats.today}
          unit="건"
          description="오늘 새로 등록된 게시글"
          iconClass="bg-blue-50 text-blue-600"
          loading={summaryLoading}
        />

        <SummaryCard
          icon={ShieldAlert}
          title="신고 게시글"
          value={stats.reportedPostCount}
          unit="건"
          description="신고가 1회 이상 접수된 게시글"
          iconClass="bg-red-50 text-red-500"
          loading={summaryLoading}
        />

        <SummaryCard
          icon={ClipboardCheck}
          title="처리 대기 신고"
          value={stats.pendingReportCount}
          unit="건"
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
                신고 접수 게시글
              </h2>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50 px-3 text-xs font-black text-red-500">
                {formatNumber(reportTotalCount)}건
              </span>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50/70 px-3 text-xs font-black text-red-500">
                우선 확인
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              처리 대기 신고 단위로 원문 확인과 처리 화면으로 이동합니다.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] table-fixed text-left">
            <colgroup>
              <col className="w-[120px]" />
              <col className="w-[145px]" />
              <col className="w-[155px]" />
              <col className="w-[360px]" />
              <col className="w-[130px]" />
              <col className="w-[90px]" />
              <col className="w-[100px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-center text-xs font-black text-gray-500">
                <th className="px-4 py-4">접수 번호</th>
                <th className="px-4 py-4">접수 일자</th>
                <th className="px-4 py-4">신고 사유</th>
                <th className="px-4 py-4">제목</th>
                <th className="px-4 py-4">신고자</th>
                <th className="px-4 py-4">누적</th>
                <th className="px-4 py-4">관리</th>
              </tr>
            </thead>

            <tbody>
              {reportsLoading ? (
                <LoadingTableRow colSpan={7} text="처리 대기 신고를 불러오는 중입니다." />
              ) : waitingReportRows.length > 0 ? (
                waitingReportRows.map((report) => {
                  const reportCategory = normalizeCategory(report.category);
                  const isOpening = openingPostId === report.postId;

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
                          <span className="truncate">{report.reason}</span>
                        </span>
                      </td>
                      <td className="px-4 py-4 align-middle">
                        <button
                          type="button"
                          disabled={isOpening}
                          onClick={() =>
                            handleOpenDetail(report.postId, report.reportId)
                          }
                          className="block w-full text-left disabled:cursor-wait"
                        >
                          <p className="line-clamp-1 break-keep text-sm font-black text-gray-800">
                            {report.title}
                          </p>
                          <p className="mt-1 text-xs font-semibold text-gray-400">
                            {report.postCode ||
                              getPostCode({ postId: report.postId })}{' '}
                            ·{' '}
                            {CATEGORY_LABELS[reportCategory] ||
                              report.category ||
                              '-'}
                          </p>
                        </button>
                      </td>
                      <td className="px-4 py-4 text-center align-middle font-bold text-gray-600">
                        {report.reporterMemberId}
                      </td>
                      <td className="px-4 py-4 text-center align-middle font-black text-red-500">
                        {formatNumber(report.postReportCount)}
                      </td>
                      <td className="px-4 py-4 text-center align-middle">
                        <button
                          type="button"
                          disabled={isOpening}
                          onClick={() =>
                            handleOpenDetail(report.postId, report.reportId)
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
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <CheckCircle2 size={28} className="mx-auto text-emerald-500" />
                    <p className="mt-3 text-sm font-black text-gray-700">
                      처리 대기 중인 신고가 없습니다.
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
            onChange={setReportPage}
            disabled={reportsLoading}
          />
        </div>
      </section>

      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">전체 게시글 조회</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              카테고리를 먼저 좁힌 뒤 제목, 작성자, 게시글 ID 기준으로 검색합니다.
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[0.9fr_0.9fr_2.2fr]">
          <FilterSelect
            label="카테고리"
            value={category}
            onChange={handleChangeCategory}
            options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
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
                disabled={postsLoading}
                className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-2xl bg-[#6d3df2] px-5 text-sm font-black text-white shadow-sm transition hover:bg-[#5b2ed8] disabled:cursor-wait disabled:bg-purple-300"
              >
                {postsLoading ? (
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
              <h2 className="text-lg font-black text-gray-900">게시글 목록</h2>
              <span className="inline-flex h-7 items-center rounded-full bg-purple-50 px-3 text-xs font-black text-[#6d3df2]">
                {formatNumber(postTotalCount)}개
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              검색 조건에 맞는 게시글을 페이지 단위로 확인합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteSelectedPosts}
            disabled={selectedPostIds.length === 0 || actionLoading}
            className={`inline-flex h-10 w-fit items-center gap-2 rounded-xl px-4 text-sm font-black transition ${
              selectedPostIds.length === 0 || actionLoading
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
            {selectedPostIds.length > 0 && ` ${selectedPostIds.length}`}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] table-fixed text-left">
            <colgroup>
              <col className="w-[52px]" />
              <col className="w-[105px]" />
              <col className="w-[360px]" />
              <col className="w-[105px]" />
              <col className="w-[130px]" />
              <col className="w-[145px]" />
              <col className="w-[80px]" />
              <col className="w-[80px]" />
              <col className="w-[115px]" />
              <col className="w-[90px]" />
              <col className="w-[118px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-black text-gray-500">
                <th className="px-4 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={isAllChecked}
                    onChange={handleToggleAll}
                    disabled={postsLoading || posts.length === 0}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </th>
                <th className="px-4 py-4 text-center">게시글 ID</th>
                <th className="px-4 py-4">게시글 제목</th>
                <th className="px-4 py-4 text-center">카테고리</th>
                <th className="px-4 py-4 text-center">작성자</th>
                <th className="px-4 py-4 text-center">작성일</th>
                <th className="px-4 py-4 text-right">조회</th>
                <th className="px-4 py-4 text-right">댓글</th>
                <th className="px-4 py-4 text-center">첨부</th>
                <th className="px-4 py-4 text-right">신고</th>
                <th className="px-4 py-4 text-center">관리</th>
              </tr>
            </thead>

            <tbody>
              {postsLoading ? (
                <LoadingTableRow colSpan={11} text="게시글 목록을 불러오는 중입니다." />
              ) : posts.length > 0 ? (
                posts.map((post) => {
                  const postCategory = normalizeCategory(post.category);
                  const imageCount = Number(post.imageCount || 0);
                  const fileCount = Number(post.fileCount || 0);
                  const hasAttach = imageCount + fileCount > 0;
                  const reportCount = Number(post.reportCount || 0);
                  const pendingCount = Number(post.pendingReportCount || 0);
                  const isChecked = selectedPostIds.includes(post.postId);
                  const isOpening = openingPostId === post.postId;

                  return (
                    <tr
                      key={post.postId}
                      onClick={() => handleOpenDetail(post.postId)}
                      className="cursor-pointer border-b border-gray-50 text-sm transition hover:bg-purple-50/40"
                    >
                      <td className="px-4 py-4 text-center align-middle">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onClick={(event) => event.stopPropagation()}
                          onChange={() => handleTogglePost(post.postId)}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                      </td>

                      <td className="px-4 py-4 text-center align-middle text-xs font-black text-gray-500">
                        {getPostCode(post)}
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <p className="line-clamp-2 break-keep text-sm font-black leading-5 text-gray-800">
                          {post.title}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <StatusBadge
                          className={
                            categoryClass[postCategory] ||
                            'bg-gray-100 text-gray-500'
                          }
                        >
                          {CATEGORY_LABELS[postCategory] || post.category}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="truncate font-black text-gray-700">
                          {post.author}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="text-xs font-bold leading-5 text-gray-600">
                          {post.createdAt}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-right align-middle font-bold text-gray-600">
                        {formatNumber(post.views)}
                      </td>

                      <td className="px-4 py-4 text-right align-middle font-bold text-gray-600">
                        {formatNumber(post.comments)}
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        {hasAttach ? (
                          <div className="flex items-center justify-center gap-1">
                            {imageCount > 0 && (
                              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-purple-50 px-2 text-xs font-black text-[#6d3df2]">
                                <ImageIcon size={13} />
                                {imageCount}
                              </span>
                            )}
                            {fileCount > 0 && (
                              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-yellow-50 px-2 text-xs font-black text-yellow-600">
                                <Paperclip size={13} />
                                {fileCount}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-300">
                            없음
                          </span>
                        )}
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
                        </div>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title="게시글 보기"
                            disabled={isOpening}
                            onClick={(event) => {
                              event.stopPropagation();
                              handleOpenDetail(post.postId);
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
                              handleDeletePost(post.postId);
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
                  <td colSpan={11} className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
                      <FileText size={24} />
                    </div>
                    <p className="mt-4 text-sm font-black text-gray-700">
                      조회된 게시글이 없습니다.
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
            page={postPage}
            totalPages={postTotalPages}
            onChange={setPostPage}
            disabled={postsLoading}
          />
        </div>
      </section>
    </div>
  );
};

const Pagination = ({ page, totalPages, onChange, disabled = false }) => {
  const visiblePages = useMemo(() => {
    const pageCount = Math.max(Number(totalPages || 1), 1);
    const maxVisible = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(pageCount, startPage + maxVisible - 1);

    startPage = Math.max(1, endPage - maxVisible + 1);

    return Array.from(
      { length: endPage - startPage + 1 },
      (_, index) => startPage + index
    );
  }, [page, totalPages]);

  const handlePrev = () => {
    if (disabled || page <= 1) return;
    onChange(page - 1);
  };

  const handleNext = () => {
    if (disabled || page >= totalPages) return;
    onChange(page + 1);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={handlePrev}
        disabled={disabled || page <= 1}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          disabled || page <= 1
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
            pageNumber === page
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
        disabled={disabled || page >= totalPages}
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
          disabled || page >= totalPages
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
        {loading ? <Loader2 size={22} className="animate-spin" /> : <Icon size={24} />}
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

const LoadingTableRow = ({ colSpan, text }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="px-5 py-14 text-center">
        <Loader2 size={26} className="mx-auto animate-spin text-[#6d3df2]" />
        <p className="mt-3 text-sm font-black text-gray-600">{text}</p>
      </td>
    </tr>
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

const StatusBadge = ({ children, className }) => {
  return (
    <span
      className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
};

export default PostManagementPage;
