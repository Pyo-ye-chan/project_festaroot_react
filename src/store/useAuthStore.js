import { create } from 'zustand';

const getStoredUser = () => {
  const storedUser = localStorage.getItem('user');

  if (!storedUser || storedUser === 'undefined' || storedUser === 'null') {
    localStorage.removeItem('user');
    return null;
  }

  try {
    return JSON.parse(storedUser);
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

const useAuthStore = create((set) => ({
  isLoggedIn: localStorage.getItem('accessToken') !== null,
  user: getStoredUser(),

  login: (token, user) => {
    localStorage.setItem('accessToken', token);

    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }

    set({
      isLoggedIn: true,
      user: user || null,
    });
  },

  updateUser: (userData) => {
    const currentUser = getStoredUser();
    const newUser = { ...currentUser, ...userData };
    localStorage.setItem('user', JSON.stringify(newUser));
    set({ user: newUser });
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