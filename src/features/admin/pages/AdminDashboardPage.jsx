import React from 'react';
import {
  Users,
  Database,
  FileText,
  ShieldAlert,
  MessageSquare,
  CalendarDays,
  RefreshCw,
  Eye,
  Heart,
  MapPin,
  Clock,
  AlertTriangle,
  Megaphone,
  ArrowRight,
  TrendingUp,
  BarChart3,
  PieChart,
} from 'lucide-react';

const AdminDashboardPage = () => {
  // 상단 핵심 통계
  const statisticCards = [
    {
      title: '전체 회원',
      value: '1,284명',
      subText: '신규 가입 18명',
      change: '+1.4%',
      icon: Users,
      tone: 'purple',
    },
    {
      title: '축제 데이터',
      value: '2,458건',
      subText: '노출 중 2,301건',
      change: '+58건',
      icon: Database,
      tone: 'purple',
    },
    {
      title: '게시글',
      value: '18,726건',
      subText: '오늘 작성 32건',
      change: '+1.7%',
      icon: FileText,
      tone: 'purple',
    },
    {
      title: '신고 접수',
      value: '156건',
      subText: '처리 대기 19건',
      change: '+12건',
      icon: ShieldAlert,
      tone: 'red',
    },
    {
      title: '문의 대기',
      value: '24건',
      subText: '오늘 접수 6건',
      change: '-6건',
      icon: MessageSquare,
      tone: 'yellow',
    },
    {
      title: '공지사항',
      value: '12건',
      subText: '노출 중 5건',
      change: '+1건',
      icon: Megaphone,
      tone: 'green',
    },
  ];

  // 최근 7일 통계 - DB 연결 시 날짜별 count만 넣으면 됨
  const weeklyStats = [
    { day: '6/10', members: 12, posts: 25, reports: 3 },
    { day: '6/11', members: 16, posts: 34, reports: 4 },
    { day: '6/12', members: 10, posts: 21, reports: 2 },
    { day: '6/13', members: 22, posts: 42, reports: 6 },
    { day: '6/14', members: 18, posts: 31, reports: 5 },
    { day: '6/15', members: 25, posts: 48, reports: 7 },
    { day: '6/16', members: 18, posts: 32, reports: 4 },
  ];

  // 축제 상태 통계
  const festivalStatusStats = [
    {
      label: '진행중',
      count: 342,
      percent: 42,
      colorClass: 'bg-emerald-500',
      textClass: 'text-emerald-600',
    },
    {
      label: '예정',
      count: 518,
      percent: 36,
      colorClass: 'bg-[#6d3df2]',
      textClass: 'text-[#6d3df2]',
    },
    {
      label: '종료',
      count: 1398,
      percent: 18,
      colorClass: 'bg-gray-400',
      textClass: 'text-gray-500',
    },
    {
      label: '숨김',
      count: 200,
      percent: 4,
      colorClass: 'bg-red-400',
      textClass: 'text-red-500',
    },
  ];

  // 지역별 축제 데이터 현황
  const regionStats = [
    { region: '서울', count: 286, percent: 86 },
    { region: '경기', count: 251, percent: 76 },
    { region: '부산', count: 184, percent: 58 },
    { region: '전북', count: 162, percent: 49 },
    { region: '강원', count: 148, percent: 44 },
  ];

  const popularFestivals = [
    {
      rank: 1,
      name: '서울빛초롱페스티벌',
      region: '서울특별시',
      views: '125,430',
      likes: '8,912',
      status: '진행중',
    },
    {
      rank: 2,
      name: '진주남강유등축제',
      region: '경상남도 진주시',
      views: '98,672',
      likes: '7,240',
      status: '예정',
    },
    {
      rank: 3,
      name: '보령머드축제',
      region: '충청남도 보령시',
      views: '87,315',
      likes: '6,882',
      status: '예정',
    },
    {
      rank: 4,
      name: '화천산천어축제',
      region: '강원특별자치도 화천군',
      views: '76,992',
      likes: '5,104',
      status: '종료',
    },
    {
      rank: 5,
      name: '전주한지문화축제',
      region: '전북특별자치도 전주시',
      views: '64,128',
      likes: '4,772',
      status: '진행중',
    },
  ];

  const recentReports = [
    {
      id: 'RPT-00621',
      type: '부적절한 게시글',
      target: '축제 자유게시판',
      reporter: 'user_2048',
      date: '2026.06.16 14:32',
      status: '접수',
    },
    {
      id: 'RPT-00620',
      type: '스팸/홍보',
      target: '축제 후기게시판',
      reporter: 'user_1783',
      date: '2026.06.16 13:58',
      status: '접수',
    },
    {
      id: 'RPT-00619',
      type: '욕설/비방',
      target: '댓글',
      reporter: 'user_3391',
      date: '2026.06.16 12:41',
      status: '검토중',
    },
    {
      id: 'RPT-00618',
      type: '개인정보 노출',
      target: '문의 답변',
      reporter: 'user_8842',
      date: '2026.06.16 11:23',
      status: '처리완료',
    },
  ];

  const recentIssues = [
    {
      icon: MessageSquare,
      title: '새 문의가 접수되었습니다.',
      description: '축제 정보 수정 요청 · QNA-0612',
      time: '5분 전',
      status: '대기',
    },
    {
      icon: Database,
      title: '축제 데이터 확인이 필요합니다.',
      description: '좌표 누락 데이터 3건 발견',
      time: '12분 전',
      status: '확인 필요',
    },
    {
      icon: ShieldAlert,
      title: '신고 검토가 필요합니다.',
      description: '부적절한 게시글 신고 접수',
      time: '25분 전',
      status: '검토',
    },
    {
      icon: Megaphone,
      title: '공지사항 노출 상태를 확인하세요.',
      description: '상단 고정 공지 1건 · 일반 공지 4건',
      time: '1시간 전',
      status: '확인',
    },
  ];

  const quickActions = [
    {
      name: '축제 관리',
      icon: Database,
    },
    {
      name: '신고 검토',
      icon: ShieldAlert,
    },
    {
      name: '문의 관리',
      icon: MessageSquare,
    },
    {
      name: '공지 작성',
      icon: Megaphone,
    },
  ];

  const getToneClass = (tone) => {
    switch (tone) {
      case 'red':
        return 'bg-red-50 text-red-500';
      case 'yellow':
        return 'bg-yellow-50 text-yellow-600';
      case 'green':
        return 'bg-emerald-50 text-emerald-500';
      default:
        return 'bg-purple-50 text-[#6d3df2]';
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case '접수':
        return 'bg-purple-50 text-[#6d3df2]';
      case '검토중':
        return 'bg-yellow-50 text-yellow-700';
      case '처리완료':
        return 'bg-emerald-50 text-emerald-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getFestivalStatusClass = (status) => {
    switch (status) {
      case '진행중':
        return 'bg-emerald-50 text-emerald-600';
      case '예정':
        return 'bg-purple-50 text-[#6d3df2]';
      case '종료':
        return 'bg-gray-100 text-gray-500';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const maxWeeklyValue = Math.max(
    ...weeklyStats.flatMap((item) => [item.members, item.posts, item.reports])
  );

  return (
    <div className="space-y-6">
      {/* 상단 제목 영역 */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div>
            <p className="flex items-center gap-1.5 text-sm font-black text-[#6d3df2]">
              <span>FestaRoute Admin</span>
              <span>&gt;</span>
              <span>Dashboard</span>
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
              관리자 대시보드
            </h1>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">
            축제로 서비스의 주요 통계와 운영 현황을 확인하세요.
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

      {/* 상단 핵심 통계 카드 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {statisticCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${getToneClass(card.tone)}`}>
                  <Icon size={24} />
                </div>

                <span className="rounded-full bg-gray-50 px-2.5 py-1 text-xs font-black text-gray-500">
                  {card.change}
                </span>
              </div>

              <div className="mt-5">
                <p className="text-sm font-black text-gray-500">{card.title}</p>
                <p className="mt-2 text-2xl font-black tracking-tight text-gray-950">
                  {card.value}
                </p>
                <p className="mt-2 text-xs font-bold text-gray-400">
                  {card.subText}
                </p>
              </div>
            </article>
          );
        })}
      </section>

      {/* 통계 메인 영역 */}
      <section className="grid grid-cols-1 gap-5 2xl:grid-cols-12">
        {/* 최근 7일 운영 통계 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm 2xl:col-span-8">
          <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                <TrendingUp size={20} className="text-[#6d3df2]" />
                최근 7일 운영 통계
              </h3>
              <p className="mt-1 text-xs font-bold text-gray-400">
                가입자, 게시글, 신고 접수 추이를 비교합니다.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-xs font-black text-gray-500">
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-[#6d3df2]" />
                신규 회원
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                게시글
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2.5 w-2.5 rounded-full bg-red-400" />
                신고
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="flex min-w-[680px] items-end gap-5 border-b border-gray-100 pb-4">
              {weeklyStats.map((item) => (
                <div key={item.day} className="flex flex-1 flex-col items-center gap-3">
                  <div className="flex h-52 w-full items-end justify-center gap-2 rounded-2xl bg-gray-50 px-2 py-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-gray-400">
                        {item.members}
                      </span>
                      <div
                        className="w-4 rounded-t-full bg-[#6d3df2]"
                        style={{
                          height: `${Math.max((item.members / maxWeeklyValue) * 150, 12)}px`,
                        }}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-gray-400">
                        {item.posts}
                      </span>
                      <div
                        className="w-4 rounded-t-full bg-yellow-400"
                        style={{
                          height: `${Math.max((item.posts / maxWeeklyValue) * 150, 12)}px`,
                        }}
                      />
                    </div>

                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-black text-gray-400">
                        {item.reports}
                      </span>
                      <div
                        className="w-4 rounded-t-full bg-red-400"
                        style={{
                          height: `${Math.max((item.reports / maxWeeklyValue) * 150, 12)}px`,
                        }}
                      />
                    </div>
                  </div>

                  <p className="text-xs font-black text-gray-500">{item.day}</p>
                </div>
              ))}
            </div>
          </div>
        </article>

        {/* 축제 상태 통계 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm 2xl:col-span-4">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
              <PieChart size={20} className="text-[#6d3df2]" />
              축제 상태 통계
            </h3>
            <p className="mt-1 text-xs font-bold text-gray-400">
              진행 상태와 노출 여부를 기준으로 확인합니다.
            </p>
          </div>

          <div className="space-y-5">
            {festivalStatusStats.map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <i className={`h-2.5 w-2.5 rounded-full ${item.colorClass}`} />
                    <span className="text-sm font-black text-gray-700">{item.label}</span>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-black ${item.textClass}`}>
                      {item.count}건
                    </span>
                    <span className="ml-1 text-xs font-bold text-gray-400">
                      {item.percent}%
                    </span>
                  </div>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className={`h-full rounded-full ${item.colorClass}`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-black text-gray-700 transition hover:border-[#6d3df2]/30 hover:bg-purple-50 hover:text-[#6d3df2]"
          >
            축제 데이터 관리
            <ArrowRight size={16} />
          </button>
        </article>
      </section>

      {/* 축제로 특화 통계 */}
      <section className="grid grid-cols-1 gap-5 2xl:grid-cols-12">
        {/* 인기 축제 TOP 5 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm 2xl:col-span-7">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                <BarChart3 size={20} className="text-[#6d3df2]" />
                인기 축제 TOP 5
              </h3>
              <p className="mt-1 text-xs font-bold text-gray-400">
                조회수와 관심 등록 수를 기준으로 사용자 관심도를 확인합니다.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-500 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
            >
              전체 보기
              <ArrowRight size={14} />
            </button>
          </div>

          <ul className="divide-y divide-gray-100">
            {popularFestivals.map((festival) => (
              <li
                key={festival.rank}
                className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6d3df2] text-sm font-black text-white">
                  {festival.rank}
                </span>

                <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 via-yellow-50 to-purple-200">
                  <MapPin size={22} className="text-[#6d3df2]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-black text-gray-800">
                      {festival.name}
                    </p>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-black ${getFestivalStatusClass(
                        festival.status
                      )}`}
                    >
                      {festival.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-xs font-bold text-gray-400">
                    {festival.region}
                  </p>
                </div>

                <div className="hidden shrink-0 items-center gap-1 text-xs font-bold text-gray-500 sm:flex">
                  <Eye size={14} />
                  {festival.views}
                </div>

                <div className="hidden shrink-0 items-center gap-1 text-xs font-bold text-gray-500 md:flex">
                  <Heart size={14} />
                  {festival.likes}
                </div>
              </li>
            ))}
          </ul>
        </article>

        {/* 지역별 축제 현황 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm 2xl:col-span-5">
          <div className="mb-5">
            <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
              <MapPin size={20} className="text-[#6d3df2]" />
              지역별 축제 데이터
            </h3>
            <p className="mt-1 text-xs font-bold text-gray-400">
              등록된 축제 데이터가 많은 지역 순위입니다.
            </p>
          </div>

          <div className="space-y-4">
            {regionStats.map((item, index) => (
              <div key={item.region}>
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 text-xs font-black text-[#6d3df2]">
                      {index + 1}
                    </span>
                    <span className="text-sm font-black text-gray-700">
                      {item.region}
                    </span>
                  </div>
                  <span className="text-sm font-black text-gray-900">
                    {item.count}건
                  </span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-[#6d3df2]"
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      {/* 운영 확인 영역 */}
      <section className="grid grid-cols-1 gap-5 2xl:grid-cols-12">
        {/* 최근 신고 접수 */}
        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm 2xl:col-span-7">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                <ShieldAlert size={20} className="text-red-500" />
                최근 신고 접수
              </h3>
              <p className="mt-1 text-xs font-bold text-gray-400">
                통계에서 확인된 신고 현황의 최근 접수 내역입니다.
              </p>
            </div>

            <button
              type="button"
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-500 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
            >
              신고 관리
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-y border-gray-100 bg-gray-50 text-xs font-black text-gray-500">
                  <th className="px-4 py-3">접수번호</th>
                  <th className="px-4 py-3">유형</th>
                  <th className="px-4 py-3">대상</th>
                  <th className="px-4 py-3">신고자</th>
                  <th className="px-4 py-3">접수일시</th>
                  <th className="px-4 py-3">상태</th>
                </tr>
              </thead>

              <tbody>
                {recentReports.map((report) => (
                  <tr
                    key={report.id}
                    className="border-b border-gray-50 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                  >
                    <td className="px-4 py-4 font-black text-gray-800">{report.id}</td>
                    <td className="px-4 py-4">{report.type}</td>
                    <td className="px-4 py-4">{report.target}</td>
                    <td className="px-4 py-4">{report.reporter}</td>
                    <td className="px-4 py-4">{report.date}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-black ${getStatusClass(
                          report.status
                        )}`}
                      >
                        {report.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        {/* 최근 운영 이슈 + 빠른 작업 */}
        <article className="space-y-5 2xl:col-span-5">
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5">
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                <AlertTriangle size={20} className="text-yellow-500" />
                최근 운영 이슈
              </h3>
              <p className="mt-1 text-xs font-bold text-gray-400">
                처리해야 할 항목을 최근순으로 보여줍니다.
              </p>
            </div>

            <ul className="space-y-3">
              {recentIssues.map((issue) => {
                const Icon = issue.icon;

                return (
                  <li
                    key={issue.title}
                    className="flex gap-3 rounded-2xl border border-gray-100 p-4 transition hover:bg-gray-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-[#6d3df2]">
                      <Icon size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <p className="line-clamp-1 text-sm font-black text-gray-800">
                          {issue.title}
                        </p>
                        <span className="shrink-0 rounded-full bg-gray-100 px-2 py-1 text-[10px] font-black text-gray-500">
                          {issue.status}
                        </span>
                      </div>
                      <p className="mt-1 line-clamp-1 text-xs font-bold text-gray-500">
                        {issue.description}
                      </p>
                      <p className="mt-2 flex items-center gap-1 text-[11px] font-bold text-gray-400">
                        <Clock size={12} />
                        {issue.time}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4">
              <h3 className="text-lg font-black text-gray-900">빠른 작업</h3>
              <p className="mt-1 text-xs font-bold text-gray-400">
                통계 확인 후 자주 이동하는 관리 메뉴입니다.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.name}
                    type="button"
                    className="flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-3 text-center text-sm font-black text-gray-700 transition hover:-translate-y-0.5 hover:border-[#6d3df2]/30 hover:bg-purple-50 hover:text-[#6d3df2]"
                  >
                    <Icon size={24} className="text-[#6d3df2]" />
                    {action.name}
                  </button>
                );
              })}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default AdminDashboardPage;