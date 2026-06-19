import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  MapPin, 
  Calendar, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock
} from 'lucide-react';
import { getAdminFestivalList, updateFestivalVisibility } from '../../../api/adminApi';
import FestivalReviewManagement from '../components/FestivalReviewManagement';

const FestivalDataManagementPage = () => {
  const [activeTab, setActiveTab] = useState('INFO'); // 'INFO' or 'REPORTS'
  const [subStatus, setSubStatus] = useState('ALL'); // 'ALL', 'ONGOING', 'UPCOMING', 'COMPLETED'
  const [searchKeyword, setSearchKeyword] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');
  const [visibilityFilter, setVisibilityFilter] = useState('ALL'); // 'ALL', 'VISIBLE', 'HIDDEN'
  
  const [festivals, setFestivals] = useState([]);
  const [loading, setLoading] = useState(true);

  // 페이징 처리를 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    fetchFestivals();
  }, []);

  // 검색, 필터링 변경 시 현재 페이지 1페이지로 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [subStatus, regionFilter, searchKeyword, activeTab, visibilityFilter]);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const response = await getAdminFestivalList();
      // 데이터 구조에 따른 예외 처리
      const data = response.data?.data || response.data || [];
      setFestivals(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch festivals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDynamicStatus = (startDate, endDate) => {
    if (!startDate || !endDate) return 'UNKNOWN';

    // 오늘 날짜 구하기 (KST 기준 YYYYMMDD 포맷)
    const today = new Date();
    const todayStr =
      today.getFullYear().toString() +
      String(today.getMonth() + 1).padStart(2, '0') +
      String(today.getDate()).padStart(2, '0');

    // 하이픈 제거하여 YYYYMMDD 포맷으로 통일
    const start = String(startDate).replace(/-/g, '');
    const end = String(endDate).replace(/-/g, '');

    if (todayStr < start) return 'UPCOMING';
    if (todayStr > end) return 'COMPLETED';
    return 'ONGOING';
  };

  // 필터 및 상태 동적 처리를 적용한 축제 목록
  const processedFestivals = festivals.map(f => {
    const startDate = f.eventStartDate || f.event_start_date;
    const endDate = f.eventEndDate || f.event_end_date;
    return {
      ...f,
      status: getDynamicStatus(startDate, endDate)
    };
  });

  // 필터링된 축제 리스트 계산 (동적 상태가 반영된 processedFestivals 기준)
  const filteredFestivals = processedFestivals
    .filter(f => subStatus === 'ALL' || String(f.status).toUpperCase() === subStatus)
    .filter(f => regionFilter === 'ALL' || (f.addr1 || '').includes(regionFilter))
    .filter(f => (f.title || '').toLowerCase().includes(searchKeyword.toLowerCase()))
    .filter(f => {
      if (visibilityFilter === 'ALL') return true;
      const isVisible = f.isVisible === 'Y' || f.isVisible === true || f.is_visible === 1 || f.is_visible === 'Y' || f.is_visible === true;
      return visibilityFilter === 'VISIBLE' ? isVisible : !isVisible;
    });

  // 페이징 계산 변수들
  const totalItems = filteredFestivals.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const validCurrentPage = Math.min(currentPage, totalPages || 1);
  
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedFestivals = filteredFestivals.slice(startIndex, endIndex);

  // 표시할 페이지 번호 범위 계산 (최대 5개 버튼 표시)
  const getPageNumbers = () => {
    const maxPageButtons = 5;
    let start = Math.max(1, validCurrentPage - 2);
    let end = Math.min(totalPages, start + maxPageButtons - 1);
    if (end - start + 1 < maxPageButtons) {
      start = Math.max(1, end - maxPageButtons + 1);
    }
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleToggleVisibility = async (contentId, currentVisibility) => {
    try {
      const newVisibility = !currentVisibility;
      await updateFestivalVisibility(contentId, newVisibility);
      
      // 상태 업데이트
      setFestivals(prev => prev.map(f => {
        const id = f.contentId || f.content_id;
        if (id === contentId) {
          // DB 스펙('Y'/'N')에 맞춰 상태 업데이트
          return { 
            ...f, 
            isVisible: newVisibility ? 'Y' : 'N', 
            is_visible: newVisibility ? 'Y' : 'N' 
          };
        }
        return f;
      }));
    } catch (error) {
      console.error('Failed to update visibility:', error);
      alert('노출 여부 변경에 실패했습니다.');
    }
  };

  const getStatusBadge = (status) => {
    const s = String(status).toUpperCase();
    switch (s) {
      case 'ONGOING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-600 text-xs font-black ring-1 ring-green-100">
            <CheckCircle2 size={12} />
            진행중
          </span>
        );
      case 'UPCOMING':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-black ring-1 ring-blue-100">
            <Clock size={12} />
            진행예정
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-500 text-xs font-black ring-1 ring-gray-100">
            <AlertCircle size={12} />
            종료됨
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 text-gray-400 text-xs font-black ring-1 ring-gray-100">
            {status || '정보없음'}
          </span>
        );
    }
  };


  // 통계 계산 (동적 상태가 반영된 processedFestivals 기준)
  const stats = {
    total: processedFestivals.length,
    ongoing: processedFestivals.filter(f => String(f.status).toUpperCase() === 'ONGOING').length,
    upcoming: processedFestivals.filter(f => String(f.status).toUpperCase() === 'UPCOMING').length,
    completed: processedFestivals.filter(f => String(f.status).toUpperCase() === 'COMPLETED').length,
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-[32px] font-black text-gray-900 tracking-tight">축제 데이터 관리</h1>
          <p className="text-gray-500 font-bold mt-1">공공 데이터 동기화 및 축제 정보를 관리합니다.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchFestivals}
            className="flex h-12 items-center gap-2 rounded-2xl bg-white border border-gray-200 px-6 text-sm font-black text-gray-600 shadow-sm transition hover:bg-gray-50"
          >
            <RefreshCw size={18} className="text-gray-400" />
            데이터 동기화
          </button>
          <button className="flex h-12 items-center gap-2 rounded-2xl bg-gradient-to-r from-[#6d3df2] to-[#7c3aed] px-6 text-sm font-black text-white shadow-lg shadow-purple-100 transition hover:brightness-110">
            <Plus size={18} />
            신규 축제 등록
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-gray-100/50 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('INFO')}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === 'INFO' 
            ? 'bg-white text-[#6d3df2] shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          축제 정보 관리
        </button>
        <button
          onClick={() => setActiveTab('REPORTS')}
          className={`px-6 py-2.5 rounded-xl text-sm font-black transition-all ${
            activeTab === 'REPORTS' 
            ? 'bg-white text-[#6d3df2] shadow-sm' 
            : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          후기 관리
        </button>
      </div>

      {activeTab === 'INFO' ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: '전체 축제', value: stats.total.toLocaleString(), color: 'blue' },
              { label: '진행중', value: stats.ongoing.toLocaleString(), color: 'green' },
              { label: '진행 예정', value: stats.upcoming.toLocaleString(), color: 'purple' },
              { label: '종료', value: stats.completed.toLocaleString(), color: 'amber' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-black text-gray-900 mt-2">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Sub-tab Status Filter */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 p-1 bg-gray-100/50 rounded-2xl w-fit">
              {[
                { id: 'ALL', label: '전체 축제' },
                { id: 'ONGOING', label: '진행중' },
                { id: 'UPCOMING', label: '진행예정' },
                { id: 'COMPLETED', label: '종료' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSubStatus(tab.id)}
                  className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${
                    subStatus === tab.id 
                    ? 'bg-white text-[#6d3df2] shadow-sm' 
                    : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              <select 
                className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-purple-100"
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
              >
                <option value="ALL">전국 지역</option>
                <option value="서울">서울</option>
                <option value="경기">경기</option>
                <option value="강원">강원</option>
                <option value="인천">인천</option>
                <option value="충청">충청</option>
                <option value="전라">전라</option>
                <option value="경상">경상</option>
                <option value="제주">제주</option>
              </select>
              <select 
                className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-purple-100"
                value={visibilityFilter}
                onChange={(e) => setVisibilityFilter(e.target.value)}
              >
                <option value="ALL">모든 노출 상태</option>
                <option value="VISIBLE">노출중</option>
                <option value="HIDDEN">숨김</option>
              </select>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  type="text"
                  placeholder="축제 검색"
                  className="h-10 w-48 rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Festival List */}
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-50 bg-gray-50/50">
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider">축제 정보</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">노출 여부</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">지역</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">기간</th>
                    <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center">상태</th>
                    <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    // Skeleton Rows
                    [...Array(5)].map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-gray-200 shrink-0"></div>
                            <div className="space-y-2 flex-1">
                              <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                              <div className="h-3 bg-gray-200 rounded-md w-1/4"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className="h-6 w-11 bg-gray-200 rounded-full mx-auto"></div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className="h-4 bg-gray-200 rounded-md w-16 mx-auto"></div>
                        </td>
                        <td className="px-6 py-6 text-center">
                          <div className="space-y-1.5">
                            <div className="h-3.5 bg-gray-200 rounded-md w-24 mx-auto"></div>
                            <div className="h-3 bg-gray-200 rounded-md w-20 mx-auto"></div>
                          </div>
                        </td>
                        <td className="px-6 py-6">
                          <div className="h-6 bg-gray-200 rounded-full w-16 mx-auto"></div>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <div className="h-9 w-9 bg-gray-100 rounded-xl"></div>
                            <div className="h-9 w-9 bg-gray-100 rounded-xl"></div>
                            <div className="h-9 w-9 bg-gray-100 rounded-xl"></div>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : paginatedFestivals.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-16 text-gray-400 font-bold">
                        검색 조건에 맞는 축제가 없습니다.
                      </td>
                    </tr>
                  ) : (
                    paginatedFestivals.map((festival) => {
                      const id = festival.contentId || festival.content_id;
                      const title = festival.title;
                      const region = festival.addr1;
                      const startDate = festival.eventStartDate || festival.event_start_date;
                      const endDate = festival.eventEndDate || festival.event_end_date;
                      const imageUrl = festival.firstImage || festival.first_image;
                      const isVisible = festival.isVisible === 'Y' || festival.isVisible === true || festival.is_visible === 1 || festival.is_visible === 'Y' || festival.is_visible === true;

                      return (
                        <tr key={id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                <img src={imageUrl || 'https://via.placeholder.com/150?text=No+Image'} alt={title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-gray-900 group-hover:text-[#6d3df2] transition-colors">
                                  {title}
                                </h4>
                                <div className="flex items-center gap-1.5 mt-1 text-xs font-bold text-gray-400">
                                  <span className="text-[#6d3df2]">#KTO_API</span>
                                  <span>ID: {id}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input 
                                type="checkbox" 
                                className="sr-only peer" 
                                checked={isVisible} 
                                onChange={() => handleToggleVisibility(id, isVisible)}
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#6d3df2]"></div>
                            </label>
                            <div className="mt-1 text-[10px] font-bold text-gray-400">
                              {isVisible ? '노출중' : '숨김'}
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <div className="flex items-center gap-1 text-xs font-black text-gray-600">
                                <MapPin size={12} className="text-gray-400" />
                                {region ? region.split(' ').slice(0, 2).join(' ') : '정보없음'}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-center">
                            <div className="flex flex-col items-center gap-1 text-xs font-bold text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-gray-300" />
                                {startDate}
                              </div>
                              <div className="text-[10px] text-gray-300">~ {endDate}</div>
                            </div>
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex justify-center">
                              {getStatusBadge(festival.status)}
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition shadow-sm">
                                <Edit2 size={16} />
                              </button>
                              <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition shadow-sm">
                                <Trash2 size={16} />
                              </button>
                              <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition shadow-sm">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="px-8 py-5 border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50/30">
              <p className="text-xs font-bold text-gray-400">
                전체 {totalItems}개 중 {totalItems === 0 ? 0 : startIndex + 1} - {Math.min(endIndex, totalItems)} 표시
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={validCurrentPage === 1}
                    className={`h-9 px-3 rounded-xl border text-xs font-black transition-all ${
                      validCurrentPage === 1 
                      ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    이전
                  </button>
                  
                  {getPageNumbers().map(pageNum => (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`h-9 w-9 rounded-xl text-xs font-black transition-all ${
                        validCurrentPage === pageNum
                        ? 'bg-[#6d3df2] text-white shadow-md shadow-purple-100'
                        : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  
                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={validCurrentPage === totalPages}
                    className={`h-9 px-3 rounded-xl border text-xs font-black transition-all ${
                      validCurrentPage === totalPages 
                      ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    다음
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <FestivalReviewManagement />
      )}
    </div>
  );
};

export default FestivalDataManagementPage;