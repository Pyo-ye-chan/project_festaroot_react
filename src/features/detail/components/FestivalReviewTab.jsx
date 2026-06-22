import React, { useState, useEffect } from 'react';
import { Camera, Star, Edit, Flag, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'; // Added ChevronLeft, ChevronRight
import ReviewModal from './ReviewModal';
import ReportModal from './ReportModal';

import {
  getReviews,
  addReview,
  updateReview,
  deleteReview,
  reportReview,
} from '../../../api/FestivalApi';

import useAuthStore from '../../../store/useAuthStore';
import LoginMessage from '../../../components/LoginMessage';

const FestivalReviewTab = ({ festival, sortType, setSortType }) => {
  const { user } = useAuthStore();
  const currentMemberId = user?.member_id || user?.id;

  const [reviews, setReviews] = useState([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reviewToReportId, setReviewToReportId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 회원만 리뷰 작성 가능

  const reviewsPerPage = 3;

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleWriteReview = () => {

    // 비회원
    if (!currentMemberId) {
      setIsLoginModalOpen(true);
      return;
    }

    // 회원
    handleOpenReviewModal();
  };

  const handleOpenReviewModal = (review = null) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  const loadReviews = async () => {
    try {
      const resp = await getReviews(festival.content_id, sortType);

      console.log('후기 조회 응답:', resp.data);



      setReviews(resp.data.list || []);
      setCurrentPage(1);




    } catch (err) {
      console.error('후기 목록 조회 실패:', err);
    }
  };

  const averageRating = // 리뷰 평균
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;


  useEffect(() => {
    if (!festival?.content_id) return;

    loadReviews();
  }, [festival?.content_id, sortType]);

  const handleReviewSubmit = async (reviewData) => {
    try {
      if (reviewData.review_id) {
        await updateReview(
          reviewData.review_id,
          {
            content_id: reviewData.content_id,
            rating: reviewData.rating,
            content: reviewData.content,
            visit_date: reviewData.visit_date,
          },
          reviewData.new_images,
          reviewData.existing_image_urls_to_keep
        );

        alert('후기가 수정되었습니다.');
      } else {
        await addReview(
          {
            content_id: reviewData.content_id,
            rating: reviewData.rating,
            content: reviewData.content,
            visit_date: reviewData.visit_date,
          },
          reviewData.new_images
        );

        alert('후기가 등록되었습니다.');
      }

      await loadReviews();
    } catch (err) {
      console.error('후기 저장 실패:', err);
      alert('후기 저장 중 오류가 발생했습니다.');
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('후기를 삭제하시겠습니까?')) return;

    try {
      await deleteReview(reviewId);
      alert('후기가 삭제되었습니다.');
      await loadReviews();
    } catch (err) {
      console.error('후기 삭제 실패:', err);
      alert('후기 삭제 중 오류가 발생했습니다.');
    }
  };

  const handleReportSubmit = async (reportData) => {
    try {
      await reportReview(reportData.review_id, reportData.reason);

      alert('신고가 접수되었습니다.');
    } catch (err) {
      console.error('신고 실패:', err);

      const message =
        err.response?.data?.message || '신고 처리 중 오류가 발생했습니다.';

      alert(message);
    }
  };

  const handleOpenReportModal = (reviewId) => {
    setReviewToReportId(reviewId);
    setIsReportModalOpen(true);
  };

  const handleCloseReportModal = () => {
    setIsReportModalOpen(false);
    setReviewToReportId(null);
  };


  return (
    <div className="py-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="text-2xl font-extrabold text-gray-900 flex items-center gap-2">
            방문자 후기
            <span className="text-purple-600">
              {reviews.length || 0}
            </span>
          </h3>

          <div className="flex items-center gap-1 mt-2">
            <Star size={20} fill="#FACC15" className="text-yellow-400" />
            <span className="text-xl font-bold text-gray-800">
              {averageRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-500 font-bold ml-1">/ 5.0</span>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-full shadow-inner">
          {['최신순', '별점순'].map((type) => (
            <button
              key={type}
              onClick={() => setSortType(type)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${sortType === type
                ? 'bg-white text-purple-700 shadow-md'
                : 'text-gray-600 hover:text-purple-600 hover:bg-gray-50'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {reviews.length === 0 ? (
        <p className="text-gray-500 font-medium text-center py-10">아직 등록된 후기가 없습니다. 첫 후기를 작성해보세요!</p>
      ) : (
        <>
          <div className="space-y-6">
            {currentReviews.map((review) => {
              const isMyReview =
                Boolean(currentMemberId) &&
                String(review.member_id) === String(currentMemberId);

              return (
                <div key={review.review_id} className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-semibold text-lg text-gray-800">
                        {review.nickname}
                      </div>

                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={18}
                            fill={review.rating > i ? '#FACC15' : 'none'}
                            className={review.rating > i ? 'text-yellow-400' : 'text-gray-300'}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3">
                      {isMyReview && (
                        <>
                          <button
                            onClick={() => handleOpenReviewModal(review)}
                            className="flex items-center text-sm text-gray-600 hover:text-purple-700 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
                          >
                            <Edit size={16} className="mr-1" />
                            수정
                          </button>

                          <button
                            onClick={() => handleDeleteReview(review.review_id)}
                            className="flex items-center text-sm text-gray-600 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={16} className="mr-1" />
                            삭제
                          </button>
                        </>
                      )}

                      {!isMyReview && currentMemberId && (
                        <button
                          onClick={() => handleOpenReportModal(review.review_id)}
                          className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                        >
                          <Flag size={16} className="mr-1" />
                          신고
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-700 text-base mb-3 leading-relaxed">
                    {review.content}
                  </p>

                  {review.images && review.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {review.images.map((image) => (
                        <img
                          key={image.image_id}
                          src={image.image_url}
                          alt="Review image"
                          className="w-28 h-28 object-cover rounded-md shadow-sm"
                        />
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-gray-500 mt-2">
                    <span className="mr-2">방문일: {review.visit_date}</span>
                    <span>작성일: {new Date(review.created_at).toLocaleDateString()}</span>
                  </p>
                </div>
              );
            })}
          </div>


          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 space-x-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => paginate(page)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${currentPage === page
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </>
      )}

      <button
        className="w-full mt-10 h-16 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 font-bold hover:bg-purple-50 hover:border-purple-400 hover:text-purple-700 transition-all duration-200 flex items-center justify-center gap-2 text-lg"
        onClick={() => handleWriteReview()}
      >
        <Camera size={22} />
        생생한 후기 작성하기
      </button>


      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={handleCloseReviewModal}
        onSubmit={handleReviewSubmit}
        initialReview={editingReview}
        festivalId={festival.content_id}
        memberId={currentMemberId}
      />

      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseReportModal}
        onSubmit={handleReportSubmit}
        reviewId={reviewToReportId}
        memberId={currentMemberId}
      />

      <LoginMessage
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default FestivalReviewTab;
