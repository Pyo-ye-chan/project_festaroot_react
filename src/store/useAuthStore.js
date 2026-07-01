import { create } from 'zustand';

const ACCESS_TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';
const STORAGE_TYPE_KEY = 'authStorageType';

let logoutTimer = null;

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
 * 모든 인증 정보 삭제
 */
const clearAuthStorage = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(STORAGE_TYPE_KEY);

  sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

/**
 * 로그아웃 타이머 제거
 */
const clearLogoutTimer = () => {
  if (logoutTimer) {
    clearTimeout(logoutTimer);
    logoutTimer = null;
  }
};

/**
 * JWT payload 디코딩
 */
const decodeJwtPayload = (token) => {
  try {
    const payload = token.split('.')[1];

    if (!payload) {
      return null;
    }

    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );

    const jsonPayload = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map((char) => {
          return `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`;
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * JWT 만료 시간 가져오기
 * JWT exp는 초 단위이므로 ms로 변환
 */
const getTokenExpireTime = (token) => {
  const payload = decodeJwtPayload(token);

  if (!payload || !payload.exp) {
    return null;
  }

  return payload.exp * 1000;
};

/**
 * 토큰 만료 여부 확인
 */
const isTokenExpired = (token) => {
  if (!token) {
    return true;
  }

  const expireTime = getTokenExpireTime(token);

  // exp가 없는 토큰은 안전하게 만료 처리
  if (!expireTime) {
    return true;
  }

  return Date.now() >= expireTime;
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
 * 유효한 accessToken 가져오기
 */
const getValidStoredToken = () => {
  const storage = getCurrentStorage();
  const token = storage.getItem(ACCESS_TOKEN_KEY);

  if (!token || isTokenExpired(token)) {
    clearAuthStorage();
    return null;
  }

  return token;
};

/**
 * 토큰 만료 시간에 맞춰 자동 로그아웃 예약
 */
const scheduleAutoLogout = (token, logout) => {
  clearLogoutTimer();

  const expireTime = getTokenExpireTime(token);

  if (!expireTime) {
    logout();
    return;
  }

  const remainTime = expireTime - Date.now();

  if (remainTime <= 0) {
    logout();
    return;
  }

  logoutTimer = setTimeout(() => {
    logout();
  }, remainTime);
};

const initialToken = getValidStoredToken();
const initialUser = initialToken ? getStoredUser() : null;

const useAuthStore = create((set, get) => ({
  isLoggedIn: initialToken !== null,
  accessToken: initialToken,
  user: initialUser,

  /**
   * 앱 실행 또는 화면 복귀 시 인증 상태 확인
   */
  checkAuth: () => {
    const token = getValidStoredToken();

    if (!token) {
      get().logout();
      return false;
    }

    set({
      isLoggedIn: true,
      accessToken: token,
      user: getStoredUser(),
    });

    scheduleAutoLogout(token, get().logout);

    return true;
  },

  /**
   * 로그인
   * rememberMe true  : localStorage 저장
   * rememberMe false : sessionStorage 저장
   */
  login: (token, user, rememberMe = true) => {
    if (!token || isTokenExpired(token)) {
      clearAuthStorage();

      set({
        isLoggedIn: false,
        accessToken: null,
        user: null,
      });

      return;
    }

    const storage = rememberMe ? localStorage : sessionStorage;

    // 이전 로그인 정보 정리
    clearAuthStorage();

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
      accessToken: token,
      user: user || null,
    });

    scheduleAutoLogout(token, get().logout);
  },

  /**
   * user 정보 업데이트
   */
  updateUser: (userData) => {
    const token = getValidStoredToken();

    if (!token) {
      get().logout();
      return;
    }

    const storage = getCurrentStorage();
    const currentUser = getStoredUser() || {};
    const newUser = { ...currentUser, ...userData };

    storage.setItem(USER_KEY, JSON.stringify(newUser));

    set({
      user: newUser,
    });
  },

  /**
   * 로그아웃
   */
  logout: () => {
    clearLogoutTimer();
    clearAuthStorage();

    set({
      isLoggedIn: false,
      accessToken: null,
      user: null,
    });
  },
}));

// 새로고침 후에도 기존 토큰이 유효하면 자동 로그아웃 타이머 재등록
if (initialToken) {
  scheduleAutoLogout(initialToken, () => {
    useAuthStore.getState().logout();
  });
}

export default useAuthStore;