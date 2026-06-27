import { create } from 'zustand';
import { auth } from '../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword } from 'firebase/auth';
import { useCartStore } from './cartStore';
import { useWishlistStore } from './wishlistStore';

export const useAuthStore = create((set) => ({
  user: null,
  role: 'guest', // 'guest', 'customer', 'admin'
  isAuthenticated: false,

  initAuthListener: () => {
    if (auth) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const role = user.email === 'chaitanyamutyala456@gmail.com' ? 'admin' : 'customer';
          set({ user: { email: user.email, uid: user.uid }, role, isAuthenticated: true });
          useCartStore.getState().mergeCartOnLogin(user.uid);
          useWishlistStore.getState().fetchWishlist();
        } else {
          set({ user: null, role: 'guest', isAuthenticated: false });
          useWishlistStore.getState().fetchWishlist(); // will clear it
        }
      });
    }
  },

  login: async (email, password) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
    }
  },

  signup: async (email, password) => {
    if (auth) {
      await createUserWithEmailAndPassword(auth, email, password);
    }
  },
  
  logout: async () => {
    if (auth) {
      await signOut(auth);
    }
  }
}));
