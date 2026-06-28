import { create } from 'zustand';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const defaultSettings = {
    businessName: "Advitha Milk Products",
    heroTitle: "Premium Quality Dairy Products",
    heroSubtitle: "Fresh and authentic dairy products delivered right to your doorstep.",
    contactEmail: "[EMAIL_ADDRESS]",
    contactPhone: "8688466996",
    address: "Ambati Vari Veedhi, Gopalapuram, Konaseema",
    whatsappNumber: "8688466996",
    instagramUrl: "",
    upiId: "",
    qrImageUrl: "",
    deliveryEstimate: "2-3 Business Days",
    seoDescription: "Premium dairy products from Advitha Milk Products. Farm fresh, delivered to your doorstep."
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
