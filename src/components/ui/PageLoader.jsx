export default function PageLoader({ message = 'Loading...' }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-5 px-4">
      {/* Three-dot pulse loader */}
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-emerald-700"
            style={{ animation: `dot-pulse 1.4s ease-in-out ${i * 0.16}s infinite` }}
          />
        ))}
      </div>
      <p className="text-sm font-medium text-stone-500 tracking-wide">{message}</p>
    </div>
  );
}
