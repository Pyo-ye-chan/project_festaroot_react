import React, { useEffect, useMemo, useState } from 'react';
import {
  Search,
  RotateCcw,
  Users,
  UserPlus,
  UserMinus,
  UserX,
  ShieldAlert,
  Eye,
  ChevronDown,
  Ban,
  Lock,
  Unlock,
  Clock,
  X,
  AlertTriangle
} from 'lucide-react';
import useLoadingStore from '../../../store/useLoadingStore';
import adminMemberApi from '../../../api/adminApiHN';

const ROLE_LABELS = {
  all: '전체 권한',
  USER: '일반 회원',
  ADMIN: '관리자',
};

const STATUS_LABELS = {
  all: '전체 상태',
  ACTIVE: '정상',
  DELETED: '탈퇴',
  SUSPENDED: '정지',
  BLACKLISTED: '블랙리스트'
};

const PROVIDER_LABELS = {
  LOCAL: '일반',
  KAKAO: '카카오',
  NAVER: '네이버',
  GOOGLE: '구글'
};

const REPORT_STATUS_LABELS = {
  PENDING: '대기중',
  ACCEPTED: '승인됨',
  REJECTED: '반려됨'
};

const REPORT_TYPE_LABELS = {
  POST: '게시글',
  COMMENT: '댓글',
  REVIEW: '리뷰'
};

const REASON_LABELS = {
  INAPPROPRIATE: '부적절한 내용',
  AD_SPAM: '광고/스팸',
  ABUSE_SLANDER: '욕설/비방',
  PRIVACY_VIOLATION: '개인정보 침해',
  FALSE_INFORMATION: '허위 정보',
  ETC: '기타 사유'
};

const reportStatusClass = {
  PENDING: 'bg-amber-50 text-amber-600 border border-amber-200',
  ACCEPTED: 'bg-red-50 text-red-600 border border-red-200',
  REJECTED: 'bg-gray-50 text-gray-500 border border-gray-200'
};

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
  LOCAL: 'bg-slate-100 text-slate-500',
  KAKAO: 'bg-yellow-100 text-yellow-700',
  NAVER: 'bg-emerald-100 text-emerald-700',
  GOOGLE: 'bg-red-50 text-red-500',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const formatDateOnly = (value) => {
  if (!value) return '-';
  return value.length >= 10 ? value.substring(0, 10) : value;
};

