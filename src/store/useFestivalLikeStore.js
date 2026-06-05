import { create } from 'zustand';

const useFestivalLikeStore = create((set) => ({
  likedFestivals: new Set(),

  toggleLike: (content_id) => set((state) => {
    const targetId = Number(content_id);
    const nextSet = new Set(state.likedFestivals);
    if (nextSet.has(targetId)) {
      nextSet.delete(targetId);
    } else {
      nextSet.add(targetId);
    }
    return { likedFestivals: nextSet };
  }),

  // idArray가 배열이 아니면 빈 배열([])을 사용하여 Set 생성
  setInitialLikes: (idArray) => set({ 
    likedFestivals: new Set(Array.isArray(idArray) ? idArray : []) 
  })
}));

export default useFestivalLikeStore;