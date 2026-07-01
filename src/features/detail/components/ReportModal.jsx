import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const REPORT_REASONS = [
    { id: 'inappropriate', label: '부적절한 내용' },
    { id: 'ad_spam', label: '광고/홍보' },
    { id: 'abuse_slander', label: '욕설/비방' },
    { id: 'privacy_violation', label: '개인정보 침해' },
    { id: 'false_information', label: '허위 사실' },
    { id: 'etc', label: '기타' },
];



const ReportModal = ({ isOpen, onClose, onSubmit, reviewId, memberId }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedReason('');
      setCustomReason('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleReasonChange = (reason) => {
    setSelectedReason(reason);
    setCustomReason('');
  };

  const handleSubmit = () => {
    const reason = selectedReason === '기타' ? customReason.trim() : selectedReason;

    if (!reason) {
      alert('신고 사유를 선택하거나 입력해주세요.');
      return;
    }

    if (selectedReason === '기타' && reason.length < 10) {
      alert('기타 사유는 최소 10자 이상 입력해주세요.');
      return;
    }

    onSubmit({
      review_id: reviewId,
      member_id: memberId,
      reason,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              리뷰 신고하기
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-1">
              해당 리뷰를 신고하는 사유를 선택해주세요.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="px-6 py-6">
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50">
            <div className="space-y-2">
              {[...REPORT_REASONS, '기타'].map((reason) => (
                <label
                  key={reason.id}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition ${
                    selectedReason === reason.id
                      ? 'bg-purple-50 border border-purple-300'
                      : 'bg-white border border-gray-100 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="reportReason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={() => handleReasonChange(reason.id)}
                    className="w-4 h-4 accent-purple-600"
                  />

                  <span
                    className={`text-sm font-bold ${
                      selectedReason === reason.label
                        ? 'text-purple-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>

            {selectedReason === '기타' && (
              <textarea
                className="w-full h-28 mt-4 p-4 border border-gray-200 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-sm font-medium text-gray-700 placeholder:text-gray-400 bg-white"
                placeholder="기타 사유를 입력해주세요. (최소 10자)"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
              />
            )}
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 rounded-xl border border-gray-200 bg-white text-gray-600 font-bold hover:bg-gray-100 transition"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            className="px-6 py-3 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-lg shadow-purple-200 transition"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;