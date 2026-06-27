import { create } from 'zustand';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from './authStore';

export const useWishlistStore = create((set, get) => ({
    items: [],
    loading: false,

    fetchWishlist: async () => {
        const user = useAuthStore.getState().user;
        if (!user) {
            set({ items: [] });
            return;
        }

        set({ loading: true });
        try {
            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
                const data = userSnap.data();
                set({ items: data.wishlist || [] });
            } else {
                await setDoc(userRef, { wishlist: [], email: user.email }, { merge: true });
                set({ items: [] });
            }
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        } finally {
            set({ loading: false });
        }
    },

    toggleWishlist: async (productId) => {
        const user = useAuthStore.getState().user;
        if (!user) return false;

        const currentItems = get().items;
        const isWished = currentItems.includes(productId);
        const userRef = doc(db, 'users', user.uid);
        
        try {
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, { wishlist: [], email: user.email }, { merge: true });
            }

            if (isWished) {
                await updateDoc(userRef, { wishlist: arrayRemove(productId) });
                set({ items: currentItems.filter(id => id !== productId) });
            } else {
                await updateDoc(userRef, { wishlist: arrayUnion(productId) });
                set({ items: [...currentItems, productId] });
            }
            return true;
        } catch (error) {
            console.error("Error updating wishlist:", error);
            return false;
        }
    },
    
    isInWishlist: (productId) => {
        return get().items.includes(productId);
    }
}));
