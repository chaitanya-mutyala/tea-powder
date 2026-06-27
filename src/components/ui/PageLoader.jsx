import { Loader2 } from 'lucide-react';

export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4 px-4">
      <Loader2 className="w-8 h-8 text-emerald-700 animate-spin" aria-hidden="true" />
      <p className="text-sm font-medium text-emerald-900/60">{message}</p>
    </div>
  );
}
