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
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Megaphone,
} from 'lucide-react';

const CATEGORY_LABELS = {
  all: '전체',
  free: '자유',
  review: '후기',
  tip: '꿀팁',
  notice: '공지',
};

const dummyPosts = [
  {
    id: 'POST-001',
    title: '남산 봄축제에서 찍은 야경 사진 공유해요 🌸',
    category: 'review',
    author: 'user_2048',
    createdAt: '2026.06.16 14:32',
    views: 1262,
    comments: 12,
    reports: 2,
    imageCount: 3,
    fileCount: 1,
    status: '정상',
  },
  {
    id: 'POST-002',
    title: '비 오는 날 먹거리 축제 추천 부탁드려요!',
    category: 'free',
    author: 'user_5531',
    createdAt: '2026.06.16 13:15',
    views: 845,
    comments: 8,
    reports: 0,
    imageCount: 0,
    fileCount: 0,
    status: '정상',
  },
  {
    id: 'POST-003',
    title: '퍼레이드 시간 변경됐나요?',
    category: 'free',
    author: 'user_3539',
    createdAt: '2026.06.16 10:47',
    views: 312,
    comments: 3,
    reports: 1,
    imageCount: 1,
    fileCount: 0,
    status: '검토 중',
  },
  {
    id: 'POST-004',
    title: '음식 바가지 요금 너무 심하네요. 사진 첨부합니다.',
    category: 'review',
    author: 'user_9182',
    createdAt: '2026.06.16 09:22',
    views: 2104,
    comments: 33,
    reports: 5,
    imageCount: 4,
    fileCount: 0,
    status: '신고 접수',
  },
  {
    id: 'POST-005',
    title: '아이와 함께 즐길 수 있는 체험 추천해요',
    category: 'tip',
    author: 'user_7841',
    createdAt: '2026.06.15 21:03',
    views: 689,
    comments: 7,
    reports: 0,
    imageCount: 2,
    fileCount: 1,
    status: '정상',
  },
  {
    id: 'POST-006',
    title: '운영진 답변 좀 부탁드립니다',
    category: 'free',
    author: 'user_4472',
    createdAt: '2026.06.15 20:33',
    views: 421,
    comments: 18,
    reports: 2,
    imageCount: 0,
    fileCount: 1,
    status: '검토 중',
  },
  {
    id: 'POST-007',
    title: '축제로 서비스 점검 안내',
    category: 'notice',
    author: '관리자',
    createdAt: '2026.06.15 18:00',
    views: 1804,
    comments: 4,
    reports: 0,
    imageCount: 0,
    fileCount: 0,
    status: '정상',
  },
];

const reportedPosts = [
  {
    id: 'POST-004',
    title: '음식 바가지 요금 너무 심하네요. 사진 첨부합니다.',
    author: 'user_9182',
    reports: 5,
    reason: '욕설/비하',
  },
  {
    id: 'POST-009',
    title: '특정 가수 팬들 싸움 그만하자',
    author: 'user_6621',
    reports: 3,
    reason: '분쟁 유도',
  },
  {
    id: 'POST-001',
    title: '남산 봄축제에서 찍은 야경 사진 공유해요 🌸',
    author: 'user_2048',
    reports: 2,
    reason: '기타',
  },
];

const statusClass = {
  정상: 'bg-emerald-50 text-emerald-600',
  '검토 중': 'bg-blue-50 text-blue-600',
  '신고 접수': 'bg-orange-50 text-orange-600',
  숨김: 'bg-gray-100 text-gray-500',
  삭제: 'bg-red-50 text-red-500',
};

