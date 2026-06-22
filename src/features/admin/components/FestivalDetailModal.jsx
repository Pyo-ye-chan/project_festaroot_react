import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Phone, Globe, Info, Clock, DollarSign, Eye, Heart, Bookmark, Star } from 'lucide-react';
import { getAdminFestivalDetail } from '../../../api/adminApi';

const FestivalDetailModal = ({ isOpen, onClose, contentId }) => {
  const [festival, setFestival] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && contentId) {
      fetchDetail();
    }
  }, [isOpen, contentId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getAdminFestivalDetail(contentId);
      const data = response.data?.data || response.data || null;
      setFestival(data);
    } catch (err) {
      console.error('축제 상세 정보 조회 실패:', err);
      setError('축제 정보를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose}></div>

      {/* Modal Container */}
      <div className="relative bg-white w-full max-w-4xl h-[90vh] md:h-[80vh] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between shrink-0 bg-gray-50/50">
          <div>
            <h3 className="text-xl font-black text-gray-900 tracking-tight">축제 상세 정보</h3>
            {festival && (
              <p className="text-xs font-bold text-gray-400 mt-1">
                Content ID: {contentId}
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full py-20 space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              <p className="text-sm font-bold text-gray-500">축제 상세 데이터를 로드 중입니다...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full py-20 text-red-500 space-y-2">
              <p className="font-black text-lg">{error}</p>
              <button 
                onClick={fetchDetail}
                className="px-4 py-2 bg-purple-50 text-[#6d3df2] font-bold rounded-xl border border-purple-100 hover:bg-purple-100 transition text-xs"
              >
                다시 시도
              </button>
            </div>
          ) : festival ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              
              {/* Left Column: Image & Basic Info Card */}
              <div className="md:col-span-5 space-y-6">
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative">
                  <img 
                    src={festival.firstImage || festival.first_image || 'https://via.placeholder.com/400x300?text=No+Image'} 
                    alt={festival.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Popularity Metrics Card */}
                <div className="bg-gray-50/60 border border-gray-100 rounded-3xl p-6 space-y-4">
                  <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider">인기도 통계</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-2xl border border-gray-50 text-center">
                      <span className="flex items-center justify-center gap-1 text-amber-500 font-black text-sm">
                        <Star size={14} fill="currentColor" />
                        {(festival.avg_rating ?? festival.avgRating ?? 0).toFixed(1)}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 block">평점 (후기 {festival.review_count ?? festival.reviewCount ?? 0}건)</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-50 text-center">
                      <span className="flex items-center justify-center gap-1 text-blue-500 font-black text-sm">
                        <Eye size={14} />
                        {festival.view_count ?? festival.viewCount ?? 0}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 block">조회수</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-50 text-center">
                      <span className="flex items-center justify-center gap-1 text-red-500 font-black text-sm">
                        <Heart size={14} />
                        {festival.like_count ?? festival.likeCount ?? 0}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 block">좋아요 수</span>
                    </div>
                    <div className="bg-white p-3 rounded-2xl border border-gray-50 text-center">
                      <span className="flex items-center justify-center gap-1 text-purple-500 font-black text-sm">
                        <Bookmark size={14} />
                        {festival.save_count ?? festival.saveCount ?? 0}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 mt-1 block">저장 수</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed Meta List */}
              <div className="md:col-span-7 space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-purple-50 text-[#6d3df2] rounded-full text-xs font-black mb-2">
                    {festival.addr1 ? festival.addr1.split(' ')[0] : '지역 정보 없음'}
                  </span>
                  <h2 className="text-2xl font-black text-gray-900 leading-tight">
                    {festival.title}
                  </h2>
                </div>

                {/* Info List */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 space-y-4">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-400">주소</p>
                      <p className="text-sm font-black text-gray-700 mt-0.5">
                        {festival.addr1} {festival.addr2 || ''}
                      </p>
                    </div>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-start gap-3">
                    <Calendar size={18} className="text-gray-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-gray-400">행사 기간</p>
                      <p className="text-sm font-black text-gray-700 mt-0.5">
                        {festival.eventStartDate || festival.event_start_date} ~ {festival.eventEndDate || festival.event_end_date}
                      </p>
                    </div>
                  </div>

                  {/* Playplace */}
                  {festival.eventplace && (
                    <div className="flex items-start gap-3">
                      <Info size={18} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-400">행사 장소</p>
                        <p className="text-sm font-black text-gray-700 mt-0.5">{festival.eventplace}</p>
                      </div>
                    </div>
                  )}

                  {/* Playtime */}
                  {festival.playtime && (
                    <div className="flex items-start gap-3">
                      <Clock size={18} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-400">공연 시간</p>
                        <p className="text-sm font-black text-gray-700 mt-0.5">{festival.playtime}</p>
                      </div>
                    </div>
                  )}

                  {/* Usetime */}
                  {festival.usetime && (
                    <div className="flex items-start gap-3">
                      <DollarSign size={18} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-400">이용 요금</p>
                        <p className="text-sm font-black text-gray-700 mt-0.5" dangerouslySetInnerHTML={{ __html: festival.usetime }} />
                      </div>
                    </div>
                  )}

                  {/* Tel */}
                  {festival.tel && (
                    <div className="flex items-start gap-3">
                      <Phone size={18} className="text-gray-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold text-gray-400">연락처</p>
                        <p className="text-sm font-black text-gray-700 mt-0.5">{festival.tel}</p>
                      </div>
                    </div>
                  )}

                  {/* Homepage */}
                  {festival.homepage && (
                    <div className="flex items-start gap-3">
                      <Globe size={18} className="text-gray-400 shrink-0 mt-0.5" />
                      <div className="w-full min-w-0">
                        <p className="text-xs font-bold text-gray-400">홈페이지</p>
                        <p 
                          className="text-sm font-black text-[#6d3df2] mt-0.5 break-all truncate [&_a]:text-[#6d3df2] [&_a]:underline" 
                          dangerouslySetInnerHTML={{ __html: festival.homepage }} 
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Overview Card */}
                {festival.overview && (
                  <div className="bg-white border border-gray-100 rounded-3xl p-6">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider mb-2">축제 소개</h4>
                    <p className="text-sm font-bold text-gray-600 leading-relaxed whitespace-pre-line">
                      {festival.overview}
                    </p>
                  </div>
                )}

                {/* Sponsoring */}
                {(festival.sponsor1 || festival.sponsor2) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {festival.sponsor1 && (
                      <div className="bg-gray-50/40 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-gray-400">주최자</p>
                        <p className="text-xs font-black text-gray-700 mt-1">{festival.sponsor1}</p>
                        {festival.sponsor1tel && <p className="text-[10px] text-gray-400 mt-0.5">{festival.sponsor1tel}</p>}
                      </div>
                    )}
                    {festival.sponsor2 && (
                      <div className="bg-gray-50/40 border border-gray-100 rounded-2xl p-4">
                        <p className="text-[10px] font-black text-gray-400">주관사</p>
                        <p className="text-xs font-black text-gray-700 mt-1">{festival.sponsor2}</p>
                        {festival.sponsor2tel && <p className="text-[10px] text-gray-400 mt-0.5">{festival.sponsor2tel}</p>}
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="text-center py-20 text-gray-400 font-bold">
              축제 데이터가 존재하지 않습니다.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FestivalDetailModal;
