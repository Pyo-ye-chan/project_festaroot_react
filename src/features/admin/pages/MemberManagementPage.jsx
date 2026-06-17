import React, { useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  CalendarDays,
  Users,
  UserPlus,
  UserMinus,
  UserX,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Trash2,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ban,
  Mail,
  RefreshCw,
  Lock,
  Unlock,
  AlertTriangle,
  UserCheck,
} from 'lucide-react';

const ROLE_LABELS = {
  all: '전체 권한',
  USER: '일반 회원',
  ADMIN: '관리자',
};

const STATUS_LABELS = {
  all: '전체 상태',
  ACTIVE: '정상',
  SUSPENDED: '정지',
  BLACKLISTED: '블랙리스트',
  INACTIVE: '휴면',
};

const PROVIDER_LABELS = {
  all: '전체 가입',
  LOCAL: '일반',
  KAKAO: '카카오',
  NAVER: '네이버',
  GOOGLE: '구글',
};

const dummyMembers = [
  {
    id: 'MEM-001',
    name: '김철수',
    email: 'chulsoo@example.com',
    role: 'USER',
    status: 'ACTIVE',
    provider: 'KAKAO',
    joinedAt: '2026.06.10 14:32',
    lastLogin: '2026.06.17 09:15',
    reports: 0,
  },
  {
    id: 'MEM-002',
    name: '이영희',
    email: 'younghee@example.com',
    role: 'USER',
    status: 'ACTIVE',
    provider: 'NAVER',
    joinedAt: '2026.06.11 10:15',
    lastLogin: '2026.06.16 22:40',
    reports: 1,
  },
  {
    id: 'MEM-003',
    name: '박민준',
    email: 'minjun@example.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    provider: 'LOCAL',
    joinedAt: '2026.01.05 09:00',
    lastLogin: '2026.06.17 08:30',
    reports: 0,
  },
  {
    id: 'MEM-004',
    name: '최지우',
    email: 'jiwoo@example.com',
    role: 'USER',
    status: 'SUSPENDED',
    provider: 'GOOGLE',
    joinedAt: '2026.05.20 16:45',
    lastLogin: '2026.06.10 11:20',
    reports: 5,
  },
  {
    id: 'MEM-005',
    name: '정다은',
    email: 'daeun@example.com',
    role: 'USER',
    status: 'BLACKLISTED',
    provider: 'KAKAO',
    joinedAt: '2026.04.15 13:10',
    lastLogin: '2026.05.01 10:05',
    reports: 12,
  },
  {
    id: 'MEM-006',
    name: '강건우',
    email: 'gunwoo@example.com',
    role: 'USER',
    status: 'ACTIVE',
    provider: 'LOCAL',
    joinedAt: '2026.06.15 18:20',
    lastLogin: '2026.06.16 20:10',
    reports: 0,
  },
  {
    id: 'MEM-007',
    name: '윤서연',
    email: 'seoyeon@example.com',
    role: 'USER',
    status: 'INACTIVE',
    provider: 'NAVER',
    joinedAt: '2025.12.10 11:00',
    lastLogin: '2026.02.15 14:30',
    reports: 0,
  },
];

const statusClass = {
  ACTIVE: 'bg-emerald-50 text-emerald-600',
  SUSPENDED: 'bg-orange-50 text-orange-600',
  BLACKLISTED: 'bg-red-50 text-red-500',
  INACTIVE: 'bg-gray-100 text-gray-500',
};

const roleClass = {
  USER: 'bg-blue-50 text-blue-600',
  ADMIN: 'bg-purple-50 text-purple-600',
};

