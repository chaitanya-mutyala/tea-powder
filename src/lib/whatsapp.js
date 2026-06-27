export function buildWhatsAppOrderUrl(phoneNumber, { orderId, customerName, total, items = [] }) {
  const digits = String(phoneNumber || '').replace(/\D/g, '');
  if (!digits) return null;

  const itemLines = items
    .map((item) => `• ${item.title} × ${item.quantity}`)
    .join('\n');

  const message = [
    `Hi, I just placed an order.`,
    orderId ? `Order ID: ${orderId.slice(-8).toUpperCase()}` : null,
    customerName ? `Name: ${customerName}` : null,
    itemLines || null,
    total != null ? `Total: ₹${total}` : null,
    `Payment screenshot uploaded. Please verify.`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
