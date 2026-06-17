import React, { useMemo, useState } from 'react';
import {
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
} from 'lucide-react';

const STATUS_LABELS = {
  all: '전체 상태',
  ACTIVE: '노출 중',
  HIDDEN: '숨김',
};

const dummyGatherings = [
  {
    id: 'GAT-001',
    title: '서울 재즈 페스티벌 같이 가실 분!',
    hostNickname: '축제요정',
    category: '페스티벌',
    reports: 0,
    status: 'ACTIVE',
    createdAt: '2026.06.10',
    participants: '4/6',
    reportReason: '',
    adminMemo: '-',
  },
  {
    id: 'GAT-002',
    title: '[광고] 강남역 인근 술 모임 모집합니다',
    hostNickname: '광고천재',
    category: '자유모임',
    reports: 8,
    status: 'HIDDEN',
    createdAt: '2026.06.12',
    participants: '1/10',
    reportReason: '상업적 홍보 및 도배 행위',
    adminMemo: '1차 경고 완료',
  },
  {
    id: 'GAT-003',
    title: '워터밤 잠실 동행 구해요 (20대만)',
    hostNickname: '여름바다',
    category: '페스티벌',
    reports: 1,
    status: 'ACTIVE',
    createdAt: '2026.06.14',
    participants: '3/4',
    reportReason: '나이 제한에 따른 차별',
    adminMemo: '-',
  },
  {
    id: 'GAT-004',
    title: '부적절한 언행을 일삼는 모임입니다',
    hostNickname: '프로불편러',
    category: '자유모임',
    reports: 15,
    status: 'ACTIVE',
    createdAt: '2026.06.15',
    participants: '2/5',
    reportReason: '욕설 및 비방글 게시',
    adminMemo: '지속적인 모니터링 필요',
  },
  {
    id: 'GAT-005',
    title: '치맥 페스티벌 대구 동행 모집',
    hostNickname: '여행가족',
    category: '페스티벌',
    reports: 0,
    status: 'ACTIVE',
    createdAt: '2026.06.16',
    participants: '5/8',
    reportReason: '',
    adminMemo: '-',
  },
];

const statusClass = {
  ACTIVE: 'bg-emerald-50 text-emerald-600',
  HIDDEN: 'bg-orange-50 text-orange-600',
};

const formatNumber = (value) => Number(value || 0).toLocaleString();

