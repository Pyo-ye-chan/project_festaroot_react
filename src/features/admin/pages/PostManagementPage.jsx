import React, { useMemo, useState } from 'react';
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
} from 'lucide-react';
import PostDetailView from '../components/PostDetailView';

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '후기',
  tip: '꿀팁',
  notice: '공지',
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

const dummyPosts = [
  {
    postId: 1,
    title: '남산 봄축제에서 찍은 야경 사진 공유해요 🌸',
    category: 'review',
    author: 'user_2048',
    createdAt: '2026.06.17 14:32',
    views: 1262,
    comments: 12,
    imageCount: 3,
    fileCount: 1,
    adminMemo: '',
    content:
      '남산 봄축제 다녀왔는데 야경이 정말 예뻤어요. 다만 일부 구간이 너무 혼잡해서 이동 동선 안내가 조금 더 있었으면 좋겠습니다.',
    reportItems: [
      {
        reportId: 101,
        reporterMemberId: 'user_1201',
        reason: '불쾌한 표현',
        createdAt: '2026.06.17 15:02',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
      {
        reportId: 102,
        reporterMemberId: 'user_8814',
        reason: '분쟁 유도',
        createdAt: '2026.06.17 15:21',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
    ],
    attachments: [
      { type: 'image', name: 'namsan-night-01.jpg' },
      { type: 'image', name: 'namsan-night-02.jpg' },
      { type: 'image', name: 'namsan-night-03.jpg' },
      { type: 'file', name: 'festival-info.pdf' },
    ],
  },
  {
    postId: 2,
    title: '비 오는 날 먹거리 축제 추천 부탁드려요!',
    category: 'free',
    author: 'user_5531',
    createdAt: '2026.06.17 13:15',
    views: 845,
    comments: 8,
    imageCount: 0,
    fileCount: 0,
    adminMemo: '',
    content:
      '이번 주말에 비가 온다고 해서 실내나 먹거리 위주로 즐길 수 있는 축제를 찾고 있습니다. 추천 부탁드려요.',
    reportItems: [],
    attachments: [],
  },
  {
    postId: 3,
    title: '퍼레이드 시간 변경됐나요?',
    category: 'free',
    author: 'user_3539',
    createdAt: '2026.06.17 10:47',
    views: 312,
    comments: 3,
    imageCount: 1,
    fileCount: 0,
    adminMemo: '',
    content:
      '공식 안내랑 현장 안내 시간이 달라서 헷갈립니다. 혹시 퍼레이드 시간 변경된 건지 아시는 분 있나요?',
    reportItems: [
      {
        reportId: 103,
        reporterMemberId: 'user_5512',
        reason: '중복 게시글',
        createdAt: '2026.06.17 11:10',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
    ],
    attachments: [{ type: 'image', name: 'parade-schedule.jpg' }],
  },
  {
    postId: 4,
    title: '음식 바가지 요금 너무 심하네요. 사진 첨부합니다.',
    category: 'review',
    author: 'user_9182',
    createdAt: '2026.06.16 09:22',
    views: 2104,
    comments: 33,
    imageCount: 4,
    fileCount: 0,
    adminMemo: '',
    content:
      '축제 자체는 좋았는데 일부 음식 가격이 너무 비싸게 느껴졌습니다. 현장 가격표와 실제 결제 금액이 달라서 확인이 필요해 보입니다.',
    reportItems: [
      {
        reportId: 104,
        reporterMemberId: 'user_1820',
        reason: '분쟁 유도',
        createdAt: '2026.06.16 10:02',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
      {
        reportId: 105,
        reporterMemberId: 'user_7261',
        reason: '과격한 표현',
        createdAt: '2026.06.16 10:35',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
      {
        reportId: 106,
        reporterMemberId: 'user_9004',
        reason: '허위 정보 의심',
        createdAt: '2026.06.16 11:11',
        status: 'WAITING',
        adminMemo: '',
        processedAt: '',
      },
    ],
    attachments: [
      { type: 'image', name: 'food-price-01.jpg' },
      { type: 'image', name: 'food-price-02.jpg' },
      { type: 'image', name: 'receipt.jpg' },
      { type: 'image', name: 'menu-board.jpg' },
    ],
  },
  {
    postId: 5,
    title: '아이와 함께 즐길 수 있는 체험 추천해요',
    category: 'tip',
    author: 'user_7841',
    createdAt: '2026.06.16 21:03',
    views: 689,
    comments: 7,
    imageCount: 2,
    fileCount: 1,
    adminMemo: '',
    content:
      '아이와 함께 가기 좋은 체험 부스 위주로 정리해봤습니다. 대기 시간이 짧은 곳부터 가는 걸 추천해요.',
    reportItems: [],
    attachments: [
      { type: 'image', name: 'kids-experience-01.jpg' },
      { type: 'image', name: 'kids-experience-02.jpg' },
      { type: 'file', name: 'experience-map.pdf' },
    ],
  },
  {
    postId: 6,
    title: '운영진 답변 좀 부탁드립니다',
    category: 'free',
    author: 'user_4472',
    createdAt: '2026.06.16 20:33',
    views: 421,
    comments: 18,
    imageCount: 0,
    fileCount: 1,
    adminMemo: '반복성 표현이 있으나 게시글 삭제까지는 필요하지 않아 신고 인정만 처리함.',
    content:
      '며칠 전부터 같은 문제가 반복되고 있는데 답변이 없어서 문의드립니다. 확인 부탁드립니다.',
    reportItems: [
      {
        reportId: 107,
        reporterMemberId: 'user_3150',
        reason: '반복 게시글',
        createdAt: '2026.06.16 21:01',
        status: 'ACCEPTED',
        adminMemo: '반복성 표현이 있어 신고 인정 처리함.',
        processedAt: '2026.06.17 09:40',
      },
      {
        reportId: 108,
        reporterMemberId: 'user_7711',
        reason: '운영진 호출',
        createdAt: '2026.06.16 21:04',
        status: 'REJECTED',
        adminMemo: '운영진 호출만으로는 제재 사유가 부족함.',
        processedAt: '2026.06.17 09:40',
      },
    ],
    attachments: [{ type: 'file', name: 'issue-detail.txt' }],
  },
  {
    postId: 7,
    title: '축제로 서비스 점검 안내',
    category: 'notice',
    author: '관리자',
    createdAt: '2026.06.15 18:00',
    views: 1804,
    comments: 4,
    imageCount: 0,
    fileCount: 0,
    adminMemo: '',
    content:
      '축제로 서비스 안정화를 위한 점검이 예정되어 있습니다. 점검 시간 동안 일부 기능 이용이 제한될 수 있습니다.',
    reportItems: [],
    attachments: [],
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

const getPostCode = (post) => `POST-${String(post.postId).padStart(3, '0')}`;

const normalizeCategory = (category) => String(category || '').toLowerCase();

const getReportCount = (post) => Number(post.reportItems?.length || 0);

const getPendingReportCount = (post) =>
  Number(post.reportItems?.filter((report) => report.status === 'WAITING').length || 0);

const getSearchPlaceholder = (searchType) => {
  if (searchType === 'author') return '작성자 ID를 입력하세요';
  if (searchType === 'id') return '게시글 ID를 입력하세요';
  return '게시글 제목을 입력하세요';
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

const PostManagementPage = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [keywordInput, setKeywordInput] = useState('');
  const [keyword, setKeyword] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [category, setCategory] = useState('all');
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [reportPage, setReportPage] = useState(1);
  const [postPage, setPostPage] = useState(1);

  const selectedPost = useMemo(() => {
    if (!selectedPostId) return null;
    return posts.find((post) => post.postId === selectedPostId) || null;
  }, [posts, selectedPostId]);

  const filteredPosts = useMemo(() => {
    const lowerKeyword = keyword.trim().toLowerCase();

    return posts.filter((post) => {
      const postCategory = normalizeCategory(post.category);
      const keywordTarget = {
        title: post.title,
        author: post.author,
        id: getPostCode(post),
      }[searchType];

      const keywordMatch =
        !lowerKeyword || String(keywordTarget || '').toLowerCase().includes(lowerKeyword);
      const categoryMatch = category === 'all' || postCategory === category;

      return keywordMatch && categoryMatch;
    });
  }, [posts, keyword, searchType, category]);

  const waitingReportRows = useMemo(() => {
    return posts
      .flatMap((post) =>
        (post.reportItems || [])
          .filter((report) => report.status === 'WAITING')
          .map((report) => ({
            post,
            report,
          }))
      )
      .sort((a, b) => Number(b.report.reportId || 0) - Number(a.report.reportId || 0));
  }, [posts]);

  const reportTotalPages = Math.max(1, Math.ceil(waitingReportRows.length / REPORT_PAGE_SIZE));
  const safeReportPage = Math.min(reportPage, reportTotalPages);

  const pagedWaitingReportRows = useMemo(() => {
    const startIndex = (safeReportPage - 1) * REPORT_PAGE_SIZE;
    return waitingReportRows.slice(startIndex, startIndex + REPORT_PAGE_SIZE);
  }, [waitingReportRows, safeReportPage]);

  const postTotalPages = Math.max(1, Math.ceil(filteredPosts.length / POST_PAGE_SIZE));
  const safePostPage = Math.min(postPage, postTotalPages);

  const pagedPosts = useMemo(() => {
    const startIndex = (safePostPage - 1) * POST_PAGE_SIZE;
    return filteredPosts.slice(startIndex, startIndex + POST_PAGE_SIZE);
  }, [filteredPosts, safePostPage]);

  const stats = useMemo(() => {
    const todayKey = getTodayKey();
    const reportedPostCount = posts.filter((post) => getReportCount(post) > 0).length;
    const pendingReportCount = posts.reduce(
      (total, post) => total + getPendingReportCount(post),
      0
    );

    return {
      total: posts.length,
      today: posts.filter((post) => post.createdAt.startsWith(todayKey)).length,
      reportedPostCount,
      pendingReportCount,
    };
  }, [posts]);

  const isAllChecked =
    pagedPosts.length > 0 &&
    pagedPosts.every((post) => selectedPostIds.includes(post.postId));

  const handleSearch = () => {
    setKeyword(keywordInput.trim());
    setSelectedPostIds([]);
    setPostPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleReset = () => {
    setKeywordInput('');
    setKeyword('');
    setSearchType('title');
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
    setPostPage(1);
  };

  const handleOpenDetail = (postId) => {
    setSelectedPostId(postId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setSelectedPostId(null);
  };

  const handleToggleAll = () => {
    const currentPageIds = pagedPosts.map((post) => post.postId);

    if (isAllChecked) {
      setSelectedPostIds((prev) => prev.filter((id) => !currentPageIds.includes(id)));
      return;
    }

    setSelectedPostIds((prev) => Array.from(new Set([...prev, ...currentPageIds])));
  };

  const handleTogglePost = (postId) => {
    setSelectedPostIds((prev) => {
      if (prev.includes(postId)) return prev.filter((id) => id !== postId);
      return [...prev, postId];
    });
  };

  const handleDeletePost = (postId) => {
    const target = posts.find((post) => post.postId === postId);
    if (!target) return;

    const isConfirmed = window.confirm(
      `게시글과 첨부 이미지/파일이 모두 삭제됩니다.\n\n제목: ${target.title}\n\n정말 완전 삭제할까요?`
    );

    if (!isConfirmed) return;

    setPosts((prev) => prev.filter((post) => post.postId !== postId));
    setSelectedPostIds((prev) => prev.filter((id) => id !== postId));

    if (selectedPostId === postId) setSelectedPostId(null);
  };

  const handleDeleteSelectedPosts = () => {
    if (selectedPostIds.length === 0) return;

    const isConfirmed = window.confirm(
      `선택한 게시글 ${selectedPostIds.length}건을 완전 삭제할까요?\n\n게시글, 댓글, 신고 기록, 첨부 이미지/파일이 함께 삭제됩니다.`
    );

    if (!isConfirmed) return;

    setPosts((prev) => prev.filter((post) => !selectedPostIds.includes(post.postId)));
    setSelectedPostIds([]);
  };

  const handleSaveMemo = (postId, adminMemo) => {
    setPosts((prev) =>
      prev.map((post) => (post.postId === postId ? { ...post, adminMemo } : post))
    );

    window.alert('관리자 메모가 임시 저장되었습니다.');
  };

  const handleProcessReports = ({ postId, reportId, resultStatus, adminMemo }) => {
    const target = posts.find((post) => post.postId === postId);

    if (!target) return;

    const targetReport = target.reportItems?.find(
      (report) => report.reportId === reportId
    );

    if (!targetReport) {
      window.alert('신고 내역을 찾을 수 없습니다.');
      return;
    }

    if (targetReport.status !== 'WAITING') {
      window.alert('이미 처리된 신고입니다.');
      return;
    }

    const resultLabel = REPORT_RESULT_LABELS[resultStatus] || resultStatus;

    const isConfirmed = window.confirm(
      `신고 ${`RPT-${String(reportId).padStart(5, '0')}`}을(를) '${resultLabel}' 처리할까요?\n\n게시글 자체 숨김 처리는 하지 않고, 해당 신고 내역만 처리됩니다.`
    );

    if (!isConfirmed) return;

    const processedAt = getNowText();

    setPosts((prev) =>
      prev.map((post) => {
        if (post.postId !== postId) return post;

        return {
          ...post,
          reportItems: (post.reportItems || []).map((report) => {
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

  if (selectedPost) {
    return (
      <PostDetailView
        post={selectedPost}
        onBack={handleBackToList}
        onDelete={handleDeletePost}
        onSaveMemo={handleSaveMemo}
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
          게시글 원문과 첨부 자료를 확인하고, 접수된 신고는 관리자 메모와 함께 인정 또는 반려 처리합니다.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={FileText}
          title="전체 게시글"
          value={stats.total}
          unit="건"
          description="커뮤니티 전체 게시글"
          iconClass="bg-purple-50 text-[#6d3df2]"
        />

        <SummaryCard
          icon={CalendarDays}
          title="오늘 작성"
          value={stats.today}
          unit="건"
          description="오늘 새로 등록된 게시글"
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          icon={ShieldAlert}
          title="신고 게시글"
          value={stats.reportedPostCount}
          unit="건"
          description="신고가 1회 이상 접수된 게시글"
          iconClass="bg-red-50 text-red-500"
        />

        <SummaryCard
          icon={ClipboardCheck}
          title="처리 대기 신고"
          value={stats.pendingReportCount}
          unit="건"
          description="POST_REPORT.STATUS = WAITING"
          iconClass="bg-yellow-50 text-yellow-600"
        />
      </section>

      <section className="overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-red-50 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-black text-gray-900">신고 접수 게시글</h2>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50 px-3 text-xs font-black text-red-500">
                {formatNumber(waitingReportRows.length)}건
              </span>
              <span className="inline-flex h-7 items-center rounded-full bg-red-50/70 px-3 text-xs font-black text-red-500">
                우선 확인
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              접수된 신고 단위로 원문 확인과 처리 화면으로 이동합니다.
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
              {pagedWaitingReportRows.length > 0 ? (
                pagedWaitingReportRows.map(({ post, report }) => (
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
                        onClick={() => handleOpenDetail(post.postId)}
                        className="block w-full text-left"
                      >
                        <p className="line-clamp-1 break-keep text-sm font-black text-gray-800">
                          {post.title}
                        </p>
                        <p className="mt-1 text-xs font-semibold text-gray-400">
                          {getPostCode(post)} · {CATEGORY_LABELS[normalizeCategory(post.category)] || post.category}
                        </p>
                      </button>
                    </td>
                    <td className="px-4 py-4 text-center align-middle font-bold text-gray-600">
                      {report.reporterMemberId}
                    </td>
                    <td className="px-4 py-4 text-center align-middle font-black text-red-500">
                      {formatNumber(getReportCount(post))}
                    </td>
                    <td className="px-4 py-4 text-center align-middle">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(post.postId)}
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
            page={safeReportPage}
            totalPages={reportTotalPages}
            onChange={setReportPage}
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
            <label className="mb-2 block text-xs font-black text-gray-500">검색어</label>
            <div className="flex gap-2">
              <div className="relative min-w-0 flex-1">
                <Search
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
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
              <h2 className="text-lg font-black text-gray-900">게시글 목록</h2>
              <span className="inline-flex h-7 items-center rounded-full bg-purple-50 px-3 text-xs font-black text-[#6d3df2]">
                {formatNumber(filteredPosts.length)}개
              </span>
            </div>
            <p className="mt-1 text-xs font-bold text-gray-400">
              검색 조건에 맞는 게시글을 페이지 단위로 확인합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeleteSelectedPosts}
            disabled={selectedPostIds.length === 0}
            className={`inline-flex h-10 w-fit items-center gap-2 rounded-xl px-4 text-sm font-black transition ${selectedPostIds.length === 0
                ? 'cursor-not-allowed border border-gray-100 bg-gray-50 text-gray-300'
                : 'border border-red-100 bg-red-50 text-red-500 hover:bg-red-100'
              }`}
          >
            <Trash2 size={16} />
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
              {pagedPosts.length > 0 ? (
                pagedPosts.map((post) => {
                  const postCategory = normalizeCategory(post.category);
                  const imageCount = Number(post.imageCount || 0);
                  const fileCount = Number(post.fileCount || 0);
                  const hasAttach = imageCount + fileCount > 0;
                  const reportCount = getReportCount(post);
                  const pendingCount = getPendingReportCount(post);
                  const isChecked = selectedPostIds.includes(post.postId);

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
                          onClick={(e) => e.stopPropagation()}
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
                        <StatusBadge className={categoryClass[postCategory] || 'bg-gray-100 text-gray-500'}>
                          {CATEGORY_LABELS[postCategory] || post.category}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="truncate font-black text-gray-700">{post.author}</p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <p className="text-xs font-bold leading-5 text-gray-600">{post.createdAt}</p>
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
                          <span className="text-xs font-bold text-gray-300">없음</span>
                        )}
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
                            title="게시글 보기"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDetail(post.postId);
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
                              handleDeletePost(post.postId);
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
            page={safePostPage}
            totalPages={postTotalPages}
            onChange={setPostPage}
          />
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
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${page <= 1
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
          className={`flex h-9 min-w-9 items-center justify-center rounded-xl px-3 text-sm font-black transition ${pageNumber === page
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
        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${page >= totalPages
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
    <span className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ${className}`}>
      <span className="truncate">{children}</span>
    </span>
  );
};

export default PostManagementPage;
