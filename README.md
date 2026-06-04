# Ambati Vari Tea Podi

An elegant, fully-featured e-commerce platform built for selling premium tea powders and authentic dairy products. The application features a stunning modern UI, seamless guest checkout, and a powerful Admin Dashboard for managing live orders.

## 🚀 Live Demo & Deployment
This project is configured for seamless deployment on **Vercel**. 
**Live Link:** [https://tea-powder-eight.vercel.app/](https://tea-powder-eight.vercel.app/)

*Note: To ensure the live database and authentication work on Vercel, you must add your Firebase Environment Variables in the Vercel Dashboard.*

## ✨ Features

### Customer Experience
- **Responsive Modern UI**: Beautifully crafted with Tailwind CSS, featuring subtle animations, glassmorphism effects, and mobile-first design.
- **Guest Checkout**: Customers can easily browse products, manage their shopping cart, and complete orders without needing an account.
- **Mocked Payments**: Features a Razorpay integration structure (currently running in Mock Mode for testing).
- **Persistent Cart**: Shopping carts are securely saved using Firebase for authenticated users, and localStorage for guests.

### Admin Dashboard
- **Secure Authentication**: Only authorized admin accounts can access the dashboard.
- **Live Order Management**: View incoming orders in real-time. Expand orders to view complete customer shipping details and itemized receipts.
- **Order Status Tracking**: Easily update orders from "Pending" to "Shipped" or "Delivered".
- **Product Management**: Interface for adding, updating, or removing products from the catalog.

## 🛠️ Technology Stack
- **Frontend Framework**: React + Vite
- **Styling**: Tailwind CSS & Lucide React (Icons)
- **State Management**: Zustand (Global Store)
- **Backend Services**: Firebase (Authentication & Firestore Database)
- **Routing**: React Router DOM

## 📦 Local Development Setup

1. **Clone the repository**
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**:
   Create a `.env` file in the root directory and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id
   VITE_FIREBASE_APP_ID=your_app_id
   
   # Optional: Razorpay Key
   VITE_RAZORPAY_KEY_ID=rzp_test_yourkeyidhere
   ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```

## 🔒 Firebase Security Rules
Ensure your Firestore rules are configured correctly to allow public reading of products, public creation of carts/orders, and restricted admin access. See `backend_setup_guide.md` for the exact security rules used in this project.
