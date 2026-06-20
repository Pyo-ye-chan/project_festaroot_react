import { create } from 'zustand';

const useRegionStore = create((set) => ({
    currentRegion: '서울', // 앱 전역에서 공유할 기본 선택 지역
    setCurrentRegion: (region) => set({ currentRegion: region }),
}));

export default useRegionStore;