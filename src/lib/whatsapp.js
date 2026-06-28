export function buildWhatsAppOrderUrl(phoneNumber, { orderId, customerName, total, items = [] }) {
  const digits = String(phoneNumber || '').replace(/\D/g, '');
  if (!digits) return null;

  const formattedTotal = typeof total === 'number'
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(total)
    : `Rs.${total}`;

  const itemLines = items
    .map((item) => `  \u2022 ${item.title} x${item.quantity} = ${new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(item.price * item.quantity)}`)
    .join('\n');

  const message = [
    `Hi, I just placed an order on Advitha Milk Products.`,
    orderId ? `Order ID: #${String(orderId).slice(-8).toUpperCase()}` : null,
    customerName ? `Name: ${customerName}` : null,
    itemLines ? `\nItems:\n${itemLines}` : null,
    `\nOrder Total: ${formattedTotal}`,
    `Payment screenshot uploaded. Kindly verify and confirm my order.`,
  ]
    .filter(Boolean)
    .join('\n');

  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
