import { maxios } from "./axiosApi";

export const getFestivalDetail = async (contentId) => {
    const resonse = await maxios.get(`/api/festivals/detail/${contentId}`); // 축제 상세 정보 API 호출 
    return resonse.data;
};

export const getFestivalImages = async (contentId) => {
    const resonse = await maxios.get(`/api/festivals/images/${contentId}`); // 축제 이미지 API 호출
    return resonse.data;
};



// 후기 목록 조회
export const getReviews = async (contentId, sortType = '최신순') =>
    await maxios.get(`/review/${contentId}?sortType=${sortType}`);

// 후기 작성
export const addReview = async (reviewData, images = []) => {

    const formData = new FormData();

    formData.append(
        'review',
        new Blob(
            [JSON.stringify(reviewData)],
            { type: 'application/json' }
        )
    );

    images.forEach((image) => {
        formData.append('images', image);
    });

    return await maxios.post('/review', formData);
};

// 후기 수정
export const updateReview = async (reviewId, reviewData, newImages = [], existingImageUrlsToKeep = []) => {

    const formData = new FormData();

    formData.append(
        'review',
        new Blob(
            [JSON.stringify(reviewData)],
            { type: 'application/json' }
        )
    );

    newImages.forEach((image) => {
        formData.append('newImages', image);
    });

    existingImageUrlsToKeep.forEach((url) => {
        formData.append(
            'existingImageUrlsToKeep',
            url
        );
    });

    return await maxios.put(`/review/${reviewId}`, formData);
};

// 후기 삭제
export const deleteReview = async (reviewId) =>
    await maxios.delete(`/review/${reviewId}`);

// 후기 신고
export const reportReview = async (reviewId, reason) =>
    await maxios.post(`/review/${reviewId}/report`,{reason});