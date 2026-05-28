import { create } from 'zustand';

const useAuthStore = create((set) => ({
 
  
  // // 로그인 상태 관련
  // isLoggedIn: false,
  // authToken: null,
  // user: null, // 로그인한 사용자 정보 (필요시 추가)


  // setLoginState: (isLoggedIn, authToken, user) => set({ isLoggedIn, authToken, user }),
  
  isLoggedIn: localStorage.getItem('accessToken') !== null,
  user: JSON.parse(localStorage.getItem('user')) || null,

  login: (token, user) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(user));

    set({
      isLoggedIn: true,
      user: user,
    });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');

    set({
      isLoggedIn: false,
      user: null,
    });
  },
  

}));

export default useAuthStore;