const categoryClass = {
  free: 'bg-slate-100 text-slate-600',
  review: 'bg-purple-50 text-purple-600',
  tip: 'bg-amber-50 text-amber-600',
  notice: 'bg-blue-50 text-blue-600',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const PostManagementPage = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('all');
  const [attachFilter, setAttachFilter] = useState('전체');
  const [reportFilter, setReportFilter] = useState('전체');

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const attachCount = Number(post.imageCount || 0) + Number(post.fileCount || 0);
      const lowerKeyword = keyword.trim().toLowerCase();

      const keywordMatch =
        !lowerKeyword ||
        post.title.toLowerCase().includes(lowerKeyword) ||
        post.author.toLowerCase().includes(lowerKeyword) ||
        post.id.toLowerCase().includes(lowerKeyword);

      const categoryMatch = category === 'all' || post.category === category;

      const attachMatch =
        attachFilter === '전체' ||
        (attachFilter === '첨부 있음' && attachCount > 0) ||
        (attachFilter === '첨부 없음' && attachCount === 0);

      const reportMatch =
        reportFilter === '전체' ||
        (reportFilter === '신고 있음' && Number(post.reports || 0) > 0) ||
        (reportFilter === '신고 없음' && Number(post.reports || 0) === 0);

      return keywordMatch && categoryMatch && attachMatch && reportMatch;
    });
  }, [posts, keyword, category, attachFilter, reportFilter]);

  const stats = useMemo(() => {
    return {
      total: posts.length,
      today: posts.filter((post) => post.createdAt.startsWith('2026.06.16')).length,
      attached: posts.filter(
        (post) => Number(post.imageCount || 0) + Number(post.fileCount || 0) > 0
      ).length,
      reported: posts.filter((post) => Number(post.reports || 0) > 0).length,
    };
  }, [posts]);

  const handleReset = () => {
    setKeyword('');
    setCategory('all');
    setAttachFilter('전체');
    setReportFilter('전체');
  };

  const handleDeletePost = (postId) => {
    const target = posts.find((post) => post.id === postId);

    if (!target) return;

    const isConfirmed = window.confirm(
      `게시글과 첨부 이미지/파일이 모두 삭제됩니다.\n\n제목: ${target.title}\n\n정말 완전 삭제할까요?`
    );

    if (!isConfirmed) return;

    setPosts((prev) => prev.filter((post) => post.id !== postId));
  };

  return (
    <div className="space-y-6">
      {/* 상단 제목 영역 */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-black text-[#6d3df2]">
              <span>FestaRoute Admin</span>
              <span>&gt;</span>
              <span>Post Management</span>
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
              게시글 관리
            </h1>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">
            커뮤니티 게시글, 신고 수, 댓글 수, 첨부 이미지와 파일을 확인하고 삭제 처리합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
          >
            <CalendarDays size={17} />
            2026.06.16
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-[#6d3df2] px-4 py-3 text-sm font-black text-white shadow-lg shadow-purple-100 transition hover:-translate-y-0.5"
          >
            <RefreshCw size={17} />
            새로고침
          </button>
        </div>
      </section>

      {/* Notice Banner */}
      <section className="mb-5 rounded-[28px] border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-amber-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
              <FileText size={24} />
            </div>

            <div>
              <h2 className="text-base font-black text-purple-700">
                게시글 삭제 시 첨부 이미지와 파일까지 함께 정리해주세요.
              </h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                축제로는 게시글에 이미지와 첨부파일이 있으므로 단순 상태 변경보다 완전 삭제 흐름이 적합합니다.
              </p>
            </div>
          </div>

          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-purple-600 px-5 text-sm font-black text-white shadow-lg shadow-purple-200 transition hover:bg-purple-700">
            <Megaphone size={17} />
            공지 작성하기
          </button>
        </div>
      </section>

      {/* 요약 카드 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={FileText}
          title="전체 게시글"
          value={stats.total}
          unit="건"
          change="전체 커뮤니티 게시글"
          iconClass="bg-purple-50 text-[#6d3df2]"
        />
        <SummaryCard
          icon={CalendarDays}
          title="오늘 작성"
          value={stats.today}
          unit="건"
          change="오늘 새로 등록"
          iconClass="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          icon={Paperclip}
          title="첨부 포함"
          value={stats.attached}
          unit="건"
          change="이미지 또는 파일 포함"
          iconClass="bg-yellow-50 text-yellow-600"
        />
        <SummaryCard
          icon={ShieldAlert}
          title="신고 접수"
          value={stats.reported}
          unit="건"
          change="신고 1회 이상"
          iconClass="bg-red-50 text-red-500"
        />
      </section>

      {/* 검색 및 필터 */}
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">게시글 검색</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              제목, 작성자, 게시글 ID와 운영 조건으로 목록을 좁혀 확인합니다.
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

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <label className="mb-2 block text-xs font-black text-gray-500">
              검색어
            </label>
            <div className="relative">
              <Search
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="게시글 제목, 작성자, 게시글 ID 검색"
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50"
              />
            </div>
          </div>

          <FilterSelect
            label="카테고리"
            value={category}
            onChange={setCategory}
            options={Object.entries(CATEGORY_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />

          <FilterSelect
            label="첨부 여부"
            value={attachFilter}
            onChange={setAttachFilter}
            options={[
              { value: '전체', label: '전체' },
              { value: '첨부 있음', label: '첨부 있음' },
              { value: '첨부 없음', label: '첨부 없음' },
            ]}
          />

          <FilterSelect
            label="신고 여부"
            value={reportFilter}
            onChange={setReportFilter}
            options={[
              { value: '전체', label: '전체' },
              { value: '신고 있음', label: '신고 있음' },
              { value: '신고 없음', label: '신고 없음' },
            ]}
          />
        </div>
      </section>

      {/* 게시글 목록 */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">게시글 목록</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              총 <span className="text-[#6d3df2]">{filteredPosts.length}</span>개 게시글이 조회되었습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-600 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
            >
              <Eye size={16} />
              선택 보기
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-black text-red-500 transition hover:bg-red-100"
            >
              <Trash2 size={16} />
              선택 삭제
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] table-fixed text-left">
            <colgroup>
              <col className="w-[52px]" />
              <col className="w-[340px]" />
              <col className="w-[105px]" />
              <col className="w-[130px]" />
              <col className="w-[145px]" />
              <col className="w-[80px]" />
              <col className="w-[80px]" />
              <col className="w-[115px]" />
              <col className="w-[80px]" />
              <col className="w-[105px]" />
              <col className="w-[135px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-black text-gray-500">
                <th className="px-4 py-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-4">게시글 제목</th>
                <th className="px-4 py-4 text-center">카테고리</th>
                <th className="px-4 py-4">작성자</th>
                <th className="px-4 py-4 text-center">작성일</th>
                <th className="px-4 py-4 text-right">조회</th>
                <th className="px-4 py-4 text-right">댓글</th>
                <th className="px-4 py-4 text-center">첨부</th>
                <th className="px-4 py-4 text-right">신고</th>
                <th className="px-4 py-4 text-center">상태</th>
                <th className="px-4 py-4 text-center">관리</th>
              </tr>
            </thead>

            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => {
                  const hasAttach =
                    Number(post.imageCount || 0) + Number(post.fileCount || 0) > 0;

                  return (
                    <tr
                      key={post.id}
                      className="border-b border-gray-50 text-sm transition hover:bg-purple-50/40"
                    >
                      <td className="px-4 py-4 align-middle">
                        <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <p className="line-clamp-2 break-keep text-sm font-black leading-5 text-gray-800">
                          {post.title}
                        </p>
                        <p className="mt-1 truncate text-xs font-semibold text-gray-400">
                          {post.id}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <StatusBadge className={categoryClass[post.category] || 'bg-gray-100 text-gray-500'}>
                          {CATEGORY_LABELS[post.category] || post.category}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <p className="truncate font-black text-gray-700">{post.author}</p>
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
                            {Number(post.imageCount || 0) > 0 && (
                              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-purple-50 px-2 text-xs font-black text-[#6d3df2]">
                                <ImageIcon size={13} />
                                {post.imageCount}
                              </span>
                            )}
                            {Number(post.fileCount || 0) > 0 && (
                              <span className="inline-flex h-7 items-center gap-1 rounded-full bg-yellow-50 px-2 text-xs font-black text-yellow-600">
                                <Paperclip size={13} />
                                {post.fileCount}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-gray-300">없음</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right align-middle">
                        <span
                          className={`font-black ${
                            post.reports > 0 ? 'text-red-500' : 'text-gray-400'
                          }`}
                        >
                          {post.reports}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-center align-middle">
                        <StatusBadge className={statusClass[post.status] || 'bg-gray-100 text-gray-500'}>
                          {post.status}
                        </StatusBadge>
                      </td>

                      <td className="px-4 py-4 align-middle">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title="게시글 보기"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6d3df2] transition hover:bg-purple-50"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            title="완전 삭제"
                            onClick={() => handleDeletePost(post.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                          >
                            <Trash2 size={15} />
                          </button>

                          <button
                            type="button"
                            title="더보기"
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
                          >
                            <MoreHorizontal size={15} />
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

        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-bold text-gray-500">
            1-{filteredPosts.length} / 총 {filteredPosts.length}개
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#6d3df2] text-sm font-black text-white"
            >
              1
            </button>
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 transition hover:bg-gray-50"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>

      {/* 하단 운영 정보 */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <SectionHeader
            icon={ShieldAlert}
            iconClass="text-red-500"
            title="신고 접수 게시글"
            description="신고 수가 높은 게시글부터 확인하세요."
          />

          <div className="mt-5 space-y-3">
            {reportedPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-gray-800">
                    {post.title}
                  </p>
                  <p className="mt-1 text-xs font-bold text-gray-400">
                    {post.author} · {post.reason}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-red-500">
                    신고 {post.reports}건
                  </p>
                  <button type="button" className="mt-1 text-xs font-black text-[#6d3df2]">
                    확인
                  </button>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <SectionHeader
            icon={AlertTriangle}
            iconClass="text-yellow-500"
            title="게시글 운영 기준"
            description="축제로에서 실제 구현 가능한 관리 흐름입니다."
          />

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <FeatureItem
              icon={Search}
              title="게시글 검색/필터"
              desc="제목, 작성자, 카테고리, 첨부 여부, 신고 여부 기준으로 조회합니다."
            />
            <FeatureItem
              icon={Paperclip}
              title="첨부파일 확인"
              desc="이미지 개수와 파일 개수를 표시하고, 삭제 시 함께 정리합니다."
            />
            <FeatureItem
              icon={Trash2}
              title="완전 삭제"
              desc="게시글, 댓글, 좋아요, 신고 기록, 첨부 이미지와 파일을 함께 삭제합니다."
            />
            <FeatureItem
              icon={CheckCircle2}
              title="신고 확인"
              desc="신고 수가 있는 게시글을 우선 검토하고 필요 시 삭제합니다."
            />
          </div>
        </article>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, title, value, unit, change, iconClass }) => {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}>
          <Icon size={24} />
        </div>
      </div>

      <div className="mt-5">
        <p className="text-sm font-black text-gray-500">{title}</p>
        <div className="mt-2 flex items-end gap-1">
          <strong className="text-2xl font-black tracking-tight text-gray-950">
            {formatNumber(value)}
          </strong>
          <span className="pb-0.5 text-sm font-black text-gray-700">{unit}</span>
        </div>
        <p className="mt-2 truncate text-xs font-bold text-gray-400">{change}</p>
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
    <span
      className={`inline-flex h-7 max-w-full items-center justify-center rounded-full px-3 text-xs font-black ${className}`}
    >
      <span className="truncate">{children}</span>
    </span>
  );
};

const SectionHeader = ({ icon: Icon, iconClass, title, description }) => {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-lg font-black text-gray-900">{title}</h2>
        <p className="mt-1 text-xs font-bold text-gray-400">{description}</p>
      </div>
      <Icon size={22} className={iconClass} />
    </div>
  );
};

const FeatureItem = ({ icon: Icon, title, desc }) => {
  return (
    <div className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6d3df2] shadow-sm">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="font-black text-gray-800">{title}</p>
        <p className="mt-1 break-keep text-sm font-semibold leading-6 text-gray-500">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default PostManagementPage;
