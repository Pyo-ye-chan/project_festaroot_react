import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

import { getAdminDashboard } from '../../../api/adminApi';

const emptyDashboardData = {
  summary: {
    memberCount: 0,
    todayNewMembers: 0,
    festivalCount: 0,
    visibleFestivalCount: 0,
    postCount: 0,
    todayPostCount: 0,
    reportCount: 0,
    waitingReportCount: 0,
    waitingInquiryCount: 0,
    todayInquiryCount: 0,
    noticeCount: 0,
    visibleNoticeCount: 0,
  },
  weeklyStats: [],
  festivalStatusStats: [],
  regionStats: [],
  popularFestivals: [],
  recentReports: [],
  recentIssues: [],
};

const getTodayValue = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const AdminDashboardPage = () => {
  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(emptyDashboardData);
  const [selectedDate, setSelectedDate] = useState(getTodayValue());
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const todayValue = useMemo(() => getTodayValue(), []);

  const normalizeDashboardData = (apiData) => {
    if (!apiData || typeof apiData !== 'object') {
      return emptyDashboardData;
    }

    return {
      summary: {
        ...emptyDashboardData.summary,
        ...(apiData.summary ?? {}),
      },
      weeklyStats: Array.isArray(apiData.weeklyStats) ? apiData.weeklyStats : [],
      festivalStatusStats: Array.isArray(apiData.festivalStatusStats)
        ? apiData.festivalStatusStats
        : [],
      regionStats: Array.isArray(apiData.regionStats) ? apiData.regionStats : [],
      popularFestivals: Array.isArray(apiData.popularFestivals)
        ? apiData.popularFestivals
        : [],
      recentReports: Array.isArray(apiData.recentReports)
        ? apiData.recentReports
        : [],
      recentIssues: Array.isArray(apiData.recentIssues)
        ? apiData.recentIssues
        : [],
    };
  };

  const fetchDashboard = async (baseDate = selectedDate) => {
    try {
      setLoading(true);
      setErrorMessage('');

      const safeDate = baseDate > todayValue ? todayValue : baseDate;

      const response = await getAdminDashboard(safeDate);
      const apiData = response?.data ?? response;

      setDashboardData(normalizeDashboardData(apiData));
    } catch (error) {
      console.error('관리자 대시보드 조회 실패:', error);

      setDashboardData(emptyDashboardData);
      setErrorMessage('대시보드 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDateChange = (e) => {
    const value = e.target.value;

    if (!value) return;

    const safeDate = value > todayValue ? todayValue : value;

    setSelectedDate(safeDate);
    fetchDashboard(safeDate);
  };

  const formatNumber = (value) => {
    if (value === null || value === undefined) return '0';

    const numberValue = Number(String(value).replaceAll(',', ''));

    if (Number.isNaN(numberValue)) {
      return String(value);
    }

    return numberValue.toLocaleString();
  };

  const summary = dashboardData.summary ?? emptyDashboardData.summary;

  const statisticCards = [
    {
      title: '전체 회원',
      value: `${formatNumber(summary.memberCount)}명`,
      subText: `신규 가입 ${formatNumber(summary.todayNewMembers)}명`,
      change: '-',
      icon: Users,
      tone: 'purple',
    },
    {
      title: '축제 데이터',
      value: `${formatNumber(summary.festivalCount)}건`,
      subText: `노출 중 ${formatNumber(summary.visibleFestivalCount)}건`,
      change: '-',
      icon: Database,
      tone: 'purple',
    },
    {
      title: '게시글',
      value: `${formatNumber(summary.postCount)}건`,
      subText: `오늘 작성 ${formatNumber(summary.todayPostCount)}건`,
      change: '-',
      icon: FileText,
      tone: 'purple',
    },
    {
      title: '신고 접수',
      value: `${formatNumber(summary.reportCount)}건`,
      subText: `처리 대기 ${formatNumber(summary.waitingReportCount)}건`,
      change: '-',
      icon: ShieldAlert,
      tone: 'red',
    },
    {
      title: '문의 대기',
      value: `${formatNumber(summary.waitingInquiryCount)}건`,
      subText: `오늘 접수 ${formatNumber(summary.todayInquiryCount)}건`,
      change: '-',
      icon: MessageSquare,
      tone: 'yellow',
    },
    {
      title: '공지사항',
      value: `${formatNumber(summary.noticeCount)}건`,
      subText: `노출 중 ${formatNumber(summary.visibleNoticeCount)}건`,
      change: '-',
      icon: Megaphone,
      tone: 'green',
    },
  ];

  const weeklyStats = dashboardData.weeklyStats ?? [];
  const regionStats = dashboardData.regionStats ?? [];
  const popularFestivals = dashboardData.popularFestivals ?? [];
  const recentReports = dashboardData.recentReports ?? [];

  const festivalStatusColorMap = {
    진행중: {
      colorClass: 'bg-emerald-500',
      textClass: 'text-emerald-600',
    },
    예정: {
      colorClass: 'bg-[#6d3df2]',
      textClass: 'text-[#6d3df2]',
    },
    종료: {
      colorClass: 'bg-gray-400',
      textClass: 'text-gray-500',
    },
    숨김: {
      colorClass: 'bg-red-400',
      textClass: 'text-red-500',
    },
  };

  const festivalStatusStats = (dashboardData.festivalStatusStats ?? []).map(
    (item) => ({
      ...item,
      ...(festivalStatusColorMap[item.label] ?? {
        colorClass: 'bg-gray-400',
        textClass: 'text-gray-500',
      }),
    })
  );

  const issueIconMap = {
    inquiry: MessageSquare,
    festival: Database,
    report: ShieldAlert,
    notice: Megaphone,
  };

  const recentIssues = (dashboardData.recentIssues ?? []).map((issue) => ({
    ...issue,
    icon: issueIconMap[issue.type] ?? AlertTriangle,
  }));

  const quickActions = [
    {
      name: '축제 관리',
      icon: Database,
      path: '/admin/festivals',
    },
    {
      name: '신고 검토',
      icon: ShieldAlert,
      path: '/admin/inquiries',
    },
    {
      name: '문의 관리',
      icon: MessageSquare,
      path: '/admin/inquiries',
    },
    {
      name: '공지 작성',
      icon: Megaphone,
      path: '/admin/notices/write',
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
      case '대기':
      case 'PENDING':
        return 'bg-purple-50 text-[#6d3df2]';
      case '검토중':
      case '검토':
      case '확인 필요':
        return 'bg-yellow-50 text-yellow-700';
      case '처리완료':
      case '완료':
      case 'COMPLETED':
      case '노출':
        return 'bg-emerald-50 text-emerald-600';
      case '숨김':
        return 'bg-red-50 text-red-500';
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
    1,
    ...weeklyStats.flatMap((item) => [
      Number(item.members || 0),
      Number(item.posts || 0),
      Number(item.reports || 0),
    ])
  );

  const selectedDateText = useMemo(() => {
    if (!selectedDate) return '';

    return selectedDate.replaceAll('-', '.');
  }, [selectedDate]);

  return (
    <div className="space-y-6">
      {/* 상단 제목 영역 */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
            관리자 대시보드
          </h1>
          <p className="mt-2 text-sm font-medium text-gray-500">
            축제로 서비스의 주요 통계와 운영 현황을 확인하세요.
          </p>

          {errorMessage && (
            <p className="mt-2 inline-flex rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-500">
              {errorMessage}
            </p>
          )}
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
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${getToneClass(
                    card.tone
                  )}`}
                >
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
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0">
              <h3 className="flex items-center gap-2 text-lg font-black text-gray-900">
                <TrendingUp size={20} className="text-[#6d3df2]" />
                최근 7일 운영 통계
              </h3>
              <p className="mt-1 text-xs font-bold text-gray-400">
                {selectedDateText} 기준 최근 7일 가입자, 게시글, 신고 접수 추이입니다.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:justify-end">
              <label className="inline-flex h-11 items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 text-sm font-black text-gray-700 shadow-sm transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]">
                <CalendarDays size={17} />
                <input
                  type="date"
                  value={selectedDate}
                  max={todayValue}
                  onChange={handleDateChange}
                  disabled={loading}
                  className="w-[132px] bg-transparent text-sm font-black text-gray-700 outline-none disabled:cursor-not-allowed"
                />
              </label>

              <button
                type="button"
                onClick={() => fetchDashboard(selectedDate)}
                disabled={loading}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#6d3df2] px-4 text-sm font-black text-white shadow-lg shadow-purple-100 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
                {loading ? '불러오는 중' : '조회'}
              </button>
            </div>
          </div>

          {weeklyStats.length === 0 ? (
            <div className="flex h-52 items-center justify-center rounded-2xl bg-gray-50 text-sm font-black text-gray-400">
              조회된 운영 통계가 없습니다.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <div className="flex min-w-[680px] items-end gap-5 pb-2">
                {weeklyStats.map((item, index) => (
                  <div
                    key={`${item.day}-${index}`}
                    className="flex flex-1 flex-col items-center gap-3"
                  >
                    <div className="flex h-52 w-full items-end justify-center gap-2 rounded-2xl bg-gray-50 px-2 py-3">
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-[10px] font-black text-gray-400">
                          {item.members}
                        </span>
                        <div
                          className="w-4 rounded-t-full bg-[#6d3df2]"
                          style={{
                            height: `${Math.max(
                              (Number(item.members || 0) / maxWeeklyValue) * 150,
                              12
                            )}px`,
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
                            height: `${Math.max(
                              (Number(item.posts || 0) / maxWeeklyValue) * 150,
                              12
                            )}px`,
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
                            height: `${Math.max(
                              (Number(item.reports || 0) / maxWeeklyValue) * 150,
                              12
                            )}px`,
                          }}
                        />
                      </div>
                    </div>

                    <p className="text-xs font-black text-gray-500">{item.day}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-end gap-4 border-t border-gray-100 px-4 pt-4 pr-8 text-xs font-black text-gray-500">
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

          {festivalStatusStats.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-2xl bg-gray-50 text-sm font-black text-gray-400">
              축제 상태 데이터가 없습니다.
            </div>
          ) : (
            <div className="space-y-5">
              {festivalStatusStats.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className={`h-2.5 w-2.5 rounded-full ${item.colorClass}`} />
                      <span className="text-sm font-black text-gray-700">
                        {item.label}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-black ${item.textClass}`}>
                        {formatNumber(item.count)}건
                      </span>
                      <span className="ml-1 text-xs font-bold text-gray-400">
                        {item.percent ?? 0}%
                      </span>
                    </div>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className={`h-full rounded-full ${item.colorClass}`}
                      style={{ width: `${item.percent ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => navigate('/admin/festivals')}
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
              onClick={() => navigate('/admin/festivals')}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-500 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
            >
              전체 보기
              <ArrowRight size={14} />
            </button>
          </div>

          {popularFestivals.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gray-50 text-sm font-black text-gray-400">
              인기 축제 데이터가 없습니다.
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {popularFestivals.map((festival, index) => (
                <li
                  key={`${festival.name}-${index}`}
                  className="flex items-center gap-4 py-4 first:pt-0 last:pb-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6d3df2] text-sm font-black text-white">
                    {festival.rank ?? index + 1}
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
                    {formatNumber(festival.views)}
                  </div>

                  <div className="hidden shrink-0 items-center gap-1 text-xs font-bold text-gray-500 md:flex">
                    <Heart size={14} />
                    {formatNumber(festival.likes)}
                  </div>
                </li>
              ))}
            </ul>
          )}
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

          {regionStats.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gray-50 text-sm font-black text-gray-400">
              지역별 축제 데이터가 없습니다.
            </div>
          ) : (
            <div className="space-y-4">
              {regionStats.map((item, index) => (
                <div key={`${item.region}-${index}`}>
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
                      {formatNumber(item.count)}건
                    </span>
                  </div>

                  <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#6d3df2]"
                      style={{ width: `${item.percent ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
              onClick={() => navigate('/admin/inquiries')}
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-xs font-black text-gray-500 transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
            >
              신고 관리
              <ArrowRight size={14} />
            </button>
          </div>

          {recentReports.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-2xl bg-gray-50 text-sm font-black text-gray-400">
              최근 신고 접수 내역이 없습니다.
            </div>
          ) : (
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
                  {recentReports.map((report, index) => (
                    <tr
                      key={`${report.id}-${index}`}
                      className="border-b border-gray-50 text-xs font-bold text-gray-600 transition hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 font-black text-gray-800">
                        {report.id}
                      </td>
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
          )}
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

            {recentIssues.length === 0 ? (
              <div className="flex h-44 items-center justify-center rounded-2xl bg-gray-50 text-sm font-black text-gray-400">
                최근 운영 이슈가 없습니다.
              </div>
            ) : (
              <ul className="space-y-3">
                {recentIssues.map((issue, index) => {
                  const Icon = issue.icon;

                  return (
                    <li
                      key={`${issue.title}-${index}`}
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
                          <span
                            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${getStatusClass(
                              issue.status
                            )}`}
                          >
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
            )}
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
                    onClick={() => navigate(action.path)}
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