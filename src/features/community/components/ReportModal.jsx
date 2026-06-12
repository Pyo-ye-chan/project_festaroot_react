import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, onSubmit, targetType, targetId }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reportReasons = [
    { id: 'inappropriate', label: '부적절한 내용' },
    { id: 'ad_spam', label: '광고/홍보' },
    { id: 'abuse_slander', label: '욕설/비방' },
    { id: 'privacy_violation', label: '개인정보 침해' },
    { id: 'false_information', label: '허위 사실' },
    { id: 'etc', label: '기타' },
  ];

  useEffect(() => {
    // Reset state when modal opens/closes
    if (isOpen) {
      setSelectedReason('');
      setCustomReason('');
    }
  }, [isOpen]);

  const handleSubmit = () => {
    if (!selectedReason) {
      alert('신고 사유를 선택해 주세요.');
      return;
    }
    if (selectedReason === 'etc' && !customReason.trim()) {
      alert('기타 사유를 입력해 주세요.');
      return;
    }

    onSubmit({
      targetType,
      targetId,
      reason: selectedReason,
      customReason: selectedReason === 'etc' ? customReason.trim() : undefined,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-lg border border-gray-100 max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-black text-gray-900 mb-6 text-center">신고하기</h2>

        <div className="space-y-4 mb-6">
          {reportReasons.map((reason) => (
            <label key={reason.id} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="reportReason"
                value={reason.id}
                checked={selectedReason === reason.id}
                onChange={() => setSelectedReason(reason.id)}
                className="form-radio h-5 w-5 text-[var(--festival-purple)] transition-colors focus:ring-[var(--festival-purple)]"
              />
              <span className="text-base font-medium text-gray-700">{reason.label}</span>
            </label>
          ))}

          {selectedReason === 'etc' && (
            <textarea
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              placeholder="자세한 사유를 입력해 주세요."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-[var(--festival-purple)]/20 outline-none resize-none min-h-[100px] mt-4"
            />
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-4 bg-gray-100 text-gray-700 font-black rounded-2xl hover:bg-gray-200 transition-all active:scale-95 shadow-sm"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-4 bg-red-500 text-white font-black rounded-2xl hover:bg-red-600 transition-all active:scale-95 shadow-lg shadow-red-200"
          >
            신고하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
