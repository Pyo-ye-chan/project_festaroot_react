import { create } from 'zustand';

const useMemberStore = create((set) => ({
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

export default useMemberStore;
