import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { // 모임 신고 기능 없어서, 현재는 쓰지 않으나, 나중에 고도화 때 넣을 수도 있으니 남겨둠.
  Search,
  RotateCcw,
  Users,
  Eye,
  Trash2,
  ChevronDown,
  ShieldAlert,
  EyeOff,
  Layers,
  Flag,
  Edit3,
  X,
} from 'lucide-react';
import {
  getAdminGatherings,
  updateGatheringStatus,
  acceptGatheringReports,
  saveGatheringAdminMemo,
  deleteGatheringByAdmin,
  getGatheringReports
} from '../../../api/adminApi';

const STATUS_LABELS = {
  all: '전체 상태',
  ACTIVE: '노출 중',
  HIDDEN: '숨김',
  BLIND: '블라인드',
};

const statusClass = {
  ACTIVE: 'bg-emerald-50 text-emerald-600',
  HIDDEN: 'bg-orange-50 text-orange-600',
  BLIND: 'bg-rose-50 text-rose-600',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const GatheringManagementPage = () => {
  const navigate = useNavigate();
  const [gatherings, setGatherings] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [reportedOnly, setReportedOnly] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // 메모 모달 상태
  const [memoModal, setMemoModal] = useState({
    isOpen: false,
    gatId: null,
    tempMemo: '',
  });

  // 신고 상세 내역 모달 상태
  const [reportDetailsModal, setReportDetailsModal] = useState({
    isOpen: false,
    gatId: null,
    reports: [],
  });

  // 검색어 디바운싱 처리
  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedKeyword(keyword);
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword]);

  // 실시간 모임 목록 로드
  const fetchGatherings = async () => {
    try {
      const response = await getAdminGatherings({
        status,
        keyword: debouncedKeyword,
        sortBy,
        reportedOnly,
        page: currentPage,
        size: 10
      });
      if (response && response.data) {
        const mapped = (response.data.list || []).map(item => ({
          ...item,
          id: String(item.id),
          adminMemo: item.adminMemo || '-',
          reportReason: item.reportReason || '',
        }));
        setGatherings(mapped);
        setTotalPages(response.data.totalPages || 1);
        setTotalCount(response.data.totalElements || 0);
      }
    } catch (error) {
      console.error("모임 목록 조회 실패:", error);
    }
  };

  // 필터 조건 변경 시 페이지 번호 1로 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [status, sortBy, debouncedKeyword, reportedOnly]);

  useEffect(() => {
    fetchGatherings();
  }, [status, sortBy, debouncedKeyword, reportedOnly, currentPage]);

  const filteredGatherings = gatherings;

  const stats = useMemo(() => {
    return {
      total: gatherings.length,
      reported: gatherings.filter((g) => Number(g.reports) > 0).length,
      hidden: gatherings.filter((g) => g.status === 'HIDDEN').length,
      highRisk: gatherings.filter((g) => Number(g.reports) >= 5).length,
    };
  }, [gatherings]);

  const handleReset = () => {
    setKeyword('');
    setStatus('all');
    setSortBy('latest');
    setReportedOnly(false);
    setCurrentPage(1);
  };

  const handleToggleHide = async (gatId) => {
    const gat = gatherings.find((g) => g.id === gatId);
    if (!gat) return;
    if (gat.status === 'BLIND') {
      alert("신고 승인(블라인드) 처리된 모임은 상태를 활성화 상태로 변경할 수 없습니다.");
      return;
    }
    const newStatus = gat.status === 'HIDDEN' ? 'ACTIVE' : 'HIDDEN';
    try {
      await updateGatheringStatus(Number(gatId), newStatus);
      alert(`모임 노출 상태가 [${STATUS_LABELS[newStatus]}] 상태로 변경되었습니다.`);
      fetchGatherings();
    } catch (error) {
      console.error("노출 상태 토글 실패:", error);
      alert("모임 상태 변경에 실패했습니다.");
    }
  };

  const handleAcceptReports = async (gatId) => {
    if (
      window.confirm(
        "해당 모임방에 대한 신고를 승인(인정)하십니까?\n\n승인 시 모임은 '블라인드' 처리되며 해당 방장의 경고 이력에 신고 내역이 누적됩니다."
      )
    ) {
      try {
        const gat = gatherings.find((g) => g.id === gatId);
        const memo = gat?.adminMemo && gat.adminMemo !== '-' ? gat.adminMemo : '신고 누적으로 인한 블라인드 처리';
        await acceptGatheringReports(Number(gatId), memo);
        alert("신고가 정상적으로 승인 처리되었습니다.");
        fetchGatherings();
      } catch (error) {
        console.error("신고 승인 처리 실패:", error);
        alert("신고 승인 처리에 실패했습니다.");
      }
    }
  };

  const handleDeleteGathering = async (gat) => {
    if (
      window.confirm(
        `[경고] "${gat.title}" 모임을 DB에서 영구 삭제하시겠습니까?\n\n삭제 시 모든 데이터와 관련 채팅방이 즉시 제거되며 복구할 수 없습니다.`
      )
    ) {
      try {
        await deleteGatheringByAdmin(Number(gat.id));
        alert('모임 데이터가 영구적으로 제거되었습니다.');
        fetchGatherings();
      } catch (error) {
        console.error("모임 영구 삭제 실패:", error);
        alert("모임 영구 삭제에 실패했습니다.");
      }
    }
  };

  const handleOpenReportsModal = async (gatId) => {
    try {
      const res = await getGatheringReports(Number(gatId));
      if (res && res.data) {
        setReportDetailsModal({
          isOpen: true,
          gatId,
          reports: res.data,
        });
      }
    } catch (error) {
      console.error("신고 내역 상세 조회 실패:", error);
      alert("신고 내역을 불러오지 못했습니다.");
    }
  };

  const handleEditMemo = (gatId, currentMemo) => {
    setMemoModal({
      isOpen: true,
      gatId,
      tempMemo: currentMemo === '-' ? '' : currentMemo,
    });
  };

  const handleSaveMemo = async () => {
    try {
      await saveGatheringAdminMemo(Number(memoModal.gatId), memoModal.tempMemo);
      alert("관리자 메모가 성공적으로 업데이트되었습니다.");
      setMemoModal({ ...memoModal, isOpen: false });
      fetchGatherings();
    } catch (error) {
      console.error("메모 저장 실패:", error);
      alert("관리자 메모 저장에 실패했습니다.");
    }
  };

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

  return (
    <div className="space-y-6">
      {/* 상단 제목 */}
      <section>
        <h1 className="mt-1 text-2xl font-black tracking-tight text-gray-950 md:text-3xl">모임 관리</h1>
        <p className="mt-2 text-sm font-medium text-gray-500">
          사용자 모임 모니터링, 부적절한 모임 숨김 및 데이터 영구 삭제를 관리합니다.
        </p>
      </section>

      {/* 요약 카드 */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard icon={Layers} title="전체 모임" value={stats.total} unit="개" iconClass="bg-purple-50 text-[#6d3df2]" />
        <SummaryCard icon={Flag} title="신고된 모임" value={stats.reported} unit="개" iconClass="bg-orange-50 text-orange-600" />
        <SummaryCard icon={EyeOff} title="숨김 처리" value={stats.hidden} unit="개" iconClass="bg-slate-100 text-slate-600" />
        <SummaryCard icon={ShieldAlert} title="중점 관리" value={stats.highRisk} unit="개" iconClass="bg-red-50 text-red-500" />
      </section>

      {/* 검색 및 필터 UI (3등분 배치) */}
      <section className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-black text-gray-900">상세 검색 필터</h2>
          <button onClick={handleReset} className="inline-flex items-center gap-2 text-sm font-black text-gray-400 hover:text-[#6d3df2] transition">
            <RotateCcw size={16} /> 필터 초기화
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="mb-2 block text-xs font-black text-gray-400 uppercase">검색어</label>
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
              <input
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="제목, 호스트, ID 검색"
                className="h-12 w-full rounded-2xl border border-gray-100 bg-gray-50 pl-11 pr-4 text-sm font-bold text-gray-700 outline-none transition focus:border-[#6d3df2]/40 focus:bg-white"
              />
            </div>
          </div>
          <FilterSelect label="노출 상태" value={status} onChange={setStatus} options={Object.entries(STATUS_LABELS).map(([v, l]) => ({ value: v, label: l }))} />
          <FilterSelect label="정렬 기준" value={sortBy} onChange={setSortBy} options={[
            { value: 'latest', label: '최근 개설순' },
            { value: 'oldest', label: '오래된 가입순' },
            { value: 'reports', label: '신고 많은순' },
          ]} />
          <div>
            <label className="mb-2 block text-xs font-black text-gray-400 uppercase">신고 상태</label>
            <button
              type="button"
              onClick={() => setReportedOnly(!reportedOnly)}
              className={`h-12 w-full flex items-center justify-center gap-2 rounded-2xl border text-sm font-black transition-all ${
                reportedOnly 
                  ? 'bg-red-50 border-red-200 text-red-600 shadow-sm' 
                  : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100'
              }`}
            >
              <Flag size={16} className={reportedOnly ? 'text-red-500' : 'text-gray-400'} />
              신고된 모임 우선 확인
            </button>
          </div>
        </div>
      </section>

      {/* 모임 목록 테이블 */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <h2 className="text-lg font-black text-gray-900">모임 목록 <span className="ml-1 text-[#6d3df2]">{totalCount}</span>개</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed text-left">
            <colgroup>
              <col className="w-[150px]" />
              <col className="w-[310px]" />
              <col className="w-[120px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col className="w-[120px]" />
              <col className="w-[80px]" />
              <col className="w-[120px]" />
            </colgroup>
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">ID</th>
                <th className="px-4 py-4">모임 구분 / 제목</th>
                <th className="px-4 py-4 text-center">호스트</th>
                <th className="px-4 py-4 text-center">참여현황</th>
                <th className="px-4 py-4 text-center">상태</th>
                <th className="px-4 py-4 text-center">개설일</th>
                <th className="px-4 py-4 text-right">신고</th>
                <th className="px-4 py-4 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredGatherings.length > 0 ? (
                filteredGatherings.map((gat) => (
                  <tr key={gat.id} className="text-sm hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-gray-400">{gat.id}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-700 truncate">
                      <div className="flex items-center gap-2 min-w-0">
                        {gat.category === '축제모임' ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 shrink-0 select-none">
                            축제
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shrink-0 select-none">
                            자유
                          </span>
                        )}
                        <span className="truncate" title={gat.title}>{gat.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center font-bold text-gray-600">{gat.hostNickname}</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-gray-500">{gat.participants}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black ${statusClass[gat.status]}`}>
                        {STATUS_LABELS[gat.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">{gat.createdAt}</td>
                    <td className="px-4 py-4 text-right font-black">
                      {Number(gat.reports) > 0 ? (
                        <button 
                          onClick={() => handleOpenReportsModal(gat.id)}
                          className={`text-xs font-black hover:underline cursor-pointer transition-colors ${
                            Number(gat.reports) >= 5 
                              ? 'text-red-600 bg-red-50 border border-red-100 px-2.5 py-1 rounded-lg' 
                              : 'text-[#6d3df2] hover:text-[#5b32cc]'
                          }`}
                          title="신고 사유 리스트 조회"
                        >
                          {gat.reports}건
                        </button>
                      ) : (
                        <span className="text-gray-400 text-xs">0건</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => navigate(`/community/gathering/${gat.id}`)}
                          title="상세보기" 
                          className="p-1.5 rounded-lg border border-gray-100 hover:bg-white text-[#6d3df2] transition"
                        >
                          <Eye size={14} />
                        </button>
                        
                        <button 
                          onClick={() => handleToggleHide(gat.id)}
                          title={gat.status === 'HIDDEN' ? '노출 처리' : '목록 숨김'}
                          className={`flex h-7 w-11 items-center rounded-full p-1 transition-colors duration-200 ${
                            gat.status === 'HIDDEN' ? 'bg-orange-500' : 'bg-gray-200'
                          }`}
                          disabled={gat.status === 'BLIND'}
                        >
                          <div className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            gat.status === 'HIDDEN' ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>

                        {Number(gat.reports) > 0 && gat.status !== 'BLIND' && (
                          <button 
                            onClick={() => handleAcceptReports(gat.id)}
                            title="신고 승인(블라인드)" 
                            className="p-1.5 rounded-lg border border-gray-100 hover:bg-red-50 text-red-600 transition"
                          >
                            <Flag size={14} />
                          </button>
                        )}

                        <button 
                          onClick={() => handleDeleteGathering(gat)}
                          title="영구 삭제" 
                          className="p-1.5 rounded-lg border border-gray-100 hover:bg-red-50 text-red-500 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-16 text-center">
                    <p className="text-sm font-black text-gray-400">조회된 모임이 없습니다.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="py-8 border-t border-gray-50 bg-white">
          <div className="flex items-center justify-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} 
              disabled={currentPage === 1} 
              className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <ChevronDown size={18} className="rotate-90" />
            </button>

            {visiblePages.map((pageNum) => (
               <button
                 key={pageNum}
                 onClick={() => setCurrentPage(pageNum)}
                 className={`h-10 w-10 rounded-xl text-sm font-black transition-all ${
                   currentPage === pageNum 
                     ? 'bg-[#6d3df2] text-white shadow-lg shadow-purple-100' 
                     : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                 }`}
               >
                 {pageNum}
               </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} 
              disabled={currentPage === totalPages} 
              className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-all"
            >
              <ChevronDown size={18} className="-rotate-90" />
            </button>
          </div>
        </div>
      </section>

      {/* 하단 중점 모니터링 영역 (메모 수정 버튼 명시화) */}
      <section>
        <article className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <ShieldAlert size={22} className="text-red-500" />
            <h2 className="text-lg font-black text-gray-900">신고 누적 모임 집중 모니터링</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] table-fixed text-left">
              <colgroup>
                <col className="w-[200px]" />
                <col className="w-[120px]" />
                <col className="w-[300px]" />
                <col className="w-[200px]" />
                <col className="w-[120px]" />
              </colgroup>
              <thead>
                <tr className="text-xs font-black text-gray-400 uppercase tracking-wider border-b border-gray-50">
                  <th className="px-4 py-3">모임 제목 / 호스트</th>
                  <th className="px-4 py-3 text-center">누적 신고</th>
                  <th className="px-4 py-3">주요 신고 사유</th>
                  <th className="px-4 py-3 text-center">관리자 메모</th>
                  <th className="px-4 py-3 text-center">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {gatherings.filter(g => Number(g.reports) >= 5).map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-4">
                      <p className="font-black text-gray-800 truncate">{g.title}</p>
                      <p className="text-[11px] font-bold text-gray-400">{g.hostNickname}</p>
                    </td>
                    <td className="px-4 py-4 text-center animate-pulse">
                      <button 
                        onClick={() => handleOpenReportsModal(g.id)}
                        className="inline-flex h-7 px-3 items-center justify-center rounded-lg bg-red-50 font-black text-red-500 text-xs hover:underline cursor-pointer border border-red-100"
                        title="신고 사유 리스트 조회"
                      >
                        {g.reports}건
                      </button>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-semibold text-gray-600 italic">"{g.reportReason}"</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="group flex items-center justify-center gap-2 cursor-pointer" onClick={() => handleEditMemo(g.id, g.adminMemo)}>
                        <span className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-500 text-[11px] font-black truncate max-w-[160px] block transition group-hover:bg-purple-50 group-hover:text-[#6d3df2]">
                          {g.adminMemo}
                        </span>
                        <Edit3 size={12} className="text-gray-300 transition group-hover:text-[#6d3df2]" />
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {g.status !== 'BLIND' && (
                          <>
                            <button 
                              onClick={() => handleAcceptReports(g.id)}
                              className="text-xs font-black text-purple-600 hover:underline underline-offset-4"
                            >
                              신고 인정
                            </button>
                            <span className="text-gray-200 text-xs">|</span>
                          </>
                        )}
                        <button 
                          onClick={() => handleDeleteGathering(g)}
                          className="text-xs font-black text-red-500 hover:underline underline-offset-4"
                        >
                          영구 삭제
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {gatherings.filter(g => Number(g.reports) >= 5).length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-10 text-center text-xs font-bold text-gray-400">
                      현재 집중 모니터링 대상인 모임이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      {/* 메모 수정 모달 */}
      <MemoEditModal 
        isOpen={memoModal.isOpen}
        onClose={() => setMemoModal({ ...memoModal, isOpen: false })}
        onSave={handleSaveMemo}
        value={memoModal.tempMemo}
        setValue={(val) => setMemoModal({ ...memoModal, tempMemo: val })}
      />

      {/* 신고 내역 상세 모달 */}
      <ReportDetailsModal
        isOpen={reportDetailsModal.isOpen}
        onClose={() => setReportDetailsModal({ ...reportDetailsModal, isOpen: false })}
        reports={reportDetailsModal.reports}
      />
    </div>
  );
};

// --- 서브 컴포넌트 ---

const ReportDetailsModal = ({ isOpen, onClose, reports }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-red-50 rounded-2xl text-red-500">
              <Flag size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">신고 접수 내역</h3>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">REPORTED REASONS</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-7 max-h-96 overflow-y-auto space-y-4">
          {reports && reports.length > 0 ? (
            reports.map((r, idx) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                <div className="flex items-center justify-between text-xs font-black text-gray-400 mb-2">
                  <span>신고자: {r.reporter_id}</span>
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-bold text-gray-700 leading-relaxed italic">
                  "{r.report_reason}"
                </p>
              </div>
            ))
          ) : (
            <p className="text-center py-6 text-sm font-black text-gray-400">
              접수된 신고 내역이 없습니다.
            </p>
          )}
        </div>

        <div className="p-7 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl bg-gray-900 text-sm font-black text-white hover:bg-gray-800 transition-all shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

const MemoEditModal = ({ isOpen, onClose, onSave, value, setValue }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center bg-purple-50 rounded-2xl text-[#6d3df2]">
              <Edit3 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-900 leading-tight">관리자 메모 수정</h3>
              <p className="text-[11px] font-bold text-gray-400 mt-0.5">ADMINISTRATOR NOTE</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-2.5 hover:bg-gray-100 rounded-2xl text-gray-400 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-7">
          <label className="block text-[11px] font-black text-gray-400 uppercase mb-3 ml-1 tracking-wider">메모 내용</label>
          <textarea
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="관리자 조치 사항 또는 특이사항을 입력하세요..."
            className="w-full h-40 p-5 rounded-[24px] border border-gray-100 bg-gray-50 text-sm font-bold text-gray-700 outline-none transition focus:border-[#6d3df2]/40 focus:bg-white resize-none placeholder:text-gray-300"
          />
          <div className="mt-4 flex items-start gap-2 px-1">
            <div className="mt-1 h-1 w-1 rounded-full bg-[#6d3df2]" />
            <p className="text-[11px] text-gray-400 font-bold leading-relaxed">
              입력하신 내용은 해당 모임의 <span className="text-[#6d3df2]">집중 모니터링 영역</span>에 즉시 반영되어 관리자 간 공유됩니다.
            </p>
          </div>
        </div>

        <div className="p-7 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-14 rounded-2xl border border-gray-100 bg-white text-sm font-black text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-all"
          >
            취소
          </button>
          <button
            onClick={onSave}
            className="flex-1 h-14 rounded-2xl bg-[#6d3df2] text-sm font-black text-white shadow-[0_8px_20px_rgba(109,61,242,0.15)] hover:bg-[#5b32cc] hover:shadow-[0_8px_25px_rgba(109,61,242,0.25)] transition-all"
          >
            변경사항 저장
          </button>
        </div>
      </div>
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

export default GatheringManagementPage;