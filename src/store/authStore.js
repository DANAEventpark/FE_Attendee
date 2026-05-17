import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage-attendee', // must be unique across the same domain if sharing port, but different repos usually have different ports
    }
  )
);

export const useIsLoggedIn = () => useAuthStore((state) => !!state.token);
export const useIsAttendee = () =>
  useAuthStore((state) => state.user?.role_id === 1);
