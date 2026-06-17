import React, { useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  CalendarDays,
  MessageCircle,
  AlertTriangle,
  ShieldCheck,
  EyeOff,
  Trash2,
  CheckCircle2,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ban,
  FileText,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';

const dummyComments = [
  {
    id: 1,
    content: '올해 축제 라인업 진짜 대박이에요! 기대됩니다 🔥',
    postTitle: '서울빛초롱축제 2025 라인업 공개!',
    author: 'festival_love',
    type: '댓글',
    createdAt: '2026.06.16 14:32',
    reportCount: 3,
    reportReason: '광고/홍보',
    status: '신고 접수',
    authorStatus: '정상',
    depth: 0,
  },
  {
    id: 2,
    content: '저도 다녀왔는데 너무 좋았어요! 특히 야경이 최고였어요 😊',
    postTitle: '서울빛초롱축제 2025 라인업 공개!',
    author: 'sunny_day',
    type: '대댓글',
    createdAt: '2026.06.16 14:45',
    reportCount: 1,
    reportReason: '기타',
    status: '검토 중',
    authorStatus: '정상',
    depth: 1,
  },
  {
    id: 3,
    content: '맞아요! 사진도 정말 예쁘게 나왔어요 📸',
    postTitle: '서울빛초롱축제 2025 라인업 공개!',
    author: 'photo_king',
    type: '대댓글',
    createdAt: '2026.06.16 14:47',
    reportCount: 0,
    reportReason: '-',
    status: '정상',
    authorStatus: '정상',
    depth: 1,
  },
  {
    id: 4,
    content: '주차장 너무 협소해서 짜증났어요. 개선 좀 해주세요.',
    postTitle: '강남 미디어 아트 페스티벌 후기',
    author: 'angry_user',
    type: '댓글',
    createdAt: '2026.06.16 13:12',
    reportCount: 5,
    reportReason: '욕설/비하',
    status: '신고 접수',
    authorStatus: '경고',
    depth: 0,
  },
  {
    id: 5,
    content: '그건 좀 심한 표현 아닌가요? 서로 배려해요~',
    postTitle: '강남 미디어 아트 페스티벌 후기',
    author: 'kind_heart',
    type: '대댓글',
    createdAt: '2026.06.16 13:25',
    reportCount: 0,
    reportReason: '-',
    status: '정상',
    authorStatus: '정상',
    depth: 1,
  },
  {
    id: 6,
    content: '맞아요, 너무 과격한 표현은 자제해주세요.',
    postTitle: '강남 미디어 아트 페스티벌 후기',
    author: 'mod_festival',
    type: '대댓글',
    createdAt: '2026.06.16 13:28',
    reportCount: 0,
    reportReason: '-',
    status: '정상',
    authorStatus: '관리자',
    depth: 1,
  },
];

const recentRestrictions = [
  {
    id: 1,
    author: 'angry_user',
    type: '경고',
    period: '-',
    reason: '욕설/비하 반복',
    date: '2026.06.16 13:15',
    status: '활성',
  },
  {
    id: 2,
    author: 'spam_promo123',
    type: '게시글 작성 제한',
    period: '7일',
    reason: '광고/홍보 반복',
    date: '2026.06.16 11:40',
    status: '활성',
  },
  {
    id: 3,
    author: 'bad_commenter',
    type: '댓글 작성 제한',
    period: '3일',
    reason: '욕설/비하',
    date: '2026.06.16 09:22',
    status: '활성',
  },
];

const statusClass = {
  정상: 'bg-emerald-50 text-emerald-600',
  '검토 중': 'bg-blue-50 text-blue-600',
  '신고 접수': 'bg-orange-50 text-orange-600',
  숨김: 'bg-gray-100 text-gray-500',
  삭제: 'bg-red-50 text-red-500',
};

const authorStatusClass = {
  정상: 'bg-emerald-50 text-emerald-600',
  경고: 'bg-orange-50 text-orange-600',
  관리자: 'bg-purple-50 text-purple-600',
  정지: 'bg-red-50 text-red-500',
};

const typeClass = {
  댓글: 'bg-purple-50 text-purple-600',
  대댓글: 'bg-blue-50 text-blue-600',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const CommentManagementPage = () => {
  const [keyword, setKeyword] = useState('');
  const [type, setType] = useState('전체');
  const [reason, setReason] = useState('전체');
  const [status, setStatus] = useState('전체');

  const filteredComments = useMemo(() => {
    return dummyComments.filter((comment) => {
      const lowerKeyword = keyword.toLowerCase();
      const keywordMatch =
        comment.content.toLowerCase().includes(lowerKeyword) ||
        comment.postTitle.toLowerCase().includes(lowerKeyword) ||
        comment.author.toLowerCase().includes(lowerKeyword);

      const typeMatch = type === '전체' || comment.type === type;
      const reasonMatch = reason === '전체' || comment.reportReason === reason;
      const statusMatch = status === '전체' || comment.status === status;

      return keywordMatch && typeMatch && reasonMatch && statusMatch;
    });
  }, [keyword, type, reason, status]);

  const stats = useMemo(() => {
    const total = dummyComments.length;
    const reported = dummyComments.filter((comment) => comment.reportCount > 0).length;
    const replies = dummyComments.filter((comment) => comment.type === '대댓글').length;
    const restricted = recentRestrictions.length;

    return {
      total,
      reported,
      replyRate: total > 0 ? ((replies / total) * 100).toFixed(1) : '0.0',
      restricted,
    };
  }, []);

  const handleReset = () => {
    setKeyword('');
    setType('전체');
    setReason('전체');
    setStatus('전체');
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
              <span>Comment Management</span>
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
              댓글 관리
            </h1>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">
            신고된 댓글과 대댓글을 검토하고 숨김, 삭제, 작성자 제재를 처리합니다.
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

      {/* 안내 배너 */}
      <section className="rounded-3xl border border-purple-100 bg-gradient-to-r from-purple-50 via-white to-yellow-50 p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-[#6d3df2] shadow-sm">
              <MessageCircle size={24} />
            </div>

            <div>
              <h2 className="text-base font-black text-gray-900">
                건전한 커뮤니티 환경을 위해 신고 댓글을 확인해주세요.
              </h2>
              <p className="mt-1 break-keep text-sm font-medium leading-6 text-gray-500">
                축제로에서 실제 구현 가능한 범위는 신고 확인, 숨김 처리, 완전 삭제, 작성자 제재입니다.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="inline-flex w-fit items-center justify-center gap-2 rounded-2xl bg-[#6d3df2] px-5 py-3 text-sm font-black text-white shadow-lg shadow-purple-100 transition hover:-translate-y-0.5"
          >
            신고 접수 댓글 보기
            <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* 요약 카드 */}
      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={MessageCircle}
          title="전체 댓글"
          value={stats.total}
          unit="개"
          change="댓글/대댓글 전체"
          iconClass="bg-purple-50 text-[#6d3df2]"
        />
        <SummaryCard
          icon={AlertTriangle}
          title="신고 댓글"
          value={stats.reported}
          unit="개"
          change="신고 1회 이상"
          iconClass="bg-red-50 text-red-500"
        />
        <SummaryCard
          icon={MessageCircle}
          title="대댓글 비율"
          value={stats.replyRate}
          unit="%"
          change="전체 댓글 기준"
          iconClass="bg-yellow-50 text-yellow-600"
        />
        <SummaryCard
          icon={ShieldCheck}
          title="최근 제재"
          value={stats.restricted}
          unit="건"
          change="경고/작성 제한"
          iconClass="bg-emerald-50 text-emerald-600"
        />
      </section>

      {/* 필터 */}
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">댓글 검색</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              댓글 유형, 신고 사유, 처리 상태와 키워드로 댓글을 조회합니다.
            </p>
          </div>

          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-600 transition hover:bg-gray-50"
          >
            <RotateCcw size={17} />
            초기화
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1fr_1fr_1.5fr]">
          <FilterSelect
            label="댓글 유형"
            value={type}
            onChange={setType}
            options={['전체', '댓글', '대댓글']}
          />

          <FilterSelect
            label="신고 사유"
            value={reason}
            onChange={setReason}
            options={['전체', '욕설/비하', '광고/홍보', '스팸', '음란물', '기타']}
          />

          <FilterSelect
            label="처리 상태"
            value={status}
            onChange={setStatus}
            options={['전체', '정상', '검토 중', '신고 접수', '숨김', '삭제']}
          />

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
                placeholder="댓글 내용, 게시글 제목, 작성자 검색"
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 댓글 목록 */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">댓글 목록</h2>
            <p className="mt-1 text-sm font-medium text-gray-500">
              총 <span className="font-black text-[#6d3df2]">{filteredComments.length}</span>개 조회됨
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-600 transition hover:bg-gray-50"
            >
              <EyeOff size={16} />
              선택 숨김
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
          <table className="w-full min-w-[1120px] table-fixed">
            <colgroup>
              <col className="w-[48px]" />
              <col className="w-[360px]" />
              <col className="w-[230px]" />
              <col className="w-[130px]" />
              <col className="w-[90px]" />
              <col className="w-[145px]" />
              <col className="w-[80px]" />
              <col className="w-[105px]" />
              <col className="w-[105px]" />
              <col className="w-[140px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-black text-gray-500">
                <th className="px-4 py-4 text-left">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-4 text-left">댓글 내용</th>
                <th className="px-4 py-4 text-left">게시글 제목</th>
                <th className="px-4 py-4 text-left">작성자</th>
                <th className="px-4 py-4 text-center">유형</th>
                <th className="px-4 py-4 text-center">작성일</th>
                <th className="px-4 py-4 text-center">신고</th>
                <th className="px-4 py-4 text-center">처리 상태</th>
                <th className="px-4 py-4 text-center">작성자</th>
                <th className="px-4 py-4 text-center">관리</th>
              </tr>
            </thead>

            <tbody>
              {filteredComments.length > 0 ? (
                filteredComments.map((comment) => (
                  <tr
                    key={comment.id}
                    className="border-b border-gray-100 text-sm transition hover:bg-purple-50/40"
                  >
                    <td className="px-4 py-4 align-middle">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <div className={comment.depth > 0 ? 'pl-5' : ''}>
                        {comment.depth > 0 && (
                          <span className="mb-1 block text-xs font-black text-gray-300">
                            └ 대댓글
                          </span>
                        )}

                        <p className="line-clamp-2 break-keep text-sm font-bold leading-5 text-gray-700">
                          {comment.content}
                        </p>

                        <p className="mt-1 truncate text-xs font-semibold text-gray-400">
                          신고 사유: {comment.reportReason}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <p className="truncate text-sm font-bold text-gray-600">
                        {comment.postTitle}
                      </p>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <p className="truncate font-black text-gray-700">
                        {comment.author}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <StatusBadge className={typeClass[comment.type]}>
                        {comment.type}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <p className="text-xs font-bold leading-5 text-gray-600">
                        {comment.createdAt}
                      </p>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <span
                        className={`font-black ${
                          comment.reportCount > 0 ? 'text-red-500' : 'text-gray-400'
                        }`}
                      >
                        {comment.reportCount}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <StatusBadge className={statusClass[comment.status]}>
                        {comment.status}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <StatusBadge className={authorStatusClass[comment.authorStatus]}>
                        {comment.authorStatus}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          title="신고 해제"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-emerald-600 transition hover:bg-emerald-50"
                        >
                          <CheckCircle2 size={15} />
                        </button>

                        <button
                          type="button"
                          title="숨김 처리"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50"
                        >
                          <EyeOff size={15} />
                        </button>

                        <button
                          type="button"
                          title="완전 삭제"
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
                ))
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

        <div className="flex flex-col gap-3 border-t border-gray-100 px-5 py-4 md:flex-row md:items-center md:justify-between">
          <p className="text-sm font-bold text-gray-500">
            1-{filteredComments.length} / 총 {filteredComments.length}개
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

      {/* 하단 운영 영역 */}
      <section className="grid grid-cols-1 gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">축제로 구현 가능 기능</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">
                댓글 관리자에서 우선 구현할 수 있는 운영 흐름입니다.
              </p>
            </div>
            <FileText size={22} className="shrink-0 text-[#6d3df2]" />
          </div>

          <div className="space-y-3">
            <FeatureItem
              icon={Search}
              title="댓글 검색/필터"
              desc="댓글 내용, 작성자, 게시글 제목, 신고 사유, 처리 상태 기준으로 조회합니다."
            />
            <FeatureItem
              icon={EyeOff}
              title="댓글 숨김 처리"
              desc="삭제 전 관리자가 댓글을 비노출 상태로 전환합니다."
            />
            <FeatureItem
              icon={Trash2}
              title="댓글 삭제"
              desc="댓글은 완전 삭제보다 is_deleted 처리로 원글 흐름을 유지하는 방식이 안정적입니다."
            />
            <FeatureItem
              icon={Ban}
              title="작성자 제재"
              desc="경고, 댓글 작성 제한, 계정 정지 상태를 관리합니다."
            />
          </div>
        </article>

        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-black text-gray-900">최근 제재 사용자</h2>
              <p className="mt-1 text-sm font-medium text-gray-500">
                신고 처리 후 제재된 사용자를 최근순으로 확인합니다.
              </p>
            </div>
            <button
              type="button"
              className="shrink-0 rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-600 transition hover:bg-gray-50"
            >
              더보기
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] table-fixed">
              <colgroup>
                <col className="w-[150px]" />
                <col className="w-[150px]" />
                <col className="w-[80px]" />
                <col className="w-[160px]" />
                <col className="w-[140px]" />
              </colgroup>

              <thead>
                <tr className="border-y border-gray-100 bg-gray-50 text-xs font-black text-gray-500">
                  <th className="px-4 py-3 text-left">작성자</th>
                  <th className="px-4 py-3 text-left">제재 유형</th>
                  <th className="px-4 py-3 text-left">기간</th>
                  <th className="px-4 py-3 text-left">사유</th>
                  <th className="px-4 py-3 text-left">일시</th>
                </tr>
              </thead>

              <tbody>
                {recentRestrictions.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 text-sm transition hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <p className="truncate font-black text-gray-700">{user.author}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="truncate font-bold text-gray-600">{user.type}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-600">
                      {user.period}
                    </td>
                    <td className="px-4 py-4">
                      <p className="truncate font-bold text-gray-600">{user.reason}</p>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-xs font-bold leading-5 text-gray-600">
                        {user.date}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, title, value, unit, change, iconClass }) => {
  return (
    <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-3xl ${iconClass}`}>
          <Icon size={24} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-black text-gray-500">{title}</p>
          <div className="mt-1 flex items-end gap-1">
            <strong className="text-2xl font-black tracking-tight text-gray-950">
              {typeof value === 'number' ? formatNumber(value) : value}
            </strong>
            <span className="pb-0.5 text-sm font-black text-gray-700">{unit}</span>
          </div>
          <p className="mt-2 truncate text-xs font-bold text-gray-400">
            {change}
          </p>
        </div>
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
            <option key={option} value={option}>
              {option}
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

const FeatureItem = ({ icon: Icon, title, desc }) => {
  return (
    <div className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50/70 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#6d3df2] shadow-sm">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="font-black text-gray-800">{title}</p>
        <p className="mt-1 break-keep text-sm font-medium leading-6 text-gray-500">
          {desc}
        </p>
      </div>
    </div>
  );
};

export default CommentManagementPage;
