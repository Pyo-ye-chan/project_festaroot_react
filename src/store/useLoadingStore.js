import { create } from 'zustand';

const useLoadingStore = create(set => ({
    isLoading: false, // // 기본값은 로딩 중이 아님(false)

    startLoading: () => set({ isLoading: true }),

    stopLoading: () => set({ isLoading: false })
}));

export default useLoadingStore;