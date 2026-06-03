import { create } from 'zustand';
import { isLiveFirebase } from '../config';
import { db, auth } from '../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const getLocalCart = () => {
  const saved = localStorage.getItem('ambati_guest_cart');
  return saved ? JSON.parse(saved) : [];
};

const persistCart = async (items) => {
  if (isLiveFirebase && auth?.currentUser) {
    await setDoc(doc(db, 'carts', auth.currentUser.uid), { items });
  } else {
    localStorage.setItem('ambati_guest_cart', JSON.stringify(items));
  }
};

export const useCartStore = create((set, get) => ({
  items: getLocalCart(),

  addToCart: async (product, quantity = 1) => {
    const existing = get().items.find(i => i.id === product.id);
    let newItems;
    if (existing) {
      newItems = get().items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
    } else {
      newItems = [...get().items, { ...product, quantity }];
    }
    set({ items: newItems });
    await persistCart(newItems);
  },

  updateQuantity: async (id, amount) => {
    const newItems = get().items.map(i => {
      if (i.id === id) {
        const newQ = i.quantity + amount;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    });
    set({ items: newItems });
    await persistCart(newItems);
  },

  removeFromCart: async (id) => {
    const newItems = get().items.filter(i => i.id !== id);
    set({ items: newItems });
    await persistCart(newItems);
  },

  clearCart: async () => {
    set({ items: [] });
    await persistCart([]);
  },

  mergeCartOnLogin: async (userUid) => {
    if (!isLiveFirebase) return;

    const localItems = getLocalCart();
    try {
      const cartRef = doc(db, 'carts', userUid);
      const cartSnap = await getDoc(cartRef);
      
      let mergedItems = [];
      if (cartSnap.exists()) {
        const remoteItems = cartSnap.data().items || [];
        mergedItems = [...remoteItems];
        localItems.forEach(localItem => {
          const existing = mergedItems.find(i => i.id === localItem.id);
          if (existing) {
             existing.quantity += localItem.quantity;
          } else {
             mergedItems.push(localItem);
          }
        });
      } else {
        mergedItems = localItems;
      }

      set({ items: mergedItems });
      await setDoc(cartRef, { items: mergedItems });
      localStorage.removeItem('ambati_guest_cart');
    } catch (error) {
      console.error("Failed to merge cart:", error);
    }
  }
}));
