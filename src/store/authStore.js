import { create } from 'zustand';
import { auth } from '../lib/firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useCartStore } from './cartStore';
import { useWishlistStore } from './wishlistStore';

const ADMIN_EMAIL = 'chaitanyamutyala456@gmail.com';

export const useAuthStore = create((set) => ({
  user: null,
  role: 'guest', // 'guest' | 'customer' | 'admin'
  isAuthenticated: false,
  authLoading: true, // true until Firebase resolves initial state

  initAuthListener: () => {
    if (!auth) {
      set({ authLoading: false });
      return;
    }
    onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const role = firebaseUser.email === ADMIN_EMAIL ? 'admin' : 'customer';
        set({
          user: { email: firebaseUser.email, uid: firebaseUser.uid, displayName: firebaseUser.displayName },
          role,
          isAuthenticated: true,
          authLoading: false,
        });
        useCartStore.getState().mergeCartOnLogin(firebaseUser.uid);
        useWishlistStore.getState().fetchWishlist();
      } else {
        set({ user: null, role: 'guest', isAuthenticated: false, authLoading: false });
        useWishlistStore.getState().fetchWishlist(); // clears wishlist
      }
    });
  },

  login: async (email, password) => {
    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
    }
  },

  signup: async (email, password) => {
    if (auth) {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      // Set a display name from the email prefix
      const name = email.split('@')[0];
      await updateProfile(credential.user, { displayName: name });
      return credential;
    }
  },

  logout: async () => {
    if (auth) {
      await signOut(auth);
    }
  },

  // Helper used in Login page to decide redirect
  ADMIN_EMAIL,
}));
