import React, { useState, useEffect } from 'react';
import { getMyAIPlanners, getAIPlannerDetail, deleteAIPlanner } from '../../../api/aiApi';
import LoadingSpinner from '../../../components/LoadingSpinner';
import MySavedPlannerDetail from './MySavedPlannerDetail';

const MySavedPlansTab = () => {
  const [savedPlans, setSavedPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 상세 보기 모달 상태
  const [selectedPlanner, setSelectedPlanner] = useState(null);
  const [itineraryList, setItineraryList] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchPlanners();
  }, []);

  const fetchPlanners = async () => {
    try {
      setLoading(true);
      const response = await getMyAIPlanners();
      const data = response?.data || response;
      if (data.success) {
        setSavedPlans(data.list || []);
      } else {
        setError(data.message || '플래너 목록을 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to fetch AI planners:', err);
      setError('서버와의 통신 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetail = async (plannerId) => {
    try {
      setDetailLoading(true);
      const response = await getAIPlannerDetail(plannerId);
      // Backend response: { success: true, data: planner }
      const result = response?.data;
      
      if (result && result.success) {
        const planner = result.data;
        setSelectedPlanner(planner);
        setItineraryList(planner.steps || []);
      } else {
        alert(result?.message || '상세 정보를 불러오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to fetch planner detail:', err);
      alert('상세 정보를 불러오는데 실패했습니다.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleDelete = async (plannerId) => {
    if (!window.confirm('이 플래너를 삭제하시겠습니까?')) return;

    try {
      const response = await deleteAIPlanner(plannerId);
      const data = response?.data || response;
      if (data.success) {
        alert('삭제되었습니다.');
        setSavedPlans(prev => prev.filter(plan => plan.planner_id !== plannerId));
        if (selectedPlanner && selectedPlanner.planner_id === plannerId) {
          setSelectedPlanner(null);
        }
      } else {
        alert(data.message || '삭제에 실패했습니다.');
      }
    } catch (err) {
      console.error('Failed to delete planner:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
  };

  const getCompanionLabel = (type) => {
    switch (type) {
      case 'ALONE': return '혼자';
      case 'FRIEND': return '친구와';
      case 'COUPLE': return '연인과';
      case 'FAMILY': return '가족과';
      case 'CHILD': return '아이와 함께';
      case 'PARENT': return '부모님과';
      case 'PET': return '반려동물과';
      default: return '동행 미정';
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 font-bold">{error}</p>
        <button 
          onClick={fetchPlanners}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="px-2 sm:px-0 flex justify-between items-end">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900">저장된 플래너</h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1 sm:mt-2 font-medium">AI와 함께 설계한 나만의 여행 일정들입니다.</p>
        </div>
        <span className="text-xs sm:text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
          총 {savedPlans.length}개
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {savedPlans.map((plan) => {
          const plannerId = plan.planner_id;
          // 축제명을 포함한 제목 생성
          const displayTitle = plan.festival_title 
            ? `${plan.festival_title} AI 여행 플래너` 
            : (plan.title || 'AI 여행 플래너');
          
          const date = plan.visit_date || '날짜 미지정';
          const location = plan.addr1 || plan.start_location || '';
          const thumbnail = plan.first_image || 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=500&q=80';

          return (
            <div 
              key={plannerId} 
              className="group bg-white rounded-[28px] border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="relative h-44 sm:h-48 overflow-hidden cursor-pointer" onClick={() => fetchDetail(plannerId)}>
                <img 
                  src={thumbnail} 
                  alt={displayTitle} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full">
                  <span className="text-[10px] font-black text-white flex items-center gap-1">
                    📅 {date}
                  </span>
                </div>
              </div>
              
              <div className="p-5 space-y-3">
                <div className="cursor-pointer" onClick={() => fetchDetail(plannerId)}>
                  <h3 className="text-lg font-black text-gray-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {displayTitle}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      🧑‍🤝‍👩 {plan.people_count}명
                    </span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                      {getCompanionLabel(plan.companion_type)}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-gray-400 mt-2 flex items-center gap-1">
                    <span>📍</span> {location}
                  </p>
                </div>
                
                <div className="pt-2 flex gap-2">
                  <button 
                    className="flex-grow py-3 bg-slate-50 text-gray-700 text-xs font-black rounded-xl hover:bg-purple-50 hover:text-purple-600 transition-all border border-transparent hover:border-purple-100"
                    onClick={() => fetchDetail(plannerId)}
                  >
                    일정 상세보기
                  </button>
                  <button 
                    onClick={() => handleDelete(plannerId)}
                    className="px-4 py-3 bg-gray-50 text-gray-400 text-xs font-black rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {savedPlans.length === 0 && (
        <div className="py-20 text-center bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <span className="text-3xl">📝</span>
          </div>
          <p className="text-gray-400 font-bold">저장된 플랜이 없습니다.</p>
          <p className="text-gray-400 text-sm mt-1">AI 여행 플래너에서 첫 일정을 만들어보세요!</p>
        </div>
      )}

      {/* 상세 모달 컴포넌트 */}
      <MySavedPlannerDetail 
        selectedPlanner={selectedPlanner}
        itineraryList={itineraryList}
        onClose={() => setSelectedPlanner(null)}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default MySavedPlansTab;
