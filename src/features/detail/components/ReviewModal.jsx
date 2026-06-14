import React, { useState, useEffect } from 'react';
import { X, Star, Camera } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, onSubmit, initialReview, festivalId, memberId }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [visitDate, setVisitDate] = useState(''); // New state for visit date
  const [images, setImages] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating || 0);
      setContent(initialReview.content || '');
      setVisitDate(initialReview.visit_date || ''); // Initialize visitDate
      setExistingImageUrls(
        initialReview.images
          ? initialReview.images.map((image) => image.image_url)
          : []
      );
      setImages([]);
    } else {
      setRating(0);
      setContent('');
      setVisitDate(''); // Clear visitDate for new review
      setImages([]);
      setExistingImageUrls([]);
    }
  }, [initialReview, isOpen]);

  if (!isOpen) return null;

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + existingImageUrls.length + files.length > 5) {
      alert('최대 5장까지 업로드 가능합니다.');
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('별점을 입력해주세요.');
      return;
    }
    if (!visitDate) {
      alert('방문일자를 입력해주세요.');
      return;
    }

    const reviewData = {
      content_id: festivalId,
      member_id: memberId,
      rating,
      content,
      visit_date: visitDate, // Include visit date in submitted data
      new_images: images,
      existing_image_urls_to_keep: existingImageUrls,
      ...(initialReview && { review_id: initialReview.review_id }),
    };

    onSubmit(reviewData);
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
      <div className="relative w-full max-w-xl bg-white rounded-[2rem] shadow-2xl overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-black text-gray-900">
              {initialReview ? '후기 수정하기' : '생생한 후기 작성하기'}
            </h2>
            <p className="text-sm font-medium text-gray-400 mt-1">
              {initialReview ? '축제 방문 후기를 수정해주세요.' : '축제 방문 후기를 남겨주세요.'}
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
        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {/* 별점 */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={38}
                onClick={() => setRating(star)}
                className={`cursor-pointer transition ${rating >= star
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
                  }`}
              />
            ))}


          </div>

          {/* 방문일자 */}
          <div className="mb-6">
            <label htmlFor="visit-date" className="block text-sm font-bold text-gray-800 mb-2">방문일자</label>
            <input
              type="date"
              id="visit-date"
              className="w-full p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-base font-medium text-gray-700"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
            />
          </div>

          {/* 후기 내용 */}
          <textarea
            className="w-full h-36 p-4 border border-gray-200 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 text-base font-medium text-gray-700 placeholder:text-gray-400"
            placeholder="생생한 후기를 남겨주세요! (선택사항)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          {/* 사진 첨부 */}
          <div className="mt-6">
            <h3 className="text-sm font-bold text-gray-800 mb-3">
              사진 첨부 <span className="text-gray-400 font-medium">(최대 5장)</span>
            </h3>

            <div className="flex flex-wrap gap-3">
              {existingImageUrls.map((url, index) => (
                <div
                  key={`existing-${index}`}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100"
                >
                  <img
                    src={url}
                    alt={`기존 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setExistingImageUrls((prev) => prev.filter((item) => item !== url))
                    }
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {images.map((image, index) => (
                <div
                  key={`new-${index}`}
                  className="relative w-24 h-24 rounded-2xl overflow-hidden border border-gray-100"
                >
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`새 이미지 ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setImages((prev) => prev.filter((_, i) => i !== index))
                    }
                    className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}

              {images.length + existingImageUrls.length < 5 && (
                <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition">
                  <Camera size={26} />
                  <span className="text-xs font-bold mt-1">사진 추가</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </label>
              )}
            </div>
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
            {initialReview ? '수정 완료' : '등록하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;