import { create } from 'zustand';

const useFestivalLikeStore = create((set) => ({
  likedFestivals: new Set(), // 찜한 축제 ID들을 담을 전역 Set

  // 찜하기 토글 액션 (복사본 만들어서 상태 업데이트)
  toggleLike: (content_id) => set((state) => {
    const nextSet = new Set(state.likedFestivals);
    if (nextSet.has(content_id)) {
      nextSet.delete(content_id); // 이미 있으면 제거
    } else {
      nextSet.add(content_id); // 없으면 추가
    }
    return { likedFestivals: nextSet };
  }),

  // 로그인/마이페이지에서 서버 데이터를 받아와 초기화할 때 쓸 함수
  setInitialLikes: (idArray) => set({ likedFestivals: new Set(idArray) })
}));

export default useFestivalLikeStore;