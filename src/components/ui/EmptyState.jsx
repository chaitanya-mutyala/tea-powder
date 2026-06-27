export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4 sm:py-16">
      {Icon && (
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-center mb-5">
          <Icon className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-900/40" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-serif font-bold text-emerald-950 mb-2">{title}</h3>
      {description && (
        <p className="text-sm sm:text-base text-emerald-900/60 max-w-sm mb-6 leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
