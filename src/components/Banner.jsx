import React from 'react';
import { isLiveRazorpay } from '../config';
import { useSettingsStore } from '../store/settingsStore';

export default function Banner() {
  const { settings } = useSettingsStore();
  if (isLiveRazorpay) return null;

  return (
    <div className="bg-emerald-950 px-6 py-2 flex items-center justify-center text-gold-400 shadow-sm text-sm tracking-widest uppercase">
      <span>{settings.heroSubtitle || "Fresh from the farm to your doorstep"}</span>
    </div>
  );
}
