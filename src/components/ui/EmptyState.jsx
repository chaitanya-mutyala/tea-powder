export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 sm:py-20 px-6 animate-fade-up">
      {Icon && (
        <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-cream-100 border border-cream-200 flex items-center justify-center mb-6 shadow-sm">
          <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-stone-400" strokeWidth={1.5} />
        </div>
      )}
      <h3 className="text-lg sm:text-xl font-serif font-semibold text-emerald-950 mb-2.5">{title}</h3>
      {description && (
        <p className="text-sm text-stone-500 max-w-xs mb-7 leading-relaxed">{description}</p>
      )}
      {action}
    </div>
  );
}
