import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';

dotenv.config();

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const mockProducts = [
    { title: 'Premium Assam Tea Powder (Special Blend)', weight: '500g', price: 280, stock: 50, category: 'Tea', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800', description: 'Hand-picked Assam tea leaves for a strong and robust flavor.' },
    { title: 'Artisanal Masala Chai Podi', weight: '250g', price: 180, stock: 30, category: 'Tea', image: 'https://images.unsplash.com/photo-1576092762791-dd9e22204045?auto=format&fit=crop&q=80&w=800', description: 'A perfectly balanced blend of spices for the ultimate masala chai experience.' },
    { title: 'Pure Vedic A2 Desi Cow Ghee', weight: '500ml', price: 650, stock: 20, category: 'Dairy', image: 'https://images.unsplash.com/photo-1627997092196-8eb5562761eb?auto=format&fit=crop&q=80&w=800', description: 'Bilona churned A2 cow ghee, aromatic and highly nutritious.' },
    { title: 'Fresh Thick Whole Buffalo Milk', weight: '500ml', price: 45, stock: 100, category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800', description: 'Farm fresh, thick buffalo milk rich in cream.' },
    { title: 'Traditional Ghee Kaju Katli', weight: '250g', price: 400, stock: 15, category: 'Sweets', image: 'https://images.unsplash.com/photo-1605197584547-c914eb4ff508?auto=format&fit=crop&q=80&w=800', description: 'Premium cashew fudge prepared with pure desi ghee.' },
];

async function seed() {
  try {
    try {
      await createUserWithEmailAndPassword(auth, 'chaitanyamutyala456@gmail.com', 'password123');
      console.log("Admin user created.");
    } catch (e) {
      console.log("User creation message:", e.message);
      await signInWithEmailAndPassword(auth, 'chaitanyamutyala456@gmail.com', 'password123');
      console.log("Admin logged in.");
    }

    const prodSnapshot = await getDocs(collection(db, 'products'));
    if (prodSnapshot.empty) {
        console.log("Seeding products...");
        for (const p of mockProducts) {
            await addDoc(collection(db, 'products'), p);
        }
        console.log("Products seeded!");
    } else {
        console.log("Products already exist, skipping seed.");
    }
    process.exit(0);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  }
}

seed();
