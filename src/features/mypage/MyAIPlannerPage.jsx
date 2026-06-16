import React, { useState, useEffect } from 'react';
import { getMyAIPlanners, getAIPlannerDetail, deleteAIPlanner } from '../../api/aiApi';
import useAuthStore from '../../store/useAuthStore';
import { getMemberProfile } from '../../api/memberApi';

const MyAIPlannerPage = () => {
  const { user, isLoggedIn } = useAuthStore();
  const [myPlanners, setMyPlanners] = useState([]);
  const [selectedPlanner, setSelectedPlanner] = useState(null);
  const [itineraryList, setItineraryList] = useState([]);
  const [plannerWeather, setPlannerWeather] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 일정 단계 타입에 따른 아이콘 반환 함수 (AIPlannerPage와 동일)
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

  // 내 AI 플래너 목록 불러오기
  const fetchMyPlanners = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!isLoggedIn || !user?.member_id) {
        throw new Error('로그인 정보가 없습니다.');
      }
      const response = await getMyAIPlanners();
      setMyPlanners(response.data || []);
    } catch (err) {
      console.error('내 플래너 목록 로드 실패:', err);
      setError('내 플래너 목록을 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPlanners();
  }, [isLoggedIn, user?.member_id]);

  // 플래너 상세 정보 불러오기
  const fetchPlannerDetail = async (plannerId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAIPlannerDetail(plannerId);
      const data = response.data;
      if (data) {
        setSelectedPlanner(data);
        setItineraryList(data.steps || []);
        setPlannerWeather(data.weather || null);
      } else {
        throw new Error('플래너 상세 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('플래너 상세 로드 실패:', err);
      setError('플래너 상세 정보를 불러오는 데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 플래너 삭제
  const handleDeletePlanner = async (plannerId) => {
    if (window.confirm('정말 이 플래너를 삭제하시겠습니까?')) {
      try {
        await deleteAIPlanner(plannerId);
        alert('플래너가 성공적으로 삭제되었습니다.');
        setSelectedPlanner(null); // 삭제 후 상세 보기 닫기
        setItineraryList([]);
        setPlannerWeather(null);
        fetchMyPlanners(); // 목록 새로고침
      } catch (err) {
        console.error('플래너 삭제 실패:', err);
        alert('플래너 삭제에 실패했습니다.');
      }
    }
  };

  // 카카오 지도 렌더링 Effect (AIPlannerPage와 동일)
  useEffect(() => {
    if (selectedPlanner && itineraryList.length > 0) {
      if (!window.kakao || !window.kakao.maps) {
        console.warn("Kakao Maps API not loaded.");
        return;
      }

      const markerSteps = itineraryList.filter(step => step.x && step.y);
      if (markerSteps.length === 0) {
        console.warn("No valid coordinates in itineraryList for map markers.");
        return;
      }

      const container = document.getElementById('mypagePlannerMap');
      if (!container) {
        console.warn("Map container element not found.");
        return;
      }

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
        const polyline = new window.kakao.Polyline({
          path: linePath,
          strokeWeight: 4,
          strokeColor: '#AD5FEE', // 보라색 계열
          strokeOpacity: 0.8,
          strokeStyle: 'solid'
        });

        polyline.setMap(map);
      }

      map.setBounds(bounds);
    }
  }, [selectedPlanner, itineraryList]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-bold text-gray-700">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 py-8">
      <h2 className="text-3xl font-black text-gray-800 mb-8">내 AI 플래너</h2>

      {myPlanners.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center text-gray-500">
          <span className="text-5xl mb-4">😢</span>
          <p className="text-lg font-bold">아직 저장된 AI 플래너가 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">AI 플래너 페이지에서 나만의 여행 일정을 만들어보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myPlanners.map((planner) => (
            <div key={planner.plannerId} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
              <img 
                src={planner.festival?.firstImage || '/assets/no-image.png'} 
                alt={planner.festival?.title || 'No Image'} 
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex-grow flex flex-col">
                <h3 className="text-xl font-black text-gray-800 mb-2">{planner.festival?.title || planner.title || '제목 없음'}</h3>
                <p className="text-sm text-gray-600 mb-1">📅 방문일: {planner.visitDate}</p>
                <p className="text-sm text-gray-600 mb-1">📍 출발지: {planner.startLocation}</p>
                <p className="text-sm text-gray-600 mb-3">🧑‍🤝‍👩 {planner.peopleCount}명 · {planner.companionType} · {planner.transportType}</p>
                
                {planner.weatherSummary && (
                  <p className="text-xs text-blue-700 font-bold mb-4">🌦 {planner.weatherSummary}</p>
                )}

                <div className="mt-auto flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => fetchPlannerDetail(planner.plannerId)}
                    className="flex-1 px-4 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors text-sm"
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => handleDeletePlanner(planner.plannerId)}
                    className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors text-sm"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 플래너 상세 모달 */}
      {selectedPlanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-75 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative my-8">
            <button
              onClick={() => {
                setSelectedPlanner(null);
                setItineraryList([]);
                setPlannerWeather(null);
              }}
              className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 text-3xl font-bold"
            >
              &times;
            </button>
            <h3 className="text-2xl font-black text-gray-800 mb-2">{selectedPlanner.festival?.title || selectedPlanner.title || '제목 없음'}</h3>
            <p className="text-sm text-gray-500 mb-6">
              📅 방문일: {selectedPlanner.visitDate} | 📍 출발지: {selectedPlanner.startLocation} | 🧑‍🤝‍👩 {selectedPlanner.peopleCount}명
            </p>

            {selectedPlanner.weather?.summary && (
              <div className="mb-6 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-700 text-sm font-bold">
                🌦 방문일 날씨 반영: {selectedPlanner.weather.summary}
              </div>
            )}
            
            {itineraryList.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center text-gray-500">
                <span className="text-5xl mb-4">🤔</span>
                <p className="text-lg font-bold">일정 정보가 없습니다.</p>
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
                <div id="mypagePlannerMap" className="w-full h-[360px] rounded-[28px] border border-gray-100 mt-8 overflow-hidden" />
              </>
            )}

            <div className="mt-8 text-right">
              <button
                onClick={() => {
                  setSelectedPlanner(null);
                  setItineraryList([]);
                  setPlannerWeather(null);
                }}
                className="px-6 py-3 rounded-xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 transition-colors"
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

export default MyAIPlannerPage;
