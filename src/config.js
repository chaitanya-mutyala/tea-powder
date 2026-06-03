// Environment and mode configuration

export const isLiveFirebase = !!import.meta.env.VITE_FIREBASE_API_KEY;

// Check if Razorpay is not just the dummy string and exists
export const isLiveRazorpay = !!import.meta.env.VITE_RAZORPAY_KEY_ID && import.meta.env.VITE_RAZORPAY_KEY_ID !== 'rzp_test_yourkeyidhere';

// This handles the fallback when Firebase is not configured
export const mockData = {
  products: [
    { id: '1', title: 'Premium Assam Tea Powder (Special Blend)', weight: '500g', price: 280, stock: 50, category: 'Tea', image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&q=80&w=800', description: 'Hand-picked Assam tea leaves for a strong and robust flavor.' },
    { id: '2', title: 'Artisanal Masala Chai Podi', weight: '250g', price: 180, stock: 30, category: 'Tea', image: 'https://images.unsplash.com/photo-1576092762791-dd9e22204045?auto=format&fit=crop&q=80&w=800', description: 'A perfectly balanced blend of spices for the ultimate masala chai experience.' },
    { id: '3', title: 'Pure Vedic A2 Desi Cow Ghee', weight: '500ml', price: 650, stock: 20, category: 'Dairy', image: 'https://images.unsplash.com/photo-1627997092196-8eb5562761eb?auto=format&fit=crop&q=80&w=800', description: 'Bilona churned A2 cow ghee, aromatic and highly nutritious.' },
    { id: '4', title: 'Fresh Thick Whole Buffalo Milk', weight: '500ml', price: 45, stock: 100, category: 'Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=800', description: 'Farm fresh, thick buffalo milk rich in cream.' },
    { id: '5', title: 'Traditional Ghee Kaju Katli', weight: '250g', price: 400, stock: 15, category: 'Sweets', image: 'https://images.unsplash.com/photo-1605197584547-c914eb4ff508?auto=format&fit=crop&q=80&w=800', description: 'Premium cashew fudge prepared with pure desi ghee.' },
  ],
  orders: []
};
