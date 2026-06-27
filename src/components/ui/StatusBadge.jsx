import { getOrderStatusStyles } from '../../lib/orderStatus';

export default function StatusBadge({ status, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide border whitespace-nowrap ${getOrderStatusStyles(status)} ${className}`}
    >
      {status}
    </span>
  );
}
