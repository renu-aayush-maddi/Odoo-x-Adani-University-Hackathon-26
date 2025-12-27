import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // Stores user object { id, name, email, user_type }
      isAuthenticated: false,

      login: (userData) => set({ user: userData, isAuthenticated: true }),
      
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage', // Key in localStorage
    }
  )
);