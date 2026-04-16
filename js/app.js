/* ══════════════════════════════════════════
   MAYLA BAKERY — Lógica principal
   Archivo: js/app.js
   ══════════════════════════════════════════ */

/* ── CATÁLOGO DE PRODUCTOS ── */
const products = [
  { id: 1, name: "Brownie Tradicional",        desc: "Chocolate cordillera al 58%, textura esponjosa perfecta", price: 9000,  emoji: "🍫", tag: "Más vendido", cat: "clasico"  },
  { id: 2, name: "Brownie de Milo",              desc: "Explosión de Milo melcochudo en cada mordisco",         price: 9500,  emoji: "🍮", tag: "Favorito",    cat: "clasico" },
  { id: 3, name: "Brownie Oreo (Blondies)",   desc: "Chunks de Oreo dentro y encima. Texturas increíbles",     price: 9000,  emoji: "🍪", tag: null,           cat: "clasico" },
  //{ id: 4, name: "Brownie de Nueces",         desc: "Nueces tostadas y chocolate amargo en equilibrio",        price: 8500,  emoji: "🥜", tag: null,           cat: "especial"  },
  //{ id: 5, name: "Brownie Vegano",            desc: "Sin huevo ni lácteos. Igual de delicioso, en serio",      price: 9500,  emoji: "🌱", tag: "Vegano",       cat: "vegano"   },
  { id: 6, name: "Brownie Red Velvet",        desc: "Masa roja, queso crema y chocolate blanco",               price: 10000, emoji: "❤️", tag: "Especial",     cat: "especial" },
  //{ id: 7, name: "Brownie Sin Gluten",        desc: "Para celíacos o quienes cuidan su alimentación",          price: 10500, emoji: "🌾", tag: "Sin gluten",   cat: "vegano"   },
  { id: 8, name: "Caja x6 Mixta",            desc: "Tu elección de 6 brownies variados con caja regalo",       price: 48000, emoji: "🎁", tag: "Regalo ideal", cat: "especial" },
];

/* ── ESTADO global ── */
let cart = [];

/* ══════════════════════════════════
   PRODUCTOS
   ══════════════════════════════════ */

/**
 * Renderiza las tarjetas según el filtro activo
 * @param {string} filter - 'all' | 'clasico' | 'especial' | 'vegano'
 */
function renderProducts(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  const filtered = filter === 'all' ? products : products.filter(p => p.cat === filter);

  grid.innerHTML = filtered.map(p => `
    <div class="product-card" data-cat="${p.cat}">
      <div class="product-img">
        ${p.tag ? `<div class="product-tag">${p.tag}</div>` : ''}
        ${p.emoji}
      </div>
      <div class="product-body">
        <div class="product-name">${p.name}</div>
        <p class="product-desc">${p.desc}</p>
        <div class="product-footer">
          <div class="product-price">
            $${p.price.toLocaleString('es-CO')} <small>/ und</small>
          </div>
          <button class="add-btn" id="addBtn${p.id}" onclick="addToCart(${p.id})" title="Agregar al pedido">+</button>
        </div>
      </div>
    </div>
  `).join('');
}

/**
 * Cambia el filtro activo y re-renderiza productos
 * @param {string} cat  - categoría a filtrar
 * @param {HTMLElement} btn - botón clickeado
 */
function filterProducts(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderProducts(cat);
}

/* ══════════════════════════════════
   CARRITO
   ══════════════════════════════════ */

/**
 * Agrega un producto al carrito (o incrementa su cantidad)
 * @param {number} id - ID del producto
 */
function addToCart(id) {
  const product  = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  updateCart();
  showToast(`${product.emoji} ${product.name} agregado`);

  // Feedback visual en el botón
  const btn = document.getElementById('addBtn' + id);
  if (btn) {
    btn.classList.add('added');
    btn.textContent = '✓';
    setTimeout(() => {
      btn.classList.remove('added');
      btn.textContent = '+';
    }, 1200);
  }
}

/**
 * Elimina un producto del carrito
 * @param {number} id
 */
function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  updateCart();
}

/**
 * Actualiza todos los elementos del DOM relacionados al carrito
 */
function updateCart() {
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  document.getElementById('cartCount').textContent = count;

  // ── Drawer lateral ──
  const cartItemsEl  = document.getElementById('cartItems');
  const cartTotalBar = document.getElementById('cartTotalBar');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty">Aún no has agregado nada.<br>¡Elige tus brownies favoritos! 🍫</div>';
    cartTotalBar.style.display = 'none';
  } else {
    cartItemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="cart-item-icon">${i.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${i.name} <strong>x${i.qty}</strong></div>
          <div class="cart-item-price">$${(i.price * i.qty).toLocaleString('es-CO')}</div>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${i.id})">×</button>
      </div>
    `).join('');
    document.getElementById('cartTotal').textContent = '$' + total.toLocaleString('es-CO');
    cartTotalBar.style.display = 'block';
  }

  // ── Resumen en sección de pedido ──
  const summaryItemsEl = document.getElementById('summaryItems');
  const summaryTotalEl = document.getElementById('summaryTotal');

  if (cart.length === 0) {
    summaryItemsEl.innerHTML = '<div class="summary-empty">Tu carrito está vacío.<br>Agrega productos desde el menú.</div>';
  } else {
    summaryItemsEl.innerHTML = cart.map(i => `
      <div class="summary-item">
        <span class="summary-item-name">${i.emoji} ${i.name} ×${i.qty}</span>
        <span class="summary-item-price">$${(i.price * i.qty).toLocaleString('es-CO')}</span>
      </div>
    `).join('');
  }
  summaryTotalEl.textContent = '$' + total.toLocaleString('es-CO');
}

/* ── Toggle del drawer ── */
function toggleCart() {
  document.getElementById('cartDrawer').classList.toggle('open');
  document.getElementById('cartOverlay').classList.toggle('open');
}

/* ══════════════════════════════════
   PEDIDO Y WHATSAPP
   ══════════════════════════════════ */

/**
 * Valida el carrito y genera el pedido
 */
function submitOrder() {
  if (cart.length === 0) {
    showToast('⚠️ Agrega productos primero');
    return;
  }
  showToast('✓ ¡Pedido recibido! Te contactaremos pronto 🎉');
  sendWhatsApp();
}

/**
 * Genera mensaje de WhatsApp con el resumen del pedido
 */
function sendWhatsApp() {
  if (cart.length === 0) {
    showToast('⚠️ Agrega productos al carrito');
    return;
  }

  const items = cart
    .map(i => `• ${i.name} x${i.qty} = $${(i.price * i.qty).toLocaleString('es-CO')}`)
    .join('\n');
  const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const message = encodeURIComponent(
    `¡Hola Mayla Bakery! 🍫 Quiero hacer un pedido:\n\n${items}\n\n*Total: $${total.toLocaleString('es-CO')}*\n\n¿Me confirmas disponibilidad? ¡Gracias!`
  );

  // 👉 Reemplaza con el número real de Mayla (formato: 57XXXXXXXXXX)
  const phoneNumber = '573006619230';
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
}

/* ══════════════════════════════════
   UTILIDADES
   ══════════════════════════════════ */

/**
 * Muestra un toast de notificación
 * @param {string} msg
 */
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

/* ── INICIO ── */
document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
