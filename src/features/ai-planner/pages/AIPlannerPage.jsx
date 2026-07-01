import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { maxios } from '../../../api/axiosApi';
import useAuthStore from '../../../store/useAuthStore';
import { getMemberProfile } from '../../../api/memberApi';
import { saveActivityLog } from '../../../api/activityApi';
import { previewAIPlanner, saveAIPlanner } from '../../../api/aiApi';
import LoginMessage from '../../../components/LoginMessage';
import PlannerSetupModal from '../components/PlannerSetupModal';

const AIPlannerPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const isMemberLoggedIn = Boolean(isLoggedIn && (user?.member_id || user?.id));

  const [showLoginRequiredModal, setShowLoginRequiredModal] = useState(!isMemberLoggedIn);
  const [isRecommending, setIsRecommending] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const [selectedFestival, setSelectedFestival] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);

  // 축제 상세 모달 상태
  const [selectedDetailFestival, setSelectedDetailFestival] = useState(null);
  const [showFestivalDetailModal, setShowFestivalDetailModal] = useState(false);

  const [recommendList, setRecommendList] = useState([]);
  const [userInput, setUserInput] = useState('');

  const [feedbackMap, setFeedbackMap] = useState({});
  const [showDislikeReason, setShowDislikeReason] = useState(null);

  const [userDetails, setUserDetails] = useState(null);
  const [isLoadingContext, setIsLoadingContext] = useState(false);

  // 축제 하루 코스 설정 모달 상태
  const [showPlannerModal, setShowPlannerModal] = useState(false);
  const [plannerForm, setPlannerForm] = useState({
    visitDate: '',
    peopleCount: 2,
    companionType: 'FRIEND',
    courseStyle: 'RELAXED',
    extraRequest: ''
  });

  // 축제 하루 코스 결과 상태
  const [itineraryList, setItineraryList] = useState([]);
  const [plannerId, setPlannerId] = useState(null);
  const [plannerWeather, setPlannerWeather] = useState(null);
  const [routeNotice, setRouteNotice] = useState('');

  // 추가
  const [previewPlannerData, setPreviewPlannerData] = useState(null);
  const [isSavingPlanner, setIsSavingPlanner] = useState(false);
  const [isPlannerSaved, setIsPlannerSaved] = useState(false);

  // 관심사 섹션 펼침/접힘 상태
  const [isRegionsOpen, setIsRegionsOpen] = useState(true);
  const [isThemesOpen, setIsThemesOpen] = useState(true);
  const [isLikesOpen, setIsLikesOpen] = useState(true);
  const plannerSectionRef = useRef(null);

  const scrollToPlannerSection = () => {
    const plannerSection = plannerSectionRef.current;

    if (!plannerSection) {
      return;
    }

    const top = plannerSection.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({
      top,
      behavior: 'smooth'
    });
  };

  // 비로그인 접근 시 회원 전용 안내 모달 표시
  useEffect(() => {
    setShowLoginRequiredModal(!isMemberLoggedIn);
  }, [isMemberLoggedIn]);

  useEffect(() => {
    if (!showItinerary || itineraryList.length === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      scrollToPlannerSection();
    }, 150);

    return () => window.clearTimeout(timer);
  }, [showItinerary, itineraryList.length]);

  const handleLoginRequiredBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  // 로그인 여부 확인 공통 함수
  const requireLogin = () => {
    if (!isMemberLoggedIn) {
      setShowLoginRequiredModal(true);
      return false;
    }

    return true;
  };

  // 데이터 로드 Effect
  useEffect(() => {
    if (isMemberLoggedIn) {
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
  }, [isMemberLoggedIn, user?.member_id, user?.id]);

  // 유저의 생년월일을 바탕으로 연령대 계산
  const getAgeGroup = (birthdate) => {
    if (!birthdate) return '연령대 미정';

    const year = parseInt(birthdate.substring(0, 4), 10);
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;

    return `${Math.floor(age / 10) * 10}대`;
  };

  // 추천 API 응답의 contentId 필드명이 달라도 안전하게 꺼내기
  const getFestivalContentId = (festival) => {
    return (
      festival?.CONTENT_ID ||
      festival?.content_id ||
      festival?.contentId ||
      festival?.CONTENTID ||
      festival?.contentid
    );
  };

  // 축제 날짜 필드명 안전하게 꺼내기
  const getFestivalStartDate = (festival) => {
    return (
      festival?.EVENT_START_DATE ||
      festival?.event_start_date ||
      festival?.eventStartDate ||
      festival?.START_DATE ||
      festival?.startDate
    );
  };

  const getFestivalEndDate = (festival) => {
    return (
      festival?.EVENT_END_DATE ||
      festival?.event_end_date ||
      festival?.eventEndDate ||
      festival?.END_DATE ||
      festival?.endDate
    );
  };

  // yyyyMMdd 또는 yyyy-MM-dd를 input[type="date"] 형식인 yyyy-MM-dd로 변환
  const formatDateForInput = (dateValue) => {
    if (!dateValue) return '';

    const text = String(dateValue).trim();

    if (/^\d{8}$/.test(text)) {
      return `${text.substring(0, 4)}-${text.substring(4, 6)}-${text.substring(6, 8)}`;
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
      return text;
    }

    return '';
  };

  // 화면 표시용 날짜
  const formatDateForDisplay = (dateValue) => {
    const inputDate = formatDateForInput(dateValue);

    if (!inputDate) return '기간 미정';

    return inputDate.replaceAll('-', '.');
  };

  const getFestivalDateRange = (festival) => {
    const start = formatDateForInput(getFestivalStartDate(festival));
    const end = formatDateForInput(getFestivalEndDate(festival));

    return {
      start,
      end,
      startLabel: formatDateForDisplay(getFestivalStartDate(festival)),
      endLabel: formatDateForDisplay(getFestivalEndDate(festival))
    };
  };

  const getTodayDateForInput = () => {
    const today = new Date();

    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;
  };

  const getMinPlannerVisitDate = (festival) => {
    const { start } = getFestivalDateRange(festival);
    const today = getTodayDateForInput();

    return start && start > today ? start : today;
  };

  // 추천 장소 타입별 아이콘
  const getStepIcon = (type) => {
    switch (type) {
      case 'FESTIVAL':
        return '🎪';
      case 'FOOD':
        return '🍽️';
      case 'TOUR':
        return '📸';
      case 'CULTURE':
        return '🏛️';
      case 'REST':
        return '🌿';
      default:
        return '📍';
    }
  };

  // 화면에 보여줄 동행 유형 한글 변환
  const getCompanionLabel = (type) => {
    switch (type) {
      case 'ALONE':
        return '혼자';
      case 'FRIEND':
        return '친구와';
      case 'COUPLE':
        return '연인과';
      case 'FAMILY':
        return '가족과';
      case 'CHILD':
        return '아이와 함께';
      case 'PARENT':
        return '부모님과';
      case 'PET':
        return '반려동물과';
      default:
        return '동행 미정';
    }
  };

  // 화면에 보여줄 코스 스타일 한글 변환
  const getCourseStyleLabel = (style) => {
    switch (style) {
      case 'RELAXED':
        return '느긋하게 쉬엄쉬엄';
      case 'FOOD':
        return '맛집은 꼭 챙기기';
      case 'TOUR':
        return '주변 명소까지 알차게';
      case 'CULTURE':
        return '문화 감성 코스';
      case 'INDOOR':
        return '실내 위주';
      case 'PHOTO':
        return '사진 명소 위주';
      case 'FAMILY':
        return '가족이 편한 동선';
      default:
        return '맞춤형 코스';
    }
  };

  // 코스 컨셉 제목 생성
  const getCourseTitle = () => {
    switch (plannerForm.courseStyle) {
      case 'FOOD':
        return '맛집까지 챙긴 든든한 축제 코스';
      case 'TOUR':
        return '주변 명소까지 둘러보는 알찬 코스';
      case 'CULTURE':
        return '문화 감성 가득한 축제 코스';
      case 'INDOOR':
        return '날씨 걱정 적은 실내 중심 코스';
      case 'PHOTO':
        return '사진 남기기 좋은 감성 코스';
      case 'FAMILY':
        return '가족과 편하게 즐기는 코스';
      default:
        return '여유롭게 즐기는 축제 나들이 코스';
    }
  };

  // 코스 배지 생성
  const getCourseBadges = () => {
    const badges = ['축제 연계 코스'];

    if (plannerForm.courseStyle === 'FOOD') badges.push('맛집 포함');
    if (plannerForm.courseStyle === 'TOUR') badges.push('주변 명소');
    if (plannerForm.courseStyle === 'CULTURE') badges.push('문화시설');
    if (plannerForm.courseStyle === 'INDOOR') badges.push('실내 중심');
    if (plannerForm.courseStyle === 'PHOTO') badges.push('사진 명소');
    if (plannerForm.companionType === 'CHILD') badges.push('아이와 함께');
    if (plannerForm.companionType === 'FAMILY') badges.push('가족 추천');
    if (plannerWeather) badges.push('날씨 반영');
    if (routeNotice) badges.push('동선 안내');

    return badges;
  };

  // 각 코스 순서에 대한 설명
  const getStepOrderReason = (idx, step) => {
    if (idx === 0) {
      return '축제 하루를 시작하기 좋은 첫 번째 장소로 배치했어요.';
    }

    if (step.type === 'FOOD') {
      return '이동 후 식사하기 좋은 타이밍에 맞춰 배치했어요.';
    }

    if (step.type === 'REST') {
      return '중간에 잠시 쉬어가기 좋은 흐름으로 넣었어요.';
    }

    if (idx === itineraryList.length - 1) {
      return '축제 나들이를 마무리하기 좋은 마지막 코스예요.';
    }

    return '이전 장소와 다음 장소의 흐름을 고려해 배치했어요.';
  };

  // 좌표 꺼내기
  const getStepLat = (step) => {
    return step.mapY || step.map_y || step.latitude || step.lat;
  };

  const getStepLng = (step) => {
    return step.mapX || step.map_x || step.longitude || step.lng;
  };

  // 카카오맵 주소 검색 URL 생성
  const getKakaoSearchUrl = (step) => {
    const keyword = encodeURIComponent(
      step.address || step.placeName || step.title || ''
    );

    if (!keyword) return null;

    return `https://map.kakao.com/?q=${keyword}`;
  };

  // 다음 장소 길찾기 링크 생성
  const getKakaoDirectionUrl = (fromStep, toStep) => {
    const fromLat = getStepLat(fromStep);
    const fromLng = getStepLng(fromStep);
    const toLat = getStepLat(toStep);
    const toLng = getStepLng(toStep);

    if (!fromLat || !fromLng || !toLat || !toLng) {
      return null;
    }

    const fromName = encodeURIComponent(fromStep.placeName || fromStep.title || '출발지');
    const toName = encodeURIComponent(toStep.placeName || toStep.title || '도착지');

    return `https://map.kakao.com/link/from/${fromName},${fromLat},${fromLng}/to/${toName},${toLat},${toLng}`;
  };

  // 실제 데이터를 기반으로 컨텍스트 구성
  const userContext = {
    profile: {
      age: getAgeGroup(userDetails?.member?.birthdate),
      gender:
        userDetails?.member?.gender === 'M'
          ? '남성'
          : userDetails?.member?.gender === 'F'
            ? '여성'
            : userDetails?.member?.gender || '성별 미정',
      residence: userDetails?.member?.addr_sido
        ? `${userDetails.member.addr_sido} ${userDetails.member.addr_sigungu || ''}`.trim()
        : '거주지 미등록'
    },
    interests: {
      regions: userDetails?.interestRegions?.map((r) => r.region_name) || [],
      themes: userDetails?.interestThemes?.map((t) => t.theme_name) || []
    },
    likedFestivals: userDetails?.likedFestivals || [],
    recentHistory: (userDetails?.recentLogs || [])
      .filter(log => ['VIEW', 'SEARCH', 'MAP'].includes(log.type))
      .map((log, idx) => ({
        id: log.log_id || idx,
        title: log.title || log.searchQuery || '최근 활동',
        type:
          log.type === 'VIEW'
            ? '조회'
            : log.type === 'SEARCH'
              ? '검색'
              : log.type === 'MAP'
                ? '지도'
                : '기타'
      }))
  };

  const handleRecommend = async () => {
    if (!requireLogin()) return;

    setIsRecommending(true);
    setShowRecommendations(false);
    setSelectedFestival(null);
    setShowItinerary(false);
    setItineraryList([]);
    setPlannerId(null);
    setPlannerWeather(null);
    setRouteNotice('');
    setPreviewPlannerData(null);
    setIsPlannerSaved(false);

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

  // 축제 카드 클릭 시 상세 모달 열기
  const handleOpenFestivalDetail = (festival) => {
    if (!requireLogin()) return;

    setSelectedDetailFestival(festival);
    setShowFestivalDetailModal(true);
  };

  // 축제 상세 모달 닫기
  const handleCloseFestivalDetail = () => {
    setShowFestivalDetailModal(false);
    setSelectedDetailFestival(null);
  };

  // 축제 하루 코스 설정 모달 열기
  const handleSelectFestival = (festival) => {
    if (!requireLogin()) return;

    const defaultVisitDate = getMinPlannerVisitDate(festival);

    setSelectedFestival(festival);

    // 기존 결과 초기화
    setIsGenerating(false);
    setShowItinerary(false);
    setItineraryList([]);
    setPlannerId(null);
    setPlannerWeather(null);
    setRouteNotice('');

    // 추가
    setItineraryList([]);
    setPlannerId(null);
    setPlannerWeather(null);
    setRouteNotice('');
    setPreviewPlannerData(null);
    setIsPlannerSaved(false);

    // 설정 기본값 초기화
    setPlannerForm({
      visitDate: defaultVisitDate,
      peopleCount: 2,
      companionType: 'FRIEND',
      courseStyle: 'RELAXED',
      extraRequest: ''
    });

    // 설정 모달 열기
    setShowPlannerModal(true);
  };

  // 축제 하루 코스 생성
  const handleCreatePlanner = async () => {
    if (!requireLogin()) return;

    if (!selectedFestival) {
      alert('축제를 먼저 선택해주세요.');
      return;
    }

    const contentId = getFestivalContentId(selectedFestival);

    if (!contentId) {
      console.log('selectedFestival:', selectedFestival);
      alert('축제 contentId를 찾을 수 없습니다.');
      return;
    }

    if (!plannerForm.visitDate) {
      alert('방문 날짜를 선택해주세요.');
      return;
    }

    if (Number(plannerForm.peopleCount) < 1) {
      alert('동행 인원은 1명 이상이어야 합니다.');
      return;
    }

    const { start, end } = getFestivalDateRange(selectedFestival);
    const today = getTodayDateForInput();

    if (plannerForm.visitDate < today) {
      alert(`방문 날짜는 오늘(${today}) 이후여야 합니다.`);
      return;
    }

    if (start && plannerForm.visitDate < start) {
      alert(`방문 날짜는 축제 시작일(${start}) 이후여야 합니다.`);
      return;
    }

    if (end && plannerForm.visitDate > end) {
      alert(`방문 날짜는 축제 종료일(${end}) 이전이어야 합니다.`);
      return;
    }

    setIsGenerating(true);
    setShowItinerary(false);
    setItineraryList([]);
    setPlannerId(null);
    setPlannerWeather(null);
    setRouteNotice('');
    setItineraryList([]);
    setPlannerId(null);
    setPlannerWeather(null);
    setRouteNotice('');
    setPreviewPlannerData(null);
    setIsPlannerSaved(false);

    try {
      const response = await previewAIPlanner({
        content_id: Number(contentId),
        visit_date: plannerForm.visitDate,
        people_count: Number(plannerForm.peopleCount),
        companion_type: plannerForm.companionType,
        course_style: plannerForm.courseStyle,
        user_input: plannerForm.extraRequest,
        rag_query: userInput,
        recommendation_reason: selectedFestival.recommendation_reason
      });

      const data = response?.data ?? response;
      console.log('축제 하루 코스 응답:', data);

      if (data.success) {
        const normalizedSteps = (data.steps || []).map((step) => ({
          ...step,
          time: step.time || step.time_label,
          placeName: step.placeName || step.place_name,
          kakaoPlaceUrl: step.kakaoPlaceUrl || step.kakao_place_url,
          sourceContentId: step.sourceContentId || step.source_content_id,
          contentTypeId: step.contentTypeId || step.content_type_id,
          firstImage: step.firstImage || step.first_image,
          sourceApi: step.sourceApi || step.source_api,
          mapX: step.mapX || step.map_x || step.longitude || step.lng,
          mapY: step.mapY || step.map_y || step.latitude || step.lat
        }));

        const previewData = {
          content_id: Number(contentId),
          visit_date: plannerForm.visitDate,
          people_count: Number(plannerForm.peopleCount),
          companion_type: plannerForm.companionType,
          course_style: plannerForm.courseStyle,
          user_input: plannerForm.extraRequest,
          rag_query: userInput,
          recommendation_reason: selectedFestival.recommendation_reason,
          weather_summary: data.weather_summary || data.weatherSummary || null,
          route_notice: data.route_notice || data.routeNotice || '',
          steps: normalizedSteps
        };

        setPreviewPlannerData(previewData);
        setPlannerId(null);
        setPlannerWeather(previewData.weather_summary);
        setRouteNotice(previewData.route_notice);
        setItineraryList(normalizedSteps);
        setShowPlannerModal(false);
        setShowItinerary(true);
        setIsPlannerSaved(false);
        window.setTimeout(() => {
          scrollToPlannerSection();
        }, 250);
      } else {
        alert(data.message || '축제 하루 코스 생성에 실패했습니다.');
      }
    } catch (error) {
      console.error('축제 하루 코스 생성 실패:', error);
      alert(error.response?.data?.message || '축제 하루 코스 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 사용자가 마음에 든 경우에만 마이페이지에 저장
  const handleSavePlanner = async () => {
    if (!requireLogin()) return;

    if (!previewPlannerData) {
      alert('저장할 코스 정보가 없습니다.');
      return;
    }

    if (isPlannerSaved) {
      alert('이미 저장된 코스입니다.');
      return;
    }

    const confirmSave = window.confirm(
      '이 코스를 마이페이지에 저장할까요? 저장 후 마이페이지에서 다시 확인할 수 있습니다.'
    );

    if (!confirmSave) {
      return;
    }

    setIsSavingPlanner(true);

    try {
      const response = await saveAIPlanner(previewPlannerData);
      const data = response?.data ?? response;

      if (data.success) {
        setPlannerId(data.plannerId || data.planner_id);
        setIsPlannerSaved(true);
        alert('마이페이지에 코스가 저장되었습니다.');
      } else {
        alert(data.message || '코스 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('AI 플래너 저장 실패:', error);
      alert(error.response?.data?.message || '코스 저장 중 오류가 발생했습니다.');
    } finally {
      setIsSavingPlanner(false);
    }
  };

  // 축제 하루 코스 설정 폼 변경
  const handlePlannerFormChange = (e) => {
    const { name, value } = e.target;

    if (name === 'peopleCount') {
      if (value === '' || Number(value) >= 0) {
        setPlannerForm((prev) => ({
          ...prev,
          [name]: value
        }));
        return;
      }
    }

    if (name === 'visitDate' && selectedFestival) {
      const { end } = getFestivalDateRange(selectedFestival);
      const minVisitDate = getMinPlannerVisitDate(selectedFestival);

      if (value < minVisitDate) {
        setPlannerForm((prev) => ({
          ...prev,
          [name]: minVisitDate
        }));
        return;
      }

      if (end && value > end) {
        alert(`축제 종료일(${end}) 이전 날짜만 선택할 수 있습니다.`);
        return;
      }
    }

    setPlannerForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePlannerPeopleCountBlur = () => {
    setPlannerForm((prev) => ({
      ...prev,
      peopleCount:
        prev.peopleCount === '' || Number(prev.peopleCount) < 1
          ? '1'
          : prev.peopleCount
    }));
  };

  const handleFeedback = async (contentId, type, reason = '') => {
    if (!requireLogin()) return;

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

      setFeedbackMap((prev) => ({
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

  // 장소 검색하기
  const handlePlaceSearchClick = async (e, step, searchUrl) => {
    e.stopPropagation();

    if (!requireLogin()) return;

    if (!searchUrl) {
      alert('장소 검색 URL을 만들 수 없습니다.');
      return;
    }

    console.log('넘길 URL:', searchUrl);

    // 예시 1: 백엔드로 URL 저장/전달
    try {
      await maxios.post('/ai/planner/place-search-log', {
        title: step.title,
        placeName: step.placeName,
        address: step.address,
        searchUrl: searchUrl,
        kakaoPlaceUrl: step.kakaoPlaceUrl || null,
        mapX: getStepLng(step),
        mapY: getStepLat(step)
      });
    } catch (error) {
      console.error('장소 검색 URL 전달 실패:', error);
    }

    // 예시 2: 카카오맵도 같이 열기
    window.open(searchUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      <LoginMessage
        isOpen={showLoginRequiredModal && !isMemberLoggedIn}
        onClose={handleLoginRequiredBack}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            <span>🎪</span> 취향 기반 축제 코스 추천
          </div>

          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            어디 갈지 고민될 때,<br />
            AI가 축제 하루를 짜드려요
          </h1>

          <div className="max-w-2xl mx-auto pt-4">
            <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-indigo-900/40 border border-white/20 flex flex-col md:flex-row items-stretch gap-2">
              <div className="flex-grow relative group">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-xl text-purple-600 opacity-50 group-focus-within:opacity-100 transition-opacity">
                  🤖
                </div>

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
              {['#아이와함께', '#조용한', '#먹거리풍부', '#수도권', '#이색체험', '#가족여행'].map((chip) => (
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
        <aside className="lg:col-span-1 space-y-6 h-full">
          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 lg:sticky lg:top-24">
            <h3 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
              <span className="text-2xl">🧠</span> 분석 데이터 소스
            </h3>

            <div className="space-y-6">
              <div>
                <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3">
                  사용자 프로필
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-bold rounded-lg border border-gray-100">
                    {userContext.profile.age} {userContext.profile.gender}
                  </span>
                  <span className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100">
                    🏠 {userContext.profile.residence}
                  </span>
                </div>
              </div>

              <div>
                <button
                  onClick={() => setIsRegionsOpen(!isRegionsOpen)}
                  className="w-full flex items-center justify-between text-xs font-black text-purple-600 uppercase tracking-wider mb-3 group"
                >
                  <span>📍 관심 지역</span>
                  <span className={`transition-transform duration-300 ${isRegionsOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isRegionsOpen && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userContext.interests.regions.length > 0 ? (
                      userContext.interests.regions.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">
                        설정된 관심 지역이 없습니다.
                      </span>
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
                  <span className={`transition-transform duration-300 ${isThemesOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isThemesOpen && (
                  <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userContext.interests.themes.length > 0 ? (
                      userContext.interests.themes.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100"
                        >
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">
                        설정된 관심 테마가 없습니다.
                      </span>
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
                  <span className={`transition-transform duration-300 ${isLikesOpen ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </button>

                {isLikesOpen && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {userContext.likedFestivals.length > 0 ? (
                      userContext.likedFestivals.map((festival) => (
                        <div
                          key={festival.CONTENT_ID}
                          className="p-2.5 bg-pink-50/50 text-pink-700 text-[11px] font-bold rounded-xl border border-pink-100 flex items-center gap-2 transition-colors hover:bg-pink-50"
                        >
                          <span className="shrink-0">🎡</span>
                          <span className="truncate">{festival.TITLE}</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-gray-400 font-medium">
                        찜한 축제가 없습니다.
                      </span>
                    )}
                  </div>
                )}
              </div>

              {userContext.recentHistory.length > 0 && (
                <div>
                  <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3">
                    최근 활동 내역
                  </p>

                  <div className="space-y-2">
                    {userContext.recentHistory.slice(0, 3).map((history, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-gray-100"
                      >
                        <span className="text-[11px] font-bold text-gray-700 truncate max-w-[120px]">
                          {history.title}
                        </span>
                        <span
                          className={`text-[9px] font-black px-1.5 py-0.5 rounded ${history.type === '조회'
                            ? 'bg-blue-100 text-blue-600'
                            : history.type === '검색'
                              ? 'bg-amber-100 text-amber-600'
                              : history.type === '지도'
                                ? 'bg-emerald-100 text-emerald-600'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                        >
                          {history.type}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-50">
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  {isLoadingContext
                    ? '사용자 데이터를 분석하고 있습니다...'
                    : '사용자의 최근 활동 로그 및 프로필을 기반으로 맞춤 축제와 코스를 추천합니다.'}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Right: Steps Section */}
        <main className="lg:col-span-2 space-y-8">
          {/* Step 1: Recommendations */}
          {(isRecommending || showRecommendations) && (
            <section className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">
                    STEP 1. 추천 축제 목록
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    AI가 선별한 취향 저격 축제들입니다.
                  </p>
                  <p className="text-xs text-purple-600 font-semibold mt-1.5 flex items-center gap-1">
                    <span>✨</span> 피드백(👍/👎)을 남겨주시면 AI가 취향을 학습해 더 정확한 축제를 추천합니다.
                  </p>
                </div>

                {showRecommendations && (
                  <button
                    onClick={handleRecommend}
                    className="text-xs font-bold text-gray-400 hover:text-purple-600 transition-colors"
                  >
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
                          <span className="text-purple-600">"{userInput}"</span>
                          <br />
                          조건에 맞춰 분석 중...
                        </>
                      ) : (
                        '사용자 취향 분석 중...'
                      )}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      전국 축제 데이터에서 최적의 장소를 찾고 있습니다.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {recommendList.map((item) => (
                    <div
                      key={item.CONTENT_ID}
                      onClick={() => handleOpenFestivalDetail(item)}
                      className={`group cursor-pointer p-6 rounded-[32px] border-2 transition-all duration-300 ${selectedFestival?.CONTENT_ID === item.CONTENT_ID
                        ? 'border-purple-600 bg-purple-50/30'
                        : 'border-transparent bg-slate-50 hover:border-purple-200 hover:bg-white hover:shadow-lg'
                        }`}
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative w-full md:w-48 h-48 shrink-0 rounded-2xl overflow-hidden bg-gray-100">
                          {item.FIRST_IMAGE ? (
                            <img
                              src={item.FIRST_IMAGE}
                              alt={item.TITLE}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm font-bold">
                              이미지 없음
                            </div>
                          )}

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
                            <h4 className="text-xl font-black text-gray-800 group-hover:text-purple-600 transition-colors">
                              {item.TITLE}
                            </h4>

                            {/* Feedback Buttons */}
                            <div className="flex gap-2 shrink-0 ml-4">
                              <div className="relative group/like">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleFeedback(item.CONTENT_ID, 'LIKE');
                                  }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${feedbackMap[item.CONTENT_ID] === 'LIKE'
                                    ? 'bg-blue-500 text-white shadow-lg'
                                    : 'bg-white text-gray-400 hover:text-blue-500 border border-gray-100'
                                    }`}
                                >
                                  👍
                                </button>
                                {/* Like Tooltip */}
                                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/like:opacity-100 transition-opacity duration-200 z-10 shadow-md">
                                  유사한 축제 더 추천받기
                                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                </div>
                              </div>

                              <div className="relative group/dislike">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowDislikeReason(
                                      showDislikeReason === item.CONTENT_ID ? null : item.CONTENT_ID
                                    );
                                  }}
                                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${feedbackMap[item.CONTENT_ID] === 'DISLIKE'
                                    ? 'bg-red-500 text-white shadow-lg'
                                    : 'bg-white text-gray-400 hover:text-red-500 border border-gray-100'
                                    }`}
                                >
                                  👎
                                </button>

                                {/* Dislike Tooltip */}
                                {showDislikeReason !== item.CONTENT_ID && (
                                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-2 py-1.5 rounded-lg whitespace-nowrap opacity-0 pointer-events-none group-hover/dislike:opacity-100 transition-opacity duration-200 z-10 shadow-md">
                                    추천에서 제외/보완하기
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                  </div>
                                )}

                                {/* Dislike Reason Modal */}
                                {showDislikeReason === item.CONTENT_ID && (
                                  <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 z-50 animate-in zoom-in-95 duration-200">
                                    <p className="text-xs font-black text-gray-800 mb-3">
                                      어떤 점이 별로였나요? 🤔
                                    </p>

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
                                      ].map((reason) => (
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

                          <p className="text-xs text-gray-400 font-bold mt-2 flex items-center gap-1">
                            📍 {item.ADDR1}
                          </p>

                          <p className="text-sm text-gray-500 font-medium mt-3 line-clamp-3">
                            {item.OVERVIEW}
                          </p>

                          <div className="mt-4 p-4 bg-purple-50 rounded-2xl border border-purple-100">
                            <p className="text-[11px] font-black text-purple-600 uppercase mb-1 flex items-center gap-1">
                              ✨ AI의 추천 사유
                            </p>
                            <p className="text-xs text-purple-800 font-bold leading-relaxed">
                              {item.recommendation_reason}
                            </p>
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectFestival(item);
                            }}
                            className="mt-4 w-full bg-purple-600 text-white py-3 rounded-2xl font-black hover:bg-purple-700 transition-all"
                          >
                            이 축제로 하루 코스 만들기
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Step 2: 축제 하루 코스 Result */}
          {(isGenerating || showItinerary) && (
            <section
              ref={plannerSectionRef}
              className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 animate-in fade-in slide-in-from-top-8 duration-700"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">
                    STEP 2. 축제 하루 코스
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">
                    <span className="text-purple-600 font-bold">[{selectedFestival?.TITLE}]</span>을 중심으로 하루 나들이 코스를 만들었어요.
                  </p>
                </div>
              </div>

              {showItinerary && itineraryList.length > 0 && (
                <div className="mb-8 p-6 rounded-[28px] bg-gradient-to-br from-yellow-50 via-orange-50 to-purple-50 border border-yellow-100 shadow-sm">
                  <div className="flex items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs font-black text-orange-500 mb-2">
                        🎪 오늘의 코스 컨셉
                      </p>

                      <h4 className="text-2xl font-black text-gray-800 leading-tight">
                        {getCourseTitle()}
                      </h4>
                    </div>

                    <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/80 items-center justify-center text-3xl shadow-sm">
                      🧭
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 font-medium leading-7">
                    <span className="font-bold text-purple-600">
                      [{selectedFestival?.TITLE}]
                    </span>
                    을 중심으로 방문 날짜, 동행 유형, 추천 스타일을 반영해 만든 맞춤형 코스예요.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {getCourseBadges().map((badge) => (
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
                      <p className="text-sm font-black text-gray-800">
                        {plannerForm.visitDate || '미정'}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/80 border border-white">
                      <p className="text-[10px] font-black text-gray-400">동행</p>
                      <p className="text-sm font-black text-gray-800">
                        {getCompanionLabel(plannerForm.companionType)}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/80 border border-white">
                      <p className="text-[10px] font-black text-gray-400">스타일</p>
                      <p className="text-sm font-black text-gray-800">
                        {getCourseStyleLabel(plannerForm.courseStyle)}
                      </p>
                    </div>

                    <div className="p-3 rounded-2xl bg-white/80 border border-white">
                      <p className="text-[10px] font-black text-gray-400">추천 장소</p>
                      <p className="text-sm font-black text-gray-800">
                        {itineraryList.length}곳
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {plannerWeather && (
                <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold">
                  🌦 방문일 날씨 반영: {plannerWeather}
                </div>
              )}

              {routeNotice && (
                <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 text-sm font-bold">
                  ⚠️ {routeNotice}
                </div>
              )}

              {showItinerary && itineraryList.length > 0 && (
                <div
                  className={`mb-6 p-5 rounded-3xl border ${isPlannerSaved
                    ? 'bg-emerald-50 border-emerald-100'
                    : 'bg-white border-purple-100 shadow-sm'
                    }`}
                >
                  {isPlannerSaved ? (
                    <>
                      <p className="text-lg font-black text-emerald-700">
                        ✅ 마이페이지에 저장됐어요!
                      </p>
                      <p className="text-sm text-emerald-700 font-bold mt-1">
                        저장한 코스는 마이페이지에서 다시 확인할 수 있어요.
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-lg font-black text-gray-800">
                        마음에 드는 코스인가요?
                      </p>
                      <p className="text-sm text-gray-500 font-bold mt-1">
                        아직 마이페이지에 저장되지 않았어요. 코스를 확인한 뒤 마음에 들면 저장해주세요.
                      </p>

                      <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <button
                          onClick={handleSavePlanner}
                          disabled={isSavingPlanner}
                          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-purple-600 text-white text-sm font-black hover:bg-purple-700 transition-colors disabled:opacity-50"
                        >
                          {isSavingPlanner ? '저장 중...' : '마이페이지에 저장하기'}
                        </button>

                        <button
                          onClick={() => setShowPlannerModal(true)}
                          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gray-100 text-gray-700 text-sm font-black hover:bg-gray-200 transition-colors"
                        >
                          조건 바꿔 다시 만들기
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {isGenerating ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">✨</div>
                  </div>

                  <div className="text-center space-y-2">
                    <p className="text-xl font-black text-gray-800">
                      AI가 축제 하루 코스를 만들고 있습니다
                    </p>
                    <p className="text-sm text-gray-400 font-medium">
                      방문일, 동행 유형, 주변 장소와 날씨를 함께 분석 중입니다...
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {itineraryList.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center text-gray-500">
                      <span className="text-5xl mb-4">🤔</span>
                      <p className="text-lg font-bold">축제 하루 코스를 생성하지 못했습니다.</p>
                      <p className="text-sm text-gray-400 mt-2">
                        조건을 조금 바꿔 다시 시도해주세요.
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pt-4">
                        {itineraryList.map((step, idx) => {
                          const nextStep = itineraryList[idx + 1];
                          const directionUrl = nextStep ? getKakaoDirectionUrl(step, nextStep) : null;
                          const searchUrl = getKakaoSearchUrl(step);

                          return (
                            <div
                              key={idx}
                              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                            >
                              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-600 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                                <span className="text-xs">{getStepIcon(step.type)}</span>
                              </div>

                              <div className="w-[calc(100%-4rem)] md:w-[45%] p-5 rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-purple-200">
                                <div className="flex items-center justify-between space-x-2 mb-2">
                                  <h4 className="font-black text-gray-800">{step.title}</h4>
                                  <time className="font-black text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded-md shrink-0">
                                    {step.time}
                                  </time>
                                </div>

                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                  {step.description}
                                </p>

                                {step.placeName && (
                                  <p className="text-xs text-gray-400 font-bold mt-2">
                                    📍 {step.placeName}
                                  </p>
                                )}

                                {step.address && (
                                  <p className="text-xs text-gray-400 font-bold">
                                    {step.address}
                                  </p>
                                )}

                                {step.distance != null && (
                                  <p className="text-xs text-emerald-600 font-bold mt-2">
                                    📏 축제장 기준 약 {Math.round(Number(step.distance))}m
                                  </p>
                                )}

                                {step.reason && (
                                  <p className="text-xs text-purple-700 font-bold mt-2">
                                    💡 {step.reason}
                                  </p>
                                )}

                                {step.sourceApi && (
                                  <p className="text-[10px] text-gray-400 font-bold mt-1">
                                    출처: {step.sourceApi === 'TOUR_API' ? 'TourAPI 주변정보' : step.sourceApi}
                                  </p>
                                )}

                                <div className="mt-3 p-3 rounded-2xl bg-purple-50 border border-purple-100">
                                  <p className="text-[10px] font-black text-purple-500 mb-1">
                                    AI 동선 포인트
                                  </p>
                                  <p className="text-xs text-purple-800 font-bold leading-relaxed">
                                    {getStepOrderReason(idx, step)}
                                  </p>
                                </div>

                                <div className="mt-4 flex flex-col sm:flex-row gap-2">
                                  {step.kakaoPlaceUrl ? (
                                    <a
                                      href={step.kakaoPlaceUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-black hover:bg-gray-200 transition-colors"
                                    >
                                      지도에서 보기
                                    </a>
                                  ) : (
                                    searchUrl && (
                                      <a
                                        href={searchUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-black hover:bg-gray-200 transition-colors"
                                      >
                                        장소 검색하기
                                      </a>
                                    )
                                  )}

                                  {directionUrl && (
                                    <a
                                      href={directionUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      className="flex-1 inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-yellow-300 text-gray-900 text-xs font-black hover:bg-yellow-400 transition-colors"
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

                      <div className="mt-10 pt-6 border-t border-slate-100 flex justify-center">
                        <button
                          onClick={handleSavePlanner}
                          disabled={isSavingPlanner || isPlannerSaved}
                          className={`w-full sm:w-auto sm:min-w-[220px] px-6 py-3 rounded-xl text-sm font-black transition-colors ${
                            isPlannerSaved
                              ? 'bg-emerald-100 text-emerald-700 cursor-default'
                              : 'bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50'
                          }`}
                        >
                          {isPlannerSaved
                            ? '마이페이지에 저장 완료'
                            : isSavingPlanner
                              ? '저장 중...'
                              : '마이페이지에 저장하기'}
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </section>
          )}

          {!showRecommendations && !isRecommending && (
            <div className="bg-white rounded-[32px] p-20 shadow-xl shadow-purple-900/5 border border-purple-50 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-4xl animate-bounce">
                🤖
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">
                나만을 위한 특별한 축제 하루
              </h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                상단의 <span className="text-purple-600 font-bold">'한 마디 입력창'</span>에 원하는 조건을 적거나
                <br />
                <span className="text-purple-600 font-bold">'추천받기'</span> 버튼을 클릭하여 축제 추천을 시작해 보세요.
              </p>
            </div>
          )}

          {showRecommendations && !selectedFestival && (
            <div className="bg-slate-100/50 rounded-[32px] p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">👆</div>
              <p className="text-slate-400 font-bold">
                위의 추천 목록에서 축제를 선택하면
                <br />
                축제 하루 코스를 만들 수 있습니다.
              </p>
            </div>
          )}
        </main>
      </div>

      {/* 축제 상세 내용 모달 */}
      {showFestivalDetailModal && selectedDetailFestival && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-700/40 backdrop-blur-[2px]"
          onClick={handleCloseFestivalDetail}
        >
          <div
            className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 bg-gray-100 rounded-t-3xl overflow-hidden">
              {selectedDetailFestival.FIRST_IMAGE ? (
                <img
                  src={selectedDetailFestival.FIRST_IMAGE}
                  alt={selectedDetailFestival.TITLE}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                  이미지가 없습니다
                </div>
              )}

              <button
                onClick={handleCloseFestivalDetail}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 text-white font-black hover:bg-black/60 transition-colors"
              >
                ×
              </button>
            </div>

            <div className="p-5 sm:p-8">
              <div className="mb-5">
                <p className="text-xs font-black text-purple-600 mb-2">
                  AI 추천 축제 상세
                </p>

                <h3 className="text-2xl sm:text-3xl font-black text-gray-800 leading-tight">
                  {selectedDetailFestival.TITLE}
                </h3>

                {selectedDetailFestival.ADDR1 && (
                  <p className="mt-3 text-sm text-gray-500 font-bold">
                    📍 {selectedDetailFestival.ADDR1}
                    {selectedDetailFestival.ADDR2 ? ` ${selectedDetailFestival.ADDR2}` : ''}
                  </p>
                )}
              </div>

              {(selectedDetailFestival.EVENT_START_DATE || selectedDetailFestival.EVENT_END_DATE) && (
                <div className="mb-5 p-4 rounded-2xl bg-purple-50 border border-purple-100">
                  <p className="text-xs font-black text-purple-600 mb-1">
                    축제 기간
                  </p>
                  <p className="text-sm font-bold text-purple-800">
                    {(selectedDetailFestival.EVENT_START_DATE || '시작일 미정').replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}
                    {' ~ '}
                    {(selectedDetailFestival.EVENT_END_DATE || '종료일 미정').replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3')}
                  </p>
                </div>
              )}

              {selectedDetailFestival.recommendation_reason && (
                <div className="mb-5 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                  <p className="text-xs font-black text-amber-600 mb-1">
                    ✨ AI의 추천 사유
                  </p>
                  <p className="text-sm font-bold text-amber-800 leading-relaxed">
                    {selectedDetailFestival.recommendation_reason}
                  </p>
                </div>
              )}

              <div className="mb-6">
                <p className="text-sm font-black text-gray-800 mb-2">
                  축제 소개
                </p>

                <p className="text-sm text-gray-600 font-medium leading-7 whitespace-pre-line">
                  {selectedDetailFestival.OVERVIEW || '상세 설명이 없습니다.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {selectedDetailFestival.TEL && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-black text-gray-400 mb-1">전화번호</p>
                    <p className="text-sm font-bold text-gray-700">
                      {selectedDetailFestival.TEL}
                    </p>
                  </div>
                )}

                {selectedDetailFestival.HOMEPAGE && (
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-xs font-black text-gray-400 mb-1">홈페이지</p>
                    <p
                      className="text-sm font-bold text-purple-600 line-clamp-2"
                      dangerouslySetInnerHTML={{ __html: selectedDetailFestival.HOMEPAGE }}
                    />
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleCloseFestivalDetail}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                >
                  닫기
                </button>

                <button
                  onClick={() => {
                    const targetFestival = selectedDetailFestival;
                    handleCloseFestivalDetail();
                    handleSelectFestival(targetFestival);
                  }}
                  className="w-full sm:flex-1 px-6 py-3 rounded-xl bg-purple-600 text-white font-black hover:bg-purple-700 transition-colors"
                >
                  이 축제로 하루 코스 만들기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <PlannerSetupModal
        showPlannerModal={showPlannerModal}
        selectedFestival={selectedFestival}
        plannerForm={plannerForm}
        handlePlannerFormChange={handlePlannerFormChange}
        handlePlannerPeopleCountBlur={handlePlannerPeopleCountBlur}
        handleCreatePlanner={handleCreatePlanner}
        setShowPlannerModal={setShowPlannerModal}
        isGenerating={isGenerating}
        getFestivalDateRange={getFestivalDateRange}
      />
    </div>
  );
};

export default AIPlannerPage;
