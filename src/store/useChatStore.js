import { create } from 'zustand';

const useChatStore = create((set) => ({
  isFloating: false,
  activeChatId: null,
  setFloating: (isFloating) => set({ isFloating }),
  setActiveChatId: (activeChatId) => set({ activeChatId }),
  openFloatingChat: (chatId) => set({ isFloating: true, activeChatId: chatId }),
  closeFloatingChat: () => set({ isFloating: false }),
}));

export default useChatStore;
