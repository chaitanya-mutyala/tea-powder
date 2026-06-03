import { create } from 'zustand';
import { isLiveFirebase, mockData } from '../config';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useAdminStore = create((set) => ({
  products: isLiveFirebase ? [] : mockData.products,
  orders: isLiveFirebase ? [] : mockData.orders,
  unsubscribeProducts: null,
  unsubscribeOrders: null,

  initListeners: () => {
    if (!isLiveFirebase || !db) return;

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
    if (!isLiveFirebase) {
      set((state) => ({ products: [...state.products, { ...product, id: Date.now().toString() }] }));
      return;
    }
    await addDoc(collection(db, 'products'), product);
  },

  updateProduct: async (id, updates) => {
    if (!isLiveFirebase) {
      set((state) => ({ products: state.products.map(p => p.id === id ? { ...p, ...updates } : p) }));
      return;
    }
    await updateDoc(doc(db, 'products', id), updates);
  },

  deleteProduct: async (id) => {
    if (!isLiveFirebase) {
      set((state) => ({ products: state.products.filter(p => p.id !== id) }));
      return;
    }
    await deleteDoc(doc(db, 'products', id));
  },
  
  addOrder: async (order) => {
    if (!isLiveFirebase) {
      set((state) => ({ orders: [...state.orders, { ...order, id: Date.now().toString(), status: 'Pending Payment' }] }));
      return;
    }
    await addDoc(collection(db, 'orders'), { ...order, status: 'Pending Payment' });
  },

  updateOrderStatus: async (id, status) => {
    if (!isLiveFirebase) {
      set((state) => ({ orders: state.orders.map(o => o.id === id ? { ...o, status } : o) }));
      return;
    }
    await updateDoc(doc(db, 'orders', id), { status });
  }
}));
