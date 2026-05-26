import { create } from 'zustand';

const useAuthStore = create((set) => ({
  signupData: {
    id: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    nickname: '',
    name: '',
    gender: '',
    birthdate: '',
    email: '',
    city: '',
    district: '',
    agreeTerms: false,
    agreePrivacy: false,
    agreeLocation: false
  },
  
  setSignupData: (data) => set((state) => ({
    signupData: { ...state.signupData, ...data }
  })),
  
  resetSignupData: () => set({
    signupData: {
      id: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      nickname: '',
      name: '',
      gender: '',
      birthdate: '',
      email: '',
      city: '',
      district: '',
      agreeTerms: false,
      agreePrivacy: false,
      agreeLocation: false
    }
  })
}));

export default useAuthStore;
