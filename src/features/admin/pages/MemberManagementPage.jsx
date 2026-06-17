import React, { useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  Users,
  UserPlus,
  UserMinus,
  UserX,
  ShieldAlert,
  Eye,
  MoreHorizontal,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Ban,
  Mail,
  Lock,
  Unlock,
  Calendar,
  Clock,
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

const dummyMembers = [
  {
    id: 'MEM-001',
    nickname: '축제요정',
    email: 'chulsoo@example.com',
    role: 'USER',
    status: 'ACTIVE',
    joinedAt: '2026.06.10',
    lastLogin: '2026.06.17 09:15',
    reports: 0,
    reportReason: '',
    suspensionEndDate: '-',
  },
  {
    id: 'MEM-004',
    nickname: '프로불편러',
    email: 'jiwoo@example.com',
    role: 'USER',
    status: 'SUSPENDED',
    joinedAt: '2026.05.20',
    lastLogin: '2026.06.10 11:20',
    reports: 5,
    reportReason: '반복적인 욕설 및 비방',
    suspensionEndDate: '2026.06.24', // 7일 정지 예시
  },
  {
    id: 'MEM-005',
    nickname: '광고천재',
    email: 'daeun@example.com',
    role: 'USER',
    status: 'BLACKLISTED',
    joinedAt: '2026.04.15',
    lastLogin: '2026.05.01 10:05',
    reports: 12,
    reportReason: '상업적 홍보 도배',
    suspensionEndDate: '영구',
  },
  {
    id: 'MEM-006',
    nickname: '여행가족',
    email: 'gunwoo@example.com',
    role: 'USER',
    status: 'ACTIVE',
    joinedAt: '2026.06.15',
    lastLogin: '2026.06.16 20:10',
    reports: 0,
    reportReason: '',
    suspensionEndDate: '-',
  },
  {
    id: 'MEM-007',
    nickname: '잠자는숲',
    email: 'seoyeon@example.com',
    role: 'USER',
    status: 'INACTIVE',
    joinedAt: '2025.12.10',
    lastLogin: '2026.02.15 14:30',
    reports: 0,
    reportReason: '',
    suspensionEndDate: '-',
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

const formatNumber = (value) => Number(value || 0).toLocaleString();

const MemberManagementPage = () => {
  const [members, setMembers] = useState(dummyMembers);
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest'); 
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // 정지 설정 관련 상태
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetMember, setTargetMember] = useState(null);
  const [suspensionDays, setSuspensionDays] = useState('7');

  const filteredMembers = useMemo(() => {
    let result = members.filter((member) => {
      const lowerKeyword = keyword.trim().toLowerCase();
      const keywordMatch =
        !lowerKeyword ||
        member.nickname.toLowerCase().includes(lowerKeyword) ||
        member.email.toLowerCase().includes(lowerKeyword) ||
        member.id.toLowerCase().includes(lowerKeyword);

      const roleMatch = role === 'all' || member.role === role;
      const statusMatch = status === 'all' || member.status === status;
      
      const joinDate = new Date(member.joinedAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const dateMatch = (!start || joinDate >= start) && (!end || joinDate <= end);

      return keywordMatch && roleMatch && statusMatch && dateMatch;
    });

    if (sortBy === 'reports') {
      result.sort((a, b) => b.reports - a.reports);
    } else if (sortBy === 'lastLogin') {
      result.sort((a, b) => new Date(b.lastLogin) - new Date(a.lastLogin));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
    } else {
      result.sort((a, b) => new Date(b.joinedAt) - new Date(a.joinedAt));
    }

    return result;
  }, [members, keyword, role, status, sortBy, startDate, endDate]);

  const stats = useMemo(() => {
    return {
      total: members.length,
      newToday: members.filter((m) => m.joinedAt === '2026.06.17').length,
      suspended: members.filter((m) => m.status === 'SUSPENDED').length,
      blacklisted: members.filter((m) => m.status === 'BLACKLISTED').length,
    };
  }, [members]);

  const handleReset = () => {
    setKeyword('');
    setRole('all');
    setStatus('all');
    setSortBy('latest');
    setStartDate('');
    setEndDate('');
  };

  // 정지 모달 열기
  const openSuspensionModal = (member) => {
    setTargetMember(member);
    setIsModalOpen(true);
  };

  // 정지 실행
  const confirmSuspension = () => {
    if (!targetMember) return;
    
    const today = new Date();
    today.setDate(today.getDate() + parseInt(suspensionDays));
    const endDateStr = today.toISOString().split('T')[0].replace(/-/g, '.');

    setMembers(prev => prev.map(m => 
      m.id === targetMember.id 
        ? { ...m, status: 'SUSPENDED', suspensionEndDate: endDateStr } 
        : m
    ));
    
    alert(`${targetMember.nickname} 회원이 ${suspensionDays}일간 정지되었습니다.\n종료일: ${endDateStr}`);
    setIsModalOpen(false);
    setTargetMember(null);
  };

  const handleStatusRestore = (memberId) => {
    const target = members.find(m => m.id === memberId);
    if (window.confirm(`${target.nickname} 회원의 제재를 해제하고 정상 상태로 변경하시겠습니까?`)) {
      setMembers(prev => prev.map(m => 
        m.id === memberId 
          ? { ...m, status: 'ACTIVE', suspensionEndDate: '-' } 
          : m
      ));
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 제목 */}
      <section>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">회원 관리</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">회원 정보를 조회하고 서비스 이용을 제한하거나 관리합니다.</p>
      </section>

      {/* 요약 카드 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Users} title="전체 회원" value={stats.total} unit="명" iconClass="bg-purple-50 text-[#6d3df2]" />
        <SummaryCard icon={UserPlus} title="오늘 가입" value={stats.newToday} unit="명" iconClass="bg-blue-50 text-blue-600" />
        <SummaryCard icon={UserMinus} title="정지 회원" value={stats.suspended} unit="명" iconClass="bg-orange-50 text-orange-600" />
        <SummaryCard icon={UserX} title="블랙리스트" value={stats.blacklisted} unit="명" iconClass="bg-red-50 text-red-500" />
      </section>

      {/* 검색 및 필터 UI 개선 */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">상세 검색 필터</h2>
          <button onClick={handleReset} className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-[#6d3df2] transition">
            <RotateCcw size={16} /> 필터 초기화
          </button>
        </div>

        {/* 1열: 주요 검색 필터 */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-4">
          <div>
            <label className="mb-2 block text-xs font-black text-gray-400 uppercase">검색어 (닉네임, 이메일, ID)</label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="검색어를 입력하세요..."
                className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none transition focus:border-[#6d3df2]/40 focus:bg-white"
              />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-black text-gray-400 uppercase">가입 기간 설정</label>
            <div className="flex items-center gap-2">
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#6d3df2]/40" />
              <span className="text-gray-300 font-bold">~</span>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#6d3df2]/40" />
            </div>
          </div>
        </div>

        {/* 2열: 속성 필터 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <FilterSelect label="회원 권한" value={role} onChange={setRole} options={Object.entries(ROLE_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <FilterSelect label="활동 상태" value={status} onChange={setStatus} options={Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <FilterSelect label="정렬 기준" value={sortBy} onChange={setSortBy} options={[
            { value: 'latest', label: '최근 가입순' },
            { value: 'oldest', label: '오래된 가입순' },
            { value: 'lastLogin', label: '최근 접속순' },
            { value: 'reports', label: '신고 많은순' },
          ]} />
        </div>
      </section>

      {/* 회원 목록 테이블 */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <div>
            <h2 className="text-lg font-black text-gray-900">회원 목록 <span className="ml-1 text-[#6d3df2]">{filteredMembers.length}</span></h2>
          </div>
          <div className="flex gap-2">
            <button className="h-10 px-4 rounded-xl border border-orange-100 bg-orange-50 text-xs font-black text-orange-600 hover:bg-orange-100 transition">정지 추가</button>
            <button className="h-10 px-4 rounded-xl border border-red-100 bg-red-50 text-xs font-black text-red-500 hover:bg-red-100 transition">블랙리스트 추가</button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] table-fixed text-left">
            <colgroup>
              <col className="w-[50px]" />
              <col className="w-[180px]" />
              <col className="w-[200px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col className="w-[120px]" />
              <col className="w-[140px]" />
              <col className="w-[120px]" />
              <col className="w-[80px]" />
              <col className="w-[130px]" />
            </colgroup>
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4"><input type="checkbox" className="rounded" /></th>
                <th className="px-4 py-4">회원 정보</th>
                <th className="px-4 py-4">이메일</th>
                <th className="px-4 py-4 text-center">권한</th>
                <th className="px-4 py-4 text-center">상태</th>
                <th className="px-4 py-4 text-center">가입일</th>
                <th className="px-4 py-4 text-center">최근 접속</th>
                <th className="px-4 py-4 text-center text-orange-500">제재 기한</th>
                <th className="px-4 py-4 text-right">신고</th>
                <th className="px-4 py-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="text-sm hover:bg-gray-50/50 transition">
                  <td className="px-5 py-4"><input type="checkbox" className="rounded" /></td>
                  <td className="px-4 py-4">
                    <p className="font-black text-gray-800">{member.nickname}</p>
                    <p className="text-[11px] font-bold text-gray-400">{member.id}</p>
                  </td>
                  <td className="px-4 py-4 font-medium text-gray-500 truncate">{member.email}</td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black ${roleClass[member.role]}`}>{ROLE_LABELS[member.role]}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex px-2.5 py-1 rounded-lg text-[11px] font-black ${statusClass[member.status]}`}>{STATUS_LABELS[member.status]}</span>
                  </td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">{member.joinedAt}</td>
                  <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">{member.lastLogin}</td>
                  <td className="px-4 py-4 text-center text-xs font-black text-orange-600 bg-orange-50/30">
                    {member.suspensionEndDate}
                  </td>
                  <td className="px-4 py-4 text-right font-black text-gray-400">
                    <span className={member.reports >= 5 ? 'text-red-500' : ''}>{member.reports}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button title="상세보기" className="p-2 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm text-[#6d3df2] transition"><Eye size={14} /></button>
                      {member.status === 'ACTIVE' ? (
                        <button onClick={() => openSuspensionModal(member)} title="활동 정지" className="p-2 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm text-orange-500 transition"><Lock size={14} /></button>
                      ) : (
                        <button onClick={() => handleStatusRestore(member.id)} title="제재 해제" className="p-2 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm text-emerald-500 transition"><Unlock size={14} /></button>
                      )}
                      <button title="추가 작업" className="p-2 rounded-lg border border-gray-100 hover:bg-white hover:shadow-sm text-gray-400 transition"><MoreHorizontal size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 하단 모니터링 영역 (간소화) */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <ShieldAlert size={20} className="text-red-500" />
          <h2 className="text-lg font-black text-gray-900">중점 관리 대상 (신고 5회 이상)</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.filter(m => m.reports >= 5).map(m => (
            <div key={m.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <div>
                <p className="font-black text-gray-800">{m.nickname}</p>
                <p className="text-xs font-bold text-red-500">누적 신고 {m.reports}건</p>
              </div>
              <button className="text-xs font-black text-[#6d3df2] hover:underline">상세 조치</button>
            </div>
          ))}
        </div>
      </section>

      {/* 정지 기간 설정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Clock size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900">활동 정지 기간 설정</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">
                <span className="font-black text-gray-900">{targetMember?.nickname}</span> 회원에게 적용할<br />정지 기간을 선택해주세요.
              </p>
            </div>

            <div className="mt-8 space-y-3">
              {[
                { label: '3일 정지', value: '3' },
                { label: '7일 정지', value: '7' },
                { label: '30일 정지', value: '30' },
                { label: '90일 정지', value: '90' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSuspensionDays(option.value)}
                  className={`w-full h-12 rounded-2xl border-2 text-sm font-black transition ${
                    suspensionDays === option.value 
                    ? 'border-[#6d3df2] bg-purple-50 text-[#6d3df2]' 
                    : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="h-13 flex-1 rounded-2xl bg-gray-100 text-sm font-black text-gray-500 hover:bg-gray-200 transition">취소</button>
              <button onClick={confirmSuspension} className="h-13 flex-1 rounded-2xl bg-[#6d3df2] text-sm font-black text-white shadow-lg shadow-purple-100 hover:-translate-y-0.5 transition">정지 적용</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const SummaryCard = ({ icon: Icon, title, value, unit, iconClass }) => (
  <article className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-4 ${iconClass}`}><Icon size={24} /></div>
    <p className="text-sm font-black text-gray-500">{title}</p>
    <div className="mt-1 flex items-end gap-1">
      <strong className="text-2xl font-black text-gray-950">{formatNumber(value)}</strong>
      <span className="pb-1 text-xs font-black text-gray-500">{unit}</span>
    </div>
  </article>
);

const FilterSelect = ({ label, value, onChange, options }) => (
  <div>
    <label className="mb-2 block text-xs font-black text-gray-400 uppercase">{label}</label>
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full appearance-none rounded-2xl border border-gray-100 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#6d3df2]/40">
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

export default MemberManagementPage;