const providerClass = {
  LOCAL: 'bg-slate-100 text-slate-600',
  KAKAO: 'bg-yellow-50 text-yellow-700',
  NAVER: 'bg-emerald-50 text-emerald-700',
  GOOGLE: 'bg-blue-50 text-blue-700',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const MemberManagementPage = () => {
  const [members, setMembers] = useState(dummyMembers);
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [provider, setProvider] = useState('all');

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const lowerKeyword = keyword.trim().toLowerCase();
      const keywordMatch =
        !lowerKeyword ||
        member.name.toLowerCase().includes(lowerKeyword) ||
        member.email.toLowerCase().includes(lowerKeyword) ||
        member.id.toLowerCase().includes(lowerKeyword);

      const roleMatch = role === 'all' || member.role === role;
      const statusMatch = status === 'all' || member.status === status;
      const providerMatch = provider === 'all' || member.provider === provider;

      return keywordMatch && roleMatch && statusMatch && providerMatch;
    });
  }, [members, keyword, role, status, provider]);

  const stats = useMemo(() => {
    return {
      total: members.length,
      newToday: members.filter((m) => m.joinedAt.startsWith('2026.06.17')).length,
      suspended: members.filter((m) => m.status === 'SUSPENDED').length,
      blacklisted: members.filter((m) => m.status === 'BLACKLISTED').length,
    };
  }, [members]);

  const handleReset = () => {
    setKeyword('');
    setRole('all');
    setStatus('all');
    setProvider('all');
  };

  const handleStatusChange = (memberId, newStatus) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    const actionText = 
      newStatus === 'SUSPENDED' ? '정지' : 
      newStatus === 'BLACKLISTED' ? '블랙리스트 등록' : 
      '정상 상태로 변경';

    if (window.confirm(`${target.name} 회원을 ${actionText} 하시겠습니까?`)) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: newStatus } : m))
      );
    }
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
              <span>Member Management</span>
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">
              회원 관리
            </h1>
          </div>
          <p className="mt-2 text-sm font-medium text-gray-500">
            회원 조회, 활동 상태 관리, 정지 및 블랙리스트 관리를 수행합니다.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-black text-gray-700 shadow-sm transition hover:border-[#6d3df2]/30 hover:text-[#6d3df2]"
          >
            <CalendarDays size={17} />
            2026.06.17
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

      {/* 요약 카드 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          icon={Users}
          title="전체 회원"
          value={stats.total}
          unit="명"
          change="누적 가입 회원수"
          iconClass="bg-purple-50 text-[#6d3df2]"
        />
        <SummaryCard
          icon={UserPlus}
          title="오늘 가입"
          value={stats.newToday}
          unit="명"
          change="신규 가입자"
          iconClass="bg-blue-50 text-blue-600"
        />
        <SummaryCard
          icon={UserMinus}
          title="정지 회원"
          value={stats.suspended}
          unit="명"
          change="활동 일시 중단"
          iconClass="bg-orange-50 text-orange-600"
        />
        <SummaryCard
          icon={UserX}
          title="블랙리스트"
          value={stats.blacklisted}
          unit="명"
          change="영구 제한 회원"
          iconClass="bg-red-50 text-red-500"
        />
      </section>

      {/* 검색 및 필터 */}
      <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">회원 검색</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              이름, 이메일, 회원 ID와 가입 조건으로 목록을 필터링합니다.
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
                placeholder="이름, 이메일, 회원 ID 검색"
                className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 text-sm font-semibold text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#6d3df2]/40 focus:bg-white focus:ring-4 focus:ring-purple-50"
              />
            </div>
          </div>

          <FilterSelect
            label="회원 권한"
            value={role}
            onChange={setRole}
            options={Object.entries(ROLE_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />

          <FilterSelect
            label="활동 상태"
            value={status}
            onChange={setStatus}
            options={Object.entries(STATUS_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />

          <FilterSelect
            label="가입 경로"
            value={provider}
            onChange={setProvider}
            options={Object.entries(PROVIDER_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />
        </div>
      </section>

      {/* 회원 목록 */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-black text-gray-900">회원 목록</h2>
            <p className="mt-1 text-xs font-bold text-gray-400">
              총 <span className="text-[#6d3df2]">{filteredMembers.length}</span>명의 회원이 조회되었습니다.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-orange-100 bg-orange-50 px-4 text-sm font-black text-orange-600 transition hover:bg-orange-100"
            >
              <Lock size={16} />
              선택 정지
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 text-sm font-black text-red-500 transition hover:bg-red-100"
            >
              <Ban size={16} />
              블랙리스트 추가
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] table-fixed text-left">
            <colgroup>
              <col className="w-[52px]" />
              <col className="w-[180px]" />
              <col className="w-[220px]" />
              <col className="w-[110px]" />
              <col className="w-[110px]" />
              <col className="w-[110px]" />
              <col className="w-[145px]" />
              <col className="w-[145px]" />
              <col className="w-[80px]" />
              <col className="w-[140px]" />
            </colgroup>

            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 text-xs font-black text-gray-500">
                <th className="px-4 py-4">
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                </th>
                <th className="px-4 py-4">이름 / ID</th>
                <th className="px-4 py-4">이메일</th>
                <th className="px-4 py-4 text-center">권한</th>
                <th className="px-4 py-4 text-center">상태</th>
                <th className="px-4 py-4 text-center">가입경로</th>
                <th className="px-4 py-4 text-center">가입일시</th>
                <th className="px-4 py-4 text-center">최근접속</th>
                <th className="px-4 py-4 text-right">신고</th>
                <th className="px-4 py-4 text-center">관리</th>
              </tr>
            </thead>

            <tbody>
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <tr
                    key={member.id}
                    className="border-b border-gray-50 text-sm transition hover:bg-purple-50/40"
                  >
                    <td className="px-4 py-4 align-middle">
                      <input type="checkbox" className="h-4 w-4 rounded border-gray-300" />
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <p className="font-black text-gray-800">{member.name}</p>
                      <p className="mt-1 text-xs font-semibold text-gray-400">{member.id}</p>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        <span className="truncate font-semibold">{member.email}</span>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <StatusBadge className={roleClass[member.role]}>
                        {ROLE_LABELS[member.role]}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <StatusBadge className={statusClass[member.status]}>
                        {STATUS_LABELS[member.status]}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <StatusBadge className={providerClass[member.provider]}>
                        {PROVIDER_LABELS[member.provider]}
                      </StatusBadge>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <p className="text-xs font-bold text-gray-600">{member.joinedAt}</p>
                    </td>

                    <td className="px-4 py-4 text-center align-middle">
                      <p className="text-xs font-bold text-gray-600">{member.lastLogin}</p>
                    </td>

                    <td className="px-4 py-4 text-right align-middle font-black text-gray-400">
                      <span className={member.reports > 0 ? 'text-red-500' : ''}>
                        {member.reports}
                      </span>
                    </td>

                    <td className="px-4 py-4 align-middle">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          title="상세 보기"
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-[#6d3df2] transition hover:bg-purple-50"
                        >
                          <Eye size={15} />
                        </button>

                        {member.status === 'ACTIVE' ? (
                          <button
                            type="button"
                            title="정지 처리"
                            onClick={() => handleStatusChange(member.id, 'SUSPENDED')}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-orange-100 bg-white text-orange-500 transition hover:bg-orange-50"
                          >
                            <Lock size={15} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title="정지 해제"
                            onClick={() => handleStatusChange(member.id, 'ACTIVE')}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-100 bg-white text-emerald-500 transition hover:bg-emerald-50"
                          >
                            <Unlock size={15} />
                          </button>
                        )}

                        <button
                          type="button"
                          title="블랙리스트 추가"
                          onClick={() => handleStatusChange(member.id, 'BLACKLISTED')}
                          className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-white text-red-500 transition hover:bg-red-50"
                        >
                          <Ban size={15} />
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
                      <Users size={24} />
                    </div>
                    <p className="mt-4 text-sm font-black text-gray-700">
                      조회된 회원이 없습니다.
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
            1-{filteredMembers.length} / 총 {filteredMembers.length}명
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
            title="주의 대상 회원"
            description="신고 수가 높거나 최근 정지 이력이 있는 회원입니다."
          />

          <div className="mt-5 space-y-3">
            {members.filter(m => m.reports >= 5).map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-gray-800">
                    {member.name} ({member.email})
                  </p>
                  <p className="mt-1 text-xs font-bold text-gray-400">
                    누적 신고 {member.reports}건 · 현재 상태: {STATUS_LABELS[member.status]}
                  </p>
                </div>

                <button type="button" className="shrink-0 text-sm font-black text-[#6d3df2]">
                  관리
                </button>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <SectionHeader
            icon={ShieldCheck}
            iconClass="text-[#6d3df2]"
            title="회원 관리 운영 가이드"
            description="축제로 서비스의 회원 운영 원칙입니다."
          />

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2">
            <FeatureItem
              icon={UserCheck}
              title="활동 상태 확인"
              desc="정상, 정지, 블랙리스트 등 회원의 현재 활동 상태를 직관적으로 파악합니다."
            />
            <FeatureItem
              icon={Lock}
              title="활동 정지"
              desc="커뮤니티 가이드 위반 시 일정 기간 또는 무기한 활동을 제한합니다."
            />
            <FeatureItem
              icon={Ban}
              title="블랙리스트 관리"
              desc="반복적인 악성 행위자의 재가입을 방지하고 서비스를 보호합니다."
            />
            <FeatureItem
              icon={AlertTriangle}
              title="신고 기반 관리"
              desc="타 사용자의 신고 데이터를 바탕으로 객관적인 제재를 결정합니다."
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

export default MemberManagementPage;