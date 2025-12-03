import { create } from "zustand";

interface User {
  name: string;
  email: string;
}

interface UserState {
  user: User | null;
  isLoggedIn: boolean;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoggedIn: false,

  login: (user) =>
    set({
      user,
      isLoggedIn: true,
    }),

  logout: () =>
    set({
      user: null,
      isLoggedIn: false,
    }),

  updateUser: (user) =>
    set((state) => {
      if (!state.user) return state;
      return {
        ...state,
        user: {
          ...state.user,
          ...user,
        },
      };
    }),
}));
