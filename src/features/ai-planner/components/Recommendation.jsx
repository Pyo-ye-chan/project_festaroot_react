import React from 'react';

const Recommendation = ({
  isRecommending,
  showRecommendations,
  userInput,
  recommendList,
  selectedFestival,
  feedbackMap,
  showDislikeReason,
  handleRecommend,
  handleOpenFestivalDetail,
  handleSelectFestival,
  handleFeedback,
  setShowDislikeReason,
}) => {
  return (
    <section className="bg-white rounded-[32px] p-8 shadow-xl shadow-purple-900/5 border border-purple-50 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-800">
            STEP 1. 추천 축제 목록
          </h3>
          <p className="text-sm text-gray-500 font-medium mt-1">
            AI가 선별한 취향 저격 축제들입니다.
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

                      <div className="relative">
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
  );
};

export default Recommendation;