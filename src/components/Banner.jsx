import React from 'react';
import { isLiveRazorpay } from '../config';
import { useSettingsStore } from '../store/settingsStore';
import { Truck } from 'lucide-react';

export default function Banner() {
  const { settings } = useSettingsStore();
  if (isLiveRazorpay) return null;

  return (
    <div className="bg-emerald-950 px-4 py-2.5 flex items-center justify-center gap-2.5 text-center">
      <Truck className="h-3.5 w-3.5 text-gold-400 shrink-0" />
      <span className="text-[11px] sm:text-xs font-medium tracking-[0.12em] text-cream-100 uppercase">
        {settings.seoDescription || settings.heroSubtitle || 'Farm-fresh dairy, delivered to your door'}
      </span>
    </div>
  );
}
