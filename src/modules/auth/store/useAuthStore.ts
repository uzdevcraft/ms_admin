import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { IStore } from '../types';

const useAuthStore = create<IStore.State>()(
  devtools(
    set => ({
      user: null,
      error: null,
      accessToken: null,
      isAuthenticated: false,

      loginSuccess: () =>
        set({
          error: null,
          isAuthenticated: true
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          accessToken: null
        }),

      setAccessToken: accessToken => set({ accessToken })
    }),
    { name: 'auth-store' }
  )
);

export default useAuthStore;
