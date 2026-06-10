import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import festivalService from '../../../api/festivalService';
import useFestivalLikeStore from '../../../store/useFestivalLikeStore';
import { toast } from 'react-toastify';

const MyLikedFestivalsTab = ({ userDetails, onRefresh }) => {
  const navigate = useNavigate();
  const { toggleLike } = useFestivalLikeStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const likedFestivals = userDetails?.likedFestivals || [];

  const handleToggleLike = async (e, contentId) => {
    e.preventDefault();
    e.stopPropagation();

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      await festivalService.toggleFestivalLike(contentId);
      toggleLike(contentId);
      
      // 목록 새로고침
      if (onRefresh) await onRefresh();
      
      toast.success('찜 목록이 업데이트되었습니다.');
    } catch (error) {
      console.error('찜하기 토글 실패:', error);
      toast.error('요청 처리에 실패했습니다.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDetailClick = (contentId) => {
    navigate(`/festival/${contentId}`);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">찜한 축제</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">가보고 싶어서 찜해둔 축제 목록입니다.</p>
        </div>
        <span className="text-xs sm:text-sm font-bold text-rose-600 bg-rose-50 px-3 py-1 rounded-full">
          총 {likedFestivals.length}개
        </span>
      </header>

      {likedFestivals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {likedFestivals.map((festival) => (
            <div 
              key={festival.CONTENT_ID} 
              className="group bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100 cursor-pointer" onClick={() => handleDetailClick(festival.CONTENT_ID)}>
                <img 
                  src={festival.FIRST_IMAGE || festival.FIRST_IMAGE2 || 'https://via.placeholder.com/500x300?text=이미지+없음'} 
                  alt={festival.TITLE} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3">
                  <button 
                    onClick={(e) => handleToggleLike(e, festival.CONTENT_ID)}
                    disabled={isProcessing}
                    className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-rose-500 hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    ❤️
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                  <span className="text-[10px] sm:text-xs font-bold text-white/90 flex items-center gap-1">
                    📍 {festival.ADDR1 || '장소 정보 없음'}
                  </span>
                </div>
              </div>
              
              <div className="p-4 sm:p-5 space-y-2">
                <h3 
                  className="text-base sm:text-lg font-black text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors cursor-pointer"
                  onClick={() => handleDetailClick(festival.CONTENT_ID)}
                >
                  {festival.TITLE}
                </h3>
                <p className="text-[11px] sm:text-xs font-bold text-gray-400">
                  📅 {festival.EVENT_START_DATE && festival.EVENT_END_DATE 
                    ? `${festival.EVENT_START_DATE} ~ ${festival.EVENT_END_DATE}`
                    : '일정 정보 없음'}
                </p>
                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => handleDetailClick(festival.CONTENT_ID)}
                    className="flex-grow py-2 bg-purple-600 text-white text-[11px] sm:text-xs font-black rounded-xl hover:bg-purple-700 transition-colors"
                  >
                    상세보기
                  </button>
                  <button 
                    onClick={(e) => handleToggleLike(e, festival.CONTENT_ID)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-rose-50 text-rose-600 text-[11px] sm:text-xs font-black rounded-xl hover:bg-rose-100 transition-colors disabled:opacity-50"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-white rounded-[32px] border border-dashed border-gray-200">
          <div className="text-4xl mb-4">❤️</div>
          <h2 className="text-xl font-black text-gray-800">찜한 축제가 아직 없네요.</h2>
          <p className="text-gray-500 mt-2 font-medium text-sm">마음에 드는 축제를 발견하면 하트를 눌러보세요!</p>
        </div>
      )}
    </div>
  );
};

export default MyLikedFestivalsTab;
