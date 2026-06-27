export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price ?? 0);
}

export function formatDate(dateString, options = { dateStyle: 'medium', timeStyle: 'short' }) {
  if (!dateString) return 'Unknown date';
  try {
    return new Intl.DateTimeFormat('en-IN', options).format(new Date(dateString));
  } catch {
    return String(dateString);
  }
}

export function formatReviewDate(createdAt) {
  if (!createdAt) return '';
  const date = typeof createdAt.toDate === 'function'
    ? createdAt.toDate()
    : createdAt instanceof Date
      ? createdAt
      : new Date(createdAt);
  return date.toLocaleDateString('en-IN', { dateStyle: 'medium' });
}

export function getReviewTimestamp(review) {
  if (!review?.createdAt) return 0;
  const { createdAt } = review;
  if (typeof createdAt.toDate === 'function') return createdAt.toDate().getTime();
  if (createdAt instanceof Date) return createdAt.getTime();
  return new Date(createdAt).getTime();
}
