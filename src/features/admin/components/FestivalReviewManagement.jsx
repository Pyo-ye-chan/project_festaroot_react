import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Trash2, 
  EyeOff, 
  Eye, 
  AlertTriangle, 
  Star, 
  CheckCircle
} from 'lucide-react';
import { 
  getAdminReviews, 
  updateReviewStatus, 
  dismissReviewReports, 
  deleteReview 
} from '../../../api/adminApi';

const INITIAL_REVIEWS_FALLBACK = [
  {
    review_id: 1,
    content_id: 1001,
    festival_title: "진해군항제",
    member_id: "user_korean_01",
    rating: 2.0,
    content: "축제장 음식이 너무 비싸고 위생이 불량합니다. 닭꼬치 하나에 만원이라니 너무하네요.",
    visit_date: "2026-04-01",
    report_count: 3,
    created_at: "2026-04-01T12:00:00",
    updated_at: "2026-04-01T12:00:00",
    is_deleted: "N",
    nickname: "홍길동",
    images: [
      { image_id: 101, review_id: 1, image_url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=120&auto=format&fit=crop&q=60" }
    ],
    reports: [
      { report_id: 201, review_id: 1, member_id: "reporter_a", reason: "욕설 및 비방", created_at: "2026-04-01T10:00:00" },
      { report_id: 202, review_id: 1, member_id: "reporter_b", reason: "광고성 내용", created_at: "2026-04-01T11:15:00" },
      { report_id: 203, review_id: 1, member_id: "reporter_c", reason: "기타 부적절한 언행", created_at: "2026-04-01T11:50:00" }
    ]
  },
  {
    review_id: 2,
    content_id: 1002,
    festival_title: "보령머드축제",
    member_id: "chulsoo_kim",
    rating: 1.0,
    content: "이 축제 정말 재미없어요. 절대 가지 마세요. 돈만 버렸습니다.",
    visit_date: "2026-07-17",
    report_count: 1,
    created_at: "2026-07-18T15:30:00",
    updated_at: "2026-07-18T15:30:00",
    is_deleted: "N",
    nickname: "김철수",
    images: [],
    reports: [
      { report_id: 204, review_id: 2, member_id: "reporter_d", reason: "부적절한 홍보/스팸", created_at: "2026-07-18T09:00:00" }
    ]
  },
  {
    review_id: 3,
    content_id: 1003,
    festival_title: "강릉커피축제",
    member_id: "yh_lee99",
    rating: 5.0,
    content: "커피 향도 너무 좋고 다양한 체험 행사가 많아서 즐거웠습니다. 내년에도 꼭 올 거에요!",
    visit_date: "2026-10-04",
    report_count: 0,
    created_at: "2026-10-05T09:15:00",
    updated_at: "2026-10-05T09:15:00",
    is_deleted: "N",
    nickname: "이영희",
    images: [
      { image_id: 102, review_id: 3, image_url: "https://images.unsplash.com/photo-1507133750040-4a8f57021571?w=120&auto=format&fit=crop&q=60" }
    ],
    reports: []
  },
  {
    review_id: 4,
    content_id: 1004,
    festival_title: "서울세계불꽃축제",
    member_id: "ys_park",
    rating: 3.5,
    content: "불꽃은 정말 멋졌는데 사람이 너무 많아서 깔려 죽는 줄 알았습니다. 질서 유지가 필요해요.",
    visit_date: "2026-10-05",
    report_count: 0,
    created_at: "2026-10-06T21:40:00",
    updated_at: "2026-10-06T21:40:00",
    is_deleted: "N",
    nickname: "박영수",
    images: []
  },
  {
    review_id: 5,
    content_id: 1005,
    festival_title: "제주들불축제",
    member_id: "miran_choi",
    rating: 5.0,
    content: "★☆ 도박 사이트 가입 시 3만 포인트 지급! abc.com 클릭하세요!! ☆★",
    visit_date: "2026-03-11",
    report_count: 12,
    created_at: "2026-03-12T04:20:00",
    updated_at: "2026-03-12T04:20:00",
    is_deleted: "Y",
    nickname: "최미란",
    images: []
  },
  {
    review_id: 6,
    content_id: 1006,
    festival_title: "부산자갈치축제",
    member_id: "ws_jung",
    rating: 4.0,
    content: "싱싱한 회도 먹고 볼거리도 풍성해서 좋았습니다. 주차가 약간 아쉽긴 했어요.",
    visit_date: "2026-10-14",
    report_count: 0,
    created_at: "2026-10-15T18:00:00",
    updated_at: "2026-10-15T18:00:00",
    is_deleted: "N",
    nickname: "정우성",
    images: [
      { image_id: 103, review_id: 6, image_url: "https://images.unsplash.com/photo-1534080391025-a77d018f3ee0?w=120&auto=format&fit=crop&q=60" }
    ],
    reports: []
  }
];

const FestivalReviewManagement = ({ initialSearchKeyword = '', onSearchKeywordChange }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, REPORTED, BLOCKED
  const [ratingFilter, setRatingFilter] = useState('ALL'); // ALL, 5, 4, 3, 2, 1
  const [searchKeyword, setSearchKeyword] = useState(initialSearchKeyword);

  useEffect(() => {
    setSearchKeyword(initialSearchKeyword);
  }, [initialSearchKeyword]);
  
  // 백엔드 페이징을 수용하는 상태 선언
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageInfo, setPageInfo] = useState(null);
  const itemsPerPage = 5;

  // 클릭한 신고 내역 목록 모달 표시 상태 추가
  const [activeReports, setActiveReports] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, [currentPage, filterStatus, ratingFilter, searchKeyword]);

  // 검색/필터 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, ratingFilter, searchKeyword]);

  // fetchReviews에 silent 파라미터 추가 (true인 경우 로딩 스켈레톤 없이 부드럽게 배경 동기화)
  const fetchReviews = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await getAdminReviews({
        page: currentPage,
        size: itemsPerPage,
        status: filterStatus,
        rating: ratingFilter,
        keyword: searchKeyword
      });

      const data = response.data?.data || response.data || {};
      const list = data.list || [];
      const pgInfo = data.pageInfo || {};

      setReviews(list);
      setTotalItems(pgInfo.totalCount || 0);
      setTotalPages(pgInfo.totalPage || 1);
      setPageInfo(pgInfo);
    } catch (error) {
      console.error('Failed to fetch reviews from backend:', error);
      
      // 백엔드 통신 오류 시 로컬 모의 데이터를 기반으로 페이징 및 필터링 동작 (폴백)
      const filtered = INITIAL_REVIEWS_FALLBACK.filter(r => {
        if (filterStatus === 'REPORTED' && (r.report_count === 0 || r.is_deleted === 'Y')) return false;
        if (filterStatus === 'BLOCKED' && r.is_deleted !== 'Y') return false;
        if (ratingFilter !== 'ALL' && Math.floor(r.rating) !== parseInt(ratingFilter)) return false;
        
        const keyword = searchKeyword.toLowerCase();
        return (
          r.content.toLowerCase().includes(keyword) ||
          r.nickname.toLowerCase().includes(keyword) ||
          (r.festival_title && r.festival_title.toLowerCase().includes(keyword)) ||
          String(r.content_id).includes(keyword)
        );
      });

      const tItems = filtered.length;
      const tPages = Math.ceil(tItems / itemsPerPage);
      const validPg = Math.min(currentPage, tPages || 1);
      const sliced = filtered.slice((validPg - 1) * itemsPerPage, validPg * itemsPerPage);
      
      setReviews(sliced);
      setTotalItems(tItems);
      setTotalPages(tPages);
      setPageInfo({
        currentPage: validPg,
        startPage: 1,
        endPage: tPages || 1,
        totalPage: tPages || 1,
        totalCount: tItems,
        existPrev: validPg > 1,
        existNext: validPg < tPages
      });
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // 블라인드 처리 (is_deleted를 'Y'로 변경)
  const handleBlindReview = async (review_id) => {
    // 1. 깜빡임 현상을 없애기 위해 로컬 상태를 우선 즉시 반영 (Optimistic Update)
    setReviews(prev => prev.map(r => r.review_id === review_id ? { ...r, is_deleted: 'Y' } : r));

    try {
      await updateReviewStatus(review_id, 'Y');
      // 2. 백그라운드에서 스켈레톤 화면 로딩 없이(silent: true) 데이터 동기화 수행
      await fetchReviews(true);
    } catch (error) {
      console.error('Failed to blind review:', error);
      alert('블라인드 처리에 실패했습니다.');
      // 실패 시 다시 롤백
      await fetchReviews();
    }
  };

  // 블라인드 해제 (is_deleted를 'N'으로 변경 및 신고 카운트 리셋)
  const handleUnblindReview = async (review_id) => {
    // 1. 로컬 상태 우선 업데이트
    setReviews(prev => prev.map(r => r.review_id === review_id ? { ...r, is_deleted: 'N', report_count: 0, reports: [] } : r));

    try {
      await updateReviewStatus(review_id, 'N');
      // 2. 백그라운드 동기화
      await fetchReviews(true);
    } catch (error) {
      console.error('Failed to unblind review:', error);
      alert('차단 해제에 실패했습니다.');
      await fetchReviews();
    }
  };

  // 신고 무시 (신고 카운트만 0으로 리셋)
  const handleDismissReport = async (review_id) => {
    // 1. 로컬 상태 우선 업데이트
    setReviews(prev => prev.map(r => r.review_id === review_id ? { ...r, report_count: 0, reports: [] } : r));

    try {
      await dismissReviewReports(review_id);
      // 2. 백그라운드 동기화
      await fetchReviews(true);
    } catch (error) {
      console.error('Failed to dismiss reports:', error);
      alert('신고 처리에 실패했습니다.');
      await fetchReviews();
    }
  };

  // 후기 완전 삭제
  const handleDeleteReview = async (review_id) => {
    if (window.confirm("선택한 후기를 정말 삭제하시겠습니까? 데이터가 완전히 삭제됩니다.")) {
      // 1. 로컬 상태에서 즉시 아이템을 제외하여 즉시 반응성 제공
      setReviews(prev => prev.filter(r => r.review_id !== review_id));
      setTotalItems(prev => Math.max(0, prev - 1));

      try {
        await deleteReview(review_id);
        // 2. 삭제로 생기는 페이징 간격을 채우기 위해 백그라운드 동기화 수행
        await fetchReviews(true);
      } catch (error) {
        console.error('Failed to delete review:', error);
        alert('후기 삭제에 실패했습니다.');
        await fetchReviews();
      }
    }
  };

  // 백엔드 pageInfo 기반 페이지 넘버 생성
  const getPageNumbers = () => {
    if (!pageInfo) return [];
    const pages = [];
    for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 별점 아이콘 생성기 (Double rating 지원)
  const renderStars = (rating) => {
    const floorRating = Math.floor(rating);
    return (
      <div className="flex items-center gap-0.5 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={13} 
            fill={i < floorRating ? "currentColor" : "none"} 
            className={i < floorRating ? "" : "text-gray-200"}
          />
        ))}
        <span className="text-[10px] font-black text-gray-400 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 통계 요약 바 (백엔드 페이지 정보 결합) */}
      <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="text-sm font-black text-gray-400">현재 조건 하의 전체 후기</h3>
          <p className="text-2xl font-black text-gray-900 mt-1">{totalItems.toLocaleString()}개</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400">
            필터: {filterStatus === 'ALL' ? '전체' : filterStatus === 'REPORTED' ? '신고된 후기' : '차단된 후기'}
          </span>
        </div>
      </div>

      {/* 필터 및 검색 바 */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between bg-white p-5 rounded-[32px] border border-gray-100 shadow-sm">
        {/* 상태 필터 탭 */}
        <div className="flex items-center gap-1.5 p-1 bg-gray-100/50 rounded-2xl w-fit">
          {[
            { id: 'ALL', label: '전체 후기' },
            { id: 'REPORTED', label: '신고된 후기' },
            { id: 'BLOCKED', label: '차단된 후기' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
                filterStatus === tab.id 
                ? 'bg-white text-[#6d3df2] shadow-sm' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 검색 및 평점 필터 */}
        <div className="flex flex-wrap items-center gap-3">
          <select 
            className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 outline-none focus:ring-2 focus:ring-purple-100"
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="ALL">모든 평점</option>
            <option value="5">5점</option>
            <option value="4">4점</option>
            <option value="3">3점</option>
            <option value="2">2점</option>
            <option value="1">1점</option>
          </select>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="후기/작성자/축제ID 검색"
              className="h-10 w-56 rounded-xl border border-gray-200 bg-white pl-9 pr-4 text-xs font-bold outline-none focus:ring-2 focus:ring-purple-100 transition-all"
              value={searchKeyword}
              onChange={(e) => {
                const val = e.target.value;
                setSearchKeyword(val);
                if (onSearchKeywordChange) onSearchKeywordChange(val);
              }}
            />
          </div>
        </div>
      </div>

      {/* 후기 목록 테이블 */}
      <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50/50">
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider w-1/5">축제 정보</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center w-36">작성자</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider">평점 및 후기 내용</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center w-40">신고 정보</th>
                <th className="px-6 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-center w-28">작성일</th>
                <th className="px-8 py-5 text-[11px] font-black text-gray-400 uppercase tracking-wider text-right w-48">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                // 스켈레톤 로딩 로우 5개 출력
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-8 py-6">
                      <div className="space-y-2">
                        <div className="h-5 bg-gray-200 rounded-md w-24"></div>
                        <div className="h-3.5 bg-gray-200 rounded-md w-12"></div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="space-y-1 mx-auto flex flex-col items-center">
                        <div className="h-4 bg-gray-200 rounded-md w-12"></div>
                        <div className="h-3 bg-gray-200 rounded-md w-16 mt-1"></div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="h-3 bg-gray-200 rounded-md w-24"></div>
                        <div className="h-4 bg-gray-200 rounded-md w-3/4"></div>
                      </div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="h-6 bg-gray-200 rounded-full w-16 mx-auto"></div>
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="h-4 bg-gray-200 rounded-md w-16 mx-auto"></div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <div className="h-8 w-16 bg-gray-150 rounded-xl"></div>
                        <div className="h-8 w-8 bg-gray-150 rounded-xl"></div>
                      </div>
                    </td>
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-gray-400 font-bold">
                    검색 조건에 맞는 후기가 없습니다.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => {
                  const isBlocked = review.is_deleted === 'Y';
                  const isReported = review.report_count > 0 && !isBlocked;

                  return (
                    <tr key={review.review_id} className={`group hover:bg-gray-50/50 transition-colors ${isBlocked ? 'bg-red-50/10' : ''}`}>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-xs font-black text-[#6d3df2] bg-purple-50 px-2.5 py-1 rounded-lg w-fit">
                            {review.festival_title || "축제 정보 없음"}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold ml-1">
                            ID: {review.content_id}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        <div className="flex flex-col items-center">
                          <span className="text-xs font-black text-gray-700">{review.nickname}</span>
                          <span className="text-[10px] text-gray-400 font-bold mt-0.5">({review.member_id})</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="space-y-1.5">
                          {renderStars(review.rating)}
                          <p className={`text-xs font-bold leading-relaxed text-gray-600 ${isBlocked ? 'line-through text-gray-300' : ''}`}>
                            {review.content}
                          </p>
                          {/* 후기 이미지 리스트 렌더링 */}
                          {review.images && review.images.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-2">
                              {review.images.map((img) => (
                                <div key={img.image_id} className="relative group/img h-10 w-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                                  <img 
                                    src={img.image_url} 
                                    alt="review" 
                                    className="h-full w-full object-cover transition duration-300 group-hover/img:scale-110"
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-6 text-center">
                        {review.report_count > 0 ? (
                          <div className="inline-flex flex-col items-center gap-1">
                            {/* 클릭 가능한 신고 건수 배지 */}
                            <button 
                              onClick={() => setActiveReports({ nickname: review.nickname, reports: review.reports || [] })}
                              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-black cursor-pointer hover:brightness-95 transition-all ${isBlocked ? 'bg-gray-100 text-gray-400 border border-gray-200' : 'bg-amber-50 border border-amber-100 text-amber-600 hover:bg-amber-100'}`}
                            >
                              <AlertTriangle size={10} />
                              신고 {review.report_count}건
                            </button>
                            {review.reports && review.reports.length > 0 && !isBlocked && (
                              <span className="text-[9px] text-gray-400 font-bold max-w-[120px] truncate">
                                사유: {review.reports[0].reason}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-[10px] font-bold text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-6 text-center">
                        <span className="text-xs font-bold text-gray-400">
                          {review.created_at ? review.created_at.split('T')[0] : review.visit_date}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2.5">
                          {isBlocked ? (
                            <button 
                              onClick={() => handleUnblindReview(review.review_id)}
                              className="h-8 px-3 flex items-center justify-center gap-1 rounded-xl bg-green-50 text-green-600 hover:bg-green-100 text-xs font-black transition border border-green-100"
                            >
                              <Eye size={12} />
                              차단 해제
                            </button>
                          ) : (
                            <>
                              {isReported && (
                                <button 
                                  onClick={() => handleDismissReport(review.review_id)}
                                  className="h-8 px-3 flex items-center justify-center gap-1 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 text-xs font-black transition border border-gray-200"
                                >
                                  <CheckCircle size={12} />
                                  신고 무시
                                </button>
                              )}
                              <button 
                                onClick={() => handleBlindReview(review.review_id)}
                                className="h-8 px-3 flex items-center justify-center gap-1 rounded-xl bg-amber-50 text-amber-600 hover:bg-amber-100 text-xs font-black transition border border-amber-100"
                              >
                                <EyeOff size={12} />
                                블라인드
                              </button>
                            </>
                          )}
                          <button 
                            onClick={() => handleDeleteReview(review.review_id)}
                            className="h-8 w-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition border border-transparent hover:border-red-100 shadow-sm"
                          >
                            <Trash2 size={12} />
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

        {/* 페이징 네비게이션 - 백엔드 pageInfo 동기화 */}
        {pageInfo && pageInfo.totalPage > 1 && (
          <div className="px-8 py-5 border-t border-gray-50 flex items-center justify-between bg-gray-50/30">
            <p className="text-xs font-bold text-gray-400">
              전체 {totalItems}개 중 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} 표시
            </p>
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={!pageInfo.existPrev}
                className={`h-9 px-3 rounded-xl border text-xs font-black transition-all ${
                  !pageInfo.existPrev 
                  ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                이전
              </button>
              
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`h-9 w-9 rounded-xl text-xs font-black transition-all ${
                    currentPage === pageNum
                    ? 'bg-[#6d3df2] text-white shadow-md shadow-purple-100'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </button>
              ))}
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={!pageInfo.existNext}
                className={`h-9 px-3 rounded-xl border text-xs font-black transition-all ${
                  !pageInfo.existNext 
                  ? 'bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed' 
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                다음
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 신고 내역 상세 모달 */}
      {activeReports && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] border border-gray-100 shadow-2xl p-8 max-w-lg w-full space-y-6 mx-4 transform scale-100 transition-all">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-lg font-black text-gray-900">신고 접수 상세 내역</h3>
                <p className="text-xs font-bold text-gray-400 mt-1">대상 후기 작성자: {activeReports.nickname}</p>
              </div>
              <button 
                onClick={() => setActiveReports(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                ✕
              </button>
            </div>
            
            <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
              {activeReports.reports && activeReports.reports.length > 0 ? (
                activeReports.reports.map((report) => (
                  <div key={report.report_id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-gray-700">신고자: {report.member_id}</span>
                      <span className="text-[10px] text-gray-400 font-bold">
                        {report.created_at ? report.created_at.split('T')[0] : '날짜 없음'}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-red-500">
                      신고 사유: {report.reason}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-xs text-gray-400 font-bold">신고 상세 내역이 아직 접수되지 않았습니다.</p>
              )}
            </div>
            
            <div className="flex justify-end pt-2">
              <button 
                onClick={() => setActiveReports(null)}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-xs font-black text-white hover:bg-gray-800 transition"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FestivalReviewManagement;
