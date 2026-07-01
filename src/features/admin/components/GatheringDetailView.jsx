import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Users, 
  ShieldAlert, 
  Flag, 
  Edit3, 
  Trash2, 
  User, 
  CalendarDays,
  Sparkles,
  MessageSquare,
  EyeOff,
  Eye,
  ShieldCheck,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  acceptGatheringReports, 
  deleteGatheringByAdmin,
  getGatheringReports,
  rejectGatheringReports,
  updateGatheringStatus
} from '../../../api/adminApi';

const STATUS_LABELS = {
  ACTIVE: '노출 중',
  HIDDEN: '숨김',
  BLIND: '블라인드',
};

const statusClass = {
  ACTIVE: 'bg-emerald-50 text-emerald-600 ring-emerald-100',
  HIDDEN: 'bg-orange-50 text-orange-600 ring-orange-100',
  BLIND: 'bg-rose-50 text-rose-600 ring-rose-100',
};

const GatheringDetailView = ({ gathering, onBack, onStatusChange }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReportIds, setSelectedReportIds] = useState([]);
  const [adminMemo, setAdminMemo] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await getGatheringReports(Number(gathering.id));
      if (res && res.data) {
        setReports(res.data);
      }
    } catch (error) {
      console.error("신고 내역 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [gathering.id]);

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedReportIds(reports.map(r => Number(r.report_id)));
    } else {
      setSelectedReportIds([]);
    }
  };

  const handleSelectReport = (reportId, checked) => {
    if (checked) {
      setSelectedReportIds(prev => [...prev, reportId]);
    } else {
      setSelectedReportIds(prev => prev.filter(id => id !== reportId));
    }
  };

  const handleAcceptSelected = async () => {
    if (selectedReportIds.length === 0) {
      alert("신고 승인(인정) 처리할 신고 내역을 선택해 주세요.");
      return;
    }
    if (!adminMemo.trim()) {
      alert("신고 인정 시 작성할 관리자 조치 메모를 입력해 주세요.");
      return;
    }

    if (window.confirm(`선택한 ${selectedReportIds.length}건의 신고를 승인(인정)하시겠습니까?\n\n승인 시 모임은 '블라인드' 상태로 자동 전환되며, 참여 중인 채팅방이 차단되고 방장의 신고 이력에 등록됩니다.`)) {
      setActionLoading(true);
      try {
        await acceptGatheringReports(Number(gathering.id), selectedReportIds, adminMemo.trim());
        alert("선택한 신고가 승인되어 모임이 블라인드 처리되었습니다.");
        onBack();
      } catch (error) {
        console.error("신고 승인 실패:", error);
        alert(error.response?.data?.message || "신고 승인 처리에 실패했습니다.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleRejectSelected = async () => {
    if (selectedReportIds.length === 0) {
      alert("반려 처리할 신고 내역을 선택해 주세요.");
      return;
    }

    if (window.confirm(`선택한 ${selectedReportIds.length}건의 신고를 반려하시겠습니까?\n\n반려 시 해당 신고 접수 건은 DB에서 완전히 삭제(초기화)됩니다.`)) {
      setActionLoading(true);
      try {
        await rejectGatheringReports(Number(gathering.id), selectedReportIds);
        alert("선택한 신고가 반려 처리되었습니다.");
        onBack();
      } catch (error) {
        console.error("신고 반려 실패:", error);
        alert(error.response?.data?.message || "신고 반려 처리에 실패했습니다.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = gathering.status === 'HIDDEN' ? 'ACTIVE' : 'HIDDEN';
    if (window.confirm(`모임 상태를 [${STATUS_LABELS[newStatus]}] 상태로 변경하시겠습니까?`)) {
      setActionLoading(true);
      try {
        await updateGatheringStatus(Number(gathering.id), newStatus);
        alert(`모임 노출 상태가 [${STATUS_LABELS[newStatus]}] 상태로 변경되었습니다.`);
        onBack();
      } catch (error) {
        console.error("노출 토글 실패:", error);
        alert(error.response?.data?.message || "상태 변경에 실패했습니다.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`[경고] "${gathering.title}" 모임을 영구 삭제하시겠습니까?\n\n삭제된 모임 데이터와 채팅 기록은 복구할 수 없습니다.`)) {
      setActionLoading(true);
      try {
        await deleteGatheringByAdmin(Number(gathering.id));
        alert("모임이 영구 삭제되었습니다.");
        onBack();
      } catch (error) {
        console.error("모임 삭제 실패:", error);
        alert("모임 삭제에 실패했습니다.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* 로딩 바 오버레이 */}
      {(actionLoading || loading) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] transition-all">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#6d3df2] border-t-transparent mb-3" />
          <p className="text-xs font-black text-gray-500">데이터 처리 중입니다. 잠시만 기다려주세요...</p>
        </div>
      )}

      {/* 상단 헤더 */}
      <section className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-gray-500 hover:text-[#6d3df2] hover:border-purple-200 transition-all shadow-sm"
            title="목록으로"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-950 md:text-3xl">모임 상세 관리</h1>
            <p className="mt-1 text-sm font-medium text-gray-500">모임의 원문 내용 및 신고 접수 내역을 검토하고 제재 조치를 취합니다.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {gathering.category === '축제모임' ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 border border-purple-100 select-none">
              <Sparkles size={12} /> 축제 모임
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-[11px] font-black px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 select-none">
              <MessageSquare size={12} /> 자유 모임
            </span>
          )}
          <span className={`inline-flex px-3 py-1.5 rounded-full text-xs font-black ring-1 ${statusClass[gathering.status]}`}>
            {STATUS_LABELS[gathering.status]}
          </span>
        </div>
      </section>

      {/* 모임 기본 정보 카드 */}
      <section className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black text-gray-400 block uppercase tracking-widest">ROOM TITLE</span>
              <h2 className="text-xl font-black text-gray-900 mt-1 break-all">{gathering.title}</h2>
            </div>
            {/* 모임 노출/숨김 조치 버튼 그룹 */}
            <div className="flex items-center gap-2 shrink-0">
              {gathering.status !== 'BLIND' && (
                <button
                  onClick={handleToggleStatus}
                  disabled={actionLoading}
                  className={`h-11 px-5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 ${
                    gathering.status === 'HIDDEN'
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {gathering.status === 'HIDDEN' ? <Eye size={14} /> : <EyeOff size={14} />}
                  {gathering.status === 'HIDDEN' ? '모임 노출 처리' : '모임 숨기기'}
                </button>
              )}
              <button
                onClick={handleDelete}
                disabled={actionLoading}
                className="h-11 px-5 bg-white border border-red-100 text-red-600 hover:bg-red-50 rounded-2xl text-xs font-black flex items-center gap-2 shadow-sm transition-all disabled:opacity-50"
              >
                <Trash2 size={14} />
                모임 영구 삭제
              </button>
            </div>
          </div>

          {/* 원본 모임 소개글 */}
          <div className="pt-4 border-t border-gray-50">
            <span className="text-[10px] font-black text-gray-400 block uppercase tracking-widest mb-2">모임 소개글 (원문)</span>
            <div className="text-sm font-bold text-gray-600 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 leading-relaxed whitespace-pre-wrap">
              {gathering.description || "등록된 소개 내용이 없습니다."}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t border-gray-50">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 block uppercase">방장 닉네임</span>
              <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <User size={14} className="text-gray-400" />
                {gathering.hostNickname}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 block uppercase">참여 현황</span>
              <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <Users size={14} className="text-gray-400" />
                {gathering.participants}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 block uppercase">개설 일자</span>
              <span className="text-sm font-bold text-gray-700 flex items-center gap-1.5">
                <CalendarDays size={14} className="text-gray-400" />
                {gathering.createdAt}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 신고 내역 리스트 및 개별/다중 조치 영역 */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        
        {/* 리스트 테이블 영역 */}
        <div className="lg:col-span-2 overflow-x-auto">
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 bg-white">
            <div className="flex items-center gap-2">
              <Flag size={18} className="text-red-500 animate-pulse" />
              <h3 className="text-md font-black text-gray-900">
                신고 접수 리스트 <span className="ml-1 text-red-500">{reports.length}</span>건
              </h3>
            </div>
            {selectedReportIds.length > 0 && (
              <span className="text-xs font-black text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1 rounded-full">
                {selectedReportIds.length}개 선택됨
              </span>
            )}
          </div>

          <table className="w-full min-w-[500px] text-left">
            <thead>
              <tr className="bg-gray-50/50 text-[11px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-50 select-none">
                <th className="px-6 py-4 w-[50px] text-center">
                  <input 
                    type="checkbox"
                    checked={reports.length > 0 && selectedReportIds.length === reports.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                  />
                </th>
                <th className="px-4 py-4 w-[130px]">신고자 ID</th>
                <th className="px-4 py-4">신고 사유</th>
                <th className="px-4 py-4 w-[110px] text-center">신고 일자</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold">
                    신고 내역을 불러오고 있습니다...
                  </td>
                </tr>
              ) : reports.length > 0 ? (
                reports.map((r) => (
                  <tr 
                    key={r.report_id} 
                    onClick={() => handleSelectReport(Number(r.report_id), !selectedReportIds.includes(Number(r.report_id)))}
                    className={`hover:bg-gray-50/30 transition cursor-pointer ${
                      selectedReportIds.includes(Number(r.report_id)) ? 'bg-purple-50/20' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <input 
                        type="checkbox"
                        checked={selectedReportIds.includes(Number(r.report_id))}
                        onChange={(e) => handleSelectReport(Number(r.report_id), e.target.checked)}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 cursor-pointer"
                      />
                    </td>
                    <td className="px-4 py-4 font-black text-gray-700 truncate max-w-[120px]" title={r.reporter_id}>
                      {r.reporter_id}
                    </td>
                    <td className="px-4 py-4 font-bold text-gray-600 italic break-all">
                      "{r.report_reason}"
                    </td>
                    <td className="px-4 py-4 text-center text-xs font-bold text-gray-400">
                      {new Date(r.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 font-bold">
                    접수된 신고 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 조치 처리 패널 영역 (메모 및 승인/반려 버튼 통합) */}
        <div className="p-6 bg-gray-50/50 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <Edit3 size={16} className="text-purple-600" />
              <span className="text-sm font-black text-gray-900">선택 신고 조치 메모</span>
            </div>
            
            <textarea
              value={adminMemo}
              onChange={(e) => setAdminMemo(e.target.value)}
              placeholder="선택한 신고 승인(인정) 시 기록할 조치 사유를 입력하세요..."
              className="w-full h-32 p-3 rounded-2xl border border-gray-200 bg-white text-xs font-bold text-gray-700 outline-none focus:border-purple-300 resize-none transition-all shadow-inner"
            />
            
            <div className="text-[11px] font-bold text-gray-400 leading-normal space-y-1 select-none">
              <p>• 신고 반려 시 신고 내역이 완전 삭제됩니다.</p>
              <p>• 신고 인정 시 해당 내역이 방장 이력에 적재되며 모임이 블라인드 처리됩니다.</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleAcceptSelected}
              disabled={actionLoading || selectedReportIds.length === 0}
              className="w-full h-12 bg-red-600 text-white rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldAlert size={14} />
              선택 신고 인정 (블라인드)
            </button>
            
            <button
              onClick={handleRejectSelected}
              disabled={actionLoading || selectedReportIds.length === 0}
              className="w-full h-12 bg-white border border-gray-200 text-gray-700 rounded-2xl text-xs font-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ShieldCheck size={14} className="text-emerald-500" />
              선택 신고 반려 (삭제)
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GatheringDetailView;
