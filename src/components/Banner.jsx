import React from 'react';
import { isLiveFirebase, isLiveRazorpay } from '../config';

export default function Banner() {
  if (isLiveFirebase && isLiveRazorpay) return null;

  return (
    <div className="bg-amber-500 text-amber-950 px-4 py-2 text-center text-sm font-medium z-50 relative shadow-sm">
      {!isLiveFirebase && !isLiveRazorpay && "Running in Full Mock Mode: Local State Active Without Backend Dependencies"}
      {isLiveFirebase && !isLiveRazorpay && "Running with Live Database & Mocked Payments (Razorpay Disabled)"}
    </div>
  );
}
