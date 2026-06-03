import { create } from 'zustand';
import { isLiveFirebase } from '../config';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { useCartStore } from './cartStore';

export const useAuthStore = create((set) => ({
  user: null,
  role: 'guest', // 'guest', 'customer', 'admin'
  isAuthenticated: false,

  initAuthListener: () => {
    if (isLiveFirebase && auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const role = user.email === 'chaitanyamutyala456@gmail.com' ? 'admin' : 'customer';
          set({ user: { email: user.email, uid: user.uid }, role, isAuthenticated: true });
          useCartStore.getState().mergeCartOnLogin(user.uid);
        } else {
          set({ user: null, role: 'guest', isAuthenticated: false });
        }
      });
    }
  },

  login: async (email, password) => {
    if (!isLiveFirebase) {
      const role = email === 'chaitanyamutyala456@gmail.com' ? 'admin' : 'customer';
      set({ user: { email }, role, isAuthenticated: true });
      return;
    }
    
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
      // state will be updated by listener
    }
  },

  signup: async (email, password) => {
    if (!isLiveFirebase) {
      set({ user: { email }, role: 'customer', isAuthenticated: true });
      return;
    }
    
    if (auth) {
      await createUserWithEmailAndPassword(auth, email, password);
      // state will be updated by listener
    }
  },
  
  logout: async () => {
    if (!isLiveFirebase) {
      set({ user: null, role: 'guest', isAuthenticated: false });
      return;
    }

    if (auth) {
      await signOut(auth);
    }
  }
}));
