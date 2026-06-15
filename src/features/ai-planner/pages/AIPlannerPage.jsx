import React, { useState, useEffect } from 'react';
import { maxios } from '../../../api/axiosApi';
import useAuthStore from '../../../store/useAuthStore';
import { getMemberProfile } from '../../../api/memberApi';
import { saveActivityLog } from '../../../api/activityApi';
import { createAIPlanner } from '../../../api/aiApi';

const AIPlannerPage = () => {
  const { user, isLoggedIn } = useAuthStore();
  const [isRecommending, setIsRecommending] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const [recommendList, setRecommendList] = useState([]); // 서버 추천 데이터 저장
  const [userInput, setUserInput] = useState(''); // 사용자의 한 마디
  const [feedbackMap, setFeedbackMap] = useState({}); // contentId -> 'LIKE' | 'DISLIKE'
  const [showDislikeReason, setShowDislikeReason] = useState(null); // feedback 중인 축제 ID
  
  const [userDetails, setUserDetails] = useState(null); // 유저 상세 정보
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  // AI 플래너 생성 관련 상태
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [plannerForm, setPlannerForm] = useState({
    visitDate: '',
    startLocation: '',
    peopleCount: 2,
    companionType: 'FRIEND',
    transportType: 'PUBLIC',
    startTime: '10:00',
    endTime: '18:00',
    extraRequest: ''
  });

  const [itineraryList, setItineraryList] = useState([]);
  const [plannerId, setPlannerId] = useState(null);
  const [plannerWeather, setPlannerWeather] = useState(null);

  // 관심사 섹션 펼침/접힘 상태
  const [isRegionsOpen, setIsRegionsOpen] = useState(true);
  const [isThemesOpen, setIsThemesOpen] = useState(true);
  const [isLikesOpen, setIsLikesOpen] = useState(true);

  // 데이터 로드 Effect
  useEffect(() => {
    if (isLoggedIn && (user?.member_id || user?.id)) {
      const fetchUserData = async () => {
        setIsLoadingContext(true);
        try {
          const userId = user.member_id || user.id;
          const resp = await getMemberProfile(userId);
          console.log('User Data:', resp.data);
          setUserDetails(resp.data);
        } catch (error) {
          console.error('사용자 데이터 로드 실패:', error);
        } finally {
          setIsLoadingContext(false);
        }
      };

      fetchUserData();
    }
  }, [isLoggedIn, user?.member_id, user?.id]);

  // 카카오 지도 렌더링 Effect
  useEffect(() => {
    if (!showItinerary || itineraryList.length === 0) return;
    // window.kakao 객체가 로드되었는지 확인
    if (!window.kakao || !window.kakao.maps) {
      console.warn("Kakao Maps API not loaded.");
      // 지도 영역 대신 메시지 표시 등을 고려할 수 있음
      return;
    }

    const markerSteps = itineraryList.filter(step => step.x && step.y);
    if (markerSteps.length === 0) {
      console.warn("No valid coordinates in itineraryList for map markers.");
      return;
    }

    const container = document.getElementById('plannerMap');
    if (!container) {
      console.warn("Map container element not found.");
      return;
    }

    // 기존 지도가 있다면 제거
    if (container.hasChildNodes()) {
      container.innerHTML = '';
    }

    const first = markerSteps[0];

    const map = new window.kakao.maps.Map(container, {
      center: new window.kakao.maps.LatLng(Number(first.y), Number(first.x)),
      level: 5
    });

    const bounds = new window.kakao.maps.LatLngBounds();
    const linePath = [];

    markerSteps.forEach((step, idx) => {
      const position = new window.kakao.maps.LatLng(Number(step.y), Number(step.x));
      bounds.extend(position);
      linePath.push(position);

      const marker = new window.kakao.maps.Marker({
        position,
        map
      });

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding:8px;font-size:12px;min-width:150px;">
            <strong>${idx + 1}. ${step.title || ''}</strong><br/>
            <span>${step.placeName || ''}</span>
          </div>
        `
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map, marker);
      });
    });

    if (linePath.length >= 2) {
      const polyline = new window.kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 4,
        strokeColor: '#AD5FEE', // 보라색 계열
        strokeOpacity: 0.8,
        strokeStyle: 'solid'
      });

      polyline.setMap(map);
    }

    map.setBounds(bounds);
  }, [showItinerary, itineraryList]);

  // 일정 단계 타입에 따른 아이콘 반환 함수
  const getStepIcon = (type) => {
    switch (type) {
      case 'MOVE': return '🚶';
      case 'FESTIVAL': return '🎪';
      case 'FOOD': return '🍽️';
      case 'CAFE': return '☕';
      case 'TOUR': return '📸';
      case 'CULTURE': return '🏛️';
      case 'PARKING': return '🅿️';
      default: return '📍';
    }
  };

  // 유저의 생년월일을 바탕으로 연령대 계산
  const getAgeGroup = (birthdate) => {
    if (!birthdate) return '연령대 미정';
    const year = parseInt(birthdate.substring(0, 4));
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    return `${Math.floor(age / 10) * 10}대`;
  };

  // 실제 데이터를 기반으로 컨텍스트 구성
  const userContext = {
    profile: { 
      age: getAgeGroup(userDetails?.member?.birthdate), 
      gender: userDetails?.member?.gender === 'M' ? '남성' : userDetails?.member?.gender === 'F' ? '여성' : (userDetails?.member?.gender || '성별 미정') 
    },
    interests: { 
      regions: userDetails?.interestRegions?.map(r => r.region_name) || [], 
      themes: userDetails?.interestThemes?.map(t => t.theme_name) || [] 
    },
    likedFestivals: userDetails?.likedFestivals || [],
    recentHistory: (userDetails?.recentLogs || []).map((log, idx) => ({
      id: log.log_id || idx,
      title: log.title || log.searchQuery || '최근 활동',
      type: log.type === 'VIEW' ? '조회' : log.type === 'SEARCH' ? '검색' : log.type === 'MAP' ? '지도' : '기타'
    }))
  };

  const handleRecommend = async () => {
    setIsRecommending(true);
    setShowRecommendations(false);
    setSelectedFestival(null);
    setShowItinerary(false);
    
    try {
      const resp = await maxios.get('/ai/recommendations', {
        params: { userInput: userInput.trim() }
      });
      setRecommendList(resp.data || []);
      setShowRecommendations(true);
    } catch (error) {
      console.error('AI 추천 로드 실패:', error);
      alert('AI 추천 정보를 가져오는 데 실패했습니다.');
    } finally {
      setIsRecommending(false);
    }
  };

  const handleSelectFestival = (festival) => {
    setSelectedFestival(festival);
    // 기존 임시 일정 생성 제거
    setShowItinerary(false);
    setItineraryList([]);
    setPlannerWeather(null);
    setPlannerId(null);

    // 플래너 폼 초기화 (방문 날짜와 추가 요청사항만 초기화)
    setPlannerForm(prev => ({
      ...prev,
      visitDate: '',
      extraRequest: ''
    }));

    // 플래너 설정 모달 열기
    setShowPlannerModal(true);
  };

  // AI 플래너 생성 함수
  const handleCreatePlanner = async () => {
    if (!selectedFestival) {
      alert('축제를 먼저 선택해주세요.');
      return;
    }

    if (!plannerForm.visitDate) {
      alert('방문 날짜를 선택해주세요.');
      return;
    }

    if (!plannerForm.startLocation.trim()) {
      alert('출발지를 입력해주세요.');
      return;
    }

    if (!plannerForm.startTime || !plannerForm.endTime) {
      alert('시작 시간과 종료 시간을 선택해주세요.');
      return;
    }

    setIsGenerating(true);
    setShowItinerary(false);
    setItineraryList([]);

    try {
      const response = await createAIPlanner({
        contentId: selectedFestival.CONTENT_ID,
        visitDate: plannerForm.visitDate,
        startLocation: plannerForm.startLocation,
        peopleCount: Number(plannerForm.peopleCount),
        companionType: plannerForm.companionType,
        transportType: plannerForm.transportType,
        startTime: plannerForm.startTime,
        endTime: plannerForm.endTime,
        userInput: plannerForm.extraRequest,
        ragQuery: userInput,
        recommendationReason: selectedFestival.recommendation_reason
      });

      const data = response?.data ?? response;

      if (data.success) {
        setPlannerId(data.plannerId);
        setPlannerWeather(data.weather || null);
        setItineraryList(data.steps || []);
        setShowPlannerModal(false); // 모달 닫기
        setShowItinerary(true); // 일정 표시
      } else {
        alert(data.message || 'AI 플래너 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('AI 플래너 생성 실패:', error);
      alert(error.response?.data?.message || 'AI 플래너 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 플래너 폼 입력 변경 핸들러
  const handlePlannerFormChange = (e) => {
    const { name, value } = e.target;
    setPlannerForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFeedback = async (contentId, type, reason = '') => {
    try {
      const userId = user?.member_id || user?.id;
      const activityData = {
        member_id: userId,
        memberId: userId,
        action_type: type === 'LIKE' ? 'AI_LIKE' : 'AI_DISLIKE',
        actionType: type === 'LIKE' ? 'AI_LIKE' : 'AI_DISLIKE',
        content_id: Number(contentId),
        contentId: Number(contentId),
        festivalId: Number(contentId),
        keyword: reason || userInput,
        searchQuery: reason || userInput,
        type: type === 'LIKE' ? 'AI_LIKE' : 'AI_DISLIKE' // 이전 버전에서 동작했던 필드명
      };
      
      await saveActivityLog(activityData);
      
      setFeedbackMap(prev => ({
        ...prev,
        [contentId]: type
      }));
      
      if (type === 'DISLIKE') {
        setShowDislikeReason(null);
      }
    } catch (error) {
      console.error('피드백 저장 실패:', error);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            <span>✨</span> AI RAG 기반 맞춤형 여행 설계
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            당신만을 위한<br/>가장 완벽한 축제 여행
          </h1>
          
          <div className="max-w-2xl mx-auto pt-4">
            <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-indigo-900/40 border border-white/20 flex flex-col md:flex-row items-stretch gap-2">
              <div className="flex-grow relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-purple-600 opacity-50 group-focus-within:opacity-100 transition-opacity">🤖</div>
                <input 
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="예: 아이와 함께 가기 좋은 서울 근처 음악 축제"
                  className="w-full bg-transparent text-gray-800 placeholder:text-gray-300 pl-14 pr-6 py-5 rounded-[28px] focus:outline-none font-bold text-lg"
                  onKeyDown={(e) => e.key === 'Enter' && handleRecommend()}
                />
              </div>
              <button 
                onClick={handleRecommend}
                disabled={isRecommending}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-10 py-5 rounded-[26px] font-black text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shrink-0"
              >
                {isRecommending ? '분석 중...' : '추천받기 🚀'}
              </button>
            </div>
            
            {/* Quick Keyword Chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {['#아이와함께', '#조용한', '#먹거리풍부', '#수도권', '#이색체험', '#가족여행'].map(chip => (
                <button
                  key={chip}
                  onClick={() => setUserInput(chip.replace('#', ''))}
                  className="px-4 py-1.5 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-xs font-bold text-white/80 hover:bg-white/20 hover:text-white transition-all"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: User Context Analysis */}
        <aside className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 sticky top-24">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🧠</span> 분석 데이터 소스
            </h3>
            
            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3">사용자 프로필</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                    {userContext.profile.age} {userContext.profile.gender}
                  </span>
                </div>
              </div>

              <div>
                <button 
                  onClick={() => setIsRegionsOpen(!isRegionsOpen)}
                  className="w-full flex items-center justify-between text-xs font-black text-purple-600 uppercase tracking-wider mb-3 group"
                >
                  <span>📍 관심 지역</span>
                  <span className={`transition-transform duration-300 ${isRegionsOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isRegionsOpen && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userContext.interests.regions.length > 0 ? (
                      userContext.interests.regions.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">설정된 관심 지역이 없습니다.</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={() => setIsThemesOpen(!isThemesOpen)}
                  className="w-full flex items-center justify-between text-xs font-black text-purple-600 uppercase tracking-wider mb-3 group"
                >
                  <span>🎨 관심 테마</span>
                  <span className={`transition-transform duration-300 ${isThemesOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isThemesOpen && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userContext.interests.themes.length > 0 ? (
                      userContext.interests.themes.map((tag) => (
                        <span key={tag} className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">설정된 관심 테마가 없습니다.</span>
                    )}
                  </div>
                )}
              </div>

              <div>
                <button 
                  onClick={() => setIsLikesOpen(!isLikesOpen)}
                  className="w-full flex items-center justify-between text-xs font-black text-purple-600 uppercase tracking-wider mb-3 group"
                >
                  <span>❤️ 찜한 축제</span>
                  <span className={`transition-transform duration-300 ${isLikesOpen ? 'rotate-180' : ''}`}>▼</span>
                </button>
                {isLikesOpen && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userContext.likedFestivals.length > 0 ? (
                      userContext.likedFestivals.map((festival) => (
                        <div key={festival.CONTENT_ID} className="p-2.5 bg-pink-50/50 text-pink-700 text-[11px] font-bold rounded-xl border border-pink-100 flex items-center gap-2 transition-colors hover:bg-pink-50">
                          <span className="shrink-0">🎡</span>
                          <span className="truncate">{festival.TITLE}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">찜한 축제가 없습니다.</span>
                    )}
                  </div>
                )}
              </div>

              {userContext.recentHistory.length > 0 && (
                <div>
                  <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3">최근 활동 내역</p>
                  <div className="space-y-2">
                    {userContext.recentHistory.slice(0, 3).map((history, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-gray-100">
                        <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">{history.title}</span>
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                          history.type === '조회' ? 'bg-blue-100 text-blue-600' : 
                          history.type === '검색' ? 'bg-amber-100 text-amber-600' : 
                          history.type === '지도' ? 'bg-emerald-100 text-emerald-600' : 
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {history.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-50">
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  {isLoadingContext ? '사용자 데이터를 분석하고 있습니다...' : '사용자의 최근 활동 로그 및 프로필을 기반으로 실시간 벡터 검색(RAG)을 수행합니다.'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Steps Section */}
        <main className="lg:col-span-2 space-y-6 sm:space-y-8 order-1 lg:order-2">
          {/* Step 1: Recommendations */}
          {(isRecommending || showRecommendations) && (
            <section className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">STEP 1. 추천 축제 목록</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">AI가 선별한 취향 저격 축제들입니다.</p>
                </div>
                {showRecommendations && (
                  <button onClick={handleRecommend} className="text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors">
                    다시 추천받기 🔄
                  </button>
                )}
              </div>

              {isRecommending ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                  <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 bg-purple-200 rounded-full animate-ping opacity-25"></div>
                    <div className="relative w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                      🔍
                    </div>
                  </div>
                  <div className="text-center max-w-sm px-6">
                    <p className="text-lg font-black text-gray-800 leading-tight">
                      {userInput ? (
                        <>
                          <span className="text-purple-600">"{userInput}"</span><br/>조건에 맞춰 분석 중...
                        </>
                      ) : '사용자 취향 분석 중...'}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">전국 축제 데이터에서 최적의 장소를 찾고 있습니다.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {recommendList.map((item) => (
                    <div 
                      key={item.CONTENT_ID} 
                      onClick={() => handleSelectFestival(item)}
                      className={`group cursor-pointer p-6 rounded-[32px] border-2 transition-all duration-300 ${
                        selectedFestival?.CONTENT_ID === item.CONTENT_ID 
                        ? 'border-purple-600 bg-purple-50/30' 
                        : 'border-transparent bg-slate-50 hover:border-purple-200 hover:bg-white hover:shadow-lg'
                      }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 h-48 shrink-0 rounded-2xl overflow-hidden">
                          <img src={item.FIRST_IMAGE} alt={item.TITLE} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                          {selectedFestival?.CONTENT_ID === item.CONTENT_ID && (
                            <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-purple-600 text-xl font-bold">
                                ✓
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between items-start">
                            <h4 className="text-xl font-black text-gray-800 group-hover:text-purple-600 transition-colors">{item.TITLE}</h4>
                            
                            {/* Feedback Buttons */}
                            <div className="flex gap-2 shrink-0 ml-4">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleFeedback(item.CONTENT_ID, 'LIKE');
                                }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                  feedbackMap[item.CONTENT_ID] === 'LIKE'
                                  ? 'bg-blue-500 text-white shadow-lg'
                                  : 'bg-white text-gray-400 hover:text-blue-500 border border-gray-100'
                                }`}
                              >
                                👍
                              </button>
                              <div className="relative">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDislikeReason(showDislikeReason === item.CONTENT_ID ? null : item.CONTENT_ID);
                                  }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                                    feedbackMap[item.CONTENT_ID] === 'DISLIKE'
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white text-gray-400 hover:text-red-500 border border-gray-100'
                                  }`}
                                >
                                  👎
                                </button>
                                
                                {/* Dislike Reason Modal (Small Popover) */}
                                {showDislikeReason === item.CONTENT_ID && (
                                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in zoom-in-95 duration-200">
                                    <p className="text-xs font-black text-gray-800 mb-3">어떤 점이 별로였나요? 🤔</p>
                                    <div className="flex flex-wrap gap-2">
                                      {[
                                        '거리가 너무 멀어요', 
                                        '취향이 아니에요', 
                                        '이미 가봤어요', 
                                        '주변 즐길거리가 없어요', 
                                        '너무 북적거려요', 
                                        '일정이 안 맞아요',
                                        '아이와 가기 별로예요',
                                        '테마가 지루해요'
                                      ].map(reason => (
                                        <button
                                          key={reason}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleFeedback(item.CONTENT_ID, 'DISLIKE', reason);
                                          }}
                                          className="text-[10px] font-bold px-2 py-1 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-100 hover:border-red-100"
                                        >
                                          {reason}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-gray-400 font-bold mt-2 flex items-center gap-1">📍 {item.ADDR1}</p>
                          <p className="text-sm text-gray-500 font-medium mt-3 line-clamp-3">{item.OVERVIEW}</p>
                          
                          <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <p className="text-[11px] font-black text-purple-600 uppercase mb-1 flex items-center gap-1">
                              ✨ AI의 추천 사유
                            </p>
                            <p className="text-xs text-purple-800 font-bold leading-relaxed">
                              {item.recommendation_reason}
                            </p>
                          </div>
                          {/* 추천 카드 버튼 문구 변경 */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectFestival(item);
                            }}
                            className="mt-4 w-full bg-purple-600 text-white py-3 rounded-2xl font-black hover:bg-purple-700 transition-all"
                          >
                            이 축제로 AI 일정 만들기
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Step 2: Itinerary Loading / Result */}
          {(isGenerating || showItinerary) && (
            <section className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 animate-in fade-in slide-in-from-top-8 duration-700">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">STEP 2. 맞춤형 여행 코스</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    <span className="text-purple-600 font-bold">[{selectedFestival?.TITLE}]</span> 기반의 최적 동선입니다.
                  </p>
                </div>
              </div>

              {/* 날씨 요약 표시 */}
              {plannerWeather?.summary && (
                <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold">
                  🌦 방문일 날씨 반영: {plannerWeather.summary}
                </div>
              )}

              {/* 저장 완료 안내 */}
              {plannerId && (
                <div className="mb-4 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-bold">
                  ✅ 생성된 플래너가 저장되었습니다. 마이페이지에서 다시 확인할 수 있습니다.
                </div>
              )}

              {isGenerating ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                  </div>
                  <div className="text-center space-y-2">
                    <p className="text-xl font-black text-gray-800">AI가 일정을 설계하고 있습니다</p>
                    <p className="text-sm text-gray-400 font-medium">실시간 데이터 분석 중입니다...</p>
                  </div>
                </div>
              ) : (
                <>
                  {itineraryList.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center text-gray-500">
                      <span className="text-5xl mb-4">🤔</span>
                      <p className="text-lg font-bold">일정을 생성하지 못했습니다.</p>
                      <p className="text-sm text-gray-400 mt-2">조건을 조금 바꿔 다시 시도해주세요.</p>
                    </div>
                  ) : (
                    <>
                      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pt-4">
                        {itineraryList.map((step, idx) => (
                          <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-600 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                              <span className="text-xs">{getStepIcon(step.type)}</span>
                            </div>
                            <div className="w-[calc(100%-4rem)] md:w-[45%] p-5 rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-purple-200">
                              <div className="flex items-center justify-between space-x-2 mb-2">
                                <h4 className="font-black text-gray-800">{step.title}</h4>
                                <time className="font-black text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{step.time}</time>
                              </div>
                              <p className="text-sm text-gray-500 font-medium leading-relaxed">{step.description}</p>
                              {step.placeName && <p className="text-xs text-gray-400 font-bold mt-2">📍 {step.placeName}</p>}
                              {step.address && <p className="text-xs text-gray-400 font-bold">{step.address}</p>}
                              {step.reason && <p className="text-xs text-purple-700 font-bold mt-2">💡 {step.reason}</p>}
                              {step.kakaoPlaceUrl && (
                                <a 
                                  href={step.kakaoPlaceUrl} 
                                  target="_blank" 
                                  rel="noreferrer" 
                                  className="text-xs text-blue-500 hover:underline mt-2 inline-block font-bold"
                                >
                                  카카오맵에서 보기
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* 카카오 지도 표시 영역 */}
                      <div id="plannerMap" className="w-full h-[360px] rounded-[28px] border border-gray-100 mt-8 overflow-hidden" />
                    </>
                  )}
                </>
              )}
            </section>
          )}

          {(!showRecommendations && !isRecommending) || (showRecommendations && recommendList.length === 0) ? (
            <div className="bg-white rounded-[32px] p-20 shadow-xl shadow-purple-900/5 border border-purple-50 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-4xl animate-bounce">
                {showRecommendations && recommendList.length === 0 ? '😢' : '🤖'}
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">
                {showRecommendations && recommendList.length === 0 ? 
                  "조건에 맞는 추천 축제가 없습니다." : 
                  "나만을 위한 특별한 여행 준비"
                }
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                {showRecommendations && recommendList.length === 0 ?
                  "다른 검색어를 입력하거나 조건을 변경하여 다시 시도해 보세요." :
                  <>
                    상단의 <span className="text-purple-600 font-bold">'한 마디 입력창'</span>에 원하는 조건을 적거나<br/>
                    <span className="text-purple-600 font-bold">'추천받기'</span> 버튼을 클릭하여 AI 분석 시스템을 시작해 보세요.
                  </>
                }
              </p>
            </div>
          ) : null}

          {showRecommendations && recommendList.length > 0 && !selectedFestival && (
            <div className="bg-slate-100/50 rounded-[32px] p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">👆</div>
              <p className="text-slate-400 font-bold">위의 추천 목록에서 축제를 선택하면<br/>상세 여행 계획이 이곳에 생성됩니다.</p>
            </div>
          )}
        </main>
      </div>

      {/* AI Planner 설정 모달 */}
      {showPlannerModal && selectedFestival && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-700/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide p-5 sm:p-8 relative">
            <h3 className="text-2xl font-black text-gray-800 mb-2">AI 플래너 설정</h3>
            <p className="text-sm text-gray-500 mb-6">
              <span className="font-bold text-purple-600">[{selectedFestival.TITLE}]</span> 축제를 위한 일정을 생성합니다.
            </p>

            <div className="space-y-4">
              {/* 방문 날짜 */}
              <div>
                <label htmlFor="visitDate" className="block text-sm font-bold text-gray-700 mb-1">방문 날짜</label>
                <input
                  type="date"
                  id="visitDate"
                  name="visitDate"
                  value={plannerForm.visitDate}
                  onChange={handlePlannerFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 출발지 */}
              <div>
                <label htmlFor="startLocation" className="block text-sm font-bold text-gray-700 mb-1">출발지</label>
                <input
                  type="text"
                  id="startLocation"
                  name="startLocation"
                  value={plannerForm.startLocation}
                  onChange={handlePlannerFormChange}
                  placeholder="예: 서울역"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 인원 수 */}
              <div>
                <label htmlFor="peopleCount" className="block text-sm font-bold text-gray-700 mb-1">인원 수</label>
                <input
                  type="number"
                  id="peopleCount"
                  name="peopleCount"
                  value={plannerForm.peopleCount}
                  onChange={handlePlannerFormChange}
                  min="1"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* 동행 유형 */}
              <div>
                <label htmlFor="companionType" className="block text-sm font-bold text-gray-700 mb-1">동행 유형</label>
                <select
                  id="companionType"
                  name="companionType"
                  value={plannerForm.companionType}
                  onChange={handlePlannerFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="ALONE">혼자</option>
                  <option value="FRIEND">친구</option>
                  <option value="COUPLE">연인</option>
                  <option value="FAMILY">가족</option>
                  <option value="CHILD">아이와 함께</option>
                  <option value="PARENT">부모님과</option>
                  <option value="PET">반려동물과</option>
                </select>
              </div>

              {/* 이동수단 */}
              <div>
                <label htmlFor="transportType" className="block text-sm font-bold text-gray-700 mb-1">이동수단</label>
                <select
                  id="transportType"
                  name="transportType"
                  value={plannerForm.transportType}
                  onChange={handlePlannerFormChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                >
                  <option value="PUBLIC">대중교통</option>
                  <option value="CAR">자가용</option>
                  <option value="WALK">도보</option>
                </select>
              </div>

              {/* 시작 시간 / 종료 시간 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex-1">
                  <label htmlFor="startTime" className="block text-sm font-bold text-gray-700 mb-1">시작 시간</label>
                  <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={plannerForm.startTime}
                    onChange={handlePlannerFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div className="flex-1">
                  <label htmlFor="endTime" className="block text-sm font-bold text-gray-700 mb-1">종료 시간</label>
                  <input
                    type="time"
                    id="endTime"
                    name="endTime"
                    value={plannerForm.endTime}
                    onChange={handlePlannerFormChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* 추가 요청사항 */}
              <div>
                <label htmlFor="extraRequest" className="block text-sm font-bold text-gray-700 mb-1">추가 요청사항 (선택 사항)</label>
                <textarea
                  id="extraRequest"
                  name="extraRequest"
                  value={plannerForm.extraRequest}
                  onChange={handlePlannerFormChange}
                  rows="3"
                  placeholder="예: 조용한 카페를 선호해요, 반려동물 동반 가능 장소를 포함해주세요."
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
              <button
                onClick={() => setShowPlannerModal(false)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleCreatePlanner}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors disabled:opacity-50"
                disabled={isGenerating}
              >
                {isGenerating ? '일정 생성 중...' : 'AI 일정 만들기'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIPlannerPage;
