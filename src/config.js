// Environment and mode configuration

// Check if Razorpay is not just the dummy string and exists
export const isLiveRazorpay = !!import.meta.env.VITE_RAZORPAY_KEY_ID && import.meta.env.VITE_RAZORPAY_KEY_ID !== 'rzp_test_yourkeyidhere';