const MemberManagementPage = () => {
  const [members, setMembers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [mainStats, setMainStats] = useState({ total: 0, newToday: 0, suspended: 0, blacklisted: 0 });
  const [keyword, setKeyword] = useState('');
  const [role, setRole] = useState('all');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [targetMember, setTargetMember] = useState(null);
  const [suspensionDays, setSuspensionDays] = useState('7');

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [cautionMembers, setCautionMembers] = useState([]);

  const { isLoading, startLoading, stopLoading } = useLoadingStore();

  const fetchStats = async () => {
    try {
      const data = await adminMemberApi.getMainStats();
      setMainStats(data);
    } catch (error) {
      console.error("통계 정보를 가져오는 중 오류 발생 : ", error);
    }
  };

  const fetchMembers = async () => {
    try {
      startLoading();
      const rawParam = {
        keyword: keyword.trim() || null,
        role: role === 'all' ? null : role,
        status: status === 'all' ? null : status,
        sortBy,
        startDate: startDate || null,
        endDate: endDate || null,
        page: currentPage,
        size: 10,
      };

      const cleanParam = Object.fromEntries(
        Object.entries(rawParam).filter(([_, value]) => value !== null && value !== undefined)
      );

      const response = await adminMemberApi.getMembers(cleanParam);
      setMembers(response.memberList || []);
      setTotalPages(response.totalPages || 1);
      setTotalCount(response.totalElements || 0);
    } catch (error) {
      console.error("회원 목록을 불러오는 중 에러 발생 : ", error);
    } finally {
      stopLoading();
    }
  };

  const fetchCautionMembers = async () => {
    try {
      const data = await adminMemberApi.getCautionMembers();
      setCautionMembers(data || []);
    } catch (error) {
      console.error("주의 대상 회원 목록 수집 중 에러 : ", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchCautionMembers();
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [keyword, role, status, sortBy, startDate, endDate, currentPage]);

  const displayedMembers = useMemo(() => {
    return members.filter((m) => m.role !== 'ADMIN');
  }, [members]);

  const visiblePages = useMemo(() => {
    const maxButtons = 5;
    let start = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let end = Math.min(totalPages, start + maxButtons - 1);

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  const handleReset = () => {
    setKeyword('');
    setRole('all');
    setStatus('all');
    setSortBy('latest');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const handleOpenDetail = async (id) => {
    try {
      startLoading();
      const data = await adminMemberApi.getMemberDetail(id);
      setDetailData(data);
      setIsDetailModalOpen(true);
    } catch (error) {
      alert("회원 상세 정보를 가져오는 중 오차가 발생했습니다.");
    } finally {
      stopLoading();
    }
  };

  const openSuspensionModal = (member) => {
    setTargetMember(member);
    setIsModalOpen(true);
  };

  const confirmSuspension = async () => {
    if (!targetMember) return;
    try {
      await adminMemberApi.suspendMember(targetMember.id, parseInt(suspensionDays));
      alert(`${targetMember.nickname} 회원의 정지 처리가 완료되었습니다.`);
      setIsModalOpen(false);
      setTargetMember(null);
      fetchMembers();
      fetchStats();
      fetchCautionMembers();
      if (isDetailModalOpen && detailData?.memberInfo?.id == targetMember.id) {
        handleOpenDetail(targetMember.id);
      }
    } catch (error) {
      alert("정지 처리 중 오류가 발생했습니다.");
    }
  };

  const openBlacklistModal = (member) => {
    setTargetMember(member);
    setIsBlacklistModalOpen(true);
  };

  const confirmBlacklist = async () => {
    if (!targetMember) return;
    try {
      await adminMemberApi.blacklistMember(targetMember.id);
      alert("블랙리스트로 등록되었습니다.");
      setIsBlacklistModalOpen(false);
      setTargetMember(null);
      fetchMembers();
      fetchStats();
      fetchCautionMembers();
      if (isDetailModalOpen && detailData?.memberInfo?.id == targetMember.id) {
        handleOpenDetail(targetMember.id);
      }
    } catch (error) {
      alert("블랙리스트 등록 중 오류가 발생했습니다.");
    }
  };

  const handleStatusRestore = async (memberId) => {
    const target = members.find(m => m.id === memberId) || (detailData?.memberInfo?.id === memberId ? detailData.memberInfo : null);
    if (!target) return;
    if (window.confirm(`${target.nickname} 회원의 제재를 해제하고 정상 상태로 변경하시겠습니까?`)) {
      try {
        await adminMemberApi.restoreMember(memberId);
        alert("제재가 해제되었습니다.");
        fetchMembers();
        fetchStats();
        fetchCautionMembers();
        if (isDetailModalOpen && detailData?.memberInfo?.id == memberId) {
          handleOpenDetail(memberId);
        }
      } catch (error) {
        alert("제재 해제 중 오류가 발생했습니다.");
      }
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
        <SummaryCard icon={Users} title="전체 회원" value={mainStats.total} unit="명" iconClass="bg-purple-50 text-[#6d3df2]" />
        <SummaryCard icon={UserPlus} title="오늘 가입" value={mainStats.newToday} unit="명" iconClass="bg-blue-50 text-blue-600" />
        <SummaryCard icon={UserMinus} title="정지 회원" value={mainStats.suspended} unit="명" iconClass="bg-orange-50 text-orange-600" />
        <SummaryCard icon={UserX} title="블랙리스트" value={mainStats.blacklisted} unit="명" iconClass="bg-red-50 text-red-500" />
      </section>

      {/* 검색 및 필터 UI */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">상세 검색 필터</h2>
          <button onClick={handleReset} className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-[#6d3df2] transition">
            <RotateCcw size={16} /> 필터 초기화
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-9 space-y-5">
            <div>
              <label className="mb-2 block text-xs font-black text-gray-400 uppercase">검색어 (닉네임, 이메일, ID)</label>
              <div className="relative">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  value={keyword}
                  onChange={(e) => { setKeyword(e.target.value); setCurrentPage(1); }}
                  placeholder="검색어를 입력하세요..."
                  className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none transition focus:border-[#6d3df2]/40 focus:bg-white"
                />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-xs font-black text-gray-400 uppercase">가입 기간 설정</label>
              <div className="flex items-center gap-2">
                <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }} className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#6d3df2]/40" />
                <span className="text-gray-300 font-bold">~</span>
                <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }} className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 px-4 text-xs font-bold text-gray-700 outline-none focus:bg-white focus:border-[#6d3df2]/40" />
              </div>
            </div>
          </div>

          <div className="md:col-span-3 space-y-5">
            <FilterSelect
              label="활동 상태"
              value={status}
              onChange={(v) => { setStatus(v); setCurrentPage(1); }}
              options={Object.entries(STATUS_LABELS)
                .filter(([key]) => key !== 'INACTIVE')
                .map(([v, l]) => ({ value: v, label: l }))}
            />
            <FilterSelect label="정렬 기준" value={sortBy} onChange={(v) => { setSortBy(v); setCurrentPage(1); }} options={[
              { value: 'latest', label: '최근 가입순' },
              { value: 'oldest', label: '오래된 가입순' },
              { value: 'lastLogin', label: '최근 접속순' },
              { value: 'reports', label: '신고 많은순' },
            ]} />
          </div>
        </div>
      </section>

      {/* 회원 목록 테이블 */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <h2 className="text-lg font-black text-gray-900">회원 목록 <span className="ml-1 text-[#6d3df2]">{totalCount}</span> 명</h2>
          <div className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
            한 페이지에 10명씩 표시됩니다
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px] table-fixed text-left">
            <colgroup><col className="w-[60px]" /><col className="w-[200px]" /><col className="w-[100px]" /><col className="w-[200px]" /><col className="w-[90px]" /><col className="w-[90px]" /><col className="w-[110px]" /><col className="w-[110px]" /><col className="w-[100px]" /><col className="w-[60px]" /><col className="w-[120px]" /></colgroup>
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <th className="px-5 py-4 text-center">No.</th>
                <th className="px-4 py-4">닉네임 / ID</th>
                <th className="px-4 py-4 text-center">가입 경로</th>
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
              {isLoading && !isDetailModalOpen ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center font-bold text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#6d3df2] border-t-transparent" />
                      데이터 불러오는 중입니다...
                    </div>
                  </td>
                </tr>
              ) : displayedMembers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-16 text-center font-bold text-gray-400">
                    조회된 회원이 없습니다.
                  </td>
                </tr>
              ) : (
                displayedMembers.map((member, index) => (
                  <tr key={`${member.id}-${index}`} className="text-sm hover:bg-gray-50/50 transition">
                    <td className="px-5 py-4 text-center text-xs font-bold text-gray-400">
                      {(currentPage - 1) * 10 + index + 1}
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-black text-gray-800 truncate">{member.nickname}</p>
                      <p className="text-[11px] font-bold text-gray-400 truncate max-w-[160px]" title={member.id}>{member.id}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${providerClass[member.provider]}`}>
                        {PROVIDER_LABELS[member.provider]}
                      </span>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-500 truncate">{member.email}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${roleClass[member.role]}`}>{ROLE_LABELS[member.role]}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${statusClass[member.status]}`}>{STATUS_LABELS[member.status]}</span>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">{formatDateOnly(member.joinedAt)}</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">{formatDateOnly(member.lastLogin)}</td>
                    <td className="px-4 py-4 text-center text-xs font-black text-orange-600 bg-orange-50/30">{formatDateOnly(member.suspensionEndDate)}</td>
                    <td className="px-4 py-4 text-right font-black text-gray-400">
                      <span>{member.reports}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => handleOpenDetail(member.id)} title="상세보기" className="p-1.5 rounded-lg border border-gray-100 hover:bg-white text-[#6d3df2] transition"><Eye size={13} /></button>

                        <button
                          onClick={() => member.status === 'SUSPENDED' ? handleStatusRestore(member.id) : openSuspensionModal(member)}
                          title={member.status === 'SUSPENDED' ? "제재 해제 복원" : "활동 정지 조치"}
                          className={`p-1.5 rounded-lg border transition ${member.status === 'SUSPENDED'
                            ? 'bg-orange-500 border-orange-500 text-white hover:bg-orange-600'
                            : 'border-gray-100 hover:bg-white text-orange-500'
                            }`}
                        >
                          {member.status === 'SUSPENDED' ? <Unlock size={13} /> : <Lock size={13} />}
                        </button>

                        <button
                          onClick={() => member.status === 'BLACKLISTED' ? handleStatusRestore(member.id) : openBlacklistModal(member)}
                          title={member.status === 'BLACKLISTED' ? "제재 해제 복원" : "블랙리스트 등록"}
                          className={`p-1.5 rounded-lg border transition ${member.status === 'BLACKLISTED'
                            ? 'bg-red-500 border-red-500 text-white hover:bg-red-600'
                            : 'border-gray-100 hover:bg-white text-red-500'
                            }`}
                        >
                          <Ban size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="py-8 border-t border-gray-50">
          <div className="flex items-center justify-center gap-2">
            <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"><ChevronDown size={18} className="rotate-90" /></button>

            {visiblePages.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-10 w-10 rounded-xl text-sm font-black transition-all ${currentPage === pageNum ? 'bg-[#6d3df2] text-white shadow-lg shadow-purple-100' : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'}`}
              >
                {pageNum}
              </button>
            ))}

            <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"><ChevronDown size={18} className="-rotate-90" /></button>
          </div>
        </div>
      </section>

      {/* 하단 모니터링 영역 */}
      <section>
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ShieldAlert size={22} className="text-red-500" />
              <h2 className="text-lg font-black text-gray-900">주의 대상 회원 집중 모니터링</h2>
            </div>
            <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1 rounded-lg border border-red-100">승인된 제재 3회 이상 상시 추적</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed text-left">
              <colgroup><col className="w-[180px]" /><col className="w-[100px]" /><col className="w-[110px]" /><col className="w-[270px]" /><col className="w-[120px]" /><col className="w-[100px]" /></colgroup>
              <thead>
                <tr className="text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-50 bg-gray-50/30">
                  <th className="px-4 py-3">회원 정보</th>
                  <th className="px-4 py-3 text-center">활동 상태</th>
                  <th className="px-4 py-3 text-center">누적 제재 / 등급</th>
                  <th className="px-4 py-3">최근 신고 승인 사유</th>
                  <th className="px-4 py-3 text-center">최근 처리일</th>
                  <th className="px-4 py-3 text-center">조치</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {cautionMembers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-16 text-center font-bold text-gray-400 bg-gray-50/10">
                      집중 모니터링 조건(승인 3회 이상)에 부합하는 위험 회원이 없습니다.
                    </td>
                  </tr>
                ) : (
                  cautionMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-red-50/10 transition">
                      <td className="px-4 py-4">
                        <p className="font-black text-gray-800">{m.nickname}</p>
                        <p className="text-[11px] font-bold text-gray-400">{m.id}</p>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-black ${statusClass[m.status]}`}>{STATUS_LABELS[m.status]}</span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-black text-red-600 text-xs">{m.reports}건 승인</span>
                          {m.reports >= 5 ? (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-600 text-white font-black animate-pulse">위험군</span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500 text-white font-black">주의군</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-gray-600 truncate" title={m.reportReason}>
                        {REASON_LABELS[m.reportReason] || m.reportReason || '사유 없음'}
                      </td>
                      <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">{formatDateOnly(m.lastReportDate)}</td>
                      <td className="px-4 py-4 text-center">
                        <button onClick={() => handleOpenDetail(m.id)} className="text-xs font-black text-[#6d3df2] hover:underline underline-offset-4">상세 조치</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* 활동 정지 설정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500"><Clock size={28} /></div>
              <h3 className="text-xl font-black text-gray-900">활동 정지 기간 설정</h3>
              <p className="mt-2 text-sm font-medium text-gray-500"><span className="font-black text-gray-900">{targetMember?.nickname}</span> 회원에게 적용할<br />정지 기간을 선택해주세요.</p>
            </div>
            <div className="mt-8 space-y-3">
              {[{ label: '3일 정지', value: '3' }, { label: '7일 정지', value: '7' }, { label: '30일 정지', value: '30' }, { label: '90일 정지', value: '90' }].map((option) => (
                <button key={option.value} onClick={() => setSuspensionDays(option.value)} className={`w-full h-12 rounded-2xl border-2 text-sm font-black transition ${suspensionDays === option.value ? 'border-[#6d3df2] bg-purple-50 text-[#6d3df2]' : 'border-gray-50 bg-gray-50 text-gray-500 hover:border-gray-200'}`}>{option.label}</button>
              ))}
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => { setIsModalOpen(false); setTargetMember(null); }} className="h-13 flex-1 rounded-2xl bg-gray-100 text-sm font-black text-gray-500 hover:bg-gray-200 transition">취소</button>
              <button onClick={confirmSuspension} className="h-13 flex-1 rounded-2xl bg-[#6d3df2] text-sm font-black text-white shadow-lg shadow-purple-100 hover:-translate-y-0.5 transition">정지 적용</button>
            </div>
          </div>
        </div>
      )}

      {/* 블랙리스트 영구 등록 확인 모달 */}
      {isBlacklistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500"><Ban size={28} /></div>
              <h3 className="text-xl font-black text-gray-900">블랙리스트 영구 등록</h3>
              <p className="mt-2 text-sm font-medium text-gray-500">
                <span className="font-black text-gray-900">{targetMember?.nickname}</span> 회원을 블랙리스트로 등록하시겠습니까?<br />
                <span className="text-red-500 font-bold mt-1 block">등록 시 영구적으로 서비스 이용이 제한됩니다.</span>
              </p>
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => { setIsBlacklistModalOpen(false); setTargetMember(null); }} className="h-13 flex-1 rounded-2xl bg-gray-100 text-sm font-black text-gray-500 hover:bg-gray-200 transition">취소</button>
              <button onClick={confirmBlacklist} className="h-13 flex-1 rounded-2xl bg-red-500 text-sm font-black text-white shadow-lg shadow-red-100 hover:-translate-y-0.5 transition">영구 등록</button>
            </div>
          </div>
        </div>
      )}

      {/* 회원 요약 정보 및 신고 기록 리스트 디테일 모달 */}
      {isDetailModalOpen && detailData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
            {/* 헤더 */}
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center text-[#6d3df2]"><Eye size={20} /></div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">회원 관리 상세 검토</h3>
                  <p className="text-xs font-bold text-gray-400">ID: {detailData.memberInfo.id}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="p-2 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-gray-700 hover:bg-gray-50 transition"><X size={18} /></button>
            </div>

            {/* 메인 레이아웃 본문 */}
            <div className="p-8 flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* 좌측 요약 영역 */}
              <div className="lg:col-span-4 space-y-5">
                <div className="rounded-2xl border border-gray-100 bg-gray-50/30 p-5 space-y-4">
                  <div className="text-center pb-4 border-b border-gray-100">
                    <p className="text-xl font-black text-gray-900">{detailData.memberInfo.nickname}</p>
                    <p className="text-sm text-gray-400 font-semibold mt-0.5">{detailData.memberInfo.email}</p>
                    <div className="mt-3 flex justify-center gap-1.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${statusClass[detailData.memberInfo.status]}`}>{STATUS_LABELS[detailData.memberInfo.status]}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${roleClass[detailData.memberInfo.role]}`}>{ROLE_LABELS[detailData.memberInfo.role]}</span>
                    </div>
                  </div>
                  <div className="space-y-3 text-xs font-bold text-gray-500">
                    <div className="flex justify-between"><span>가입 경로</span><span className={`px-1.5 py-0.5 rounded font-black ${providerClass[detailData.memberInfo.provider]}`}>{PROVIDER_LABELS[detailData.memberInfo.provider]}</span></div>
                    <div className="flex justify-between"><span>현재 레벨</span><span className="text-gray-900 font-black">LV. {detailData.memberInfo.currentLv || 1}</span></div>
                    <div className="flex justify-between"><span>누적 신고 횟수</span><span className="text-red-500 font-black">{detailData.memberInfo.reports} 건</span></div>
                    <div className="flex justify-between"><span>가입 일시</span><span className="text-gray-700">{formatDateOnly(detailData.memberInfo.joinedAt)}</span></div>
                    <div className="flex justify-between"><span>최근 로그인</span><span className="text-gray-700">{formatDateOnly(detailData.memberInfo.lastLogin)}</span></div>
                    <div className="flex justify-between"><span>제재 해제 기한</span><span className="text-orange-600 font-black bg-orange-50 px-1.5 rounded">{formatDateOnly(detailData.memberInfo.suspensionEndDate)}</span></div>
                  </div>
                </div>
                <div className="rounded-2xl border border-gray-100 p-5 space-y-3 bg-white">
                  <p className="text-xs font-black text-gray-400 uppercase tracking-wider">이 회원 즉시 조치</p>
                  <div className="grid grid-cols-2 gap-2">
                    {detailData.memberInfo.status === 'ACTIVE' ? (
                      <button onClick={() => { openSuspensionModal(detailData.memberInfo); }} className="h-11 rounded-xl bg-orange-50 border border-orange-100 text-orange-600 font-black text-xs hover:bg-orange-100 transition flex items-center justify-center gap-1"><Lock size={12} /> 활동 정지</button>
                    ) : (
                      <button onClick={() => handleStatusRestore(detailData.memberInfo.id)} className="h-11 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 font-black text-xs hover:bg-emerald-100 transition flex items-center justify-center gap-1"><Unlock size={12} /> 제재 해제</button>
                    )}
                    <button onClick={() => openBlacklistModal(detailData.memberInfo)} className="h-11 rounded-xl bg-red-50 border border-red-100 text-red-500 font-black text-xs hover:bg-red-100 transition flex items-center justify-center gap-1"><Ban size={12} /> 블랙리스트</button>
                  </div>
                </div>
              </div>

              {/* 우측 타임라인 리스트 영역 */}
              <div className="lg:col-span-8 flex flex-col min-h-[350px]">
                <div className="flex items-center gap-1.5 mb-3">
                  <AlertTriangle size={16} className="text-gray-500" />
                  <p className="text-sm font-black text-gray-800">신고 접수 및 처리 히스토리 타임라인</p>
                </div>
                <div className="border border-gray-100 rounded-2xl overflow-hidden flex-1 overflow-x-auto bg-white max-h-[400px]">
                  <table className="w-full min-w-[650px] text-left border-collapse table-fixed">
                    <thead>
                      <tr className="bg-gray-50 text-[11px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
                        <th className="px-4 py-3 w-[120px]">구분 / 번호</th>
                        <th className="px-4 py-3 w-[150px]">신고 사유</th>
                        <th className="px-4 py-3 w-[90px] text-center">심사 결과</th>
                        <th className="px-4 py-3 w-[180px]">게시글 담당 메모</th>
                        <th className="px-4 py-3 w-[120px] text-center">접수 날짜</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-xs font-semibold text-gray-600">
                      {detailData.reportHistory.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-4 py-16 text-center font-bold text-gray-400 bg-gray-50/10">이 회원에 대해 인입된 게시글/댓글 신고 이력이 전혀 존재하지 않습니다.</td>
                        </tr>
                      ) : (
                        detailData.reportHistory.map((item) => (
                          <tr key={item.historyId} className="hover:bg-gray-50/40 transition">
                            <td className="px-4 py-3.5">
                              <div className="flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-black text-[10px]">{REPORT_TYPE_LABELS[item.reportType] || item.reportType}</span>
                                <span className="text-[10px] text-[#6d3df2] font-black font-mono" title="원본 신고 번호">#{item.reportId || item.historyId}</span>
                              </div>
                              <p className="text-[10px] text-gray-400 mt-1 truncate">신고자: {item.reporterId || '비회원'}</p>
                            </td>
                            <td className="px-4 py-3.5 break-words whitespace-normal font-bold pr-2 text-gray-700" title={item.reason}>{REASON_LABELS[item.reason] || item.reason}</td>
                            <td className="px-4 py-3.5 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-black ${reportStatusClass[item.resultStatus]}`}>{REPORT_STATUS_LABELS[item.resultStatus]}</span>
                            </td>
                            <td className="px-4 py-3.5 font-medium text-gray-500 break-words whitespace-normal" title={item.adminMemo}>{item.adminMemo || '-'}</td>
                            <td className="px-4 py-3.5 text-center text-[11px] font-bold text-gray-400">{formatDateOnly(item.createdAt)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
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
    <div className="mt-1 flex items-end gap-1"><strong className="text-2xl font-black text-gray-950">{formatNumber(value)}</strong><span className="pb-1 text-xs font-black text-gray-500">{unit}</span></div>
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