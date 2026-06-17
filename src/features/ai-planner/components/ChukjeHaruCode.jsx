import React from 'react';

const ChukjeHaruCode = ({
  isGenerating,
  showItinerary,
  selectedFestival,
  itineraryList,
  plannerWeather,
  routeNotice,
  isPlannerSaved,
  plannerForm,
  handleSavePlanner,
  setShowPlannerModal,
  getCourseTitle,
  getCourseBadges,
  getCompanionLabel,
  getCourseStyleLabel,
  getFestivalDateRange,
  getStepIcon,
  getStepOrderReason,
  getKakaoSearchUrl,
  getKakaoDirectionUrl,
}) => {
  return (
    <section className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 animate-in fade-in slide-in-from-top-8 duration-700">
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
          )}
        </>
      )}
    </section>
  );
};

export default ChukjeHaruCode;