import { create } from 'zustand';
import { db } from '../lib/firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

export const useAdminStore = create((set, get) => ({
  products: [],
  orders: [],
  productsLoaded: false,
  unsubscribeProducts: null,
  unsubscribeOrders: null,

  initListeners: () => {
    if (!db) return;

    const { unsubscribeProducts, unsubscribeOrders } = get();
    unsubscribeProducts?.();
    unsubscribeOrders?.();

    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ products: productsData, productsLoaded: true });
    });

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      set({ orders: ordersData });
    });

    set({ unsubscribeProducts: unsubProducts, unsubscribeOrders: unsubOrders });

    return () => {
      unsubProducts();
      unsubOrders();
    };
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
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      status: order.status || 'Pending Verification',
    });
    return docRef;
  },

  updateOrderStatus: async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status });
  }
}));
