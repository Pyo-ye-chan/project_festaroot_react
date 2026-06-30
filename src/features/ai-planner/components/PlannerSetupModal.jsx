import React from 'react';

const PlannerSetupModal = ({
  showPlannerModal,
  selectedFestival,
  plannerForm,
  handlePlannerFormChange,
  handleCreatePlanner,
  setShowPlannerModal,
  isGenerating,
  getFestivalDateRange,
}) => {
  if (!showPlannerModal || !selectedFestival) {
    return null;
  }

  const { start, end, startLabel, endLabel } = getFestivalDateRange(selectedFestival);
  const today = new Date();
  const todayLabel = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
    today.getDate()
  ).padStart(2, '0')}`;
  const minVisitDate = start && start > todayLabel ? start : todayLabel;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-gray-700/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto scrollbar-hide p-5 sm:p-8 relative">
        <h3 className="text-2xl font-black text-gray-800 mb-2">
          축제 하루 코스 만들기
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          <span className="font-bold text-purple-600">[{selectedFestival.TITLE}]</span>을 중심으로
          방문 일정과 주변 장소를 묶어 하루 코스를 만들어드릴게요.
        </p>

        <div className="space-y-4">
          <div>
            <label htmlFor="visitDate" className="block text-sm font-bold text-gray-700 mb-1">
              언제 축제를 즐길까요?
            </label>

            <div className="mb-2 p-3 rounded-2xl bg-purple-50 border border-purple-100">
              <p className="text-[11px] font-black text-purple-600 mb-1">
                선택 가능한 축제 기간
              </p>
              <p className="text-sm font-bold text-purple-800">
                {startLabel} ~ {endLabel}
              </p>
              <p className="text-[11px] text-purple-500 font-bold mt-1">
                축제 기간 안에서만 하루 코스를 만들 수 있어요.
              </p>
            </div>

            <input
              type="date"
              id="visitDate"
              name="visitDate"
              value={plannerForm.visitDate}
              min={minVisitDate}
              max={end || undefined}
              onChange={handlePlannerFormChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            {plannerForm.visitDate && (
              <p className="mt-2 text-xs font-bold text-gray-500">
                선택한 방문일: <span className="text-purple-600">{plannerForm.visitDate}</span>
              </p>
            )}
          </div>

          <div>
            <label htmlFor="peopleCount" className="block text-sm font-bold text-gray-700 mb-1">
              몇 명이 함께 가나요?
            </label>
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

          <div>
            <label htmlFor="companionType" className="block text-sm font-bold text-gray-700 mb-1">
              누구와 함께 가나요?
            </label>
            <select
              id="companionType"
              name="companionType"
              value={plannerForm.companionType}
              onChange={handlePlannerFormChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="ALONE">혼자</option>
              <option value="FRIEND">친구와</option>
              <option value="COUPLE">연인과</option>
              <option value="FAMILY">가족과</option>
              <option value="CHILD">아이와 함께</option>
              <option value="PARENT">부모님과</option>
              <option value="PET">반려동물과</option>
            </select>
          </div>

          <div>
            <label htmlFor="courseStyle" className="block text-sm font-bold text-gray-700 mb-1">
              오늘 코스의 분위기를 골라주세요
            </label>
            <select
              id="courseStyle"
              name="courseStyle"
              value={plannerForm.courseStyle}
              onChange={handlePlannerFormChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
            >
              <option value="RELAXED">느긋하게 쉬엄쉬엄</option>
              <option value="FOOD">맛집은 꼭 챙기기</option>
              <option value="TOUR">주변 명소까지 알차게</option>
              <option value="CULTURE">전시·문화 감성으로</option>
              <option value="INDOOR">날씨 걱정 없는 실내 위주</option>
              <option value="PHOTO">사진 남기기 좋은 곳 위주</option>
              <option value="FAMILY">가족이 편한 동선으로</option>
            </select>
          </div>

          <div>
            <label htmlFor="extraRequest" className="block text-sm font-bold text-gray-700 mb-1">
              꼭 반영하고 싶은 요청이 있나요?
            </label>
            <textarea
              id="extraRequest"
              name="extraRequest"
              value={plannerForm.extraRequest}
              onChange={handlePlannerFormChange}
              rows="3"
              placeholder="예: 너무 빡빡하지 않게, 실내 위주로, 맛집을 꼭 포함해주세요."
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
            {isGenerating ? '코스 만드는 중...' : '축제 하루 코스 만들기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlannerSetupModal;