const GatheringManagementPage = () => {
  const [gatherings, setGatherings] = useState(dummyGatherings);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');

  const filteredGatherings = useMemo(() => {
    let result = gatherings.filter((gat) => {
      const lowerKeyword = keyword.trim().toLowerCase();
      const keywordMatch =
        !lowerKeyword ||
        gat.title.toLowerCase().includes(lowerKeyword) ||
        gat.hostNickname.toLowerCase().includes(lowerKeyword) ||
        gat.id.toLowerCase().includes(lowerKeyword);

      const statusMatch = status === 'all' || gat.status === status;

      return keywordMatch && statusMatch;
    });

    if (sortBy === 'reports') {
      result.sort((a, b) => b.reports - a.reports);
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [gatherings, keyword, status, sortBy]);

  const stats = useMemo(() => {
    return {
      total: gatherings.length,
      reported: gatherings.filter((g) => g.reports > 0).length,
      hidden: gatherings.filter((g) => g.status === 'HIDDEN').length,
      highRisk: gatherings.filter((g) => g.reports >= 5).length,
    };
  }, [gatherings]);

  const handleReset = () => {
    setKeyword('');
    setStatus('all');
    setSortBy('latest');
  };

  const handleToggleHide = (gatId) => {
    setGatherings((prev) =>
      prev.map((g) => {
        if (g.id === gatId) {
          const newStatus = g.status === 'HIDDEN' ? 'ACTIVE' : 'HIDDEN';
          return { ...g, status: newStatus };
        }
        return g;
      })
    );
  };

  const handleDeleteGathering = (gat) => {
    if (
      window.confirm(
        `[경고] "${gat.title}" 모임을 DB에서 영구 삭제하시겠습니까?\n\n삭제 시 모든 데이터와 관련 채팅방이 즉시 제거되며 복구할 수 없습니다.`
      )
    ) {
      setGatherings((prev) => prev.filter((g) => g.id !== gat.id));
      alert('모임 데이터가 영구적으로 제거되었습니다.');
    }
  };

  const handleEditMemo = (gatId, currentMemo) => {
    const newMemo = window.prompt('관리자 조치 메모를 수정합니다:', currentMemo === '-' ? '' : currentMemo);
    if (newMemo !== null) {
      setGatherings((prev) =>
        prev.map((g) => (g.id === gatId ? { ...g, adminMemo: newMemo || '-' } : g))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 제목 */}
      <section>
        <p className="flex items-center gap-1.5 text-sm font-black text-[#6d3df2]">
          <span>FestaRoute Admin</span>
          <span>&gt;</span>
          <span>Gathering Management</span>
        </p>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>
      </section>

      {/* 모임 목록 테이블 */}
      <section className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50">
          <h2 className="text-lg font-black text-gray-900">모임 목록 <span className="ml-1 text-[#6d3df2]">{filteredGatherings.length}</span></h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] table-fixed text-left">
            <colgroup>
              <col className="w-[180px]" />
              <col className="w-[280px]" />
              <col className="w-[120px]" />
              <col className="w-[100px]" />
              <col className="w-[100px]" />
              <col className="w-[120px]" />
              <col className="w-[80px]" />
              <col className="w-[130px]" />
            </colgroup>
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-wider">
                <th className="px-6 py-4">카테고리 / ID</th>
                <th className="px-4 py-4">모임 제목</th>
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
                      <p className="font-black text-gray-800 text-xs">{gat.category}</p>
                      <p className="text-[11px] font-bold text-gray-400">{gat.id}</p>
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-700 truncate">{gat.title}</td>
                    <td className="px-4 py-4 text-center font-bold text-gray-600">{gat.hostNickname}</td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-gray-500">{gat.participants}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-[10px] font-black ${statusClass[gat.status]}`}>
                        {STATUS_LABELS[gat.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">{gat.createdAt}</td>
                    <td className="px-4 py-4 text-right font-black text-gray-400">
                      <span className={gat.reports >= 5 ? 'text-red-500' : ''}>{gat.reports}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button title="상세보기" className="p-1.5 rounded-lg border border-gray-100 hover:bg-white text-[#6d3df2] transition">
                          <Eye size={14} />
                        </button>
                        
                        <button 
                          onClick={() => handleToggleHide(gat.id)}
                          title={gat.status === 'HIDDEN' ? '노출 처리' : '목록 숨김'}
                          className={`flex h-7 w-11 items-center rounded-full p-1 transition-colors duration-200 ${
                            gat.status === 'HIDDEN' ? 'bg-orange-500' : 'bg-gray-200'
                          }`}
                        >
                          <div className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                            gat.status === 'HIDDEN' ? 'translate-x-4' : 'translate-x-0'
                          }`} />
                        </button>

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
                {gatherings.filter(g => g.reports >= 5).map((g) => (
                  <tr key={g.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-4">
                      <p className="font-black text-gray-800 truncate">{g.title}</p>
                      <p className="text-[11px] font-bold text-gray-400">{g.hostNickname}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="inline-flex h-7 w-12 items-center justify-center rounded-lg bg-red-50 font-black text-red-500 text-xs">
                        {g.reports}건
                      </span>
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
                      <button 
                        onClick={() => handleDeleteGathering(g)}
                        className="text-xs font-black text-red-500 hover:underline underline-offset-4"
                      >
                        영구 삭제
                      </button>
                    </td>
                  </tr>
                ))}
                {gatherings.filter(g => g.reports >= 5).length === 0 && (
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