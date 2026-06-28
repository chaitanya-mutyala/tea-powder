export const ORDER_STATUSES = [
  'Pending Payment',
  'Pending Verification',
  'Paid / Processing',
  'Packed',
  'Shipped',
  'Delivered',
  'Cancelled',
];

export function getOrderStatusStyles(status) {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    case 'Shipped':
      return 'bg-sky-50 text-sky-800 border-sky-200';
    case 'Packed':
      return 'bg-indigo-50 text-indigo-800 border-indigo-200';
    case 'Paid / Processing':
      return 'bg-amber-50 text-amber-800 border-amber-200';
    case 'Cancelled':
      return 'bg-rose-50 text-rose-800 border-rose-200';
    case 'Pending Verification':
      return 'bg-orange-50 text-orange-800 border-orange-200';
    case 'Pending Payment':
      return 'bg-stone-100 text-stone-700 border-stone-200';
    default:
      return 'bg-stone-100 text-stone-700 border-stone-200';
  }
}
