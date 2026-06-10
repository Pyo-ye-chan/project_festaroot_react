import React, { useState } from 'react';
import { Camera, Star, Edit, Flag, ChevronLeft, ChevronRight } from 'lucide-react'; // Added ChevronLeft, ChevronRight
import ReviewModal from './ReviewModal';
import ReportModal from './ReportModal';

const FestivalReviewTab = ({ festival, sortType, setSortType }) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reviewToReportId, setReviewToReportId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const reviewsPerPage = 3; // Reviews per page

  // Mock current user ID - replace with actual auth context later
  const currentMemberId = 'user123'; 

  // Dummy review data
  const [reviews, setReviews] = useState([
    {
      review_id: 1,
      member_id: 'user123',
      member_nickname: '테스트유저1',
      rating: 4.5,
      content: '너무 즐거웠어요! 내년에 또 방문하고 싶습니다. 이 축제는 정말 특별한 경험을 선사해주었습니다. 음식도 맛있고, 분위기도 최고였어요. 가족들과 함께 오기에도 너무 좋은 곳입니다.',
      image_urls: ['https://picsum.photos/id/237/200/300', 'https://picsum.photos/id/238/200/300'],
      visit_date: '2023-10-20',
      created_at: '2023-10-25T10:00:00Z',
    },
    {
      review_id: 2,
      member_id: 'user456',
      member_nickname: '페스타사랑',
      rating: 5.0,
      content: '인생 축제였어요! 강력 추천합니다! 모든 프로그램이 알차고 즐거웠습니다. 특히 야간 공연은 정말 잊을 수 없는 추억을 만들어주었네요. 다음에도 꼭 참여하고 싶습니다.',
      image_urls: [],
      visit_date: '2023-11-01',
      created_at: '2023-11-05T14:30:00Z',
    },
    {
      review_id: 3,
      member_id: 'user123',
      member_nickname: '테스트유저1',
      rating: 3.0,
      content: '기대보다는 아쉬웠지만, 새로운 경험이었어요. 좀 더 다양한 볼거리가 있었으면 좋겠어요. 하지만 전반적으로 나쁘지 않았습니다. 주차 공간이 조금 부족했던 점은 아쉬웠습니다.',
      image_urls: ['https://picsum.photos/id/239/200/300'],
      visit_date: '2023-10-22',
      created_at: '2023-10-28T09:15:00Z',
    },
    {
      review_id: 4,
      member_id: 'user789',
      member_nickname: '축제매니아',
      rating: 4.0,
      content: '친구들과 즐거운 시간을 보냈습니다. 날씨도 좋고 모든 것이 완벽했어요. 다음 시즌 축제가 벌써부터 기대됩니다.',
      image_urls: ['https://picsum.photos/id/240/200/300'],
      visit_date: '2024-01-15',
      created_at: '2024-01-20T11:00:00Z',
    },
    {
      review_id: 5,
      member_id: 'user101',
      member_nickname: '여행자',
      rating: 3.5,
      content: '음식이 맛있었어요. 하지만 좀 혼잡해서 아쉬웠습니다. 개선되면 더 좋을 것 같아요.',
      image_urls: [],
      visit_date: '2024-02-10',
      created_at: '2024-02-15T16:00:00Z',
    },
    {
      review_id: 6,
      member_id: 'user123',
      member_nickname: '테스트유저1',
      rating: 5.0,
      content: '최고의 축제! 매년 찾아오고 있어요. 항상 기대 이상입니다.',
      image_urls: ['https://picsum.photos/id/241/200/300', 'https://picsum.photos/id/242/200/300', 'https://picsum.photos/id/243/200/300'],
      visit_date: '2024-03-01',
      created_at: '2024-03-05T09:00:00Z',
    },
  ]);

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleOpenReviewModal = (review = null) => {
    setEditingReview(review);
    setIsReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalOpen(false);
    setEditingReview(null);
  };

  const handleReviewSubmit = (reviewData) => {
    console.log('Review submitted:', reviewData);
    // In a real application, you would send this to your API
    // For now, let's just update the local state for demonstration
    if (reviewData.review_id) {
      // Edit existing review
      setReviews((prev) =>
        prev.map((r) => (r.review_id === reviewData.review_id ? { ...r, ...reviewData } : r))
      );
    } else {
      // Add new review
      const newReview = {
        ...reviewData,
        review_id: reviews.length + 1, // Simple ID generation
        member_nickname: 'New User', // Placeholder for new user
        created_at: new Date().toISOString(),
      };
      setReviews((prev) => [newReview, ...prev]);
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

  const handleReportSubmit = (reportData) => {
    console.log('Report submitted:', reportData);
    // In a real application, you would send this to your API
    alert(`리뷰 ID ${reportData.review_id} 신고 접수 완료: ${reportData.reason}`);
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
              {festival.rating_avg ? festival.rating_avg.toFixed(1) : '0.0'}
            </span>
            <span className="text-sm text-gray-500 font-bold ml-1">/ 5.0</span>
          </div>
        </div>

        <div className="flex gap-2 bg-gray-100 p-1.5 rounded-full shadow-inner">
          {['최신순', '별점순'].map((type) => (
            <button
              key={type}
              onClick={() => setSortType(type)}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                sortType === type
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
            {currentReviews.map((review) => ( // Use currentReviews for mapping
              <div key={review.review_id} className="p-5 border border-gray-200 rounded-lg shadow-sm bg-white">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-lg text-gray-800">{review.member_nickname}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={18}
                          fill={review.rating > i ? '#FACC15' : 'none'}
                          className={review.rating > i ? 'text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                      <span className="ml-2 text-md text-gray-700 font-medium">{review.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {review.member_id === currentMemberId && (
                      <button
                        onClick={() => handleOpenReviewModal(review)}
                        className="flex items-center text-sm text-gray-600 hover:text-purple-700 transition-colors duration-200 p-1 rounded hover:bg-gray-100"
                      >
                        <Edit size={16} className="mr-1" />
                        수정
                      </button>
                    )}
                    <button
                      onClick={() => handleOpenReportModal(review.review_id)}
                      className="flex items-center text-sm text-red-500 hover:text-red-700 transition-colors duration-200 p-1 rounded hover:bg-red-50"
                    >
                      <Flag size={16} className="mr-1" />
                      신고
                    </button>
                  </div>
                </div>
                <p className="text-gray-700 text-base mb-3 leading-relaxed">{review.content}</p>
                {review.image_urls && review.image_urls.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {review.image_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url}
                        alt={`Review image ${index + 1}`}
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
            ))}
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
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                    currentPage === page
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
        onClick={() => handleOpenReviewModal()}
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
    </div>
  );
};

export default FestivalReviewTab;