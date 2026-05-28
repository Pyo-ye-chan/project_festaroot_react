import { create } from 'zustand';

const useAuthStore = create((set) => ({
  signupData: {
    member_id: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nickname: '',
    name: '',
    gender: '',
    birthdate: '',
    email: '',
    addr_sido: '',
    addr_sigungu: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeLocation: false,
    regions: [],
    themes: []
  },
  
  // 로그인 상태 관련
  isLoggedIn: false,
  authToken: null,
  user: null, // 로그인한 사용자 정보 (필요시 추가)

  setLoginState: (isLoggedIn, authToken, user) => set({ isLoggedIn, authToken, user }),
  
  setSignupData: (data) => set((state) => ({
    signupData: { ...state.signupData, ...data }
  })),
  
  resetSignupData: () => set({
    signupData: {
      member_id: '',
      password: '',
      confirmPassword: '',
      phone: '',
      nickname: '',
      name: '',
      gender: '',
      birthdate: '',
      email: '',
      addr_sido: '',
      addr_sigungu: '',
      agreeTerms: false,
      agreePrivacy: false,
      agreeLocation: false,
      regions: [],
      themes: []
    }
  })
}));

export default useAuthStore;
