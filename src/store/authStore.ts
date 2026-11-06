import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../types';
import { mockUsers } from '../services/mockData';

interface AuthState {
  user: User | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<void>;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: mockUsers.technician,
      role: 'technician',
      isAuthenticated: true, // initial authenticated for instant access / smooth demo

      login: async (email: string, role: UserRole = 'technician') => {
        const selectedUser = role === 'supervisor' ? mockUsers.supervisor : mockUsers.technician;
        set({
          user: { ...selectedUser, email },
          role,
          isAuthenticated: true,
        });
      },

      switchRole: (newRole: UserRole) => {
        const newUser = newRole === 'supervisor' ? mockUsers.supervisor : mockUsers.technician;
        set({
          role: newRole,
          user: newUser,
        });
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'workvoice-auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
