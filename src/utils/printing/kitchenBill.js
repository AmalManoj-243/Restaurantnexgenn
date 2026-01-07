// Build a simple kitchen bill text or ESC/POS payload from order info
// Keep it printer-agnostic; printerService will handle transport.

export const buildKitchenBillText = ({
  restaurant = 'My Restaurant',
  orderName = '',
  orderId = null,
  tableName = '',
  serverName = '',
  createdAt = new Date(),
  items = [], // [{ name, qty, note }]
  order_type = null,
}) => {
  const lines = [];
  const dt = new Date(createdAt);
  const stamp = `${dt.toLocaleDateString()} ${dt.toLocaleTimeString()}`;

  lines.push('*** KITCHEN ORDER ***');
  if (restaurant) lines.push(restaurant);
  lines.push(stamp);
  if (orderName || orderId) {
    const idPart = orderId ? ` (#${orderId})` : '';
    lines.push(`Order: ${orderName || ''}${idPart}`);
  }
  if (tableName) lines.push(`Table: ${tableName}`);
  if (order_type) lines.push(`Order Type: ${String(order_type).toUpperCase()}`);
  if (serverName) lines.push(`Server: ${serverName}`);
  lines.push('------------------------------');

  items.forEach((it) => {
    const qty = Number(it.qty ?? it.quantity ?? 1);
    const name = it.name || 'Item';
    lines.push(`${String(qty).padStart(2, ' ')}  x  ${name}`);
    if (it.note) lines.push(`   - ${it.note}`);
  });

  lines.push('------------------------------');
  lines.push('   SEND TO KITCHEN   ');
  lines.push('\n\n\n'); // feed

  return lines.join('\n');
};
