import { create } from 'zustand';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultSettings = {
    businessName: "Advitha Food Products",
    heroTitle: "Premium Quality Food Products",
    heroSubtitle: "Fresh and authentic food products delivered right to your doorstep.",
    contactEmail: "support@advithafoods.com",
    contactPhone: "8688466966",
    address: "Ambati Vari Veedhi, Gopalapuram, Konaseema",
    whatsappNumber: "8688466966",
    instagramUrl: "https://instagram.com/advithafoods",
    upiId: "merchant@upi",
    deliveryEstimate: "2-3 Business Days",
    themePrimary: "#064e3b",
    themeSecondary: "#d4af37",
    seoDescription: "Premium food products from Advitha Food Products."
};

export const useSettingsStore = create((set) => ({
    settings: defaultSettings,
    loading: true,
    error: null,
    
    initSettingsListener: () => {
        const settingsRef = doc(db, 'settings', 'global');
        
        const unsubscribe = onSnapshot(settingsRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.businessName === "Advitha Milk Products") {
                    data.businessName = "Advitha Food Products";
                }
                set({ settings: { ...defaultSettings, ...data }, loading: false });
            } else {
                // If it doesn't exist, we might want to create it with defaults
                setDoc(settingsRef, defaultSettings).then(() => {
                    set({ settings: defaultSettings, loading: false });
                }).catch(err => {
                    console.error("Error creating default settings:", err);
                    set({ loading: false, error: err.message });
                });
            }
        }, (error) => {
            console.error("Error fetching settings:", error);
            set({ error: error.message, loading: false });
        });
        
        return unsubscribe;
    },

    updateSettings: async (newSettings) => {
        try {
            // Firestore throws an error if any field is undefined. Strip undefined fields.
            const sanitizedSettings = Object.fromEntries(
                Object.entries(newSettings).filter(([_, v]) => v !== undefined)
            );
            
            const settingsRef = doc(db, 'settings', 'global');
            await setDoc(settingsRef, sanitizedSettings, { merge: true });
        } catch (error) {
            console.error("Error updating settings:", error);
            set({ error: error.message });
            throw error;
        }
    }
}));
