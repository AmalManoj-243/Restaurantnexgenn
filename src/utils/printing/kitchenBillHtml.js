// src/utils/printing/kitchenBillHtml.js
// Helper to build HTML for kitchen bill (full or add-ons)

export function buildKitchenBillHtml({
  restaurant = 'My Restaurant',
  orderName = '',
  orderId = '',
  tableName = '',
  serverName = '',
  items = [],
  mode = 'full', // 'full' or 'addons'
  order_type = null,
}) {
  const now = new Date();
  const dateStr = now.toLocaleString();
  // 80mm paper ≈ 600px at 203dpi, use monospace for best alignment
  return `
    <html>
      <head>
        <meta name="viewport" content="width=600" />
        <style>
          body { font-family: monospace; width: 600px; margin: 0 auto; font-size: 18px; }
          h2 { text-align: center; margin: 8px 0; }
          .section { margin: 8px 0; }
          .divider { border-bottom: 1px dashed #888; margin: 8px 0; }
          ul { padding-left: 0; list-style: none; }
          li { margin-bottom: 4px; }
          .footer { margin-top: 16px; font-size: 14px; color: #888; text-align: center; }
        </style>
      </head>
      <body>
        <h2>${restaurant}</h2>
        <div class="section">Order: <b>${orderName || orderId}</b></div>
        ${tableName ? `<div class="section">Table: <b>${tableName}</b></div>` : ''}
        ${order_type ? `<div class="section">Order Type: <b>${String(order_type).toUpperCase()}</b></div>` : ''}
        ${serverName ? `<div class="section">Server: <b>${serverName}</b></div>` : ''}
        <div class="divider"></div>
        <div class="section"><b>${mode === 'addons' ? 'Add-ons' : 'Items'}:</b></div>
        <ul>
          ${items.map(it => `<li>${it.qty} x ${it.name}${it.note ? ` <span style='color:#888;'>(${it.note})</span>` : ''}</li>`).join('')}
        </ul>
        <div class="footer">${dateStr}</div>
      </body>
    </html>
  `;
}
