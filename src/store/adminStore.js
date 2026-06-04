import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useAdminStore = create((set) => ({
  products: [],
  orders: [],
  unsubscribeProducts: null,
  unsubscribeOrders: null,

  initListeners: () => {
    if (!db) return;

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ products: productsData });
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ orders: ordersData });
    });

    set({ unsubscribeProducts: unsubProducts, unsubscribeOrders: unsubOrders });
  },

  addProduct: async (product) => {
    await addDoc(collection(db, 'products'), product);
  },

  updateProduct: async (id, updates) => {
    await updateDoc(doc(db, 'products', id), updates);
  },

  deleteProduct: async (id) => {
    await deleteDoc(doc(db, 'products', id));
  },
  
  addOrder: async (order) => {
    await addDoc(collection(db, 'orders'), { ...order, status: 'Pending Payment' });
  },

  updateOrderStatus: async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
  }
}));
