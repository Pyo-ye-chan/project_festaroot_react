import { create } from 'zustand';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const STORAGE_TYPE_KEY = 'authStorageType';

/**
 * 저장된 storage 타입에 따라 localStorage/sessionStorage 선택
 */
const getCurrentStorage = () => {
  const storageType = localStorage.getItem(STORAGE_TYPE_KEY);

  if (storageType === 'session') {
    return sessionStorage;
  }

  return localStorage;
};

/**
 * user 정보 안전하게 가져오기
 */
const getStoredUser = () => {
  const storage = getCurrentStorage();
  const storedUser = storage.getItem(USER_KEY);

  if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
    storage.removeItem(USER_KEY);
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    storage.removeItem(USER_KEY);
    return null;
  }
};

/**
 * accessToken 가져오기
 */
const getStoredToken = () => {
  const storage = getCurrentStorage();
  return storage.getItem(ACCESS_TOKEN_KEY);
};

const useAuthStore = create((set) => ({
  isLoggedIn: getStoredToken() !== null,
  user: getStoredUser(),

  /**
   * 로그인
   * rememberMe true  : localStorage 저장
   * rememberMe false : sessionStorage 저장
   */
  login: (token, user, rememberMe = true) => {
    const storage = rememberMe ? localStorage : sessionStorage;

    // 이전 로그인 정보 정리
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    // 어떤 저장소를 썼는지 기록
    localStorage.setItem(STORAGE_TYPE_KEY, rememberMe ? 'local' : 'session');

    storage.setItem(ACCESS_TOKEN_KEY, token);

    if (user) {
      storage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      storage.removeItem(USER_KEY);
    }

    set({
      isLoggedIn: true,
      user: user || null,
    });
  },

  /**
   * 로그아웃
   */
  logout: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(STORAGE_TYPE_KEY);

    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);

    set({
      isLoggedIn: false,
      user: null,
    });
  },
}));

export default useAuthStore;