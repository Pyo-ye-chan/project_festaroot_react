import axios from 'axios';
import React, { useState } from 'react';
import { maxios } from '../../../api/axiosApi';

const AIPlannerPage = () => {
  const [isRecommending, setIsRecommending] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFestival, setSelectedFestival] = useState(null);
  const [showItinerary, setShowItinerary] = useState(false);
  const [recommendList, setRecommendList] = useState([]); // 서버 추천 데이터 저장

  // Mock data for user context (실제 연동 시 useMemberStore 등에서 가져오도록 확장 가능)
  const userContext = {
    profile: { age: '20대', gender: '남성' },
    interests: { regions: ['서울', '강원'], themes: ['전통문화', 'K-POP', '먹거리'] },
  };

  const handleRecommend = async () => {
    setIsRecommending(true);
    setShowRecommendations(false);
    setSelectedFestival(null);
    setShowItinerary(false);
    
    try {
      const resp = await maxios.get('/ai/recommendations');
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
    setIsGenerating(true);
    setShowItinerary(false);
    
    // Simulate AI itinerary generation (추후 실제 일정 생성 API 연동 가능)
    setTimeout(() => {
      setIsGenerating(false);
      setShowItinerary(true);
    }, 2000);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 font-sans">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white py-16 px-4">
        <div className="max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-bold animate-pulse">
            <span>✨</span> AI RAG 기반 맞춤형 여행 설계
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            당신만을 위한<br/>가장 완벽한 축제 여행
          </h1>
          {!showRecommendations && !isRecommending && (
            <div className="pt-8">
              <button 
                onClick={handleRecommend}
                className="bg-white text-purple-600 px-8 py-4 rounded-2xl font-black text-lg shadow-xl hover:scale-105 transition-transform active:scale-95"
              >
                나를 위한 축제 추천받기 🚀
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 -mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: User Context Analysis */}
        <aside className="lg:col-span-1 space-y-6">
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
                <p className="text-xs font-black text-purple-600 uppercase tracking-wider mb-3">관심사 키워드</p>
                <div className="flex flex-wrap gap-2">
                  {[...userContext.interests.regions, ...userContext.interests.themes].map((tag) => (
                    <span key={tag} className="px-3 py-1.5 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-gray-50">
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  사용자의 최근 활동 로그 및 프로필을 기반으로 실시간 벡터 검색(RAG)을 수행합니다.
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
                  <div className="text-center">
                    <p className="text-lg font-black text-gray-800">사용자 취향 분석 중...</p>
                    <p className="text-sm text-gray-400">전국 축제 데이터에서 최적의 장소를 찾고 있습니다.</p>
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
                          <h4 className="text-xl font-black text-gray-800 group-hover:text-purple-600 transition-colors">{item.TITLE}</h4>
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
                <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pt-4">
                  {[
                    { time: '10:00 AM', title: `${selectedFestival?.TITLE.split(' ')[0]} 도착`, desc: '주차 및 대중교통 이용 안내', icon: '📍' },
                    { time: '12:00 PM', title: '현지 맛집 점심 식사', desc: '테마 취향을 반영한 인기 음식점', icon: '🍽️' },
                    { time: '02:00 PM', title: `${selectedFestival?.TITLE} 체험`, desc: '주요 프로그램 및 포토존 가이드', icon: '📸' },
                    { time: '05:00 PM', title: '주변 감성 카페 마무리', desc: '분위기 좋은 카페에서 일정 마무리', icon: '☕' }
                  ].map((step, idx) => (
                    <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-purple-600 text-white shadow-lg shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-bold">
                        <span className="text-xs">{step.icon}</span>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[45%] p-5 rounded-3xl border border-slate-100 bg-white shadow-sm transition-all hover:shadow-xl hover:border-purple-200">
                        <div className="flex items-center justify-between space-x-2 mb-2">
                          <div className="font-black text-gray-800">{step.title}</div>
                          <time className="font-black text-[10px] text-purple-600 bg-purple-50 px-2 py-1 rounded-md">{step.time}</time>
                        </div>
                        <div className="text-sm text-gray-500 font-medium leading-relaxed">{step.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {!showRecommendations && !isRecommending && (
            <div className="bg-white rounded-[32px] p-20 shadow-xl shadow-purple-900/5 border border-purple-50 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center mb-8 text-4xl animate-bounce">
                🤖
              </div>
              <h3 className="text-2xl font-black text-gray-800 mb-4">나만을 위한 특별한 여행 준비</h3>
              <p className="text-gray-500 font-medium leading-relaxed">
                상단의 <span className="text-purple-600 font-bold">'축제 추천받기'</span> 버튼을 클릭하여<br/>
                AI 분석 시스템을 시작해 보세요.
              </p>
            </div>
          )}

          {showRecommendations && !selectedFestival && (
            <div className="bg-slate-100/50 rounded-[32px] p-12 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <div className="text-4xl mb-4">👆</div>
              <p className="text-slate-400 font-bold">위의 추천 목록에서 축제를 선택하면<br/>상세 여행 계획이 이곳에 생성됩니다.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AIPlannerPage;
