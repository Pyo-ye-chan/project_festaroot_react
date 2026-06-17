import React, { useEffect } from 'react';

const MySavedPlannerDetail = ({ selectedPlanner, itineraryList, onClose, onDelete }) => {
  // Helper Functions
  const getStepIcon = (type) => {
    switch (type) {
      case 'MOVE': return '🚶';
      case 'FESTIVAL': return '🎪';
      case 'FOOD': return '🍽️';
      case 'CAFE': return '☕';
      case 'TOUR': return '📸';
      case 'CULTURE': return '🏛️';
      case 'PARKING': return '🅿️';
      case 'REST': return '🛋️';
      default: return '📍';
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

  const getCourseStyleLabel = (style) => {
    switch (style) {
      case 'RELAXED': return '느긋하게 쉬엄쉬엄';
      case 'FOOD': return '맛집은 꼭 챙기기';
      case 'TOUR': return '주변 명소까지 알차게';
      case 'CULTURE': return '문화 감성 코스';
      case 'INDOOR': return '실내 위주';
      case 'PHOTO': return '사진 명소 위주';
      case 'FAMILY': return '가족이 편한 동선';
      default: return '맞춤형 코스';
    }
  };

  const getCourseTitle = (planner) => {
    const style = planner.course_style || planner.courseStyle;
    switch (style) {
      case 'FOOD': return '맛집까지 챙긴 든든한 축제 코스';
      case 'TOUR': return '주변 명소까지 둘러보는 알찬 코스';
      case 'CULTURE': return '문화 감성 가득한 축제 코스';
      case 'INDOOR': return '날씨 걱정 적은 실내 중심 코스';
      case 'PHOTO': return '사진 남기기 좋은 감성 코스';
      case 'FAMILY': return '가족과 편하게 즐기는 코스';
      default: return '여유롭게 즐기는 축제 나들이 코스';
    }
  };

  const getCourseBadges = (planner) => {
    const style = planner.course_style || planner.courseStyle;
    const companion = planner.companion_type || planner.companionType;
    const weather = planner.weather_summary || planner.weatherSummary;
    const route = planner.route_notice || planner.routeNotice;
    
    const badges = ['축제 연계 코스'];
    if (style === 'FOOD') badges.push('맛집 포함');
    if (style === 'TOUR') badges.push('주변 명소');
    if (style === 'CULTURE') badges.push('문화시설');
    if (style === 'INDOOR') badges.push('실내 중심');
    if (style === 'PHOTO') badges.push('사진 명소');
    if (companion === 'CHILD') badges.push('아이와 함께');
    if (companion === 'FAMILY') badges.push('가족 추천');
    if (weather) badges.push('날씨 반영');
    if (route) badges.push('동선 안내');
    return badges;
  };

  const getStepOrderReason = (idx, step, total) => {
    if (idx === 0) return '축제 하루를 시작하기 좋은 첫 번째 장소로 배치했어요.';
    if (step.type === 'FOOD') return '이동 후 식사하기 좋은 타이밍에 맞춰 배치했어요.';
    if (step.type === 'REST') return '중간에 잠시 쉬어가기 좋은 흐름으로 넣었어요.';
    if (idx === total - 1) return '축제 나들이를 마무리하기 좋은 마지막 코스예요.';
    return '이전 장소와 다음 장소의 흐름을 고려해 배치했어요.';
  };

  const getStepLat = (step) => step.y || step.map_y || step.mapY || step.latitude || step.lat;
  const getStepLng = (step) => step.x || step.map_x || step.mapX || step.longitude || step.lng;

  const getKakaoSearchUrl = (step) => {
    const keyword = encodeURIComponent(step.address || step.place_name || step.placeName || step.title || '');
    return keyword ? `https://map.kakao.com/?q=${keyword}` : null;
  };

  const getKakaoDirectionUrl = (fromStep, toStep) => {
    const fromLat = getStepLat(fromStep);
    const fromLng = getStepLng(fromStep);
    const toLat = getStepLat(toStep);
    const toLng = getStepLng(toStep);
    if (!fromLat || !fromLng || !toLat || !toLng) return null;
    const fromName = encodeURIComponent(fromStep.place_name || fromStep.placeName || fromStep.title || '출발지');
    const toName = encodeURIComponent(toStep.place_name || toStep.placeName || toStep.title || '도착지');
    return `https://map.kakao.com/link/from/${fromName},${fromLat},${fromLng}/to/${toName},${toLat},${toLng}`;
  };

  // 카카오 지도 렌더링 Effect
  useEffect(() => {
    if (selectedPlanner && itineraryList.length > 0) {
      const timer = setTimeout(() => {
        if (!window.kakao || !window.kakao.maps) return;
        const markerSteps = itineraryList.filter(step => getStepLat(step) && getStepLng(step));
        if (markerSteps.length === 0) return;
        const container = document.getElementById('tabPlannerMap');
        if (!container) return;
        container.innerHTML = '';
        const first = markerSteps[0];
        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(Number(getStepLat(first)), Number(getStepLng(first))),
          level: 5
        });
        const bounds = new window.kakao.maps.LatLngBounds();
        const linePath = [];
        markerSteps.forEach((step, idx) => {
          const position = new window.kakao.maps.LatLng(Number(getStepLat(step)), Number(getStepLng(step)));
          bounds.extend(position);
          linePath.push(position);
          const marker = new window.kakao.maps.Marker({ position, map });
          const infoWindow = new window.kakao.maps.InfoWindow({
            content: `<div style="padding:5px;font-size:12px;">${idx + 1}. ${step.title || step.place_name || step.placeName}</div>`
          });
          window.kakao.maps.event.addListener(marker, 'click', () => {
            infoWindow.open(map, marker);
          });
        });
        if (linePath.length >= 2) {
          new window.kakao.maps.Polyline({
            path: linePath,
            strokeWeight: 3,
            strokeColor: '#8B5CF6',
            strokeOpacity: 0.7,
            strokeStyle: 'solid',
            map
          });
        }
        map.setBounds(bounds);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedPlanner, itineraryList]);

  if (!selectedPlanner) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-[32px] shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 flex items-center justify-center bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-gray-800 transition-colors shadow-sm"
        >
          <span className="text-2xl">&times;</span>
        </button>

        <div className="overflow-y-auto p-6 sm:p-10">
          {/* ChukjeHaruCode Style Header */}
          <div className="mb-8 p-6 rounded-[28px] bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50 border border-yellow-100 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs font-black text-orange-500 mb-2">
                  🎪 오늘의 코스 컨셉
                </p>
                <h4 className="text-2xl font-black text-gray-800 leading-tight">
                  {getCourseTitle(selectedPlanner)}
                </h4>
              </div>
              <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/80 items-center justify-center text-3xl shadow-sm">
                🧭
              </div>
            </div>

            <p className="text-sm text-gray-600 font-medium leading-7">
              <span className="font-bold text-purple-600">
                [{selectedPlanner.planner.festival_title || '축제'}]
              </span>
              을 중심으로 방문 날짜, 동행 유형, 추천 스타일을 반영해 만든 맞춤형 코스예요.
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              {getCourseBadges(selectedPlanner).map((badge) => (
                <span
                  key={badge}
                  className="px-3 py-1.5 rounded-full bg-white text-xs font-black text-purple-600 border border-purple-100"
                >
                  #{badge}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              <div className="p-3 rounded-2xl bg-white/80 border border-white">
                <p className="text-[10px] font-black text-gray-400">방문일</p>
                <p className="text-sm font-black text-gray-800">{selectedPlanner.planner.visit_date || '미정'}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-white">
                <p className="text-[10px] font-black text-gray-400">동행</p>
                <p className="text-sm font-black text-gray-800">{getCompanionLabel(selectedPlanner.planner.companion_type)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-white">
                <p className="text-[10px] font-black text-gray-400">스타일</p>
                <p className="text-sm font-black text-gray-800">{getCourseStyleLabel(selectedPlanner.planner.course_style)}</p>
              </div>
              <div className="p-3 rounded-2xl bg-white/80 border border-white">
                <p className="text-[10px] font-black text-gray-400">추천 장소</p>
                <p className="text-sm font-black text-gray-800">{itineraryList.length}곳</p>
              </div>
            </div>
          </div>

          {/* Master Info - Recommendation Reason */}
          {selectedPlanner.recommendation_reason && (
            <div className="mb-6 p-5 bg-purple-50/50 rounded-2xl border border-purple-100">
              <p className="text-[11px] font-black text-purple-600 uppercase mb-2 flex items-center gap-1">
                ✨ AI의 추천 배경
              </p>
              <p className="text-xs text-purple-800 font-bold leading-relaxed">
                {selectedPlanner.recommendation_reason}
              </p>
              {selectedPlanner.rag_query && (
                <p className="text-[10px] text-purple-400 mt-2 font-medium">
                  # 원문 의도: {selectedPlanner.rag_query}
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {selectedPlanner.weather_summary && (
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold flex items-center gap-3">
                <span className="text-xl">🌦</span>
                <span>날씨 반영: {selectedPlanner.weather_summary}</span>
              </div>
            )}
            {selectedPlanner.route_notice && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <span>동선 안내: {selectedPlanner.route_notice}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                상세 타임라인
              </h3>
              
              <div className="relative space-y-8 pl-4 border-l-2 border-dashed border-gray-100 ml-2">
                {itineraryList.map((step, idx) => {
                  const nextStep = itineraryList[idx + 1];
                  const directionUrl = nextStep ? getKakaoDirectionUrl(step, nextStep) : null;
                  const searchUrl = getKakaoSearchUrl(step);
                  
                  return (
                    <div key={idx} className="relative pl-8">
                      <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white border-4 border-purple-600 z-10 shadow-sm"></div>
                      <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100 hover:border-purple-200 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                            {step.time_label || step.time || step.start_time}
                          </span>
                          <span className="text-lg">{getStepIcon(step.type)}</span>
                        </div>
                        
                        {step.first_image && (
                          <img src={step.first_image} alt={step.title} className="w-full h-32 object-cover rounded-xl mb-3 border border-gray-100 shadow-sm" />
                        )}
                        
                        <h4 className="font-black text-gray-800 text-sm mb-1">{step.title}</h4>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">{step.description}</p>
                        
                        {(step.place_name || step.placeName) && (
                          <p className="text-[10px] font-black text-gray-400 mt-2 flex items-center gap-1">
                            <span>📍</span> {step.place_name || step.placeName}
                          </p>
                        )}

                        {step.distance != null && (
                          <p className="text-[10px] text-emerald-600 font-bold mt-1">
                            📏 기준지 거리 약 {Math.round(Number(step.distance))}m
                          </p>
                        )}

                        {step.reason && (
                          <div className="mt-3 p-3 rounded-xl bg-white/80 border border-purple-100">
                            <p className="text-[10px] font-black text-purple-600 mb-1 flex items-center gap-1">
                              💡 AI 추천 포인트
                            </p>
                            <p className="text-[11px] text-gray-600 font-bold leading-relaxed">
                              {step.reason}
                            </p>
                          </div>
                        )}

                        {(step.source_api || step.sourceApi) && (
                          <p className="text-[10px] text-gray-400 font-bold mt-1">
                            출처: {(step.source_api || step.sourceApi) === 'TOUR_API' ? 'TourAPI 주변정보' : (step.source_api || step.sourceApi)}
                          </p>
                        )}

                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          {(step.kakao_place_url || step.kakaoPlaceUrl) ? (
                            <a 
                              href={step.kakao_place_url || step.kakaoPlaceUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-[10px] font-black hover:bg-gray-200 transition-colors"
                            >
                              지도에서 보기
                            </a>
                          ) : (
                            searchUrl && (
                              <a 
                                href={searchUrl} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-100 text-gray-700 text-[10px] font-black hover:bg-gray-200 transition-colors"
                              >
                                장소 검색하기
                              </a>
                            )
                          )}

                          {directionUrl && (
                            <a 
                              href={directionUrl} 
                              target="_blank" 
                              rel="noreferrer" 
                              className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-xl bg-yellow-300 text-gray-900 text-[10px] font-black hover:bg-yellow-400 transition-colors"
                            >
                              다음 장소 길찾기
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-purple-600 rounded-full"></span>
                이동 경로 지도
              </h3>
              <div id="tabPlannerMap" className="w-full h-80 sm:h-[400px] rounded-[32px] border border-gray-100 shadow-inner overflow-hidden" />
              
              {selectedPlanner.user_input && (
                <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">내 메모</p>
                  <p className="text-xs text-slate-600 font-bold leading-relaxed">{selectedPlanner.user_input}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex gap-3">
          <button
            onClick={onClose}
            className="flex-grow py-4 bg-white text-gray-700 text-sm font-black rounded-2xl border border-gray-200 hover:bg-gray-50 transition-all"
          >
            닫기
          </button>
          <button
            onClick={() => onDelete(selectedPlanner.planner_id)}
            className="px-8 py-4 bg-rose-50 text-rose-500 text-sm font-black rounded-2xl hover:bg-rose-100 transition-all"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default MySavedPlannerDetail;
